import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User, Mail, Shield, MapPin, KeyRound, PencilLine } from "lucide-react";
import { toast } from "sonner";
import { Navigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "../hooks/useAuth";
import { updateProfile, changePassword } from "../api/auth.api";
import {
  updateProfileSchema,
  type UpdateProfileFormData,
  changePasswordSchema,
  type ChangePasswordFormData,
} from "../types/auth.schema";

export function ProfilePage() {
  const { user, setUser } = useAuth();
  const [isEditingName, setIsEditingName] = useState(false);
  const [isSavingName, setIsSavingName] = useState(false);
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const isAdmin = useMemo(
    () => (user?.roles ?? []).some((role) => role.name === "admin"),
    [user?.roles]
  );

  const profileForm = useForm<UpdateProfileFormData>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: user?.name ?? "",
    },
  });

  const passwordForm = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      current_password: "",
      password: "",
      password_confirmation: "",
    },
  });

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const primaryRole = user.roles[0]?.name || "user";
  const roleDisplayName = primaryRole
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  const handleEditName = () => {
    profileForm.reset({ name: user.name });
    setIsEditingName(true);
  };

  const handleCancelEditName = () => {
    profileForm.reset({ name: user.name });
    setIsEditingName(false);
  };

  const onSubmitName = async (values: UpdateProfileFormData) => {
    setIsSavingName(true);
    try {
      const updatedUser = await updateProfile({ name: values.name.trim() });
      setUser(updatedUser);
      profileForm.reset({ name: updatedUser.name });
      setIsEditingName(false);
      toast.success("Profile updated", {
        description: "Your name was updated successfully.",
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to update profile";
      toast.error("Update failed", { description: message });
    } finally {
      setIsSavingName(false);
    }
  };

  const onSubmitPassword = async (values: ChangePasswordFormData) => {
    setIsChangingPassword(true);
    try {
      await changePassword(values);
      toast.success("Password updated", {
        description: "Your password was updated successfully.",
      });
      setShowPasswordFields(false);
      passwordForm.reset({
        current_password: "",
        password: "",
        password_confirmation: "",
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to update password";
      toast.error("Password update failed", { description: message });
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="page-title">My Profile</h1>
        <p className="text-gray-500 mt-2">
          View your account information and update your name or password.
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Account Information
          </CardTitle>
          {!isEditingName && (
            <Button type="button" variant="outline" onClick={handleEditName}>
              <PencilLine className="h-4 w-4 mr-2" />
              Edit name
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={profileForm.handleSubmit(onSubmitName)}>
            <div className="space-y-2">
              <Label htmlFor="profile-name">Name</Label>
              <Input
                id="profile-name"
                {...profileForm.register("name")}
                disabled={!isEditingName}
                readOnly={!isEditingName}
              />
              {profileForm.formState.errors.name && (
                <p className="text-sm text-red-600">{profileForm.formState.errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="profile-email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email
              </Label>
              <Input id="profile-email" value={user.email} disabled readOnly />
            </div>

            <div className="space-y-2">
              <Label htmlFor="profile-role" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Role
              </Label>
              <Input id="profile-role" value={roleDisplayName} disabled readOnly />
            </div>

            {!isAdmin && (
              <div className="space-y-2">
                <Label htmlFor="profile-country" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Country
                </Label>
                <Input
                  id="profile-country"
                  value={user.country_user_role?.country?.name || "No country assigned"}
                  disabled
                  readOnly
                />
              </div>
            )}

            {isEditingName && (
              <div className="flex items-center gap-2 pt-2">
                <Button type="button" variant="outline" onClick={handleCancelEditName} disabled={isSavingName}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSavingName}>
                  {isSavingName ? "Saving..." : "Save changes"}
                </Button>
              </div>
            )}
          </form>

          <div className="border-t border-gray-200 mt-6 pt-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                  <KeyRound className="h-4 w-4" />
                  Password
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Change your password only when needed.
                </p>
              </div>

              {!showPasswordFields ? (
                <Button type="button" variant="outline" onClick={() => setShowPasswordFields(true)}>
                  Change password
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setShowPasswordFields(false);
                    passwordForm.reset({
                      current_password: "",
                      password: "",
                      password_confirmation: "",
                    });
                  }}
                >
                  Hide fields
                </Button>
              )}
            </div>

            {showPasswordFields && (
              <form className="space-y-4" onSubmit={passwordForm.handleSubmit(onSubmitPassword)}>
            <div className="space-y-2">
              <Label htmlFor="current-password">Current password</Label>
              <Input
                id="current-password"
                type="password"
                autoComplete="current-password"
                {...passwordForm.register("current_password")}
              />
              {passwordForm.formState.errors.current_password && (
                <p className="text-sm text-red-600">{passwordForm.formState.errors.current_password.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="new-password">New password</Label>
                <Input
                  id="new-password"
                  type="password"
                  autoComplete="new-password"
                  {...passwordForm.register("password")}
                />
                {passwordForm.formState.errors.password && (
                  <p className="text-sm text-red-600">{passwordForm.formState.errors.password.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm new password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  autoComplete="new-password"
                  {...passwordForm.register("password_confirmation")}
                />
                {passwordForm.formState.errors.password_confirmation && (
                  <p className="text-sm text-red-600">{passwordForm.formState.errors.password_confirmation.message}</p>
                )}
              </div>
            </div>

            <div className="pt-2">
              <Button type="submit" disabled={isChangingPassword}>
                {isChangingPassword ? "Updating..." : "Update password"}
              </Button>
            </div>
              </form>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
