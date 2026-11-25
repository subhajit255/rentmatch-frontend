import React, { useEffect, useState } from "react";
import { Star, Check, X, ShieldAlert, UserCheck } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import { toast } from "../../custom-hooks/use-toast";
import FeedbackModal from "../feedback-admin-tenent/feedbackForm";
import { useAuth } from "../../context/AuthContext";

interface BlockedItem {
  id: string;
  name?: string;
}

const RentMatchSettings: React.FC = () => {
  const { user } = useAuth();

  // Load persistent settings or default to the exact visual state in the reference image
  const [emailNotifActive, setEmailNotifActive] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem("rm_setting_email_notif");
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  const [frequency, setFrequency] = useState<string>(() => {
    try {
      return localStorage.getItem("rm_setting_frequency") || "EVERY";
    } catch {
      return "EVERY";
    }
  });

  const [propertyMatch, setPropertyMatch] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem("rm_setting_prop_match");
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  const [offersPromo, setOffersPromo] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem("rm_setting_offers_promo");
      return saved !== null ? JSON.parse(saved) : false;
    } catch {
      return false;
    }
  });

  const [platformChanges, setPlatformChanges] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem("rm_setting_platform_changes");
      return saved !== null ? JSON.parse(saved) : false;
    } catch {
      return false;
    }
  });

  const [aliasActive, setAliasActive] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem("rm_setting_alias_active");
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  // Blocked users management
  const [blockedUsers, setBlockedUsers] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("rentmatch_blocked_chats") || "[]");
    } catch {
      return [];
    }
  });

  const [manageBlockedOpen, setManageBlockedOpen] = useState(false);

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem("rm_setting_email_notif", JSON.stringify(emailNotifActive));
  }, [emailNotifActive]);

  useEffect(() => {
    localStorage.setItem("rm_setting_frequency", frequency);
  }, [frequency]);

  useEffect(() => {
    localStorage.setItem("rm_setting_prop_match", JSON.stringify(propertyMatch));
  }, [propertyMatch]);

  useEffect(() => {
    localStorage.setItem("rm_setting_offers_promo", JSON.stringify(offersPromo));
  }, [offersPromo]);

  useEffect(() => {
    localStorage.setItem("rm_setting_platform_changes", JSON.stringify(platformChanges));
  }, [platformChanges]);

  useEffect(() => {
    localStorage.setItem("rm_setting_alias_active", JSON.stringify(aliasActive));
  }, [aliasActive]);

  const handleUnblock = (idToUnblock: string) => {
    const nextBlocked = blockedUsers.filter((id) => id !== idToUnblock);
    setBlockedUsers(nextBlocked);
    localStorage.setItem("rentmatch_blocked_chats", JSON.stringify(nextBlocked));
    toast({
      title: "User Unblocked",
      description: "User has been removed from your blocked list.",
      variant: "success",
    });
  };

  // Generate dynamic alias label based on user or fallback to reference image
  const aliasDisplay = user?._id || user?.id
    ? `Renter RM-${(user?._id || user?.id).slice(-4).toUpperCase()}`
    : "Renter RM-4812";

  return (
    <div className="w-full bg-white rounded-[24px] p-6 sm:p-10 border border-slate-100 shadow-[0_2px_16px_rgba(0,0,0,0.03)] font-sans my-2">
        {/* 1. Email Notification Section */}
        <div className="flex items-start justify-between pb-7 border-b border-gray-100">
          <div className="pr-4">
            <h2 className="text-xl font-semibold text-gray-900 tracking-tight">
              Email Notification
            </h2>
            <p className="text-sm text-gray-500 mt-1.5 leading-relaxed">
              When you are busy or not online, we can send you an email for any new message.
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={emailNotifActive}
            onClick={() => setEmailNotifActive(!emailNotifActive)}
            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${
              emailNotifActive ? "bg-[#38c172]" : "bg-gray-200"
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                emailNotifActive ? "translate-x-5" : "translate-x-0.5"
              } mt-0.5`}
            />
          </button>
        </div>

        {/* 2. Send me email notifications - Frequency */}
        <div className="py-7 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 tracking-tight mb-4">
            Send me email notifications
          </h3>
          <div className="space-y-3.5">
            {[
              { id: "every", label: "Send me an email for every message", value: "EVERY" },
              { id: "hour", label: "Once an hour at most", value: "HOUR" },
              { id: "never", label: "Never", value: "NEVER" },
            ].map((item) => {
              const isSelected = frequency === item.value;
              return (
                <div
                  key={item.id}
                  onClick={() => setFrequency(item.value)}
                  className="flex items-center gap-3 cursor-pointer select-none group"
                >
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                      isSelected
                        ? "border-2 border-blue-600 bg-white"
                        : "border-2 border-gray-300 group-hover:border-gray-400 bg-white"
                    }`}
                  >
                    {isSelected && (
                      <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                    )}
                  </div>
                  <span className="text-[15px] text-gray-800 font-normal group-hover:text-gray-900 transition-colors">
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. Email news and updates */}
        <div className="py-7 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 tracking-tight">
            Email news and updates
          </h3>
          <p className="text-sm text-gray-500 mt-1 mb-5">
            From time to time we would like to send you email with news about RentMatch. Choose the updates you want.
          </p>

          <div className="space-y-3.5">
            {/* Property Match */}
            <div
              onClick={() => setPropertyMatch(!propertyMatch)}
              className="flex items-center gap-3 cursor-pointer select-none group"
            >
              <div
                className={`w-5 h-5 rounded-[5px] flex items-center justify-center transition-all ${
                  propertyMatch
                    ? "bg-blue-600 border border-blue-600 text-white"
                    : "border-2 border-gray-300 group-hover:border-gray-400 bg-white"
                }`}
              >
                {propertyMatch && <Check size={13} strokeWidth={3} />}
              </div>
              <span className="text-[15px] text-gray-800 font-normal group-hover:text-gray-900 transition-colors">
                Property Match
              </span>
            </div>

            {/* Offers and Promotions */}
            <div
              onClick={() => setOffersPromo(!offersPromo)}
              className="flex items-center gap-3 cursor-pointer select-none group"
            >
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                  offersPromo
                    ? "bg-blue-600 border border-blue-600 text-white"
                    : "border-2 border-gray-300 group-hover:border-gray-400 bg-white"
                }`}
              >
                {offersPromo && <Check size={12} strokeWidth={3} />}
              </div>
              <span className="text-[15px] text-gray-800 font-normal group-hover:text-gray-900 transition-colors">
                Offers and Promotions
              </span>
            </div>

            {/* Platform Changes */}
            <div
              onClick={() => setPlatformChanges(!platformChanges)}
              className="flex items-start gap-3 cursor-pointer select-none group"
            >
              <div
                className={`w-5 h-5 mt-0.5 rounded-full flex items-center justify-center transition-all flex-shrink-0 ${
                  platformChanges
                    ? "bg-blue-600 border border-blue-600 text-white"
                    : "border-2 border-gray-300 group-hover:border-gray-400 bg-white"
                }`}
              >
                {platformChanges && <Check size={12} strokeWidth={3} />}
              </div>
              <span className="text-[15px] text-gray-800 leading-snug">
                <span className="font-medium text-gray-900">RentMatch Platform changes: </span>
                <span className="text-gray-500 font-normal">Stay in the know when we make updates</span>
              </span>
            </div>
          </div>
        </div>

        {/* 4. Privacy and visibility */}
        <div className="py-7 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 tracking-tight">
            Privacy and visibility
          </h3>
          <p className="text-sm text-gray-500 mt-1 mb-5">
            Control what landlords and agents see before you accept an invitation.
          </p>

          <div className="space-y-5">
            {/* Alias row */}
            <div className="flex items-center justify-between">
              <span className="text-[15px] text-gray-800 font-normal">
                Show me as an alias until I accept{" "}
                <span className="text-gray-600 font-normal">({aliasDisplay})</span>
              </span>
              <button
                type="button"
                role="switch"
                aria-checked={aliasActive}
                onClick={() => setAliasActive(!aliasActive)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${
                  aliasActive ? "bg-[#38c172]" : "bg-gray-200"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                    aliasActive ? "translate-x-5" : "translate-x-0.5"
                  } mt-0.5`}
                />
              </button>
            </div>

            {/* Blocked users row */}
            <div className="flex items-center justify-between">
              <span className="text-[15px] text-gray-800 font-normal">
                Blocked users
              </span>
              <button
                type="button"
                onClick={() => setManageBlockedOpen(true)}
                className="px-5 py-1.5 rounded-full border border-slate-700 text-slate-800 text-sm font-medium hover:bg-slate-50 active:scale-98 transition-all"
              >
                Manage {blockedUsers.length} blocked
              </button>
            </div>
          </div>
        </div>

        {/* 5. Rate Us Section */}
        <div className="pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-50/80 border border-amber-200/50 flex items-center justify-center flex-shrink-0 text-amber-500 shadow-none">
              <Star className="w-5 h-5 fill-amber-400 text-amber-500" />
            </div>
            <div>
              <h4 className="text-[16px] font-semibold text-gray-900 leading-snug">
                Rate Us
              </h4>
              <p className="text-sm text-gray-500 mt-0.5">
                We would love to hear your feedback to improve RentMatch.
              </p>
            </div>
          </div>

          <FeedbackModal
            trigger={
              <button
                type="button"
                className="inline-flex items-center justify-center gap-1.5 bg-[#313ecc] hover:bg-[#2832af] active:scale-98 text-white font-medium text-sm px-6 py-2.5 rounded-full shadow-sm transition-all self-start sm:self-auto cursor-pointer"
              >
                <span className="text-base font-semibold leading-none">+</span>
                <span>Give Feedback</span>
              </button>
            }
          />
        </div>

      {/* Manage Blocked Users Modal */}
      <Dialog.Root open={manageBlockedOpen} onOpenChange={setManageBlockedOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 animate-in fade-in duration-200" />
          <Dialog.Content className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] w-full max-w-md bg-white p-6 rounded-2xl shadow-xl z-50 border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-slate-700" />
                <Dialog.Title className="text-lg font-semibold text-gray-900">
                  Blocked Users ({blockedUsers.length})
                </Dialog.Title>
              </div>
              <Dialog.Close asChild>
                <button className="text-gray-400 hover:text-gray-600 p-1 rounded-lg transition-colors">
                  <X size={18} />
                </button>
              </Dialog.Close>
            </div>

            {blockedUsers.length === 0 ? (
              <div className="py-8 text-center text-gray-500">
                <UserCheck className="w-10 h-10 mx-auto text-gray-300 mb-2" />
                <p className="font-medium text-gray-700">No Blocked Users</p>
                <p className="text-xs text-gray-400 mt-1 max-w-xs mx-auto">
                  When you block any user from a chat conversation, they will appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {blockedUsers.map((id) => (
                  <div
                    key={id}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-800">User ID: {id.slice(0, 10)}...</p>
                      <p className="text-xs text-gray-400">Blocked from messaging you</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleUnblock(id)}
                      className="text-xs font-semibold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      Unblock
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-5 pt-3 border-t border-gray-100 flex justify-end">
              <Dialog.Close asChild>
                <button
                  type="button"
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                >
                  Close
                </button>
              </Dialog.Close>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
};

export default RentMatchSettings;
