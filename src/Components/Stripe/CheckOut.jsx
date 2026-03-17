import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";

// Safely load Stripe — guard against missing env var
const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
if (!stripeKey) {
    console.error("❌ VITE_STRIPE_PUBLISHABLE_KEY is missing from .env — Stripe will not load!");
}
const stripePromise = stripeKey ? loadStripe(stripeKey) : null;

const CheckOut = ({ amount, orders, Close_Pay, setOrders, GetUserShipedOrders }) => {
    return (
        <Elements stripe={stripePromise}>
            <CheckoutForm
                amount={amount}
                orders={orders}
                Close_Pay={Close_Pay}
                setOrders={setOrders}
                GetUserShipedOrders={GetUserShipedOrders}
            />
        </Elements>
    );
};

export default CheckOut;
