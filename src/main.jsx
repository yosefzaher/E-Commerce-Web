import { createRoot } from 'react-dom/client'
import './index.css'

import Router from './Routes/Router.jsx';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import ProductProvider from './Context/ProductProvider.jsx';
import CartProvider from './Context/CartProvider.jsx';
import UserProvider from './Context/UserProvider.jsx';
import { WishlistProvider } from './Context/Wishlist/WishlistProvider.jsx';
import { ShipProvider } from './Context/ShipOrders/ShipProvider.jsx';


createRoot(document.getElementById('root')).render(
  <UserProvider>
    <ProductProvider>
      <CartProvider>
        <WishlistProvider>
          <ShipProvider>
            <Router />
          </ShipProvider>
        </WishlistProvider>
      </CartProvider>
    </ProductProvider>
  </UserProvider>
)
