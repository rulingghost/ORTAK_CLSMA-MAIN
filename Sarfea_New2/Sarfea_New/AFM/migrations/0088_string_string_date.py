# Generated by Django 5.0.3 on 2024-05-06 16:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('AFM', '0087_operation_care_operation_care_switchgear_material'),
    ]

    operations = [
        migrations.AddField(
            model_name='string',
            name='String_Date',
            field=models.DateField(blank=True, null=True),
        ),
    ]