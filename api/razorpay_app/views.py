from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
from .razorpay_client import razorpay_client
import json
import logging
from django.http import JsonResponse

logger = logging.getLogger(__name__)

@csrf_exempt
def create_order(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            selected_data = data.get('selectedCourse')
            logger.debug("Received request for course: %s", selected_data)
            
            # Validate selected course and determine amoun
            if selected_data == 'Python':
                amount = 1999
            elif selected_data == 'Java':
                amount = 999 
            else:
                return JsonResponse({'error': 'Invalid course'}, status=400)

            # Ensure amount is a valid number
            if not isinstance(amount, (int, float)) or amount <= 0:
                return JsonResponse({'error': 'Invalid amount'}, status=400)
            
            # Convert amount to integer paise (INR)
            amount_in_paise = int(amount * 100)
            currency = 'INR'

            logger.debug("Creating Razorpay order with amount: %s", amount_in_paise)
            
            payment_order = razorpay_client.order.create(dict(amount=amount_in_paise, currency=currency))
            payment_order_id = payment_order['id']

            logger.debug("Razorpay order created successfully with ID: %s", payment_order_id)

            return JsonResponse({
                'order_id': payment_order_id,
                'razorpay_key': settings.RAZORPAY_KEY_ID,
                'amount': amount  # Sending amount to frontend for validatio
            })
        except Exception as e:
            logger.error("Error creating Razorpay order: %s", str(e))
            return JsonResponse({'error': 'Internal server error'}, status=500)
    return JsonResponse({'error': 'Invalid request method'}, status=405)



@csrf_exempt
def payment_confirmation(request):
    if request.method == "POST":
        print(request.body)        
        # You can perform further actions based on the payment confirmation
        
        return JsonResponse({'message': 'Payment confirmation received successfully'})
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)
