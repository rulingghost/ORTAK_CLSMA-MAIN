# Generated by Django 5.0 on 2023-12-15 18:01

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("AFM", "0026_alter_salesoffercard_situation_card"),
    ]

    operations = [
        migrations.AlterField(
            model_name="salesoffercard",
            name="Situation_Card",
            field=models.CharField(
                blank=True,
                choices=[
                    ("Potansiyel Müşteri", "Potansiyel Müşteri"),
                    ("Maliyet Hesaplama", "Maliyet Hesaplama"),
                    ("Fiyat Belirleme", "Fiyat Belirleme"),
                    ("Teklif Hazırlama", "Teklif Hazırlama"),
                    ("Sunum Sonrası Görüşme", "Sunum Sonrası Görüşme"),
                    ("Teklif Sunuldu", "Teklif Sunuldu"),
                ],
                default="Potansiyel Müşteri",
                max_length=63,
                null=True,
            ),
        ),
        migrations.AlterField(
            model_name="salesoffercard",
            name="Terrain_Roof_Card",
            field=models.CharField(
                blank=True,
                choices=[("Çatı", "Çatı"), ("Arazi", "Arazi")],
                max_length=63,
                null=True,
            ),
        ),
    ]