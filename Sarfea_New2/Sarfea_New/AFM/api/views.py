from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.generics import GenericAPIView
from rest_framework.mixins import CreateModelMixin, ListModelMixin
from rest_framework import generics

from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import render, redirect, get_object_or_404
from AFM.api.serializers import ClientSerializer, FailSerializer, SupplierSerializer, ProjectSerializer, ExpensesSerializer,PollSerializer ,JobHistorySerializer, IncomesSerializer,SalesOfferCardSerializer, SalesOfferCardReviseSerializer, OperationCareSerializer, InventorSerializer, StringSerializer, PowerPlantSerializer, EventsSerializer, DateSerializer
from AFM.models import Date, Events, Project, Expenses, Incomes, PaymentFirms, CompanyNames, JobHistory, Inventor, Poll, PowerPlant
from AFM.models import SalesOfferCard,SalesOfferCard_Revise, MyCompanyNames, PaymentFirms, Clients ,Details, Operation_Care
from AFM.models import Supplier, Locations,Terrain_Roof, Situations, Banks, Worker, Operation_Care, Fail, Inventor, String
from django.contrib.auth.decorators import login_required, user_passes_test

from AFM.api.permissions import CustomPermission


class ProjectListCreateAPIView(generics.ListCreateAPIView):
    queryset= Project.objects.all()
    serializer_class=ProjectSerializer

    
class ProjectDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset= Project.objects.all()
    serializer_class=ProjectSerializer


class ExpensesListCreateAPIView(generics.ListCreateAPIView):
    queryset= Expenses.objects.all()
    serializer_class=ExpensesSerializer


class ExpenseDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset= Expenses.objects.all()
    serializer_class=ExpensesSerializer

class JobHistoryListCreateAPIView(generics.ListCreateAPIView):
    queryset= JobHistory.objects.all()
    serializer_class=JobHistorySerializer
 
class JobHistoryDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset= JobHistory.objects.all()
    serializer_class=JobHistorySerializer
 

class IncomesListCreateAPIView(generics.ListCreateAPIView):
    queryset= Incomes.objects.all()
    serializer_class=IncomesSerializer
  
class IncomeDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset= Incomes.objects.all()
    serializer_class=IncomesSerializer


class ClientsListCreateAPIView(generics.ListCreateAPIView):
    queryset= Clients.objects.all()
    serializer_class=ClientSerializer

    
class ClientDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset= Clients.objects.all()
    serializer_class=ClientSerializer

class PowerPlantsListCreateAPIView(generics.ListCreateAPIView):
    queryset= PowerPlant.objects.all()
    serializer_class=PowerPlantSerializer

    
class PowerPlantDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset= PowerPlant.objects.all()
    serializer_class=PowerPlantSerializer

class SuppliersListCreateAPIView(generics.ListCreateAPIView):
    queryset= Supplier.objects.all()
    serializer_class=SupplierSerializer

      
class SupplierDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset= Supplier.objects.all()
    serializer_class=SupplierSerializer

class SalesOfferListCreateAPIView(generics.ListCreateAPIView):
    queryset= SalesOfferCard.objects.all()
    serializer_class=SalesOfferCardSerializer

class SalesOfferDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset= SalesOfferCard.objects.all()
    serializer_class=SalesOfferCardSerializer
    
  
class SalesOfferReviseListCreateAPIView(generics.ListCreateAPIView):
    queryset= SalesOfferCard_Revise.objects.all()
    serializer_class=SalesOfferCardReviseSerializer
    
    def partial_update(self, request, *args, **kwargs):
        kwargs['partial'] = True
        return self.update(request, *args, **kwargs)
       
class SalesOfferReviseDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset= SalesOfferCard_Revise.objects.all()
    serializer_class=SalesOfferCardReviseSerializer

class InventorListCreateAPIView(generics.ListCreateAPIView):
    queryset= Inventor.objects.all()
    serializer_class=InventorSerializer

class InventorDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset= Inventor.objects.all()
    serializer_class=InventorSerializer

class StringListCreateAPIView(generics.ListCreateAPIView):
    queryset= String.objects.all()
    serializer_class=StringSerializer

class StringDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset= String.objects.all()
    serializer_class=StringSerializer

class OperationCareListCreateAPIView(generics.ListCreateAPIView):
    queryset= Operation_Care.objects.all()
    serializer_class=OperationCareSerializer

class OperationCareDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset= Operation_Care.objects.all()
    serializer_class=OperationCareSerializer

class FailListCreateAPIView(generics.ListCreateAPIView):
    queryset = Fail.objects.all()
    serializer_class = FailSerializer

class FailRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Fail.objects.all()
    serializer_class = FailSerializer

class PollListCreateAPIView(generics.ListCreateAPIView):
    queryset = Poll.objects.all()
    serializer_class = PollSerializer

class PollRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Poll.objects.all()
    serializer_class = PollSerializer

class DateListCreateAPIView(generics.ListCreateAPIView):
    queryset= Date.objects.all()
    serializer_class=DateSerializer

class DateDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset= Date.objects.all()
    serializer_class=DateSerializer

class EventsListCreateAPIView(generics.ListCreateAPIView):
    queryset= Events.objects.all()
    serializer_class=EventsSerializer

class EventsDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset= Events.objects.all()
    serializer_class=EventsSerializer






    '''
@api_view(['GET', 'POST'])
@login_required
def api_projects(request):

    if request.method == 'GET':
        projects = Project.objects.all()  # Tüm müşterileri JSON formatında al
        serializer= ProjectSerializer(projects, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        serializer= ProjectSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status = status.HTTP_201_CREATED)
        return Response(serializer.errors, status = status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT'])
@login_required
def api_project_detail(request, project_id):
    try:
        project = Project.objects.get(id=project_id)
    except Project.DoesNotExist:
        return Response(
            {
                'errors':{
                    'code':404,
                    'message': f'{project_id} id li proje bulunamadı!' 
                }
            },
            status=status.HTTP_404_NOT_FOUND
        )

    if request.method == 'GET':
        serializer= ProjectSerializer(project)
        return Response(serializer.data)
    elif request.method == 'PUT':
        serializer = ProjectSerializer(project, data = request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        
@api_view(['GET'])
@login_required
def get_expenses(request):
    expenses = Expenses.objects.all()
    serializer= ExpensesSerializer(expenses, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@login_required
def get_expenses_id(request, expenses_id):
    expenses = get_object_or_404(Expenses, id=expenses_id)  # Tüm müşterileri JSON formatında al
    serializer= ExpensesSerializer(expenses)

    return Response(serializer.data)

@csrf_exempt
@api_view(['POST'])
def post_expenses(request):
    serializer= ExpensesSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    else:
        return Response(serializer.errors)
    
@api_view(['PUT'])
@csrf_exempt
def post_update_expenses(request, expenses_id):
    curr_expenses = get_object_or_404(Expenses, id=expenses_id)

    serializer = ExpensesSerializer(curr_expenses, data = request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors)

    
@api_view(['GET'])
@login_required
def get_job_history(request):
    jobhistory = JobHistory.objects.all()
    serializer= JobHistorySerializer(jobhistory, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@login_required
def get_job_history_id(request, jobhistory_id):
    job_history = get_object_or_404(JobHistory, id=jobhistory_id)  # Tüm müşterileri JSON formatında al
    serializer= JobHistorySerializer(job_history)

    return Response(serializer.data)

@csrf_exempt
@api_view(['POST'])
def post_jobhistory(request):
    serializer= JobHistorySerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    else:
        return Response(serializer.errors)

@csrf_exempt
@api_view(['PUT'])
def post_update_jobhistory(request, jobhistory_id):
    curr_jobhistory = get_object_or_404(JobHistory, id=jobhistory_id)

    serializer = JobHistorySerializer(curr_jobhistory, data = request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors)

    
@api_view(['GET'])
@login_required
def get_incomes(request):
    incomes = Incomes.objects.all()
    serializer= IncomesSerializer(incomes, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@login_required
def get_income_id(request, incomes_id):
    income = get_object_or_404(Incomes, id=incomes_id)  # Tüm müşterileri JSON formatında al
    serializer= IncomesSerializer(income)

    return Response(serializer.data)

@csrf_exempt
@api_view(['POST'])
def post_income(request):
    serializer= IncomesSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    else:
        return Response(serializer.errors)

@api_view(['PUT'])
@csrf_exempt
def post_update_income(request, income_id):
    curr_income = get_object_or_404(Incomes, id=income_id)
    serializer = IncomesSerializer(curr_income, data = request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors)


@api_view(['GET'])
@login_required
def get_suppliers(request):
    suppliers = Supplier.objects.all()
    serializer = SupplierSerializer(suppliers, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@login_required
def get_supplier_id(request, supplier_id):
    supplier = get_object_or_404(Supplier, id=supplier_id)

    serializer = SupplierSerializer(supplier)

    return Response(serializer.data)

csrf_exempt
@api_view(['POST'])
def post_supplier(request):
    serializer= SupplierSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    else:
        return Response(serializer.errors)

@csrf_exempt
@api_view(['PUT'])
def post_update_supplier(request, supplier_id):
    curr_supplier = get_object_or_404(Supplier, id=supplier_id)

    serializer = SupplierSerializer(curr_supplier, data = request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors)



@api_view(['GET'])
def get_clients(request):
    clients = Clients.objects.all() # Tüm müşterileri JSON formatında al
    serializer = ClientSerializer(clients, many=True)

    return Response(serializer.data)

@api_view(['GET'])
def get_client_id(request, client_id):
    client = get_object_or_404(Clients, id=client_id)

    serializer = ClientSerializer(client)

    return Response(serializer.data)

@csrf_exempt
@api_view(['POST'])
def post_client(request):
    serializer= ClientSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    else:
        return Response(serializer.errors)

@csrf_exempt
@api_view(['PUT'])
def post_update_client(request, client_id):
    curr_client = get_object_or_404(Clients, id=client_id)

    serializer = ClientSerializer(curr_client, data = request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors)
'''
