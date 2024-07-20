from django import forms
from datetime import datetime
from .models import Project, Expenses, Incomes, JobHistory, Operation_Care ,CompanyNames, SalesOfferCard, MyCompanyNames, Locations, Terrain_Roof, Banks, Clients, Supplier, Details, Situations, Fail
   
min_date = datetime(2000, 1, 1)
max_date = datetime(2099, 12, 30) 

class ProjectForm(forms.ModelForm):
 
    ProjectName = forms.CharField(
        required=True,
        max_length=63,
        label="Proje Adını Giriniz",
         error_messages={
            'required': '! Lütfen Proje Adını Giriniz',
            'unique': '! Bu İsime Sahip bir Proje Mevcut'  # Özel hata mesajı
        }
        )
    ProjectCode = forms.CharField(
        widget=forms.TextInput(attrs={'autocomplete': 'off'}),
        required=True,
        max_length=63,
         error_messages={
            'required': '! Lütfen Proje Kodunu Giriniz',
             # Özel hata mesajı
        }
        )
    CompanyName = forms.CharField(
        max_length=63,
        error_messages={
            'required': '! Lütfen Firma Adını Seçiniz'  # Özel hata mesajı
        }
    )  
    CompanyUndertakingWork = forms.ModelChoiceField(
        queryset=MyCompanyNames.objects.all(),
        empty_label="İşi Üstlenen Firma Adını Seçiniz",
        required=False
    )    
    Location = forms.CharField(
        required=False,
    )    
    Cost_NotIncludingKDV = forms.FloatField(required=False)        
    AC_Power = forms.IntegerField(required=False,)
    DC_Power = forms.IntegerField(required=False,)
    CalculatedCost_NotIncludingKDV = forms.DecimalField(  
        max_digits=17,
        decimal_places=4,
        required=False,
    )
    RealizedCost_NotIncludingKDV = forms.DecimalField(  
        max_digits=17,
        decimal_places=4,
        required=False,
    )
    Incentive = forms.ChoiceField(
        choices=[(False, 'Hayır'), (True, 'Evet')],
        widget=forms.Select(attrs={'class': 'form-control'}),
        required=False,
    )
    CalculatedProfit_Loss = forms.DecimalField(  
        max_digits=17,
        decimal_places=4,
        required=False,
    )
    RealizedProfit_Loss = forms.DecimalField(  
        max_digits=17,
        decimal_places=4,
        required=False,
    )
    CalculatedProfitRate = forms.DecimalField(  
        max_digits=8,
        decimal_places=4,
        required=False,
    )
    RealizedProfitRate = forms.DecimalField(  
        max_digits=8,
        decimal_places=4,
        required=False,
    )
    Terrain_Roof = forms.ModelChoiceField(
        queryset=Terrain_Roof.objects.all(),
        required=False,
        empty_label= 'Seçiniz',
    )    
    KDV_Rate = forms.CharField(  
        required=False,
        initial="%20.0",
        max_length=12,

    )
    Situation = forms.ModelChoiceField(
        queryset=Situations.objects.all(),
        required=False,
        empty_label= 'Seçiniz',
    )    
    StartDate = forms.DateField(
        label='Tarih Seçiniz', 
        widget=forms.widgets.DateInput(attrs={'type': 'date', 'min': min_date, 'max': max_date}),
        required=False,
    )
    FinishDate = forms.DateField(
        label='Tarih Seçiniz', 
        widget=forms.widgets.DateInput(attrs={'type': 'date', 'min': min_date, 'max': max_date}),
        required=False,
    )

    class Meta:
        model = Project
        fields = ['CompanyName', 'Location', 'AC_Power', 'DC_Power', 'CompanyUndertakingWork',
                'CalculatedCost_NotIncludingKDV', 'RealizedCost_NotIncludingKDV','CalculatedProfit_Loss', 
                'RealizedProfit_Loss', 'CalculatedProfitRate', 'RealizedProfitRate', 'Cost_NotIncludingKDV', 
                'KDV_Rate', 'Terrain_Roof', 'Incentive','Situation',
                  'StartDate', 'FinishDate','ProjectName','ProjectCode']
        
    def __init__(self, *args, **kwargs):
        super(ProjectForm, self).__init__(*args, **kwargs)
    
    def clean_project_name(self):
        project_name = self.cleaned_data.get('ProjectName')
        if Project.objects.filter(ProjectName=project_name).exists():
            raise forms.ValidationError("Bu Proje İsmi zaten kullanılıyor. Lütfen başka birProje İsmi seçin")
        return project_name

class ExpensesForm(forms.ModelForm):
    ProjectName_Expenses_Copy = forms.CharField(max_length=63, required=False)
    ProjectName_Expenses = forms.CharField(
        max_length=63, 
        error_messages={
            'required': '! Lütfen Proje Adını Seçiniz'  # Özel hata mesajı
        }
        )
    CompanyName_Expenses = forms.CharField(max_length=63, required=False)
    CompanyName_FromPaymentMade_Expenses = forms.ModelChoiceField(
        queryset=MyCompanyNames.objects.all(),
        empty_label="Firma Adını Seçiniz",
        required=False
    )
    CompanyName_Paying_Expenses = forms.CharField(
        error_messages={
            'required': '! Lütfen Şirket Adını Seçiniz'  # Özel hata mesajı
        }
    )
    ExpensDetails_Expenses = forms.CharField(
        required=False
    )
    Amount_Expenses = forms.DecimalField(  
        max_digits=17,
        decimal_places=4,
        required=False,
    )
    Dollar_Rate_Expenses = forms.DecimalField(  
        max_digits=8,
        decimal_places=4,
        required=False,
    )
    Bank_Expenses = forms.CharField(
        required=False,
    )
    Date_Expenses = forms.DateField(
        label='Tarih Seçiniz',
        widget=forms.widgets.DateInput(attrs={'type': 'date'}),
        required=False,
    )

    class Meta:
        model = Expenses
        fields = ['CompanyName_Expenses', 'CompanyName_FromPaymentMade_Expenses', 'CompanyName_Paying_Expenses',
                  'ExpensDetails_Expenses', 'Amount_Expenses', 'Dollar_Rate_Expenses', 'Bank_Expenses',
                  'Date_Expenses', 'ProjectName_Expenses', 'ProjectName_Expenses_Copy']   

class JobHistoryForm(forms.ModelForm):
    ProjectName_JobHistory_Copy = forms.CharField(max_length=63, required=False,widget=forms.TextInput(attrs={'autocomplete': 'off'}),)
    ProjectName_JobHistory = forms.CharField(
        widget=forms.TextInput(attrs={'autocomplete': 'off'}),
        max_length=63, 
        error_messages={
            'required': '! Lütfen Proje Adını Seçiniz'
         # Özel hata mesajı
        }
    )
    CompanyName_FromJobMade_JobHistory = forms.ModelChoiceField(
        queryset=MyCompanyNames.objects.all(),
        empty_label="Firma Adını Seçiniz",
        required=False,
        label='CompanyName_FromJobMade'
    )
    CompanyName_Job_JobHistory = forms.CharField(
        widget=forms.TextInput(attrs={'autocomplete': 'off'}),
         error_messages={
            'required': '! Lütfen Firma Adını Seçiniz'  # Özel hata mesajı
        }
    )
  
    ExpensDetails_JobHistory = forms.CharField(required=False, max_length=1000, initial='Diğer',widget=forms.TextInput(attrs={'autocomplete': 'off'}),)
    Invoice_No_JobHistory = forms.CharField(required=False, max_length=63,widget=forms.TextInput(attrs={'autocomplete': 'off'}),)
    Amount_JobHistory = forms.DecimalField(  
        widget=forms.TextInput(attrs={'autocomplete': 'off'}),
        max_digits=17,
        decimal_places=4,
        required=False,
    )
    Dollar_Rate_JobHistory = forms.DecimalField(
        widget=forms.TextInput(attrs={'autocomplete': 'off'}),
        max_digits=8,
        decimal_places=4,
        required=False,
       )
    Date_JobHistory = forms.DateField(
        label='Tarih Seçiniz',
        widget=forms.widgets.DateInput(attrs={'type': 'date'}),
        required=False
    )

    class Meta:
        model = JobHistory
        fields = ['ProjectName_JobHistory', 'CompanyName_FromJobMade_JobHistory', 'CompanyName_Job_JobHistory','ProjectName_JobHistory_Copy',
                  'ExpensDetails_JobHistory', 'Amount_JobHistory', 'Dollar_Rate_JobHistory', 'Date_JobHistory', 'Invoice_No_JobHistory']

class IncomesForm(forms.ModelForm):
    ProjectName_Incomes_Copy = forms.CharField(max_length=63, required=False, widget=forms.TextInput(attrs={'autocomplete': 'off'}))
    ProjectName_Incomes = forms.CharField(
        widget=forms.TextInput(attrs={'autocomplete': 'off'}),
        error_messages={
            'required': '! Lütfen Proje Adını Giriniz'  # Özel hata mesajı
        }
    )       
    CompanyName_ReceivePayment_Incomes = forms.ModelChoiceField(
        queryset=MyCompanyNames.objects.all(),
        empty_label= "Firma Adını Seçiniz",
        widget=forms.Select(attrs={'class': 'form-control'}),
        required=False
    )
    CompanyName_Pay_Incomes = forms.CharField(
        max_length=63, 
        widget=forms.TextInput(attrs={'autocomplete': 'off'}),
        error_messages={
            'required': '! Lütfen Ödeme Yapan Firmanın Adını Seçiniz'  # Özel hata mesajı
        }
        )
    Amount_Incomes_Incomes = forms.DecimalField(  
        widget=forms.TextInput(attrs={'autocomplete': 'off'}),
        max_digits=17,
        decimal_places=4,
        required=False,
    )
    Dollar_Rate_Incomes = forms.DecimalField(
        widget=forms.TextInput(attrs={'autocomplete': 'off'}),
        max_digits=8,
        decimal_places=4,
        required=False,
       )
    PaymentType_Incomes = forms.ChoiceField(
        choices=[('','Ödeme Yöntemi Seçiniz'), ('Kredi Kartı', 'Kredi Kartı'), ('EFT', 'EFT'), ('Çek', 'Çek')],
        widget=forms.Select(attrs={'class': 'form-control'}),
        required=False,
    )
    ChekDate_Incomes = forms.DateField(
        required=False,
        widget=forms.SelectDateWidget(attrs={'class': 'form-control'}),
        )
    LastChekDate_Incomes = forms.DateField(
        required=False,
        widget=forms.SelectDateWidget(attrs={'class': 'form-control'}),
        )

    class Meta:
        model = Incomes
        fields = ['ProjectName_Incomes','CompanyName_ReceivePayment_Incomes','Dollar_Rate_Incomes','ProjectName_Incomes_Copy',
                   'Amount_Incomes','PaymentType_Incomes','ChekDate_Incomes', "LastChekDate_Incomes","CompanyName_Pay_Incomes"
                  ]

class ClientsForm(forms.ModelForm):
    
        
    CompanyName_Clients = forms.CharField(
        max_length=63,
        widget=forms.TextInput(attrs={'autocomplete': 'off'}),
        error_messages={
            'required': '! Lütfen Firma Adını Giriniz',
            'unique': '! Bu İsime Sahip bir Firma Mevcut'  # Özel hata mesajı
        }
        )
    ContactPerson = forms.CharField(max_length=63, required=False,widget=forms.TextInput(attrs={'autocomplete': 'off'}))
    PhoneNumber = forms.CharField(max_length=15, required=False,widget=forms.TextInput(attrs={'autocomplete': 'off'}))
    Email= forms.CharField(max_length=63, required=False,widget=forms.TextInput(attrs={'autocomplete': 'off'}))
    Location = forms.CharField(
        required=False,
    ) 
    class Meta:
        model = Clients 
        fields = '__all__'

class SupplierForm(forms.ModelForm):

    
    CompanyName_Supplier = forms.CharField(
        max_length=63,
        widget=forms.TextInput(attrs={'autocomplete': 'off'}),
        error_messages={
            'required': '! Lütfen Firma Adını Giriniz',
            'unique': '! Bu İsime Sahip bir Firma Mevcut'  # Özel hata mesajı
        }
    )
    ContactPerson = forms.CharField(max_length=63, required=False, widget=forms.TextInput(attrs={'autocomplete': 'off'}),)
    PhoneNumber = forms.CharField(max_length=15, required=False, widget=forms.TextInput(attrs={'autocomplete': 'off'})),
    Email= forms.CharField(max_length=63, required=False, widget=forms.TextInput(attrs={'autocomplete': 'off'}))
    Location = forms.CharField(
        required=False,
        widget=forms.TextInput(attrs={'autocomplete': 'off'}),
    ) 
    class Meta:
        model = Supplier 
        fields = '__all__'   

class SalesOfferCardForm(forms.ModelForm):

    Client_Card = forms.ModelChoiceField(
        queryset=Clients.objects.all(),
        required=False,
        )
    Offer_Subject_Card = forms.CharField(
        max_length=400,
        required=False,
    )    
    Location_Card = forms.CharField(
        required=False,
    )    
    Cost_NotIncludingKDV_Card = forms.DecimalField(  
        max_digits=10,
        decimal_places=2,
        required=False,
    )      
    AC_Power_Card = forms.IntegerField(required=False,)
    DC_Power_Card = forms.IntegerField(required=False,)
    UnitCost_NotIncludingKDV = forms.DecimalField(  
        max_digits=10,
        decimal_places=2,
        required=False,
    )
   
    Situation_Card = forms.ChoiceField(
        choices=[
            ('Potansiyel Müşteri', 'Potansiyel Müşteri'),
            ('Maliyet Hesaplama', 'Maliyet Hesaplama'),
            ('Fiyat Belirleme', 'Fiyat Belirleme'),
            ('Teklif Hazırlama', 'Teklif Hazırlama'),
            ('Teklif Hazır', 'Teklif Hazır'),
            ('Teklif Sunuldu', 'Teklif Sunuldu'),
            ('Sunum Sonrası Görüşme', 'Sunum Sonrası Görüşme'),

         ],
        required=False,
        initial="Potansiyel Müşteri"
    )
   
    Terrain_Roof = forms.ChoiceField(
        choices=[
            ('Çatı', 'Çatı'),
            ('Arazi', 'Arazi'),
        ],
        required=False,
    )    
    Date_Card = forms.DateField(
        label='Tarih Seçiniz', 
        widget=forms.widgets.DateInput(attrs={'type': 'date', 'min': min_date, 'max': max_date}),
        required=False,
    )
    Comment_Date_Card = forms.DateField(
        label='Tarih Seçiniz', 
        widget=forms.widgets.DateInput(attrs={'type': 'date', 'min': min_date, 'max': max_date}),
        required=False,
    )
    Offer_Comment_Card = forms.CharField(max_length=400, required=False)

    class Meta:
        model = SalesOfferCard
        fields = '__all__'

class Operation_CareForm(forms.ModelForm):

    class Meta:
        model = Operation_Care
        fields = '__all__'

class FailForm(forms.ModelForm):

    class Meta:
        model = Fail
        fields = '__all__'


