import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../Context/UserProvider";
import { Spinner } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";


const Login = () => {

  const navigate = useNavigate();
  const { Login, loading, error } = useUser();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = [];

    const sanitizeInput = (value) => value.replace(/[<>]/g, "");

    const safeEmail = sanitizeInput(email);
    const safePassword = sanitizeInput(password);

    const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;
    if (!emailRegex.test(safeEmail)) {
      errors.push("Please enter a valid email address.");
    }

    if (safePassword.trim().length === 0) {
      errors.push("Password cannot be empty.");
    }

    if (errors.length > 0) {
      errors.forEach((err) => toast.error(err, { draggable: true, draggablePercent: 50, draggableDirection: "x" }));
      return;
    }

    try {
      const res = await Login(safeEmail, safePassword);

      const role = res?.userRoles || [];
      const isAdmin = role.includes("Admin");

      toast.success(isAdmin ? "Redirecting to Admin Dashboard..." : "Logged in successfully!");

      setTimeout(() => {
        navigate(isAdmin ? "/admin" : "/");
      }, 1000);
    } catch (err) {
      toast.error("Login failed. Please check your credentials.");
    }
  };




  return (
    <div className="d-flex justify-content-center align-items-center py-5 bg-light shadow mt-5">
      {/* <ToastContainer /> */}
      <div className="w-100 p-md-5 p-3">
        <h2 className="fw-bold mt-4">Welcome Back</h2>
        <p className="text-center fw-semibold mb-4">
          Please login to your account
        </p>

        <form className="d-flex flex-column justify-content-center align-items-center gap-3" onSubmit={handleSubmit}>

          <input
            type="email"
            placeholder="Email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button className="btn btn-primary btn-lg px-4 fw-semibold" type="submit" disabled={loading}>
            {loading ? (<span className="d-flex justify-content-center align-items-center gap-2"> Logging... <Spinner size="sm" /> </span>) : "Login"}
          </button>

          {error && <p className="text-danger fw-semibold mt-2">{error}</p>}

          <p className="text-center  mt-3 d-flex gap-2 flex-column">
            <Link to="/register" className="text-decoration-none "> I don't have account </Link>
            {/* <Link to="/login" className="text-decoration-none "> Forgot Password ? </Link> */}
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;