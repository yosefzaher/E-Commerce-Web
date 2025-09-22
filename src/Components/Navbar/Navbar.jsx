import { Link, useNavigate } from "react-router-dom";
import CartNav from "./RightNav/CartNav";

import { useUser } from "../../Context/UserProvider";
import { UseCart } from "../../Context/CartProvider";

import { GiExitDoor } from "react-icons/gi";
import { BiRun } from "react-icons/bi";
import { IoPerson } from "react-icons/io5";



import WishNav from "./RightNav/WishNav";
import "./Navstyle.css";
import { useWishlist } from "../../Context/Wishlist/WishlistProvider";


const Navbar = () => {
    const { Logout, token, user } = useUser();
    const { clearCart_LogOut } = UseCart();
    const {setWishlistCount } = useWishlist();
    

    const navigate = useNavigate();

    const handleLogOut = () => {
        Logout();
        clearCart_LogOut();
        setWishlistCount(0);
        navigate("/login");
    };


    const userRoles = user?.userRoles || [];
    const isAdmin = userRoles.includes("Admin");

    return (
        <>
            <nav className="pt-1 d-flex align-items-center justify-content-between px-3 container-fluid sticky-top bg-white" style={{zIndex:"1060"}}>
                <div className="">
                    <h2>
                        Click to
                        <Link
                            className="navbar-brand badge text-bg-info p-2 fs-3 text-white ms-1"
                            to="/"
                        >
                            Buy
                        </Link>
                    </h2>
                </div>
                <div className="d-flex gap-4 align-items-center ">
                    <WishNav />
                    <CartNav />
                </div>
            </nav>

            <nav className="navbar navbar-expand-lg bg-body-tertiary">
                <div className="container-fluid">
                    {isAdmin ? (
                        <Link
                            className="navbar-brand badge text-bg-secondary p-2 fs-3 text-white"
                            to="/admin"
                        >
                            Admin
                        </Link>
                    ) : (
                        <Link
                            className="navbar-brand badge text-bg-info p-2 fs-3 text-white"
                            to="/"
                        >
                            E-Com
                        </Link>
                    )}

                    <button
                        className="navbar-toggler "
                        type="button"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#offcanvasNavbar"
                        aria-controls="offcanvasNavbar"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div
                        className="offcanvas offcanvas-end rightSide"
                        tabIndex="-1"
                        id="offcanvasNavbar"
                        aria-labelledby="offcanvasNavbarLabel"
                    >
                        <div className="offcanvas-header">
                            {isAdmin ? (
                                <Link
                                    className="offcanvas-title text-decoration-none badge text-bg-secondary p-2 fs-3 text-white"
                                    to="/admin"
                                >
                                    Admin
                                </Link>
                            ) : (
                                <Link
                                    className="offcanvas-title text-decoration-none badge text-bg-info p-2 fs-3 text-white"
                                    to="/"
                                >
                                    E-Com
                                </Link>
                            )}
                            <button
                                type="button"
                                className="btn-close"
                                aria-label="Close"
                                data-bs-dismiss="offcanvas"
                            ></button>
                        </div>

                        <div className="offcanvas-body ">
                            <ul className="navbar-nav justify-content-start d-flex flex-grow-1 pe-3 LeftNav">
                                <li className="nav-item">
                                    <Link className="nav-link active" aria-current="page" to="/"  >
                                        Home
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/categories" >
                                        Categories
                                    </Link>
                                </li>
                            </ul>
                            {!token ? (
                                <ul className="navbar-nav justify-content-end flex-grow-1 pe-3 ">
                                    <li className="nav-item">
                                        <Link
                                            className="nav-link"
                                            aria-current="page"
                                            to="/register"
                                        >
                                            Register
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link" aria-current="page" to="/login" >
                                            Login
                                        </Link>
                                    </li>
                                </ul>
                            ) : (
                                <div className="d-flex gap-4 pe-3  RightNav">
                                    <Link
                                        to="/orders"
                                        className="text-decoration-none text-black"
                                        aria-current="page"
                                    >
                                        Orders
                                    </Link>


                                    <Link className="nav-link" aria-current="page" to="/profile">
                                        <span>
                                            <span className="d-flex align-items-center gap-2">
                                                Profile
                                                <span>
                                                    <IoPerson size={20} className="mb-1" />
                                                </span>
                                            </span>
                                        </span>
                                    </Link>

                                    <button
                                        className="position-relative btn-logout"
                                        onClick={handleLogOut}
                                    >
                                        <span className="text-logout">LogOut</span>
                                        <div className="position-absolute logout ">
                                            <span className="run">
                                                <BiRun size={25} />
                                            </span>
                                            <span>
                                                <GiExitDoor size={25} />{" "}
                                            </span>
                                        </div>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </nav>
        </>
    );
};

export default Navbar;
