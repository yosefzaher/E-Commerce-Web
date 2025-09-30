
import { Link } from 'react-router-dom';

import Lottie from "lottie-react";
import shopping from "../assets/LotiFiles/Shopping.json";

import HomeCatSection from '../Components/Home/HomeCatSection';

import "../Components/Home/style.css"

import { FaTshirt } from "react-icons/fa";
import { MdOutlineWorkspacePremium } from "react-icons/md";
import { RiCustomerService2Fill } from "react-icons/ri";
import { useUser } from '../Context/UserProvider';
import axios from 'axios';
import { useEffect, useState } from 'react';


const Home = () => {




    return (
        <div className='home-page container '>

            {/* Hero Section */}
            <section className="hero text-white row  ">

                <div className="col-md-6">
                    <div className="m-auto">
                        <Lottie animationData={shopping} loop={true} autoplay={true} />
                    </div>
                </div>

                <div className="col-md-6 text-center d-flex justify-content-center align-items-center flex-column text-black mt-md-0 mt-3" >
                    <h1 className="title fw-bold mb-3">Discover Stylish Clothing!</h1>
                    <p className="desc fw-medium lead mb-4">Trendy, Comfortable & High-Quality Apparel for Every Occasion</p>

                    <div className='d-flex flex-md-row flex-column align-items-center'>
                        <Link to="/categories" className="btn btn-info text-white  rounded-3 shadow-sm px-3 py-2">
                            Shop Now
                        </Link>
                    </div>

                </div>

            </section>

            <HomeCatSection />

        </div>
    );
};

export default Home;
