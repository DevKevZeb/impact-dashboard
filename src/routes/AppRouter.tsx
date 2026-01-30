import { Routes, Route, Navigate } from "react-router-dom";
import { MainLayout } from "@/shared/components/layout/MainLayout";
import { DashboardPage } from "@/features/dashboard/pages/DashboardPage";
import { SdgsPage } from "@/features/sdgs/pages/SdgsPage";
import { ProgramStatesPage } from "@/features/program-states/pages/ProgramStatesPage";
import { ProgramsPage } from "@/features/programs/pages/ProgramsPage";
import { PlaceholderPage } from "@/shared/components/PlaceholderPage";
import AgencyListPage from "@/features/agency/pages/AgencyListPage";
import CountryListPage from "@/features/country/pages/CountryListPage";
import CountryKpaListPage from "@/features/CountryKpa/pages/CountryKpaListPage";
import KpasListPage from "@/features/kpa/pages/KpasListPage";
import InfoCountryKpaPage from "@/features/CountryKpaInfo/pages/InfoCountryKpaPage";
import IndicatorTypesListPage from "@/features/indicator-type/pages/IndicatorTypesListPage";
import ProjectStateListPage from "@/features/project-states/pages/ProjectStateListPage";
import ListProgramsWithProjects from "@/features/projects/pages/ListProgramsWithProjects";
import BeneficiariesListPage from "@/features/beneficiaries/pages/BeneficiariesListPage";
import DonorsListPage from "@/features/donors/pages/DonorsListPage";
import CreateProjectPage from "@/features/projects/pages/CreateProjectPage";
import { LoginPage } from "@/features/auth/pages/LoginPage";
import { PrivateRoute } from "./PrivateRoute";


import ListProjectsOfProgramPage from "@/features/projects/pages/ListProjectsOfProgramPage";

export function AppRouter() {
    return (
    <Routes>
        {/* Public Route - Login */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Routes - Require Authentication */}
        <Route path="/" element={<PrivateRoute><MainLayout /></PrivateRoute>}>
        <Route index element={<DashboardPage />} />
        {/* Configuration Routes */}
        <Route path="config">
            <Route path="countries" element={<CountryListPage/>} />
            <Route path="agencies" element={<AgencyListPage/>} />
            <Route path="kpas" element={<KpasListPage/>} />
            <Route path="sdgs" element={<SdgsPage />} />
            <Route path="program-states" element={<ProgramStatesPage />} />
            <Route path="indicator-types" element={<IndicatorTypesListPage/>} />
            <Route path="project-states" element={<ProjectStateListPage/>} />
        </Route>

        {/* Programs & Projects Routes */}
        <Route path="programs" element={<ProgramsPage />} />
        <Route path="projects" element={<ListProgramsWithProjects />}/>
        <Route path="projects/new/:programId" element={<CreateProjectPage mode="create"/>}/>
        <Route path="projects/edit/:programId/:projectId" element={<CreateProjectPage mode="edit"/>}/>
        <Route path="projects/program/:programId" element={<ListProjectsOfProgramPage/>}/>
        <Route path="country-kpa" element={<CountryKpaListPage/>} />
        <Route path="country-kpa/:countryId" element={<InfoCountryKpaPage/>} />
        
        {/* Resources Routes */}
        <Route path="resources">
            <Route path="beneficiaries" element={<BeneficiariesListPage/>} />
            <Route path="donors" element={<DonorsListPage/>} />
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
