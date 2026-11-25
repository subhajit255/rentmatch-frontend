import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/button';
import { Check } from 'lucide-react';

const PaymentSuccess = () => {
    const navigate = useNavigate();
    const { updateUser, refreshUser } = useAuth();

    useEffect(() => {
        updateUser({ is_subscribe: true });
        refreshUser().catch((err) => {
            console.warn("Could not sync profile on payment success:", err);
        });
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 py-12 text-center">
            <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-md max-w-md w-full mx-auto flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6">
                    <Check className="w-8 h-8 stroke-[2.5]" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
                    Payment Successful!
                </h1>
                <p className="text-sm text-slate-600 mb-8 leading-relaxed">
                    Your subscription has been activated. You now have full access to renter profiles, property tools, and inspection scheduling.
                </p>
                <Button
                    onClick={() => navigate("/dashboard")}
                    className="w-full bg-primary hover:bg-primary/95 text-white font-semibold py-3 h-12 rounded-xl shadow-sm transition-all"
                >
                    Go to Dashboard
                </Button>
            </div>
        </div>
    );
};

export default PaymentSuccess;