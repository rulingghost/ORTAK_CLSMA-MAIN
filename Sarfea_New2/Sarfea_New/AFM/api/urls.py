from django.urls import path
from AFM.api import views  as api_view


urlpatterns = [
 #******************************* A P I ***********************************
    path('api_project/', api_view.ProjectListCreateAPIView.as_view(), name='api-projects'),
    path('api_project/<pk>', api_view.ProjectDetailAPIView.as_view(), name='api-project-detail'),

    path('api_client/', api_view.ClientsListCreateAPIView.as_view(), name='api-clients'),
    path('api_client/<pk>', api_view.ClientDetailAPIView.as_view(), name='api-client-detail'),

    path('api_powerpoint/', api_view.PowerPlantsListCreateAPIView.as_view(), name='api-powerpoint'),
    path('api_powerpoint/<pk>', api_view.PowerPlantDetailAPIView.as_view(), name='api-powerpoint-detail'),


    path('api_supplier/', api_view.SuppliersListCreateAPIView.as_view(), name='api-suppliers'),
    path('api_supplier/<pk>', api_view.SupplierDetailAPIView.as_view(), name='api-supplier-detail'),

    path("api_expense/", api_view.ExpensesListCreateAPIView.as_view(), name='api-expenses'),
    path('api_expense/<pk>', api_view.ExpenseDetailAPIView.as_view(), name='api-expenses-detail'),

    path("api_job_history/", api_view.JobHistoryListCreateAPIView.as_view(), name='api-job-history'),
    path('api_job_history/<pk>', api_view.JobHistoryDetailAPIView.as_view(), name='api-job-history-detail'),

    path("api_income/", api_view.IncomesListCreateAPIView.as_view(), name='api-incomes'),
    path('api_income/<pk>', api_view.IncomeDetailAPIView.as_view(), name='api-income-detail'),
    
    path("api_sales_offer/", api_view.SalesOfferListCreateAPIView.as_view(), name='api-sales-offer'),
    path('api_sales_offer/<pk>', api_view.SalesOfferDetailAPIView.as_view(), name='api-sales-offer-detail'),
    
    path("api_sales_offer_revise/", api_view.SalesOfferReviseListCreateAPIView.as_view(), name='api-sales-offer-revise'),
    path('api_sales_offer_revise/<pk>', api_view.SalesOfferReviseDetailAPIView.as_view(), name='api-sales-offer-revise-detail'),
 
    path("api_operation_care/", api_view.OperationCareListCreateAPIView.as_view(), name='api-operation-care'),
    path('api_operation_care/<pk>', api_view.OperationCareDetailAPIView.as_view(), name='api-operation-care-detail'),
    
    path("api_inventor/", api_view.InventorListCreateAPIView.as_view(), name='api-inventor'),
    path('api_inventor/<pk>', api_view.InventorDetailAPIView.as_view(), name='api-inventor-detail'),
   
    path("api_inventor/", api_view.InventorListCreateAPIView.as_view(), name='api-inventor'),
    path('api_inventor/<pk>', api_view.InventorDetailAPIView.as_view(), name='api-inventor-detail'),
   
    path("api_string/", api_view.StringListCreateAPIView.as_view(), name='api-string'),
    path('api_string/<pk>', api_view.StringDetailAPIView.as_view(), name='api-string-detail'),

    path("api_fail/", api_view.FailListCreateAPIView.as_view(), name='api-fail'),
    path('api_fail/<pk>', api_view.FailRetrieveUpdateDestroyAPIView.as_view(), name='api-fail-detail'),

    path("api_poll/", api_view.PollListCreateAPIView.as_view(), name='api-poll'),
    path('api_poll/<pk>', api_view.PollRetrieveUpdateDestroyAPIView.as_view(), name='api-poll-detail'),

    path("api_date/", api_view.DateListCreateAPIView.as_view(), name='api-date'),
    path('api_date/<pk>', api_view.DateDetailAPIView.as_view(), name='api-date-detail'),
    
    path("api_events/", api_view.EventsListCreateAPIView.as_view(), name='api-event'),
    path('api_events/<pk>', api_view.EventsDetailAPIView.as_view(), name='api-events-detail'),
    
    
    #******************************* ------- ***********************************

]