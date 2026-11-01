import React, { useEffect, useState } from "react";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge"; // Recommended for the Support Type tag
import { Controller, useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getMyIssues, sendFeedback } from "../../actions/helpCentreApis";
import { toast } from "../../custom-hooks/use-toast";
import { dateFormat } from "../../lib/utils";

// 1. Define Types to match your DB/Admin panel
interface IssueAction {
    action_type: string;
    actor_role: 'customer' | 'admin' | 'agent' | 'system';
    message: string;
    timestamp: string;
}

interface SupportTicket {
    id: number | string;
    support_type: "technical" | "booking-scheduling" | "payment" | "Misleading-report";
    issue_desc: string;
    status: string;
    created_at: string;
    issue_actions: IssueAction[];
}

const queryData: SupportTicket[] = [
    {
        id: 1,
        support_type: "technical",
        issue_desc: "I cannot access the booking calendar on my mobile device.",
        status: "resolved",
        created_at: "28 Aug 2025 | 15:35",
        issue_actions: [
            {
                action_type: "comment",
                actor_role: "agent",
                message: "We've cleared the cache on our end. Please try again.",
                timestamp: "28 Aug 2025 | 16:00"
            }
        ]
    }
];


// const queryData = [
//     {
//         id: 1,
//         Type: "Technical Issue",
//         question: "Young professional seeking a modern 2-bedroom apartment in downtown area. Prefer high-rise buildings with city views and modern amenities.",
//         answer:
//             "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
//         postedOn: "28 Aug 2025 | 15:35",
//         replyOn: "28 Aug 2025 | 15:35",
//     },
//     {
//         id: 2,
//         Type: "Technical Issue",
//         question: "Young professional seeking a modern 2-bedroom apartment in downtown area. Prefer high-rise buildings with city views and modern amenities.",
//         answer:
//             "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
//         postedOn: "28 Aug 2025 | 15:35",
//         replyOn: "28 Aug 2025 | 15:35",
//     },
//     {
//         id: 3,
//         Type: "Technical Issue",
//         question: "Young professional seeking a modern 2-bedroom apartment in downtown area. Prefer high-rise buildings with city views and modern amenities.",
//         answer:
//             "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
//         postedOn: "28 Aug 2025 | 15:35",
//         replyOn: "28 Aug 2025 | 15:35",
//     }
// ];

const supportTypeData = [
    {
        _id: 1,
        name: "Technical Issue",
    },
    {
        _id: 2,
        name: "Subscription Issue",
    },
    {
        _id: 3,
        name: "General Issue",
    },
];

interface SupportFormValues {
    support_type: "TECHNICAL" | "BOOKING" | "PAYMENT" | "REPORT";
    priority: "LOW" | "MEDIUM" | "HIGH";
    issue_desc: string;
}


const HelpCenter = () => {
    const { register, handleSubmit, control, formState: { errors }, reset } = useForm<SupportFormValues>({
        defaultValues: {
            priority: "HIGH", // Default as per your requirement
        }
    });
    const queryClient = useQueryClient();

    const sendMutation = useMutation({
        mutationFn: (data: any) => sendFeedback(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["myIssues"] });
            toast({
                title: "Feedback Message sent",
                description: "We'll get back to you soon.",
                variant: "success",
            });
            reset();
        },
        onError: (error: any) => {
            console.error("Form submission error:", error);
            toast({
                title: "Uh oh! Something went wrong.",
                description: error?.response?.data?.message || "Please try again.",
                variant: "destructive",
            });
        },
    });

    const onSubmit = (data: SupportFormValues) => {
        console.log("Form Data:", data);
        sendMutation.mutate(data);
    };

    const {
        data: issues,
        isLoading,
        isError,
        error
    } = useQuery({
        queryKey: ["myIssues"],
        queryFn: getMyIssues,
    });
// console.log(issues, "<---issues")
    if (isLoading) return <div>Loading your issues...</div>;
    if (isError) return <div>Error: {error.message}</div>;

    return (
        <div className="common-container bg-white rounded-2xl border-accent shadow-md">
            <div className="w-full mx-auto flex flex-col gap-5">
                <div className="p-6 flex gap-6">
                    <div className="w-2/3 flex flex-col gap-6">
                        {/* {queryData.map((query, index) => (
                            <div className="flex flex-col gap-4">
                                <div className="border p-3 rounded-lg border-border">
                                    <h4 className="text-xl font-semibold mb-2">{query.Type}</h4>
                                    <p className="text-muted-foreground text-sm">
                                        {query.question}
                                    </p>
                                    <p>
                                        <span className="text-muted-foreground text-sm">Posted On : </span>
                                        <span className="text-card-foreground text-base font-semibold">{query.postedOn}</span>
                                    </p>
                                    <hr className="my-2" />
                                    <p className="text-xs text-primary font-semibold">
                                        <span>Reply On : </span>
                                        <span>{query.replyOn}</span>
                                    </p>
                                    <p className="text-muted-foreground text-sm">
                                        {query.answer}
                                    </p>
                                </div>
                            </div>
                        ))} */}

                        {/* {issues?.result?.map((ticket:any, index:any) => (
                            <div key={ticket.id} className="flex flex-col gap-4">
                                <div className="border p-3 rounded-lg border-border">
                                    <h4 className="text-xl font-semibold mb-2">{ticket.issue_desc}</h4>
                                    <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-700 px-2 py-1 rounded-md">
                                        {ticket.support_type.replace('-', ' ')}
                                    </span>
                                    <p>
                                        <span className="text-muted-foreground text-sm mt-2">Posted On : </span>
                                        <span className="text-card-foreground text-base font-semibold">{ticket.created_at}</span>
                                    </p>
                                    <hr className="my-2" />
                                    {ticket.issue_actions.map((action:any) => (
                                        <div>
                                            <p className="text-xs text-primary font-semibold">
                                                <span>Admin Response : </span>
                                                <span>{action.timestamp}</span>
                                            </p>
                                            <p className="text-muted-foreground text-sm">
                                                {action.message}
                                            </p>
                                        </div>))}
                                </div>
                            </div>
                        ))} */}

                        {/* Better UI  */}
                        {issues?.result?.map((ticket:any, index:number) => (
                            <div key={index} className="border p-5 rounded-xl border-slate-200 bg-slate-50/30">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-700 px-2 py-1 rounded-md">
                                            {ticket.support_type.replace('-', ' ')}
                                        </span>
                                        <h4 className="text-lg font-semibold mt-2 text-slate-900">{ticket.issue_desc}</h4>
                                    </div>
                                    <div className="flex flex-col text-right">
                                        <p className="text-xs text-slate-500">Posted On</p>
                                        <p className="text-sm font-medium">{dateFormat(ticket?.createdAt)}</p>
                                    </div>
                                </div>

                                <div className="space-y-4 mt-4">
                                    {ticket.issue_actions.map((action:any, idx:any) => (
                                        <div key={idx} className="bg-white border border-slate-100 p-4 rounded-lg shadow-sm">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className={`text-xs font-bold ${(action.actor_role === 'admin' || action.actor_role === 'agent') ? 'text-primary' : 'text-slate-600'}`}>
                                                    {(action.actor_role === 'admin' || action.actor_role === 'agent') ? "Admin Response" : "My Follow-up"}
                                                </span>
                                                <span className="text-[10px] text-slate-400">{dateFormat(action.timestamp)}</span>
                                            </div>
                                            <p className="text-sm text-slate-700 leading-relaxed">
                                                {action.message}
                                            </p>
                                        </div>
                                    ))}
                                </div>

                                {ticket.issue_actions.length === 0 && (
                                    <p className="text-xs text-slate-400 italic">Waiting for an agent to review your request...</p>
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="w-1/3 bg-accent rounded-2xl">
                        <form onSubmit={handleSubmit(onSubmit)} className="w-full rounded-lg px-6 py-8 flex flex-col gap-7">

                            {/* Support Type Select */}
                            <div className="flex flex-col gap-2.5">
                                <Label>Support Type <span className="text-destructive">*</span></Label>
                                <Controller
                                    name="support_type"
                                    control={control}
                                    rules={{ required: "Please select a support type" }}
                                    render={({ field }) => (
                                        <Select onValueChange={field.onChange} value={field.value ?? ""}>
                                            <SelectTrigger className="w-full h-12 bg-white shadow-none">
                                                <SelectValue placeholder="Select support type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="TECHNICAL">Technical</SelectItem>
                                                <SelectItem value="BOOKING">Booking</SelectItem>
                                                <SelectItem value="PAYMENT">Payment</SelectItem>
                                                <SelectItem value="REPORT">Report</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                {errors.support_type && <span className="text-red-500 text-sm">{errors.support_type.message}</span>}
                            </div>

                            {/* Issue Description */}
                            <div className="flex flex-col gap-2.5">
                                <Label>Your Issue <span className="text-destructive">*</span></Label>
                                <Textarea
                                    {...register("issue_desc", { required: "Description is required" })}
                                    placeholder="Write about your issue"
                                    className="h-30"
                                />
                                {errors.issue_desc && <span className="text-red-500 text-sm">{errors.issue_desc.message}</span>}
                            </div>

                            {/* Hidden or Default Priority (Implicitly HIGH as per your JSON) */}
                            <input type="hidden" {...register("priority")} />

                            <div className="flex gap-4 items-center justify-center mt-4">
                                {/* <Button type="submit" className="rounded-full" variant="secondary">
                                    Post Your Query
                                </Button> */}
                                <Button
                                    type="submit"
                                    className="rounded-full"
                                    variant={"secondary"}
                                    disabled={sendMutation.isPending} // Disable while loading
                                >
                                    {sendMutation.isPending ? "Sending..." : "Post Your Query"}
                                </Button>
                            </div>
                        </form>
                        <div className="rounded-lg mx-6 px-6 my-6 py-8 flex flex-col gap-2 bg-white shadow-md">
                            <h4 className="text-lg font-semibold">Contact Us</h4>
                            <p className="text-base text-muted-foreground">
                                We're here to support you! Check out our help centre for further assistance.
                            </p>
                            <div className="flex gap-4 items-center justify-center mt-4">
                                {/* <Button
                                    className="rounded-full"
                                    variant={"secondary"}>Visit Help Center</Button> */}
                            </div>
                            <p className="text-lg text-primary-foreground font-semibold mt-6">
                                You Can Also Email
                            </p>
                            <p className="text-sm text-primary-foreground">support@rentmatch.com</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default HelpCenter;
