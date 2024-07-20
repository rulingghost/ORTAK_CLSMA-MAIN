from django.db import models
from django.core.exceptions import ValidationError
from django.utils import timezone

class FourDecimalField(models.DecimalField):
    def __init__(self, *args, **kwargs):
        kwargs['max_digits'] = 30 # Toplam basamak sayısı (ondalık dahil)
        kwargs['decimal_places'] = 4  # Ondalık basamak sayısı
        super().__init__(*args, **kwargs)

class TwoDecimalField(models.DecimalField):
    def __init__(self, *args, **kwargs):
        kwargs['max_digits'] = 30 # Toplam basamak sayısı (ondalık dahil)
        kwargs['decimal_places'] = 2  # Ondalık basamak sayısı
        super().__init__(*args, **kwargs)

def unique_supplier_validator(value):
   ''' existing_suppliers = Supplier.objects.filter(CompanyName_Supplier=value)
    if existing_suppliers.exists():
        raise ValidationError(f"A Supplier with the name '{value}' already exists.")
    
    existing_client = Clients.objects.filter(CompanyName_Clients=value)
    if existing_client.exists():
        raise ValidationError(f"A Client with the name '{value}' already exists.")
    
    existing_project = Project.objects.filter(ProjectName=value)
    if existing_project.exists():
        raise ValidationError(f"A Project with the name '{value}' already exists.")'''

class CompanyNames(models.Model):
    CompanyName = models.CharField(max_length=63) 
    def __str__(self):
        return self.CompanyName

class PowerPlant(models.Model):
    PowerPlantName = models.CharField(max_length=63) 
    def __str__(self):
        return self.PowerPlantName

class MyCompanyNames(models.Model):
    MyCompanyName = models.CharField(max_length=63) 
    def __str__(self):
        return self.MyCompanyName

class Locations(models.Model):
    Location = models.CharField(max_length=63) 
    def __str__(self):
        return self.Location

class Terrain_Roof(models.Model):
    Terrain_Roof = models.CharField(max_length=63)
    def __str__(self):
        return self.Terrain_Roof

class Banks(models.Model):
    BankName = models.CharField(max_length=63)
    def __str__(self):
        return self.BankName

class Situations(models.Model):
    Situation = models.CharField(max_length=63)
    def __str__(self):
        return self.Situation

class PaymentFirms(models.Model):
    PaymentFirmsName = models.CharField(max_length=63)
    def __str__(self):
        return self.PaymentFirmsName

class Details(models.Model):
    Detail = models.CharField(max_length=63)
    def __str__(self):
        return self.Detail

class Worker(models.Model):
    Worker_Name = models.CharField(max_length=63)
    def __str__(self):
        return self.Worker_Name

class Clients(models.Model):
    CompanyName_Clients = models.CharField(max_length=63, unique=True)
    ContactPerson = models.CharField(max_length=63, blank=True, null=True)
    PhoneNumber = models.CharField(max_length=15, blank=True, null=True)
    Email= models.CharField(max_length=63, blank=True, null=True)
    Location = models.CharField(max_length=200, blank=True, null=True)

    def __str__(self):
        return f'{self.CompanyName_Clients}'

class Supplier(models.Model):
    CompanyName_Supplier = models.CharField(max_length=63, unique=True)
    ContactPerson = models.CharField(max_length=63, blank=True, null=True)
    PhoneNumber = models.CharField(max_length=15, blank=True, null=True)
    Email= models.CharField(max_length=63, blank=True, null=True)
    Location = models.CharField(max_length=200, blank=True, null=True)
    
    def __str__(self):
        return f'{self.CompanyName_Supplier}'

class Project(models.Model):
    ProjectName = models.CharField(max_length=63, blank=True, null=True, unique=True)
    ProjectCode = models.CharField(max_length=63, blank=True, null=True)
    Company_id = models.ForeignKey(Clients, on_delete=models.SET_NULL, related_name="projects", blank=True, null=True)
    CompanyUndertakingWork = models.CharField(max_length=63, blank=True, null=True)
    Location = models.CharField(max_length=200, blank=True, null=True)
    Cost_NotIncludingKDV = models.FloatField( blank=True, null=True, default=0)
    AC_Power = TwoDecimalField(blank=True, null=True,default=0)
    DC_Power = TwoDecimalField(blank=True, null=True,default=0)
    CalculatedCost_NotIncludingKDV = models.FloatField(blank=True, null=True)
    RealizedCost_NotIncludingKDV = models.FloatField(blank=True, null=True)
    CalculatedProfit_Loss = models.FloatField(blank=True, null=True)
    RealizedProfit_Loss = models.FloatField(blank=True, null=True)
    CalculatedProfitRate = models.FloatField(blank=True, null=True)
    RealizedProfitRate = models.FloatField(blank=True, null=True)
    Situation = models.CharField(max_length=63, default="Onay Bekliyor")
    StartDate = models.DateField(blank=True, null=True)
    FinishDate = models.DateField(blank=True, null=True)
    KDV_Rate = models.CharField(default="20", blank=True, null=True, max_length=12)
    Terrain_Roof = models.CharField(max_length=63, blank=True, null=True)
    Incentive = models.BooleanField(default=False)
    def __str__(self):
        return self.ProjectName
    
class Expenses(models.Model):
    Project_Expenses = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="project_expenses")
    CompanyName_FromPaymentMade_Expenses = models.CharField(max_length=63, blank=True, null=True)
    CompanyName_Paying_Expenses = models.ForeignKey(Supplier, on_delete=models.SET_NULL, related_name="supplier_expenses", blank=True, null=True)
    ExpensDetails_Expenses = models.CharField(max_length=1000, blank=True, null=True)
    Amount_Expenses = TwoDecimalField(blank=True, null=True)
    Amount_USD_Expenses = TwoDecimalField(blank=True, null=True)
    Dollar_Rate_Expenses = FourDecimalField(blank=True, null=True)
    Bank_Expenses = models.CharField(max_length=63, blank=True, null=True)
    Date_Expenses = models.DateField(blank=True, null=True)

class JobHistory(models.Model):
    Project_JobHistory = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="project_jobhistories")
    CompanyName_FromJobMade_JobHistory = models.CharField(max_length=63, blank=True, null=True)
    CompanyName_Job_JobHistory = models.ForeignKey(Supplier, on_delete=models.SET_NULL, related_name="supplier_jobhistories", blank=True, null=True)
    ExpensDetails_JobHistory = models.CharField(max_length=1000, blank=True, null=True)
    Invoice_No_JobHistory = models.CharField(max_length=63, blank=True, null=True) 
    Amount_JobHistory = FourDecimalField(blank=True, null=True)
    Amount_USD_JobHistory = FourDecimalField(blank=True, null=True)
    Dollar_Rate_JobHistory = FourDecimalField(blank=True, null=True)
    Date_JobHistory = models.DateField(blank=True, null=True)

class Incomes(models.Model):
    Project_Incomes = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="project_incomes")
    CompanyName_ReceivePayment_Incomes = models.CharField(max_length=63, blank=True, null=True)
    CompanyName_Pay_Incomes = models.ForeignKey(Clients, on_delete=models.SET_NULL, related_name="client_incomes", blank=True, null=True)
    Amount_Incomes = FourDecimalField(blank=True, null=True)
    Dollar_Rate_Incomes = FourDecimalField(blank=True, null=True)
    PaymentType_Incomes = models.CharField(max_length=63, blank=True, null=True)
    ChekDate_Incomes = models.DateField(blank=True, null=True)
    LastChekDate_Incomes = models.DateField(blank=True, null=True)
    Amount_Usd_Incomes = FourDecimalField(blank=True, null=True)


class SalesOfferCard(models.Model):
    Client_Card=  models.ForeignKey(Clients, on_delete=models.CASCADE,related_name="client_salesoffers")
    Offer_Subject_Card= models.CharField(max_length=63, blank=True, null=True)
    Location_Card = models.CharField(max_length=200, blank=True, null=True)
    Cost_NotIncludingKDV_Card = TwoDecimalField(blank=True, null=True, default="0")
    Offer_Cost_NotIncludingKDV_Card = TwoDecimalField(blank=True, null=True, default="0")
    AC_Power_Card = TwoDecimalField(blank=True, null=True,default="0")
    DC_Power_Card = TwoDecimalField(blank=True, null=True,default="0")
    UnitCost_NotIncludingKDV = TwoDecimalField(blank=True, null=True, default="0")
    UnitOffer_NotIncludingKDV = TwoDecimalField(blank=True, null=True, default="0")
    Situation_Card = models.CharField(
        max_length=63,blank=True, null=True,
        choices=(
            ('Potansiyel Müşteri', 'Potansiyel Müşteri'),
            ('Maliyet Hesaplama', 'Maliyet Hesaplama'),
            ('Fiyat Belirleme', 'Fiyat Belirleme'),
            ('Teklif Hazırlama', 'Teklif Hazırlama'),
            ('Teklif Hazır', 'Teklif Hazır'),
            ('Teklif Sunuldu', 'Teklif Sunuldu'),
            ('Sunum Sonrası Görüşme', 'Sunum Sonrası Görüşme'),
        ),
        default='Potansiyel Müşteri',
    )    
    Date_Card = models.DateField(blank=True, null=True)
    Terrain_Roof_Card = models.CharField(
        max_length=63,blank=True, null=True,
        choices=(
            ('Çatı', 'Çatı'),
            ('Arazi', 'Arazi'),
        ),
    )    
    Roof_Cost_Card = TwoDecimalField(blank=True, null=True)
    Person_Deal= models.CharField(max_length=63, blank=True, null=True)
    Person_Related= models.CharField(max_length=63, blank=True, null=True)
    Offer_File_Card = models.FileField(upload_to='offer_files', default="", blank=True, null=True)
    Offer_File_Card_2 = models.FileField(upload_to='offer_files', default="", blank=True, null=True)
    Offer_File_Card_3 = models.FileField(upload_to='offer_files', default="", blank=True, null=True)
    Offer_File_Card_4 = models.FileField(upload_to='offer_files', default="", blank=True, null=True)
    Offer_File_Card_5 = models.FileField(upload_to='offer_files', default="", blank=True, null=True)
    M_File_Card = models.FileField(upload_to='m_files', default="", blank=True, null=True)
    M_File_Card_2 = models.FileField(upload_to='m_files', default="", blank=True, null=True)
    M_File_Card_3 = models.FileField(upload_to='m_files', default="", blank=True, null=True)
    Is_Lost = models.BooleanField(default=False, blank=True, null=True)
    Is_Gain = models.BooleanField(default=False, blank=True, null=True)
    Is_late = models.BooleanField(default=False, blank=True, null=True)
    Unit_Cost_with_Roof_Cost= TwoDecimalField(blank=True, null=True)
    Unit_Offer_with_Roof_Cost= TwoDecimalField(blank=True, null=True)
    Profit_Rate_Card= TwoDecimalField(blank=True, null=True)

    Comment_Date_Card_1 = models.DateField(blank=True, null=True)
    Comment_Card_1= models.CharField(max_length=1000, blank=True, null=True)
    Comment_Telno_Card_1= models.CharField(max_length=15, blank=True, null=True)
    Comment_Person_Card_1= models.CharField(max_length=63, blank=True, null=True)

    Comment_Date_Card_2 = models.DateField(blank=True, null=True)
    Comment_Card_2= models.CharField(max_length=1000, blank=True, null=True)
    Comment_Telno_Card_2= models.CharField(max_length=15, blank=True, null=True)
    Comment_Person_Card_2= models.CharField(max_length=63, blank=True, null=True)

    Comment_Date_Card_3 = models.DateField(blank=True, null=True)
    Comment_Card_3= models.CharField(max_length=1000, blank=True, null=True)
    Comment_Telno_Card_3= models.CharField(max_length=15, blank=True, null=True)
    Comment_Person_Card_3= models.CharField(max_length=63, blank=True, null=True)

    Comment_Date_Card_4 = models.DateField(blank=True, null=True)
    Comment_Card_4= models.CharField(max_length=1000, blank=True, null=True)
    Comment_Telno_Card_4= models.CharField(max_length=15, blank=True, null=True)
    Comment_Person_Card_4= models.CharField(max_length=63, blank=True, null=True)

    Comment_Date_Card_5 = models.DateField(blank=True, null=True)
    Comment_Card_5= models.CharField(max_length=1000, blank=True, null=True)
    Comment_Telno_Card_5= models.CharField(max_length=15, blank=True, null=True)
    Comment_Person_Card_5= models.CharField(max_length=63, blank=True, null=True)

    Comment_Date_Card_6 = models.DateField(blank=True, null=True)
    Comment_Card_6= models.CharField(max_length=1000, blank=True, null=True)
    Comment_Telno_Card_6= models.CharField(max_length=15, blank=True, null=True)
    Comment_Person_Card_6= models.CharField(max_length=63, blank=True, null=True)

    Comment_Date_Card_7 = models.DateField(blank=True, null=True)
    Comment_Card_7= models.CharField(max_length=1000, blank=True, null=True)
    Comment_Telno_Card_7= models.CharField(max_length=15, blank=True, null=True)
    Comment_Person_Card_7= models.CharField(max_length=63, blank=True, null=True)
    
    def __str__(self):
            return self.Client_Card.CompanyName_Clients
    
class SalesOfferCard_Revise(models.Model):
    Revise_Owner=  models.ForeignKey(SalesOfferCard, on_delete=models.CASCADE,related_name="salesoffer_revises", blank=True, null=True)
    Client_Card=  models.ForeignKey(Clients, on_delete=models.CASCADE,related_name="client_salesoffer_revises", blank=True, null=True)
    Offer_Subject_Card= models.CharField(max_length=63, blank=True, null=True)
    Location_Card = models.CharField(max_length=200, blank=True, null=True)
    Cost_NotIncludingKDV_Card = TwoDecimalField(blank=True, null=True, default="0")
    Offer_Cost_NotIncludingKDV_Card = TwoDecimalField(blank=True, null=True, default="0")
    AC_Power_Card = TwoDecimalField(blank=True, null=True,default="0")
    DC_Power_Card = TwoDecimalField(blank=True, null=True,default="0")
    UnitCost_NotIncludingKDV = TwoDecimalField(blank=True, null=True, default="0")
    UnitOffer_NotIncludingKDV = TwoDecimalField(blank=True, null=True, default="0")
    Situation_Card = models.CharField(
        max_length=63,blank=True, null=True,
        choices=(
            ('Potansiyel Müşteri', 'Potansiyel Müşteri'),
            ('Maliyet Hesaplama', 'Maliyet Hesaplama'),
            ('Fiyat Belirleme', 'Fiyat Belirleme'),
            ('Teklif Hazırlama', 'Teklif Hazırlama'),
            ('Teklif Hazır', 'Teklif Hazır'),
            ('Teklif Sunuldu', 'Teklif Sunuldu'),
            ('Sunum Sonrası Görüşme', 'Sunum Sonrası Görüşme'),
        ),
        default='Potansiyel Müşteri',
    )    
    Date_Card = models.DateField(blank=True, null=True)
    Terrain_Roof_Card = models.CharField(
        max_length=63,blank=True, null=True,
        choices=(
            ('Çatı', 'Çatı'),
            ('Arazi', 'Arazi'),
        ),
    )    
    Roof_Cost_Card = models.IntegerField(blank=True, null=True, default="0")
    Person_Deal= models.CharField(max_length=63, blank=True, null=True)
    Person_Related= models.CharField(max_length=63, blank=True, null=True)
    Offer_File_Card = models.FileField(upload_to='offer_files', default="", blank=True, null=True)
    Offer_File_Card_2 = models.FileField(upload_to='offer_files', default="", blank=True, null=True)
    Offer_File_Card_3 = models.FileField(upload_to='offer_files', default="", blank=True, null=True)
    Offer_File_Card_4 = models.FileField(upload_to='offer_files', default="", blank=True, null=True)
    Offer_File_Card_5 = models.FileField(upload_to='offer_files', default="", blank=True, null=True)
    M_File_Card = models.FileField(upload_to='m_files', default="", blank=True, null=True)
    M_File_Card_2 = models.FileField(upload_to='m_files', default="", blank=True, null=True)
    M_File_Card_3 = models.FileField(upload_to='m_files', default="", blank=True, null=True)
    Is_Lost = models.BooleanField(default=False, blank=True, null=True)
    Is_Gain = models.BooleanField(default=False, blank=True, null=True)
    Is_late = models.BooleanField(default=False, blank=True, null=True)
    Unit_Cost_with_Roof_Cost= TwoDecimalField(blank=True, null=True)
    Unit_Offer_with_Roof_Cost= TwoDecimalField(blank=True, null=True)
    Profit_Rate_Card= TwoDecimalField(blank=True, null=True)    

    Comment_Date_Card_1 = models.DateField(blank=True, null=True)
    Comment_Card_1= models.CharField(max_length=1000, blank=True, null=True)
    Comment_Telno_Card_1= models.CharField(max_length=15, blank=True, null=True)
    Comment_Person_Card_1= models.CharField(max_length=63, blank=True, null=True)

    Comment_Date_Card_2 = models.DateField(blank=True, null=True)
    Comment_Card_2= models.CharField(max_length=1000, blank=True, null=True)
    Comment_Telno_Card_2= models.CharField(max_length=15, blank=True, null=True)
    Comment_Person_Card_2= models.CharField(max_length=63, blank=True, null=True)

    Comment_Date_Card_3 = models.DateField(blank=True, null=True)
    Comment_Card_3= models.CharField(max_length=1000, blank=True, null=True)
    Comment_Telno_Card_3= models.CharField(max_length=15, blank=True, null=True)
    Comment_Person_Card_3= models.CharField(max_length=63, blank=True, null=True)

    Comment_Date_Card_4 = models.DateField(blank=True, null=True)
    Comment_Card_4= models.CharField(max_length=1000, blank=True, null=True)
    Comment_Telno_Card_4= models.CharField(max_length=15, blank=True, null=True)
    Comment_Person_Card_4= models.CharField(max_length=63, blank=True, null=True)

    Comment_Date_Card_5 = models.DateField(blank=True, null=True)
    Comment_Card_5= models.CharField(max_length=1000, blank=True, null=True)
    Comment_Telno_Card_5= models.CharField(max_length=15, blank=True, null=True)
    Comment_Person_Card_5= models.CharField(max_length=63, blank=True, null=True)

    Comment_Date_Card_6 = models.DateField(blank=True, null=True)
    Comment_Card_6= models.CharField(max_length=1000, blank=True, null=True)
    Comment_Telno_Card_6= models.CharField(max_length=15, blank=True, null=True)
    Comment_Person_Card_6= models.CharField(max_length=63, blank=True, null=True)

    Comment_Date_Card_7 = models.DateField(blank=True, null=True)
    Comment_Card_7= models.CharField(max_length=1000, blank=True, null=True)
    Comment_Telno_Card_7= models.CharField(max_length=15, blank=True, null=True)
    Comment_Person_Card_7= models.CharField(max_length=63, blank=True, null=True)
    
    Revize_created_at = models.DateTimeField(default=timezone.now,blank=True, null=True)

#bakım modeli anket: anket, soru , cevap, sorunun not, zamanın notu,  
class Operation_Care(models.Model):
    Operation_Care_Company=  models.ForeignKey(PowerPlant, on_delete=models.CASCADE, related_name="client_operation_care")
    Operation_Care_Location = models.CharField(max_length=200, blank=True, null=True)
    Operation_Care_Inventor_Brand = models.CharField(max_length=200, blank=True, null=True)
    Operation_Care_Panel_Brand = models.CharField(max_length=200, blank=True, null=True)
    Operation_Care_Address = models.CharField(max_length=500, blank=True, null=True)
    Operation_Care_Terrain_Roof = models.CharField(
        max_length=63,blank=True, null=True,
        choices=(
            ('Çatı', 'Çatı'),
            ('Arazi', 'Arazi'),
        ),
    )        
    Operation_Care_Direction= models.CharField(
        max_length=63,blank=True, null=True,
        choices=(
            ('Kuzey', 'Kuzey'),
            ('Güney', 'Güney'),
            ('Doğu', 'Doğu'),
            ('Batı', 'Batı'),
        ),
    )    
    Operation_Care_Inventor_Power = models.IntegerField(blank=True, null=True, default="0")
    Operation_Care_Panel_Power = models.IntegerField(blank=True, null=True, default="0")
    Operation_Care_Inventor_Number = models.IntegerField(blank=True, null=True, default="0")
    Operation_Care_VOC = TwoDecimalField(blank=True, null=True, default="0")
    Operation_Care_AC_Power = FourDecimalField(blank=True, null=True, default="0")
    Operation_Care_DC_Power = FourDecimalField(blank=True, null=True, default="0")
    Operation_Care_Panel_Number_Str = models.IntegerField(blank=True, null=True, default="0")
    Operation_Care_Number_Str = models.IntegerField(blank=True, null=True, default="0")
    Operation_Care_Capacity = models.IntegerField(blank=True, null=True, default="0")
    Operation_Care_Cost = models.IntegerField(blank=True, null=True, default="0")
    Operation_Care_Start_Date = models.DateField(blank=True, null=True)
    Operation_Care_Finish_Date = models.DateField(blank=True, null=True)
    Operation_Care_endContract_Date = models.DateField(blank=True, null=True)
    Operation_Care_Has_Fail = models.BooleanField(default=False, blank=True, null=True)
    Operation_Care_Fail_Number = models.IntegerField(blank=True, null=True, default="0")
    Operation_Care_Switchgear_Material= models.CharField(max_length=200, blank=True, null=True)
    Operation_Care_Price = TwoDecimalField(blank=True, null=True, default="0")
    
class Fail(models.Model):
    Fail_Operation_Care=  models.ForeignKey(Operation_Care, on_delete=models.CASCADE, related_name="operation_fails")
    Fail_Central_Name = models.CharField(max_length=63, blank=True, null=True)
    Fail_Information_Person = models.CharField(max_length=63, blank=True, null=True)
    Fail_Guaranteed = models.CharField(
        max_length=63, null=True,
        choices=(
            ('Belirsiz', 'Belirsiz'),
            ('Evet', 'Evet'),
            ('Hayır', 'Hayır'),
        ),
        default="Belirlenmedi"
    )    
    Fail_Situation = models.CharField(
        max_length=63,blank=True, null=True,
        choices=(
            ('Belirlendi', 'Belirlendi'),
            ('Onarımda', 'Onarımda'),
            ('Onarıldı', 'Onarıldı'),

        ), 
        default="Belirlendi"
    )    
    Fail_Detection_Date = models.DateField(blank=True, null=True)
    Fail_Team_Info_Date = models.DateField(blank=True, null=True)
    Fail_Repair_Date = models.DateField(blank=True, null=True)
    Fail_Detail=models.CharField(max_length=400, blank=True, null=True) 
    Fail_Bill_Central_Name = models.CharField(max_length=63, blank=True, null=True)
    Fail_Bill_Process = models.CharField(max_length=63, blank=True, null=True)
    Fail_Bill_Date = models.DateField(blank=True, null=True)
    Fail_Bill_Detail=models.CharField(max_length=400, blank=True, null=True) 
    Fail_Bill_File = models.FileField(upload_to='fail_bills', default="", blank=True, null=True)
  
class Inventor(models.Model):
    Inventor_Owner=  models.ForeignKey(Operation_Care, on_delete=models.CASCADE, related_name="operation_inventors")
    Inventor_Direction= models.CharField( max_length=63,blank=True, null=True) 
    Inventor_Number = models.IntegerField(blank=True, null=True)
    Inventor_Number_Str = models.IntegerField(blank=True, null=True)
    Inventor_Panel_Power = models.IntegerField(blank=True, null=True, default="0")
    Inventor_Panel_Brand = models.CharField(max_length=200, blank=True, null=True)
    Inventor_Izolasion = models.CharField(max_length=200, blank=True, null=True)
    Inventor_VOC =TwoDecimalField(blank=True, null=True, default="0")
    Inventor_Panel_SY = models.IntegerField(blank=True, null=True, default="0")
    Inventor_AC_Power = FourDecimalField(blank=True, null=True, default="0")
    Inventor_DC_Power = FourDecimalField(blank=True, null=True, default="0")
    Inventor_Capacity = models.IntegerField(blank=True, null=True, default="0")
    Inventor_Pluse = FourDecimalField(blank=True, null=True, default="0")
    Inventor_Minus = FourDecimalField(blank=True, null=True, default="0")

class String(models.Model):
    String_Owner=  models.ForeignKey(Inventor, on_delete=models.CASCADE, related_name="inventor_strings")
    String_Direction= models.CharField( max_length=63,blank=True, null=True) 
    String_Number = models.IntegerField(blank=True, null=True)
    String_Panel_Power = models.IntegerField(blank=True, null=True, default="0")
    String_Panel_Brand = models.CharField(max_length=200, blank=True, null=True)
    String_VOC = TwoDecimalField(blank=True, null=True, default="0")
    String_Panel_SY = models.IntegerField(blank=True, null=True, default="0")
    String_Izolasion = models.CharField(max_length=200, blank=True, null=True)
    String_AC_Power = FourDecimalField(blank=True, null=True, default="0")
    String_DC_Power = FourDecimalField(blank=True, null=True, default="0")
    String_Capacity = models.IntegerField(blank=True, null=True, default="0")
    String_Percent = TwoDecimalField(blank=True, null=True, default="0")
    String_Date = models.DateField(blank=True, null=True)
    String_Pluse = FourDecimalField(blank=True, null=True, default="0")
    String_Minus = FourDecimalField(blank=True, null=True, default="0")


class Poll(models.Model):
    Poll_Operation_Care=  models.ForeignKey(Operation_Care, on_delete=models.CASCADE, related_name="op_poll")
    Poll_Date = models.DateField()
    Note_1_1 = models.CharField(max_length=127, blank=True, null=True)
    Note_1_2 = models.CharField(max_length=127, blank=True, null=True)
    Note_1_3 = models.CharField(max_length=127, blank=True, null=True)
    Note_1_4 = models.CharField(max_length=127, blank=True, null=True)
    Note_1_5 = models.CharField(max_length=127, blank=True, null=True)
    Note_1_6 = models.CharField(max_length=127, blank=True, null=True)
    Note_2_1 = models.CharField(max_length=127, blank=True, null=True)
    Note_2_2 = models.CharField(max_length=127, blank=True, null=True)
    Note_2_3 = models.CharField(max_length=127, blank=True, null=True)
    Note_2_4 = models.CharField(max_length=127, blank=True, null=True)
    Note_2_5 = models.CharField(max_length=127, blank=True, null=True)
    Note_2_6 = models.CharField(max_length=127, blank=True, null=True)
    Note_2_7 = models.CharField(max_length=127, blank=True, null=True)
    Note_3_1 = models.CharField(max_length=127, blank=True, null=True)
    Note_3_2 = models.CharField(max_length=127, blank=True, null=True)
    Note_3_3 = models.CharField(max_length=127, blank=True, null=True)
    Note_3_4 = models.CharField(max_length=127, blank=True, null=True)
    Note_4_1 = models.CharField(max_length=127, blank=True, null=True)
    Note_4_2 = models.CharField(max_length=127, blank=True, null=True)
    Note_4_3 = models.CharField(max_length=127, blank=True, null=True)
    Note_4_4 = models.CharField(max_length=127, blank=True, null=True)
    Note_4_5 = models.CharField(max_length=127, blank=True, null=True)
    Note_5_1 = models.CharField(max_length=127, blank=True, null=True)
    Note_5_2 = models.CharField(max_length=127, blank=True, null=True)
    Note_5_3 = models.CharField(max_length=127, blank=True, null=True)
    Note_5_4 = models.CharField(max_length=127, blank=True, null=True)
    Note_6_1 = models.CharField(max_length=127, blank=True, null=True)
    Note_6_2 = models.CharField(max_length=127, blank=True, null=True)
    Note_6_3 = models.CharField(max_length=127, blank=True, null=True)
    Note_6_4 = models.CharField(max_length=127, blank=True, null=True)
    Note_6_5 = models.CharField(max_length=127, blank=True, null=True)
    Note_6_6 = models.CharField(max_length=127, blank=True, null=True)
    Note_7_1 = models.CharField(max_length=127, blank=True, null=True)
    Note_7_2 = models.CharField(max_length=127, blank=True, null=True)
    Note_7_3 = models.CharField(max_length=127, blank=True, null=True)
    Note_7_4 = models.CharField(max_length=127, blank=True, null=True)
    Note_7_5 = models.CharField(max_length=127, blank=True, null=True)
    Note_7_6 = models.CharField(max_length=127, blank=True, null=True)
    Note_7_7 = models.CharField(max_length=127, blank=True, null=True)
    Note_8_1 = models.CharField(max_length=127, blank=True, null=True)
    Note_8_2 = models.CharField(max_length=127, blank=True, null=True)
    Note_8_3 = models.CharField(max_length=127, blank=True, null=True)
    Note_8_4 = models.CharField(max_length=127, blank=True, null=True)
    Note_8_5 = models.CharField(max_length=127, blank=True, null=True)
    Note_8_6 = models.CharField(max_length=127, blank=True, null=True)
    Note_8_7 = models.CharField(max_length=127, blank=True, null=True)
    Note_8_8 = models.CharField(max_length=127, blank=True, null=True)
    Note_9_1 = models.CharField(max_length=127, blank=True, null=True)
    Note_9_2 = models.CharField(max_length=127, blank=True, null=True)
    Note_9_3 = models.CharField(max_length=127, blank=True, null=True)
    Note_9_4 = models.CharField(max_length=127, blank=True, null=True)
    Note_9_5 = models.CharField(max_length=127, blank=True, null=True)
    Cloumn_Note_Text= models.TextField(max_length=1000, blank=True, null=True)
    Cloumn_Organizer= models.CharField(max_length=100, blank=True, null=True)
    Cloumn_Organize_Date= models.DateField(blank=True, null=True)
    Cloumn_Looker= models.CharField(max_length=100, blank=True, null=True)
    Cloumn_Looker_Date= models.DateField(blank=True, null=True)
    answer_1_1 = models.BooleanField(blank=True, null=True)
    answer_1_2 = models.BooleanField(blank=True, null=True)
    answer_1_3 = models.BooleanField(blank=True, null=True)
    answer_1_4 = models.BooleanField(blank=True, null=True)
    answer_1_5 = models.BooleanField(blank=True, null=True)
    answer_1_6 = models.BooleanField(blank=True, null=True)
    answer_2_1 = models.BooleanField(blank=True, null=True)
    answer_2_2 = models.BooleanField(blank=True, null=True)
    answer_2_3 = models.BooleanField(blank=True, null=True)
    answer_2_4 = models.BooleanField(blank=True, null=True)
    answer_2_5 = models.BooleanField(blank=True, null=True)
    answer_2_6 = models.BooleanField(blank=True, null=True)
    answer_2_7 = models.BooleanField(blank=True, null=True)
    answer_3_1 = models.BooleanField(blank=True, null=True)
    answer_3_2 = models.BooleanField(blank=True, null=True)
    answer_3_3 = models.BooleanField(blank=True, null=True)
    answer_3_4 = models.BooleanField(blank=True, null=True)
    answer_4_1 = models.BooleanField(blank=True, null=True)
    answer_4_2 = models.BooleanField(blank=True, null=True)
    answer_4_3 = models.BooleanField(blank=True, null=True)
    answer_4_4 = models.BooleanField(blank=True, null=True)
    answer_4_5 = models.BooleanField(blank=True, null=True)
    answer_5_1 = models.BooleanField(blank=True, null=True)
    answer_5_2 = models.BooleanField(blank=True, null=True)
    answer_5_3 = models.BooleanField(blank=True, null=True)
    answer_5_4 = models.BooleanField(blank=True, null=True)
    answer_6_1 = models.BooleanField(blank=True, null=True)
    answer_6_2 = models.BooleanField(blank=True, null=True)
    answer_6_3 = models.BooleanField(blank=True, null=True)
    answer_6_4 = models.BooleanField(blank=True, null=True)
    answer_6_5 = models.BooleanField(blank=True, null=True)
    answer_6_6 = models.BooleanField(blank=True, null=True)
    answer_7_1 = models.BooleanField(blank=True, null=True)
    answer_7_2 = models.BooleanField(blank=True, null=True)
    answer_7_3 = models.BooleanField(blank=True, null=True)
    answer_7_4 = models.BooleanField(blank=True, null=True)
    answer_7_5 = models.BooleanField(blank=True, null=True)
    answer_7_6 = models.BooleanField(blank=True, null=True)
    answer_7_7 = models.BooleanField(blank=True, null=True)
    answer_8_1 = models.BooleanField(blank=True, null=True)
    answer_8_2 = models.BooleanField(blank=True, null=True)
    answer_8_3 = models.BooleanField(blank=True, null=True)
    answer_8_4 = models.BooleanField(blank=True, null=True)
    answer_8_5 = models.BooleanField(blank=True, null=True)
    answer_8_6 = models.BooleanField(blank=True, null=True)
    answer_8_7 = models.BooleanField(blank=True, null=True)
    answer_8_8 = models.BooleanField(blank=True, null=True)
    answer_9_1 = models.BooleanField(blank=True, null=True)
    answer_9_2 = models.BooleanField(blank=True, null=True)
    answer_9_3 = models.BooleanField(blank=True, null=True)
    answer_9_4 = models.BooleanField(blank=True, null=True)
    answer_9_5 = models.BooleanField(blank=True, null=True)


class Date(models.Model):
    Date_Year = models.IntegerField(blank=True, null=True, verbose_name="Year")
    Date_Month = models.IntegerField(blank=True, null=True, verbose_name="Month")
    Date_Day = models.IntegerField(blank=True, null=True, verbose_name="Day")

    class Meta:
        verbose_name = "Date"
        verbose_name_plural = "Dates"

    def __str__(self):
        return f"{self.Date_Year or '----'}-{self.Date_Month or '--'}-{self.Date_Day or '--'}"

class Events(models.Model):
    Event_Date=  models.ForeignKey(Date, on_delete=models.CASCADE, related_name="date_events")
    Event_Title= models.CharField( max_length=63,blank=True, null=True) 
    Event_Time= models.CharField( max_length=63,blank=True, null=True) 

    