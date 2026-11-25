import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Eye,
  EyeOff,
  User,
  Phone,
  Lock,
  Building,
  FileText,
  Mail,
  MapPin,
  Loader2,
  ArrowRight,
  Home,
  CheckCircle2,
  ShieldCheck,
  Briefcase,
} from "lucide-react";
import { registrationSchema } from "@/src/types/authTypes";
import { toast } from "../../custom-hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { registrationMember, loginMember } from "../../actions/auth";
import { ageBrackets, genders } from "../../constants/userType";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { registrationValidateSchema } from "../../schemas/auth";
import { FormError } from "../errors";
import { Textarea } from "../ui/textarea";
import { useAuth } from "../../context/AuthContext";
import NavbarSection from "../ContentMangementSystem/screens/Landing/sections/NavbarSection/NavbarSection";
import FooterSection from "../ContentMangementSystem/screens/Landing/sections/FooterSection/FooterSection";

const defaultError = {
  role: "TENANT",
  first_name: "",
  middle_name: "",
  last_name: "",
  user_name: "",
  password: "",
  confirm_password: "",
  email: "",
  gender: "",
  age_bracket: "",
  phone_number: "",
  company_name: "",
  company_number: "",
  company_address: "",
  company_email: "",
  company_phone: "",
};

const Registration = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const [registrationPayload, setRegistrationPayload] =
    useState<registrationSchema>({
      role: "TENANT",
      first_name: "",
      middle_name: "",
      last_name: "",
      user_name: "",
      password: "",
      confirm_password: "",
      email: "",
      gender: "",
      age_bracket: "",
      phone_number: "",
      company_details: {
        company_name: "",
        company_number: "",
        company_address: "",
        company_email: "",
        company_phone: "",
      },
    });
  const [errors, setErrors] = useState({ ...defaultError });
  const { login: loginContext } = useAuth();

  // Guard: redirect to email-verification if user hasn't verified email
  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");
    if (!userInfo) {
      navigate("/email-verification", { replace: true });
      return;
    }
    try {
      const parsed = JSON.parse(userInfo);
      if (parsed?.email) {
        setRegistrationPayload((prev) => ({
          ...prev,
          email: parsed.email,
          role: parsed.role || prev.role,
        }));
      }
    } catch {
      navigate("/email-verification", { replace: true });
    }
  }, [navigate]);

  const { mutate: registration, isPending } = useMutation({
    mutationFn: registrationMember,
    onSuccess: async (data) => {
      localStorage?.removeItem("userInfo");
      toast({
        title: "Success",
        description: data?.message || "Successfully Registered",
        variant: "success",
      });

      const token = data?.result?.token || data?.token || "";
      if (token) {
        loginContext(
          data?.result?.loginInstance || data?.result || {},
          token,
          data?.result?.rolePermission?.access || []
        );
        if (data?.result?.is_subscribe === false) {
          navigate("/subscriptions");
        } else {
          navigate("/dashboard");
        }
        return;
      }

      // If no token was returned directly, auto-login with registration credentials
      try {
        const loginRes = await loginMember({
          role: registrationPayload.role as any,
          user_id: registrationPayload.email,
          password: registrationPayload.password,
        });

        if (loginRes?.result?.token) {
          loginContext(
            loginRes?.result?.loginInstance || { role: loginRes?.result?.role } || {},
            loginRes?.result?.token,
            loginRes?.result?.rolePermission?.access || []
          );
          if (
            loginRes?.result?.loginInstance?.is_subscribe === false ||
            data?.result?.is_subscribe === false
          ) {
            navigate("/subscriptions");
          } else {
            navigate("/dashboard");
          }
          return;
        }
      } catch (loginErr) {
        console.warn("Auto-login after registration failed:", loginErr);
      }

      // Fallback if token could not be obtained automatically
      toast({
        title: "Please Log In",
        description: "Please log in with your credentials to activate your subscription.",
        variant: "default",
      });
      navigate("/login", {
        state: {
          from: "/subscriptions",
          role: registrationPayload.role,
        },
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Registration failed",
        variant: "error",
      });
    },
  });

  const handleVerifyOtp = () => {
    const validation =
      registrationValidateSchema.safeParse(registrationPayload);

    let hasErrors = false;
    const fieldErrors: any = { ...defaultError };

    // 1. Zod Validation
    if (!validation.success) {
      validation.error.issues.forEach((err) => {
        const field = err.path[0];
        fieldErrors[field as string] = err.message;
      });
      hasErrors = true;
    }

    // 2. Company Details Manual Validation (only if Real Estate Professional)
    if (registrationPayload.role === "PROPERTY MANAGER") {
      const details = registrationPayload.company_details;
      if (!details?.company_name || details.company_name.trim().length < 3) {
        fieldErrors.company_name = "Please enter a valid agency / company name";
        hasErrors = true;
      }
      if (
        !details?.company_number ||
        details.company_number.trim().length === 0
      ) {
        fieldErrors.company_number =
          "Please enter a valid licence or registration number";
        hasErrors = true;
      }
      if (
        !details?.company_phone ||
        details.company_phone.trim().length === 0
      ) {
        fieldErrors.company_phone =
          "Please enter a valid company phone number";
        hasErrors = true;
      }
      if (
        !details?.company_email ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(details.company_email)
      ) {
        fieldErrors.company_email = "Please enter a valid company email";
        hasErrors = true;
      }
      if (
        !details?.company_address ||
        details.company_address.trim().length === 0
      ) {
        fieldErrors.company_address = "Please enter a valid company address";
        hasErrors = true;
      }
    }

    if (hasErrors) {
      setErrors(fieldErrors);
      return;
    }

    setErrors(defaultError);
    let payload = { ...registrationPayload };
    delete payload?.confirm_password;
    delete payload?.age_bracket;
    if (registrationPayload?.role !== "PROPERTY MANAGER") {
      delete payload?.company_details;
    }
    registration(payload);
  };

  const handleChange = (e: any) => {
    setErrors((prev) => ({ ...prev, [e?.target?.name]: "" }));
    setRegistrationPayload((prev) => {
      return { ...prev, [e?.target?.name]: e?.target?.value };
    });
  };

  const handleCompanydetails = (e: any) => {
    const { name, value } = e.target;
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setRegistrationPayload((prev) => {
      return {
        ...prev,
        company_details: {
          company_name: prev.company_details?.company_name || "",
          company_number: prev.company_details?.company_number || "",
          company_address: prev.company_details?.company_address || "",
          company_email: prev.company_details?.company_email || "",
          company_phone: prev.company_details?.company_phone || "",
          [name]: value,
        },
      };
    });
  };

  const getRoleDisplayName = (role?: string) => {
    switch (role) {
      case "PROPERTY MANAGER":
        return "Real Estate Professional";
      case "LANDLORD":
        return "Private Landlord";
      case "TENANT":
        return "Renter";
      default:
        return role || "Member";
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#EFF4FB] font-sans">
      <NavbarSection />

      {/* Main Container */}
      <main className="w-full max-w-[920px] mx-auto px-4 pt-6 pb-14 flex-1">
        {/* Header Title */}
        <div className="text-center mb-6">
          <span className="inline-block px-3 py-1 rounded-md text-[11px] font-bold tracking-wider uppercase bg-[#E8F8EE] text-[#0F7A4A] mb-3">
            ACCOUNT SETUP
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1E3A8A] tracking-tight mb-2">
            Create your account
          </h1>

          <div className="flex flex-wrap items-center justify-center gap-2 mt-3">
            {registrationPayload?.role && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border bg-white text-[#1E3A8A] border-blue-200 shadow-xs">
                {registrationPayload.role === "PROPERTY MANAGER" ? (
                  <Briefcase className="w-3.5 h-3.5 text-[#1E40AF]" />
                ) : registrationPayload.role === "LANDLORD" ? (
                  <Home className="w-3.5 h-3.5 text-[#1E40AF]" />
                ) : (
                  <User className="w-3.5 h-3.5 text-emerald-600" />
                )}
                <span>Registering as {getRoleDisplayName(registrationPayload.role)}</span>
              </span>
            )}
            {registrationPayload?.email && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium text-slate-600 bg-white border border-slate-200/80 shadow-xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Verified: {registrationPayload.email}</span>
              </span>
            )}
          </div>
        </div>

        {/* Card Form */}
        <div className="bg-white rounded-[28px] p-6 sm:p-10 md:p-12 shadow-[0_4px_30px_rgba(0,0,0,0.04)] border border-slate-100">
          <div className="space-y-8">
            {/* Section 1: Personal Information */}
            <div>
              <div className="flex items-center gap-2 pb-3 mb-5 border-b border-slate-100">
                <span className="w-6 h-6 rounded-full bg-[#EEF4FF] text-[#1E40AF] text-xs font-bold flex items-center justify-center">
                  1
                </span>
                <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                  Personal Information
                </h2>
              </div>

              {/* Name fields row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                {/* First Name */}
                <div>
                  <label
                    htmlFor="first_name"
                    className="block text-xs font-semibold text-slate-700 mb-1.5"
                  >
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Input
                      id="first_name"
                      type="text"
                      name="first_name"
                      value={registrationPayload?.first_name}
                      className="h-12 pl-11 rounded-xl border border-slate-200 text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                      placeholder="First name"
                      onChange={handleChange}
                    />
                    <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  </div>
                  {errors?.first_name && (
                    <FormError message={errors?.first_name} />
                  )}
                </div>

                {/* Middle Name */}
                <div>
                  <label
                    htmlFor="middle_name"
                    className="block text-xs font-semibold text-slate-700 mb-1.5"
                  >
                    Middle Name <span className="text-slate-400 font-normal">(optional)</span>
                  </label>
                  <div className="relative">
                    <Input
                      id="middle_name"
                      type="text"
                      name="middle_name"
                      value={registrationPayload?.middle_name}
                      className="h-12 pl-11 rounded-xl border border-slate-200 text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                      placeholder="Middle name"
                      onChange={handleChange}
                    />
                    <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300" />
                  </div>
                  {errors?.middle_name && (
                    <FormError message={errors?.middle_name} />
                  )}
                </div>

                {/* Last Name */}
                <div>
                  <label
                    htmlFor="last_name"
                    className="block text-xs font-semibold text-slate-700 mb-1.5"
                  >
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Input
                      id="last_name"
                      type="text"
                      name="last_name"
                      value={registrationPayload?.last_name}
                      className="h-12 pl-11 rounded-xl border border-slate-200 text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                      placeholder="Last name"
                      onChange={handleChange}
                    />
                    <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  </div>
                  {errors?.last_name && (
                    <FormError message={errors?.last_name} />
                  )}
                </div>
              </div>

              {/* Username & Gender Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {/* Username */}
                <div>
                  <label
                    htmlFor="user_name"
                    className="block text-xs font-semibold text-slate-700 mb-1.5"
                  >
                    Username <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Input
                      id="user_name"
                      type="text"
                      name="user_name"
                      value={registrationPayload?.user_name}
                      className="h-12 pl-11 rounded-xl border border-slate-200 text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                      placeholder="e.g. jsmith24"
                      onChange={handleChange}
                    />
                    <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  </div>
                  {errors?.user_name && (
                    <FormError message={errors?.user_name} />
                  )}
                </div>

                {/* Gender select */}
                <div>
                  <label
                    htmlFor="gender"
                    className="block text-xs font-semibold text-slate-700 mb-1.5"
                  >
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <Select
                    name="gender"
                    value={registrationPayload.gender || undefined}
                    onValueChange={(value) =>
                      setRegistrationPayload((prev) => ({
                        ...prev,
                        gender: value,
                      }))
                    }
                  >
                    <SelectTrigger className="w-full h-12 rounded-xl bg-white border border-slate-200 text-slate-700 text-sm focus:ring-1 focus:ring-blue-600 focus:border-blue-600">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      {genders?.map((gender) => (
                        <SelectItem key={gender?.id} value={gender?.value}>
                          {gender?.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors?.gender && <FormError message={errors?.gender} />}
                </div>
              </div>

              {/* Phone number & Age Bracket Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Phone number */}
                <div>
                  <label
                    htmlFor="phone_number"
                    className="block text-xs font-semibold text-slate-700 mb-1.5"
                  >
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Input
                      id="phone_number"
                      type="tel"
                      name="phone_number"
                      onChange={handleChange}
                      className="h-12 pl-11 rounded-xl border border-slate-200 text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                      placeholder="e.g. 0412345678"
                      value={registrationPayload?.phone_number}
                    />
                    <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  </div>
                  {errors?.phone_number && (
                    <FormError message={errors?.phone_number} />
                  )}
                </div>

                {/* Age Bracket select */}
                <div>
                  <label
                    htmlFor="age_bracket"
                    className="block text-xs font-semibold text-slate-700 mb-1.5"
                  >
                    Age Bracket <span className="text-slate-400 font-normal">(optional)</span>
                  </label>
                  <Select
                    name="age_bracket"
                    value={registrationPayload.age_bracket || undefined}
                    onValueChange={(value) =>
                      setRegistrationPayload((prev) => ({
                        ...prev,
                        age_bracket: value,
                      }))
                    }
                  >
                    <SelectTrigger className="w-full h-12 rounded-xl bg-white border border-slate-200 text-slate-700 text-sm focus:ring-1 focus:ring-blue-600 focus:border-blue-600">
                      <SelectValue placeholder="Select age bracket" />
                    </SelectTrigger>
                    <SelectContent>
                      {ageBrackets?.map((bracket) => (
                        <SelectItem key={bracket?.id} value={bracket?.value}>
                          {bracket?.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors?.age_bracket && (
                    <FormError message={errors?.age_bracket} />
                  )}
                </div>
              </div>
            </div>

            {/* Section 2: Real Estate Professional Details (Only if PROPERTY MANAGER) */}
            {registrationPayload?.role === "PROPERTY MANAGER" && (
              <div className="pt-2">
                <div className="flex items-center gap-2 pb-3 mb-2 border-b border-slate-100">
                  <span className="w-6 h-6 rounded-full bg-[#EEF4FF] text-[#1E40AF] text-xs font-bold flex items-center justify-center">
                    2
                  </span>
                  <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                    Real Estate Professional Details
                  </h2>
                </div>
                <p className="text-xs text-slate-500 mb-5">
                  Please provide your agency information for account verification.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {/* Agency / Company Name */}
                  <div>
                    <label
                      htmlFor="company_name"
                      className="block text-xs font-semibold text-slate-700 mb-1.5"
                    >
                      Agency / Company Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Input
                        id="company_name"
                        type="text"
                        name="company_name"
                        onChange={handleCompanydetails}
                        className="h-12 pl-11 rounded-xl border border-slate-200 text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                        placeholder="e.g. Prime Realty Group"
                        value={registrationPayload?.company_details?.company_name}
                      />
                      <Building className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    </div>
                    {errors?.company_name && (
                      <FormError message={errors?.company_name} />
                    )}
                  </div>

                  {/* Licence / Registration Number */}
                  <div>
                    <label
                      htmlFor="company_number"
                      className="block text-xs font-semibold text-slate-700 mb-1.5"
                    >
                      Licence / Registration Number (ABN/ACN){" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Input
                        id="company_number"
                        type="text"
                        name="company_number"
                        onChange={handleCompanydetails}
                        className="h-12 pl-11 rounded-xl border border-slate-200 text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                        placeholder="Licence or ABN"
                        value={registrationPayload?.company_details?.company_number}
                      />
                      <FileText className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    </div>
                    {errors?.company_number && (
                      <FormError message={errors?.company_number} />
                    )}
                  </div>

                  {/* Agency Phone */}
                  <div>
                    <label
                      htmlFor="company_phone"
                      className="block text-xs font-semibold text-slate-700 mb-1.5"
                    >
                      Agency Phone Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Input
                        id="company_phone"
                        type="text"
                        name="company_phone"
                        onChange={handleCompanydetails}
                        className="h-12 pl-11 rounded-xl border border-slate-200 text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                        placeholder="Agency office phone"
                        value={registrationPayload?.company_details?.company_phone}
                      />
                      <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    </div>
                    {errors?.company_phone && (
                      <FormError message={errors?.company_phone} />
                    )}
                  </div>

                  {/* Agency Email */}
                  <div>
                    <label
                      htmlFor="company_email"
                      className="block text-xs font-semibold text-slate-700 mb-1.5"
                    >
                      Agency Email Address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Input
                        id="company_email"
                        type="email"
                        name="company_email"
                        onChange={handleCompanydetails}
                        className="h-12 pl-11 rounded-xl border border-slate-200 text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                        placeholder="agency@company.com"
                        value={registrationPayload?.company_details?.company_email}
                      />
                      <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    </div>
                    {errors?.company_email && (
                      <FormError message={errors?.company_email} />
                    )}
                  </div>

                  {/* Agency Address */}
                  <div className="md:col-span-2">
                    <label
                      htmlFor="company_address"
                      className="block text-xs font-semibold text-slate-700 mb-1.5"
                    >
                      Agency Office Address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Textarea
                        id="company_address"
                        rows={2}
                        name="company_address"
                        onChange={handleCompanydetails}
                        className="text-sm rounded-xl border border-slate-200 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 p-3 pl-11"
                        placeholder="Full office address with suburb and postcode"
                        value={registrationPayload?.company_details?.company_address}
                      />
                      <MapPin className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                    </div>
                    {errors?.company_address && (
                      <FormError message={errors?.company_address} />
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Section 3: Password / Security */}
            <div className="pt-2">
              <div className="flex items-center gap-2 pb-3 mb-5 border-b border-slate-100">
                <span className="w-6 h-6 rounded-full bg-[#EEF4FF] text-[#1E40AF] text-xs font-bold flex items-center justify-center">
                  {registrationPayload?.role === "PROPERTY MANAGER" ? "3" : "2"}
                </span>
                <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                  Security & Credentials
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Password */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-xs font-semibold text-slate-700 mb-1.5"
                  >
                    Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={registrationPayload?.password}
                      onChange={handleChange}
                      className="h-12 pl-11 pr-11 rounded-xl border border-slate-200 text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                      placeholder="Min. 8 characters"
                    />
                    <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <button
                      type="button"
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
                      onClick={() => setShowPassword((prev) => !prev)}
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {errors?.password && (
                    <FormError message={errors?.password} />
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label
                    htmlFor="confirmpassword"
                    className="block text-xs font-semibold text-slate-700 mb-1.5"
                  >
                    Confirm Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Input
                      id="confirmpassword"
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirm_password"
                      value={registrationPayload?.confirm_password}
                      onChange={handleChange}
                      className="h-12 pl-11 pr-11 rounded-xl border border-slate-200 text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                      placeholder="Repeat password"
                    />
                    <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <button
                      type="button"
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      tabIndex={-1}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {errors?.confirm_password && (
                    <FormError message={errors?.confirm_password} />
                  )}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4 flex flex-col items-center gap-3">
              <Button
                type="button"
                onClick={handleVerifyOtp}
                disabled={isPending}
                className="w-full sm:w-auto min-w-[240px] h-12 rounded-full font-bold text-sm bg-[#1E40AF] hover:bg-[#1e3a8a] text-white transition-all shadow-sm hover:shadow flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
              >
                {isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
              <p className="text-xs text-slate-500">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-bold text-[#1E40AF] hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Modern Footer Section below */}
      <FooterSection />
    </div>
  );
};

export default Registration;
