# Generated by Django 5.0 on 2024-01-21 20:42

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("AFM", "0042_salesoffercard_profit_rate_card_and_more"),
    ]

    operations = [
        migrations.AddField(
            model_name="salesoffercard",
            name="Person_Deal",
            field=models.CharField(blank=True, max_length=63, null=True),
        ),
    ]
