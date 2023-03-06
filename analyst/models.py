from django.db import models
from django.contrib.auth.models import User, AbstractUser


class Analyst(models.Model):
    analyst_id = models.AutoField(primary_key=True)
    fk_user = models.OneToOneField(User, on_delete=models.CASCADE)
    rank = models.TextField()

    class Meta:
        managed = False
        db_table = 'analyst'
