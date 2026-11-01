import React from "react";
import ContactList from "./contactList";
import ChatWindow from "./chatWindow";
import { useQuery } from "@tanstack/react-query";
import { getChatList } from "../../actions/chatApis";
// import { SocketProvider } from "../../context/SocketContext";
import { SearchX } from "lucide-react";

const MessagePage = () => {
  const [selectedForChat, setSelectedForChat] = React.useState(null);
  // Mobile only: whether the chat pane (vs. the contact list) is shown
  const [mobileChatOpen, setMobileChatOpen] = React.useState(false);
  const { data: chatContacts, isLoading } = useQuery({
    queryKey: ["chat-list", selectedForChat],
    queryFn: () => getChatList(),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 2,
  });

  // console.log(chatContacts, "<---data");
  React.useEffect(() => {
    if (chatContacts?.data?.length > 0 && !selectedForChat) {
      setSelectedForChat(chatContacts.data[0]);
    }
  }, [chatContacts, selectedForChat]);

  if (isLoading) {
    return <div className="flex min-h-[450px] w-full flex-col items-center justify-center rounded-xl border border-gray-100 bg-white p-12 shadow-sm animate-pulse">

      {/* Skeleton Icon Circle */}
      <div className="mb-6 h-24 w-24 rounded-full bg-gray-200"></div>

      {/* Skeleton Text - Headline */}
      <div className="h-8 w-48 rounded-md bg-gray-200 mb-3"></div>

      {/* Skeleton Text - Subtext Lines */}
      <div className="space-y-2 flex flex-col items-center">
        <div className="h-4 w-64 rounded bg-gray-100"></div>
        <div className="h-4 w-52 rounded bg-gray-100"></div>
      </div>

      {/* Skeleton Buttons */}
      <div className="mt-8 flex gap-3">
        {/* Primary Button Placeholder (Your theme color at low opacity) */}
        <div className="h-11 w-32 rounded-lg bg-primary/20"></div>

        {/* Secondary Button Placeholder */}
        <div className="h-11 w-32 rounded-lg bg-gray-100"></div>
      </div>
    </div>;
  }
  return (
    <>
      {!isLoading && selectedForChat !== null ? (
        <div className="flex gap-4 h-[calc(100dvh-154px)]">
          <ContactList
            selectedForChat={selectedForChat}
            setSelectedForChat={(contact: any) => {
              setSelectedForChat(contact);
              setMobileChatOpen(true);
            }}
            contacts={chatContacts?.data || []}
            hideOnMobile={mobileChatOpen}
          />
          <ChatWindow
            selectedForChat={selectedForChat}
            showOnMobile={mobileChatOpen}
            onBack={() => setMobileChatOpen(false)}
          />
        </div>
      ) : (
        <div className="flex min-h-[450px] w-full flex-col items-center justify-center rounded-xl border border-gray-100 bg-white p-12 shadow-sm">
          {/* Icon Container */}
          <div className="relative mb-6">
            <div className="absolute inset-0 animate-ping rounded-full bg-primary opacity-20"></div>
            <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-primary/10">
              <SearchX size={48} className="text-primary" strokeWidth={1.5} />
            </div>
          </div>

          {/* Message */}
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-800 tracking-tight">
              No Results Found
            </h3>
            {/* <p className="mt-2 max-w-sm text-gray-500 leading-relaxed">
          We looked everywhere, but couldn't find what you're searching for. 
          Try updating your keywords or filters.
        </p> */}
          </div>

          {/* Actions */}
          {/* <div className="mt-8 flex gap-3">
        <button 
          // onClick={onRetry}
          className="rounded-lg bg-primary px-8 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-[#284183] hover:shadow-lg active:scale-95"
        >
          Reset Filters
        </button>
        
        <button 
          className="rounded-lg border border-gray-200 bg-white px-8 py-3 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-50"
        >
          Contact Support
        </button>
      </div> */}
        </div>
      )}
    </>
  );
};

export default MessagePage;
