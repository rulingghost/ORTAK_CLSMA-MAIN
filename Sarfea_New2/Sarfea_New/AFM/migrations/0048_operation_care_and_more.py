# Generated by Django 5.0.2 on 2024-02-27 11:08

import AFM.models
import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('AFM', '0047_poll_poll_question_poll_answer_question_note_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='Operation_Care',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('Operation_Care_Company', models.CharField(blank=True, max_length=63, null=True)),
                ('Operation_Care_Location', models.CharField(blank=True, max_length=200, null=True)),
                ('Operation_Care_Inventor_Brand', models.CharField(blank=True, max_length=200, null=True)),
                ('Operation_Care_Panel_Brand', models.CharField(blank=True, max_length=200, null=True)),
                ('Operation_Care_Address', models.CharField(blank=True, max_length=500, null=True)),
                ('Operation_Care_Terrain_Roof', models.CharField(blank=True, choices=[('Çatı', 'Çatı'), ('Arazi', 'Arazi')], max_length=63, null=True)),
                ('Operation_Care_Direction', models.CharField(blank=True, choices=[('Kuzey', 'Kuzey'), ('Güney', 'Güney'), ('Doğu', 'Doğu'), ('Batı', 'Batı')], max_length=63, null=True)),
                ('Operation_Care_Inventor_Power', AFM.models.TwoDecimalField(blank=True, decimal_places=2, default='0', max_digits=30, null=True)),
                ('Operation_Care_Panel_Power', AFM.models.TwoDecimalField(blank=True, decimal_places=2, default='0', max_digits=30, null=True)),
                ('Operation_Care_Inventor_Number', AFM.models.TwoDecimalField(blank=True, decimal_places=2, default='0', max_digits=30, null=True)),
                ('Operation_Care_VOC', AFM.models.TwoDecimalField(blank=True, decimal_places=2, default='0', max_digits=30, null=True)),
                ('Operation_Care_AC_Power', AFM.models.TwoDecimalField(blank=True, decimal_places=2, default='0', max_digits=30, null=True)),
                ('Operation_Care_DC_Power', AFM.models.TwoDecimalField(blank=True, decimal_places=2, default='0', max_digits=30, null=True)),
                ('Operation_Care_Panel_Number_Str', AFM.models.TwoDecimalField(blank=True, decimal_places=2, default='0', max_digits=30, null=True)),
                ('Operation_Care_Capacity', AFM.models.TwoDecimalField(blank=True, decimal_places=2, default='0', max_digits=30, null=True)),
                ('Operation_Care_Start_Date', models.DateField(blank=True, null=True)),
                ('Operation_Care_Finish_Date', models.DateField(blank=True, null=True)),
                ('Operation_Care_Has_Fail', models.BooleanField(blank=True, default=False, null=True)),
                ('Operation_Care_Fail_Number', models.IntegerField(blank=True, default='0', null=True)),
            ],
        ),
        migrations.RenameField(
            model_name='poll_answer',
            old_name='Answer_Poll',
            new_name='Answer_Question',
        ),
        migrations.RenameField(
            model_name='poll_answer',
            old_name='Answer_value',
            new_name='Answer_Value',
        ),
        migrations.RemoveField(
            model_name='poll',
            name='Poll_Project',
        ),
        migrations.CreateModel(
            name='Fail',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('Fail_Central_Name', models.CharField(blank=True, max_length=63, null=True)),
                ('Fail_Information_Person', models.CharField(blank=True, max_length=63, null=True)),
                ('Fail_Guaranteed', models.CharField(blank=True, choices=[('Evet', 'Evet'), ('Hayır', 'Hayır')], max_length=63, null=True)),
                ('Fail_Detection_Date', models.DateField(blank=True, null=True)),
                ('Fail_Detail', models.CharField(blank=True, max_length=400, null=True)),
                ('Fail_Operation_Care', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='AFM.operation_care')),
            ],
        ),
        migrations.AddField(
            model_name='poll',
            name='Poll_Operation_Care',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='AFM.operation_care'),
        ),
    ]