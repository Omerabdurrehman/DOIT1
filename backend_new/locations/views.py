from rest_framework import viewsets, permissions
from django_filters.rest_framework import DjangoFilterBackend

from .models import Province, Division, District, Tehsil, Area
from .serializers import (
    ProvinceSerializer, DivisionSerializer, DistrictSerializer,
    TehsilSerializer, AreaSerializer,
)


class ReadOnlyOrAdmin(permissions.BasePermission):
    """Anyone (even anonymous, for registration/complaint forms) can read;
    only Admins can write, so the hierarchy stays centrally managed."""

    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return bool(request.user and request.user.is_authenticated and request.user.role == "admin")


class ProvinceViewSet(viewsets.ModelViewSet):
    queryset = Province.objects.all()
    serializer_class = ProvinceSerializer
    permission_classes = [ReadOnlyOrAdmin]


class DivisionViewSet(viewsets.ModelViewSet):
    queryset = Division.objects.all()
    serializer_class = DivisionSerializer
    permission_classes = [ReadOnlyOrAdmin]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["province"]


class DistrictViewSet(viewsets.ModelViewSet):
    queryset = District.objects.all()
    serializer_class = DistrictSerializer
    permission_classes = [ReadOnlyOrAdmin]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["division"]


class TehsilViewSet(viewsets.ModelViewSet):
    queryset = Tehsil.objects.all()
    serializer_class = TehsilSerializer
    permission_classes = [ReadOnlyOrAdmin]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["district"]


class AreaViewSet(viewsets.ModelViewSet):
    queryset = Area.objects.all()
    serializer_class = AreaSerializer
    permission_classes = [ReadOnlyOrAdmin]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["tehsil"]
