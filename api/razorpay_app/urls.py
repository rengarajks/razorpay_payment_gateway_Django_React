from django.urls import path
from .views import create_order,payment_confirmation

urlpatterns = [
    #Post course details to get price in frontend
    path('create-order/', create_order, name='create-order'),

    #Store payment details and Send confirmation to React
    path('payment-confirmation/',payment_confirmation,name="payment-confirmation")
    
]
