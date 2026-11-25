import React, { useEffect, useMemo, useState } from "react";
import { IMAGES } from "../../../assets/index";
import MyProperty from "../../ChildComponent/Common/MyProperty";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getProperty } from "../../../actions/property";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../../ui/button";

const myProperty = () => {
  const dropDownref = React.useRef<{ [key: string]: HTMLDivElement | null }>(
    {},
  );
  const [openRowId, setOpenRowId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [list, setList] = useState<any[]>([]);
  const [lengthPerPage] = useState(10);
  const [page, setPage] = useState<number>(1);

  const { data, isLoading } = useQuery({
    queryKey: ["property", page],
    queryFn: () => getProperty(page, lengthPerPage),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    setList(data?.result || []);
  }, [data]);

  const pageInfo = useMemo(
    () =>
      isLoading
        ? {
            totalItems: 0,
            totalPages: 1,
            currentPage: 1,
            limit: "10",
          }
        : data?.pagination ?? {
            totalItems: 0,
            totalPages: 1,
            currentPage: 1,
            limit: "10",
          },
    [data, isLoading],
  );

  const currentPage = Number(pageInfo?.currentPage || page || 1);
  const totalPages = Math.max(1, Number(pageInfo?.totalPages || 1));

  return (
    <div className="common-container min-h-[calc(100vh-140px)] flex flex-col justify-between pb-6">
      <div className="w-full flex-1 flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-xl font-normal text-slate-800">
            {pageInfo?.totalItems ?? 0} Properties
          </p>
          <Link
            to="/property/create"
            className="bg-primary px-6 font-bold text-sm flex items-center gap-2 rounded-full text-white hover:bg-primary/95 shadow-sm transition-all py-2"
          >
            Add New Property
          </Link>
        </div>

        {/* Property List / Empty state */}
        {isLoading || list.length > 0 ? (
          <div className="flex-1 flex flex-col">
            <div className="grid grid-cols-1">
              {isLoading
                ? Array.from({ length: 3 }).map((_, idx) => (
                    <div
                      key={idx}
                      className="h-28 bg-slate-100 animate-pulse rounded-2xl mb-3"
                    />
                  ))
                : list.map((property: any) => (
                    <MyProperty
                      key={property?._id}
                      id={property?._id || ""}
                      property={property}
                      dropDownref={dropDownref}
                      openRowId={openRowId}
                      setOpenRowId={setOpenRowId}
                    />
                  ))}
            </div>
          </div>
        ) : (
          <div className="flex justify-center items-center my-auto py-12">
            <div className="flex justify-center items-center flex-col text-center">
              <img
                src={IMAGES.error}
                alt="No Properties"
                className="mb-4 w-48 sm:w-64 opacity-80"
              />
              <p className="text-xl text-slate-700">
                As of now, no properties have been added by you. We encourage
                you to add your property.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Pagination Controls - Always docked at bottom of page, styled like Tenant page */}
      {totalPages > 0 && (
        <div className="mt-auto pt-6 border-t border-slate-100 flex items-center justify-between w-full">
          <div className="w-28 flex justify-start">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => setPage((p: number) => Math.max(1, p - 1))}
              className="rounded-full border-slate-200 hover:border-slate-300 font-semibold text-xs text-slate-700 px-4 py-1.5 h-9 transition-all flex items-center gap-1.5 shadow-2xs bg-white disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              Prev
            </Button>
          </div>

          <span className="text-xs sm:text-sm font-medium text-slate-600 bg-slate-100/90 border border-slate-200/60 px-4 py-1.5 rounded-full shadow-2xs">
            Page <span className="text-slate-900 font-bold">{currentPage}</span> of{" "}
            <span className="text-slate-900 font-bold">{totalPages}</span>
          </span>

          <div className="w-28 flex justify-end">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => setPage((p: number) => Math.min(totalPages, p + 1))}
              className="rounded-full border-slate-200 hover:border-slate-300 font-semibold text-xs text-slate-700 px-4 py-1.5 h-9 transition-all flex items-center gap-1.5 shadow-2xs bg-white disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default myProperty;
