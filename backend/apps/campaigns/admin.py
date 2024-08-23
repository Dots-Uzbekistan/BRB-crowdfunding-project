# admin.py

from django.contrib import admin
from .models import (
    Campaign, CampaignCategory, CampaignMedia, CampaignNews, 
    CampaignNewsMedia, CampaignRating, CampaignTag, 
    CampaignTeamMember, CampaignVisit
)

class CampaignAdmin(admin.ModelAdmin):
    list_display = ('title', 'location', 'currency', 'goal_amount', 'raised_amount', 'funding_status', 'project_state', 'approval_status', 'start_date', 'end_date', 'created_at', 'updated_at', 'creator', 'get_categories', 'get_tags')
    search_fields = ('title', 'location', 'currency', 'goal_amount', 'raised_amount', 'funding_status', 'project_state', 'approval_status', 'start_date', 'end_date', 'creator', 'categories__name', 'tags__name')

    def get_categories(self, obj):
        return ", ".join([category.name for category in obj.categories.all()])
    get_categories.short_description = 'Categories'

    def get_tags(self, obj):
        return ", ".join([tag.name for tag in obj.tags.all()])
    get_tags.short_description = 'Tags'

class CampaignCategoryAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)

class CampaignMediaAdmin(admin.ModelAdmin):
    list_display = ('campaign', 'url', 'type', 'file')
    search_fields = ('campaign', 'type')

class CampaignNewsAdmin(admin.ModelAdmin):
    list_display = ('campaign', 'description', 'created_at', 'updated_at')
    search_fields = ('campaign', 'description')

class CampaignNewsMediaAdmin(admin.ModelAdmin):
    list_display = ('campaign_news', 'url', 'file', 'type')
    search_fields = ('campaign_news', 'type')

class CampaignRatingAdmin(admin.ModelAdmin):
    list_display = ('user', 'campaign', 'rating', 'comment', 'rated_at')
    search_fields = ('user', 'campaign', 'rating')

class CampaignTagAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)

class CampaignTeamMemberAdmin(admin.ModelAdmin):
    list_display = ('campaign', 'name', 'email', 'role', 'bio', 'profile_link', 'profile_picture')
    search_fields = ('campaign', 'name', 'email', 'role')

class CampaignVisitAdmin(admin.ModelAdmin):
    list_display = ('user', 'campaign', 'visited_at')
    search_fields = ('user', 'campaign', 'visited_at')

admin.site.register(Campaign, CampaignAdmin)
admin.site.register(CampaignCategory, CampaignCategoryAdmin)
admin.site.register(CampaignMedia, CampaignMediaAdmin)
admin.site.register(CampaignNews, CampaignNewsAdmin)
admin.site.register(CampaignNewsMedia, CampaignNewsMediaAdmin)
admin.site.register(CampaignRating, CampaignRatingAdmin)
admin.site.register(CampaignTag, CampaignTagAdmin)
admin.site.register(CampaignTeamMember, CampaignTeamMemberAdmin)
admin.site.register(CampaignVisit, CampaignVisitAdmin)