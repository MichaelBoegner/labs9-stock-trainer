# Generated by Django 2.1.5 on 2019-01-14 21:47

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('stockTrainerApp', '0003_auto_20190114_2052'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='apitest',
            name='Date',
        ),
    ]
