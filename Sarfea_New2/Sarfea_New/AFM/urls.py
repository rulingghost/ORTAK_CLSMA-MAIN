from django.contrib import admin
from django.urls import path
from django.views.static import serve
from django.conf import settings
from AFM.api import views  as api_view
from AFM import views

urlpatterns = [
    #MODUL-1
    path("home", views.home, name='home'),
    path("projects/", views.projects, name='projects'),
    path('project_details/<project_id>/', views.project_details, name='project_details'),
    path("realized_cost/<project_id>/", views.realized_cost, name='realized_cost'),
    path('income_details/<project_id>/', views.income_details, name='income_details'),
    path("client/", views.client, name='client'),
    path("supplier/", views.supplier, name='supplier'),
    
    
    #MODUL-2    
    path("sales_offer/", views.sales_offer, name='sales_offer'),
    path('update_card_situation/', views.update_card_situation, name='update_card_situation'),
    path('sales_offer/AFM/delete_salesoffercard/<int:card_id>/', views.delete_salesoffercard, name='delete_salesoffercard'),
    path('sales_offer/AFM/set_card_lost/<card_id>/', views.set_card_lost, name='set_card_lost'),
    path('sales_offer/AFM/set_card_relost/<card_id>/', views.set_card_relost, name='set_card_relost'),
    path('sales_offer/AFM/set_card_gain/<card_id>/', views.set_card_gain, name='set_card_gain'),
    path('sales_offer/AFM/set_card_regain/<card_id>/', views.set_card_regain, name='set_card_regain'),
    path('sales_offer/AFM/set_card_wait/<card_id>/', views.set_card_wait, name='set_card_wait'),
    path('sales_offer/AFM/set_card_rewait/<card_id>/', views.set_card_rewait, name='set_card_rewait'),
    path('sales_offer/AFM/create_revise/<card_id>/', views.create_revise, name='create_revise'),
    path("sales_offer_revises/<card_id>/", views.sales_offer_revises, name='sales_offer_revises'),
    
    #MODUL-3
    path('operation_care/', views.operation_care, name='operation_care'),
    path("operation_care_detail/<operation_care_id>/", views.operation_care_detail, name='operation_care_detail'),
    path('fault_notification/', views.fault_notification, name='fault_notification'),
    path('fail_edit/<fail_id>/', views.fail_edit, name='fail_edit'),
    path('inverter/<operation_care_id>/', views.inverter, name='inverter'),
    path("calendar", views.calendar, name='calendar'),

    path("report/", views.report, name='report'),


    path('get_lost_cards/', views.get_lost_cards, name='get_lost_cards'),
    path('get_gain_cards/', views.get_gain_cards, name='get_gain_cards'),
    path('get_late_cards/', views.get_late_cards, name='get_late_cards'),
    path('get_run_cards/', views.get_run_cards, name='get_run_cards'),
    path('get_cards/', views.get_cards, name='get_cards'),

    path('get_operation_care/', views.get_operation_care, name='get_operation_care'),
    path('get_fail/', views.get_fail, name='get_fail'),
    path("get_inventors/<operation_care_id>/", views.get_inventors, name='get_inventors'),
    path("get_strings/<inventor_id>/", views.get_strings, name='get_strings'),
    
    path("get_dollar_rate/<str:date>/", views.get_dollar_rate, name='get_dollar_rate'),
    
    #MODUL-POST
   
    path('post_update_string/<string_id>/', views.post_update_string, name='post_update_string'),
    path('post_card_file/', views.post_card_file, name='post_card_file'),

    #MODUL-DENEME
    path("deneme/", views.deneme, name='deneme'),
    path("deneme2/", views.deneme2, name='deneme2'),
   ]   
