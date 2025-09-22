import axios from 'axios';
import React, { createContext, useContext, useEffect, useState } from 'react'
import { useUser } from './UserProvider';
import { toast } from 'react-toastify';
import api from '../services/axios-global';
import { useProduct } from './ProductProvider';


const cartContext = createContext(null);

export const UseCart = () => useContext(cartContext);

const CartProvider = ({ children }) => {

    const [cart, setCart] = useState({
        cartId: null,
        userId: null,
        totalAmount: 0,
        items: []
    });

    const { product } = useProduct();


    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { user, token } = useUser();

    const GetCartItems = async () => {
        if (!user?.id) return;
        try {
            setLoading(true);
            const res = await api.get(`/ShoppingCarts/GetAllShoppingCart`, {
                params: { userId: user?.id }
            });
            let data = res.data

            if (Array.isArray(data)) {
                data = data[0] || { cartId: null, userId: null, totalAmount: 0, items: [] };
            }

            if (!data.items) {
                data.items = [];
            }

            setCart(data);
        } catch (err) {
            setError(err.response?.data || "Failed to fetch cart");
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        if (user?.id) {
            GetCartItems();
        } else {
            setCart({
                cartId: null,
                userId: null,
                totalAmount: 0,
                items: []
            });
        }
    }, [token, user?.id]);

    //  Add Item to cart
    const addToCart = async (userId, productId, quantity = 1) => {
        setLoading(true);
        try {

            await api.post(
                `/ShoppingCarts/AddtoShoopingCart`,
                null,
                {
                    // headers: { Authorization: `Bearer ${token}` },
                    params: { userId, productId, quantity }
                }
            );

            setCart(prev => {
                const existingItem = prev.items.find(item => item.productId === productId);

                if (existingItem) {
                    return {
                        ...prev,
                        items: prev.items.map(item =>
                            item.productId === productId
                                ? { ...item, quantity: item.quantity + quantity }
                                : item
                        ),
                    };
                } else {
                    return {
                        ...prev,
                        items: [
                            ...prev.items,
                            { productId, quantity, price: 0 },
                        ],
                    };
                }
            });

            await GetCartItems();
        } catch (err) {
            setError(err.response?.data || "Failed to add item");
        } finally {
            setLoading(false);
        }
    };

    // Remove Item from Cart
    const removeFromCart = async (productId, quantity) => {
        try {
            setLoading(true);
            await api.delete(
                `/ShoppingCarts/RemoveFromCart/${user?.id}`,
                { params: { productId, quantity } }
            );

            await GetCartItems();
        }
        catch (err) {
            setError(err.response?.data || "Failed to remove item");
        } finally {
            setLoading(false);
        }
    };

    // Clear Cart and userID and CartID when LogOut
    const clearCart_LogOut = () => setCart({
        cartId: null,
        userId: null,
        totalAmount: 0,
        items: []
    });

    // Clear Cart data not default UserId or CartId
    const clearCart = () => setCart(prev => ({ ...prev, items: [], totalAmount: 0 }));

    //  Change Quantity
    const changeQuantity = async (userId, productId, newQuantity) => {
        setLoading(true)
        try {
            const res = await api.patch(`/ShoppingCarts/ChangeCartQuantity/${user?.id}`
                , {}, { params: { ProductId: productId, quantity: newQuantity } }
            )
            toast.success("Product Quantity Edit successfully ")
            await GetCartItems();
            return true;
        } catch (err) {
            setError(err.response?.data || "Failed to Update Cart item quantity");
        } finally {
            setLoading(false)
        }
    }

    // Totla Quantity
    const getTotalQuantity = () =>
        cart.items?.reduce((sum, item) => sum + item.quantity, 0);

    // Total Price
    const getTotalPrice = () =>
        cart.items?.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <cartContext.Provider value={{ cart, loading, error, setCart, addToCart, getTotalQuantity, getTotalPrice, removeFromCart, clearCart, changeQuantity, clearCart_LogOut }}>
            {children}
        </cartContext.Provider>
    )
}

export default CartProvider
