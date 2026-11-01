import React, { useEffect, useState } from "react";
import { IMAGES } from "../../assets/index";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Eye,
  EyeOff,
  ShieldCheck,
  MessageSquare,
  Zap,
  MapPin,
  Lock,
  Mail,
  Users,
  Home,
  Building2,
  ChevronRight,
  ArrowLeft
} from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { signinSchema, SigninSchemaType } from "../../schemas/auth";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { loginMember } from "../../actions/auth";
import { toast } from "../../custom-hooks/use-toast";
import { useLocation, useNavigate } from "react-router-dom";
import { Label } from "../ui/label";
import { logInSchema } from "../../types/authTypes";
import { useAuth } from "../../context/AuthContext";

// Stylized Australia silhouette outline path
const AustraliaIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 100 100" fill="currentColor">
    <path d="M 25 45 C 28 40, 35 38, 45 42 C 55 45, 60 38, 70 40 C 78 42, 85 35, 88 42 C 92 48, 88 55, 85 62 C 80 70, 75 75, 68 78 C 60 80, 52 75, 45 78 C 38 80, 32 75, 25 70 C 18 65, 12 60, 15 52 C 18 45, 22 50, 25 45 Z" />
  </svg>
);

const GoogleIcon = () => (
  <svg className="w-5 h-5 mr-2 shrink-0" viewBox="0 0 24 24" fill="currentColor">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      fill="#EA4335"
    />
  </svg>
);

const AppleIcon = () => (
  <svg className="w-5 h-5 mr-2 shrink-0 text-black fill-current" viewBox="0 0 24 24">
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.21.67-2.93 1.49-.62.69-1.16 1.84-1.01 2.96 1.1.09 2.23-.58 2.95-1.39z" />
  </svg>
);

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login: loginContext } = useAuth();
  const queryClient = useQueryClient();

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState<boolean>(true);

  const {
    register: loginPayload,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<SigninSchemaType>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      role: "TENANT",
      user_id: "",
      password: "",
    },
  });

  const selectedRole = watch("role");

  const { mutate: login, isPending } = useMutation({
    mutationFn: loginMember,
    onSuccess: (data) => {
      loginContext(
        data?.result?.loginInstance || { role: data?.result?.role } || {},
        data?.result?.token || "",
        data?.result?.rolePermission?.access || []
      );
      queryClient.clear();
      toast({
        title: "Success",
        description: data?.message || 'Successfully logged in',
        variant: "success",
      });
      navigate("/dashboard");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.response?.data?.message || 'Login failed',
        variant: "error",
      });
    },
  });

  const onSubmit = (data: SigninSchemaType) => {
    login({ ...data } as logInSchema);
  };

  useEffect(() => {
    if (location.pathname === '/admin/login') {
      setShowRoleDropdown(false);
      setValue("role", "ADMIN");
    }
    if (location.pathname === '/super-admin/login') {
      setShowRoleDropdown(false);
      setValue("role", "SUPER ADMIN");
    }
  }, [location, setValue]);

  const loginAsGuest = (e: any) => {
    e.preventDefault();
    login({ role: "GUEST", guset_token: "GTH007*67kdf%" } as any);
  };

  const features = [
    {
      title: "Verified profiles",
      description: "Quality renters you can trust",
      icon: ShieldCheck,
    },
    {
      title: "Secure messaging",
      description: "Chat directly and safely",
      icon: MessageSquare,
    },
    {
      title: "Faster matches",
      description: "Save time and reduce vacancies",
      icon: Zap,
    },
    {
      title: "Australia-wide",
      description: "From city to regional",
      icon: MapPin,
    },
  ];

  return (
    <main className="min-h-screen w-full flex bg-[#F8FAFC] font-sans">
      {/* Left side: branding & graphic */}
      <section
        className="hidden lg:flex lg:w-[48%] xl:w-[45%] flex-col justify-between p-12 min-h-screen relative overflow-hidden bg-cover bg-center bg-no-repeat border-r border-slate-100"
        style={{ backgroundImage: `url(${IMAGES.login_illustration})` }}
      >
        {/* Semi-transparent backdrop blur overlay to ensure text readability */}
        <div className="absolute inset-0 bg-white/80 backdrop-blur-[1.5px] z-0" />

        {/* Brand Logo */}
        <div className="flex items-center gap-2 relative z-10">
          <a href="/">
            <img
              className="h-10 w-auto object-contain"
              alt="Rentmatch logo"
              src={IMAGES.logo2}
            />
          </a>
        </div>

        {/* Text and Graphic Features */}
        <div className="my-auto py-8 flex flex-col gap-8 max-w-[480px] relative z-10">
          <div>
            <h1 className="text-4xl xl:text-5xl font-extrabold text-[#0f172a] leading-tight">
              Welcome to <span className="text-primary">RentMatch</span>
            </h1>
            <p className="mt-4 text-base text-slate-600 leading-relaxed font-semibold">
              Australia's smarter rental matching platform. Connecting great renters with quality homes.
            </p>
          </div>

          {/* Checklist */}
          <div className="flex flex-col gap-5">
            {features.map((item, idx) => (
              <div key={idx} className="flex items-start">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary mr-4 shrink-0 shadow-sm border border-primary/5">
                  <item.icon className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <h3 className="text-base font-bold text-slate-800 leading-normal">{item.title}</h3>
                  <p className="text-sm text-slate-500 font-medium">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Trust Badges */}
        <div className="border-t border-slate-200/80 pt-6 w-full relative z-10">
          <p className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-3">
            Trusted by Australian renters, landlords & property managers
          </p>
          <div className="grid grid-cols-3 gap-2">
            <div className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-white/90 backdrop-blur-sm border border-slate-100 shadow-sm">
              <ShieldCheck className="w-5 h-5 text-primary mb-1" />
              <span className="text-[9px] font-bold text-slate-600 text-center uppercase tracking-wider">Secure 256-Bit SSL</span>
            </div>
            <div className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-white/90 backdrop-blur-sm border border-slate-100 shadow-sm">
              <AustraliaIcon className="w-5 h-5 text-primary mb-1" />
              <span className="text-[9px] font-bold text-slate-600 text-center uppercase tracking-wider">Australian Owned</span>
            </div>
            <div className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-white/90 backdrop-blur-sm border border-slate-100 shadow-sm">
              <Lock className="w-5 h-5 text-primary mb-1" />
              <span className="text-[9px] font-bold text-slate-600 text-center uppercase tracking-wider">Privacy Focused</span>
            </div>
          </div>
        </div>
      </section>

      {/* Right side: login card form */}
      <section className="w-full lg:w-[52%] xl:w-[55%] flex flex-col justify-between p-4 sm:p-8 bg-slate-50 min-h-screen">
        {/* Top Header Row with Back to Home button */}
        <div className="flex items-center justify-between w-full">
          {/* Logo visible only on mobile/tablet */}
          <div className="block lg:hidden">
            <a href="/">
              <img
                className="h-8 w-auto"
                alt="Rentmatch logo"
                src={IMAGES.logo2}
              />
            </a>
          </div>
          <div className="ml-auto">
            <a
              href="/"
              className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 rounded-full border border-slate-200 transition-colors text-sm font-semibold text-primary shadow-sm"
            >
              <Home className="w-4 h-4" />
              <span>Back to Home</span>
            </a>
          </div>
        </div>

        {/* Center Card Wrapper */}
        <div className="my-auto flex items-center justify-center w-full py-12">
          <div className="w-full max-w-[450px] bg-white p-6 sm:p-10 rounded-3xl border border-slate-200/50 shadow-xl shadow-slate-200/20">
            <div className="mb-8">
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                Sign in to your account
              </h2>
              <p className="mt-2 text-sm text-slate-500 font-medium">
                Access your matches and dashboard
              </p>
            </div>

            {/* Role switcher tabs */}
            {/* {showRoleDropdown && (
              <div className="p-1 bg-slate-100 rounded-2xl flex gap-1 mb-6 border border-slate-200/50">
                <button
                  type="button"
                  onClick={() => setValue("role", "TENANT")}
                  className={`flex-1 py-3 px-2 rounded-xl flex items-center justify-center gap-2 text-xs font-bold transition-all ${selectedRole === "TENANT"
                      ? "bg-white text-primary shadow-sm"
                      : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
                    }`}
                >
                  <Users className={`w-4 h-4 ${selectedRole === "TENANT" ? "text-primary" : "text-slate-500"}`} />
                  <span>Renter</span>
                </button>
                <button
                  type="button"
                  onClick={() => setValue("role", "LANDLORD")}
                  className={`flex-1 py-3 px-2 rounded-xl flex items-center justify-center gap-2 text-xs font-bold transition-all ${selectedRole === "LANDLORD"
                      ? "bg-white text-primary shadow-sm"
                      : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
                    }`}
                >
                  <Home className={`w-4 h-4 ${selectedRole === "LANDLORD" ? "text-primary" : "text-slate-500"}`} />
                  <span>Landlord</span>
                </button>
                <button
                  type="button"
                  onClick={() => setValue("role", "PROPERTY MANAGER")}
                  className={`flex-1 py-3 px-2 rounded-xl flex items-center justify-center gap-2 text-xs font-bold transition-all ${selectedRole === "PROPERTY MANAGER"
                      ? "bg-white text-primary shadow-sm"
                      : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
                    }`}
                >
                  <Building2 className={`w-4 h-4 ${selectedRole === "PROPERTY MANAGER" ? "text-primary" : "text-slate-500"}`} />
                  <span>Property Manager</span>
                </button>
              </div>
            )} */}

            {/* Admin log in heading helper */}
            {!showRoleDropdown && (
              <div className="mb-6 p-3 bg-blue-50 border border-blue-100 rounded-xl flex items-center gap-2.5 text-xs font-extrabold text-primary">
                <ShieldCheck className="w-5 h-5 text-primary" />
                <span>
                  {selectedRole === "SUPER ADMIN" ? "SUPER ADMINISTRATOR PORTAL" : "ADMINISTRATOR PORTAL"}
                </span>
              </div>
            )}

            {/* Input Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Email Input */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs font-bold text-slate-700 tracking-wide uppercase">
                  Email address
                </Label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                    <Mail className="w-5 h-5" />
                  </div>
                  <Input
                    id="email"
                    type="email"
                    {...loginPayload("user_id")}
                    className="h-12 pl-11 pr-4 rounded-xl border border-slate-200 focus-visible:ring-1 focus-visible:ring-primary bg-white text-slate-800 text-sm font-medium shadow-none placeholder:text-slate-400"
                    placeholder="Enter your email"
                  />
                </div>
                {errors.user_id && (
                  <p className="text-xs text-red-500 font-semibold pl-1">
                    {errors.user_id.message}
                  </p>
                )}
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-xs font-bold text-slate-700 tracking-wide uppercase">
                  Password
                </Label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                    <Lock className="w-5 h-5" />
                  </div>
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    {...loginPayload("password")}
                    className="h-12 pl-11 pr-12 rounded-xl border border-slate-200 focus-visible:ring-1 focus-visible:ring-primary bg-white text-slate-800 text-sm font-medium shadow-none placeholder:text-slate-400"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-red-500 font-semibold pl-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Forgot Password */}
              <div className="flex justify-end pt-1">
                <a
                  href="/email-verification/forgot-pass"
                  className="text-sm font-bold text-primary hover:underline transition-colors"
                >
                  Forgot password?
                </a>
              </div>

              {/* Sign In Button */}
              <Button
                type="submit"
                disabled={isPending}
                className="w-full h-12 bg-primary hover:bg-[#284183] text-white rounded-xl font-bold transition-all mt-6 shadow-sm shadow-[#3352A4]/15 flex items-center justify-center gap-2 cursor-pointer text-sm animate-none"
              >
                {isPending ? "Signing In..." : "Sign In"}
              </Button>

              {/* Or Divider */}
              <div className="relative flex py-4 items-center">
                <div className="flex-grow border-t border-slate-200"></div>
                <span className="flex-shrink mx-4 text-slate-400 text-xs font-semibold uppercase tracking-wider">or continue with</span>
                <div className="flex-grow border-t border-slate-200"></div>
              </div>

              {/* Social Logins */}
              {/* <div className="space-y-3">
                <button
                  type="button"
                  className="w-full h-12 flex items-center justify-center rounded-xl border border-slate-200 hover:bg-slate-50 transition-all font-bold text-slate-700 text-sm shadow-sm cursor-pointer"
                >
                  <GoogleIcon />
                  <span>Continue with Google</span>
                </button>
                <button
                  type="button"
                  className="w-full h-12 flex items-center justify-center rounded-xl border border-slate-200 hover:bg-slate-50 transition-all font-bold text-slate-700 text-sm shadow-sm cursor-pointer"
                >
                  <AppleIcon />
                  <span>Continue with Apple</span>
                </button>
              </div> */}

              {/* Guest Login and Registration */}
              <div className="text-center pt-6 flex flex-col gap-2.5">
                {showRoleDropdown && (
                  <p className="text-sm text-slate-500 font-semibold">
                    Don't have an account?{" "}
                    <a href="/email-verification" className="text-slate-800 hover:text-primary underline font-bold transition-colors">
                      Create account
                    </a>
                  </p>
                )}
                {/* <p className="text-sm text-slate-500 font-semibold">
                  You can also login as{" "}
                  <a href="/dashboard" onClick={loginAsGuest} className="text-slate-800 hover:text-primary underline font-bold transition-colors">
                    Guest
                  </a>
                </p> */}
              </div>
            </form>
          </div>
        </div>

        {/* Footer info message */}
        <div className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-400/90 py-2 border-t border-slate-100">
          <Lock className="w-3.5 h-3.5 text-slate-400" />
          <span>Your data is safe with us. We never share your information.</span>
        </div>
      </section>
    </main>
  );
};

export default Login;
