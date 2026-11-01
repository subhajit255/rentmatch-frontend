import React, { useState } from "react";

const formatChatTime = (dateStr: string) => {
  const date = new Date(dateStr);
  const now = new Date();
  
  // If it's today, just show the time
  if (date.toDateString() === now.toDateString()) {
    return date.toLocaleTimeString("en-AU", { 
      hour: "numeric", 
      minute: "2-digit", 
      hour12: true 
    });
  }
  
  // Otherwise, show the date
  return date.toLocaleDateString("en-AU");
};

// const contacts = [
//   {
//     id: 1,
//     name: "Steve Smith",
//     message: "I am fine. How can I help you?",
//     time: "10:30 am",
//     avatar: "https://i.pravatar.cc/40?img=1",
//     unread: 1,
//     active: true,
//   },
//   {
//     id: 2,
//     name: "Indranil Sen",
//     message: "Start learning from scratch",
//     time: "09:45 am",
//     avatar: "https://i.pravatar.cc/40?img=2",
//     unread: 1,
//   },
//   {
//     id: 3,
//     name: "Anonymous",
//     message: "Yes, you can do it easily",
//     time: "",
//     avatar: "",
//   },
// ];

const ContactList = ({ setSelectedForChat, contacts, selectedForChat, hideOnMobile = false }: { setSelectedForChat: (contact: any) => void, contacts: any[], selectedForChat: any, hideOnMobile?: boolean }) => {
  // console.log(contacts, "<---contac")
  const [searchQuery, setSearchQuery] = useState("");
   const filteredContacts = contacts.filter((contact) =>
    contact.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );
  return (
    <div className={`${hideOnMobile ? "hidden md:flex" : "flex"} w-full md:w-1/3 bg-white border-r flex-col rounded-md`}>
      {/* Search */}
      <div className="p-4">
        <input
          placeholder="Search by name"
          className="w-full px-3 py-2 rounded-md border text-sm focus:outline-none"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Contact items */}
      <div className="flex-1 overflow-y-auto gap-2 flex flex-col px-2">
        {filteredContacts.map((c) => (
          <div
            key={c.userId}
            className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-100 rounded-md shadow-sm hover:shadow-md ${
              selectedForChat && selectedForChat.userId === c.userId ? "border border-blue-500" : ""
            }`}
            onClick={() => setSelectedForChat(c)}
          >
            {/* Avatar */}
            <div className="relative">
              {c.avatar ? (
                <img
                  src={c.avatar}
                  className="w-10 h-10 rounded-full"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white">
                  A
                </div>
              )}

              {c.unread && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                  {c.unread}
                </span>
              )}
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-semibold">{c.fullName}</h4>
                <span className="text-xs text-gray-400">
                 {formatChatTime(c.lastMessageTime) || c.lastMessageTime}
                  </span>
              </div>
              <p className="text-xs text-gray-500 truncate">
                {c.lastMessage.length > 25 ? `${c.lastMessage.slice(0, 25)}..` : c.lastMessage}
                {/* {c.lastMessage} */}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContactList;
