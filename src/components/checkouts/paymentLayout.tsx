import { useAuth } from "../../context/AuthContext";
import React from "react";
import { Navigate, Outlet } from "react-router-dom"

const PaymentLayout = () => {
    const { user, token } = useAuth()
    return (!token && !user || user?.is_subscribe  ?
        <Navigate to="/login" />
    :
     <div className="px-8 py-12">
        <Outlet />
    </div>)
}

export default PaymentLayout;