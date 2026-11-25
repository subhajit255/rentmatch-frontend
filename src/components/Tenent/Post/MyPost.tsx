import React, { useState } from "react";
import { Link } from "react-router-dom";
import { IMAGES } from "../../../assets";
import Post from "../../ChildComponent/Common/Post";
import { useQuery } from "@tanstack/react-query";
import { getMyPost } from "../../../actions/myPost";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../../ui/button";

const MyPost = () => {
  const dropDownref = React.useRef<{ [key: string]: HTMLDivElement | null }>({});
  const [openRowId, setOpenRowId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const { data: myPost, isLoading } = useQuery({
    queryKey: ["myPost", currentPage, limit],
    queryFn: () => getMyPost({ page: currentPage, limit }),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const totalPages = myPost?.pagination?.totalPages || 1;
  const totalRecords = myPost?.pagination?.totalRecords ?? myPost?.result?.length ?? 0;

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  return (
    <div className="common-container pb-8">
      <div className="w-full mx-auto flex flex-col gap-4 sm:gap-5">
        {/* Header Bar */}
        <div className="flex items-center justify-between py-1">
          {/* Total no. of posts with clean modern badge */}
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Posts
            </h1>
            <span className="bg-blue-50 text-blue-700 font-bold text-xs px-2.5 py-0.5 rounded-full border border-blue-200/60 shadow-2xs">
              {totalRecords}
            </span>
          </div>

          {/* Add Post Button with border wrapper removed */}
          <Link
            to="/create-post"
            className="bg-primary hover:bg-primary/95 text-white font-semibold text-xs sm:text-sm px-4 sm:px-5 py-2 rounded-full flex items-center gap-1.5 shadow-sm hover:shadow transition-all"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            Post
          </Link>
        </div>

        {/* Content Section: Skeleton / Empty State / Post Cards */}
        {isLoading ? (
          /* Skeleton Loader Matching Post Listing Structure */
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs flex flex-col md:flex-row justify-between gap-4 animate-pulse"
              >
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-5 bg-slate-200 rounded-md w-48" />
                    <div className="h-4 bg-slate-100 rounded-full w-14" />
                  </div>
                  <div className="h-3.5 bg-slate-100 rounded w-3/4" />
                  <div className="flex items-center gap-6 pt-1">
                    <div className="h-3 bg-slate-100 rounded w-28" />
                    <div className="h-3 bg-slate-100 rounded w-32" />
                  </div>
                  <div className="flex flex-wrap items-center gap-4 pt-2">
                    <div className="h-3.5 bg-slate-100 rounded w-28" />
                    <div className="h-3.5 bg-slate-100 rounded w-24" />
                    <div className="h-3.5 bg-slate-100 rounded w-20" />
                    <div className="h-3.5 bg-slate-100 rounded w-20" />
                  </div>
                </div>
                <div className="md:border-l md:border-slate-100 md:pl-6 flex md:flex-col justify-between items-end gap-4 min-w-[140px] pt-2 md:pt-0">
                  <div className="flex items-center gap-2">
                    <div className="h-4 bg-slate-100 rounded w-10" />
                    <div className="w-10 h-5 bg-slate-200 rounded-full" />
                  </div>
                  <div className="h-9 bg-slate-100 rounded-full w-28" />
                </div>
              </div>
            ))}
          </div>
        ) : myPost && myPost.result && myPost.result.length === 0 ? (
          /* Empty State */
          <div className="flex justify-center items-center py-16 bg-white rounded-2xl border border-slate-100 shadow-xs">
            <div className="flex justify-center items-center flex-col text-center max-w-md px-4">
              <img
                src={IMAGES.error}
                alt="No Posts"
                className="mb-4 w-36 h-36 object-contain"
              />
              <h3 className="text-xl font-bold text-slate-900 mb-1">
                You haven't posted anything yet!
              </h3>
              <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                Share your rental property requirements by creating a new post now.
              </p>
              <Link
                to="/create-post"
                className="bg-primary hover:bg-primary/95 text-white font-semibold text-sm px-6 py-2.5 rounded-full flex items-center gap-2 shadow-sm transition-all"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                Create a new post
              </Link>
            </div>
          </div>
        ) : (
          /* Posts List */
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              {myPost?.result?.map((post: any) => (
                <Post
                  key={post?._id}
                  postDetails={post}
                  dropDownref={dropDownref}
                  openRowId={openRowId}
                  setOpenRowId={setOpenRowId}
                />
              ))}
            </div>

            {/* Pagination Controls matching ExploreProperties */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6 px-1 py-2">
                <div className="w-28 flex justify-start">
                  {currentPage > 1 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handlePreviousPage}
                      className="rounded-full border-slate-200 hover:border-blue-600 hover:text-blue-600 font-semibold text-xs text-slate-700 px-3.5 py-1.5 h-9 transition-all flex items-center gap-1 shadow-xs bg-white"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Previous
                    </Button>
                  )}
                </div>

                <span className="text-xs sm:text-sm font-medium text-slate-600 bg-slate-100/90 border border-slate-200/60 px-4 py-1.5 rounded-full shadow-2xs">
                  Page <span className="text-slate-900 font-bold">{currentPage}</span> of{" "}
                  <span className="text-slate-900 font-bold">{totalPages}</span>
                </span>

                <div className="w-28 flex justify-end">
                  {currentPage < totalPages && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleNextPage}
                      className="rounded-full border-slate-200 hover:border-blue-600 hover:text-blue-600 font-semibold text-xs text-slate-700 px-3.5 py-1.5 h-9 transition-all flex items-center gap-1 shadow-xs bg-white"
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyPost;
