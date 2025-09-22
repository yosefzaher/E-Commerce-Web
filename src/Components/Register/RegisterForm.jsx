import React, { useState } from 'react'
import { useUser } from '../../Context/UserProvider';


import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Spinner } from "react-bootstrap";

import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/bootstrap.css";

import "./style.css";

const RegisterForm = () => {
    const { RegisterFunc, loading, error, user } = useUser();

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [phone, setPhone] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const errors = [];


        // Sanitize function  XSS
        const sanitizeInput = (value) => value.replace(/[<>]/g, "").trim();

        const safeFirstName = sanitizeInput(firstName);
        const safeLastName = sanitizeInput(lastName);
        const safeEmail = sanitizeInput(email);
        const safePassword = sanitizeInput(password);
        const safeConfirmPassword = sanitizeInput(confirmPassword);

        const phoneRegex = /^[0-9]{10,}$/;

        if (!phoneRegex.test(phone)) {
            errors.push("Please enter a valid phone number.");
        }

        const nameRegex = /^[a-zA-Z0-9\s'-]+$/;

        if (!nameRegex.test(safeFirstName)) {
            errors.push("First name can only contain letters.");
        }

        if (!nameRegex.test(safeLastName)) {
            errors.push("Last name can only contain letters.");
        }

        if (safePassword.length < 8) {
            errors.push("Password must be at least 8 characters long.");
        }
        if (!/[A-Z]/.test(safePassword)) {
            errors.push("Password must include at least one uppercase letter.");
        }
        if (!/[0-9]/.test(safePassword)) {
            errors.push("Password must include at least one number.");
        }
        if (!/[@$!%*?&]/.test(safePassword)) {
            errors.push("Password must include at least one special character (@$!%*?&).");
        }
        if (safePassword !== safeConfirmPassword) {
            errors.push("Password and Confirm Password don't match.");
        }

        const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;
        if (!emailRegex.test(safeEmail)) {
            errors.push("Please enter a valid email address.");
        }

        if (errors.length > 0) {
            errors.forEach((err) =>
                toast.error(err, {
                    draggable: true,
                    draggablePercent: 50,
                    draggableDirection: "x",
                })
            );
            return;
        }


        try {

            const result = await RegisterFunc({
                email: safeEmail,
                password: safePassword,
                firstName: safeFirstName,
                lastName: safeLastName,
                phoneNumber: phone,
            });

            if (result) {
                toast.success("Account created successfully!");
                navigate("/");

                // Reset form
                setFirstName("");
                setLastName("");
                setEmail("");
                setPassword("");
                setConfirmPassword("");
                setPhone("");
            }
        } catch (err) {
            toast.error("Registration failed:");
            console.error("Registration failed:", err);
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit}>

                <div className="row">

                    <div className="col-md-6 d-input">
                        <label htmlFor="firstName" className="form-label fw-semibold">
                            First Name
                        </label>
                        <input
                            type="text"
                            className="form-control shadow-sm"
                            id="firstName"
                            placeholder="Enter your first name "
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                    </div>

                    <div className="col-md-6 d-input">
                        <label htmlFor="lastName" className="form-label fw-semibold">
                            Last Name
                        </label>
                        <input
                            type="text"
                            className="form-control shadow-sm"
                            id="lastName"
                            placeholder="Enter your last name "
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                        />
                    </div>

                    <div className="col-md-12 d-input">
                        <label htmlFor="email" className="form-label fw-semibold">
                            Email
                        </label>
                        <input
                            type="email"
                            className="form-control shadow-sm"
                            id="email"
                            placeholder="Enter Your Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="col-md-12 d-input">
                        <label htmlFor="phone" className="form-label fw-semibold">
                            Phone
                        </label>
                        <PhoneInput
                            country={"eg"}
                            onlyCountries={["eg"]}
                            disableCountryCode={true}
                            disableDropdown={true}
                            value={phone}
                            onChange={(phone) => setPhone(phone)}
                            inputProps={{
                                name: "phone",
                                required: true,
                                className: "form-control shadow-sm w-100 py-2 px-5",
                            }}
                            placeholder="Enter your Egyptian phone number"
                        />
                    </div>

                    <div className="col-md-6 d-input">
                        <label htmlFor="password" className="form-label fw-semibold">
                            Password
                        </label>
                        <input
                            type="password"
                            className="form-control shadow-sm"
                            id="password"
                            placeholder="8 chars, 1 uppercase, 1 number, 1 special char"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <div className="col-md-6 d-input">
                        <label htmlFor="confirmPassword" className="form-label fw-semibold">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            className="form-control shadow-sm"
                            id="confirmPassword"
                            placeholder="Re-enter your password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>
                </div>

                {/* button */}
                <div className="d-flex justify-content-center gap-3 mt-4 flex-wrap btn-register">
                    <button
                        type="submit"
                        className="btn btn-primary px-4 shadow  w-md-auto fw-semibold py-2 "
                        disabled={loading}
                    >
                        {loading ? (<span className="d-flex justify-content-center align-items-center gap-2"> Registering... <Spinner size="sm" /> </span>) : "Register"}
                    </button>
                </div>

                {/* {error && <p className="text-danger text-center mt-2">{error}</p>} */}

                <p className="text-center mt-3 mb-0 text-secondary mt-4">
                    Already have an account?
                    <Link to="/login" className="fw-bold text-decoration-none ms-1">
                        Login
                    </Link>
                </p>

            </form>
        </>
    )
}

export default RegisterForm;