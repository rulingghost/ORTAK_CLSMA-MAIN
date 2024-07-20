# Generated by Django 5.0.2 on 2024-03-02 09:35

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('AFM', '0056_remove_inventor_inventor_izolasyon'),
    ]

    operations = [
        migrations.CreateModel(
            name='String',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('String_Number', models.IntegerField(blank=True, null=True)),
                ('String_Number_Str', models.IntegerField(blank=True, null=True)),
                ('String_Panel_Power', models.IntegerField(blank=True, default='0', null=True)),
                ('String_Panel_Brand', models.CharField(blank=True, max_length=200, null=True)),
                ('String_VOC', models.IntegerField(blank=True, default='0', null=True)),
                ('String_Panel_SY', models.IntegerField(blank=True, default='0', null=True)),
                ('String_Owner', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='AFM.inventor')),
            ],
        ),
    ]