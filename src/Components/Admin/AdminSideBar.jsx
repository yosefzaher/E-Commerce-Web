import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link, Outlet } from "react-router-dom";
import { BiCategory, BiCloset } from "react-icons/bi";
import { CgClose } from "react-icons/cg";
import { FaUsers } from "react-icons/fa";
import { MdLocalShipping } from "react-icons/md";

import "./style.css"

const AdminSideBar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleSidebar = () => setIsOpen(!isOpen);
    const closeSidebar = () => setIsOpen(false);

    const [screenWidth, setScreenWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => setScreenWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const isMobile = screenWidth < 1000;


    useEffect(() => {
        if (isMobile) {
            document.body.style.overflow = isOpen ? "hidden" : "auto";
        }
        return () => {
            document.body.style.overflow = "auto"; // cleanup
        };
    }, [isOpen, isMobile]);

    return (
        <div className="d-flex min-vh-100 position-relative ">
            {/* Sidebar */}
            <nav
                id="sidebar"
                className="bg-dark text-white p-3 "
                style={{
                    position: isMobile ? "fixed" : "sticky",
                    minHeight: "100vh",
                    width: "250px",
                    left: isMobile ? (isOpen ? "0" : "-250px") : "0",
                    transition: "all 0.3s ease",
                    zIndex: 1050,
                }}
            >
                <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3">
                    <h4 className="">Dashboard</h4>
                    {isMobile && (
                        <span
                            className="mb-2"
                            onClick={closeSidebar}
                        >
                            <CgClose size={20} />
                        </span>
                    )}

                </div>

                <Link to="categories" className="d-flex gap-3 align-items-center  my-2 text-white py-2 px-2 text-decoration-none fw-semibold sec">
                    Categories <span><BiCategory  size={25} className="mt-1" /></span>
                </Link>
                <Link to="users" className="d-flex gap-3 align-items-center  my-2 text-white py-2 px-2 text-decoration-none fw-semibold sec">
                    Users <span><FaUsers size={25} className="mt-1" /></span>
                </Link>

                <Link to="ship" className="d-flex gap-3 align-items-center text-white my-2 py-2 px-2 text-decoration-none fw-semibold sec">
                    Shiping <span><MdLocalShipping size={25} className="mt-1 ship" /></span>
                </Link>

            </nav>

            {/* Overlay (only mobile + open) */}
            {isMobile && isOpen && (
                <div
                    onClick={closeSidebar}
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: "rgba(0,0,0,0.5)",
                        zIndex: 1025,
                    }}
                />
            )}

            {/* Main Content */}
            <div
                className={`flex-grow-1 main-content ${isOpen && isMobile ? "blurred" : ""}`}
                style={{ width: "100%", backgroundColor: "#f8f9fa", }}
            >
                {/* Burger Button (only show on mobile) */}
                {isMobile && (
                    <button
                        className="btn btn-dark m-2"
                        onClick={toggleSidebar}
                        style={{ zIndex: 10, position: "relative" }}
                    >
                        ☰
                    </button>
                )}

                <div className="p-3 container-fluid">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default AdminSideBar;
