from django.contrib import admin

from .models import UserProfile, UserSavedCampaign


class UserProfileAdmin(admin.ModelAdmin):
	list_display = ('name', 'surname', 'email', 'phone_number', 'passport_number', 'created_at')
	search_fields = ('name', 'surname', 'email', 'phone_number', 'passport_number')


class UserSavedCampaignAdmin(admin.ModelAdmin):
	list_display = ('user', 'campaign', 'saved_at')
	search_fields = ('user', 'campaign')


admin.site.register(UserProfile, UserProfileAdmin)
admin.site.register(UserSavedCampaign, UserSavedCampaignAdmin)
