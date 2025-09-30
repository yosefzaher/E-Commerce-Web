import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../../services/axios-global";
import { useUser } from "../../Context/UserProvider";
import { toast } from "react-toastify";

const ShipOrderContext = createContext(null);

export const ShipProvider = ({ children }) => {
    const [ShipOrders, setShipOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // const { user } = useUser();
    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;
    // console.log(user);


    const GetShipOrders = async () => {
        if (!user?.userRoles?.includes("Admin")) return;
        setLoading(true);
        try {
            const res = await api.get(`/Orders/GetAllShippedOrders`);
            const data = res.data;
            console.log("All Shipped Orders:", data);
            setShipOrders(data);
        } catch (err) {
            console.error("Error in GetShipOrders", err);
            setError(err.response?.data?.message || "Failed to fetch shipped orders");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        GetShipOrders();
    }, []);


    const ClearUserShippedOrders = async (userId, orderId) => {
        if (ShipOrders.length === 0) {
            console.log("No shipped orders to delete");
            return;
        }

        setLoading(true)
        try {
            const res = await api.delete(`/Orders/ClearUserShippedOrders/${userId}`, {
                params: { orderId }
            })
            if (res.status === 200 || res.status === 204) {
                setShipOrders([]);
                await GetShipOrders();
                toast.success("Shipped orders Deleted successfully ");
            } else {
                toast.warn("No shipped orders to clear ");
            }

            return res.data;
        } catch (err) {
            console.error("Error in ClearUserShippedOrders:", err);
            setError(err.response?.data?.message || "Failed to clear shipped orders");
        } finally {
            setLoading(false);
        }
    }


    return (
        <ShipOrderContext.Provider
            value={{
                ShipOrders,
                loading,
                error,
                GetShipOrders,
                ClearUserShippedOrders
            }}
        >
            {children}
        </ShipOrderContext.Provider>
    );
};

export const useShipOrder = () => useContext(ShipOrderContext);
