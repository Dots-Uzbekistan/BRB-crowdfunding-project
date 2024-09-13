from django.db.models import Sum
from django.utils import timezone
from rest_framework import serializers

from apps.campaigns.models import Campaign, CampaignNews, CampaignCategory
from apps.investments.models import Investment, Transaction, Payment
from apps.users.models import UserProfile


def generate_payment_link(amount_in_sum, invoice_id, recipient_name, payment_details, tin):
    amount_in_tiyin = int(amount_in_sum * 100)
    base_url = "https://checkout.multicard.uz/?"
    params = {
        "store_id": "270",
        "invoice_id": invoice_id,
        "details[tin]": tin,
        "details[mfo]": "00491",
        "details[account_no]": "20206000162440764100",
        "details[details]": payment_details,
        "details[name]": recipient_name,
        "ofd[0][name]": "Услуги по разработке, внедрению и/или реализации (продаже) программно-аппаратных комплексов",
        "ofd[0][mxik]": "10305009001000000",
        "ofd[0][package_code]": "1546607",
        "ofd[0][qty]": "1",
        "ofd[0][vat]": "0",
        "ofd[0][tin]": tin,
        "amount": amount_in_tiyin
    }

    query_string = "&".join([f"{k}={v}" for k, v in params.items()])
    return base_url + query_string


class InvestmentCreateSerializer(serializers.ModelSerializer):
    campaign_id = serializers.IntegerField(write_only=True)
    investment_amount_usd = serializers.DecimalField(max_digits=10, decimal_places=2, write_only=True)
    address = serializers.CharField(max_length=255, write_only=True)

    class Meta:
        model = Investment
        fields = ['investment_amount_usd', 'campaign_id', 'address']

    def create(self, validated_data):
        user = self.context['request'].user.profile
        campaign = Campaign.objects.get(id=validated_data['campaign_id'])
        investment_amount_usd = validated_data['investment_amount_usd']
        address = validated_data['address']

        # Convert USD to Soums
        conversion_rate = 12693
        investment_amount_soums = investment_amount_usd * conversion_rate

        # Create Investment
        investment = Investment.objects.create(
            user=user,
            campaign=campaign,
            amount=investment_amount_usd,
            address=address
        )

        # Create Transaction
        transaction = Transaction.objects.create(
            investment=investment,
            amount=investment.amount
        )

        # Generate Payment Link
        payment_details = f"Investment in {campaign.title} by {user.name} {user.surname}"
        payment_link = generate_payment_link(
            amount_in_sum=investment_amount_soums,
            invoice_id=str(investment.id),
            recipient_name=user.name + " " + user.surname,
            payment_details=payment_details,
            tin="50202036030010"  # assuming this is a fixed value
        )

        # Create Payment
        payment = Payment.objects.create(
            investment=investment,
            payment_method="Online",
            amount=investment.amount,
            status="Pending",
            api_response=payment_link
        )

        return {
            "investment": investment,
            "transaction": transaction,
            "payment": payment,
            "payment_link": payment_link
        }


class TransactionHistorySerializer(serializers.ModelSerializer):
    campaign_name = serializers.CharField(source='investment.campaign.title')
    transaction_date = serializers.SerializerMethodField()
    transaction_time = serializers.SerializerMethodField()
    amount = serializers.SerializerMethodField()
    campaign_image = serializers.SerializerMethodField()

    class Meta:
        model = Transaction
        fields = ['transaction_date', 'transaction_time', 'amount', 'campaign_name', 'campaign_image']

    def get_transaction_date(self, obj):
        return obj.transaction_date.date()  # Extracts the date part

    def get_transaction_time(self, obj):
        return obj.transaction_date.time()  # Extracts the time part

    def get_amount(self, obj):
        return f"{obj.amount:.0f}"  # Rounds the amount to one decimal place

    def get_campaign_image(self, obj):
        request = self.context.get('request')
        media = obj.investment.campaign.media.filter(type='image').first()
        if media and media.file:
            return request.build_absolute_uri(media.file.url) if request else media.file.url
        return None


class UserInvestedCampaignNewsSerializer(serializers.ModelSerializer):
    campaign_name = serializers.CharField(source='campaign.title')
    campaign_image = serializers.SerializerMethodField()

    class Meta:
        model = CampaignNews
        fields = ['campaign_name', 'campaign_image', 'title']

    def get_campaign_image(self, obj):
        request = self.context.get('request')
        media = obj.campaign.media.filter(type='image').first()  # Assuming you have a media relationship in Campaign
        if media and media.file:
            return request.build_absolute_uri(media.file.url) if request else media.file.url
        return None


class Last30DaysInvestmentSerializer(serializers.Serializer):
    total_invested = serializers.DecimalField(max_digits=10, decimal_places=2)


class CampaignViewsRateSerializer(serializers.Serializer):
    campaign_name = serializers.CharField()
    monthly_views = serializers.DictField()  # A dictionary with month names as keys and view counts as values
    max_views = serializers.IntegerField()


class InvestmentCategorySerializer(serializers.Serializer):
    category_name = serializers.CharField()
    percentage = serializers.DecimalField(max_digits=5, decimal_places=2)


class UserInvestmentSerializer(serializers.ModelSerializer):
    campaign_title = serializers.CharField(source='title')
    campaign_image = serializers.SerializerMethodField()
    percent_raised = serializers.SerializerMethodField()
    days_left = serializers.SerializerMethodField()
    user_equity = serializers.SerializerMethodField()
    raised_amount = serializers.SerializerMethodField()

    class Meta:
        model = Campaign
        fields = [
            'campaign_title', 'campaign_image', 'percent_raised', 'days_left',
            'user_equity', 'raised_amount'
        ]

    def calculate_percent_raised(self, obj):
        if obj.goal_amount == 0:
            return 0
        return (obj.raised_amount / obj.goal_amount) * 100

    def get_campaign_image(self, obj):
        request = self.context.get('request')
        media = obj.media.filter(type='image').first()
        if media and media.file:
            return request.build_absolute_uri(media.file.url) if request else media.file.url
        return None

    def get_percent_raised(self, obj):
        return "{:.0f}%".format(self.calculate_percent_raised(obj))

    def get_days_left(self, obj):
        today = timezone.now().date()
        days_left = (obj.end_date - today).days if obj.end_date else 'N/A'
        return max(days_left, 0) if days_left != 'N/A' else 'N/A'

    def get_user_equity(self, obj):
        campaign_investment_map = self.context.get('campaign_investment_map', {})
        total_invested = campaign_investment_map.get(obj.id, 0)

        if obj.investment_type == 'equity' and obj.valuation_cap:
            valuation_cap = obj.valuation_cap
            user_equity = (total_invested / valuation_cap) * 100
            return f"{user_equity:.2f}%"
        return None  # If not an equity-based campaign

    def get_raised_amount(self, obj):
        if obj.raised_amount < 1000:
            return f"${obj.raised_amount:.0f}"
        elif obj.raised_amount < 1000000:
            return f"${obj.raised_amount / 1000:.1f}K"
        else:
            return f"${obj.raised_amount / 1000000:.1f}M"


class InvestmentCategoryBreakdownSerializer(serializers.ModelSerializer):
    campaign_name = serializers.CharField(source='name')
    percentage = serializers.SerializerMethodField()

    class Meta:
        model = CampaignCategory
        fields = ['campaign_name', 'percentage']

    def get_percentage(self, obj):
        user = self.context['request'].user.profile
        total_investment = Investment.objects.filter(
            user=user,
            status='successful'
        ).aggregate(total=Sum('amount'))['total'] or 0

        # Calculate the total amount invested in campaigns within this category, distributed among all categories
        category_investment = 0
        campaigns = Campaign.objects.filter(categories=obj, investments__user=user, investments__status='successful').distinct()

        for campaign in campaigns:
            campaign_investment = Investment.objects.filter(
                campaign=campaign,
                user=user,
                status='successful'
            ).aggregate(total=Sum('amount'))['total'] or 0

            # Distribute the investment among the categories the campaign belongs to
            category_count = campaign.categories.count()
            category_investment += campaign_investment / category_count

        return f"{(category_investment / total_investment) * 100:.2f}" if total_investment else "0.00"


class InvestmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Investment
        fields = '__all__'


class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = '__all__'


class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = '__all__'
