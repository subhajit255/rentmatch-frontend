import { getMemberChatDetailsApi } from "@/src/actions/userManagement";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

const ChatDetails = ({ sid, rid }: { sid: string, rid: string }) => {

    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);

    const { data, isLoading } = useQuery({
        queryKey: ['member-schedules', sid],
        queryFn: () => getMemberChatDetailsApi(sid ?? "", rid ?? ""),
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
        enabled: !!sid,
    });
    return <div></div>
}

export default ChatDetails;