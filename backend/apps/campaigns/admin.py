from django.contrib import admin
from django.http import HttpResponse
from django.template.loader import render_to_string
from django.urls import path, reverse
from django.utils.html import format_html

from .models import CampaignCategory, CampaignMedia, CampaignNews, CampaignTag, \
    CampaignTeamMember, CampaignVisit, CampaignFAQ, CampaignLike, CampaignLink, Campaign, CollaborationRequest, \
    WithdrawalRequest, CampaignShare


@admin.register(Campaign)
class CampaignAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'title', 'name', 'pitch_link', 'location',
        'creator', 'get_creator_username',
        'goal_amount', 'raised_amount',
        'funding_status', 'project_state', 'approval_status', 'investment_type',
        'start_date', 'end_date', 'created_at', 'updated_at',
        'get_categories', 'get_tags',
    )
    search_fields = (
        'title', 'name', 'location', 'goal_amount', 'raised_amount',
        'funding_status', 'project_state', 'approval_status', 'start_date',
        'end_date', 'creator__user__username', 'categories__name', 'tags__name'
    )

    fields = [
        'name', 'title', 'description',
        'pitch',
        'location', 'goal_amount', 'max_goal_amount', 'raised_amount',
        'funding_status', 'project_state', 'approval_status',
        'start_date', 'end_date', 'categories', 'tags', 'creator',
        'investment_type', 'min_investment',
        'valuation_cap',  # For equity-based campaigns
        # 'interest_rate', 'repayment_period_months',  # For debt-based campaigns
    ]

    list_filter = ('approval_status', 'funding_status', 'project_state', 'investment_type', 'categories', 'tags')

    ordering = ('-updated_at',)

    actions = ['approve_campaign', 'reject_campaign']

    def approve_campaign(self, request, queryset):
        queryset.update(approval_status='approved')
        self.message_user(request, "Selected campaigns have been approved.")

    approve_campaign.short_description = "Approve selected campaigns"

    def reject_campaign(self, request, queryset):
        queryset.update(approval_status='rejected')
        self.message_user(request, "Selected campaigns have been rejected.")

    reject_campaign.short_description = "Reject selected campaigns"

    def get_creator_username(self, obj):
        return obj.creator.user.username

    get_creator_username.short_description = 'Username'

    def get_categories(self, obj):
        return ", ".join([category.name for category in obj.categories.all()])

    get_categories.short_description = 'Categories'

    def get_tags(self, obj):
        return ", ".join([tag.name for tag in obj.tags.all()])

    get_tags.short_description = 'Tags'

    def pitch_link(self, obj):
        return format_html('<a href="{}" target="_blank">View Pitch</a>',
                           reverse('admin:campaign-pitch', args=[obj.pk]))

    pitch_link.short_description = 'Pitch'

    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path('pitch/<int:campaign_id>/', self.admin_site.admin_view(self.view_pitch), name='campaign-pitch'),
        ]
        return custom_urls + urls

    def view_pitch(self, request, campaign_id):
        campaign = self.get_object(request, campaign_id)
        if not campaign:
            return HttpResponse('Campaign with ID {} doesn\'t exist. Perhaps it was deleted?'.format(campaign_id))
        return HttpResponse(render_to_string('admin/campaign_pitch.html', {'campaign': campaign}))

    def get_queryset(self, request):
        queryset = super().get_queryset(request)
        return queryset


class CampaignCategoryAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)


class CampaignMediaAdmin(admin.ModelAdmin):
    list_display = ('campaign', 'url', 'type', 'file')
    search_fields = ('campaign', 'type')


@admin.register(CampaignNews)
class CampaignNewsAdmin(admin.ModelAdmin):
    list_display = ('campaign', 'title', 'view_content', 'description', 'created_at', 'updated_at')
    search_fields = ('campaign', 'title', 'view_content', 'description')

    def view_content(self, obj):
        return format_html('<a href="{}" target="_blank">View Content</a>',
                           reverse('admin:campaigns_campaignnews_change', args=[obj.pk]))

    def save_model(self, request, obj, form, change):
        obj.save()
        obj.content = obj.description if not obj.content or obj.content == '<p>&nbsp;</p>' else obj.content
        obj.save()


# class CampaignRatingAdmin(admin.ModelAdmin):
#     list_display = ('user', 'campaign', 'rating', 'comment', 'rated_at')
#     search_fields = ('user', 'campaign', 'rating')


class CampaignTagAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)


class CampaignTeamMemberAdmin(admin.ModelAdmin):
    list_display = ('campaign', 'name', 'email', 'role', 'bio', 'profile_link', 'profile_picture')
    search_fields = ('campaign', 'name', 'email', 'role')


class CampaignVisitAdmin(admin.ModelAdmin):
    list_display = ('user', 'campaign', 'visited_at')
    search_fields = ('user', 'campaign', 'visited_at')


class CampaignFAQAdmin(admin.ModelAdmin):
    list_display = ('campaign', 'question', 'answer', 'order', 'is_important')
    search_fields = ('campaign', 'question', 'answer')


class CampaignLikeAdmin(admin.ModelAdmin):
    list_display = ('user', 'campaign', 'liked_at', 'last_liked_at', 'is_active')
    search_fields = ('user', 'campaign', 'liked_at', 'last_liked_at', 'is_active')


@admin.register(CampaignShare)
class CampaignShareAdmin(admin.ModelAdmin):
    list_display = ('user', 'campaign', 'shared_at')
    search_fields = ('user', 'campaign', 'shared_at')


@admin.register(CampaignLink)
class CampaignLinkAdmin(admin.ModelAdmin):
    list_display = ('campaign', 'link', 'platform')
    search_fields = ('campaign', 'link', 'platform')


@admin.register(CollaborationRequest)
class CollaborationRequestAdmin(admin.ModelAdmin):
    list_display = ('sender_campaign', 'receiver_campaign', 'sender', 'receiver', 'status', 'message', 'created_at',
                    'updated_at', 'responded_at')
    search_fields = ('sender_campaign', 'receiver_campaign', 'sender', 'receiver', 'status', 'message')

    list_filter = ('status',)

    ordering = ('-updated_at',)

    actions = ['accept_request', 'decline_request']

    def accept_request(self, request, queryset):
        queryset.update(status='accepted')

    def decline_request(self, request, queryset):
        queryset.update(status='declined')


@admin.register(WithdrawalRequest)
class WithdrawalRequestAdmin(admin.ModelAdmin):
    list_display = ['campaign', 'method', 'amount', 'commission', 'status', 'created_at', 'updated_at']
    list_filter = ['status', 'method']
    actions = ['approve_withdrawal', 'reject_withdrawal']

    def approve_withdrawal(self, request, queryset):
        queryset.update(status='approved')
        # logic can be added here for processing the withdrawal

    def reject_withdrawal(self, request, queryset):
        queryset.update(status='rejected')

    approve_withdrawal.short_description = "Approve selected withdrawal requests"
    reject_withdrawal.short_description = "Reject selected withdrawal requests"


admin.site.register(CampaignCategory, CampaignCategoryAdmin)
admin.site.register(CampaignMedia, CampaignMediaAdmin)
# admin.site.register(CampaignRating, CampaignRatingAdmin)
admin.site.register(CampaignTag, CampaignTagAdmin)
admin.site.register(CampaignTeamMember, CampaignTeamMemberAdmin)
admin.site.register(CampaignVisit, CampaignVisitAdmin)
admin.site.register(CampaignFAQ, CampaignFAQAdmin)
admin.site.register(CampaignLike, CampaignLikeAdmin)
