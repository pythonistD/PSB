import json

from django.shortcuts import render
from .models import Citizen, Inspector, Performer, Psb, Criminal, TaskForce, Location
from analyst.models import Analyst
from django.views.generic import ListView, DetailView, CreateView
from django.http import JsonResponse
from django.db import connection

import folium


def main_page(request):
    return render(request, 'game/main.html', {})


def start_game_page(request):
    with connection.cursor() as cursor:
        cursor.callproc('fill_game_data', [request.user.pk, ])
    return render(request, 'game/start_game.html', {})


def citizen_json(request):
    analyst_c = Analyst.objects.filter(fk_user_id=request.user.pk)[0]
    citizen = Citizen.objects.filter(fk_analyst_id=analyst_c.analyst_id)
    citizen_l = [i.get_data() for i in citizen]
    print(citizen_l)
    return JsonResponse(data={'data': citizen_l})


def detail_citizen(request):
    req_json = json.loads(request.body)
    citizen_id = int(req_json['citizen_id'])
    citizen = Citizen.objects.filter(citizen_id=citizen_id)
    return JsonResponse(data=citizen[0].get_data())


def get_citizen_for_per_ins(user_id, ins_or_per):
    analyst_c = Analyst.objects.filter(fk_user_id=user_id)[0]
    citizens = Citizen.objects.filter(fk_analyst_id=analyst_c.analyst_id)
    obj = ins_or_per.objects.all()
    obj_fk_citizen_ids = {i.fk_citizen_id for i in obj}
    citizen_l = [c.get_data() for c in citizens if c.pk in obj_fk_citizen_ids]
    return JsonResponse(data={'data': citizen_l})


def inspector_json(request):
    return get_citizen_for_per_ins(user_id=request.user.pk, ins_or_per=Inspector)


def performer_citizen(request):
    return get_citizen_for_per_ins(user_id=request.user.pk, ins_or_per=Performer)


# def create_map(user_id):
#     m = folium.Map(location=[59.932974, 30.352274], zoom_start=12)
#     anal = Analyst.objects.filter(fk_user_id=user_id)[0]
#     locs = Location.objects.filter(fk_analyst_id=anal.analyst_id)
#     for loc in locs:
#         folium.Marker([loc.longitude, loc.latitude], popup='criminal').add_to(m)
#     return m


def game_page(request):
    m = folium.Map(location=[59.932974, 30.352274], zoom_start=12)
    anal = Analyst.objects.filter(fk_user_id=request.user.pk)[0]
    locs = Location.objects.filter(fk_analyst_id=anal.analyst_id)
    for loc in locs:
        folium.Marker([loc.longitude, loc.latitude], popup='criminal').add_to(m)
    context = {'map': m._repr_html_()}
    return render(request, 'game/game.html', context)


def create_psp_team(request):
    req_json = json.loads(request.body)
    ins_ids = [int(i) for i in req_json['ins_ids']]
    perf_ids = [int(i) for i in req_json['perf_ids']]
    analyst_c = Analyst.objects.filter(fk_user_id=request.user.pk)[0]
    psb = Psb(ins_ids=ins_ids, perf_ids=perf_ids, fk_analyst=analyst_c)
    psb.save()
    return JsonResponse(data={'status': 'ok'})


def get_ins_perf_from_ids(request):
    pass


def criminal_citizen(request):
    return get_citizen_for_per_ins(user_id=request.user.pk, ins_or_per=Criminal)


def calc_success_rate(l, psb_model):
    obj_l = psb_model.objects.filter(fk_citizen_id__in=l)
    utility = 0
    for i in obj_l:
        utility += i.factor_of_utility
    return utility


def mission_result(success_rate, threat_coef):
    if success_rate > threat_coef:
        return 'psb-win'
    else:
        return 'criminal-win'


def create_task_force(request):
    req_json = json.loads(request.body)
    ins_ids = [int(i) for i in req_json['ins_ids']]
    perf_ids = [int(i) for i in req_json['perf_ids']]
    criminal_id_c = int(req_json['criminal_id'])
    analyst_c = Analyst.objects.filter(fk_user_id=request.user.pk)[0]
    criminal = Criminal.objects.filter(fk_citizen_id=criminal_id_c)[0]
    citizen_criminal = Citizen.objects.filter(citizen_id=criminal_id_c)[0]
    succes_rate = calc_success_rate(ins_ids, Inspector) + calc_success_rate(perf_ids, Performer)

    task_force = TaskForce(success_rate=succes_rate, inspector_ids=ins_ids, performer_ids=perf_ids,
                           fk_criminal=criminal, fk_analyst=analyst_c)
    task_force.save()

    resp = task_force.get_data()
    resp['mission_result'] = mission_result(success_rate=succes_rate, threat_coef=criminal.threat_coefficient)
    resp['criminal_name'] = f'{citizen_criminal.first_name} {citizen_criminal.second_name}'
    resp['hostages'] = criminal.hostages
    resp['criminal_weapon'] = criminal.weapons
    resp['criminal_citizen_id'] = criminal.fk_citizen.citizen_id
    loc_id = criminal.fk_location.location_id
    Location.objects.get(location_id=loc_id).delete()
    criminal.delete()
    return JsonResponse(data=resp)


def end_game_page(request):
    return render(request, 'game/end_game.html')


def delete_analyst(request):
    analyst_ins = Analyst.objects.get(fk_user_id=request.user.pk)
    resp = {}
    if analyst_ins:
        analyst_ins.delete()
        resp['status'] = 'ok'
    else:
        resp['error'] = 'Игра уже завершилась! Начните новую игру'
    return JsonResponse(data=resp)


def psb_ins_list(request):
    anal = Analyst.objects.get(fk_user_id=request.user.pk)
    psb = Psb.objects.get(fk_analyst_id=anal.pk)
    ins = Inspector.objects.filter(fk_citizen_id__in=psb.ins_ids)
    ins_c = Citizen.objects.filter(citizen_id__in=psb.ins_ids)
    resp = [i.get_data() for i in ins_c]
    return JsonResponse(data={'data': resp})


def psb_perf_list(request):
    anal = Analyst.objects.get(fk_user_id=request.user.pk)
    psb = Psb.objects.get(fk_analyst_id=anal.pk)
    perf = Performer.objects.filter(fk_citizen_id__in=psb.perf_ids)
    perf_c = Citizen.objects.filter(citizen_id__in=psb.perf_ids)
    resp = [i.get_data() for i in perf_c]
    return JsonResponse(data={'data': resp})


def detail_ins(request):
    req_json = json.loads(request.body)
    c = Citizen.objects.get(citizen_id=req_json['citizen_id'])
    ins = Inspector.objects.get(fk_citizen_id=req_json['citizen_id'])
    return JsonResponse(data={'citizen_id': c.citizen_id,
                              'first_name': c.first_name,
                              'second_name': c.second_name,
                              'factor_of_utility': ins.factor_of_utility})


def detail_perf(request):
    req_json = json.loads(request.body)
    c = Citizen.objects.get(citizen_id=req_json['citizen_id'])
    perf = Performer.objects.get(fk_citizen_id=req_json['citizen_id'])
    return JsonResponse(data={'citizen_id': c.citizen_id,
                              'first_name': c.first_name,
                              'second_name': c.second_name,
                              'factor_of_utility': perf.factor_of_utility})


def detail_criminal(request):
    req_json = json.loads(request.body)
    c = Citizen.objects.get(citizen_id=req_json['citizen_id'])
    crim = Criminal.objects.get(fk_citizen_id=req_json['citizen_id'])
    return JsonResponse(data={'citizen_id': c.citizen_id,
                              'first_name': c.first_name,
                              'second_name': c.second_name,
                              'threat_coefficient': crim.threat_coefficient})