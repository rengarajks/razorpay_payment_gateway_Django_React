import React, { useState } from 'react';
import axios from 'axios';

const PaymentComponent = () => {
    const [selectedCourse, setSelectedCourse] = useState('');

    const handlePayment = async () => {
        try {
            const orderUrl = 'http://localhost:8000/ait/payment/create-order/';
            const response = await axios.post(orderUrl, { selectedCourse });

            const { data } = response;
            const options = {
                key: data.razorpay_key,
                amount: data.amount * 100, // Amount in paise
                currency: "INR",
                name: "Tmachine",
                description: "Test Transaction",
                order_id: data.order_id,
                handler: function (response) {
                    // After successful payment, send confirmation to backend
                    sendPaymentConfirmation(response);
                },
                prefill: {
                    name: "Rengaraj K",
                    email: "rengaraj.k@tmachine.com",
                    contact: "1234567890"
                },
                notes: {
                    address: "Your Address"
                },
                theme: {
                    color: "#3399cc"
                }
            };

            const rzp1 = new window.Razorpay(options);
            rzp1.open();
        } catch (error) {
            console.error('Payment error:', error);
        }
    };

    const sendPaymentConfirmation = async (payment_response) => {
        try {
            // You can send a confirmation to the backend here if needed
            const confirmationUrl = 'http://localhost:8000/ait/payment/order-confirmation/';
            const confirm_response=await axios.post(confirmationUrl, payment_response);
            console.log(confirm_response)
        } catch (error) {
            console.error('Confirmation error:', error);
        }
    };

    const handleClick = (val) => {
        setSelectedCourse(val);
        handlePayment();
    };

    return (
        <>
            <h1 className='text-2xl text-red-500'>Select course to buy</h1>
            <div>
                <div className='flex'>
                    <div className='items-center rounded-md justify-center p-4 m-4 bg-gradient-to-r from-cyan-500 to-blue-500 '>
                        <img className='w-[300px]' src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQmmngeGJFNocA_JXfnBGI-yKvz1WNGQ2P7hYqKDrpO2w&s ' alt="Python Course" />
                        <div className='flex flex-col items-center'>
                            <p className='text-white'>Rs.1999</p>
                            <button className='p-2 bg-green-500 rounded-xl px-6 text-white hover:bg-red-500' onClick={() => handleClick("Python")}>Buy</button>
                        </div>
                    </div>

                    <div className='items-center rounded-md justify-center p-4 m-4 bg-gradient-to-r from-cyan-500 to-blue-500 '>
                        <img src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzfSzt9ojpp6dr9SsWbe-KVVd2tud-yOjToBPlaHCfTw&s' className='w-[300px]' alt="Java Course" />
                        <div className='flex flex-col items-center'>
                            <p className='text-white'>Rs.999</p>
                            <button className='p-2 bg-green-500 rounded-xl px-6 text-white hover:bg-red-500' onClick={() => handleClick("Java")}>Buy</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PaymentComponent;
