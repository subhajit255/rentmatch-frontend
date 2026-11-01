import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Eye, EyeOff, User, Phone, Lock, Building, FileText, Mail, MapPin, Loader2, ArrowRight } from "lucide-react";
import { registrationSchema } from "@/src/types/authTypes";
import { toast } from "../../custom-hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { registrationMember } from "../../actions/auth";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@radix-ui/react-select";
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
  const navigate = useNavigate(); // Initialize navigate for redirection
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
    onSuccess: (data) => {
      console.log("data is_subscribe :: ", data?.result?.is_subscribe);

      localStorage?.removeItem("userInfo");
      // console.log("data :: ", data);
      // localStorage?.setItem('auth_token', data?.result?.token || null)
      // localStorage?.setItem('user_info', JSON.stringify(data?.result?.loginInstance || {}))
      toast({
        title: "Success",
        description: data?.message || "Successfully Registered",
        variant: "success",
      });
      // navigate("/login")
      if (data?.result?.is_subscribe === false) {
        loginContext(data?.result || {}, "");
        navigate("/subscriptions");
      } else {
        navigate("/login");
      }
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

    // 2. Company Details Manual Validation (only if Property Manager)
    if (registrationPayload.role === "PROPERTY MANAGER") {
      const details = registrationPayload.company_details;
      if (!details?.company_name || details.company_name.trim().length < 3) {
        fieldErrors.company_name = "Please enter a valid company name";
        hasErrors = true;
      }
      if (!details?.company_number || details.company_number.trim().length === 0) {
        fieldErrors.company_number = "Please enter a valid company number";
        hasErrors = true;
      }
      if (!details?.company_phone || details.company_phone.trim().length === 0) {
        fieldErrors.company_phone = "Please enter a valid company phone number";
        hasErrors = true;
      }
      if (!details?.company_email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(details.company_email)) {
        fieldErrors.company_email = "Please enter a valid company email";
        hasErrors = true;
      }
      if (!details?.company_address || details.company_address.trim().length === 0) {
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
    // backend Joi memberRegistrationValidator rejects unknown keys like age_bracket
    delete payload?.age_bracket;
    if (registrationPayload?.role !== "PROPERTY MANAGER") {
      delete payload?.company_details;
    }
    registration(payload);
  };

  useEffect(() => {
    const userStorageInfo = localStorage?.getItem("userInfo");
    if (userStorageInfo) {
      const userInfo = JSON.parse(userStorageInfo);
      // console.log("userInfo : ", userInfo);
      setRegistrationPayload((prev) => ({
        ...prev,
        email: userInfo?.email,
        role: userInfo?.role,
      }));
    }
  }, []);

  const handleChange = (e: any) => {
    const { name, value } = e.target;


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

  // useEffect(() => {
  //   // console.log("registration Payload ::: ", registrationPayload);
  // }, [registrationPayload])

  return (
    <main className="flex-1 flex items-center justify-center px-4 py-12 md:py-20 relative overflow-hidden bg-slate-50/50">
      {/* Decorative background gradients */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10 translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl -z-10 -translate-x-1/3 translate-y-1/3" />

      <div className="w-full max-w-2xl relative z-10">
        <div className="text-center mb-8">
          <p className="text-xs font-bold text-primary tracking-[0.2em] uppercase mb-2">
            WELCOME TO RENTMATCH
          </p>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            Create your account
          </h1>
          {registrationPayload?.role && (
            <p className="text-sm text-slate-500 mt-2">
              Registering as <span className="font-semibold text-primary capitalize">{registrationPayload.role.toLowerCase()}</span>
            </p>
          )}
          {registrationPayload?.email && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200/60 text-xs font-medium text-slate-600 mt-3 shadow-sm">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span>{registrationPayload.email}</span>
            </div>
          )}
        </div>

        <Card className="overflow-hidden shadow-xl shadow-slate-200/50 bg-white border border-slate-100 rounded-[2rem]">
          <CardContent className="p-6 md:p-10">
            <div className="w-full mx-auto space-y-6">
              {/* Name fields row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* First Name */}
                <div>
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="first_name"
                      className="text-sm font-semibold text-slate-700"
                    >
                      First Name <span className="text-destructive">*</span>
                    </label>
                    <div className="relative rounded-xl shadow-sm">
                      <Input
                        id="first_name"
                        type="text"
                        name="first_name"
                        value={registrationPayload?.first_name}
                        className="h-12 text-base pl-11 rounded-xl border border-slate-200 focus-visible:ring-primary focus-visible:border-primary focus-visible:ring-1 transition-all"
                        placeholder="First name"
                        onChange={handleChange}
                      />
                      <User className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    </div>
                  </div>
                  {errors?.first_name && (
                    <FormError message={errors?.first_name} />
                  )}
                </div>

                {/* Middle Name */}
                <div>
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="middle_name"
                      className="text-sm font-semibold text-slate-700"
                    >
                      Middle Name
                    </label>
                    <div className="relative rounded-xl shadow-sm">
                      <Input
                        id="middle_name"
                        type="text"
                        name="middle_name"
                        value={registrationPayload?.middle_name}
                        className="h-12 text-base pl-11 rounded-xl border border-slate-200 focus-visible:ring-primary focus-visible:border-primary focus-visible:ring-1 transition-all"
                        placeholder="Middle name"
                        onChange={handleChange}
                      />
                      <User className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300" />
                    </div>
                  </div>
                  {errors?.middle_name && (
                    <FormError message={errors?.middle_name} />
                  )}
                </div>

                {/* Last Name */}
                <div>
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="last_name"
                      className="text-sm font-semibold text-slate-700"
                    >
                      Last Name <span className="text-destructive">*</span>
                    </label>
                    <div className="relative rounded-xl shadow-sm">
                      <Input
                        id="last_name"
                        type="text"
                        name="last_name"
                        value={registrationPayload?.last_name}
                        className="h-12 text-base pl-11 rounded-xl border border-slate-200 focus-visible:ring-primary focus-visible:border-primary focus-visible:ring-1 transition-all"
                        placeholder="Last name"
                        onChange={handleChange}
                      />
                      <User className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    </div>
                  </div>
                  {errors?.last_name && (
                    <FormError message={errors?.last_name} />
                  )}
                </div>
              </div>

              {/* Username & Gender Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Username */}
                <div>
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="user_name"
                      className="text-sm font-semibold text-slate-700"
                    >
                      Username <span className="text-destructive">*</span>
                    </label>
                    <div className="relative rounded-xl shadow-sm">
                      <Input
                        id="user_name"
                        type="text"
                        name="user_name"
                        value={registrationPayload?.user_name}
                        className="h-12 text-base pl-11 rounded-xl border border-slate-200 focus-visible:ring-primary focus-visible:border-primary focus-visible:ring-1 transition-all"
                        placeholder="Enter username"
                        onChange={handleChange}
                      />
                      <User className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    </div>
                  </div>
                  {errors?.user_name && (
                    <FormError message={errors?.user_name} />
                  )}
                </div>

                {/* Gender select */}
                <div>
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="gender"
                      className="text-sm font-semibold text-slate-700"
                    >
                      Gender <span className="text-destructive">*</span>
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
                      <SelectTrigger className="w-full h-12 rounded-xl bg-white border border-slate-200 text-slate-700 shadow-none focus-visible:ring-primary focus-visible:border-primary focus-visible:ring-1 transition-all">
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
                  </div>
                  {errors?.gender && <FormError message={errors?.gender} />}
                </div>
              </div>

              {/* Phone number & Age Bracket Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Phone number */}
                <div>
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="phone_number"
                      className="text-sm font-semibold text-slate-700"
                    >
                      Mobile Number <span className="text-destructive">*</span>
                    </label>
                    <div className="relative rounded-xl shadow-sm">
                      <Input
                        id="phone_number"
                        type="tel"
                        name="phone_number"
                        onChange={handleChange}
                        className="h-12 text-base pl-11 rounded-xl border border-slate-200 focus-visible:ring-primary focus-visible:border-primary focus-visible:ring-1 transition-all"
                        placeholder="Enter mobile number"
                        value={registrationPayload?.phone_number}
                      />
                      <Phone className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    </div>
                  </div>
                  {errors?.phone_number && (
                    <FormError message={errors?.phone_number} />
                  )}
                </div>

                {/* Age Bracket select */}
                <div>
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="age_bracket"
                      className="text-sm font-semibold text-slate-700"
                    >
                      Age Bracket
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
                      <SelectTrigger className="w-full h-12 rounded-xl bg-white border border-slate-200 text-slate-700 shadow-none focus-visible:ring-primary focus-visible:border-primary focus-visible:ring-1 transition-all">
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
                  </div>
                  {errors?.age_bracket && <FormError message={errors?.age_bracket} />}
                </div>
              </div>

              {/* Start company details - Only for property Manager */}
              {registrationPayload?.role === "PROPERTY MANAGER" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-100 pt-6 mt-6">
                  <div className="md:col-span-2 mb-2">
                    <h3 className="text-sm font-bold text-primary uppercase tracking-wider">
                      Company Information
                    </h3>
                  </div>

                  {/* Company Name */}
                  <div>
                    <div className="flex flex-col gap-2">
                      <label
                        htmlFor="company_name"
                        className="text-sm font-semibold text-slate-700"
                      >
                        Company Name <span className="text-destructive">*</span>
                      </label>
                      <div className="relative rounded-xl shadow-sm">
                        <Input
                          id="company_name"
                          type="text"
                          name="company_name"
                          onChange={handleCompanydetails}
                          className="h-12 text-base pl-11 rounded-xl border border-slate-200 focus-visible:ring-primary focus-visible:border-primary focus-visible:ring-1 transition-all"
                          placeholder="Enter company name"
                          value={registrationPayload?.company_details?.company_name}
                        />
                        <Building className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      </div>
                    </div>
                    {errors?.company_name && (
                      <FormError message={errors?.company_name} />
                    )}
                  </div>

                  {/* Company Number */}
                  <div>
                    <div className="flex flex-col gap-2">
                      <label
                        htmlFor="company_number"
                        className="text-sm font-semibold text-slate-700"
                      >
                        Company Number <span className="text-destructive">*</span>
                      </label>
                      <div className="relative rounded-xl shadow-sm">
                        <Input
                          id="company_number"
                          type="number"
                          name="company_number"
                          onChange={handleCompanydetails}
                          className="h-12 text-base pl-11 rounded-xl border border-slate-200 focus-visible:ring-primary focus-visible:border-primary focus-visible:ring-1 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          placeholder="Enter company number"
                          value={registrationPayload?.company_details?.company_number}
                        />
                        <FileText className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      </div>
                    </div>
                    {errors?.company_number && (
                      <FormError message={errors?.company_number} />
                    )}
                  </div>

                  {/* Company Phone */}
                  <div>
                    <div className="flex flex-col gap-2">
                      <label
                        htmlFor="company_phone"
                        className="text-sm font-semibold text-slate-700"
                      >
                        Company Phone Number <span className="text-destructive">*</span>
                      </label>
                      <div className="relative rounded-xl shadow-sm">
                        <Input
                          id="company_phone"
                          type="text"
                          name="company_phone"
                          onChange={handleCompanydetails}
                          className="h-12 text-base pl-11 rounded-xl border border-slate-200 focus-visible:ring-primary focus-visible:border-primary focus-visible:ring-1 transition-all"
                          placeholder="Enter company phone"
                          value={registrationPayload?.company_details?.company_phone}
                        />
                        <Phone className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      </div>
                    </div>
                    {errors?.company_phone && (
                      <FormError message={errors?.company_phone} />
                    )}
                  </div>

                  {/* Company Email */}
                  <div>
                    <div className="flex flex-col gap-2">
                      <label
                        htmlFor="company_email"
                        className="text-sm font-semibold text-slate-700"
                      >
                        Company Email <span className="text-destructive">*</span>
                      </label>
                      <div className="relative rounded-xl shadow-sm">
                        <Input
                          id="company_email"
                          type="email"
                          name="company_email"
                          onChange={handleCompanydetails}
                          className="h-12 text-base pl-11 rounded-xl border border-slate-200 focus-visible:ring-primary focus-visible:border-primary focus-visible:ring-1 transition-all"
                          placeholder="Enter company email"
                          value={registrationPayload?.company_details?.company_email}
                        />
                        <Mail className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      </div>
                    </div>
                    {errors?.company_email && (
                      <FormError message={errors?.company_email} />
                    )}
                  </div>

                  {/* Company Address */}
                  <div className="md:col-span-2">
                    <div className="flex flex-col gap-2">
                      <label
                        htmlFor="company_address"
                        className="text-sm font-semibold text-slate-700"
                      >
                        Company Address <span className="text-destructive">*</span>
                      </label>
                      <div className="relative rounded-xl shadow-sm">
                        <Textarea
                          id="company_address"
                          rows={3}
                          name="company_address"
                          onChange={handleCompanydetails}
                          className="text-base rounded-xl border border-slate-200 focus-visible:ring-primary focus-visible:border-primary focus-visible:ring-1 transition-all p-4 pl-11"
                          placeholder="Enter company address"
                          value={registrationPayload?.company_details?.company_address}
                        />
                        <MapPin className="w-5 h-5 absolute left-3.5 top-4 text-slate-400" />
                      </div>
                    </div>
                    {errors?.company_address && (
                      <FormError message={errors?.company_address} />
                    )}
                  </div>
                </div>
              )}
              {/* End company details */}

              {/* Password Fields Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-100 pt-6 mt-6">
                {/* Password */}
                <div>
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="password"
                      className="text-sm font-semibold text-slate-700"
                    >
                      Password <span className="text-destructive">*</span>
                    </label>
                    <div className="relative rounded-xl shadow-sm">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={registrationPayload?.password}
                        onChange={handleChange}
                        className="h-12 text-base pl-11 pr-12 rounded-xl border border-slate-200 focus-visible:ring-primary focus-visible:border-primary focus-visible:ring-1 transition-all"
                        placeholder="Enter password"
                      />
                      <Lock className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <button
                        type="button"
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                        onClick={() => setShowPassword((prev) => !prev)}
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>
                  {errors?.password && (
                    <FormError message={errors?.password} />
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="confirmpassword"
                      className="text-sm font-semibold text-slate-700"
                    >
                      Confirm Password <span className="text-destructive">*</span>
                    </label>
                    <div className="relative rounded-xl shadow-sm">
                      <Input
                        id="confirmpassword"
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirm_password"
                        value={registrationPayload?.confirm_password}
                        onChange={handleChange}
                        className="h-12 text-base pl-11 pr-12 rounded-xl border border-slate-200 focus-visible:ring-primary focus-visible:border-primary focus-visible:ring-1 transition-all"
                        placeholder="Confirm password"
                      />
                      <Lock className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <button
                        type="button"
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>
                  {errors?.confirm_password && (
                    <FormError message={errors?.confirm_password} />
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-center pt-4">
                <Button
                  onClick={handleVerifyOtp}
                  disabled={isPending}
                  className="w-full sm:w-auto min-w-[200px] h-12 md:h-14 px-8 rounded-full font-bold text-base md:text-lg bg-primary hover:bg-primary/95 text-white transition-all shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isPending ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <span>Create Account</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default Registration;
