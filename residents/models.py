from django.db import models
from analyst.models import Analyst


# Create your models here.
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
    series = models.IntegerField(primary_key=True)
    number = models.IntegerField()
    fk_citizen = models.OneToOneField(Citizen, models.CASCADE, blank=True, null=True)
    crime_rate = models.SmallIntegerField()

    class Meta:
        managed = False
        db_table = 'psycho_passport'
        unique_together = (('series', 'number'),)
