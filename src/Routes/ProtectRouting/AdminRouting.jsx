import React from 'react'
import { useUser } from '../../Context/UserProvider'
import { Navigate } from 'react-router-dom';
const AdminRouting = ({ children }) => {
    const { user } = useUser();
    const token = localStorage.getItem("token");

    if (user === undefined) {
        return <div className="text-center p-5">Loading...</div>;
    }

    const userRoles = user?.userRoles || [];
    const isAdmin = userRoles.includes("Admin");

    if (!token || !isAdmin) {
        return <Navigate to="/authorized" replace />;
    }
    return (
        <div>
            {children}
        </div>
    )
}

export default AdminRouting;

