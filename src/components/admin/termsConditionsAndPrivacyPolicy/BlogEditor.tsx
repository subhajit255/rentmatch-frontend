import React, { useState } from "react";
import { Button } from "../../ui/button";
import Icon from "../../icons/icon";
import { useNavigate } from "react-router-dom";
import { description } from "../../cards/barCharts";

type result = {
  _id: string;
  type: "PRIVACY_POLICY" | string;
  __v: number;
  content: string;
  last_edited_by: string | null;
  publishedAt: string;
  status: "ACTIVE" | "INACTIVE" | string;
  title: string;
  role?: string;
};

const BlogEditor = ({
  type,
  isLoading,
  content,
  result,
  isError,
}: {
  type: string;
  isLoading: boolean;
  content: string;
  result?: result[] | null;
  isError?: boolean;
}) => {
  const navigation = useNavigate();
 
  const handleAddEditButton = () => {
    const formattedType = type.toLowerCase().replace(/_/g, "-");
    navigation(`/${formattedType}/edit`);
  };
  return (
    <div className="w-full relative min-h-screen bg-gray-50/50 p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 capitalize">
            {type.toLowerCase().replace(/_/g, " ")}
          </h1>
          <p className="text-gray-500 text-sm">
            Manage and review your published site content.
          </p>
        </div>

        {/* The Edit Button */}
        <Button
          variant="secondary"
          className="h-[45px] px-6 rounded-full flex items-center gap-2 shadow-sm border-gray-200 hover:bg-gray-100 transition-all"
          onClick={handleAddEditButton}
        >
          <Icon name="PlusIcon" className="w-4 h-4" />
          <span className="font-medium">
            {!result || result.length === 0 ? "Add" : "Edit"}{" "}
            {type.toLowerCase().replace(/_/g, " ")}
          </span>
        </Button>
      </div>

      <div className="admin-cms-page space-y-6">
        <div className="flex items-center gap-4">
          <span className="h-px flex-1 bg-gray-200"></span>
        </div>

        <section className="preview-section">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center p-12 bg-white border-2 border-dashed border-gray-200 rounded-xl">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-4"></div>
              <p className="text-gray-500 font-medium">
                Loading your content...
              </p>
            </div>
          ) : isError ? (
            <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-3">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              Failed to load content. Please try again later.
            </div>
          ) : result && result.length > 0 ? (
            result.map((elem, index) => (
              <div className="space-y-4" key={elem._id || index}>
                <div className="text-2xl font-bold text-gray-900 px-2 leading-tight">
                  Title : {elem?.title || "Untitled"}
                </div>
                <div className="text-2xl font-bold text-gray-900 px-2 leading-tight">
                  Role : {elem?.role || "Untitled"}
                </div>
                <div
                  className="prose prose-indigo prose-lg max-w-none p-8 bg-white border border-gray-200 rounded-xl shadow-sm"
                  dangerouslySetInnerHTML={{ __html: elem?.content || "" }}
                />
              </div>
            ))
          ) : (
            <div className="p-8 bg-amber-50 border border-amber-100 text-amber-800 rounded-xl text-center">
              <p className="italic">
                No content has been published yet for this{" "}
                <strong>{type?.toLowerCase().replace(/_/g, " ")}</strong>.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default BlogEditor;
