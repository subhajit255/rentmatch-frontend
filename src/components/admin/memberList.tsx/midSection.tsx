import React, { useMemo } from "react";
import Icon from "../../icons/icon";
import { Button } from "../../ui/button";
import { MemberDetailType } from "@/src/types/memberTypes";
import { dateFormat } from "../../../lib/utils";
import { IMAGES } from "../../../assets/index";


const MemberDetailsMid = ({ data, isLoading }: { data: MemberDetailType, isLoading: boolean }) => {
    // const memberData =  !isLoading ? defaultData : (data?.result ?? {...defaultData})
    const {
        first_name, 
        middle_name, 
        last_name, 
        email, 
        phone_number,
        role,
        gender,
        is_subscribe,
        member_id,
        updatedAt,
        date
    } = data;

    return <div className="w-1/5 flex flex-col rounded-md border p-2 gap-4 font-sans bg-white">
        <Button variant="outline" className="w-fit px-3 border-0 bg-transparent text-foreground rounded-full p-2 cursor-pointer hover:bg-transparent focus:ring-0 focus:ring-offset-0" onClick={() => window.history.back()}>
            <Icon name="ArrowLeft" className="mx-1" />
        </Button>
        <div className="flex flex-col gap-5 items-center">
            <div className="w-20 h-20 rounded-full">
                <img
                src={IMAGES.user_img}
                //  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZmlsZSUyMHBpY3R1cmV8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60"
                  alt="profile" className="w-full h-full rounded-full object-cover" />
            </div>
            <div className="flex flex-col gap-2 text-center">
                <h3 className="font-bold text-lg text-foreground">
                    {`${first_name ?? ""} ${middle_name ?? ""} ${last_name ?? ""}`}
                </h3>
                <p className="font-medium text-base text-primary">{role ?? ""}</p>
                <span className="font-medium text-sm text-muted-foreground flex items-center gap-1 text-center justify-center">
                    <span>{member_id}</span>
                    <Icon name="Copy" className="w-4 h-4" />
                </span>
                <span className="font-medium text-sm text-muted-foreground flex items-center gap-1 text-center justify-center">
                    <Icon name="Copy" className="w-4 h-4" />
                    <span>{gender}</span>
                </span>
            </div>
        </div>
        <div className="">
            <ul>
                <li className="flex flex-col justify-center items-center py-3 gap-1 border-t-2 border-black/10">
                    <span className="font-medium text-sm text-muted-foreground">Email Id</span>
                    <p className="font-medium text-sm text-black">{email}</p>
                </li>
                <li className="flex flex-col justify-center items-center py-3 gap-1 border-t-2 border-black/10">
                    <span className="font-medium text-sm text-muted-foreground">Status</span>
                    <p className="font-medium text-sm text-active">{is_subscribe ? "Active" : "Inactive"}</p>
                </li>
                <li className="flex flex-col justify-center items-center py-3 gap-1 border-t-2 border-black/10">
                    <span className="font-medium text-sm text-muted-foreground">Created Date & Time</span>
                    <p className="font-medium text-sm text-black">{dateFormat(date)}</p>
                </li>
                <li className="flex flex-col justify-center items-center py-3 gap-1 border-t-2 border-black/10">
                    <span className="font-medium text-sm text-muted-foreground">Phone Number</span>
                    <p className="font-medium text-sm text-black">{phone_number}</p>
                </li>
                <li className="flex flex-col justify-center items-center py-3 gap-1 border-t-2 border-black/10">
                    <span className="font-medium text-sm text-muted-foreground">Last Update & Activity</span>
                    <p className="font-medium text-sm text-primary">{dateFormat(updatedAt)}</p>
                </li>
                <li className="flex flex-col justify-center items-center py-3 gap-1 border-t-2 border-black/10">
                    <span className="font-medium text-sm text-muted-foreground">Location</span>
                    <p className="font-medium text-sm text-black"></p>
                </li>
            </ul>

        </div>

    </div>
}

export default MemberDetailsMid;