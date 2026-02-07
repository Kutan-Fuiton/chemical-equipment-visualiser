from django.db import migrations
from django.contrib.auth.hashers import make_password


def create_demo_users(apps, schema_editor):
    User = apps.get_model('auth', 'User')
    
    demo_users = [
        {'username': 'test1', 'password': 'admin.test1'},
        {'username': 'test2', 'password': 'admin.test2'},
        {'username': 'test3', 'password': 'admin@test3'},
    ]
    
    for user_data in demo_users:
        if not User.objects.filter(username=user_data['username']).exists():
            User.objects.create(
                username=user_data['username'],
                password=make_password(user_data['password']),
                is_active=True,
            )


def remove_demo_users(apps, schema_editor):
    User = apps.get_model('auth', 'User')
    User.objects.filter(username__in=['test1', 'test2', 'test3']).delete()


class Migration(migrations.Migration):

    dependencies = [
        ('equipment', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(create_demo_users, remove_demo_users),
    ]
