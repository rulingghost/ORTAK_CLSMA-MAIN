from django.http.response import HttpResponse
import json
from django.http import HttpResponseRedirect, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.db.models import Case, When, Value, IntegerField, F, Count, Sum
from django.shortcuts import render, redirect, get_object_or_404
import requests
from .forms import ProjectForm, ExpensesForm, IncomesForm, JobHistoryForm, ClientsForm, SupplierForm, SalesOfferCardForm, Operation_CareForm, FailForm
from .models import Project, Expenses, Incomes, PaymentFirms, CompanyNames, JobHistory, SalesOfferCard,SalesOfferCard_Revise, MyCompanyNames, PaymentFirms, Clients ,Details, Supplier, Locations,Terrain_Roof, Situations, Banks, Worker, Operation_Care, Fail, Inventor, String, Poll
from django.db.models import Q
from django.views import View
from django.views.decorators.http import require_POST
from django.contrib.auth.decorators import login_required, user_passes_test
import evds as e
from django.contrib.auth.models import User, Group
from .utils import convert_image_to_base64

import matplotlib
matplotlib.use('Agg')  # Backend'i ayarlayın
import matplotlib.pyplot as plt
import numpy as np
import matplotlib.colors as mcolors
import io

#Handler
def handler404(request, exception):
    """
    404 hatası için özel bir görünüm.
    Kullanıcı oturum açmışsa "not_found.html" sayfasına,
    oturum açmamışsa "login.html" sayfasına yönlendirir.
    """
    if request.user.is_authenticated:
        # Kullanıcı oturum açmışsa
        response = render(request, 'not_found.html', status=404)
        return response
    else:
        # Kullanıcı oturum açmamışsa
        return HttpResponseRedirect('/account/login/')

#Charts

def generate_pie_chart():
    langs = ["Çalışan Ödemeleri", "Panel Maliyeti", "Araç Kiralama", "Yeme İçme vb.", "Diğer"]
    votes_str = ["2600", "1300", "800", "620", "324"]

    votes = [int(vote.replace(',', '')) for vote in votes_str]
    total_votes = sum(votes)

    colors_hex = ['#7f878a', '#B6BFC6', '#e0e1e3', '#A1ABB4', '#CBCFD2']
    colors_rgba = [mcolors.to_rgba(color) for color in colors_hex]

    fig, ax = plt.subplots(figsize=(8, 6))
    ax.pie(votes, labels=langs, autopct='%1.1f%%', colors=colors_rgba)  # autopct ile yüzdelik değerleri göster

    centre_circle = plt.Circle((0,0),0.70,fc='white')
    fig.gca().add_artist(centre_circle)

    ax.text(0, 0, f'${total_votes}', ha='center', va='center', fontsize=16, fontweight='bold', color='#52606B')
    ax.text(0, -0.2, 'Toplam Harcama', ha='center', va='center', fontsize=12, color='#6B6B6B')

    ax.set_title('Harcanan Miktar Dağılımı')

    # Convert plot to PNG image
    buf = io.BytesIO()
    fig.savefig(buf, format='png')
    buf.seek(0)
    plt.close(fig)
    
    return buf.getvalue()

def generate_cash_flow_chart():
    aylar = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık']
    nakit_girdi = [38000, 15000, 13000, 23000, 15000, 13000, 28000, 20000, 28000, 25000, 25000, 8000]
    nakit_çıktı = [15000, 8000, 7000, 15000, 25000, 20000, 15000, 8000, 18000, 10000, 10000, 15000]
    x_konumları = np.arange(len(aylar))

    plt.figure(figsize=(10, 6))
    plt.plot(x_konumları, nakit_girdi, linestyle='-', linewidth=2, color='#2E97F3', marker='', alpha=0.7)
    plt.plot(x_konumları, nakit_çıktı, linestyle='-', linewidth=2, color='#D9DEE2', marker='', alpha=0.7)

    plt.fill_between(x_konumları, nakit_girdi, nakit_çıktı, where=np.array(nakit_girdi) > np.array(nakit_çıktı), color='#2491F0', alpha=0.5)
    plt.fill_between(x_konumları, nakit_girdi, nakit_çıktı, where=np.array(nakit_girdi) <= np.array(nakit_çıktı), color='#BABFC3', alpha=0.5)

    plt.fill_between(x_konumları, nakit_girdi, nakit_çıktı, color='#EFF8FF')
    plt.text(-0.5, 42000, "Nakit Akışı", fontsize=16, color='#132B45', fontweight='bold')

    plt.xticks(x_konumları, aylar, color='#83868B', rotation=0, ha='center')
    plt.yticks(color='#83868B')
    plt.ylim(0, 40000)

    plt.grid(linewidth=0)
    plt.plot(4.5, 37000, marker='s', markersize=10, color='#2E97F3')
    plt.plot(5.5, 37000, marker='s', markersize=10, color='#D9DEE2')

    plt.tight_layout()

    buf = io.BytesIO()
    plt.savefig(buf, format='png')
    buf.seek(0)
    plt.close()

    return buf.getvalue()
#Tests
def isAdmin(user):
    return user.is_superuser

def pass_test(group_name):
    """
    Verilen kullanıcının belirtilen grup adıyla uyuşup uyuşmadığını kontrol eder.
    
    :param group_name: Kontrol edilecek grup adı
    :return: Boolean değer
    """
    
    def inner(user):
        if user.is_superuser:
            return True
        else:

            return user.groups.filter(name=group_name).exists()
    return inner

#Home
@login_required
def home(request):
    sales_offer_card = SalesOfferCard.objects.all()   
    pie_chart = generate_pie_chart()
    pie_chart_base64 = convert_image_to_base64(pie_chart)
    cash_flow_chart_bytes = generate_cash_flow_chart()
    cash_flow_chart_base64 = convert_image_to_base64(cash_flow_chart_bytes)

    context = {
    'sales_offer_card': sales_offer_card,
    'pie_chart_base64': pie_chart_base64,  # Değişiklik burada
    'cash_flow_chart_base64':cash_flow_chart_base64,
    }
    return render(request, "home.html", context)
# Proje Modülü.

@user_passes_test(pass_test('Proje Grubu'), login_url='/home')
def client(request):
    locations = Locations.objects.all()
    if request.method == 'POST':
        client_form = ClientsForm(request.POST)
        if client_form.is_valid():
            client_form.save()
            return redirect('client')
    else:
        client_form = ClientsForm()

    clients = Clients.objects.all()

    context = {
        'clients': clients,
        'client_form': client_form,
        "locations": locations
    }

    return render(request, 'client.html', context)

@user_passes_test(pass_test('Proje Grubu'), login_url='/home')
def supplier(request):
    locations = Locations.objects.all()
    if request.method == 'POST':
        supplier_form = SupplierForm(request.POST)
        if supplier_form.is_valid():
            supplier_form.save()
            return redirect('supplier')
    else:
        supplier_form = SupplierForm()

    supplier = Supplier.objects.all()

    context = {
        'supplier': supplier,
        'supplier_form': supplier_form,
        "locations": locations
    }
    return render(request, "supplier.html", context)

@user_passes_test(pass_test('Proje Grubu'), login_url='/home')
def project_details(request, project_id):
    project = Project.objects.filter(id=project_id).first()
    profit=0
    if project.Cost_NotIncludingKDV is not None and project.CalculatedCost_NotIncludingKDV is not None and project.Cost_NotIncludingKDV != 0 and project.CalculatedCost_NotIncludingKDV != 0:
        x = project.Cost_NotIncludingKDV - project.CalculatedCost_NotIncludingKDV
        x= project.Cost_NotIncludingKDV-project.CalculatedCost_NotIncludingKDV
        y=x/project.CalculatedCost_NotIncludingKDV
        profit=y*100
    return render(request, 'project_details.html', {'project': project,'profit':profit})



@user_passes_test(pass_test('Proje Grubu'), login_url='/home')
def realized_cost(request, project_id):
   
    project = get_object_or_404(Project, id=project_id)
    expenses = Expenses.objects.filter(Project_Expenses=project) 
    jobhistory = JobHistory.objects.filter(Project_JobHistory=project)
    supplier = Supplier.objects.all()
    details = Details.objects.all()
    banks = Banks.objects.all()




    if request.method == 'POST':
        expenses_form = ExpensesForm(request.POST)
        jobhistory_form = JobHistoryForm(request.POST)
        supplier_form = SupplierForm(request.POST)

        if expenses_form.is_valid():
           
            expenses_form.save()
            return redirect(request.path)

        if jobhistory_form.is_valid():
            # Do something with the valid JobHistoryForm data
            jobhistory_form.save()
            return redirect(request.path)
        
        if supplier_form.is_valid():
            # Do something with the valid JobHistoryForm data
            supplier_form.save()
            return redirect(request.path)
    else:
        expenses_form = ExpensesForm()
        jobhistory_form = JobHistoryForm()
        supplier_form = SupplierForm()

    context = {
        "project": project,
        "expenses": expenses,   
        "jobhistory": jobhistory,
        "expenses_form": expenses_form,
        "jobhistory_form": jobhistory_form,
        "supplier_form": supplier_form,
        "supplier":supplier,
        "details":details,
        "banks":banks,
    }
    return render(request, "realized_cost.html", context)

@user_passes_test(pass_test('Proje Grubu'), login_url='/home')
def income_details(request, project_id):
    project = Project.objects.filter(id=project_id).first()
    incomes = Incomes.objects.filter(Project_Incomes=project)
    incomes_form = IncomesForm()
    client = Clients.objects.all()

    if request.method == 'POST':
        incomes_form = IncomesForm(request.POST)
        if incomes_form.is_valid():
            incomes_form.save()
            return redirect('income_details', project_id=project.id)
        else:
            incomes_form = IncomesForm()

    context = {
        "project": project,
        "incomes": incomes,
        "incomes_form": incomes_form,
        "client": client,
    }
    return render(request, "income_details.html", context)

@user_passes_test(pass_test('Proje Grubu'), login_url='/home')
def projects(request):
    locations = Locations.objects.all()
    banks= Banks.objects.all()
    details = Details.objects.all()

    project = Project.objects.annotate(
        custom_order_situation=Case(
            When(Situation="Onay Bekliyor", then=Value(1)),
            When(Situation="Devam Ediyor", then=Value(2)),
            When(Situation="Tamamlandı", then=Value(3)),
            default=Value(4),
            output_field=IntegerField()
        ),
        custom_order_date=F('StartDate')
    ).order_by('custom_order_situation', 'custom_order_date')

    context = {
        "project": project,
        "banks":banks,
        "locations":locations,
        "details":details
    }

    return render(request, "projects.html", context)


# Satış Teklif Modülü

@user_passes_test(pass_test('Satış Grubu'), login_url='/home')
def sales_offer_revises(request, card_id):
    card = get_object_or_404(SalesOfferCard, id=card_id)
    revises = SalesOfferCard_Revise.objects.filter(Revise_Owner=card)

    context={
        'card':card,    
        'revises':revises,
    }
    return render(request, "sales_offer_revises.html", context)


@user_passes_test(pass_test('Satış Grubu'), login_url='/home')
def sales_offer(request):
    sales_offer_card = SalesOfferCard.objects.all()
    clients= Clients.objects.all()
    workers= Worker.objects.all()
    locations = Locations.objects.all()

    potential_customers = sales_offer_card.filter(Situation_Card='Potansiyel Müşteri', Cost_NotIncludingKDV_Card__isnull=False)
    potential_customers_cost = potential_customers.aggregate(total_cost=Sum('Cost_NotIncludingKDV_Card'))['total_cost']
    potential_customers_count = potential_customers.count()

    cost_customers = sales_offer_card.filter(Situation_Card='Maliyet Hesaplama', Cost_NotIncludingKDV_Card__isnull=False)
    cost_customers_cost = cost_customers.aggregate(total_cost=Sum('Cost_NotIncludingKDV_Card'))['total_cost']
    cost_customers_count = cost_customers.count()

    price_customers = sales_offer_card.filter(Situation_Card='Fiyat Belirleme', Cost_NotIncludingKDV_Card__isnull=False)
    price_customers_cost = price_customers.aggregate(total_cost=Sum('Cost_NotIncludingKDV_Card'))['total_cost']
    price_customers_count = price_customers.count()

    offer_customers = sales_offer_card.filter(Situation_Card='Teklif Hazırlama', Cost_NotIncludingKDV_Card__isnull=False)
    offer_customers_cost = offer_customers.aggregate(total_cost=Sum('Cost_NotIncludingKDV_Card'))['total_cost']
    offer_customers_count = offer_customers.count()

    presentation_customers = sales_offer_card.filter(Situation_Card='Sunum Sonrası Görüşme', Cost_NotIncludingKDV_Card__isnull=False)
    presentation_customers_cost = presentation_customers.aggregate(total_cost=Sum('Cost_NotIncludingKDV_Card'))['total_cost']
    presentation_customers_count = presentation_customers.count()

    done_customers = sales_offer_card.filter(Situation_Card='Teklif Sunuldu', Cost_NotIncludingKDV_Card__isnull=False)
    done_customers_cost = done_customers.aggregate(total_cost=Sum('Cost_NotIncludingKDV_Card'))['total_cost']
    done_customers_count = done_customers.count()

    if request.method == 'POST':
        sales_form = SalesOfferCardForm(request.POST, request.FILES )
        client_form = ClientsForm(request.POST or None )
        if sales_form.is_valid():
            sales_form.save()
            return redirect('sales_offer')  
        elif client_form.is_valid():
            client_form.save()
            return redirect('sales_offer_add')
        
    else:  
        sales_form = SalesOfferCardForm()
        client_form = ClientsForm()


    context = {
        'sales_offer_card':sales_offer_card,
        'potential_customers_cost':potential_customers_cost,
        'potential_customers_count':potential_customers_count,
        'cost_customers_cost':cost_customers_cost,
        'cost_customers_count':cost_customers_count,
        'price_customers_cost':price_customers_cost,
        'price_customers_count':price_customers_count,
        'offer_customers_cost':offer_customers_cost,
        'offer_customers_count':offer_customers_count,
        'presentation_customers_cost':presentation_customers_cost,
        'presentation_customers_count':presentation_customers_count,
        'done_customers_cost':done_customers_cost,
        'done_customers_count':done_customers_count,
        'sales_form':sales_form,
        'client_form':client_form,
        'clients':clients,
        'workers':workers,
        'locations':locations
    }
    return render(request, "sales_offer.html", context)

#İşletme Bakım Modülü

@user_passes_test(pass_test('Bakım Grubu'), login_url='/home')
def operation_care(request):
    operations = Operation_Care.objects.all()
    fails = Fail.objects.all()
    locations=Locations.objects.all()
    context = {
        "operations": operations,
        "fails": fails,
        "locations":locations
    }

    return render(request, "operation_care.html", context)

@user_passes_test(pass_test('Bakım Grubu'), login_url='/home')
def calendar(request):
    operations = Operation_Care.objects.all()
    fails = Fail.objects.all()
    locations=Locations.objects.all()
    context = {
        "operations": operations,
        "fails": fails,
        "locations":locations
    }

    return render(request, "calendar.html", context)


@login_required
def operation_care_add(request):
    client = Clients.objects.all()
    locations = Locations.objects.all()
    if request.method == 'POST':
        form = Operation_CareForm(request.POST or None )
        client_form = ClientsForm(request.POST)

        if form.is_valid():
            form.save()
            return redirect('operation_care')  
          
        elif client_form.is_valid():
           
            client_form.save()
            return redirect('operation_care_add')
    else:
        form = Operation_CareForm()
        client_form = ClientsForm()
        
    context = {
        "form": form,
        'form_errors': form.errors,
        "client": client,
        "locations": locations,
        "client_form":client_form,
    }
    return render(request, "operation_care_add.html", context)

@login_required
def operation_care_edit(request, operation_care_id):
    operation_care = get_object_or_404(Operation_Care, id=operation_care_id)
    client = Clients.objects.all()
    locations = Locations.objects.all()
    if request.method == 'POST':
        form = Operation_CareForm(request.POST, instance=operation_care )

        if form.is_valid():
            form.save()
            return redirect('operation_care')  
    else:
        form = Operation_CareForm()
        
    context = {
        "form": form,
        "client": client,
        "locations": locations,
        "operation_care":operation_care,
    }
    return render(request, "operation_care_edit.html", context)

@user_passes_test(pass_test('Bakım Grubu'), login_url='/home')
def fault_notification(request):
    operation_cares=Operation_Care.objects.all()

    if request.method == 'POST':
        form = FailForm(request.POST or None )
       

        if form.is_valid():
            data2 = form.cleaned_data
            fail_instance = Fail.objects.create(
                Fail_Operation_Care_Copy=data2['Fail_Operation_Care_Copy'],
                Fail_Central_Name=data2['Fail_Central_Name'], 
                Fail_Information_Person=data2['Fail_Information_Person'],
                Fail_Guaranteed=data2['Fail_Guaranteed'], 
                Fail_Detection_Date=data2['Fail_Detection_Date'], 
                Fail_Situation=data2['Fail_Situation']
                )

            return redirect('operation_care')  
    else:
        form = FailForm()

    context = {
        "form": form,
        "operation_cares":operation_cares,
    }
    return render(request, "fault_notification.html", context)

@login_required
def fail_edit(request, fail_id):
    fail = get_object_or_404(Fail, id=fail_id)
    operation_cares = Operation_Care.objects.all()
    client = Clients.objects.all()
    locations = Locations.objects.all()
    if request.method == 'POST':
        form = FailForm(request.POST, instance=fail)

        if form.is_valid():
            form.save()
            return redirect('operation_care')  
    else:
        form = ProjectForm()
        
    context = {
        "form": form,
        'form_errors': form.errors,
        "client": client,
        "locations": locations,
        "fail":fail,
        "operation_cares":operation_cares
    }
    return render(request, "fail_edit.html", context)

@user_passes_test(pass_test('Bakım Grubu'), login_url='/home')
def operation_care_detail(request,operation_care_id):
    operation_care=Operation_Care.objects.filter(id=operation_care_id).first()
    fails= Fail.objects.filter(Fail_Operation_Care=operation_care)
    inventors =Inventor.objects.filter(Inventor_Owner=operation_care)
    polls =Poll.objects.filter(Poll_Operation_Care=operation_care)
    operation_cares = Operation_Care.objects.all()

    inventor_strings = {}

    # Iterate through inventors
    for inv in inventors:
        # Get all strings related to the current inventor
        strings = String.objects.filter(String_Owner=inv)
        inventor_strings[inv] = strings          
    context = {
        'fails':fails,
        "operation_care":operation_care,
        "inventors":inventors,
        "inventor_strings": inventor_strings,
        "polls":polls,
        "operation_cares":operation_cares
    }

    return render(request, "operation_care_detail.html", context)

@user_passes_test(pass_test('Bakım Grubu'), login_url='/home')
def inverter(request, operation_care_id):
    operation_care=Operation_Care.objects.filter(id=operation_care_id).first()
    client = Clients.objects.all()
    locations = Locations.objects.all()
    if request.method == 'POST':
        form = ProjectForm(request.POST or None )
        client_form = ClientsForm(request.POST)

        if form.is_valid():
            form.save()
            return redirect('operation_care')  
          
        elif client_form.is_valid():
           
            client_form.save()
            return redirect('inverter')
    else:
        form = ProjectForm()
        client_form = ClientsForm()
        
    context = {
        "form": form,
        'form_errors': form.errors,
        "client": client,
        "locations": locations,
        "client_form":client_form,
        "operation_care":operation_care,
    }
    return render(request, "inverter.html", context)

#report


def report(request):
    locations = Locations.objects.all()
    if request.method == 'POST':
        client_form = ClientsForm(request.POST)
        if client_form.is_valid():
            client_form.save()
            return redirect('report')
    else:
        client_form = ClientsForm()

    clients = Clients.objects.all()

    context = {
        'clients': clients,
        'client_form': client_form,
        "locations": locations
    }

    return render(request, 'report.html', context)

#deneme

@login_required
def deneme(request):

    locations = Locations.objects.all()
    if request.method == 'POST':
        client_form = ClientsForm(request.POST)
        if client_form.is_valid():
            client_form.save()
            return redirect('client')
    else:
        client_form = ClientsForm()

    clients = Clients.objects.all()

    context = {
        'clients': clients,
        'client_form': client_form,
        "locations": locations
    }
    return render(request, "deneme.html", context)

@login_required
def deneme2(request):
    sales_offer_card = SalesOfferCard.objects.all()
   

    potential_customers = sales_offer_card.filter(Situation_Card='Potansiyel Müşteri', Cost_NotIncludingKDV_Card__isnull=False)
    potential_customers_cost = potential_customers.aggregate(total_cost=Sum('Cost_NotIncludingKDV_Card'))['total_cost']
    potential_customers_count = potential_customers.count()

    cost_customers = sales_offer_card.filter(Situation_Card='Maliyet Hesaplama', Cost_NotIncludingKDV_Card__isnull=False)
    cost_customers_cost = cost_customers.aggregate(total_cost=Sum('Cost_NotIncludingKDV_Card'))['total_cost']
    cost_customers_count = cost_customers.count()

    price_customers = sales_offer_card.filter(Situation_Card='Fiyat Belirleme', Cost_NotIncludingKDV_Card__isnull=False)
    price_customers_cost = price_customers.aggregate(total_cost=Sum('Cost_NotIncludingKDV_Card'))['total_cost']
    price_customers_count = price_customers.count()

    offer_customers = sales_offer_card.filter(Situation_Card='Teklif Hazırlama', Cost_NotIncludingKDV_Card__isnull=False)
    offer_customers_cost = offer_customers.aggregate(total_cost=Sum('Cost_NotIncludingKDV_Card'))['total_cost']
    offer_customers_count = offer_customers.count()

    presentation_customers = sales_offer_card.filter(Situation_Card='Sunum Sonrası Görüşme', Cost_NotIncludingKDV_Card__isnull=False)
    presentation_customers_cost = presentation_customers.aggregate(total_cost=Sum('Cost_NotIncludingKDV_Card'))['total_cost']
    presentation_customers_count = presentation_customers.count()

    done_customers = sales_offer_card.filter(Situation_Card='Teklif Sunuldu', Cost_NotIncludingKDV_Card__isnull=False)
    done_customers_cost = done_customers.aggregate(total_cost=Sum('Cost_NotIncludingKDV_Card'))['total_cost']
    done_customers_count = done_customers.count()




    context = {
        'sales_offer_card':sales_offer_card,
        'potential_customers_cost':potential_customers_cost,
        'potential_customers_count':potential_customers_count,
        'cost_customers_cost':cost_customers_cost,
        'cost_customers_count':cost_customers_count,
        'price_customers_cost':price_customers_cost,
        'price_customers_count':price_customers_count,
        'offer_customers_cost':offer_customers_cost,
        'offer_customers_count':offer_customers_count,
        'presentation_customers_cost':presentation_customers_cost,
        'presentation_customers_count':presentation_customers_count,
        'done_customers_cost':done_customers_cost,
        'done_customers_count':done_customers_count,
    }
    return render(request, "deneme2.html", context)



#***********************************************************
#                       GET METHODLARI
#***********************************************************


@login_required
def get_cards(request):
    cards = SalesOfferCard.objects.all().values()  
    return JsonResponse({'cards': list(cards)})

@login_required
def get_lost_cards(request):
    lost_cards = SalesOfferCard.objects.filter(Is_Lost=True).values()
    return JsonResponse({'lost_cards': list(lost_cards)})

@login_required
def get_gain_cards(request):
    gain_cards = SalesOfferCard.objects.filter(Is_Gain=True).values()
    return JsonResponse({'gain_cards': list(gain_cards)})

@login_required
def get_late_cards(request):
    late_cards = SalesOfferCard.objects.filter(Is_late=True).values()
    return JsonResponse({'late_cards': list(late_cards)})

@login_required
def get_run_cards(request):
    run_cards = SalesOfferCard.objects.filter(Is_late=False, Is_Gain=False, Is_Lost=False).values()
    return JsonResponse({'run_cards': list(run_cards)})


def get_operation_care(request):
    operation_care = Operation_Care.objects.all().values()
    return JsonResponse({'operation_care': list(operation_care)})

def get_fail(request):
    fail = Fail.objects.all().values()
    return JsonResponse({'fail': list(fail)})



@login_required
def get_inventors(request, operation_care_id):
    operation_care = Operation_Care.objects.filter(id=operation_care_id).first()
    inventors = Inventor.objects.filter(Inventor_Owner=operation_care).values()
    return JsonResponse({'inventors': list(inventors)})

@login_required
def get_strings(request, inventor_id):
    inventor = Inventor.objects.filter(id=inventor_id).first()
    strings = String.objects.filter(String_Owner=inventor).values()
    return JsonResponse({'strings': list(strings)})

@login_required
def get_dollar_rate(request, date):
    headers={'key':'qYyWXNCbA0'}
    response = requests.get(f"https://evds2.tcmb.gov.tr/service/evds/series=TP.DK.USD.S&startDate={date}&endDate={date}&type=json", headers=headers)
    #api='qYyWXNCbA0'
    #evds = e.evdsAPI(api)
    #dollar =  evds.get_data(['TP.DK.USD.S.YTL'], startdate=date, enddate=date)    
    
    data = json.loads(response.content)

    # JSON verilerini işleyin
    items = data.get('items', [])
    if items:
        tarih = items[0]['Tarih']
        usd_degeri = items[0]['TP_DK_USD_S']
        print(f"Tarih: {tarih}, USD Değeri: {usd_degeri}")
    else:
        print("Belirtilen tarih için veri bulunamadı.")
    #rate=dollar.TP_DK_USD_S_YTL.values[0]
    #rate = round(rate, 4)  # 4 ondalık basamak
    return JsonResponse({'rate': usd_degeri})
#***********************************************************
#                       SET METHODLARI
#***********************************************************

@require_POST
def create_revise(request, card_id):
    # Retrieve the existing SalesOfferCard instance
    card = get_object_or_404(SalesOfferCard, id=card_id)

    # Create a new SalesOfferCard_Revise instance
    revise = SalesOfferCard_Revise(
        Revise_Owner=card,
        Client_Card=card.Client_Card,
        Offer_Subject_Card=card.Offer_Subject_Card,
        Location_Card=card.Location_Card,
        Cost_NotIncludingKDV_Card=card.Cost_NotIncludingKDV_Card,
        Offer_Cost_NotIncludingKDV_Card=card.Offer_Cost_NotIncludingKDV_Card,
        AC_Power_Card=card.AC_Power_Card,
        DC_Power_Card=card.DC_Power_Card,
        UnitCost_NotIncludingKDV=card.UnitCost_NotIncludingKDV,
        UnitOffer_NotIncludingKDV=card.UnitOffer_NotIncludingKDV,
        Situation_Card=card.Situation_Card,
        Date_Card=card.Date_Card,
        Terrain_Roof_Card=card.Terrain_Roof_Card,
        Roof_Cost_Card=card.Roof_Cost_Card,
        Person_Deal=card.Person_Deal,
        Person_Related=card.Person_Related,
        Offer_File_Card=card.Offer_File_Card,
        Offer_File_Card_2=card.Offer_File_Card_2,
        Offer_File_Card_3=card.Offer_File_Card_3,
        Offer_File_Card_4=card.Offer_File_Card_4,
        Offer_File_Card_5=card.Offer_File_Card_5,
        M_File_Card=card.M_File_Card,
        M_File_Card_2=card.M_File_Card_2,
        M_File_Card_3=card.M_File_Card_3,
        Is_Lost=card.Is_Lost,
        Is_Gain=card.Is_Gain,
        Is_late=card.Is_late,
        Unit_Cost_with_Roof_Cost=card.Unit_Cost_with_Roof_Cost,
        Unit_Offer_with_Roof_Cost=card.Unit_Offer_with_Roof_Cost,
        Profit_Rate_Card=card.Profit_Rate_Card,
    )

    # Save the new SalesOfferCard_Revise instance
    revise.save()

    # Return a JSON response
    return JsonResponse({'success': True})

def isUserAdmin(user):
    return JsonResponse({'success': user.is_superuser})

@require_POST
def set_card_wait(request, card_id):
    card = get_object_or_404(SalesOfferCard, id=card_id)
    print("id alındı")
    card.Is_late = True
    card.save()
    return JsonResponse({'success': True})

@require_POST
def set_card_rewait(request, card_id):
    card = get_object_or_404(SalesOfferCard, id=card_id)
    print("id alındı")
    card.Is_late = False
    card.save()
    return JsonResponse({'success': True})

@require_POST
def set_card_gain(request, card_id):
    card = get_object_or_404(SalesOfferCard, id=card_id)
    print("id alındı")
    card.Is_Gain = True
    card.save()
    return JsonResponse({'success': True})

@require_POST
def set_card_regain(request, card_id):
    card = get_object_or_404(SalesOfferCard, id=card_id)
    print("id alındı")
    card.Is_Gain = False
    card.save()
    return JsonResponse({'success': True})

@require_POST
def set_card_lost(request, card_id):
    card = get_object_or_404(SalesOfferCard, id=card_id)
    print("id alındı")
    card.Is_Lost = True
    card.save()
    return JsonResponse({'success': True})

@require_POST
def set_card_relost(request, card_id):
    card = get_object_or_404(SalesOfferCard, id=card_id)
    print("id alındı")
    card.Is_Lost = False
    card.save()
    return JsonResponse({'success': True})

def delete_salesoffercard(request, card_id):
    try:
        card = SalesOfferCard.objects.get(id=card_id)

        # Modeli silme
        card.delete()

        # Başarılı bir silme işlemi sonrasında yapılacak işlemler
        # Örneğin, bir mesaj gösterme veya başka bir sayfaya yönlendirme

    except card.DoesNotExist:
        # Model bulunamadıysa yapılacak işlemler
        # Örneğin, bir hata mesajı gösterme veya başka bir sayfaya yönlendirme
        return HttpResponse("Silme işlemi başarısız")

@csrf_exempt  # Temporarily disable CSRF for simplicity. Add proper CSRF handling in production.
def update_card_situation(request):
    if request.method == 'POST':
        data = json.loads(request.body.decode('utf-8'))
        card_id = data.get('card_id')
        new_situation = data.get('new_situation')

        # Update the card's situation in the database
        try:
            card = SalesOfferCard.objects.get(id=card_id)
            card.Situation_Card = new_situation
            card.save()
            return JsonResponse({'success': True})
        except SalesOfferCard.DoesNotExist:
            return JsonResponse({'success': False, 'error': 'Card not found'})

    return JsonResponse({'success': False, 'error': 'Invalid request method'})

#***********************************************************
#                       POST METHODLARI
#***********************************************************


@csrf_exempt
def post_card_file(request):
    if request.method == 'POST':
        card_id = request.POST.get('card_id')
        file_type = request.POST.get('file_type')
        file = request.FILES.get('file')

        try:
            card = SalesOfferCard.objects.get(pk=card_id)
        except SalesOfferCard.DoesNotExist:
            return JsonResponse({'error': 'SalesOfferCard bulunamadı'}, status=404)

        # Dosya tipine göre doğru alanı seçin ve dosyayı kaydedin
        if file_type == 'M_File_Card':
            # Burada birden fazla M_File_Card alanı varsa, hangisini kullanacağınıza karar vermeniz gerekebilir
            card.M_File_Card = file
        elif file_type == 'M_File_Card_2':

            card.M_File_Card_2 = file
        elif file_type == 'M_File_Card_3':

            card.M_File_Card_3 = file
        elif file_type == 'Offer_File_Card':

            card.Offer_File_Card = file
        elif file_type == 'Offer_File_Card_2':

            card.Offer_File_Card_2 = file
        elif file_type == 'Offer_File_Card_3':

            card.Offer_File_Card_3 = file
        elif file_type == 'Offer_File_Card_4':

            card.Offer_File_Card_4 = file
        elif file_type == 'Offer_File_Card_5':

            card.Offer_File_Card_5 = file
        else:
            return JsonResponse({'error': 'Geçersiz dosya tipi'}, status=400)

        card.save()
        return JsonResponse({'message': 'Dosya başarıyla yüklendi'})

    return JsonResponse({'error': 'Geçersiz istek'}, status=400)



@csrf_exempt
def post_update_string(request, string_id):
    string=String.objects.filter(id=string_id).first()
    if string is None:
        return JsonResponse({'error': 'String bulunamadı'}, status=404)
    if request.method == 'POST':
        
        string.String_Number = request.POST.get('String_Number')
        string.String_Panel_Power= request.POST.get('String_Panel_Power')
        string.String_Panel_Brand= request.POST.get('String_Panel_Brand')
        string.String_VOC= request.POST.get('String_VOC')
        string.String_Panel_SY= request.POST.get('String_Panel_SY')
        string.String_Izolasion= request.POST.get('String_Izolasion')
        string.String_AC_Power= request.POST.get('String_AC_Power')
        string.String_DC_Power= request.POST.get('String_DC_Power')
        string.String_Capacity= request.POST.get('String_Capacity')
        string.String_Percent= request.POST.get('String_Percent')

        string.save()

        return JsonResponse({'message': 'String Başarı ile güncellendi'})

    return JsonResponse({'error': 'Geçersiz istek'}, status=400)

