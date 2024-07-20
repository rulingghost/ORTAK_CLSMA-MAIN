# Generated by Django 5.0.3 on 2024-07-07 11:56

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('AFM', '0095_note'),
    ]

    operations = [
        migrations.CreateModel(
            name='Date',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('Date_Year', models.IntegerField(blank=True, null=True)),
                ('Date_Month', models.IntegerField(blank=True, null=True)),
                ('Date_Day', models.IntegerField(blank=True, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Events',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('Event_Title', models.CharField(blank=True, max_length=63, null=True)),
                ('Event_Time', models.CharField(blank=True, max_length=63, null=True)),
                ('Event_Date', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='date_events', to='AFM.date')),
            ],
        ),
        migrations.DeleteModel(
            name='Note',
        ),
    ]
