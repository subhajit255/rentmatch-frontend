import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getTermsAndPrivacyApi } from "../../../actions/cms/faq";
import { cmsType } from "../../../types/cms";
import BlogEditor from "./BlogEditor";

const TermsConditionsAndPrivacyPolicyAdminIndexPage = ({
  type,
}: {
  type: cmsType;
}) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["privecy-n-terms", type],
    queryFn: () => getTermsAndPrivacyApi(type),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 2,
  });

  const [privacyAndTerms, setPrivacyAndTerms] = useState<any[]>([]);

  useEffect(() => {
    setPrivacyAndTerms(data?.result ? [data?.result] : []);
    console.log("data :-> ", data);
  }, [data]);
  // const content: string = data?.result ? data?.result?.content : "";
  console.log(privacyAndTerms, "<-=--privacyAndTerms");

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans text-gray-900">
      <div className="max-w-6xl mx-auto space-y-10">
        <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6">
            {privacyAndTerms?.map((elem, indx) => (
              <BlogEditor
                key={indx}
                type={type}
                isLoading={isLoading || false}
                content={elem?.content || ""}
                result={elem || null}
                isError={isError || false}
              />
            ))}
          </div>
        </section>

        {/* Preview Section */}
      </div>
    </div>
  );

};

export default TermsConditionsAndPrivacyPolicyAdminIndexPage;
