from django.db.models import Count
from django.db.models.functions import TruncDate
from django.utils import timezone

from apps.campaigns.models import Campaign
from apps.investments.models import Investment
from apps.users.models import UserProfile


def get_users_joined_per_day():
    # Get the current date and a range of the past 7 days (for example)
    today = timezone.now().date()

    # Get counts of users (investors and creators) grouped by date and role
    users_by_day = UserProfile.objects.filter(created_at__lte=today).annotate(date=TruncDate('created_at')).values(
        'date', 'role').annotate(count=Count('id')).order_by('date')

    # Prepare data for the chart
    dates = []
    investors_data = []
    creators_data = []

    # Initialize empty dictionary to store data by date
    data_by_date = {}

    # Organize the data by date and role
    for entry in users_by_day:
        date = entry['date']
        role = entry['role']
        count = entry['count']

        if date not in data_by_date:
            data_by_date[date] = {'investor': 0, 'creator': 0}

        data_by_date[date][role] = count

    # Populate dates and counts for each role
    for date, roles in data_by_date.items():
        dates.append(date.strftime('%Y-%m-%d'))
        investors_data.append(roles['investor'])
        creators_data.append(roles['creator'])

    return {
        'dates': dates,
        'investors_data': investors_data,
        'creators_data': creators_data
    }


def get_users_by_role():
    creators_count = UserProfile.objects.filter(role='creator').count()
    investors_count = UserProfile.objects.filter(role='investor').count()

    return {
        'labels': ['Creators', 'Investors'],
        'data': [creators_count, investors_count]
    }


def get_campaigns_by_funding_status():
    upcoming_count = Campaign.objects.filter(funding_status='upcoming').count()
    live_count = Campaign.objects.filter(funding_status='live').count()
    successful_count = Campaign.objects.filter(funding_status='successful').count()

    return {
        'labels': ['Upcoming', 'Live', 'Successful'],
        'data': [upcoming_count, live_count, successful_count]
    }


def get_investments_by_status():
    # Query the investment data and group by status
    investment_data = (
        Investment.objects.values('status')
        .annotate(count=Count('id'))
        .order_by('status')
    )

    # Create the labels and data for the chart
    labels = [entry['status'].capitalize() for entry in investment_data]
    data = [entry['count'] for entry in investment_data]

    return {
        'labels': labels,
        'data': data
    }
