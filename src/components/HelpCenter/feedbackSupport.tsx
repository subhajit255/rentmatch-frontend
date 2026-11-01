import React, { useState } from 'react';
import { getMyIssues, updateFeedback, updateFeedbackStatus } from '../../actions/helpCentreApis';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from '../../custom-hooks/use-toast';

type SupportType = 'technical' | 'booking-scheduling' | 'payment' | 'Misleading-report';
type StatusType = 'open' | 'in-progress' | 'resolved' | 'closed';
type ActorRole = 'customer' | 'agent' | 'system' | 'admin';

interface IssueAction {
  action_type: 'comment' | 'status_change' | 'internal_note';
  actor_role: ActorRole;
  message: string;
  timestamp: string;
  new_status?: StatusType;
  attachments?: string[];
}

interface SupportTicket {
  _id: string;
  user_id: string;
  ticket_number: string;
  support_type: SupportType;
  status: StatusType;
  priority: 'low' | 'medium' | 'high';
  issue_desc: string;
  issue_actions: IssueAction[];
  createdAt: string;
}

const AdminSupportPanel: React.FC = () => {
  const queryClient = useQueryClient();

  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [reply, setReply] = useState<string>("");

  // Helper for Badge Colors
  const getBadgeColor = (type: SupportType): string => {
    const colors: Record<SupportType, string> = {
      technical: "bg-blue-100 text-blue-700",
      "booking-scheduling": "bg-purple-100 text-purple-700",
      payment: "bg-green-100 text-green-700",
      "Misleading-report": "bg-red-100 text-red-700",
    };
    return colors[type] || "bg-gray-100 text-gray-700";
  };

  type TicketStatus = "OPEN" | "IN-PROGRESS" | "RESOLVED" | "CLOSED";

  const getStatusBadgeColor = (status: TicketStatus): string => {
    const colors: Record<TicketStatus, string> = {
      "OPEN": "bg-blue-100 text-blue-700",           // Info/New
      "IN-PROGRESS": "bg-yellow-100 text-yellow-700", // Warning/Action
      "RESOLVED": "bg-green-100 text-green-700",      // Success
      "CLOSED": "bg-gray-100 text-gray-700",          // Neutral/Done
    };

    return colors[status] || "bg-gray-100 text-gray-700";
  };


  const {
    data: issues,
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ["my-issues"],
    queryFn: getMyIssues,
  });

  // Update selectedTicket when issues data changes (important for initial load + refetch)
  React.useEffect(() => {
    if (selectedTicket && issues?.result) {
      const updatedTicket = issues.result.find(
        (t: SupportTicket) => t._id === selectedTicket._id
      );
      if (updatedTicket) {
        setSelectedTicket(updatedTicket);
      }
    }
  }, [issues?.result, selectedTicket?._id]);

  const updateMutation = useMutation({
    mutationFn: (payload: any) => updateFeedback(selectedTicket?._id || "", payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["my-issues"] });
      toast({ title: "Feedback response sent successfully" });
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

  const SendFeedbackMessage = () => {
    if (!selectedTicket || !reply.trim()) return;

    const newMessage: IssueAction = {
      action_type: "comment",
      actor_role: "admin",
      message: reply.trim(),
      timestamp: new Date().toISOString()
    };

    // Optimistic Update - Immediately show the message in UI
    const updatedTicket: SupportTicket = {
      ...selectedTicket,
      issue_actions: [...selectedTicket.issue_actions, newMessage],
      status: "in-progress" as StatusType, // Auto update status
    };

    setSelectedTicket(updatedTicket);
    setReply("");

    // Prepare payload for backend
    const payload = {
      support_type: selectedTicket.support_type,
      priority: selectedTicket.priority,
      issue_desc: selectedTicket.issue_desc,
      issue_actions: [...selectedTicket.issue_actions, newMessage],
      status: "in-progress",
    };

    updateMutation.mutate(payload);
  };

  const statusMutation = useMutation({
    mutationFn: (newStatus: string) =>
      updateFeedbackStatus(selectedTicket?._id || "", { status: newStatus }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["my-issues"] });
      if (data?.result) {
        setSelectedTicket(data.result);
      }
      toast({
        title: `Status updated to ${data?.result?.status?.toUpperCase()}`,
        description: "The customer will be notified of this change.",
        variant: "success",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Update failed",
        description: error?.response?.data?.message || "Could not change status",
        variant: "destructive",
      });
    }
  });

  if (isLoading) return <div className="p-8">Loading issues...</div>;
  if (isError) return <div className="p-8 text-red-600">Error: {error?.message}</div>;

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900">
      {/* Sidebar */}
      <aside className="w-80 border-r bg-white flex flex-col">
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold tracking-tight">Admin Support</h1>
          <p className="text-xs text-slate-500 uppercase font-semibold mt-1">Incoming Issues</p>
        </div>

        <div className="flex-1 overflow-y-auto">
          {issues?.result?.map((ticket: SupportTicket) => (
            <button
              key={ticket._id}
              onClick={() => setSelectedTicket(ticket)}
              className={`w-full text-left p-4 border-b transition-colors hover:bg-slate-50 ${selectedTicket?._id === ticket._id ? 'bg-blue-50 border-l-4 border-blue-600' : ''
                }`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${getBadgeColor(ticket.support_type)}`}>
                  {ticket.support_type.replace('-', ' ')}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">{ticket.ticket_number}</span>
              </div>
              <p className="text-sm font-semibold truncate mb-1">{ticket.issue_desc}</p>
              <div className="flex justify-between items-center text-[11px] text-slate-500">
                <span>Status: {ticket.status}</span>
                <span>{new Date(ticket.createdAt).toLocaleDateString()} </span>
              </div>
            </button>
          ))}
        </div>
      </aside>

      {/* Main Detail View */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {selectedTicket ? (
          <>
            {/* Header */}
            <header className="bg-white p-6 border-b shadow-sm z-10">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-bold">Issue Details: {selectedTicket.ticket_number}</h2>
                  <p className="text-slate-600 text-sm mt-1">{selectedTicket.issue_desc}</p>
                </div>
                {/* <div className="flex gap-2">
                  <select
                    className="text-xs border rounded px-3 py-1.5 bg-white outline-none cursor-pointer focus:ring-2 focus:ring-blue-500"
                    value={selectedTicket.status.toUpperCase()}
                    disabled={statusMutation.isPending}
                    onChange={(e) => statusMutation.mutate(e.target.value)}
                  >
                    <option value="OPEN">OPEN</option>
                    <option value="IN-PROGRESS">IN-PROGRESS</option>
                    <option value="RESOLVED">RESOLVED</option>
                    <option value="CLOSED">CLOSED</option>
                  </select>
                </div> */}
                <div className="flex gap-2 items-center">
                  <div className="relative group">
                    <select
                      className={`
      appearance-none text-xs font-bold uppercase tracking-wider border rounded-full px-4 py-1.5 pr-8 
      cursor-pointer outline-none transition-all duration-200
      hover:brightness-95 focus:ring-4 focus:ring-blue-500/10
      disabled:opacity-50 disabled:cursor-not-allowed
      ${getStatusBadgeColor(selectedTicket.status.toUpperCase() as any)}
    `}
                      value={selectedTicket.status.toUpperCase()}
                      disabled={statusMutation.isPending}
                      onChange={(e) => statusMutation.mutate(e.target.value)}
                    >
                      <option value="OPEN" className="bg-white text-slate-900">OPEN</option>
                      <option value="IN-PROGRESS" className="bg-white text-slate-900">IN-PROGRESS</option>
                      <option value="RESOLVED" className="bg-white text-slate-900">RESOLVED</option>
                      <option value="CLOSED" className="bg-white text-slate-900">CLOSED</option>
                    </select>

                    {/* <select
                      className="appearance-none text-xs font-medium border border-slate-200 rounded-lg px-4 py-2 pr-9 bg-white 
                 text-slate-700 cursor-pointer outline-none transition-all duration-200
                 hover:border-blue-400 hover:bg-slate-50
                 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 
                 disabled:opacity-50 disabled:cursor-not-allowed"
                      value={selectedTicket.status.toUpperCase()}
                      disabled={statusMutation.isPending}
                      onChange={(e) => statusMutation.mutate(e.target.value)}
                    >
                      <option value="OPEN">OPEN</option>
                      <option value="IN-PROGRESS">IN-PROGRESS</option>
                      <option value="RESOLVED">RESOLVED</option>
                      <option value="CLOSED">CLOSED</option>
                    </select> */}

                    {/* Custom Chevron Icon */}
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400 group-hover:text-blue-500">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

              </div>
            </header>

            {/* Conversation Timeline */}
            <section className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50">
              {selectedTicket.issue_actions.length > 0 ? (
                selectedTicket.issue_actions.map((action, idx) => (
                  <div
                    key={idx}
                    className={`flex flex-col ${action.actor_role === 'customer' ? 'items-start' : 'items-end'}`}
                  >
                    <div className={`max-w-md p-4 rounded-2xl shadow-sm border ${action.actor_role === 'customer'
                      ? 'bg-white text-slate-800 rounded-tl-none'
                      : 'bg-blue-600 text-white rounded-tr-none border-blue-600'
                      }`}>
                      <p className="text-xs font-bold mb-1 opacity-70 italic">
                        {action.actor_role === 'admin' ? 'You (Admin)' : action.actor_role}
                      </p>
                      <p className="text-sm leading-relaxed">{action.message}</p>
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest">
                      {new Date(action.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center text-slate-400 mt-20 italic">
                  No activity yet. Send a reply to start the conversation.
                </div>
              )}
            </section>

            {/* Input Area */}
            <footer className="p-4 bg-white border-t">
              <div className="max-w-4xl mx-auto flex gap-2">
                <textarea
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  className="flex-1 border rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none transition-all"
                  placeholder="Type your reply to the customer..."
                  rows={2}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      SendFeedbackMessage();
                    }
                  }}
                />
                <button
                  disabled={!reply.trim() || updateMutation.isPending}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white px-6 rounded-xl text-sm font-bold transition-all flex items-center justify-center min-w-[80px]"
                  onClick={SendFeedbackMessage}
                >
                  {updateMutation.isPending ? "Sending..." : "Send"}
                </button>
              </div>
            </footer>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 space-y-2">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            <p className="text-sm">Select a ticket from the left to view details</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminSupportPanel;