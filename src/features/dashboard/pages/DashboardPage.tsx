import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, DollarSign, Users, Briefcase } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuthStore } from "@/features/auth/store/authStore";

export function DashboardPage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const isAdmin = (user?.roles ?? []).some((role) => role.name === "admin");
  const isCountryManager = (user?.roles ?? []).some((role) => role.name === "country-manager");

  useEffect(() => {
    if (isAdmin) {
      navigate("/app/admin-dashboard", { replace: true });
      return;
    }

    if (isCountryManager) {
      navigate("/app/country-kpa", { replace: true });
      return;
    }

    navigate("/app/dashboard", { replace: true });
  }, [isAdmin, isCountryManager, navigate]);

  if (isAdmin) {
    return null;
  }

  return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-2">Overview of your programs and projects performance.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Programs</CardTitle>
            <div className="p-2 bg-gradient-to-br from-sky-500 to-emerald-500 rounded-lg shadow-sm">
              <Briefcase className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <div className="p-2 bg-gradient-to-br from-sky-500 to-emerald-500 rounded-lg shadow-sm">
              <Activity className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">+4 active now</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Donors</CardTitle>
            <div className="p-2 bg-gradient-to-br from-sky-500 to-emerald-500 rounded-lg shadow-sm">
              <Users className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42</div>
            <p className="text-xs text-muted-foreground">+12% from last year</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
            <div className="p-2 bg-gradient-to-br from-sky-500 to-emerald-500 rounded-lg shadow-sm">
              <DollarSign className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$2.4M</div>
            <p className="text-xs text-muted-foreground">+18% from last quarter</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] flex items-center justify-center text-gray-400 border-2 border-dashed rounded-lg">
              Chart Placeholder
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Project Status</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="h-[200px] flex items-center justify-center text-gray-400 border-2 border-dashed rounded-lg">
              Pie Chart Placeholder
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
