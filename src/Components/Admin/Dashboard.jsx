import React from 'react'
import dashboard from "../../assets/LotiFiles/Dashboard.json"
import Lottie from 'lottie-react'
const Dashboard = () => {
    return (
        <div className=''>
            <h2 className='text-center fst-italic mt-4 pb-5'> Welcome to Dashboard</h2>
            <div className="m-auto w-100 mt-5 " style={{ maxWidth: "600px" }} >
                <Lottie animationData={dashboard} loop={true} />
            </div>

        </div>
    )
}

export default Dashboard