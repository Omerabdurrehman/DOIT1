from rest_framework import serializers
from .models import Complaint, ComplaintImage, ComplaintTimeline, Comment, Feedback, ComplaintStatus


class ComplaintImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ComplaintImage
        fields = ["id", "image", "image_type", "uploaded_by", "uploaded_at"]
        read_only_fields = ["uploaded_by", "uploaded_at"]


class ComplaintTimelineSerializer(serializers.ModelSerializer):
    actor_name = serializers.CharField(source="actor.full_name", read_only=True)

    class Meta:
        model = ComplaintTimeline
        fields = ["id", "event", "note", "actor", "actor_name", "created_at"]
        read_only_fields = ["actor", "created_at"]


class CommentSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source="author.full_name", read_only=True)

    class Meta:
        model = Comment
        fields = ["id", "author", "author_name", "text", "created_at"]
        read_only_fields = ["author", "created_at"]


class FeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Feedback
        fields = ["id", "complaint", "rating", "comments", "created_at"]
        read_only_fields = ["created_at"]

    def validate_rating(self, value):
        if not (1 <= value <= 5):
            raise serializers.ValidationError("Rating must be between 1 and 5.")
        return value


class ComplaintListSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source="user.full_name", read_only=True)

    class Meta:
        model = Complaint
        fields = [
            "id", "complaint_number", "user", "user_name", "subject", "status",
            "province", "division", "district", "tehsil", "area",
            "created_at", "updated_at",
        ]


class ComplaintDetailSerializer(serializers.ModelSerializer):
    images = ComplaintImageSerializer(many=True, read_only=True)
    timeline = ComplaintTimelineSerializer(many=True, read_only=True)
    comments = CommentSerializer(many=True, read_only=True)
    feedback = FeedbackSerializer(read_only=True)
    user_name = serializers.CharField(source="user.full_name", read_only=True)

    class Meta:
        model = Complaint
        fields = [
            "id", "complaint_number", "user", "user_name", "subject", "description",
            "province", "division", "district", "tehsil", "area", "address", "landmark",
            "status", "images", "timeline", "comments", "feedback",
            "created_at", "updated_at",
        ]
        read_only_fields = ["complaint_number", "status", "created_at", "updated_at"]


class ComplaintCreateSerializer(serializers.ModelSerializer):
    uploaded_images = serializers.ListField(
        child=serializers.ImageField(), write_only=True, required=False, max_length=5,
    )

    class Meta:
        model = Complaint
        fields = [
            "id", "subject", "description", "province", "division", "district",
            "tehsil", "area", "address", "landmark", "uploaded_images",
        ]

    def validate_uploaded_images(self, value):
        if len(value) > 5:
            raise serializers.ValidationError("You may upload a maximum of 5 images.")
        return value

    def create(self, validated_data):
        images = validated_data.pop("uploaded_images", [])
        user = self.context["request"].user
        complaint = Complaint.objects.create(user=user, **validated_data)
        for image in images:
            ComplaintImage.objects.create(complaint=complaint, image=image, image_type="before", uploaded_by=user)
        ComplaintTimeline.objects.create(complaint=complaint, event="created", actor=user)
        return complaint


class ComplaintStatusUpdateSerializer(serializers.Serializer):
    status = serializers.ChoiceField(choices=ComplaintStatus.choices)
    note = serializers.CharField(required=False, allow_blank=True)
