from django.db import models
from django.contrib.auth.models import User
from analyst.models import Analyst

from django.contrib.postgres.fields import ArrayField


class Location(models.Model):
    location_id = models.AutoField(primary_key=True)
    longitude = models.FloatField(blank=True, null=True)
    latitude = models.FloatField(blank=True, null=True)
    fk_analyst = models.ForeignKey(Analyst, models.CASCADE)

    class Meta:
        managed = False
        db_table = 'location'


class Citizen(models.Model):
    citizen_id = models.AutoField(primary_key=True)
    fk_analyst = models.ForeignKey(Analyst, models.CASCADE)
    first_name = models.CharField(max_length=100, blank=True, null=True)
    second_name = models.CharField(max_length=100, blank=True, null=True)
    intelligence = models.SmallIntegerField()

    def get_data(self):
        return {
            'citizen_id': self.citizen_id,
            'fk_analyst_id': self.fk_analyst.pk,
            'first_name': self.first_name,
            'second_name': self.second_name,
            'intelligence': self.intelligence
        }

    class Meta:
        managed = False
        db_table = 'citizen'


class Criminal(models.Model):
    criminal_id = models.AutoField(primary_key=True)
    fk_citizen = models.OneToOneField(Citizen, models.CASCADE, blank=True, null=True)
    fk_location = models.OneToOneField(Location, models.CASCADE)
    weapons = models.TextField()  # This field type is a guess.
    hostages = models.SmallIntegerField()
    number_of_crimes = models.SmallIntegerField()
    threat_coefficient = models.SmallIntegerField()

    class Meta:
        managed = False
        db_table = 'criminal'


class PsychoPassport(models.Model):
    series = models.IntegerField()
    number = models.IntegerField()
    fk_citizen = models.OneToOneField(Citizen, models.CASCADE, blank=True, null=True)
    crime_rate = models.SmallIntegerField()
    psycho_passport_id = models.AutoField(primary_key=True)

    class Meta:
        managed = False
        db_table = 'psycho_passport'
        unique_together = (('series', 'number'),)


class Inspector(models.Model):
    inspector_id = models.AutoField(primary_key=True)
    fk_citizen = models.OneToOneField(Citizen, models.CASCADE, blank=True, null=True)
    successful_detentions = models.SmallIntegerField(blank=True, null=True)
    factor_of_utility = models.SmallIntegerField()
    authority = models.SmallIntegerField()

    def get_data(self):
        return {
            'inspector_id': self.inspector_id,
            'fk_citizen': self.fk_citizen,
            'successful_detentions': self.successful_detentions,
            'factor_of_utility': self.factor_of_utility,
            'authority': self.authority
        }

    class Meta:
        managed = False
        db_table = 'inspector'


class Performer(models.Model):
    performer_id = models.AutoField(primary_key=True)
    fk_citizen = models.OneToOneField(Citizen, models.CASCADE, blank=True, null=True)
    successful_detentions = models.SmallIntegerField(blank=True, null=True)
    factor_of_utility = models.SmallIntegerField()
    authority = models.SmallIntegerField()

    def get_data(self):
        return {
            'performer_id': self.performer_id,
            'fk_citizen': self.fk_citizen,
            'successful_detentions': self.successful_detentions,
            'factor_of_utility': self.factor_of_utility,
            'authority': self.authority
        }

    class Meta:
        managed = False
        db_table = 'performer'


class TaskForce(models.Model):
    task_force_id = models.AutoField(primary_key=True)
    success_rate = models.SmallIntegerField()
    inspector_ids = ArrayField(models.IntegerField())  # This field type is a guess.
    performer_ids = ArrayField(models.IntegerField())   # This field type is a guess.
    fk_criminal = models.ForeignKey(Criminal, models.CASCADE, blank=True, null=True)
    fk_analyst = models.ForeignKey(Analyst, models.CASCADE, blank=True, null=True)

    def get_data(self):
        return {
            'task_force_id': self.task_force_id,
            'success_rate': self.success_rate,
            'inspector_ids': self.inspector_ids,
            'performer_ids': self.performer_ids,
            'fk_criminal_id': self.fk_criminal.criminal_id,
            'fk_analyst_id': self.fk_analyst.analyst_id
        }

    class Meta:
        managed = False
        db_table = 'task_force'


class Psb(models.Model):
    psb_id = models.AutoField(primary_key=True)
    ins_ids = ArrayField(models.IntegerField())  # This field type is a guess.
    perf_ids = ArrayField(models.IntegerField())  # This field type is a guess.
    fk_analyst = models.ForeignKey(Analyst, models.CASCADE, blank=True, null=True)

    def get_data(self):
        return {
            'psb_id': self.psb_id,
            'ins_ids': self.ins_ids,
            'perf_ids': self.perf_ids,
            'fk_analyst_id': self.fk_analyst
        }

    def get_ins_citizens(self):
        ins = Inspector.objects.filter(inspector_id=self.ins_ids)
        citizen_ids = []
        for i in ins:
            citizen_ids.append(i.fk_citizen)
        ins_citizens = Citizen.objects.filter(citizen_id=citizen_ids)
        return ins_citizens

    def get_perf_citizens(self):
        ins = Performer.objects.filter(performer_id=self.perf_ids)
        citizen_ids = []
        for i in ins:
            citizen_ids.append(i.fk_citizen)
        ins_citizens = Citizen.objects.filter(citizen_id=citizen_ids)
        return ins_citizens

    class Meta:
        managed = False
        db_table = 'psb'
