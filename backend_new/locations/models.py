from django.db import models


class Province(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name


class Division(models.Model):
    province = models.ForeignKey(Province, on_delete=models.CASCADE, related_name="divisions")
    name = models.CharField(max_length=100)

    class Meta:
        unique_together = ("province", "name")
        ordering = ["name"]

    def __str__(self):
        return self.name


class District(models.Model):
    division = models.ForeignKey(Division, on_delete=models.CASCADE, related_name="districts")
    name = models.CharField(max_length=100)

    class Meta:
        unique_together = ("division", "name")
        ordering = ["name"]

    def __str__(self):
        return self.name


class Tehsil(models.Model):
    district = models.ForeignKey(District, on_delete=models.CASCADE, related_name="tehsils")
    name = models.CharField(max_length=100)

    class Meta:
        unique_together = ("district", "name")
        ordering = ["name"]

    def __str__(self):
        return self.name


class Area(models.Model):
    tehsil = models.ForeignKey(Tehsil, on_delete=models.CASCADE, related_name="areas")
    name = models.CharField(max_length=100)

    class Meta:
        unique_together = ("tehsil", "name")
        ordering = ["name"]

    def __str__(self):
        return self.name
