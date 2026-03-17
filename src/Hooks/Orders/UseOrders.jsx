import React, { useEffect, useState } from "react";
import { useUser } from "../../Context/UserProvider";
import { useProduct } from "../../Context/ProductProvider";
import api from "../../services/axios-global";

const UseOrders = () => {
    const { user, token } = useUser();
    const userId = user?.id;

    const { GetProducts } = useProduct();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [orderDetails, setOrderDetails] = useState(null);

    const GetUserOrders = async () => {
        if (!userId) return;
        setLoading(true);
        setError(null);
        try {
            const res = await api.get(
                `/Orders/GetUserOrders/${userId}`
            );
            setOrders(res.data || []);
        } catch (err) {
            setError(err.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        GetUserOrders();
    }, [userId]);

    const PlaceOrder = async () => {
        setLoading(true);
        try {
            const res = await api.post(
                `/Orders/PlaceOrder/${userId}`,
                {},
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (res.status === 204 || res.status === 200) {
                setTimeout(() => {
                    GetProducts();
                }, 400);
                return true;
            }
            return false;
        } catch (err) {
            console.error("Error placing order:", err.response?.data || err.message);
        } finally {
            setLoading(false);
        }
    };

    const OrderDetails = async (orderId) => {
        setLoading(true);
        try {
            const res = await api.get(
                `/Orders/GetProductsDetails/${userId}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                    params: { orderId },
                }
            );
            setOrderDetails(res.data);
            return res.data;
        } catch (error) {
            setError("Error in Show Details:", error.response?.data || error.message);
        } finally {
            setLoading(false);
        }
    };

    const RemoveOrder = async (orderId) => {
        setLoading(true);
        try {
            const res = await api.delete(
                `/Orders/DeleteUserOrder/${userId}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                    params: { orderId },
                }
            );

            if (res.status === 200 || res.status === 204) {
                setOrders((prevOrders) =>
                    prevOrders.filter((order) => order.orderId !== orderId)
                );

                await GetProducts();
                return true;
            }

            return false;
        } catch (error) {
            setError("Error removing order:", error.response?.data || error.message);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const ClearOrders = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await api.delete(
                `/Orders/ClearUserOrders/${userId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (res.status === 204 || res.status === 200) {
                setOrders([]);
                await GetProducts();
                return true;
            }
            return false;
        } catch (error) {
            setError(error.response?.data || error.message || "Something went wrong");
            return false;
        } finally {
            setLoading(false);
        }
    };

    return {
        orders,
        loading,
        error,
        orderDetails,
        setOrders,
        PlaceOrder,
        ClearOrders,
        RemoveOrder,
        OrderDetails,
        GetUserOrders,
    };
};

export default UseOrders;
