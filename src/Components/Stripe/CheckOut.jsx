import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";

// المفتاح ده من Stripe Dashboard (Publishable key)
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

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
