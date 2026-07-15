from django.db.models import Count, Avg, F, DurationField, ExpressionWrapper
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions

from complaints.models import Complaint, ComplaintStatus
from notifications.models import Notification


class CitizenDashboardView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        qs = Complaint.objects.filter(user=request.user)
        return Response({
            "total_complaints": qs.count(),
            "pending_complaints": qs.filter(status=ComplaintStatus.PENDING).count(),
            "resolved_complaints": qs.filter(status__in=[ComplaintStatus.RESOLVED, ComplaintStatus.CLOSED]).count(),
            "reopened_complaints": qs.filter(status=ComplaintStatus.REOPENED).count(),
            "recent_notifications": list(
                Notification.objects.filter(user=request.user).values(
                    "id", "title", "message", "is_read", "created_at"
                )[:5]
            ),
        })


class AdminDashboardView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        qs = Complaint.objects.all()
        by_district = qs.values("district").annotate(count=Count("id")).order_by("-count")
        by_status = qs.values("status").annotate(count=Count("id")).order_by("-count")
        by_team = qs.values("assignment__manager__full_name").annotate(count=Count("id")).order_by("-count")

        resolved = qs.filter(status=ComplaintStatus.CLOSED).exclude(updated_at=None)
        avg_resolution = resolved.annotate(
            resolution_time=ExpressionWrapper(F("updated_at") - F("created_at"), output_field=DurationField())
        ).aggregate(avg=Avg("resolution_time"))["avg"]

        return Response({
            "total_complaints": qs.count(),
            "new_complaints": qs.filter(status=ComplaintStatus.PENDING).count(),
            "complaints_by_district": list(by_district),
            "complaints_by_status": list(by_status),
            "complaints_by_team": list(by_team),
            "average_resolution_time_seconds": avg_resolution.total_seconds() if avg_resolution else None,
        })


class ManagerDashboardView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        qs = Complaint.objects.filter(assignment__manager=request.user)
        return Response({
            "assigned_complaints": qs.count(),
            "in_progress_complaints": qs.filter(status=ComplaintStatus.IN_PROGRESS).count(),
            "completed_complaints": qs.filter(status__in=[ComplaintStatus.RESOLVED, ComplaintStatus.CLOSED]).count(),
        })


class WorkerDashboardView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        qs = Complaint.objects.filter(assignment__worker=request.user)
        return Response({
            "assigned_tasks": qs.count(),
            "completed_tasks": qs.filter(status__in=[ComplaintStatus.RESOLVED, ComplaintStatus.CLOSED]).count(),
            "pending_tasks": qs.filter(status__in=[ComplaintStatus.ASSIGNED, ComplaintStatus.IN_PROGRESS]).count(),
        })


class AnalyticsView(APIView):
    """Backs the Analytics Dashboard charts (Admin-facing)."""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        qs = Complaint.objects.all()
        return Response({
            "complaints_per_district": list(qs.values("district").annotate(count=Count("id"))),
            "complaints_per_tehsil": list(qs.values("tehsil").annotate(count=Count("id"))),
            "monthly_complaints": list(
                qs.values("created_at__year", "created_at__month").annotate(count=Count("id"))
                .order_by("created_at__year", "created_at__month")
            ),
            "complaint_status_distribution": list(qs.values("status").annotate(count=Count("id"))),
        })
