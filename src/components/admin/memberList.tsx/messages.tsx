import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query"; // assuming you're using tanstack query
import { getMemberChatConversation } from "../../../actions/userManagement";

interface User {
    _id: string;
    first_name: string;
    last_name: string;
    role: string;
    email: string;
    // ... other fields
}

interface Message {
    // _id: string;
    // sender: User;
    // receiver: User;
    // content: string;
    // createdAt: string;
    // ... other fields
    lastMessage: string;
    lastMessageTime: string;
    userId: string;
    fullName: string;
    email: string;
    role: string;
    profileImage: string;
}

interface ChatThreadsProps {
    _id: string; // current user / admin ID
    chatData: Message[] | [];
    isLoading: boolean;
    error: any;
}

const ChatThreads = ({ _id, chatData, isLoading, error }: ChatThreadsProps) => {

    const [selectedContact, setSelectedContact] = useState<Message | null>(null)

    const { data: chatMessages, isLoading: isChatLoading } = useQuery({
        queryKey: [
            "member-convo-details",
           _id,
            selectedContact?.userId,
        ],
        queryFn: () =>
            selectedContact &&
            getMemberChatConversation(_id, selectedContact.userId),
        enabled: !!selectedContact,
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
    });
    // console.log(chatMessages, "<--chat msg");

    const handleSelect = (conv: any) => {
        setSelectedContact(conv)
    };

    return (
        <div className="flex gap-4 h-[calc(100vh-154px)]">
            {/* Left – conversation list */}
            <div className="w-1/3 bg-white border-r flex flex-col rounded-md overflow-hidden">
                <div className="flex-1 overflow-y-auto px-1 py-1">
                    {isLoading ? (
                        <div className="text-center py-10 text-gray-500">
                            Loading conversations...
                        </div>
                    ) : error ? (
                        <div className="text-center py-10 text-red-600">
                            Error loading list
                        </div>
                    ) : !chatData?.length ? (
                        <div className="text-center py-12 text-gray-500">
                            No conversations yet
                        </div>
                    ) : (
                        chatData.map((conv:any, index:number) => {
                            const isSelected =
                                selectedContact &&
                                selectedContact.userId === conv.userId;

                            return (
                                <div
                                    key={index}
                                    onClick={() => handleSelect(conv)}
                                    className={`
                    px-4 py-3.5 cursor-pointer 
                    border-b last:border-b-0
                    transition-colors
                    ${isSelected
                                            ? "bg-blue-50 border-l-4 border-blue-500 font-semibold"
                                            : "hover:bg-gray-50 text-gray-800"
                                        }
                  `}
                                >
                                    {conv.fullName}
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* Right – selected conversation messages */}
            <div className="flex-1 flex flex-col bg-gray-50 rounded-md overflow-hidden">
                {selectedContact ? (
                    <>
                        {/* Header */}
                        <div className="px-5 py-3 bg-white border-b font-medium text-gray-800">
                            {selectedContact.lastMessage}
                        </div>

                        {/* Messages area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-5 bg-gray-50">
                            {isChatLoading ? (
                                <div className="text-center py-12 text-gray-500">
                                    Loading messages...
                                </div>
                            ) : !chatMessages || chatMessages.length === 0 ? (
                                <div className="text-center py-12 text-gray-500 italic">
                                    No messages yet in this conversation
                                </div>
                            ) : (
                                chatMessages?.result
                                    ?.sort(
                                        (
                                            a: { createdAt: string | number | Date },
                                            b: { createdAt: string | number | Date },
                                        ) =>
                                            new Date(a.createdAt).getTime() -
                                            new Date(b.createdAt).getTime(),
                                    )
                                    .map(
                                        (msg: {
                                            sender: { role: string };
                                            _id: React.Key | null | undefined;
                                            content:
                                            | string
                                            | number
                                            | bigint
                                            | boolean
                                            | React.ReactElement<
                                                unknown,
                                                string | React.JSXElementConstructor<any>
                                            >
                                            | Iterable<React.ReactNode>
                                            | React.ReactPortal
                                            | Promise<
                                                | string
                                                | number
                                                | bigint
                                                | boolean
                                                | React.ReactPortal
                                                | React.ReactElement<
                                                    unknown,
                                                    string | React.JSXElementConstructor<any>
                                                >
                                                | Iterable<React.ReactNode>
                                                | null
                                                | undefined
                                            >
                                            | null
                                            | undefined;
                                            createdAt: string | number | Date;
                                            read: any;
                                        }) => {
                                            const isFromManager =
                                                msg.sender.role === "PROPERTY MANAGER";
                                            // or alternatively: isFromManager = msg.sender._id === senderId (if you passed it)

                                            return (
                                                <div
                                                    key={msg._id}
                                                    className={`flex ${isFromManager ? "justify-end" : "justify-start"} group`}
                                                >
                                                    <div
                                                        className={`
                max-w-[75%] px-4 py-3 rounded-2xl text-[15px] leading-relaxed shadow-sm
                ${isFromManager
                                                                ? "bg-blue-600 text-white rounded-tr-none"
                                                                : "bg-white text-gray-900 border border-gray-200 rounded-tl-none shadow"
                                                            }
              `}
                                                    >
                                                        <div className="break-words">{msg.content}</div>

                                                        {/* Small timestamp + read status */}
                                                        <div className="flex items-center justify-end gap-2 mt-1">
                                                            <span className="text-xs opacity-70">
                                                                {new Date(msg.createdAt).toLocaleTimeString(
                                                                    [],
                                                                    {
                                                                        hour: "2-digit",
                                                                        minute: "2-digit",
                                                                        hour12: true,
                                                                    },
                                                                )}
                                                            </span>

                                                            {msg.read && (
                                                                <span className="text-xs text-blue-200">
                                                                    ✓✓
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        },
                                    )
                            )}
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-gray-500">
                        Select a conversation to view messages
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatThreads;

// import { getMemberChatListsApi } from "../../../actions/userManagement";
// import { useQuery } from "@tanstack/react-query";
// import React, { useState } from "react";

// const ChatThreads = ({ _id, chatData, isLoading, error }: { _id: string, chatData: any, isLoading: boolean, error: any }) => {
//     const formatChatTime = (dateStr: string) => {

//         const date = new Date(dateStr);
//         const now = new Date();

//         // If it's today, just show the time
//         if (date.toDateString() === now.toDateString()) {
//             return date.toLocaleTimeString("en-AU", {
//                 hour: "numeric",
//                 minute: "2-digit",
//                 hour12: true
//             });
//         }

//         // Otherwise, show the date
//         return date.toLocaleDateString("en-AU");
//     };
// console.log(chatData, "<--chat data?")
//     const contacts = [
//         {
//             userId: 1,
//             fullName: "Steve Smith",
//             message: "I am fine. How can I help you?",
//             time: "10:30 am",
//             avatar: "https://i.pravatar.cc/40?img=1",
//             unread: 1,
//             active: true,
//         },
//         {
//             userId: 2,
//             fullName: "Indranil Sen",
//             message: "Start learning from scratch",
//             time: "09:45 am",
//             avatar: "https://i.pravatar.cc/40?img=2",
//             unread: 1,
//         },
//         {
//             userId: 3,
//             fullName: "Anonymous",
//             message: "Yes, you can do it easily",
//             time: "",
//             avatar: "",
//         },
//     ];
//     const [page, setPage] = useState(1);
//     const [limit, setLimit] = useState(10);

//      const [searchQuery, setSearchQuery] = useState("");
//        const filteredContacts = contacts.filter((contact) =>
//         contact.fullName.toLowerCase().includes(searchQuery.toLowerCase())
//       );

//     return <div className="flex gap-4 h-[calc(100vh-154px)]">

//         <div className="w-1/3 bg-white border-r flex flex-col rounded-md">
//             {/* Contact items */}
//             <div className="flex-1 overflow-y-auto gap-2 flex flex-col px-2">
//                 {filteredContacts.map((c) => (
//                     <div
//                         key={c.userId}
//                         className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-100 rounded-md shadow-sm hover:shadow-md ${true ? "border border-blue-500" : ""
//                             }`}
//                         // onClick={() => setSelectedForChat(c)}
//                     >
//                         {/* Avatar */}
//                         <div className="relative">
//                             {c.avatar ? (
//                                 <img
//                                     src={c.avatar}
//                                     className="w-10 h-10 rounded-full"
//                                 />
//                             ) : (
//                                 <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white">
//                                     A
//                                 </div>
//                             )}

//                             {c.unread && (
//                                 <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
//                                     {c.unread}
//                                 </span>
//                             )}
//                         </div>

//                         {/* Text */}
//                         <div className="flex-1">
//                             <div className="flex justify-between items-center">
//                                 <h4 className="text-sm font-semibold">{c.fullName}</h4>
//                                 <span className="text-xs text-gray-400">
//                                     {/* {formatChatTime(c.lastMessageTime) || c.lastMessageTime} */}
//                                 </span>
//                             </div>
//                             <p className="text-xs text-gray-500 truncate">
//                                 {/* {c.lastMessage} */}
//                             </p>
//                         </div>
//                     </div>
//                 ))}
//             </div>
//         </div>

//     </div>
// }

// export default ChatThreads;
