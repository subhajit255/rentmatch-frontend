import React, { useEffect, useState } from "react";
import Footer from "./Layout/Footer";
import { Header } from "./Layout/Header";
import { Sidebar } from "./Layout/Sidebar";
import { mockUser } from "./data/mockData";
import { Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import RenterPreferencesModalManager from "./modals/RenterPreferencesModalManager";

const Layout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { user } = useAuth();
    const location = useLocation();
    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };
    const closeSidebar = () => {
        setSidebarOpen(false);
    };

    // Close the mobile drawer whenever the route changes
    useEffect(() => {
        setSidebarOpen(false);
    }, [location.pathname]);

    return (
        <div className="min-h-screen font-sans flex bg-accent overflow-hidden">
            {/* ===== Mobile drawer backdrop ===== */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black/40 lg:hidden"
                    onClick={closeSidebar}
                    aria-hidden="true"
                />
            )}

            {/* ===== Sidebar ===== */}
            <aside
                className={`fixed inset-y-0 left-0 z-40 w-[240px] shrink-0 bg-white border-r border-gray-200 transition-transform duration-300 h-screen overflow-hidden lg:static lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
            >
                <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} onNavigate={closeSidebar} />
            </aside>

            {/* ===== Main Section ===== */}
            <div
                className={`h-screen overflow-hidden flex flex-col flex-1 min-w-0 transition-all duration-300 relative`}
            >
                {/* ===== Header ===== */}
                <header className="sticky top-0 z-20 w-full bg-white border-b border-gray-200 transition-all duration-300">
                    <div className="px-3 sm:px-6 py-1.5 sm:py-2 flex items-center min-h-[44px]">
                        <Header user={mockUser} customUser={user} onMenuToggle={toggleSidebar} />
                    </div>
                </header>

                {/* ===== Main Content ===== */}
                <main className="flex-1 min-h-0 w-full px-3 sm:px-6 pt-2 pb-6 overflow-y-auto thin-scrollbar">
                    <Outlet />
                </main>

                {/* ===== Footer ===== */}
                <div className="shrink-0 w-full">
                    <Footer />
                </div>
            </div>

            {/* Renter Matching Preferences Auto-Popup Manager */}
            <RenterPreferencesModalManager />
        </div>
    );
};

export default Layout;

// <div className="min-h-screen bg-gray-50 w-100vw overflow-hidden grid-cols-12 gap-0">
//             {/* <!-- Sidebar --> */}
//             <div className="col-span-3 min-h-screen w-full ">
//                 <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
//             </div>
//             {/* <!-- Main Content --> */}
//             <div className="col-span-9 relative">
//                 {/* <!-- Header --> */}
//                 <Header user={mockUser} onMenuToggle={toggleSidebar} />

//                 {/* <!-- Main Dashboard Content --> */}
//                 <main className="p-4 lg:p-6 space-y-6" style={{ paddingTop: "80px" }}>
//                     <Outlet />
//                     {/* <!-- Footer --> */}
//                 </main>
//                 <Footer />
//             </div>
//         </div>