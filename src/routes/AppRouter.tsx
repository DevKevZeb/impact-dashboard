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
import { UsersPage } from "@/features/users/pages/UsersPage";
import { LoginPage } from "@/features/auth/pages/LoginPage";
import { RegisterPage } from "@/features/auth/pages/RegisterPage";
import { PrivateRoute } from "./PrivateRoute";


import ListProjectsForProgramPage from "@/features/projects/pages/ListProjectsForProgramPage";
import HomePage from "@/features/public/pages/HomePage";
import PublicRoute from "./PublicRoute";
import { PublicLayout } from "@/shared/components/layout/PublicLayout";

export function AppRouter() {
    return (
    <Routes>
        {/* Public Routes - Login & Register */}
        <Route path="/" element={<PublicRoute><PublicLayout/></PublicRoute>}>
            <Route index element={<HomePage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="resources" element={<PlaceholderPage title="Resources Page" />} />
            <Route path="library" element={<PlaceholderPage title="Library Page" />} />
            <Route path="statistics" element={<PlaceholderPage title="Statistics Page" />} />
            <Route path="news" element={<PlaceholderPage title="News Page" />} />
            <Route path="about" element={<PlaceholderPage title="About Page" />} />
            <Route path="team" element={<PlaceholderPage title="Team Page" />} />

            <Route path="development">
                <Route path="programs" element={<PlaceholderPage title="Programs List" />} />
                <Route path="projects" element={<PlaceholderPage title="Projects List" />} />
                <Route path="progress" element={<PlaceholderPage title="Progress Tracking" />} />
            </Route>
        
        </Route>

        {/* Protected Routes - Require Authentication */}
        <Route path="/app" element={<PrivateRoute><MainLayout /></PrivateRoute>}>
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
            <Route path="projects/program/:programId" element={<ListProjectsForProgramPage/>}/>
            <Route path="country-kpa" element={<CountryKpaListPage/>} />
            <Route path="country-kpa/:countryId" element={<InfoCountryKpaPage/>} />
            
            {/* Resources Routes */}
            <Route path="resources">
                <Route path="beneficiaries" element={<BeneficiariesListPage/>} />
                <Route path="donors" element={<DonorsListPage/>} />
            </Route>

            {/* Administration Routes */}
            <Route path="admin">
                <Route path="users" element={<UsersPage />} />
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
