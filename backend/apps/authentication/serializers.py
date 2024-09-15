from rest_framework import serializers

from .models import AuthUser


class AuthUserSerializer(serializers.ModelSerializer):
	class Meta:
		model = AuthUser
		fields = ['id', 'username', 'password', 'full_name']
		extra_kwargs = {'password': {'write_only': True}}

	def create(self, validated_data):
		user = AuthUser.objects.create_user(**validated_data)
		return user


class PasswordChangeSerializer(serializers.Serializer):
	old_password = serializers.CharField(required=True)
	new_password = serializers.CharField(required=True)

	def validate_old_password(self, value):
		user = self.context['request'].user
		if not user.check_password(value):
			raise serializers.ValidationError('Old password is not correct')
		return value

	def validate_new_password(self, value):
		if len(value) < 8:
			raise serializers.ValidationError('Password must be at least 8 characters long')
		return value
