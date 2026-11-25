import { useAuth } from "../../context/AuthContext";
import React from "react";
import { Navigate, Outlet } from "react-router-dom"

const PaymentLayout = () => {
    const { user, token, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!token && !user) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="min-h-[calc(100vh-140px)] flex flex-col justify-center px-4 sm:px-6 lg:px-8 py-8 md:py-12 max-w-7xl mx-auto w-full">
            <Outlet />
        </div>
    );
};

export default PaymentLayout;