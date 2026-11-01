import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getTermsAndPrivacyApi } from "../../actions/cms/faq";
import { useAuth } from "../../context/AuthContext";
// import { useLocation } from "react-router-dom"; // <-- Uncomment if using React Router
// import { usePathname } from "next/navigation"; // <-- Uncomment if using Next.js

const Policy = () => {
  const { user } = useAuth();

  // 1. RECOMMENDATION: Use your router's hook instead of global window object
  // React Router: const location = useLocation(); const path = location.pathname;
  // Next.js: const path = usePathname();
  const path = typeof window !== "undefined" ? window.location.pathname : "";

  // Wrap in useMemo so it doesn't recalculate on every single render
  const policyType = useMemo(() => {
    if (path.includes("/policy/privacy-policy")) {
      return "PRIVACY_POLICY";
    }
    if (path.includes("/policy/terms-and-conditions")) {
      return "TERMS_AND_CONDITIONS";
    }
    return "PRIVACY_POLICY";
  }, [path]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["privacy-n-terms", policyType], // fixed small typo in query key
    queryFn: () => getTermsAndPrivacyApi(policyType),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 2,
  });

  // 2. CORRECTION: Use .find() to search the whole array for the matching role!
  const DataResult = useMemo(() => {
    if (!data?.result || !Array.isArray(data.result)) return null;
    return data.result.find((item: any) => item.role === user?.role) || null;
  }, [data?.result, user?.role]);

  const content = DataResult?.content ?? "";
  const title =
    DataResult?.title ??
    (policyType === "PRIVACY_POLICY" ? "Privacy Policy" : "Terms & Conditions");

  // console.log("Policy data-----------------:", data);  

  // ────────────────────────────────────────────────
  //  loading/error states
  // ────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="common-container bg-white rounded-2xl border-accent shadow-md p-10">
        <div className="text-center text-gray-500">Loading policy...</div>
      </div>
    );
  }

  if (isError || (!content && !isLoading)) {
    return (
      <div className="common-container bg-white rounded-2xl border-accent shadow-md p-10">
        <div className="text-center text-red-600">
          Failed to load policy content. Please try again later.
        </div>
      </div>
    );
  }

  return (
    <div className="common-container bg-white rounded-2xl border-accent shadow-md pb-6">
      <div className="w-full mx-auto flex flex-col gap-5">
        {/* Title Section */}
        <div className="px-6 pt-6 pb-2 border-b border-gray-200">
          <h1 className="text-2xl text-primary font-bold text-gray-900">
            {title}
          </h1>
        </div>
        <div
          className="px-6 text-sm prose max-w-none thin-scrollbar h-[calc(100dvh-260px)] overflow-y-auto"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </div>
  );
};

export default Policy;