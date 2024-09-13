from django.apps import AppConfig
from django.contrib.auth.apps import AuthConfig as DefaultAuthConfig


class UsersConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.authentication'
    # verbose_name = 'User Accounts & Access'
    verbose_name = 'User Accounts'


class CustomAuthConfig(DefaultAuthConfig):
    name = 'django.contrib.auth'
    # verbose_name = 'Role-Based Permissions'
    verbose_name = 'Permissions'
