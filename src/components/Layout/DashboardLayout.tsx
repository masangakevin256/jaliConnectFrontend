import React from 'react';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';

interface DashboardLayoutProps {
    children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
    return (
        <div className="dashboard-container">
            <div className="sidebar-sticky d-none d-lg-block">
                <Sidebar />
            </div>
            <div className="main-content">
                <Navbar />
                <div className="p-4 p-md-5">
                    {children}
                </div>
            </div>
        </div>
    );
};
