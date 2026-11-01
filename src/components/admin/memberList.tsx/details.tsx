import React from "react";
import MemberDetailsMid from "./midSection";
import { getMemberDetailApi } from "../../../actions/userManagement";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { MemberDetailType } from "@/src/types/memberTypes";
import RightSection from "./rightSection";

const defaultData : MemberDetailType = {
        first_name: "", 
        middle_name: "", 
        last_name: "", 
        email: "", 
        phone_number: "",
        role: "",
        gender: "",
        is_subscribe: true,
        member_id: "",
    };

const MemberDetails = () => {
    const { _id } = useParams();
    const { data, isLoading } = useQuery({
        queryKey: ['member-details', _id],
        queryFn: () => getMemberDetailApi(_id ?? ""),
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
        enabled: !!_id,
    });

    const memberData =  isLoading ? defaultData : (data?.result ?? {...defaultData})
    if (isLoading) {
        return <div>Loading...</div>
    }
    
    return <div className="flex gap-4 my-4">
        <MemberDetailsMid data={memberData} isLoading={isLoading} />
        <RightSection data={memberData} />
    </div>
}

export default MemberDetails;