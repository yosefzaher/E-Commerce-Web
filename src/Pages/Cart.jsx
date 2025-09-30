
import { UseCart } from '../Context/CartProvider';
import CartItem from '../Components/Cart/CartItem';

import Lottie from "lottie-react";
import EmptyCard from "../assets/LotiFiles/Empty_Cart.json"
import Success from "../assets/LotiFiles/Success.json"
import { Spinner } from 'react-bootstrap';
import UseOrders from '../Hooks/Orders/UseOrders';
import { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import LoadingSpinner from '../Components/Common/LoadingSpinner';

const Cart = () => {
    const { cart, getTotalPrice, loading, clearCart_LogOut } = UseCart();

    const { PlaceOrder } = UseOrders()
    const [orderSuccess, setOrderSuccess] = useState(false);

    const handelPlaceOrder = async () => {
        const success = await PlaceOrder();
        if (success) {
            setOrderSuccess(true);
            clearCart_LogOut();
        }
    };

    if (loading) { return <LoadingSpinner message="Loading Cart..." size={"lg"} />; }

    if (orderSuccess) {
        return (
            <div className="text-center mt-5 m-auto w-100" style={{ maxWidth: "600px" }}>
                <Lottie animationData={Success} loop={false} autoplay={true} />
                <h3 className="mt-3 fw-semibold text-success">Order placed successfully </h3>
            </div>
        );
    }


    if (!cart.items || cart.items.length === 0) {
        return (
            <>
                <div className='m-auto w-100' style={{ maxWidth: "600px" }} >
                    <Lottie animationData={EmptyCard} loop={true} autoplay={true} />
                </div>
                <h3 className="text-center mt-3 fw-semibold">Your cart is empty ):</h3>
            </>
        )
    }

    return (
        <div className="container mt-4">
            {/* <ToastContainer /> */}
            {
                cart.items.map((item, idx) => (
                    <CartItem
                        key={item.productId}
                        img={item.image}
                        id={item.productId}
                        title={item.title}
                        price={item.price}
                        quantity={item.quantity}
                        max={item.stockQuantity}
                    />
                ))}

            <div className='d-flex justify-content-between align-items-center mt-5'>
                <h5>Total Price: {(getTotalPrice()).toFixed(2)} EGP</h5>
                <button className='btn btn-primary' onClick={handelPlaceOrder}>Place Order</button>
            </div>
        </div>
    )
}


export default Cart