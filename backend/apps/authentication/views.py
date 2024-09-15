from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView

from .models import AuthUser
from .serializers import AuthUserSerializer, PasswordChangeSerializer


class CreateUserView(generics.CreateAPIView):
	queryset = AuthUser.objects.all()
	serializer_class = AuthUserSerializer
	permission_classes = (AllowAny,)

	def create(self, request, *args, **kwargs):
		serializer = self.get_serializer(data=request.data)
		serializer.is_valid(raise_exception=True)
		user = serializer.save()

		refresh = RefreshToken.for_user(user)
		response_data = {
			'user': serializer.data,
			'refresh': str(refresh),
			'access': str(refresh.access_token),
		}

		return Response(response_data, status=status.HTTP_201_CREATED)


class CustomLoginView(TokenObtainPairView):
	serializer_class = TokenObtainPairSerializer

	def post(self, request, *args, **kwargs):
		return super().post(request, *args, **kwargs)


class AuthUserProfileDetailView(generics.RetrieveUpdateAPIView):
	queryset = AuthUser.objects.all()
	serializer_class = AuthUserSerializer
	permission_classes = [IsAuthenticated]

	def get_object(self):
		return self.request.user


class PasswordChangeView(APIView):
	permission_classes = [IsAuthenticated]
	authentication_classes = [JWTAuthentication]
	serializer_class = PasswordChangeSerializer

	def post(self, request, *args, **kwargs):
		serializer = PasswordChangeSerializer(data=request.data, context={'request': request})
		if serializer.is_valid():
			user = request.user
			user.set_password(serializer.validated_data['new_password'])
			user.save()
			return Response({'detail': 'Password changed successfully'}, status=status.HTTP_200_OK)
		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
