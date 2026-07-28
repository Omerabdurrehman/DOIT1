from django.utils import timezone
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Assignment
from .serializers import AssignmentSerializer
from complaints.models import ComplaintTimeline, ComplaintStatus
from notifications.models import Notification


class IsAdminOrManager(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role in ("admin", "manager"))


class AssignmentViewSet(viewsets.ModelViewSet):
    """
    Admin assigns a complaint to a Manager; Manager assigns it onward to a Worker.
    Workers can only view/update their own assignments (e.g. mark completed, add remarks).
    """
    queryset = Assignment.objects.select_related("complaint", "manager", "worker")
    serializer_class = AssignmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        qs = super().get_queryset()
        if user.role == "worker":
            return qs.filter(worker=user)
        if user.role == "manager":
            return qs.filter(manager=user)
        return qs

    def get_permissions(self):
        if self.action in ("create", "update", "partial_update", "destroy"):
            return [permissions.IsAuthenticated(), IsAdminOrManager()]
        return super().get_permissions()

    def perform_create(self, serializer):
        assignment = serializer.save()
        complaint = assignment.complaint
        complaint.status = ComplaintStatus.ASSIGNED
        complaint.save()
        ComplaintTimeline.objects.create(complaint=complaint, event="assigned", actor=self.request.user)
        if assignment.worker:
            Notification.objects.create(
                user=assignment.worker,
                title="New Task Assigned",
                message=f"You have been assigned complaint {complaint.complaint_number}.",
            )

    @action(detail=True, methods=["post"], url_path="mark-completed")
    def mark_completed(self, request, pk=None):
        """Field worker marks the assigned task as completed with remarks."""
        assignment = self.get_object()
        if request.user.role == "worker" and assignment.worker_id != request.user.id:
            return Response({"detail": "Not your assignment."}, status=status.HTTP_403_FORBIDDEN)

        assignment.worker_remarks = request.data.get("remarks", assignment.worker_remarks)
        assignment.completed_at = timezone.now()
        assignment.save()

        complaint = assignment.complaint
        complaint.status = ComplaintStatus.RESOLVED
        complaint.save()
        ComplaintTimeline.objects.create(
            complaint=complaint, event="work_completed",
            note=assignment.worker_remarks, actor=request.user,
        )
        return Response(AssignmentSerializer(assignment).data)
