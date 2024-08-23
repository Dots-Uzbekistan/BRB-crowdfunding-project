from rest_framework import serializers

from .models import UserProfile


class UserProfileSerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField()

    class Meta:
        model = UserProfile
        fields = ['username', 'name', 'surname', 'email', 'phone_number', 'passport_number', 'passport_document',
                  'created_at', 'updated_at']

    def get_username(self, obj):
        return obj.user.username

    def create(self, validated_data):
        user_id = self.context['request'].user.id
        profile = UserProfile.objects.create(user_id=user_id, **validated_data)
        return profile