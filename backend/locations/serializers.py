from rest_framework import serializers
from .models import Province, Division, District, Tehsil, Area


class AreaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Area
        fields = ["id", "name", "tehsil"]


class TehsilSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tehsil
        fields = ["id", "name", "district"]


class DistrictSerializer(serializers.ModelSerializer):
    class Meta:
        model = District
        fields = ["id", "name", "division"]


class DivisionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Division
        fields = ["id", "name", "province"]


class ProvinceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Province
        fields = ["id", "name"]
