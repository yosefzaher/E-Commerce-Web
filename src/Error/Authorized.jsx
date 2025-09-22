import React from 'react'
import { Link } from 'react-router-dom'
import UnAuthorized from "../assets/LotiFiles/unAuthorized.json"
import Lottie from 'lottie-react'

const Authorized = () => {
    return (
        <div className="d-flex flex-column justify-content-center align-items-center mt-5 text-center">
            <h2 className="mb-3 mt-lg-1 mt-5">Unauthorized Access</h2>
            <p className="text-muted">You don't have permission to view this page.</p>
            <div className="m-auto w-100" style={{ maxWidth: "600px" }}>
                <Lottie animationData={UnAuthorized} loop={false} autoplay={true} />
            </div>
            <Link to="/" className="btn btn-primary mt-3">
                Go Back Home
            </Link>
        </div>
    )
}

export default Authorized