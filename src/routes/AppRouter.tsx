import { Routes, Route, Navigate } from "react-router-dom";
import { MainLayout } from "@/shared/components/layout/MainLayout";
import { DashboardPage } from "@/features/dashboard/pages/DashboardPage";
import { SdgsPage } from "@/features/sdgs/pages/SdgsPage";
import { ProgramStatesPage } from "@/features/program-states/pages/ProgramStatesPage";
import { PlaceholderPage } from "@/shared/components/PlaceholderPage";
import AgencyListPage from "@/features/agency/pages/AgencyListPage";

export function AppRouter() {
    return (
    <Routes>
        <Route path="/" element={<MainLayout />}>
        <Route index element={<DashboardPage />} />
        
        {/* Configuration Routes */}
        <Route path="config">
            <Route path="countries" element={<PlaceholderPage title="Countries" description="Manage countries catalog" />} />
            <Route path="agencies" element={<PlaceholderPage title="Agencies" description="Manage agencies" />} />
            <Route path="sdgs" element={<PlaceholderPage title="SDGs" description="Manage Sustainable Development Goals" />} />
            <Route path="program-states" element={<ProgramStatesPage />} />
            <Route path="agencies" element={<AgencyListPage/>} />
            
        </Route>

        {/* Programs & Projects Routes */}
        <Route path="programs" element={<PlaceholderPage title="Programs" description="Manage programs" />} />
        <Route path="projects" element={<PlaceholderPage title="Projects" description="Manage projects" />} />
        
        {/* Resources Routes */}
        <Route path="resources">
            <Route path="donors" element={<PlaceholderPage title="Donors" description="Manage donors" />} />
            <Route path="beneficiaries" element={<PlaceholderPage title="Beneficiaries" description="Manage beneficiaries" />} />
        </Route>

        {/* Reports Routes */}
        <Route path="reports">
            <Route path="performance" element={<PlaceholderPage title="Performance Reports" />} />
            <Route path="budget" element={<PlaceholderPage title="Budget Analysis" />} />
            <Route path="impact" element={<PlaceholderPage title="Impact Reports" />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
    </Routes>
    );
}
