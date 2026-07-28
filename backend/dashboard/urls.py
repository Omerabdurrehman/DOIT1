from django.urls import path
from . import views

urlpatterns = [
    path("citizen/", views.CitizenDashboardView.as_view(), name="citizen-dashboard"),
    path("admin/", views.AdminDashboardView.as_view(), name="admin-dashboard"),
    path("manager/", views.ManagerDashboardView.as_view(), name="manager-dashboard"),
    path("worker/", views.WorkerDashboardView.as_view(), name="worker-dashboard"),
    path("analytics/", views.AnalyticsView.as_view(), name="analytics"),
]
