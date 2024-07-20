# Generated by Django 5.0.2 on 2024-02-27 20:22

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('AFM', '0048_operation_care_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='Fail_Bill',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('Fail_Bill_Central_Name', models.CharField(blank=True, max_length=63, null=True)),
                ('Fail_Bill_Process', models.CharField(blank=True, max_length=63, null=True)),
                ('Fail_Bill_Date', models.DateField(blank=True, null=True)),
                ('Fail_Bill_Detail', models.CharField(blank=True, max_length=400, null=True)),
                ('Fail_Bill_File', models.FileField(blank=True, default='', null=True, upload_to='fail_bills')),
                ('Fail_Bill_Owner', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='AFM.fail')),
            ],
        ),
    ]