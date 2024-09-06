from django.contrib import admin

from .models import UserProfile, UserSavedCampaign


class UserProfileAdmin(admin.ModelAdmin):
	list_display = ('user', 'name', 'surname', 'email', 'phone_number', 'passport_number', 'role', 'created_at')
	search_fields = ('user', 'name', 'surname', 'email', 'phone_number', 'passport_number')

	list_filter = ('role',)

class UserSavedCampaignAdmin(admin.ModelAdmin):
	list_display = ('user', 'campaign', 'saved_at', 'last_saved_at', 'is_active')
	search_fields = ('user', 'campaign')


admin.site.register(UserProfile, UserProfileAdmin)
admin.site.register(UserSavedCampaign, UserSavedCampaignAdmin)
