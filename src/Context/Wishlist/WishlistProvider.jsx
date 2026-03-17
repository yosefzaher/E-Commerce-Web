import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useUser } from "../UserProvider";
import api from "../../services/axios-global";


const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
    const { user } = useUser();
    const [wishlistitems, setWishlist] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [actionLoading, setActionLoading] = useState(false);

    const [wishlistCount, setWishlistCount] = useState(0);


    const GetWishList = async () => {
        setLoading(true);
        try {
            const res = await api.get(
                `/Wishlists/GetUserWishlist/${user?.id}`
            );
            setWishlist(res.data);
            setWishlistCount(res.data.length);
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    };

    const AddToWishlist = async (productId) => {
        if (!user?.id) return;
        setActionLoading(true);
        try {
            await api.post(
                `/Wishlists/AddToUserWishlist/${user.id}/${productId}`
            );
            setWishlistCount(prev => prev + 1);
            await GetWishList();
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        } finally {
            setActionLoading(false);
        }
    };

    const RemoveFromWishlist = async (productId) => {
        if (!user?.id) return;
        setActionLoading(true);
        try {
            await api.delete(
                `/Wishlists/RemoveFromUserWishlist/${user.id}/${productId}`
            );
            setWishlistCount(prev => Math.max(prev - 1, 0));
            await GetWishList();
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        } finally {
            setActionLoading(false);
        }
    };


    useEffect(() => {
        if (user?.id) {
            GetWishList();
        }
    }, [user]);


    return (
        <WishlistContext.Provider
            value={{ wishlistitems, actionLoading, loading, error, wishlistCount, setWishlistCount , GetWishList, AddToWishlist, RemoveFromWishlist }}
        >
            {children}
        </WishlistContext.Provider>
    );
};

