from django.db.models.signals import pre_save 
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Project, CompanyNames, PaymentFirms, Expenses, JobHistory, Incomes, Supplier, Clients, SalesOfferCard, Operation_Care, Fail, Inventor, String, Poll
from django.db import models
from django.utils.text import slugify
from decimal import Decimal
from datetime import datetime
from dateutil.relativedelta import relativedelta

@receiver(pre_save, sender=Expenses)
def update_expenses_company_name(sender, instance, **kwargs):
    
    if instance.Amount_Expenses is not None and instance.Dollar_Rate_Expenses is not None:
        # Calculate the new value for Amount_usd_Expenses
        amount_usd_expenses = instance.Amount_Expenses / instance.Dollar_Rate_Expenses
        # Update the instance with the new value
        instance.Amount_USD_Expenses = amount_usd_expenses

@receiver(pre_save, sender=JobHistory)
def update_jobhistory_company_name(sender, instance, **kwargs):

    if instance.Amount_JobHistory is not None and instance.Dollar_Rate_JobHistory is not None:
        # Calculate the new value for Amount_usd_Expenses
        amount_usd_JobHistory = instance.Amount_JobHistory / instance.Dollar_Rate_JobHistory
        # Update the instance with the new value
        instance.Amount_USD_JobHistory = amount_usd_JobHistory

@receiver(pre_save, sender=Incomes)
def update_Incomes_Tl(sender, instance, **kwargs):

    if instance.Amount_Incomes is not None and instance.Dollar_Rate_Incomes is not None:
        # Calculate the new value forusd_Expenses
        amount_usd_Incomes = instance.Amount_Incomes / instance.Dollar_Rate_Incomes
        # Update the instance with the new value
        instance.Amount_Usd_Incomes = amount_usd_Incomes

@receiver(post_save, sender=SalesOfferCard)
def update_client_card(sender, instance, **kwargs):
    need_save = False
       
    if instance.Roof_Cost_Card and instance.UnitOffer_NotIncludingKDV:
        instance.Unit_Cost_with_Roof_Cost = instance.Roof_Cost_Card + instance.UnitOffer_NotIncludingKDV
        need_save = True

    if instance.Roof_Cost_Card and instance.DC_Power_Card and instance.Offer_Cost_NotIncludingKDV_Card:
    # Convert the float result to Decimal before adding
        tmp = Decimal(instance.Roof_Cost_Card * instance.DC_Power_Card / 1000)
        tmp = tmp + instance.Offer_Cost_NotIncludingKDV_Card
        instance.Unit_Offer_with_Roof_Cost = tmp
        need_save = True

    if instance.Cost_NotIncludingKDV_Card and instance.Offer_Cost_NotIncludingKDV_Card:
        if instance.Offer_Cost_NotIncludingKDV_Card != 0:
            instance.Profit_Rate_Card = instance.Cost_NotIncludingKDV_Card / instance.Offer_Cost_NotIncludingKDV_Card
            need_save = True

    


    post_save.disconnect(update_client_card, sender=SalesOfferCard)

    # Save the instance
    try:
        instance.save(update_fields=[ 'Unit_Cost_with_Roof_Cost', 'Unit_Offer_with_Roof_Cost', 'Profit_Rate_Card','Cost_NotIncludingKDV_Card', 'Offer_Cost_NotIncludingKDV_Card'])
    finally:
        # Reconnect the signal
        post_save.connect(update_client_card, sender=SalesOfferCard)

@receiver(post_save, sender=Operation_Care)
def create_inventor(sender, instance, created, **kwargs):
    if created:
        print("create_inventor")
        instance.Operation_Care_Capacity = instance.Operation_Care_AC_Power +instance.Operation_Care_DC_Power
        poll= Poll.objects.create(
            Poll_Operation_Care=instance,
            Poll_Date=instance.Operation_Care_Start_Date
        )
        num= instance.Operation_Care_Inventor_Number
        if num is None:
            num = 0
        
        for x in range(1, num+1):
            inventor=Inventor.objects.create(
                Inventor_Owner=instance,
                Inventor_Direction=instance.Operation_Care_Direction,
                Inventor_Number=x,
                Inventor_Number_Str=instance.Operation_Care_Number_Str,
                Inventor_Panel_Power=instance.Operation_Care_Panel_Power,
                Inventor_Panel_Brand=instance.Operation_Care_Panel_Brand,
                Inventor_VOC=instance.Operation_Care_VOC,
                Inventor_Panel_SY=instance.Operation_Care_Panel_Number_Str,
                Inventor_AC_Power=instance.Operation_Care_AC_Power,
                Inventor_DC_Power=instance.Operation_Care_DC_Power,
                Inventor_Izolasion="OK",
            )

'''
@receiver(post_save, sender=Operation_Care)
def update_invantor(sender, instance, **kwargs):
    inventors = instance.operation_inventors.all()
    
    for inventor in inventors:
        inventor.Inventor_Direction = instance.Operation_Care_Direction
        inventor.Inventor_Number_Str = instance.Operation_Care_Number_Str
        inventor.Inventor_Panel_Power = instance.Operation_Care_Panel_Power
        inventor.Inventor_Panel_Brand = instance.Operation_Care_Panel_Brand
        inventor.Inventor_VOC = instance.Operation_Care_VOC
        inventor.Inventor_Panel_SY = instance.Operation_Care_Panel_Number_Str
        inventor.Inventor_AC_Power = instance.Operation_Care_AC_Power
        inventor.Inventor_DC_Power = instance.Operation_Care_DC_Power
        inventor.Inventor_Capacity = instance.Operation_Care_Capacity

        inventor.save()
'''

@receiver(post_save, sender=Inventor)
def create_string(sender, instance, created, **kwargs):
    if created:
        print("create_string")
        oc=instance.Inventor_Owner
        num= instance.Inventor_Number_Str
        if num is None:
            num = 0
        for x in range(1, num+1):
            string=String.objects.create(
                String_Owner=instance,
                String_Direction=instance.Inventor_Direction,
                String_Number=x,
                String_Panel_Power=instance.Inventor_Panel_Power,
                String_Panel_Brand=instance.Inventor_Panel_Brand,
                String_VOC=instance.Inventor_VOC,
                String_Panel_SY=instance.Inventor_Panel_SY,
                String_AC_Power=instance.Inventor_AC_Power,
                String_DC_Power=instance.Inventor_DC_Power,
                String_Izolasion=instance.Inventor_Izolasion,
                String_Date=oc.Operation_Care_Start_Date,

            )

'''
@receiver(post_save, sender=Inventor)
def update_strings(sender, instance, **kwargs):
    print("update_strings")

    strings = instance.inventor_strings.all()

    for string in strings:
        string.String_Direction = instance.Inventor_Direction
        string.String_Panel_Power = instance.Inventor_Panel_Power
        string.String_Panel_Brand = instance.Inventor_Panel_Brand
        string.String_VOC = instance.Inventor_VOC
        string.String_Panel_SY = instance.Inventor_Panel_SY
        string.String_Izolasion = instance.Inventor_Izolasion
        string.String_AC_Power = instance.Inventor_AC_Power
        string.String_DC_Power = instance.Inventor_DC_Power
        string.String_Capacity = instance.Inventor_Capacity
        
        # 'String' örneğini kaydederiz
        string.save()
'''

@receiver(post_save, sender=Poll)
def create_poll_str(sender, instance, created, **kwargs):
    if created:
        print("create_poll_str")

        oc=instance.Poll_Operation_Care
        if instance.Poll_Date is not None:
            current_date = instance.Poll_Date
            new_date = current_date + relativedelta(months=6)
            oc.Operation_Care_Finish_Date=new_date
            oc.save()
            inventors = Inventor.objects.filter(Inventor_Owner=oc)
            for inventor in inventors:
                strings_all_for_inventor = inventor.inventor_strings.all()
                string_date=strings_all_for_inventor.last().String_Date
                strings=String.objects.filter(String_Date=string_date, String_Owner=inventor)
                for string in strings:
                    if string.String_Date!=instance.Poll_Date:
                        new_strings=String.objects.create(
                            String_Owner=string.String_Owner,
                            String_Direction=string.String_Direction,
                            String_Number=string.String_Number,
                            String_Panel_Power=string.String_Panel_Power,
                            String_Panel_Brand=string.String_Panel_Brand,
                            String_VOC=string.String_VOC,
                            String_Panel_SY=string.String_Panel_SY,
                            String_AC_Power=string.String_AC_Power,
                            String_DC_Power=string.String_DC_Power,
                            String_Capacity=string.String_Capacity,
                            String_Izolasion=inventor.Inventor_Izolasion,
                            String_Date=instance.Poll_Date,
                        )

@receiver(pre_save, sender=String)
def update_capasity(sender, instance, **kwargs):
    instance.String_Capacity = instance.String_Pluse + instance.String_Minus
    
@receiver(pre_save, sender=Operation_Care)
def update_capasity_OC(sender, instance, **kwargs):
        instance.Operation_Care_Capacity = instance.Operation_Care_AC_Power + instance.Operation_Care_DC_Power
