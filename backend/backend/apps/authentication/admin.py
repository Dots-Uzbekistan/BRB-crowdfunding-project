from django.contrib import admin
from .models import AuthUser

class AuthUserAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'full_name', 'is_staff', 'is_active', 'is_superuser', 'last_login')
    search_fields = ('username', 'email', 'full_name')
    list_filter = ('is_staff', 'is_active', 'is_superuser')
    ordering = ('last_login',)

    fields = ('username', 'password', 'email', 'full_name', 'is_staff', 'is_active', 'is_superuser')

    readonly_fields = ('last_login',)

admin.site.register(AuthUser, AuthUserAdmin)