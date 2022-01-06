from django.db import models

FREQUENCY_CHOICES = (
    ("monthly", "monthly"),
    ("annually", "annually"),
)


# Create your models here.
class Plan(models.Model):
    plan_name = models.CharField(max_length=150, blank=False, null=False)
    max_number_invites = models.IntegerField(blank=False, null=False)
    storage_size = models.IntegerField(blank=False, null=False)
    price = models.FloatField(blank=False, null=False)
    frequency = models.CharField(max_length=150, choices=FREQUENCY_CHOICES, blank=False, null=False, default="monthly")

    def __str__(self):
        return self.plan_name
