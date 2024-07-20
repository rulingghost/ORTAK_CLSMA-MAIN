from rest_framework import serializers
from AFM.models import Clients, Date, Events, Supplier, Project, Expenses, JobHistory, Incomes,  Fail, SalesOfferCard,SalesOfferCard_Revise, Operation_Care, Inventor, String, Poll, PowerPlant
from django.db.models import Max, Count

class ClientSerializer(serializers.ModelSerializer):


    class Meta:
        model = Clients
        fields = '__all__'

    def create(self, validated_data):
        return Clients.objects.create(**validated_data)

    def update(self, instance, validated_data):
        instance.CompanyName_Clients = validated_data.get('CompanyName_Clients', instance.CompanyName_Clients)
        instance.ContactPerson = validated_data.get('ContactPerson', instance.ContactPerson)
        instance.PhoneNumber = validated_data.get('PhoneNumber', instance.PhoneNumber)
        instance.Email = validated_data.get('Email', instance.Email)
        instance.Location = validated_data.get('Location', instance.Location)

        instance.save()
        return instance

class PowerPlantSerializer(serializers.ModelSerializer):

    class Meta:
        model = PowerPlant
        fields = '__all__'

    def create(self, validated_data):
        return PowerPlant.objects.create(**validated_data)

    def update(self, instance, validated_data):
        instance.PowerPlantName = validated_data.get('PowerPlantName', instance.PowerPlantName)
        

        instance.save()
        return instance

class SupplierSerializer(serializers.ModelSerializer):
    class Meta:
        model = Supplier
        fields = '__all__'

    def create(self, validated_data):
        return Supplier.objects.create(**validated_data)

    def update(self, instance, validated_data):
        instance.CompanyName_Supplier = validated_data.get('CompanyName_Supplier', instance.CompanyName_Supplier)
        instance.ContactPerson = validated_data.get('ContactPerson', instance.ContactPerson)
        instance.PhoneNumber = validated_data.get('PhoneNumber', instance.PhoneNumber)
        instance.Email = validated_data.get('Email', instance.Email)
        instance.Location = validated_data.get('Location', instance.Location)

        instance.save()
        return instance
    
class ExpensesSerializer(serializers.ModelSerializer):
    supplier_expenses = SupplierSerializer(source='CompanyName_Paying_Expenses', read_only=True)

    class Meta:
        model = Expenses
        fields = '__all__'

    def create(self, validated_data):
        return Expenses.objects.create(**validated_data)

    def update(self, instance, validated_data):
        instance.Project_Expenses = validated_data.get('Project_Expenses', instance.Project_Expenses)
        instance.CompanyName_FromPaymentMade_Expenses = validated_data.get('CompanyName_FromPaymentMade_Expenses', instance.CompanyName_FromPaymentMade_Expenses)
        instance.CompanyName_Paying_Expenses = validated_data.get('CompanyName_Paying_Expenses', instance.CompanyName_Paying_Expenses)
        instance.ExpensDetails_Expenses = validated_data.get('ExpensDetails_Expenses', instance.ExpensDetails_Expenses)
        instance.Amount_Expenses = validated_data.get('Amount_Expenses', instance.Amount_Expenses)
        instance.Dollar_Rate_Expenses = validated_data.get('Dollar_Rate_Expenses', instance.Dollar_Rate_Expenses)
        instance.Bank_Expenses = validated_data.get('Bank_Expenses', instance.Bank_Expenses)
        instance.Date_Expenses = validated_data.get('Date_Expenses', instance.Date_Expenses)
        instance.save()
        return instance

class JobHistorySerializer(serializers.ModelSerializer):
    supplier_jobhistories = SupplierSerializer(source='CompanyName_Job_JobHistory', read_only=True)

    class Meta:
        model = JobHistory
        fields = '__all__'

    def create(self, validated_data):
        return JobHistory.objects.create(**validated_data)

    def update(self, instance, validated_data):
        instance.Project_JobHistory = validated_data.get('Project_JobHistory', instance.Project_JobHistory)
        instance.CompanyName_FromJobMade_JobHistory = validated_data.get('CompanyName_FromJobMade_JobHistory', instance.CompanyName_FromJobMade_JobHistory)
        instance.CompanyName_Job_JobHistory = validated_data.get('CompanyName_Job_JobHistory', instance.CompanyName_Job_JobHistory)
        instance.ExpensDetails_JobHistory = validated_data.get('ExpensDetails_JobHistory', instance.ExpensDetails_JobHistory)
        instance.Invoice_No_JobHistory = validated_data.get('Invoice_No_JobHistory', instance.Invoice_No_JobHistory)
        instance.Amount_JobHistory = validated_data.get('Amount_JobHistory', instance.Amount_JobHistory)
        instance.Dollar_Rate_JobHistory = validated_data.get('Dollar_Rate_JobHistory', instance.Dollar_Rate_JobHistory)
        instance.Date_JobHistory = validated_data.get('Date_JobHistory', instance.Date_JobHistory)

        instance.save()
        return instance
    
class IncomesSerializer(serializers.ModelSerializer):
    client_incomes = ClientSerializer(source='CompanyName_Pay_Incomes', read_only=True)

    class Meta:
        model = Incomes
        fields = '__all__'
    
    def create(self, validated_data):
        return Incomes.objects.create(**validated_data)

    def update(self, instance, validated_data):
        instance.Project_Incomes = validated_data.get('Project_Incomes', instance.Project_Incomes)
        instance.CompanyName_ReceivePayment_Incomes = validated_data.get('CompanyName_ReceivePayment_Incomes', instance.CompanyName_ReceivePayment_Incomes)
        instance.CompanyName_Pay_Incomes = validated_data.get('CompanyName_Pay_Incomes', instance.CompanyName_Pay_Incomes)
        instance.Amount_Incomes = validated_data.get('Amount_Incomes', instance.Amount_Incomes)
        instance.Dollar_Rate_Incomes = validated_data.get('Dollar_Rate_Incomes', instance.Dollar_Rate_Incomes)
        instance.PaymentType_Incomes = validated_data.get('PaymentType_Incomes', instance.PaymentType_Incomes)
        instance.ChekDate_Incomes = validated_data.get('ChekDate_Incomes', instance.ChekDate_Incomes)
        instance.LastChekDate_Incomes = validated_data.get('LastChekDate_Incomes', instance.LastChekDate_Incomes)
        instance.save()
        return instance

class SalesOfferCardReviseSerializer(serializers.ModelSerializer):
    
    client = ClientSerializer(source='Client_Card', read_only=True)

    class Meta:
        model = SalesOfferCard_Revise
        fields = '__all__'
    
    def create(self, validated_data):
        return SalesOfferCard_Revise.objects.create(**validated_data)

    def update(self, instance, validated_data):
        instance.Revise_Owner = validated_data.get('Revise_Owner', instance.Revise_Owner)
        instance.Client_Card = validated_data.get('Client_Card', instance.Client_Card)
        instance.Offer_Subject_Card = validated_data.get('Offer_Subject_Card', instance.Offer_Subject_Card)
        instance.Location_Card = validated_data.get('Location_Card', instance.Location_Card)
        instance.Cost_NotIncludingKDV_Card = validated_data.get('Cost_NotIncludingKDV_Card', instance.Cost_NotIncludingKDV_Card)
        instance.Offer_Cost_NotIncludingKDV_Card = validated_data.get('Offer_Cost_NotIncludingKDV_Card', instance.Offer_Cost_NotIncludingKDV_Card)
        instance.AC_Power_Card = validated_data.get('AC_Power_Card', instance.AC_Power_Card)
        instance.DC_Power_Card = validated_data.get('DC_Power_Card', instance.DC_Power_Card)
        instance.UnitCost_NotIncludingKDV = validated_data.get('UnitCost_NotIncludingKDV', instance.UnitCost_NotIncludingKDV)
        instance.UnitOffer_NotIncludingKDV = validated_data.get('UnitOffer_NotIncludingKDV', instance.UnitOffer_NotIncludingKDV)
        instance.Situation_Card = validated_data.get('Situation_Card', instance.Situation_Card)
        instance.Date_Card = validated_data.get('Date_Card', instance.Date_Card)
        instance.Terrain_Roof_Card = validated_data.get('Terrain_Roof_Card', instance.Terrain_Roof_Card)
        instance.Roof_Cost_Card = validated_data.get('Roof_Cost_Card', instance.Roof_Cost_Card)
        instance.Comment_Date_Card = validated_data.get('Comment_Date_Card', instance.Comment_Date_Card)
        instance.Person_Deal = validated_data.get('Person_Deal', instance.Person_Deal)
        instance.Person_Related = validated_data.get('Person_Related', instance.Person_Related)
        instance.Offer_Comment_Card = validated_data.get('Offer_Comment_Card', instance.Offer_Comment_Card)
        instance.Offer_File_Card = validated_data.get('Offer_File_Card', instance.Offer_File_Card)
        instance.Offer_File_Card_2 = validated_data.get('Offer_File_Card_2', instance.Offer_File_Card_2)
        instance.Offer_File_Card_3 = validated_data.get('Offer_File_Card_3', instance.Offer_File_Card_3)
        instance.Offer_File_Card_4 = validated_data.get('Offer_File_Card_4', instance.Offer_File_Card_4)
        instance.Offer_File_Card_5 = validated_data.get('Offer_File_Card_5', instance.Offer_File_Card_5)
        instance.M_File_Card = validated_data.get('M_File_Card', instance.M_File_Card)
        instance.M_File_Card_2 = validated_data.get('M_File_Card_2', instance.M_File_Card_2)
        instance.M_File_Card_3 = validated_data.get('M_File_Card_3', instance.M_File_Card_3)
        instance.Is_Lost = validated_data.get('Is_Lost', instance.Is_Lost)
        instance.Is_Gain = validated_data.get('Is_Gain', instance.Is_Gain)
        instance.Is_late = validated_data.get('Is_late', instance.Is_late)
        instance.Unit_Cost_with_Roof_Cost = validated_data.get('Unit_Cost_with_Roof_Cost', instance.Unit_Cost_with_Roof_Cost)
        instance.Unit_Offer_with_Roof_Cost = validated_data.get('Unit_Offer_with_Roof_Cost', instance.Unit_Offer_with_Roof_Cost)
        instance.Profit_Rate_Card = validated_data.get('Profit_Rate_Card', instance.Profit_Rate_Card)
        
        instance.Comment_Date_Card_1 = validated_data.get('Comment_Date_Card_1', instance.Comment_Date_Card_1)
        instance.Comment_Card_1 = validated_data.get('Comment_Card_1', instance.Comment_Card_1)
        instance.Comment_Telno_Card_1 = validated_data.get('Comment_Telno_Card_1', instance.Comment_Telno_Card_1)
        instance.Comment_Person_Card_1 = validated_data.get('Comment_Person_Card_1', instance.Comment_Person_Card_1)

        instance.Comment_Date_Card_2 = validated_data.get('Comment_Date_Card_2', instance.Comment_Date_Card_2)
        instance.Comment_Card_2 = validated_data.get('Comment_Card_2', instance.Comment_Card_2)
        instance.Comment_Telno_Card_2 = validated_data.get('Comment_Telno_Card_2', instance.Comment_Telno_Card_2)
        instance.Comment_Person_Card_2 = validated_data.get('Comment_Person_Card_2', instance.Comment_Person_Card_2)

        instance.Comment_Date_Card_3 = validated_data.get('Comment_Date_Card_3', instance.Comment_Date_Card_3)
        instance.Comment_Card_3 = validated_data.get('Comment_Card_3', instance.Comment_Card_3)
        instance.Comment_Telno_Card_3 = validated_data.get('Comment_Telno_Card_3', instance.Comment_Telno_Card_3)
        instance.Comment_Person_Card_3 = validated_data.get('Comment_Person_Card_3', instance.Comment_Person_Card_3)

        instance.Comment_Date_Card_4 = validated_data.get('Comment_Date_Card_4', instance.Comment_Date_Card_4)
        instance.Comment_Card_4 = validated_data.get('Comment_Card_4', instance.Comment_Card_4)
        instance.Comment_Telno_Card_4 = validated_data.get('Comment_Telno_Card_4', instance.Comment_Telno_Card_4)
        instance.Comment_Person_Card_4 = validated_data.get('Comment_Person_Card_4', instance.Comment_Person_Card_4)

        instance.Comment_Date_Card_5 = validated_data.get('Comment_Date_Card_5', instance.Comment_Date_Card_5)
        instance.Comment_Card_5 = validated_data.get('Comment_Card_5', instance.Comment_Card_5)
        instance.Comment_Telno_Card_5 = validated_data.get('Comment_Telno_Card_5', instance.Comment_Telno_Card_5)
        instance.Comment_Person_Card_5 = validated_data.get('Comment_Person_Card_5', instance.Comment_Person_Card_5)

        instance.Comment_Date_Card_6 = validated_data.get('Comment_Date_Card_6', instance.Comment_Date_Card_6)
        instance.Comment_Card_6 = validated_data.get('Comment_Card_6', instance.Comment_Card_6)
        instance.Comment_Telno_Card_6 = validated_data.get('Comment_Telno_Card_6', instance.Comment_Telno_Card_6)
        instance.Comment_Person_Card_6 = validated_data.get('Comment_Person_Card_6', instance.Comment_Person_Card_6)

        instance.Comment_Date_Card_7 = validated_data.get('Comment_Date_Card_7', instance.Comment_Date_Card_7)
        instance.Comment_Card_7 = validated_data.get('Comment_Card_7', instance.Comment_Card_7)
        instance.Comment_Telno_Card_7 = validated_data.get('Comment_Telno_Card_7', instance.Comment_Telno_Card_7)
        instance.Comment_Person_Card_7 = validated_data.get('Comment_Person_Card_7', instance.Comment_Person_Card_7)

        
        instance.Revize_created_at = validated_data.get('Revize_created_at', instance.Revize_created_at)
        instance.save()
        return instance

class SalesOfferCardSerializer(serializers.ModelSerializer):
    salesoffer_revises= SalesOfferCardReviseSerializer(many=True, read_only=True)
    client = ClientSerializer(source='Client_Card', read_only=True)

    class Meta:
        model = SalesOfferCard
        fields = '__all__'
    
    def create(self, validated_data):
        return SalesOfferCard.objects.create(**validated_data)

    def update(self, instance, validated_data):
        instance.Client_Card = validated_data.get('Client_Card', instance.Client_Card)
        instance.Offer_Subject_Card = validated_data.get('Offer_Subject_Card', instance.Offer_Subject_Card)
        instance.Location_Card = validated_data.get('Location_Card', instance.Location_Card)
        instance.Cost_NotIncludingKDV_Card = validated_data.get('Cost_NotIncludingKDV_Card', instance.Cost_NotIncludingKDV_Card)
        instance.Offer_Cost_NotIncludingKDV_Card = validated_data.get('Offer_Cost_NotIncludingKDV_Card', instance.Offer_Cost_NotIncludingKDV_Card)
        instance.AC_Power_Card = validated_data.get('AC_Power_Card', instance.AC_Power_Card)
        instance.DC_Power_Card = validated_data.get('DC_Power_Card', instance.DC_Power_Card)
        instance.UnitCost_NotIncludingKDV = validated_data.get('UnitCost_NotIncludingKDV', instance.UnitCost_NotIncludingKDV)
        instance.UnitOffer_NotIncludingKDV = validated_data.get('UnitOffer_NotIncludingKDV', instance.UnitOffer_NotIncludingKDV)
        instance.Situation_Card = validated_data.get('Situation_Card', instance.Situation_Card)
        instance.Date_Card = validated_data.get('Date_Card', instance.Date_Card)
        instance.Terrain_Roof_Card = validated_data.get('Terrain_Roof_Card', instance.Terrain_Roof_Card)
        instance.Roof_Cost_Card = validated_data.get('Roof_Cost_Card', instance.Roof_Cost_Card)
        instance.Person_Deal = validated_data.get('Person_Deal', instance.Person_Deal)
        instance.Person_Related = validated_data.get('Person_Related', instance.Person_Related)
        instance.Offer_File_Card = validated_data.get('Offer_File_Card', instance.Offer_File_Card)
        instance.Offer_File_Card_2 = validated_data.get('Offer_File_Card_2', instance.Offer_File_Card_2)
        instance.Offer_File_Card_3 = validated_data.get('Offer_File_Card_3', instance.Offer_File_Card_3)
        instance.Offer_File_Card_4 = validated_data.get('Offer_File_Card_4', instance.Offer_File_Card_4)
        instance.Offer_File_Card_5 = validated_data.get('Offer_File_Card_5', instance.Offer_File_Card_5)
        instance.M_File_Card = validated_data.get('M_File_Card', instance.M_File_Card)
        instance.M_File_Card_2 = validated_data.get('M_File_Card_2', instance.M_File_Card_2)
        instance.M_File_Card_3 = validated_data.get('M_File_Card_3', instance.M_File_Card_3)
        instance.Is_Lost = validated_data.get('Is_Lost', instance.Is_Lost)
        instance.Is_Gain = validated_data.get('Is_Gain', instance.Is_Gain)
        instance.Is_late = validated_data.get('Is_late', instance.Is_late)
        instance.Unit_Cost_with_Roof_Cost = validated_data.get('Unit_Cost_with_Roof_Cost', instance.Unit_Cost_with_Roof_Cost)
        instance.Unit_Offer_with_Roof_Cost = validated_data.get('Unit_Offer_with_Roof_Cost', instance.Unit_Offer_with_Roof_Cost)
        instance.Profit_Rate_Card = validated_data.get('Profit_Rate_Card', instance.Profit_Rate_Card)

        instance.Comment_Date_Card_1 = validated_data.get('Comment_Date_Card_1', instance.Comment_Date_Card_1)
        instance.Comment_Card_1 = validated_data.get('Comment_Card_1', instance.Comment_Card_1)
        instance.Comment_Telno_Card_1 = validated_data.get('Comment_Telno_Card_1', instance.Comment_Telno_Card_1)
        instance.Comment_Person_Card_1 = validated_data.get('Comment_Person_Card_1', instance.Comment_Person_Card_1)

        instance.Comment_Date_Card_2 = validated_data.get('Comment_Date_Card_2', instance.Comment_Date_Card_2)
        instance.Comment_Card_2 = validated_data.get('Comment_Card_2', instance.Comment_Card_2)
        instance.Comment_Telno_Card_2 = validated_data.get('Comment_Telno_Card_2', instance.Comment_Telno_Card_2)
        instance.Comment_Person_Card_2 = validated_data.get('Comment_Person_Card_2', instance.Comment_Person_Card_2)

        instance.Comment_Date_Card_3 = validated_data.get('Comment_Date_Card_3', instance.Comment_Date_Card_3)
        instance.Comment_Card_3 = validated_data.get('Comment_Card_3', instance.Comment_Card_3)
        instance.Comment_Telno_Card_3 = validated_data.get('Comment_Telno_Card_3', instance.Comment_Telno_Card_3)
        instance.Comment_Person_Card_3 = validated_data.get('Comment_Person_Card_3', instance.Comment_Person_Card_3)

        instance.Comment_Date_Card_4 = validated_data.get('Comment_Date_Card_4', instance.Comment_Date_Card_4)
        instance.Comment_Card_4 = validated_data.get('Comment_Card_4', instance.Comment_Card_4)
        instance.Comment_Telno_Card_4 = validated_data.get('Comment_Telno_Card_4', instance.Comment_Telno_Card_4)
        instance.Comment_Person_Card_4 = validated_data.get('Comment_Person_Card_4', instance.Comment_Person_Card_4)

        instance.Comment_Date_Card_5 = validated_data.get('Comment_Date_Card_5', instance.Comment_Date_Card_5)
        instance.Comment_Card_5 = validated_data.get('Comment_Card_5', instance.Comment_Card_5)
        instance.Comment_Telno_Card_5 = validated_data.get('Comment_Telno_Card_5', instance.Comment_Telno_Card_5)
        instance.Comment_Person_Card_5 = validated_data.get('Comment_Person_Card_5', instance.Comment_Person_Card_5)

        instance.Comment_Date_Card_6 = validated_data.get('Comment_Date_Card_6', instance.Comment_Date_Card_6)
        instance.Comment_Card_6 = validated_data.get('Comment_Card_6', instance.Comment_Card_6)
        instance.Comment_Telno_Card_6 = validated_data.get('Comment_Telno_Card_6', instance.Comment_Telno_Card_6)
        instance.Comment_Person_Card_6 = validated_data.get('Comment_Person_Card_6', instance.Comment_Person_Card_6)

        instance.Comment_Date_Card_7 = validated_data.get('Comment_Date_Card_7', instance.Comment_Date_Card_7)
        instance.Comment_Card_7 = validated_data.get('Comment_Card_7', instance.Comment_Card_7)
        instance.Comment_Telno_Card_7 = validated_data.get('Comment_Telno_Card_7', instance.Comment_Telno_Card_7)
        instance.Comment_Person_Card_7 = validated_data.get('Comment_Person_Card_7', instance.Comment_Person_Card_7)

        instance.save()
        return instance

class ProjectSerializer(serializers.ModelSerializer):
    project_expenses= ExpensesSerializer(many=True, read_only=True)
    project_jobhistories= JobHistorySerializer(many=True, read_only=True)
    project_incomes= IncomesSerializer(many=True, read_only=True)
    client = ClientSerializer(source='Company_id', read_only=True)

    class Meta:
        model = Project
        fields = '__all__'
        #exclude = ['Company_id']
    def create(self, validated_data):
        return Project.objects.create(**validated_data)

    def update(self, instance, validated_data):
        instance.ProjectName = validated_data.get('ProjectName', instance.ProjectName)
        instance.ProjectCode = validated_data.get('ProjectCode', instance.ProjectCode)
        instance.Company_id = validated_data.get('Company_id', instance.Company_id)
        instance.CompanyUndertakingWork = validated_data.get('CompanyUndertakingWork', instance.CompanyUndertakingWork)
        instance.Location = validated_data.get('Location', instance.Location)
        instance.Cost_NotIncludingKDV = validated_data.get('Cost_NotIncludingKDV', instance.Cost_NotIncludingKDV)
        instance.AC_Power = validated_data.get('AC_Power', instance.AC_Power)
        instance.DC_Power = validated_data.get('DC_Power', instance.DC_Power)
        instance.CalculatedCost_NotIncludingKDV = validated_data.get('CalculatedCost_NotIncludingKDV', instance.CalculatedCost_NotIncludingKDV)
        instance.RealizedCost_NotIncludingKDV = validated_data.get('RealizedCost_NotIncludingKDV', instance.RealizedCost_NotIncludingKDV)
        instance.CalculatedProfit_Loss = validated_data.get('CalculatedProfit_Loss', instance.CalculatedProfit_Loss)
        instance.RealizedCost_NotIncludingKDV = validated_data.get('RealizedCost_NotIncludingKDV', instance.RealizedCost_NotIncludingKDV)
        instance.RealizedProfitRate = validated_data.get('RealizedProfitRate', instance.RealizedProfitRate)
        instance.CalculatedProfitRate = validated_data.get('CalculatedProfitRate', instance.CalculatedProfitRate)
        instance.Situation = validated_data.get('Situation', instance.Situation)
        instance.StartDate = validated_data.get('StartDate', instance.StartDate)
        instance.FinishDate = validated_data.get('FinishDate', instance.FinishDate)
        instance.KDV_Rate = validated_data.get('KDV_Rate', instance.KDV_Rate)
        instance.Terrain_Roof = validated_data.get('Terrain_Roof', instance.Terrain_Roof)
        instance.Incentive = validated_data.get('Incentive', instance.Incentive)
        instance.save()
        return instance

class StringSerializer(serializers.ModelSerializer):

    class Meta:
        model = String
        fields = '__all__'

    def create(self, validated_data):
        return String.objects.create(**validated_data)

    def update(self, instance, validated_data):
        instance.String_Owner = validated_data.get('String_Owner', instance.String_Owner)
        instance.String_Direction = validated_data.get('String_Direction', instance.String_Direction)
        instance.String_Number = validated_data.get('String_Number', instance.String_Number)
        instance.String_Panel_Power = validated_data.get('String_Panel_Power', instance.String_Panel_Power)
        instance.String_Panel_Brand = validated_data.get('String_Panel_Brand', instance.String_Panel_Brand)
        instance.String_VOC = validated_data.get('String_VOC', instance.String_VOC)
        instance.String_Panel_SY = validated_data.get('String_Panel_SY', instance.String_Panel_SY)
        instance.String_Izolasion = validated_data.get('String_Izolasion', instance.String_Izolasion)
        instance.String_AC_Power = validated_data.get('String_AC_Power', instance.String_AC_Power)
        instance.String_DC_Power = validated_data.get('String_DC_Power', instance.String_DC_Power)
        instance.String_Capacity = validated_data.get('String_Capacity', instance.String_Capacity)
        instance.String_Percent = validated_data.get('String_Percent', instance.String_Percent)
        
        instance.String_Pluse = validated_data.get('String_Pluse', instance.String_Pluse)
        instance.String_Minus = validated_data.get('String_Minus', instance.String_Minus)

        instance.save()
        return instance

class InventorSerializer(serializers.ModelSerializer):
    inventor_strings= StringSerializer(many=True, read_only=True)

    class Meta:
        model = Inventor
        fields = '__all__'

    def create(self, validated_data):
        return Inventor.objects.create(**validated_data)

    def update(self, instance, validated_data):

        first_Inventor_Direction= instance.Inventor_Direction 
        first_Inventor_Panel_Power=instance.Inventor_Panel_Power
        first_Inventor_Panel_Brand=instance.Inventor_Panel_Brand
        first_Inventor_Izolasion=instance.Inventor_Izolasion 
        first_Inventor_VOC=instance.Inventor_VOC 
        first_Inventor_Panel_SY=instance.Inventor_Panel_SY
        first_Inventor_AC_Power=instance.Inventor_AC_Power
        first_Inventor_DC_Power=instance.Inventor_DC_Power
        first_Inventor_Capacity=instance.Inventor_Capacity

        first_Inventor_Pluse=instance.Inventor_Pluse
        first_Inventor_Minus=instance.Inventor_Minus

        instance.Inventor_Owner = validated_data.get('Inventor_Owner', instance.Inventor_Owner)
        instance.Inventor_Direction = validated_data.get('Inventor_Direction', instance.Inventor_Direction)
        instance.Inventor_Number = validated_data.get('Inventor_Number', instance.Inventor_Number)
        instance.Inventor_Number_Str = validated_data.get('Inventor_Number_Str', instance.Inventor_Number_Str)
        instance.Inventor_Panel_Power = validated_data.get('Inventor_Panel_Power', instance.Inventor_Panel_Power)
        instance.Inventor_Panel_Brand = validated_data.get('Inventor_Panel_Brand', instance.Inventor_Panel_Brand)
        instance.Inventor_Izolasion = validated_data.get('Inventor_Izolasion', instance.Inventor_Izolasion)
        instance.Inventor_VOC = validated_data.get('Inventor_VOC', instance.Inventor_VOC)
        instance.Inventor_Panel_SY = validated_data.get('Inventor_Panel_SY', instance.Inventor_Panel_SY)
        instance.Inventor_AC_Power = validated_data.get('Inventor_AC_Power', instance.Inventor_AC_Power)
        instance.Inventor_DC_Power = validated_data.get('Inventor_DC_Power', instance.Inventor_DC_Power)
        instance.Inventor_Capacity = validated_data.get('Inventor_Capacity', instance.Inventor_Capacity)
        
        instance.Inventor_Pluse = validated_data.get('Inventor_Pluse', instance.Inventor_Pluse)
        instance.Inventor_Minus = validated_data.get('Inventor_Minus', instance.Inventor_Minus)
       
        instance.save()

        strings = instance.inventor_strings.all()
        yeni_string_number= instance.Inventor_Number_Str
        # 1. En büyük String_Date değerini bul
        max_date = instance.inventor_strings.aggregate(Max('String_Date'))['String_Date__max']
        # 2. Bu en büyük String_Date değerine sahip string'lerin sayısını bul
        max_date_count = instance.inventor_strings.filter(String_Date=max_date).count()

        if max_date_count!=yeni_string_number:
            if max_date_count > yeni_string_number:
                fark=max_date_count-yeni_string_number
                for string in strings.order_by('-id'):
                    if string.String_Date == max_date:
                        if fark > 0:
                            string.delete()
                            fark -= 1
                        else:
                            break
            elif max_date_count < yeni_string_number:
                fark=yeni_string_number-max_date_count
                for x in range(max_date_count+1, max_date_count+fark+1):
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
                        String_Capacity=instance.Inventor_Capacity,
                        String_Izolasion=instance.Inventor_Izolasion,
                        String_Pluse=instance.Inventor_Pluse,
                        String_Minus=instance.Inventor_Minus,

                        String_Date=max_date,

                    )
                
        strings_last_date = instance.inventor_strings.filter(String_Date=max_date)

        if first_Inventor_Direction != instance.Inventor_Direction:
            for str in strings_last_date:
                str.String_Direction=instance.Inventor_Direction
                str.save()
        if first_Inventor_Panel_Power != instance.Inventor_Panel_Power:
            for str in strings_last_date:
                str.String_Panel_Power=instance.Inventor_Panel_Power
                str.save()
        if first_Inventor_Panel_Brand != instance.Inventor_Panel_Brand:
            for str in strings_last_date:
                str.String_Panel_Brand=instance.Inventor_Panel_Brand
                str.save()
        if first_Inventor_Izolasion != instance.Inventor_Izolasion:
            for str in strings_last_date:
                str.String_Izolasion=instance.Inventor_Izolasion
                str.save()
        if first_Inventor_VOC != instance.Inventor_VOC:
            for str in strings_last_date:
                str.String_VOC=instance.Inventor_VOC
                str.save()
        if first_Inventor_Panel_SY != instance.Inventor_Panel_SY:
            for str in strings_last_date:
                str.String_Panel_SY=instance.Inventor_Panel_SY
                str.save()
        if first_Inventor_AC_Power != instance.Inventor_AC_Power:
            for str in strings_last_date:
                str.String_AC_Power=instance.Inventor_AC_Power
                str.save()
        if first_Inventor_DC_Power != instance.Inventor_DC_Power:
            for str in strings_last_date:
                str.String_DC_Power=instance.Inventor_DC_Power
                str.save()
        if first_Inventor_Capacity!= instance.Inventor_Capacity:
            for str in strings_last_date:
                str.String_Capacity=instance.Inventor_Capacity
                str.save()
        
        if first_Inventor_Pluse!= instance.Inventor_Pluse:
            for str in strings_last_date:
                str.String_Pluse=instance.Inventor_Pluse
                str.save()
        if first_Inventor_Minus!= instance.Inventor_Minus:
            for str in strings_last_date:
                str.String_Minus=instance.Inventor_Minus
                str.save()

        return instance

class OperationCareSerializer(serializers.ModelSerializer):
    client = PowerPlantSerializer(source='Operation_Care_Company', read_only=True)
    operation_inventors= InventorSerializer(many=True, read_only=True)

    class Meta:
        model = Operation_Care
        fields = '__all__'
        #exclude = ['Company_id']
    def create(self, validated_data):
        return Operation_Care.objects.create(**validated_data)

    def update(self, instance, validated_data):

        first_Operation_Care_Panel_Brand=instance.Operation_Care_Panel_Brand 
        first_Operation_Care_Direction=instance.Operation_Care_Direction 
        first_Operation_Care_Inventor_Power=instance.Operation_Care_Inventor_Power
        first_Operation_Care_Panel_Power=instance.Operation_Care_Panel_Power 
        first_Operation_Care_Inventor_Number=instance.Operation_Care_Inventor_Number
        first_Operation_Care_VOC=instance.Operation_Care_VOC 
        first_Operation_Care_AC_Power=instance.Operation_Care_AC_Power
        first_Operation_Care_DC_Power=instance.Operation_Care_DC_Power
        first_Operation_Care_Panel_Number_Str=instance.Operation_Care_Panel_Number_Str
        first_Operation_Care_Number_Str=instance.Operation_Care_Number_Str 
        first_Operation_Care_Capacity=instance.Operation_Care_Capacity 
        
        instance.Operation_Care_Company = validated_data.get('Operation_Care_Company', instance.Operation_Care_Company)
        instance.Operation_Care_Location = validated_data.get('Operation_Care_Location', instance.Operation_Care_Location)
        instance.Operation_Care_Inventor_Brand = validated_data.get('Operation_Care_Inventor_Brand', instance.Operation_Care_Inventor_Brand)
        instance.Operation_Care_Panel_Brand = validated_data.get('Operation_Care_Panel_Brand', instance.Operation_Care_Panel_Brand)
        instance.Operation_Care_Address = validated_data.get('Operation_Care_Address', instance.Operation_Care_Address)
        instance.Operation_Care_Terrain_Roof = validated_data.get('Operation_Care_Terrain_Roof', instance.Operation_Care_Terrain_Roof)
        instance.Operation_Care_Direction = validated_data.get('Operation_Care_Direction', instance.Operation_Care_Direction)
        instance.Operation_Care_Inventor_Power = validated_data.get('Operation_Care_Inventor_Power', instance.Operation_Care_Inventor_Power)
        instance.Operation_Care_Panel_Power = validated_data.get('Operation_Care_Panel_Power', instance.Operation_Care_Panel_Power)
        instance.Operation_Care_Inventor_Number = validated_data.get('Operation_Care_Inventor_Number', instance.Operation_Care_Inventor_Number)
        instance.Operation_Care_VOC = validated_data.get('Operation_Care_VOC', instance.Operation_Care_VOC)
        instance.Operation_Care_AC_Power = validated_data.get('Operation_Care_AC_Power', instance.Operation_Care_AC_Power)
        instance.Operation_Care_DC_Power = validated_data.get('Operation_Care_DC_Power', instance.Operation_Care_DC_Power)
        instance.Operation_Care_Panel_Number_Str = validated_data.get('Operation_Care_Panel_Number_Str', instance.Operation_Care_Panel_Number_Str)
        instance.Operation_Care_Number_Str = validated_data.get('Operation_Care_Number_Str', instance.Operation_Care_Number_Str)
        instance.Operation_Care_Capacity = validated_data.get('Operation_Care_Capacity', instance.Operation_Care_Capacity)
        instance.Operation_Care_Start_Date = validated_data.get('Operation_Care_Start_Date', instance.Operation_Care_Start_Date)
        instance.Operation_Care_Finish_Date = validated_data.get('Operation_Care_Finish_Date', instance.Operation_Care_Finish_Date)
        instance.Operation_Care_Has_Fail = validated_data.get('Operation_Care_Has_Fail', instance.Operation_Care_Has_Fail)
        instance.Operation_Care_Fail_Number = validated_data.get('Operation_Care_Fail_Number', instance.Operation_Care_Fail_Number)
        instance.Operation_Care_Switchgear_Material = validated_data.get('Operation_Care_Switchgear_Material', instance.Operation_Care_Switchgear_Material)
        instance.save()

        inventors = instance.operation_inventors.all()

        yeni_string_number = instance.Operation_Care_Number_Str
        yeni_inventor_number= instance.Operation_Care_Inventor_Number
      
        if first_Operation_Care_Inventor_Number > yeni_inventor_number:
            fark=first_Operation_Care_Inventor_Number-yeni_inventor_number
            for inventor in inventors.order_by('-id'):
                if fark > 0:
                    inventor.delete()
                    fark -= 1
                else:
                    break
        elif first_Operation_Care_Inventor_Number < yeni_inventor_number:
            fark=yeni_inventor_number-first_Operation_Care_Inventor_Number
            for x in range(first_Operation_Care_Inventor_Number+1, first_Operation_Care_Inventor_Number+fark+1):
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
                Inventor_Capacity=instance.Operation_Care_Capacity,
                Inventor_Izolasion="OK",
            )
        inventors_s = instance.operation_inventors.all()
        first_inventor = instance.operation_inventors.first()
         # 1. En büyük String_Date değerini bul
        max_date = first_inventor.inventor_strings.aggregate(Max('String_Date'))['String_Date__max']
        # 2. Bu en büyük String_Date değerine sahip string'lerin sayısını bul
        for inventor in inventors_s:
            strings = inventor.inventor_strings.filter(String_Date=max_date)
            string_count=len(strings)
            if string_count>yeni_string_number:
                    fark=string_count-yeni_string_number
                    for string in strings.order_by('-id'):
                        if fark > 0:
                            string.delete()
                            fark -= 1
                        else:
                            break
            elif string_count<yeni_string_number:
                
                fark=yeni_string_number-string_count
                for x in range(string_count+1, string_count+fark+1):
                    string=String.objects.create(
                        String_Owner=inventor,
                        String_Direction=instance.Operation_Care_Direction,
                        String_Number=x,
                        String_Panel_Power=instance.Operation_Care_Panel_Power,
                        String_Panel_Brand=instance.Operation_Care_Panel_Brand,
                        String_VOC=instance.Operation_Care_VOC,
                        String_Panel_SY=instance.Operation_Care_Panel_Number_Str,
                        String_AC_Power=instance.Operation_Care_AC_Power,
                        String_DC_Power=instance.Operation_Care_DC_Power,
                        String_Capacity=instance.Operation_Care_Capacity,
                        String_Izolasion=inventor.Inventor_Izolasion,
                        String_Date=max_date
                    )
        
        inventors_ss = instance.operation_inventors.all()
        if first_Operation_Care_Panel_Brand!=instance.Operation_Care_Panel_Brand:
            for invntr in inventors_ss:
                invntr.Inventor_Panel_Brand=instance.Operation_Care_Panel_Brand
                invntr.save()
                strings_inventor = invntr.inventor_strings.filter(String_Date=max_date)
                for str in strings_inventor:
                    str.String_Panel_Brand=invntr.Inventor_Panel_Brand
                    str.save()
        if first_Operation_Care_Direction!=instance.Operation_Care_Direction:
            for invntr in inventors_ss:
                invntr.Inventor_Direction=instance.Operation_Care_Direction
                invntr.save()
                strings_inventor = invntr.inventor_strings.filter(String_Date=max_date)
                for str in strings_inventor:
                    str.String_Direction=invntr.Inventor_Direction
                    str.save()
        if first_Operation_Care_Panel_Number_Str!=instance.Operation_Care_Panel_Number_Str:
            for invntr in inventors_ss:
                invntr.Inventor_Panel_SY=instance.Operation_Care_Panel_Number_Str
                invntr.save()
                strings_inventor = invntr.inventor_strings.filter(String_Date=max_date)
                for str in strings_inventor:
                    str.String_Panel_SY=invntr.Inventor_Panel_SY
                    str.save()

        if first_Operation_Care_Number_Str!=instance.Operation_Care_Number_Str:
            for invntr in inventors_ss:
                invntr.Inventor_Number_Str=instance.Operation_Care_Number_Str
                invntr.save()
                
        if first_Operation_Care_Panel_Power!=instance.Operation_Care_Panel_Power:
            for invntr in inventors_ss:
                invntr.Inventor_Panel_Power=instance.Operation_Care_Panel_Power
                invntr.save()
                strings_inventor = invntr.inventor_strings.filter(String_Date=max_date)
                for str in strings_inventor:
                    str.String_Panel_Power=invntr.Inventor_Panel_Power
                    str.save()
        if first_Operation_Care_VOC!=instance.Operation_Care_VOC:
            for invntr in inventors_ss:
                invntr.Inventor_Voc=instance.Operation_Care_VOC
                invntr.save()
                strings_inventor = invntr.inventor_strings.filter(String_Date=max_date)
                for str in strings_inventor:
                    str.String_VOC=invntr.Inventor_Voc
                    str.save()
        if first_Operation_Care_AC_Power!=instance.Operation_Care_AC_Power:
            for invntr in inventors_ss:
                invntr.Inventor_AC_Power=instance.Operation_Care_AC_Power
                invntr.save()
                strings_inventor = invntr.inventor_strings.filter(String_Date=max_date)
                for str in strings_inventor:
                    str.String_AC_Power=invntr.Inventor_AC_Power
                    str.save()
        if first_Operation_Care_DC_Power!=instance.Operation_Care_DC_Power:
            for invntr in inventors_ss:
                invntr.Inventor_DC_Power=instance.Operation_Care_DC_Power
                invntr.save()
                strings_inventor = invntr.inventor_strings.filter(String_Date=max_date)
                for str in strings_inventor:
                    str.String_DC_Power=invntr.Inventor_DC_Power
                    str.save()
        if first_Operation_Care_Capacity!=instance.Operation_Care_Capacity:
            for invntr in inventors_ss:
                invntr.Inventor_Capacity=instance.Operation_Care_Capacity
                invntr.save()
                strings_inventor = invntr.inventor_strings.filter(String_Date=max_date)
                for str in strings_inventor:
                    str.String_Capacity=invntr.Inventor_Capacity
                    str.save()
    
        return instance
  
class FailSerializer(serializers.ModelSerializer):

    class Meta:
        model = Fail
        fields = '__all__'
    
    def create(self, validated_data):
        return Fail.objects.create(**validated_data)

    def update(self, instance, validated_data):
        instance.Fail_Operation_Care = validated_data.get('Fail_Operation_Care', instance.Fail_Operation_Care)
        instance.Fail_Central_Name = validated_data.get('Fail_Central_Name', instance.Fail_Central_Name)
        instance.Fail_Information_Person = validated_data.get('Fail_Information_Person', instance.Fail_Information_Person)
        instance.Fail_Guaranteed = validated_data.get('Fail_Guaranteed', instance.Fail_Guaranteed)
        instance.Fail_Situation = validated_data.get('Fail_Situation', instance.Fail_Situation)
        instance.Fail_Detection_Date = validated_data.get('Fail_Detection_Date', instance.Fail_Detection_Date)
        instance.Fail_Team_Info_Date = validated_data.get('Fail_Team_Info_Date', instance.Fail_Team_Info_Date)
        instance.Fail_Repair_Date = validated_data.get('Fail_Repair_Date', instance.Fail_Repair_Date)
        instance.Fail_Detail = validated_data.get('Fail_Detail', instance.Fail_Detail)
        instance.Fail_Bill_Central_Name = validated_data.get('Fail_Bill_Central_Name', instance.Fail_Bill_Central_Name)
        instance.Fail_Bill_Process = validated_data.get('Fail_Bill_Process', instance.Fail_Bill_Process)
        instance.Fail_Bill_Date = validated_data.get('Fail_Bill_Date', instance.Fail_Bill_Date)
        instance.Fail_Bill_Detail = validated_data.get('Fail_Bill_Detail', instance.Fail_Bill_Detail)
        instance.Fail_Bill_File = validated_data.get('Fail_Bill_File', instance.Fail_Bill_File)
        
        instance.save()
        return instance

class PollSerializer(serializers.ModelSerializer):
    class Meta:
        model = Poll
        fields = '__all__'

    def create(self, validated_data):
        # Yeni bir Poll nesnesi oluşturun
        return Poll.objects.create(**validated_data)

    def update(self, instance, validated_data):
        # Mevcut bir Poll nesnesini güncelleyin
        instance.Poll_Operation_Care = validated_data.get('Poll_Operation_Care', instance.Poll_Operation_Care)
        instance.Poll_Date = validated_data.get('Poll_Date', instance.Poll_Date)
        instance.Note_1_1 = validated_data.get('Note_1_1', instance.Note_1_1)
        instance.Note_1_2 = validated_data.get('Note_1_2', instance.Note_1_2)
        instance.Note_1_3 = validated_data.get('Note_1_3', instance.Note_1_3)
        instance.Note_1_4 = validated_data.get('Note_1_4', instance.Note_1_4)
        instance.Note_1_5 = validated_data.get('Note_1_5', instance.Note_1_5)
        instance.Note_1_6 = validated_data.get('Note_1_6', instance.Note_1_6)
        instance.Note_2_1 = validated_data.get('Note_2_1', instance.Note_2_1)
        instance.Note_2_2 = validated_data.get('Note_2_2', instance.Note_2_2)
        instance.Note_2_3 = validated_data.get('Note_2_3', instance.Note_2_3)
        instance.Note_2_4 = validated_data.get('Note_2_4', instance.Note_2_4)
        instance.Note_2_5 = validated_data.get('Note_2_5', instance.Note_2_5)
        instance.Note_2_6 = validated_data.get('Note_2_6', instance.Note_2_6)
        instance.Note_2_7 = validated_data.get('Note_2_7', instance.Note_2_7)
        instance.Note_3_1 = validated_data.get('Note_3_1', instance.Note_3_1)
        instance.Note_3_2 = validated_data.get('Note_3_2', instance.Note_3_2)
        instance.Note_3_3 = validated_data.get('Note_3_3', instance.Note_3_3)
        instance.Note_3_4 = validated_data.get('Note_3_4', instance.Note_3_4)
        instance.Note_4_1 = validated_data.get('Note_4_1', instance.Note_4_1)
        instance.Note_4_2 = validated_data.get('Note_4_2', instance.Note_4_2)
        instance.Note_4_3 = validated_data.get('Note_4_3', instance.Note_4_3)
        instance.Note_4_4 = validated_data.get('Note_4_4', instance.Note_4_4)
        instance.Note_4_5 = validated_data.get('Note_4_5', instance.Note_4_5)
        instance.Note_5_1 = validated_data.get('Note_5_1', instance.Note_5_1)
        instance.Note_5_2 = validated_data.get('Note_5_2', instance.Note_5_2)
        instance.Note_5_3 = validated_data.get('Note_5_3', instance.Note_5_3)
        instance.Note_5_4 = validated_data.get('Note_5_4', instance.Note_5_4)
        instance.Note_6_1 = validated_data.get('Note_6_1', instance.Note_6_1)
        instance.Note_6_2 = validated_data.get('Note_6_2', instance.Note_6_2)
        instance.Note_6_3 = validated_data.get('Note_6_3', instance.Note_6_3)
        instance.Note_6_4 = validated_data.get('Note_6_4', instance.Note_6_4)
        instance.Note_6_5 = validated_data.get('Note_6_5', instance.Note_6_5)
        instance.Note_6_6 = validated_data.get('Note_6_6', instance.Note_6_6)
        instance.Note_7_1 = validated_data.get('Note_7_1', instance.Note_7_1)
        instance.Note_7_2 = validated_data.get('Note_7_2', instance.Note_7_2)
        instance.Note_7_3 = validated_data.get('Note_7_3', instance.Note_7_3)
        instance.Note_7_4 = validated_data.get('Note_7_4', instance.Note_7_4)
        instance.Note_7_5 = validated_data.get('Note_7_5', instance.Note_7_5)
        instance.Note_7_6 = validated_data.get('Note_7_6', instance.Note_7_6)
        instance.Note_7_7 = validated_data.get('Note_7_7', instance.Note_7_7)
        instance.Note_8_1 = validated_data.get('Note_8_1', instance.Note_8_1)
        instance.Note_8_2 = validated_data.get('Note_8_2', instance.Note_8_2)
        instance.Note_8_3 = validated_data.get('Note_8_3', instance.Note_8_3)
        instance.Note_8_4 = validated_data.get('Note_8_4', instance.Note_8_4)
        instance.Note_8_5 = validated_data.get('Note_8_5', instance.Note_8_5)
        instance.Note_8_6 = validated_data.get('Note_8_6', instance.Note_8_6)
        instance.Note_8_7 = validated_data.get('Note_8_7', instance.Note_8_7)
        instance.Note_8_8 = validated_data.get('Note_8_8', instance.Note_8_8)
        instance.Note_9_1 = validated_data.get('Note_9_1', instance.Note_9_1)
        instance.Note_9_2 = validated_data.get('Note_9_2', instance.Note_9_2)
        instance.Note_9_3 = validated_data.get('Note_9_3', instance.Note_9_3)
        instance.Note_9_4 = validated_data.get('Note_9_4', instance.Note_9_4)
        instance.Note_9_5 = validated_data.get('Note_9_5', instance.Note_9_5)
        instance.Cloumn_Note_Text = validated_data.get('Cloumn_Note_Text', instance.Cloumn_Note_Text)
        instance.Cloumn_Organizer = validated_data.get('Cloumn_Organizer', instance.Cloumn_Organizer)
        instance.Cloumn_Organize_Date = validated_data.get('Cloumn_Organize_Date', instance.Cloumn_Organize_Date)
        instance.Cloumn_Looker = validated_data.get('Cloumn_Looker', instance.Cloumn_Looker)
        instance.Cloumn_Looker_Date = validated_data.get('Cloumn_Looker_Date', instance.Cloumn_Looker_Date)
        instance.answer_1_1 = validated_data.get('answer_1_1', instance.answer_1_1)
        instance.answer_1_2 = validated_data.get('answer_1_2', instance.answer_1_2)
        instance.answer_1_3 = validated_data.get('answer_1_3', instance.answer_1_3)
        instance.answer_1_4 = validated_data.get('answer_1_4', instance.answer_1_4)
        instance.answer_1_5 = validated_data.get('answer_1_5', instance.answer_1_5)
        instance.answer_1_6 = validated_data.get('answer_1_6', instance.answer_1_6)
        instance.answer_2_1 = validated_data.get('answer_2_1', instance.answer_2_1)
        instance.answer_2_2 = validated_data.get('answer_2_2', instance.answer_2_2)
        instance.answer_2_3 = validated_data.get('answer_2_3', instance.answer_2_3)
        instance.answer_2_4 = validated_data.get('answer_2_4', instance.answer_2_4)
        instance.answer_2_5 = validated_data.get('answer_2_5', instance.answer_2_5)
        instance.answer_2_6 = validated_data.get('answer_2_6', instance.answer_2_6)
        instance.answer_2_7 = validated_data.get('answer_2_7', instance.answer_2_7)
        instance.answer_3_1 = validated_data.get('answer_3_1', instance.answer_3_1)
        instance.answer_3_2 = validated_data.get('answer_3_2', instance.answer_3_2)
        instance.answer_3_3 = validated_data.get('answer_3_3', instance.answer_3_3)
        instance.answer_3_4 = validated_data.get('answer_3_4', instance.answer_3_4)
        instance.answer_4_1 = validated_data.get('answer_4_1', instance.answer_4_1)
        instance.answer_4_2 = validated_data.get('answer_4_2', instance.answer_4_2)
        instance.answer_4_3 = validated_data.get('answer_4_3', instance.answer_4_3)
        instance.answer_4_4 = validated_data.get('answer_4_4', instance.answer_4_4)
        instance.answer_4_5 = validated_data.get('answer_4_5', instance.answer_4_5)
        instance.answer_5_1 = validated_data.get('answer_5_1', instance.answer_5_1)
        instance.answer_5_2 = validated_data.get('answer_5_2', instance.answer_5_2)
        instance.answer_5_3 = validated_data.get('answer_5_3', instance.answer_5_3)
        instance.answer_5_4 = validated_data.get('answer_5_4', instance.answer_5_4)
        instance.answer_6_1 = validated_data.get('answer_6_1', instance.answer_6_1)
        instance.answer_6_2 = validated_data.get('answer_6_2', instance.answer_6_2)
        instance.answer_6_3 = validated_data.get('answer_6_3', instance.answer_6_3)
        instance.answer_6_4 = validated_data.get('answer_6_4', instance.answer_6_4)
        instance.answer_6_5 = validated_data.get('answer_6_5', instance.answer_6_5)
        instance.answer_6_6 = validated_data.get('answer_6_6', instance.answer_6_6)
        instance.answer_7_1 = validated_data.get('answer_7_1', instance.answer_7_1)
        instance.answer_7_2 = validated_data.get('answer_7_2', instance.answer_7_2)
        instance.answer_7_3 = validated_data.get('answer_7_3', instance.answer_7_3)
        instance.answer_7_4 = validated_data.get('answer_7_4', instance.answer_7_4)
        instance.answer_7_5 = validated_data.get('answer_7_5', instance.answer_7_5)
        instance.answer_7_6 = validated_data.get('answer_7_6', instance.answer_7_6)
        instance.answer_7_7 = validated_data.get('answer_7_7', instance.answer_7_7)
        instance.answer_8_1 = validated_data.get('answer_8_1', instance.answer_8_1)
        instance.answer_8_2 = validated_data.get('answer_8_2', instance.answer_8_2)
        instance.answer_8_3 = validated_data.get('answer_8_3', instance.answer_8_3)
        instance.answer_8_4 = validated_data.get('answer_8_4', instance.answer_8_4)
        instance.answer_8_5 = validated_data.get('answer_8_5', instance.answer_8_5)
        instance.answer_8_6 = validated_data.get('answer_8_6', instance.answer_8_6)
        instance.answer_8_7 = validated_data.get('answer_8_7', instance.answer_8_7)
        instance.answer_8_8 = validated_data.get('answer_8_8', instance.answer_8_8)
        instance.answer_9_1 = validated_data.get('answer_9_1', instance.answer_9_1)
        instance.answer_9_2 = validated_data.get('answer_9_2', instance.answer_9_2)
        instance.answer_9_3 = validated_data.get('answer_9_3', instance.answer_9_3)
        instance.answer_9_4 = validated_data.get('answer_9_4', instance.answer_9_4)
        instance.answer_9_5 = validated_data.get('answer_9_5', instance.answer_9_5)

        instance.save()
        return instance

class EventsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Events
        fields = '__all__'

    def create(self, validated_data):
        return Events.objects.create(**validated_data)

    def update(self, instance, validated_data):
        instance.Event_Date = validated_data.get('Event_Date', instance.Event_Date)
        instance.Event_Title = validated_data.get('Event_Title', instance.Event_Title)
        instance.Event_Time = validated_data.get('Event_Time', instance.Event_Time)
        instance.save()
        return instance

class DateSerializer(serializers.ModelSerializer):

    date_events= EventsSerializer(many=True, read_only=True)

    class Meta:
        model = Date
        fields = '__all__'

    def create(self, validated_data):
        return Date.objects.create(**validated_data)

    def update(self, instance, validated_data):
        instance.Date_Year = validated_data.get('Date_Year', instance.Date_Year)
        instance.Date_Month = validated_data.get('Date_Month', instance.Date_Month)
        instance.Date_Day = validated_data.get('Date_Day', instance.Date_Day)
        instance.save()
        return instance

