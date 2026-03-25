import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { registerSchema, type RegisterFormData } from "../types/register.schema";
import { useRegister } from "../api/registerQueries";
import { ROLE_OPTIONS } from "../types/register.types";
import { usePublicCountries } from "@/features/country/hooks/country/usePublicCountries";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export function RegisterForm() {
  const navigate = useNavigate();
  const { mutate: register, isPending } = useRegister();
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [captchaPayload, setCaptchaPayload] = useState<string>("");
  const captchaRef = useRef<HTMLElement | null>(null);
  const altchaChallengeUrl =
    import.meta.env.VITE_ALTCHA_CHALLENGE_URL ||
    `${import.meta.env.VITE_API_BASE_URL}/auth/captcha/challenge`;
  
  // Fetch countries for dropdown (no auth required)
  const { data: countriesData, isLoading: isLoadingCountries } = usePublicCountries();

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
    clearErrors,
    setError,
    setValue,
    watch,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
      role_name: undefined,
      country_id: undefined,
      altcha: "",
    },
  });

  useEffect(() => {
    const widget = captchaRef.current;
    if (!widget) {
      return;
    }

    const syncAltchaPayload = () => {
      const form = widget.closest("form");
      const payloadInput = form?.querySelector<HTMLInputElement>('input[name="altcha"]');
      const payload = payloadInput?.value?.trim() ?? "";

      setCaptchaPayload(payload);
      setValue("altcha", payload, { shouldDirty: true, shouldValidate: true });

      if (payload) {
        clearErrors("altcha");
      }
    };

    widget.addEventListener("statechange", syncAltchaPayload);
    widget.addEventListener("verified", syncAltchaPayload);

    return () => {
      widget.removeEventListener("statechange", syncAltchaPayload);
      widget.removeEventListener("verified", syncAltchaPayload);
    };
  }, [clearErrors, setValue]);

  const watchedRoleName = watch("role_name");

  const onSubmit = (data: RegisterFormData) => {
    if (!data.altcha) {
      setError("altcha", {
        type: "manual",
        message: "Please complete captcha validation",
      });
      toast.error("Please complete captcha validation before creating your account.");
      return;
    }

    register(data, {
      onSuccess: () => {
        // Redirect to email verification pending page
        navigate("/email-verification-pending", {
          state: { email: data.email },
        });
      },
    });
  };

  const handleRoleChange = (value: string) => {
    setSelectedRole(value);
    setValue("role_name", value as "project-manager" | "country-manager", {
      shouldValidate: true,
    });
  };

  const handleCountryChange = (value: string) => {
    setSelectedCountry(value);
    setValue("country_id", parseInt(value), {
      shouldValidate: true,
    });
  };

  const selectedRoleOption = ROLE_OPTIONS.find((r) => r.value === watchedRoleName);

  return (
    <Card className="w-full max-w-lg shadow-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">
          Create New Account
        </CardTitle>
        <CardDescription className="text-center">
          Register to request access to the system
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">
              Full Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="e.g: John Doe"
              autoComplete="name"
              disabled={isPending}
              {...registerField("name")}
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && (
              <p className="text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">
              Email <span className="text-red-500">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="correo@ejemplo.com"
              autoComplete="email"
              disabled={isPending}
              {...registerField("email")}
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password">
              Password <span className="text-red-500">*</span>
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="Minimum 6 characters"
              autoComplete="new-password"
              disabled={isPending}
              {...registerField("password")}
              className={errors.password ? "border-red-500" : ""}
            />
            {errors.password && (
              <p className="text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          {/* Password Confirmation */}
          <div className="space-y-2">
            <Label htmlFor="password_confirmation">
              Confirm Password <span className="text-red-500">*</span>
            </Label>
            <Input
              id="password_confirmation"
              type="password"
              placeholder="Repeat your password"
              autoComplete="new-password"
              disabled={isPending}
              {...registerField("password_confirmation")}
              className={errors.password_confirmation ? "border-red-500" : ""}
            />
            {errors.password_confirmation && (
              <p className="text-sm text-red-600">
                {errors.password_confirmation.message}
              </p>
            )}
          </div>

          {/* Role */}
          <div className="space-y-2">
            <Label htmlFor="role_name">
              Role <span className="text-red-500">*</span>
            </Label>
            <Select
              value={selectedRole}
              onValueChange={handleRoleChange}
              disabled={isPending}
            >
              <SelectTrigger
                className={errors.role_name ? "border-red-500" : ""}
              >
                <SelectValue placeholder="Select your role" />
              </SelectTrigger>
              <SelectContent>
                {ROLE_OPTIONS.map((role) => (
                  <SelectItem key={role.value} value={role.value}>
                    <div className="flex items-center gap-2">
                      <span>{role.icon}</span>
                      <span>{role.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.role_name && (
              <p className="text-sm text-red-600">{errors.role_name.message}</p>
            )}
            {selectedRoleOption && (
              <div className="mt-2 p-3 bg-blue-50 border-l-4 border-blue-500 rounded text-sm text-gray-700">
                {selectedRoleOption.description}
              </div>
            )}
          </div>

          {/* Country */}
          <div className="space-y-2">
            <Label htmlFor="country_id">
              Country <span className="text-red-500">*</span>
            </Label>
            <Select
              value={selectedCountry}
              onValueChange={handleCountryChange}
              disabled={isPending || isLoadingCountries}
            >
              <SelectTrigger
                className={errors.country_id ? "border-red-500" : ""}
              >
                <SelectValue placeholder={isLoadingCountries ? "Loading countries..." : "Select your country"} />
              </SelectTrigger>
              <SelectContent position="popper" className="max-h-64 overflow-y-auto">
                {countriesData?.countries.map((country) => (
                  <SelectItem key={country.id} value={country.id.toString()}>
                    {country.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.country_id && (
              <p className="text-sm text-red-600">{errors.country_id.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>
              Captcha <span className="text-red-500">*</span>
            </Label>
            <div className={`rounded-md border p-3 ${errors.altcha ? "border-red-500" : "border-slate-200"}`}>
              <altcha-widget
                ref={captchaRef}
                auto="off"
                challengeurl={altchaChallengeUrl}
                hidefooter
                hidelogo
              />
            </div>
            {captchaPayload ? (
              <p className="text-xs text-green-700">Captcha verified.</p>
            ) : null}
            {errors.altcha && (
              <p className="text-sm text-red-600">{errors.altcha.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating account...
              </>
            ) : (
              "Create Account"
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-gray-600">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="text-blue-600 hover:underline font-medium"
            disabled={isPending}
          >
            Sign in here
          </button>
        </p>
      </CardFooter>
    </Card>
  );
}
