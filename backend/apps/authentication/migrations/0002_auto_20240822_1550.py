from django.db import migrations, models
from django.db.models import F
from django.core.exceptions import ValidationError

def populate_usernames(apps, schema_editor):
    AuthUser = apps.get_model('authentication', 'AuthUser')
    users = AuthUser.objects.all()
    for user in users:
        base_username = user.email.split('@')[0]
        username = base_username
        counter = 1
        while AuthUser.objects.filter(username=username).exists():
            username = f"{base_username}{counter}"
            counter += 1
        user.username = username
        user.save()

class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='authuser',
            name='username',
            field=models.CharField(max_length=50, unique=True, null=True),
        ),
        migrations.RunPython(populate_usernames),
        migrations.AlterField(
            model_name='authuser',
            name='username',
            field=models.CharField(max_length=50, unique=True),
        ),
    ]