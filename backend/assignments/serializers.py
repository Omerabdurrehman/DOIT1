from rest_framework import serializers
from .models import Assignment


class AssignmentSerializer(serializers.ModelSerializer):
    complaint_number = serializers.CharField(source="complaint.complaint_number", read_only=True)
    manager_name = serializers.CharField(source="manager.full_name", read_only=True)
    worker_name = serializers.CharField(source="worker.full_name", read_only=True)

    class Meta:
        model = Assignment
        fields = [
            "id", "complaint", "complaint_number", "manager", "manager_name",
            "worker", "worker_name", "assigned_at", "completed_at", "worker_remarks",
        ]
        read_only_fields = ["assigned_at"]
