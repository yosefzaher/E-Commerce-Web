import { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
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

    const { user } = useUser();
    const userId = user?.id;


    // const { ClearOrders, GetUserOrders, setOrders } = UseOrders();

    // const { GetShipOrdersByUserID } = useShipOrder();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!stripe || !elements) return;


        setLoading(true);
        setError("");

        const orderIds = orders.map(o => o.orderId).join(", ");

        try {

            const res = await api.post("/Payments/create-payment-intent",
                {
                    userId,
                    orderId: 0, // orderIds
                    // Array to can take more than order
                    amount: amount,
                    currency: "egp"
                },
                {
                    headers: { "Content-Type": "application/json" },
                }
            );

            const data = res.data;


            if (!data.clientSecret) {
                throw new Error(data.message || "Error in Payment Method Try Again");
            }

            const result = await stripe.confirmCardPayment(data.clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement),
                },
            });


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

                // await ClearOrders();

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

    return (
        <form onSubmit={handleSubmit} className="container mt-4">
            <div className="row justify-content-center">
                <div className="col-md-12 ">
                    <div className="card shadow p-4">
                        <div className="d-flex justify-content-center align-items-center gap-2 mb-4">
                            <img src={stripeLogo} alt="stripeLogo" width={80} />
                            <h4 className="text-center mt-1 fs-2 fw-bold"> Payment</h4>
                        </div>

                        <div className="mb-3 p-2 border rounded">
                            <CardElement className="form-control" />
                        </div>

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