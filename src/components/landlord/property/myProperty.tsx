import React, { useEffect, useMemo, useState } from "react";
import { IMAGES } from "../../../assets/index";
import MyProperty from "../../ChildComponent/Common/MyProperty";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getProperty } from "../../../actions/property";
import Pagination from "../../tables/pagination";

const myProperty = () => {
  const dropDownref = React.useRef<{ [key: string]: HTMLDivElement | null }>(
    {},
  );
  const [openRowId, setOpenRowId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [list, setList] = useState<any[]>([]);
  const [lengthPerPage] = useState(10);
  // const [currPage, setCurrPage] = useState(1);
  const [page, setPage] = useState<number>(1);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const { data, isLoading } = useQuery({
    queryKey: ["property", page],
    queryFn: () => getProperty(page, lengthPerPage),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    setList(data?.result || []);
  }, [data]);

  const pageInfo = useMemo(() => isLoading ? {
      "totalItems": 0,
      "totalPages": 0,
      "currentPage": 1,
      "limit": "10"
    } : data?.pagination ?? {
      "totalItems": 0,
      "totalPages": 0,
      "currentPage": 1,
      "limit": "10"
    }, [data])

  return (
    <div className="common-container">
      <div className="w-full mx-auto flex flex-col gap-4">
        <div className="flex justify-between">
          <div className="flex items-center justify-between mb-6 rounded-lg">
            <p className="text-xl font-normal">
              {pageInfo?.totalItems ?? "No"} Properties
            </p>
          </div>
          <div className="flex border rounded-lg py-2">
            <Link
              to="/property/create"
              className="bg-primary px-6 font-bold text-sm flex items-center gap-2 rounded-3xl text-white hover:text-primary hover:bg-white border border-primary py-2"
            >
              Add New Property
            </Link>
          </div>
        </div>
        {isLoading || list.length > 0 ? (
          <div className="max-h-[60vh] 2xl:max-h-[65dvh] overflow-y-auto thin-scrollbar pr-3">
            <div className="grid grid-cols-1">
              {isLoading ||
                (list.length > 0 &&
                  list.map((property: any, index: number) => (
                    <MyProperty
                      key={property?._id}
                      id={property?._id || ""}
                      property={property}
                      dropDownref={dropDownref}
                      openRowId={openRowId}
                      setOpenRowId={setOpenRowId}
                    />
                  )))}
              {!!pageInfo?.totalPages && <Pagination pageInfo={pageInfo} setPage={setPage} />}

            </div>
          </div>
        ) : (
          <div className="flex justify-center items-center mt-10">
            <div className="flex justify-center items-center flex-col">
              <img
                src={IMAGES.error}
                alt="No Properties"
                className="mb-4 w-[50%]"
              />
              <p className="text-2xl">
                As of now, no properties have been added by you. We encourage
                you to add your property
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default myProperty;
