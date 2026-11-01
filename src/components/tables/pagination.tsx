import React, { Dispatch, SetStateAction } from "react";
import { Button } from "../ui/button";
import { getPagination } from "./common";
import { cn } from "../lib/utils";

type pageInfoType = {
    totalItems: number,
    totalPages: number,
    currentPage: number,
    limit: string
};

type pageTypes = {
    setPage: Dispatch<SetStateAction<number>>,
    pageInfo: pageInfoType
};

const Pagination = ({ setPage, pageInfo }: pageTypes) => {
    const {
        // totalItems,
        totalPages,
        currentPage,
        // limit
    } = pageInfo;

    return (

        <div className="w-full flex items-center justify-between mb-10">
            <Button
                disabled={currentPage === 1}
                onClick={() => setPage(p => p as number - 1)}
            >
                Prev
            </Button>
            <div className="w-full flex items-center gap-2 justify-center ">
                {getPagination(currentPage, totalPages).map((p, i) =>
                    p === "..." ? (
                        <span key={i} className="px-2">…</span>
                    ) : (
                        <Button
                            key={i}
                            onClick={() => setPage(p as number)}
                            className={`px-3 py-1 rounded ${p === currentPage ? "bg-primary text-white" : "bg-transparent text-primary border-primary"
                                }`}
                        >
                            {p}
                        </Button>
                    )
                )}
            </div>
            <Button
                disabled={currentPage === totalPages}
                onClick={() => setPage(p => p as number + 1)}
            >
                Next
            </Button>
        </div>

    )
}

export default Pagination;