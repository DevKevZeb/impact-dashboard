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
import { ActiveUsersPage } from "@/features/users/pages/ActiveUsersPage";
import { UnverifiedUsersPage } from "@/features/users/pages/UnverifiedUsersPage";
import { CreateAdminPage } from "@/features/users/pages/CreateAdminPage";
import { LoginPage } from "@/features/auth/pages/LoginPage";
import { RegisterPage } from "@/features/auth/pages/RegisterPage";
import { ForgotPasswordPage } from "@/features/auth/pages/ForgotPasswordPage";
import { ResetPasswordPage } from "@/features/auth/pages/ResetPasswordPage";
import { EmailVerificationPendingPage } from "@/features/auth/pages/EmailVerificationPendingPage";
import { VerifyEmailPage } from "@/features/auth/pages/VerifyEmailPage";
import { PrivateRoute } from "./PrivateRoute";
import HomePage from "@/features/public/Home/page/HomePage";
import PublicRoute from "./PublicRoute";
import { PublicLayout } from "@/shared/components/layout/PublicLayout";
import ListProjectsOfProgramPage from "@/features/projects/pages/ListProjectsOfProgramPage";
import ProgramsPublicPage from "@/features/public/programs/page/ProgramsPublicPage";
import PublicProgramDetailsPage from "@/features/public/programs/page/PublicProgramDetailsPage";
import ProjectsPublicPage from "@/features/public/projects/page/ProjectsPublicPage";
import ProgressPublicPage from "@/features/public/progress/page/ProgressPublicPage";
import PublicProjectDetailsPage from "@/features/public/projects/page/PublicProjectDetailsPage";
import { ProgramInvitePage } from "@/features/programs/pages/ProgramInvitePage";
import { RolesPermissionsPage } from "@/features/roles-permissions/pages/RolesPermissionsPage";
import ProjectDetailsPage from "@/features/projects/pages/ProjectDetailsPage";
import { useAuthStore } from "@/features/auth/store/authStore";

export function AppRouter() {
    const user = useAuthStore((state) => state.user);
    const isAdmin = (user?.roles ?? []).some((role) => role.name === "admin");

    return (
    <Routes>
        {/* Public Routes - Login & Register */}
        <Route path="/" element={<PublicRoute><PublicLayout/></PublicRoute>}>
            <Route index element={<HomePage />} />

            <Route path="development">
                <Route path="programs" element={<ProgramsPublicPage/>} />
                <Route path="programs/:id" element={<PublicProgramDetailsPage />} />
                <Route path="projects" element={<ProjectsPublicPage/>}/>
                <Route path="projects/:id" element={<PublicProjectDetailsPage />} />
                <Route path="progress" element={<ProgressPublicPage/>} />
            </Route>

            <Route path="resources">
                <Route path="ecove-community" element={<PlaceholderPage title="eCove Community" />} />
                <Route path="training" element={<PlaceholderPage title="Training Resources" />} />
            </Route>

            <Route path="library">
                <Route path="toolkit-library" element={<PlaceholderPage title="E-Biz ToolKits Library" />} />
                <Route path="reports" element={<PlaceholderPage title="Library Reports" />} />
            </Route>

            <Route path="statistics" element={<PlaceholderPage title="Statistics Page" />} />
            <Route path="news" element={<PlaceholderPage title="News Page" />} />
            <Route path="about" element={<PlaceholderPage title="About Page" />} />
            <Route path="team" element={<PlaceholderPage title="Team Page" />} />
            
            <Route path="login" element={<LoginPage />} />
            <Route path="forgot-password" element={<ForgotPasswordPage />} />
            <Route path="reset-password" element={<ResetPasswordPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="email-verification-pending" element={<EmailVerificationPendingPage />} />
            <Route path="verify-email" element={<VerifyEmailPage />} />
        </Route>

        {/* Protected Routes - Require Authentication */}
        <Route path="/app" element={<PrivateRoute><MainLayout /></PrivateRoute>}>
            <Route index element={<DashboardPage />} />
            {/* Administration Routes */}
            <Route path="admin">
                <Route path="users" element={<UsersPage />} />
                <Route path="users/active" element={<ActiveUsersPage />} />
                <Route path="users/unverified" element={<UnverifiedUsersPage />} />
                <Route path="users/admins" element={<CreateAdminPage />} />
                <Route path="users/create-admin" element={<CreateAdminPage />} />
                <Route path="roles-permissions" element={<RolesPermissionsPage />} />
            </Route>

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
            <Route path="programs" element={isAdmin ? <Navigate to="/app" replace /> : <ProgramsPage />} />
            <Route path="programs/:programId/invite" element={isAdmin ? <Navigate to="/app" replace /> : <ProgramInvitePage />} />
            <Route path="projects" element={isAdmin ? <Navigate to="/app" replace /> : <ListProgramsWithProjects />}/>
            <Route path="projects/new/:programId" element={isAdmin ? <Navigate to="/app" replace /> : <CreateProjectPage mode="create"/>}/>
            <Route path="projects/edit/:programId/:projectId" element={isAdmin ? <Navigate to="/app" replace /> : <CreateProjectPage mode="edit"/>}/>
            <Route path="projects/view/:id" element={isAdmin ? <Navigate to="/app" replace /> : <ProjectDetailsPage/>}/>
            <Route path="projects/program/:programId" element={isAdmin ? <Navigate to="/app" replace /> : <ListProjectsOfProgramPage/>}/>
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
