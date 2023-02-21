from django.db import models
from django.contrib.auth.models import User, AbstractUser


class Analyst(models.Model):
    analyst_id = models.AutoField(primary_key=True)
    first_name = models.CharField(max_length=100)
    second_name = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'analyst'
