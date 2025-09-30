import { ToastContainer } from "react-toastify";

import RegisterForm from "../Components/Register/RegisterForm";

const Register = () => {

  return (
    <div className="register-fullscreen d-flex justify-content-center align-items-center container">
      {/* <ToastContainer /> */}
      <div className=" my-5">
        <h2 className="fw-bold text-center  text-dark my-5 ">Create an Account</h2>
        <RegisterForm />
      </div>
    </div>
  );
};

export default Register;
