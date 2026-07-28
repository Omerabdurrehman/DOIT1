from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter

from .models import Complaint, ComplaintTimeline, Comment, Feedback, ComplaintStatus
from .serializers import (
    ComplaintListSerializer, ComplaintDetailSerializer, ComplaintCreateSerializer,
    ComplaintStatusUpdateSerializer, CommentSerializer, FeedbackSerializer, ComplaintImageSerializer,
)
from .permissions import IsOwnerOrStaff
from notifications.models import Notification

STATUS_TO_EVENT = {
    ComplaintStatus.ACKNOWLEDGED: "acknowledged",
    ComplaintStatus.ASSIGNED: "assigned",
    ComplaintStatus.IN_PROGRESS: "work_started",
    ComplaintStatus.RESOLVED: "work_completed",
    ComplaintStatus.WAITING_VERIFICATION: "reviewed",
    ComplaintStatus.CLOSED: "verified",
    ComplaintStatus.REOPENED: "reopened",
    ComplaintStatus.REJECTED: "rejected",
}


class ComplaintViewSet(viewsets.ModelViewSet):
    queryset = Complaint.objects.all().select_related("user")
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrStaff]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ["status", "district", "area", "division"]
    search_fields = ["complaint_number", "subject", "user__full_name", "district", "area"]
    ordering_fields = ["created_at", "updated_at", "status"]

    def get_serializer_class(self):
        if self.action == "create":
            return ComplaintCreateSerializer
        if self.action == "list":
            return ComplaintListSerializer
        return ComplaintDetailSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        user = self.request.user
        if user.role == "citizen":
            return qs.filter(user=user)
        if user.role == "worker":
            return qs.filter(assignment__worker=user)
        if user.role == "manager":
            return qs.filter(assignment__manager=user)
        return qs  # admin sees all

    @action(detail=True, methods=["post"], url_path="update-status")
    def update_status(self, request, pk=None):
        """Admin/Manager/Worker transition a complaint's status; logs a timeline entry
        and notifies the citizen (spec: notifications on every status change)."""
        complaint = self.get_object()
        if request.user.role == "citizen":
            return Response({"detail": "Citizens cannot change complaint status directly. Use verify/reopen."},
                             status=status.HTTP_403_FORBIDDEN)
        serializer = ComplaintStatusUpdateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        new_status = serializer.validated_data["status"]
        note = serializer.validated_data.get("note", "")

        complaint.status = new_status
        complaint.save()

        ComplaintTimeline.objects.create(
            complaint=complaint,
            event=STATUS_TO_EVENT.get(new_status, "reviewed"),
            note=note,
            actor=request.user,
        )
        Notification.objects.create(
            user=complaint.user,
            title=f"Complaint {complaint.complaint_number} Updated",
            message=f"Your complaint status is now: {complaint.get_status_display()}.",
        )
        return Response(ComplaintDetailSerializer(complaint).data)

    @action(detail=True, methods=["post"], url_path="verify")
    def verify(self, request, pk=None):
        """Citizen verifies a resolved complaint -> Closed."""
        complaint = self.get_object()
        if complaint.user_id != request.user.id:
            return Response({"detail": "Only the complaint owner can verify."}, status=status.HTTP_403_FORBIDDEN)
        if complaint.status != ComplaintStatus.WAITING_VERIFICATION:
            return Response({"detail": "Complaint is not awaiting verification."}, status=status.HTTP_400_BAD_REQUEST)

        complaint.status = ComplaintStatus.CLOSED
        complaint.save()
        ComplaintTimeline.objects.create(complaint=complaint, event="verified", actor=request.user)
        ComplaintTimeline.objects.create(complaint=complaint, event="closed", actor=request.user)
        return Response(ComplaintDetailSerializer(complaint).data)

    @action(detail=True, methods=["post"], url_path="reopen")
    def reopen(self, request, pk=None):
        """Citizen rejects the resolution -> Reopened."""
        complaint = self.get_object()
        if complaint.user_id != request.user.id:
            return Response({"detail": "Only the complaint owner can reopen."}, status=status.HTTP_403_FORBIDDEN)
        if complaint.status != ComplaintStatus.WAITING_VERIFICATION:
            return Response({"detail": "Complaint is not awaiting verification."}, status=status.HTTP_400_BAD_REQUEST)

        reason = request.data.get("reason", "")
        complaint.status = ComplaintStatus.REOPENED
        complaint.save()
        ComplaintTimeline.objects.create(complaint=complaint, event="reopened", note=reason, actor=request.user)
        return Response(ComplaintDetailSerializer(complaint).data)

    @action(detail=True, methods=["post"], url_path="upload-image")
    def upload_image(self, request, pk=None):
        complaint = self.get_object()
        serializer = ComplaintImageSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(complaint=complaint, uploaded_by=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=["post"], url_path="comment")
    def add_comment(self, request, pk=None):
        complaint = self.get_object()
        serializer = CommentSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(complaint=complaint, author=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=["post"], url_path="feedback")
    def add_feedback(self, request, pk=None):
        complaint = self.get_object()
        if complaint.status != ComplaintStatus.CLOSED:
            return Response({"detail": "Feedback can only be given after a complaint is closed."},
                             status=status.HTTP_400_BAD_REQUEST)
        serializer = FeedbackSerializer(data={**request.data, "complaint": complaint.id})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
