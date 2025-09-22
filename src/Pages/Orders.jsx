import React, { useState } from "react";
import UseOrders from "../Hooks/Orders/UseOrders";
import Swal from "sweetalert2";
import { Modal, Spinner } from "react-bootstrap";
import NoData from "../assets/LotiFiles/No_Data.json";
import Lottie from "lottie-react";
import OrderDetailsModel from "../Components/Orders/OrderDetailsModel";
import LoadingSpinner from "../Components/Common/LoadingSpinner";
import Heading from "../Components/Common/Heading";
import CheckOut from "../Components/Stripe/CheckOut";
import { FaStripeS, FaWhatsapp } from "react-icons/fa";
import { useUser } from "../Context/UserProvider";
import { TbCashRegister } from "react-icons/tb";

const Orders = () => {
    const {
        orders,
        loading,
        error,
        orderDetails,
        setOrders,
        ClearOrders,
        RemoveOrder,
        OrderDetails,
    } = UseOrders();

    const { user } = useUser();

    const [showModal, setShowModal] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState(null);

    // to Open form Stripe Card
    const [show, setShow] = useState(false);
    const toggleShow = () => {
        setShow(!show);
    };



    // to show checkout to pay Whatsapp or Stripe
    const [checkOutShow, setCheckOutShow] = useState(false);
    const toggleCheckout = () => {
        setCheckOutShow(!checkOutShow);
    };

        const Close_Pay = () => {
        setShow(false);
        setCheckOutShow(false);
    }


    const hadnleOrderDetails = async (orderId) => {
        const details = await OrderDetails(orderId);
        if (details) {
            setSelectedOrderId(orderId);
            setShowModal(true);
        }
    };

    const handleClearOrders = async () => {
        Swal.fire({
            title: "Are you sure?",
            text: "This will delete all your orders and cannot be undone!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete them!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                const success = await ClearOrders();
                if (success) {
                    Swal.fire({
                        title: "Deleted!",
                        text: "All your orders have been cleared.",
                        icon: "success",
                    });
                } else {
                    Swal.fire({
                        title: "Error",
                        text: "Failed to clear orders. Please try again.",
                        icon: "error",
                    });
                }
            }
        });
    };

    if (loading) {
        return <LoadingSpinner message="Loading Orders..." size={"lg"} />;
    }

    const TotalPrice = orders.reduce(
        (acc, item) => acc + Number(item.totalAmoutForeachOrder || 0),
        0
    );

    const orderIds = orders.map((order) => order.orderId).join(", ");

    const phoneNumber = "201055295531";
    const message = `New WhatsApp Order Request
    UserId: ${user.id}
    Name: ${user.firstName} ${user.lastName}
    OrderId: ${orderIds}
    TotalPrice: ${TotalPrice}
    
    Please confirm this order.`;

    const handleWhatsAppClick = () => {
        const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
            message
        )}`;
        window.open(url, "_blank");
        Close_Pay();
    };

    return (
        <div className="container mt-4">
            <Heading title={`Orders Page`} />

            <div className="">
                {orders.length === 0 ? (
                    <>
                        <div className="m-auto w-100" style={{ maxWidth: "600px" }}>
                            <Lottie animationData={NoData} loop={true} autoplay={true} />
                        </div>
                        <h3 className="text-center mt-2 fw-bold">No Orders Found</h3>
                    </>
                ) : (
                    <div>
                        {orders.map((order, idx) => (
                            <div key={order.orderId} className="my-3">
                                <div className="bg-light p-3 d-flex justify-content-between align-items-center gap-5 ">
                                    <span className="fw-bold">{idx + 1} - Order</span>
                                    <div className="d-flex flex-lg-row flex-column align-items-center gap-4">
                                        <button
                                            className="btn btn-success px-3"
                                            onClick={() => hadnleOrderDetails(order.orderId)}
                                        >
                                            Order Details
                                        </button>
                                        <button
                                            className="btn btn-danger"
                                            onClick={() => RemoveOrder(order.orderId)}
                                        >
                                            Remove Order
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}

                        <OrderDetailsModel
                            showModal={showModal}
                            setShowModal={setShowModal}
                            orderDetails={orderDetails}
                            selectedOrderId={selectedOrderId}
                        />

                        <button
                            className="btn btn-danger mt-3 px-3 py-2"
                            onClick={handleClearOrders}
                        >
                            Clear Orders
                        </button>

                        <div className="mt-5 d-flex flex-sm-row flex-column justify-content-between align-items-center gap-2">
                            <h3>
                                <span className="fst-italic">Total Price</span> : {TotalPrice}{" "}
                                EGP
                            </h3>
                            {/* <h5>
                                <span className="fst-italic">Shipping within 2 Days</span>
                            </h5> */}
                        </div>

                        {/* ChekOut */}
                        <div className="mt-2 d-flex justify-content-end ">
                            <button
                                className="btn btn-primary fw-semibold "
                                onClick={toggleCheckout}
                            >
                                {checkOutShow ? "Close" : "Checkout"}
                            </button>
                        </div>

                        {/* Confirm order */}
                        {checkOutShow && (
                            <div className="mt-5">
                                <h2 className="text-center fs-2 fw-bold my-4">
                                    To Confirm Order <TbCashRegister />
                                </h2>
                                <div className="row">
                                    <div className="col-md-6 col-sm-12 d-flex justify-content-center flex-column ">
                                        <h2 className="justify-content-center my-4 d-flex align-items-center gap-2 text-success">
                                            <FaWhatsapp size={48} /> WhatsApp
                                        </h2>
                                        <h4 className="h-50">
                                            Get in touch with our team directly on WhatsApp for quick
                                            order confirmation and payment assistance - fast, secure,
                                            and convenient.
                                        </h4>
                                        <button
                                            className="btn btn-success mt-4 fw-semibold"
                                            onClick={handleWhatsAppClick}
                                        >
                                            <FaWhatsapp size={20} className="mb-1 me-1" /> Contact on
                                            WhatsApp
                                        </button>
                                    </div>

                                    <div className="col-md-6 col-sm-12 d-flex justify-content-center flex-column">
                                        <h2 className="justify-content-center my-4 d-flex align-items-center gap-2 text-primary">
                                            <FaStripeS size={48} className="" /> Stripe{" "}
                                        </h2>
                                        <h4 className="h-50">
                                            Pay securely online through Stripe - a trusted payment
                                            gateway that keeps your transactions safe and hassle-free.
                                        </h4>
                                        <button
                                            className="btn btn-primary mt-4 fw-semibold"
                                            onClick={toggleShow}
                                        >
                                            {show ? (
                                                "Close"
                                            ) : (
                                                <span className="d-flex justify-content-center align-items-center gap-2">
                                                    <FaStripeS /> Pay With Stripe
                                                </span>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {show && (
                            <CheckOut
                                amount={TotalPrice}
                                orders={orders}
                                Close_Pay={Close_Pay}
                                // setOrders={setOrders}
                            />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Orders;
