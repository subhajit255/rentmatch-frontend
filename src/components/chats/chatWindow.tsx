import React, { useState, useRef, useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Icon from "../icons/icon";
import { getChatContent, sendMessage } from "../../actions/chatApis";
import PropertyHorizontal from "../ChildComponent/Common/PropertyHorizontal";
import { ArrowLeft } from "lucide-react";

// import PropertyHorizontal from "../ChildComponent/PropertyHorizontal";
// import { useSocket } from "../../context/SocketContext";


interface Message {
  _id?: string;
  id?: string;
  sender: { id: string; email?: string };
  receiver?: { id: string; email?: string };
  content: string;
  createdAt: string;
  // ... other fields
}

interface ChatWindowProps {
  selectedForChat: {
    userId: string;
    fullName?: string;
    profileImage?: string;
  } | null;
  currentUserId: string; // your logged-in user's ID
}

const ChatWindow = ({ selectedForChat, showOnMobile = true, onBack }: { selectedForChat: any; showOnMobile?: boolean; onBack?: () => void }) => {
  // console.log(selectedForChat, "<--selected for chat")
  const queryClient = useQueryClient();
  // const { socket } = useSocket();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messageText, setMessageText] = useState("");
  const [typing, setTyping] = useState(false);


  // console.log(selectedForChat, "<--sel f chat");
  // const shouldFetch = !!selectedForChat?.userId;
  const otherUserId = selectedForChat?.userId;
  const shouldFetch = !!otherUserId;

  const queryKey = ["chat-content", otherUserId, selectedForChat];

  const { data, isLoading, isError } = useQuery({
    queryKey,
    queryFn: () => getChatContent(selectedForChat!.userId),
    enabled: shouldFetch,
    staleTime: 3 * 60 * 1000,
    // refetchInterval: 5000,
    refetchOnWindowFocus: false,
    retry: 2,
  });

  const messages = data?.result ?? [];

  // console.log(messages, "<---data");

  // ── Helper: avoid duplicates ────────────────────────────────
  // const addMessageIfNotExists = useCallback((newMsg: Message) => {
  //   queryClient.setQueryData<Message[]>(queryKey, (old = []) => {
  //     // Simple deduplication – improve with better logic if needed (e.g. _id)
  //     if (old.some(m => m._id === newMsg._id || m.createdAt === newMsg.createdAt)) {
  //       return old;
  //     }
  //     return [...old, newMsg].sort((a, b) =>
  //       new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  //     );
  //   });
  // }, [queryClient, queryKey]);

  // ── Socket listeners ────────────────────────────────────────
  // useEffect(() => {
  //   if (!socket || !otherUserId) return;

  //   const handleNewMessage = (msg: Message) => {
  //     // Only process if this message belongs to current chat
  //     const isFromOther = msg.sender.id === otherUserId;
  //     const isToMe     = msg.receiver?.id === selectedForChat.userId;

  //     if (isFromOther && isToMe) {
  //       addMessageIfNotExists(msg);
  //     }
  //   };

  //   const handleMessageSent = (msg: Message) => {
  //     // Confirmation / echo from server – usually has real _id
  //     addMessageIfNotExists(msg);
  //   };

  //   const handleTyping = ({ userId }: { userId: string }) => {
  //     if (userId === otherUserId) setTyping(true);
  //   };

  //   const handleStopTyping = ({ userId }: { userId: string }) => {
  //     if (userId === otherUserId) setTyping(false);
  //   };

  //   socket.on("new_message", handleNewMessage);
  //   socket.on("message_sent", handleMessageSent);
  //   socket.on("user_typing", handleTyping);
  //   socket.on("user_stop_typing", handleStopTyping);

  //   return () => {
  //     socket.off("new_message", handleNewMessage);
  //     socket.off("message_sent", handleMessageSent);
  //     socket.off("user_typing", handleTyping);
  //     socket.off("user_stop_typing", handleStopTyping);
  //   };
  // }, [socket, otherUserId, selectedForChat?.userId, addMessageIfNotExists]);

  const propDetails = {
    "_id": "69c52f765e1a9754881ae332",
    "property_id": "647962",
    "is_complete": false,
    "is_active": true,
    "created_by": {
        "_id": "69c524dcce603a13dc2de7be",
        "role": "LANDLORD",
        "email": "testRLandlord@gmail.com",
        "__v": 0,
        "address_line_1": null,
        "address_line_2": null,
        "city": null,
        "company_details": {
            "company_name": null,
            "company_number": null,
            "company_address": null,
            "company_email": null,
            "company_phone": null
        },
        "contact_label": null,
        "country": "KOLKATA",
        "createdAt": "2026-03-26T12:21:48.899Z",
        "date": "2026-03-26T12:21:48.899Z",
        "date_of_birth": null,
        "devices_token": null,
        "expiresAt": null,
        "first_name": "Landlord",
        "gender": "MALE",
        "is_registered": true,
        "is_subscribe": true,
        "is_verified": true,
        "last_login_date": "2026-04-08T06:01:57.392Z",
        "last_name": "Eonak",
        "member_id": "member_id000001",
        "member_status": null,
        "middle_name": "",
        "otp": null,
        "password": "$2a$10$P..yEqq0US4DrDfJ.NWl8.zLYloHHcQAzxaLajW9il9MkU3UycsVu",
        "phone_extension": null,
        "phone_number": 8976457231,
        "profile_image": null,
        "state": null,
        "subscription": {
            "super_admin_registration": {
                "email": false,
                "notification": false
            },
            "admin_creation": {
                "email": false,
                "notification": false
            },
            "admin_registration": {
                "email": false,
                "notification": false
            },
            "member_creation": {
                "email": false,
                "notification": false
            },
            "member_profile_updation": {
                "email": false,
                "notification": false
            }
        },
        "updatedAt": "2026-04-08T06:01:57.401Z",
        "user_name": "2343LLTNT",
        "zip": null,
        "is_active": true
    },
    "is_send_request": true,
    "is_wishlist": true,
    "is_cms_featured": true,
    "property_owner": {
        "first_name": "",
        "middle_name": "",
        "last_name": "",
        "phone_number": "",
        "email": "",
        "full_address": "",
        "_id": "69c52f765e1a9754881ae333"
    },
    "property_details": {
        "basic": {
            "property_no": "SOUTHASX34234",
            "property_name": "Property South ASX",
            "property_type_id": {
                "_id": "6909b9df6bd39a48cf4ff5ef",
                "name": "House",
                "slug": "House",
                "description": "House Description",
                "is_active": true,
                "__v": 0,
                "img": "CustomHouse",
                "updatedAt": "2025-12-22T10:58:27.633Z"
            },
            "is_available_for_rent": true,
            "subrup": "downtown",
            "state": "Victoria",
            "pincode": "3177",
            "region_area": "Malbourne",
            "country": "",
            "latitude": "-37.99044110000001",
            "longitude": "145.2142842",
            "full_address": "157 Lonsdale St, Dandenong VIC 3175, Australia",
            "_id": "69c52f765e1a9754881ae335"
        },
        "rent_details": {
            "weekly_rent_price": "200",
            "monthly_rent_price": null,
            "bond_or_security_deposit": 2000,
            "available_from": "2026-03-26T12:46:48.215Z",
            "rent_details_lease_terms": "6",
            "_id": "69c52f765e1a9754881ae336"
        },
        "features": {
            "no_of_bedrooms": "5",
            "no_of_bathrooms": "3",
            "parking": "Mechanical parking",
            "no_of_garage": "2",
            "land_size": "5000",
            "floor_area": "3000",
            "_id": "69c52f765e1a9754881ae337"
        },
        "interior": {
            "heating_and_cooling": [
                "Air conditioning"
            ],
            "kitchen_appliances": [
                "Oven"
            ],
            "laundry_features": [
                "In-unit"
            ],
            "_id": "69c52f765e1a9754881ae338"
        },
        "outdoor": {
            "features": [
                "balcony",
                "carport"
            ],
            "outdoor_entering_area": [
                "fire-pit"
            ],
            "balcony": false,
            "deck": false,
            "courtyard": false,
            "garden": false,
            "yard": false,
            "_id": "69c52f765e1a9754881ae339"
        },
        "additional_information": {
            "pets": "ALLOWED",
            "description": "Allowed pets",
            "energy_rating": 4,
            "_id": "69c52f765e1a9754881ae33a"
        },
        "amenities_features": [
            "power-backup",
            "gated-community",
            "gardenpark",
            "solar-panels"
        ],
        "nearby_amenities": [],
        "_id": "69c52f765e1a9754881ae334"
    },
    "createdAt": "2026-03-26T13:07:02.197Z",
    "updatedAt": "2026-04-06T15:42:23.991Z",
    "__v": 0,
    "send_request_status": "APPROVED"
}


  // ── Send message mutation ───────────────────────────────────────
  const sendMutation = useMutation({
    mutationFn: (content: string) =>
      sendMessage({
        receiver: otherUserId!,
        content,
      }),

    onMutate: async (content) => {
      // Optimistic update
      const optimisticMsg: Message = {
        _id: `temp-${Date.now()}`,
        sender: { id: otherUserId },
        content,
        createdAt: new Date().toISOString(),
      };

      // Snapshot previous value
      const previousMessages = queryClient.getQueryData<Message[]>([
        "chat",
        otherUserId,
      ]);

      // Optimistically append
      queryClient.setQueryData<Message[]>(["chat", otherUserId], (old = []) => [
        ...old,
        optimisticMsg,
      ]);

      return { previousMessages }; // for rollback
    },

    onError: (err, content, context) => {
      // Rollback on error
      if (context?.previousMessages) {
        queryClient.setQueryData(
          ["chat", otherUserId],
          context.previousMessages,
        );
      }
      console.error("Failed to send message:", err);
    },

    onSuccess: (responseData, sentContent) => {
      queryClient.invalidateQueries({ queryKey: queryKey });
      setMessageText(""); // clear input
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    },
  });

  // Auto-scroll to bottom when messages change
  // useEffect(() => {
  //   messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  // }, [messages]);

  useEffect(() => {
    // Use a small timeout to ensure the DOM has updated with new messages
    const timeoutId = setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [messages]);

  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault();
    const trimmed = messageText.trim();
    if (!trimmed || sendMutation.isPending || !otherUserId) return;

    sendMutation.mutate(trimmed);
  };

  return (
    <div className={`${showOnMobile ? "flex" : "hidden md:flex"} flex-1 min-w-0 flex-col bg-white  rounded-md`}>
      {/* Header */}
      {messages.length > 0 ? (
        <div className="px-6 py-4 border-b flex items-center justify-between bg-secondary/20 rounded-t-md">
          <div className="flex items-center gap-3">
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="md:hidden -ml-2 p-2 rounded-full hover:bg-accent"
                aria-label="Back to contacts"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <img
              src={
                selectedForChat?.profileImage ||
                "https://i.pravatar.cc/40?img=1"
              }
              className="w-10 h-10 rounded-full"
            />
            <div>
              <h3 className="font-semibold text-sm">
                {selectedForChat?.fullName || "Select a contact"}
              </h3>
              <p className="text-xs text-gray-500">{selectedForChat?.role}</p>
            </div>
          </div>
          {/* <button className="text-gray-400">⋮</button> */}
        </div>
      ) : onBack ? (
        <div className="md:hidden px-4 py-3 border-b">
          <button
            type="button"
            onClick={onBack}
            className="p-2 rounded-full hover:bg-accent"
            aria-label="Back to contacts"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>
      ) : (
        ""
      )}

      {/* Message  */}
      <div className="flex-1 p-6 space-y-4 overflow-y-auto">
        {isLoading && (
          <div className="flex justify-center items-center h-full text-gray-500">
            Loading messages...
          </div>
        )}

        {!isLoading && !isError && messages.length === 0 && (
          <div className="flex justify-center items-center h-full text-gray-500 italic">
            No messages yet. Start a chat!
          </div>
        )}

        {messages.map((msg: any) => {
          const isMe = msg.sender.id === selectedForChat?.userId;

          // Format time (you can use date-fns or luxon for better formatting)
          const time = new Date(msg.createdAt)
            .toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })
            .toLowerCase();

          return (
            <div
              key={msg._id || msg.id}
              className={`flex ${isMe ? "justify-start" : "justify-end"}`}
            >
              <div
                className={`max-w-[80%] px-4 py-2 rounded-lg text-sm ${isMe
                  ? "bg-chat-right text-gray-900"
                  : "bg-chat-left text-gray-900"
                  }`}
              >
                <p className={msg?.property_id ? "font-bold mb-2" : ""}>{msg.content}</p>
                {
                  msg?.property_id ? <PropertyHorizontal
                  id={msg?.property_id._id}
                  property={msg?.property_id}
                  isChatscreen={true}
                /> : null
                }
                
                <span className="block text-right text-xs text-gray-400 mt-1">
                  {time}
                </span>
              </div>
              <div ref={messagesEndRef} />
            </div>
          );
        })}
      </div>

      {/* Input */}
      {/* <div className="mx-4 flex items-center">
        <input
          placeholder="Type your text..."
          className="w-full h-15 pl-4 pr-8 py-2 rounded-l-md border border-chat-input-border bg-chat-input/20  focus:outline-none mb-4"
        />
        <button className="bg-primary text-white px-4 py-2 rounded-r-md hover:bg-primary/50 mb-4 h-15">
          <Icon name="Send" className="w-5 h-5 inline-block ml-1" />
        </button>
      </div> */}

      {messages.length > 0 ? (
        <form onSubmit={handleSend} className="p-4 border-t bg-white">
          <div className="flex items-center gap-2">
            <input
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Type a message..."
              className="flex-1 px-4 py-3 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              disabled={sendMutation.isPending}
            />
            <button
              type="submit"
              disabled={!messageText.trim() || sendMutation.isPending}
              className="p-3 bg-primary text-white rounded-full hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Icon name="Send" className="w-5 h-5" />
            </button>
          </div>
        </form>
      ) : (
        ""
      )}
    </div>
  );
};

export default ChatWindow;

{
  /* Messages */
}
{
  /* <div className="flex-1 p-6 space-y-4 overflow-y-auto">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.sender === "me" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[60%] px-4 py-2 rounded-lg text-sm ${
                msg.sender === "me"
                  ? "bg-chat-right text-gray-900"
                  : "bg-chat-left text-gray-900"
              }`}
            >
              <p>{msg.text}</p>
              <span className="block text-right text-xs text-gray-400 mt-1">
                {msg.time}
              </span>
            </div>
          </div>
        ))}
      </div> */
}
