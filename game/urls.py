from django.urls import path, include
from .views import main_page, start_game_page, citizen_json, detail_citizen, inspector_json, performer_citizen,\
                    game_page, create_psp_team, get_ins_perf_from_ids, criminal_citizen, create_task_force, end_game_page, \
                    delete_analyst, psb_ins_list, psb_perf_list, detail_ins, detail_perf, detail_criminal

urlpatterns = [
    path('main/', main_page, name='main'),
    path('start_game/', start_game_page, name='start_game_page'),
    path('citizen-json/', citizen_json, name='citizen_json'),
    path('detail-citizen/', detail_citizen, name='detail-citizen'),
    path('inspector-list/', inspector_json, name='inspector_json'),
    path('performer-list/', performer_citizen, name='performer-citizen-json'),
    path('game/', game_page, name='game-page'),
    path('create-psb/', create_psp_team, name='create-psb-team'),
    path('get-psb-ids/', get_ins_perf_from_ids, name='get=psb-ids'),
    path('criminal-citizen-list/', criminal_citizen, name='criminal-citizen-list'),
    path('create-task-force/', create_task_force, name='create-task-force'),
    path('end-game-page/', end_game_page, name='end-game-page'),
    path('delete-analyst/', delete_analyst, name='delete-analyst'),
    path('psb-ins-list/', psb_ins_list, name='psb-ins-list'),
    path('psb-perf-list/', psb_perf_list, name='psb-perf-list'),
    path('detail-ins/', detail_ins, name='detail-ins'),
    path('detail-perf/', detail_perf, name='detail-perf'),
    path('detail-criminal/', detail_criminal, name='detail-criminal')
]
