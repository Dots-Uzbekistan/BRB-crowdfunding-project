from django.contrib import admin
from django.contrib.admin.views.decorators import staff_member_required
from django.shortcuts import render

from apps.utils import get_users_by_role, get_campaigns_by_funding_status, get_investments_by_status, \
    get_users_joined_per_day

@staff_member_required
def admin_dashboard(request):
    # Get chart data for users
    user_role_data = get_users_by_role()

    # Get chart data for campaigns
    campaign_status_data = get_campaigns_by_funding_status()

    # Get chart data for investments
    investment_status_data = get_investments_by_status()

    # Get chart data for users joined per day (for line chart)
    users_joined_data = get_users_joined_per_day()

    # Call the default Django admin index method to get the default context
    default_admin_index_view = admin.site.index(request)

    # Add your custom context to the existing admin index context
    custom_context = default_admin_index_view.context_data
    custom_context.update({
        'user_role_data': user_role_data,
        'campaign_status_data': campaign_status_data,
        'investment_status_data': investment_status_data,
        'users_joined_data': users_joined_data  # New data for line chart
    })

    return render(request, 'admin/index.html', custom_context)
