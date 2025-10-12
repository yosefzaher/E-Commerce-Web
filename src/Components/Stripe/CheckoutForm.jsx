import { useState } from "react";
import { CardElement, CardExpiryElement, CardNumberElement, CardCvcElement, useStripe, useElements } from "@stripe/react-stripe-js";

import { FaRegCreditCard, FaCalendarAlt, FaLock, FaMapMarkerAlt } from "react-icons/fa";

import api from "../../services/axios-global";
import Swal from "sweetalert2";
import stripeLogo from "../../assets/Cat_Image/stripeLogo.png"
import UseOrders from "../../Hooks/Orders/UseOrders";
import { useUser } from "../../Context/UserProvider";
// import { useShipOrder } from "../../Context/ShipOrders/ShipProvider";


const CheckoutForm = ({ amount, orders, Close_Pay, setOrders, GetUserShipedOrders }) => {
    const stripe = useStripe();
    const elements = useElements();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [zip, setZip] = useState("");


    const { user } = useUser();
    const userId = user?.id;
    // const orderIds = orders.map(o => o.orderId).join(", ");
    const orderIds = orders.map(o => o.orderId);


    // const validatePostal = (zip) => {
    //     const cleaned = zip.trim();
    //     if (!cleaned) return "Postal/ZIP code is required";
    //     if (cleaned.length < 3 || cleaned.length > 10)
    //         return "Postal/ZIP code length must be between 3 and 10 characters";
    //     if (!/^[A-Za-z0-9\s-]+$/.test(cleaned))
    //         return "Postal/ZIP code can contain only letters, numbers, spaces, and dashes";
    //     return null;
    // };

    const validatePostal = (zip) => {
        if (typeof zip !== 'string') return "Postal/ZIP code is required";
        const cleaned = zip.trim();

        const pattern = /^[A-Za-z0-9\s-]{3,10}$/;

        if (!cleaned) return "Postal/ZIP code is required";
        if (!pattern.test(cleaned))
            return "Postal/ZIP code id invalid";
        return null;
    };


    // const { ClearOrders, GetUserOrders, setOrders } = UseOrders();

    // const { GetShipOrdersByUserID } = useShipOrder();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        if (!stripe || !elements) {
            setError("Stripe is not loaded yet. Please try again.");
            return;
        }

        const postalError = validatePostal(zip);
        if (postalError) {
            setError(postalError);
            setLoading(false);
            return;
        }



        try {

            const res = await api.post("/Payments/create-payment-intent",
                {
                    userId,
                    orderIds: orderIds,
                    amount: amount,
                    currency: "egp"
                },
                {
                    headers: { "Content-Type": "application/json" },
                }
            );

            const data = res.data;


            if (!data.clientSecret) {
                throw new Error(data.message || "Error in Payment Method Try Again && No client secret.");
            }

            // Option A: confirm using card number element as payment_method
            const cardNumberEl = elements.getElement(CardNumberElement);


            const result = await stripe.confirmCardPayment(data.clientSecret, {
                payment_method: {
                    card: cardNumberEl,
                    billing_details: {
                        name: `${user.firstName} ${user.lastName}`,
                        email: user.email,
                        address: {
                            postal_code: zip
                        }
                    }
                }
            });

            // const result = await stripe.confirmCardPayment(data.clientSecret, {
            //     payment_method: {
            //         card: elements.getElement(CardElement),
            //     },
            // });


            if (result.error) {
                Swal.fire({
                    title: "Payment Failed",
                    text: result.error.message,
                    icon: "error",
                    confirmButtonColor: "#d33",
                });
                return;
            } else if (result.paymentIntent.status === "succeeded") {

                // Call mark-shipped API
                for (const order of orders) {
                    const markShippedRes = await api.patch(`/Orders/${order.orderId}/mark-shipped`, null, {
                        params: { userId: user?.id },
                    });
                    console.log(`Order ${order.orderId} marked as shipped`, markShippedRes.data);
                }

                // const orderIds = orders.map(o => o.orderId).join(", ");
                const TotalPrice = amount;
                const phoneNumber = "201055295531";

                // setOrders([]);

                GetUserShipedOrders();

                Close_Pay();

                const swalResult = await Swal.fire({
                    title: "Payment Done",
                    text: "Please enter your address to complete the order:",
                    input: "textarea",
                    inputPlaceholder: "Enter your full address here...",
                    inputValidator: (value) => {
                        if (!value) {
                            return "You must enter your address before continuing!";
                        }
                    },
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    showCancelButton: false,
                    confirmButtonText: "Send on WhatsApp",
                    confirmButtonColor: "#25D366",
                });

                if (swalResult.isConfirmed) {
                    const address = swalResult.value;
                    const message = `New Stripe Paid Order
UserId: ${user.id}
Name: ${user.firstName} ${user.lastName}
OrderId: ${orderIds}
TotalPrice: ${TotalPrice} EGP
Address: ${address}

This order is *already paid* via Stripe, please prepare it for shipping.`;

                    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
                    window.open(url, "_blank");
                }


                // await GetUserOrders();
            }

        } catch (err) {
            console.error("Payment Error:", err);
            Swal.fire({
                title: "Error",
                text: err.response?.data?.message || err.message || "Payment failed, please try again.",
                icon: "error",
            });
        }
        finally {
            setLoading(false);
        }
    };

    // Small styling options for Stripe Elements
    const elementOptions = {
        style: {
            base: {
                fontSize: "16px",
                color: "#495057",
                "::placeholder": { color: "#6c757d" },
                fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial'
            },
            invalid: { color: "#dc3545" },
        },
    };


    return (
        <form onSubmit={handleSubmit} className="container mt-4">
            <div className="row justify-content-center">
                <div className="col-md-12 ">
                    <div className="card shadow-lg border-0 rounded-4 p-4">

                        <div className="d-flex justify-content-center align-items-center gap-2 mb-4">
                            <img src={stripeLogo} alt="stripeLogo" width={70} />
                            <h4 className="text-center mt-1 fs-2 fw-bold"> Payment</h4>
                        </div>

                        {/* <label className="form-label">Card number</label>
                        <div className="mb-3 p-2 border rounded">
                            <CardNumberElement options={elementOptions} />
                        </div> */}

                        {/* Card Number */}
                        <label className="form-label fw-semibold">Card Number</label>
                        <div className="input-group mb-3 border rounded p-2 align-items-center">
                            <span className="input-group-text bg-transparent border-0">
                                <FaRegCreditCard className=" fs-5" style={{ color: "#635BFF" }} />
                            </span>
                            <div className="flex-grow-1">
                                <CardNumberElement options={elementOptions} />
                            </div>
                        </div>

                        {/* Expiry + CVC */}
                        <div className="d-flex gap-2">
                            <div className="flex-grow-1">
                                <label className="form-label fw-semibold">Expiry</label>
                                <div className="input-group mb-3 border rounded p-2 align-items-center">
                                    <span className="input-group-text bg-transparent border-0">
                                        <FaCalendarAlt className=" fs-6" style={{ color: "#635BFF" }} />
                                    </span>
                                    <div className="flex-grow-1">
                                        <CardExpiryElement options={elementOptions} />
                                    </div>
                                </div>
                            </div>
                            <div style={{ width: 140 }}>
                                <label className="form-label fw-semibold">CVC</label>
                                <div className="input-group mb-3 border rounded p-2 align-items-center">
                                    <span className="input-group-text bg-transparent border-0">
                                        <FaLock className=" fs-6" color="#635BFF" />
                                    </span>
                                    <div className="flex-grow-1">
                                        <CardCvcElement options={elementOptions} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ZIP / Postal Code */}
                        <label className="form-label fw-semibold">Postal / ZIP</label>
                        <div className="input-group mb-3 border rounded p-2 align-items-center">
                            <span className="input-group-text bg-transparent border-0">
                                <FaMapMarkerAlt className=" fs-6" style={{ color: "#635BFF" }} />
                            </span>
                            <input
                                type="text"
                                className="form-control border-0 shadow-none"
                                value={zip}
                                onChange={(e) => setZip(e.target.value)}
                                placeholder="Postal code"
                            />
                        </div>


                        {/* 
                        <div className="d-flex gap-2">
                            <div className="flex-grow-1">
                                <label className="form-label">Expiry</label>
                                <div className="mb-3 p-2 border rounded">
                                    <CardExpiryElement options={elementOptions} />
                                </div>
                            </div>
                            <div style={{ width: 140 }}>
                                <label className="form-label">CVC</label>
                                <div className="mb-3 p-2 border rounded">
                                    <CardCvcElement options={elementOptions} />
                                </div>
                            </div>
                        </div> 

                        <label className="form-label">Postal / ZIP</label>
                        <input
                            className="form-control mb-3"
                            value={zip}
                            onChange={(e) => setZip(e.target.value)}
                            placeholder="Postal code"
                        /> 
                        */}

                        {error && (
                            <div className="alert alert-danger py-2">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={!stripe || loading}
                            className="btn btn-primary w-100"
                        >
                            {loading ? "Payment Processing..." : "Pay Now"}
                            {loading && <span className="spinner-border spinner-border-sm"></span>}
                        </button>
                    </div>
                </div>
            </div>
        </form>
    );
}

export default CheckoutForm;