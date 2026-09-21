import { useForm, useWatch } from "react-hook-form";
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
import { useState, useEffect, useRef, useCallback } from "react";
import { toast } from "sonner";

export function RegisterForm() {
  const MAX_RECAPTCHA_RENDER_RETRIES = 5;
  const navigate = useNavigate();
  const { mutate: register, isPending } = useRegister();
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [recaptchaReady, setRecaptchaReady] = useState(() => !!window.grecaptcha);
  const recaptchaWidgetIdRef = useRef<number | undefined>(undefined);
  const recaptchaRenderRetryRef = useRef<number>(0);
  const recaptchaRetryTimeoutRef = useRef<number | undefined>(undefined);
  
  // Fetch countries for dropdown (no auth required)
  const { data: countriesData, isLoading: isLoadingCountries } = usePublicCountries();

  const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY || "6LekrposAAAAAKwvGRkvqbH3vA3IOsi-lwK9A5Zd";

  // Load reCAPTCHA script once and mark widget API as ready
  useEffect(() => {
    const handleScriptLoad = () => setRecaptchaReady(true);
    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[src="https://www.google.com/recaptcha/api.js?render=explicit"]'
    );

    if (window.grecaptcha) {
      return;
    }

    if (existingScript) {
      existingScript.addEventListener("load", handleScriptLoad);
      return () => {
        existingScript.removeEventListener("load", handleScriptLoad);
      };
    }

    const script = document.createElement("script");
    script.src = "https://www.google.com/recaptcha/api.js?render=explicit";
    script.async = true;
    script.defer = true;
    script.onload = handleScriptLoad;
    document.head.appendChild(script);

    return () => {
      script.onload = null;
    };
  }, []);

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
    setValue,
    control,
    clearErrors,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
      role_name: undefined,
      country_id: undefined,
      "g-recaptcha-response": "",
    },
  });

  const watchedRoleName = useWatch({ control, name: "role_name" });

  // Render widget explicitly so callbacks can keep form state in sync.
  useEffect(() => {
    if (!recaptchaReady || !window.grecaptcha || recaptchaWidgetIdRef.current !== undefined) {
      return;
    }

    const renderWidget = () => {
      const container = document.getElementById("register-recaptcha");

      if (!container || recaptchaWidgetIdRef.current !== undefined || !window.grecaptcha) {
        return;
      }

      try {
        recaptchaWidgetIdRef.current = window.grecaptcha.render("register-recaptcha", {
          sitekey: RECAPTCHA_SITE_KEY,
          callback: (token: string) => {
            setValue("g-recaptcha-response", token, { shouldValidate: true });
            clearErrors("g-recaptcha-response");
          },
          expired_callback: () => {
            setValue("g-recaptcha-response", "", { shouldValidate: true });
          },
          error_callback: () => {
            setValue("g-recaptcha-response", "", { shouldValidate: true });
          },
        });
        recaptchaRenderRetryRef.current = 0;
      } catch {
        if (recaptchaRenderRetryRef.current < MAX_RECAPTCHA_RENDER_RETRIES) {
          recaptchaRenderRetryRef.current += 1;
          recaptchaRetryTimeoutRef.current = window.setTimeout(renderWidget, 250);
          return;
        }

        setRecaptchaReady(false);
        toast.error("Unable to load reCAPTCHA. Please refresh the page.");
      }
    };

    window.grecaptcha.ready(() => {
      // Delay one frame to ensure the container div is painted.
      window.requestAnimationFrame(renderWidget);
    });

    return () => {
      if (recaptchaRetryTimeoutRef.current !== undefined) {
        window.clearTimeout(recaptchaRetryTimeoutRef.current);
      }

      if (recaptchaWidgetIdRef.current !== undefined && window.grecaptcha) {
        try {
          window.grecaptcha.reset(recaptchaWidgetIdRef.current);
        } catch {
          // Ignore cleanup errors from third-party reCAPTCHA lifecycle.
        }
      }
      recaptchaWidgetIdRef.current = undefined;
      recaptchaRenderRetryRef.current = 0;
      recaptchaRetryTimeoutRef.current = undefined;
    };
  }, [recaptchaReady, RECAPTCHA_SITE_KEY, setValue, clearErrors]);

  const onSubmit = useCallback((data: RegisterFormData) => {
    // Capture reCAPTCHA token before submission (explicit widget first)
    const token = window.grecaptcha?.getResponse(
      recaptchaWidgetIdRef.current ?? undefined
    );

    if (!token) {
      toast.error("Please complete the reCAPTCHA verification");
      return;
    }

    // Add token to form data
    const payload = {
      ...data,
      "g-recaptcha-response": token,
    };

    register(payload, {
      onSuccess: () => {
        // Reset reCAPTCHA on success
        if (recaptchaWidgetIdRef.current !== undefined) {
          window.grecaptcha?.reset(recaptchaWidgetIdRef.current);
        }
        setValue("g-recaptcha-response", "", { shouldValidate: true });
        // Redirect to email verification pending page
        navigate("/email-verification-pending", {
          state: { email: data.email },
        });
      },
      onError: () => {
        // Reset reCAPTCHA on error
        if (recaptchaWidgetIdRef.current !== undefined) {
          window.grecaptcha?.reset(recaptchaWidgetIdRef.current);
        }
        setValue("g-recaptcha-response", "", { shouldValidate: true });
      },
    });
  }, [register, navigate, setValue]);

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
        <form onSubmit={(event) => { void handleSubmit(onSubmit)(event); }} className="space-y-4">
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

          {/* reCAPTCHA Checkbox */}
          <div className="space-y-2">
            {recaptchaReady ? (
              <div id="register-recaptcha" />
            ) : (
              <div className="p-4 bg-gray-100 rounded text-center text-sm text-gray-600">
                Loading security verification...
              </div>
            )}
            {errors["g-recaptcha-response"] && (
              <p className="text-sm text-red-600">
                {errors["g-recaptcha-response"].message}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isPending || !recaptchaReady}>
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
