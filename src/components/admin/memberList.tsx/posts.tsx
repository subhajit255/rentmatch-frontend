import React, { useState } from "react";
import { IMAGES } from "../../../assets";
import { getMemberPostsAPI } from "../../../actions/userManagement";
import { useQuery } from "@tanstack/react-query";
import Post from "../../ChildComponent/Common/Post";


const PostsFromTenant = ({ _id, posts, isLoading, error }: { _id: string; posts: any; isLoading: boolean; error: any }) => {
    const [page, setPage] = useState(1);

    const dropDownref = React.useRef<{ [key: string]: HTMLDivElement | null }>({});
    const [openRowId, setOpenRowId] = useState<string | null>(null);
    const [pagination, setPagination] = useState<any>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(10);

    // const { data, isLoading } = useQuery({
    //     queryKey: ['member-schedules', _id],
    //     queryFn: () => getMemberPostsAPI(_id ?? "", page, limit),
    //     staleTime: 5 * 60 * 1000,
    //     refetchOnWindowFocus: false,
    //     enabled: !!_id,
    // });
    return <div className="common-container">
        <div className="w-full mx-auto flex flex-col gap-5 mb-5">
            <div className="flex justify-between">
                <div className="flex items-center justify-between mb-6 rounded-lg">
                    <h2 className="text-md font-bold text-gray-900">Posts</h2>
                    <span
                        className="ml-3 bg-primary text-white text-xs px-[5px] rounded-full">
                        {posts?.result?.length || 0}
                    </span>
                </div>
                {/* <div className="flex border rounded-lg py-2">
                    <a
                        href="/create-post"
                        className="bg-primary px-6 flex items-center gap-2 rounded-3xl text-white hover:text-primary hover:bg-white border border-primary py-2"
                    >
                        <img src={IMAGES.add} alt="" className="bg-primary" />
                        Post
                    </a>
                </div> */}
            </div>
            <div className="space-y-6" >
                <div className="grid grid-cols-1">
                    {posts?.result?.map((post: any) => (
                        <Post
                            key={post?._id}
                            postDetails={post}
                            dropDownref={dropDownref}
                            openRowId={openRowId}
                            setOpenRowId={setOpenRowId}
                            isAdmin ={true}
                        />
                    ))}
                </div>
            </div>
            {/* <div className="flex justify-between mt-4">
          <button onClick={handlePreviousPage} disabled={currentPage === 1} className="bg-gray-300 p-2 rounded">
            Previous
          </button>
          <span>Page {currentPage} of {totalPages}</span>
          <button onClick={handleNextPage} disabled={currentPage === totalPages} className="bg-gray-300 p-2 rounded">
            Next
          </button>
        </div> */}
        </div>
    </div>
}

export default PostsFromTenant;