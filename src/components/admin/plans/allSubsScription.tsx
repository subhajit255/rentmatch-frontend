import React, { useEffect, useRef, useState } from "react";
import { getCoreRowModel, getFilteredRowModel, getPaginationRowModel, useReactTable } from "@tanstack/react-table";
import Icon from "../../icons/icon"
import CommonTable from "../../tables/commonTable";
import { Button } from "../../ui/button"
import { Input } from "../../ui/input"
import { useNavigate } from "react-router-dom";
// import { getProtoTypeColumns } from "../../tables/getPtotoTypeCol";
import { useQuery } from "@tanstack/react-query";
import { getPropertyTypeList } from "../../../actions/propertyMaster";
import useDebounce from "../../../custom-hooks/debounce";
import { IMAGES } from "../../../assets";
import { useClickOutside } from "../../../custom-hooks/use-clickOutside";
import { getAllSubscriptionColumns } from "../../tables/allSubscriptionCo";

const allSubscriptions = [
  {
    "_id": "sub001",
    "name": "John Doe",
    "subscription_id": "S-1001",
    "plan": "Basic",
    "start_date": "2025-01-01",
    "next_billing_date": "2025-02-01",
    "amount": "499",
    "status": "active",
    "is_active": true
  },
  {
    "_id": "sub002",
    "name": "Emma Watson",
    "subscription_id": "S-1002",
    "plan": "Premium",
    "start_date": "2024-12-15",
    "next_billing_date": "2025-01-15",
    "amount": "999",
    "status": "active",
    "is_active": true
  },
  {
    "_id": "sub003",
    "name": "Michael Smith",
    "subscription_id": "S-1003",
    "plan": "Standard",
    "start_date": "2024-11-10",
    "next_billing_date": "2024-12-10",
    "amount": "699",
    "status": "inActive",
    "is_active": false
  },
  {
    "_id": "sub004",
    "name": "Sophia Johnson",
    "subscription_id": "S-1004",
    "plan": "Basic",
    "start_date": "2024-10-05",
    "next_billing_date": "2024-11-05",
    "amount": "499",
    "status": "canceled",
    "is_active": false
  },
  {
    "_id": "sub005",
    "name": "Liam Brown",
    "subscription_id": "S-1005",
    "plan": "Premium",
    "start_date": "2025-01-10",
    "next_billing_date": "2025-02-10",
    "amount": "999",
    "status": "active",
    "is_active": true
  },
  {
    "_id": "sub006",
    "name": "Olivia Wilson",
    "subscription_id": "S-1006",
    "plan": "Standard",
    "start_date": "2024-09-20",
    "next_billing_date": "2024-10-20",
    "amount": "699",
    "status": "inActive",
    "is_active": false
  },
  {
    "_id": "sub007",
    "name": "James Miller",
    "subscription_id": "S-1007",
    "plan": "Premium",
    "start_date": "2024-08-08",
    "next_billing_date": "2024-09-08",
    "amount": "999",
    "status": "canceled",
    "is_active": false
  },
  {
    "_id": "sub008",
    "name": "Ava Davis",
    "subscription_id": "S-1008",
    "plan": "Basic",
    "start_date": "2025-01-20",
    "next_billing_date": "2025-02-20",
    "amount": "499",
    "status": "active",
    "is_active": true
  },
  {
    "_id": "sub009",
    "name": "William Garcia",
    "subscription_id": "S-1009",
    "plan": "Standard",
    "start_date": "2024-12-01",
    "next_billing_date": "2025-01-01",
    "amount": "699",
    "status": "active",
    "is_active": true
  },
  {
    "_id": "sub010",
    "name": "Mia Martinez",
    "subscription_id": "S-1010",
    "plan": "Premium",
    "start_date": "2024-11-25",
    "next_billing_date": "2024-12-25",
    "amount": "999",
    "status": "inActive",
    "is_active": false
  }
]

const AllSubscriptionLists = () => {
    const navigate = useNavigate();
    const dropDownref = useRef({});
    const [globalFilter, setGlobalFilter] = useState("");
    const [selectedRows, setSelectedRows] = useState<any[]>([]);
    const [openRowId, setOpenRowId] = useState(null);
    const [params, setParams] = useState<{ search?: string }>({});
    const [list, setList] = useState<any[]>([]);

    // const { data, isLoading } = useQuery({
    //     queryKey: ['propertyType', params],
    //     queryFn: () => getPropertyTypeList(params),
    //     staleTime: 5 * 60 * 1000,
    //     refetchOnWindowFocus: false,
    // });

    useClickOutside(dropDownref, () => setOpenRowId(null), true, openRowId);
    const columns = getAllSubscriptionColumns({ setSelectedRows, openRowId, setOpenRowId, dropDownref }) as any;

    const table = useReactTable({
        data: allSubscriptions || [],
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

    // useEffect(() => {
    //     // console.log("data :->:: ", data);
    //     setList(data?.result || []);

    // }, [data]);

    const debounceSearch = useDebounce(globalFilter, 300);

    useEffect(() => {

        if (debounceSearch === '') {
            setParams(prev => {
                const { search, ...rest } = prev;
                return rest;
            })
            return
        }
        setParams(prev => ({ ...prev, search: debounceSearch }))
    }, [debounceSearch]);

    // const handleAddPropertyType = () => {
    //     // Logic to handle adding a new property type
    //     // console.log("Add Property Type button clicked");
    //     navigate(`/property-type/create`);
    // };

    // useEffect(() => {
    //     // console.log("data Rows: ", data);
    // }, [data]);

    return <div>
        <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between px-4">
                <h1 className="text-lg font-semibold leading-tight text-black">All Subscriptions</h1>
                <div className="flex gap-3 items-center">
                    <div className="relative flex items-center">
                        <Input
                            disabled={!allSubscriptions.length}
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
                    {/* <Button variant="secondary" className="h-[45px]" onClick={handleAddPropertyType}>
                        Add Property Type
                    </Button> */}
                </div>
            </div>

            {/* {isLoading || !!data?.result?.length ?  */}
            <div className="">
                <CommonTable table={table} isLoading={false} />
            </div>
                {/* :
                <div className="flex flex-col gap-5 items-center justify-center h-[50vh]">
                    <div><img src={IMAGES?.logo} alt="image" className="w-32 h-12" /></div>
                    <div className="font-bold text-xl">No Property type found.</div>
                </div>
            } */}
        </div>
    </div>
}

export default AllSubscriptionLists;