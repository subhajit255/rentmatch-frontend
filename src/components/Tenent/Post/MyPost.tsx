import React, { useEffect, useState } from "react";
import { IMAGES } from "../../../assets";
import Post from "../../ChildComponent/Common/Post";
import { useQuery } from "@tanstack/react-query";
import { getMyPost } from "../../../actions/myPost";

const MyPost = () => {
  const dropDownref = React.useRef<{ [key: string]: HTMLDivElement | null }>({});
  const [openRowId, setOpenRowId] = useState<string | null>(null);
  const [pagination, setPagination] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const { data: myPost, isLoading } = useQuery({
    queryKey: ['myPost', currentPage, limit],
    queryFn: () => getMyPost({ page: currentPage, limit }),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const totalPages = myPost?.pagination?.totalPages;
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

  if (myPost && myPost.result.length == 0) {
    return <div className="common-container">
      <div className="flex justify-center items-center mt-10">
        <div className="flex justify-center items-center flex-col">
          <img
            src={IMAGES.error}
            alt="No Properties"
            className="mb-4 w-[50%]"
          />
          <p className="text-2xl">
            You haven't posted anything yet!
          </p>
          <p>
            Share your rental property requirements by creating a new post now.
          </p>
          <div className="flex border-none rounded-lg py-2 mt-4">
            <div className="relative mb-6">
              {/* <div className="absolute inset-0 animate-ping rounded-full bg-primary opacity-20"></div> */}
              <a
                href="/create-post"
                className="bg-primary px-6 flex items-center gap-2 rounded-3xl text-white hover:text-primary hover:bg-white border border-primary py-2"
              >
                <img src={IMAGES.add} alt="" className="bg-primary" />
                Create a new post
              </a>
            </div>

          </div>
        </div>
      </div>
    </div>
  }

  return (
    <div className="common-container">
      <div className="w-full mx-auto flex flex-col gap-5 mb-5">
        <div className="flex justify-between">
          <div className="flex items-center justify-between mb-6 rounded-lg">
            <h2 className="text-md font-bold text-gray-900">Posts</h2>
            <span
              className="ml-3 bg-primary text-white text-xs px-[5px] rounded-full">
              {myPost?.result?.length || 0}
            </span>
          </div>
          <div className="flex border rounded-lg py-2">
            <a
              href="/create-post"
              className="bg-primary px-6 flex items-center gap-2 rounded-3xl text-white hover:text-primary hover:bg-white border border-primary py-2"
            >
              <img src={IMAGES.add} alt="" className="bg-primary" />
              Post
            </a>
          </div>
        </div>
        <div className="space-y-6" >
          <div className="grid grid-cols-1">
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
        </div>
        <div className="flex justify-between mt-4">
          <button onClick={handlePreviousPage} disabled={currentPage === 1} className="bg-gray-300 p-2 rounded">
            Previous
          </button>
          <span>Page {currentPage} of {totalPages}</span>
          <button onClick={handleNextPage} disabled={currentPage === totalPages} className="bg-gray-300 p-2 rounded">
            Next
          </button>
        </div>
      </div>
    </div>
  );
};
export default MyPost;
