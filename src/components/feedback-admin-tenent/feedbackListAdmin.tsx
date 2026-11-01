import React, { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getFeedbackList } from '../../actions/cms/cmsPageApis';
import FeedbackModal from './feedbackForm';
import ReviewCard from './ReviewCard';
import { useAuth } from '../../context/AuthContext';


interface Member {
  _id: string;
  first_name: string;
  last_name: string;
  profile_image: string | null;
}

interface ReviewData {
  _id: string;
  member_id: Member;
  commend: string;
  is_active: boolean;
  rating: number;
  role: string;
  subject: string;
}


function FeedbackListAdmin() {
  const queryClient = useQueryClient();
  const { user } = useAuth();


  const {
    data,
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ["property-rating-feedback"],
    queryFn: getFeedbackList,
  });

  console.log(user?.role, "<----data")

  // // Update selectedTicket when issues data changes (important for initial load + refetch)
  // React.useEffect(() => {
  //   if (selectedTicket && issues?.result) {
  //     const updatedTicket = issues.result.find(
  //       (t: SupportTicket) => t._id === selectedTicket._id
  //     );
  //     if (updatedTicket) {
  //       setSelectedTicket(updatedTicket);
  //     }
  //   }
  // }, [issues?.result, selectedTicket?._id]);

  // const updateMutation = useMutation({
  //   mutationFn: (payload: any) => updateFeedback(selectedTicket?._id || "", payload),
  //   onSuccess: (data) => {
  //     queryClient.invalidateQueries({ queryKey: ["my-issues"] });
  //     toast({ title: "Feedback response sent successfully" });
  //   },
  //   onError: (error: any) => {
  //     console.error("Form submission error:", error);
  //     toast({
  //       title: "Uh oh! Something went wrong.",
  //       description: error?.response?.data?.message || "Please try again.",
  //       variant: "destructive",
  //     });
  //   },
  // });

  // const SendFeedbackMessage = () => {
  //   if (!selectedTicket || !reply.trim()) return;

  //   const newMessage: IssueAction = {
  //     action_type: "comment",
  //     actor_role: "admin",
  //     message: reply.trim(),
  //     timestamp: new Date().toISOString()
  //   };

  //   // Optimistic Update - Immediately show the message in UI
  //   const updatedTicket: SupportTicket = {
  //     ...selectedTicket,
  //     issue_actions: [...selectedTicket.issue_actions, newMessage],
  //     status: "in-progress" as StatusType, // Auto update status
  //   };

  //   setSelectedTicket(updatedTicket);
  //   setReply("");

  //   // Prepare payload for backend
  //   const payload = {
  //     support_type: selectedTicket.support_type,
  //     priority: selectedTicket.priority,
  //     issue_desc: selectedTicket.issue_desc,
  //     issue_actions: [...selectedTicket.issue_actions, newMessage],
  //     status: "in-progress",
  //   };

  //   updateMutation.mutate(payload);
  // };

  // const statusMutation = useMutation({
  //   mutationFn: (newStatus: string) =>
  //     updateFeedbackStatus(selectedTicket?._id || "", { status: newStatus }),
  //   onSuccess: (data) => {
  //     queryClient.invalidateQueries({ queryKey: ["my-issues"] });
  //     if (data?.result) {
  //       setSelectedTicket(data.result);
  //     }
  //     toast({
  //       title: `Status updated to ${data?.result?.status?.toUpperCase()}`,
  //       description: "The customer will be notified of this change.",
  //       variant: "success",
  //     });
  //   },
  //   onError: (error: any) => {
  //     toast({
  //       title: "Update failed",
  //       description: error?.response?.data?.message || "Could not change status",
  //       variant: "destructive",
  //     });
  //   }
  // });

  if (isLoading) return <div className="p-8">Loading issues...</div>;
  if (isError) return <div className="p-8 text-red-600">Error: {error?.message}</div>;
  return (
    <div className="bg-gray-50 min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">Tenent Feedbacks</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.result?.map((item: ReviewData) => (
            <ReviewCard key={item._id} item={item} />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-5">
          {/* Append the Feedback Card at the end */}
          {user?.role !== "SUPER ADMIN" || user?.role !== "SUPER ADMIN" ? <div className="bg-indigo-50 border-2 border-dashed border-indigo-200 rounded-2xl p-6 flex flex-col items-center justify-center text-center">
            <h3 className="text-lg font-bold text-indigo-900 mb-2">Share your experience!</h3>
            <p className="text-indigo-700 text-sm mb-4">Helping others find their perfect home.</p>
            {/* Your Modal Component Trigger */}
            <FeedbackModal />
          </div>: null}
          
        </div>
      </div>
    </div>
  )
}

export default FeedbackListAdmin