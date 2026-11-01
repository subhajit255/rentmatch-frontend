import React, { useEffect, useRef, useState } from "react";
import { getCoreRowModel, getFilteredRowModel, getPaginationRowModel, useReactTable } from "@tanstack/react-table";
import Icon from "../../icons/icon"
import CommonTable from "../../tables/commonTable";
import { Button } from "../../ui/button"
import { Input } from "../../ui/input"
import { useNavigate } from "react-router-dom";
import { getProtoTypeColumns } from "../../tables/getPtotoTypeCol";
import { useQuery } from "@tanstack/react-query";
import { getPropertyTypeList } from "../../../actions/propertyMaster";
import useDebounce from "../../../custom-hooks/debounce";
import { IMAGES } from "../../../assets";
import { useClickOutside } from "../../../custom-hooks/use-clickOutside";
import { useAuth } from "../../../context/AuthContext";
import { useRolePermissionCheck } from "../../../custom-hooks/rolePermissionCheck";

const PropertyTypeAdminIndexPage = () => {
    const navigate = useNavigate();
    const dropDownref = useRef({});
    const [globalFilter, setGlobalFilter] = useState("");
    const [selectedRows, setSelectedRows] = useState<any[]>([]);
    const [openRowId, setOpenRowId] = useState(null);
    const [params, setParams] = useState<{ search?: string }>({});
    const [list, setList] = useState<any[]>([]);

    const { user } = useAuth();
    const { hasPermission } = useRolePermissionCheck();

    const hasPermissionToAdd = user?.role === 'SUPER ADMIN' ||
        (user?.role === 'ADMIN' && hasPermission("Property Types", "add"));

    const hasPermissionToEdit = user?.role === 'SUPER ADMIN' ||
        (user?.role === 'ADMIN' && hasPermission("Property Types", "edit"));

    const hasPermissionToDelete = user?.role === 'SUPER ADMIN' ||
        (user?.role === 'ADMIN' && hasPermission("Property Types", "delete"));

    const { data, isLoading } = useQuery({
        queryKey: ['propertyType', params],
        queryFn: () => getPropertyTypeList(params),
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
    });

    useClickOutside(dropDownref, () => setOpenRowId(null), true, openRowId);
    const columns = getProtoTypeColumns({ setSelectedRows, openRowId, setOpenRowId, dropDownref, hasPermissionToEdit, hasPermissionToDelete }) as any;

    const table = useReactTable({
        data: data?.result || [],
        columns,
        // state: {
        //   globalFilter,
        // },
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        enableRowSelection: true,
    });

    useEffect(() => {
        // console.log("data :->:: ", data);
        setList(data?.result || []);
    }, [data]);

    const debounceSearch = useDebounce(globalFilter, 300);

    useEffect(() => {
        if (debounceSearch === "") {
            setParams((prev) => {
                const { search, ...rest } = prev;
                return rest;
            });
            return;
        }
        setParams((prev) => ({ ...prev, search: debounceSearch }));
    }, [debounceSearch]);

    const handleAddPropertyType = () => {
        // Logic to handle adding a new property type
        // console.log("Add Property Type button clicked");
        navigate(`/property-type/create`);
    };

    // useEffect(() => {
    //     // console.log("data Rows: ", data);
    // }, [data]);

    return <div>
        <div className="flex flex-col gap-8 mb-8">
            <div className="flex items-center justify-between px-4">
                <h1 className="text-lg font-semibold leading-tight text-black">Property Types</h1>
                <div className="flex gap-3 items-center">
                    <div className="relative flex items-center">
                        <Input
                            disabled={!data?.result.length}
                            placeholder={"Search "}
                            value={globalFilter ?? ""}
                            onChange={(e) => setGlobalFilter(e.target.value)}
                            className="w-64 placeholder:text-[14px]/[1.2] placeholder:font-sans placeholder:font-base "
                        />
                        <Icon
                            className="absolute top-1/2 right-3 -translate-y-1/2 w-4 h-4"
                            name="SearchIcon"
                            fill="none"
                        />
                    </div>
                    {
                        hasPermissionToAdd && (
                            <Button variant="secondary" className="h-[45px]" onClick={handleAddPropertyType}>
                                Add Property Type
                            </Button>
                        )
                    }

                </div>
            </div>

            {isLoading || !!data?.result?.length ? <div className="">
                <CommonTable table={table} isLoading={isLoading} />
            </div>
                :
                <div className="flex flex-col gap-5 items-center justify-center h-[50vh]">
                    <div><img src={IMAGES?.logo} alt="image" className="w-32 h-12" /></div>
                    <div className="font-bold text-xl">No Property type found.</div>
                </div>
            }
        </div>
    </div>
}

export default PropertyTypeAdminIndexPage;