from django.db import models
from residents.models import Citizen, Criminal
from analyst.models import Analyst


# Create your models here.
class Inspector(models.Model):
    inspector_id = models.AutoField(primary_key=True)
    fk_citizen = models.OneToOneField(Citizen, models.CASCADE, blank=True, null=True)
    successful_detentions = models.SmallIntegerField(blank=True, null=True)
    factor_of_utility = models.SmallIntegerField()
    authority = models.SmallIntegerField()

    class Meta:
        managed = False
        db_table = 'inspector'


class Performer(models.Model):
    performer_id = models.AutoField(primary_key=True)
    fk_citizen = models.OneToOneField(Citizen, models.CASCADE, blank=True, null=True)
    successful_detentions = models.SmallIntegerField(blank=True, null=True)
    factor_of_utility = models.SmallIntegerField()
    authority = models.SmallIntegerField()

    class Meta:
        managed = False
        db_table = 'performer'


class TaskForce(models.Model):
    task_force_id = models.AutoField(primary_key=True)
    fk_performers_ids = models.ForeignKey(Performer, models.CASCADE, db_column='fk_performers_ids')
    fk_inspector = models.ForeignKey(Inspector, models.CASCADE)
    fk_criminal = models.ForeignKey(Criminal, models.CASCADE, blank=True, null=True)
    success_rate = models.SmallIntegerField()

    class Meta:
        managed = False
        db_table = 'task_force'

