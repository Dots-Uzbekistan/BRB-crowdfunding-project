from django.contrib import admin

from apps.investments.models import Investment, Transaction, Payment

admin.site.register(Investment)
admin.site.register(Transaction)
admin.site.register(Payment)
