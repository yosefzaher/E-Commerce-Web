import React, { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "../App";
import ProtectRouting from "./ProtectRouting/ProtectRouting";
import ErrorPage from "../Error/ErrorPage";
import Categories from "../Pages/Categories";

import Loading from "../assets/LotiFiles/Loading.json";
import Lottie from "lottie-react";
import Users from "../Pages/Users";
import Wishlists from "../Pages/Wishlists";
import Admin from "../Pages/Admin";
import Dashboard from "../Components/Admin/Dashboard";
import CategoriesAdmin from "../Components/Admin/CategoriesAdmin";
import Authorized from "../Error/Authorized";
import AdminRouting from "./ProtectRouting/AdminRouting";




const Home = lazy(() => import("../Pages/Home"));
const Products = lazy(() => import("../Pages/Products"));
const ProductDetails = lazy(() => import("../Components/Products/ProductDetails"));
const Register = lazy(() => import("../Pages/Register"));
const Login = lazy(() => import("../Pages/Login"));
const Profile = lazy(() => import("../Pages/Profile"));
const Orders = lazy(() => import("../Pages/Orders"));
const Cart = lazy(() => import('../Pages/Cart'));

const LoadingScreen = () => (
    <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="m-auto w-100" style={{ maxWidth: "600px" }} >
            <Lottie animationData={Loading} loop={true} />
        </div>
    </div>
);

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        errorElement: <ErrorPage />,
        children: [
            {
                index: true,
                element: (
                    <Suspense fallback={<LoadingScreen />}>
                        <Home />
                    </Suspense>
                ),
            },
            {
                path: "/categories",
                element: (
                    <Categories />
                ),
            },

            {
                path: "/categories/products/:prefix",
                element: (
                    <Products />
                ),
                loader: ({ params }) => {
                    if (!/^[a-z]+$/i.test(params.prefix)) {
                        throw new Response("Bad Request", {
                            statusText: "Products Category Not Found",
                            status: 400,
                        });
                    }
                },
            },

            {
                path: "/categories/products/:prefix/:id",
                element: (
                    <Suspense fallback={<LoadingScreen />}>
                        <ProductDetails />
                    </Suspense>
                ),
            },

            {
                path: "/cart",
                element: (
                    <Suspense fallback={<LoadingScreen />}>
                        <Cart />
                    </Suspense>
                ),
            },

            {
                path: "/register",
                element: (
                    <Suspense fallback={<LoadingScreen />}>
                        <Register />
                    </Suspense>
                ),
            },

            {
                path: "/login",
                element: (
                    <Suspense fallback={<LoadingScreen />}>
                        <Login />
                    </Suspense>
                ),
            },

            {
                path: "/profile",
                element: (
                    <ProtectRouting>
                        <Profile />
                    </ProtectRouting>
                ),
            },

            {
                path: "/wishlist",
                element: (
                    <Suspense fallback={<LoadingScreen />}>
                        <Wishlists />
                    </Suspense>
                ),
            },

            {
                path: "/orders",
                element: (
                    <ProtectRouting>
                        <Suspense fallback={<LoadingScreen />}>
                            <Orders />
                        </Suspense>
                    </ProtectRouting>
                ),
            },

            {
                path: "/authorized",
                element: (
                    <ProtectRouting>
                        <Suspense fallback={<LoadingScreen />}>
                            <Authorized />
                        </Suspense>
                    </ProtectRouting>
                ),
            },

            {
                path: "/admin",
                element: (
                    <AdminRouting>
                        <Suspense fallback={<LoadingScreen />}>
                            <Admin />
                        </Suspense>
                    </AdminRouting>
                ),
                children: [
                    {
                        index: true,
                        element: (
                            // <AdminRouting>
                                <Dashboard />
                            // </AdminRouting>
                        ),
                    },
                    {
                        path: "categories",
                        element: (
                            <CategoriesAdmin />
                        ),
                    },
                    {
                        path: "users",
                        element: (
                            <Users />
                        ),
                    },
                ],
            },

        ],
    },
]);

const Router = () => {
    return <RouterProvider router={router} />;
};

export default Router;
