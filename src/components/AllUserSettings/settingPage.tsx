import React, { useEffect, useState } from "react";
import ToggleButton from "../ChildComponent/ToggleButton"; // Path to your shared component
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@radix-ui/react-accordion";
import { ChevronDown, Star } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sendRating } from "../../actions/helpCentreApis";
import { toast } from "../../custom-hooks/use-toast";
import FeedbackModal from "../feedback-admin-tenent/feedbackForm";

const RentMatchSettings: React.FC = () => {
    const queryClient = useQueryClient();

    // State for the two main toggles
    const [emailNotifActive, setEmailNotifActive] = useState(false);
    const [profileVisible, setProfileVisible] = useState(false);
    const [frequency, setFrequency] = useState("NOTIF");
    const [rating, setRating] = useState(0);
    const [subject, setSubject] = useState("");
    const [comment, setComment] = useState("");

    const sendMutation = useMutation({
        mutationFn: (data: any) => sendRating(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["property-feedback-cms"] });
            toast({
                title: "Rating & review saved",
                description: "Thank you for your feedback!",
                variant: "success",
            });
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

    const handleSubmitFeedback = (e: any) => {
        e.preventDefault(); // Prevents page reload

        const feedbackData = {
            subject: subject,
            rating: rating,
            comment: comment,
            submittedAt: new Date().toISOString()
        };

        console.log("New Feedback Received:", feedbackData);
        sendMutation.mutate(feedbackData);

        // Optional: Reset form after logging
        // setRating(0);
        // setSubject("");
        // setComment("");
    };

    useEffect(() => {
        console.log("--- RentMatch Settings Update ---");
        console.log("Email Notifications Active:", emailNotifActive);
        console.log("Notification Frequency:", frequency);
        console.log("Profile Visibility Active:", profileVisible);
    }, [emailNotifActive, frequency, profileVisible]);

    const handleCheckboxChange = (
        section: string,
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        console.log(`News & Updates - ${section}:`, e.target.checked);
    };

    return (
        <div className="max-w-5xl mx-auto mt-2 mb-2 rounded-md p-10 bg-white font-sans text-[#333]">
            {/* Email Notification Section */}
            <div className="flex justify-between items-start py-8 border-b border-gray-100">
                <div className="space-y-1">
                    <h2 className="text-lg font-medium">Email Notification</h2>
                    <p className="text-gray-500 text-sm">
                        When you're busy or not online, can send you email notification for
                        any new message
                    </p>
                </div>
                <ToggleButton
                    isToggled={emailNotifActive}
                    onToggle={() => setEmailNotifActive(!emailNotifActive)}
                />
            </div>

            {/* Send me Email Notifications - Radio Group */}
            <div className="py-8 border-b border-gray-100">
                <h3 className="text-md font-medium mb-4">
                    Send me Email Notifications
                </h3>
                <div className="space-y-4">
                    {[
                        {
                            id: "notif",
                            label: "Send Me email Notification",
                            value: "NOTIF",
                        },
                        { id: "hour", label: "Once an hour at most", value: "HOUR" },
                        { id: "never", label: "Never", value: "NEVER" },
                    ].map((item) => (
                        <label
                            key={item.id}
                            className="flex items-center gap-3 cursor-pointer group"
                        >
                            {/* <input 
                                type="radio" 
                                name="notif-freq" 
                                defaultChecked={idx === 0}
                                className="w-4 h-4 accent-[#38AC79]" 
                            /> */}
                            <Input
                                type="radio"
                                id={item.id}
                                name="frequency"
                                value={item.value}
                                checked={frequency === item.value}
                                onChange={(e) => setFrequency(e.target.value)}
                                className="h-4 w-4 border-gray-300 cursor-pointer shadow-none"
                            />
                            <span className="text-[15px] text-gray-400 group-hover:text-gray-700 transition-colors">
                                {item.label}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            <div className="py-6 border-b border-gray-100">
                <h3 className="text-[17px] font-medium text-gray-800">
                    Email News and Updates
                </h3>
                <p className="text-sm text-gray-400 mb-6">
                    From time to time we'd like to send you email with interesting news
                    about RentMatch. You can choose which updates you'd like to receive.
                </p>

                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <Input
                            type="checkbox"
                            className="h-4 w-4"
                            onChange={(e) => handleCheckboxChange("Property Match", e)}
                            defaultChecked
                        />
                        <span className="text-[15px] text-gray-600">Property Match</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Input
                            type="checkbox"
                            className="h-4 w-4"
                            onChange={(e) => handleCheckboxChange("Offers and Promotion", e)}
                        />
                        <span className="text-[15px] text-gray-600">
                            Offers and Promotions
                        </span>
                    </div>
                    <div className="flex items-start gap-3">
                        <Input
                            type="checkbox"
                            className="h-4 w-4 mt-1"
                            onChange={(e) => handleCheckboxChange("Platform change", e)}
                        />
                        <div className="text-[15px]">
                            <span className="text-gray-600">
                                RentMatch Platform changing:{" "}
                            </span>
                            <span className="text-gray-400 font-light ml-1">
                                Stay in the know when we make updates to our APIs
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Profile Visibility Section */}
            {/* <div className="flex justify-between items-start py-8">
                <div className="space-y-1">
                    <h2 className="text-lg font-medium">Profile Visibility</h2>
                    <p className="text-gray-500 text-sm">If you active this feature you Email-ID, Phone number, Profile image will be always visible for all users</p>
                </div>
                <ToggleButton 
                    isToggled={profileVisible} 
                    onToggle={() => setProfileVisible(!profileVisible)} 
                />
            </div> */}

            {/* Rate Us Section */}
            <div className="flex items-center justify-between w-full pr-4">
                <div className="flex items-start gap-4 text-left">
                    {/* Visual Icon */}
                    <div className="mt-1 p-2 bg-yellow-50 rounded-lg text-yellow-600 group-data-[state=open]:bg-[#38AC79] group-data-[state=open]:text-white transition-colors">
                        <Star size={20} fill="currentColor" />
                    </div>

                    <div>
                        <h3 className="text-lg font-medium text-gray-900">Rate Us</h3>
                        <p className="text-sm text-gray-500 font-normal">
                            We'd love to hear your feedback to improve RentMatch.
                        </p>
                    </div>
                </div>

                {/* Custom Action Label */}
                <div className="hidden sm:flex items-center gap-2 text-[#38AC79] font-medium text-sm ml-3 pt-4">
                    <FeedbackModal />
                </div>
            </div>
        </div>
    );
};

export default RentMatchSettings;

// import React, { useState, ReactNode } from 'react';

// interface SectionProps {
//   title: string;
//   description: string;
//   children?: ReactNode;
//   hasToggle: boolean;
//   toggleValue: boolean;
//   onToggle: (value: boolean) => void;
// }

// const RentMatchSettings = () => {
//   // State management for checkboxes and toggles
//   const [emailNotif, setEmailNotif] = useState(false);
//   const [profileVisible, setProfileVisible] = useState(false);
//   const [newsletters, setNewsletters] = useState({
//     propertyMatch: true,
//     offers: false,
//     platformChanges: false,
//   });

//   const Section = ({ title, description, children, hasToggle, toggleValue, onToggle }: SectionProps) => (
//     <div className="py-6 border-b border-gray-100 last:border-0">
//       <div className="flex justify-between items-start mb-4">
//         <div>
//           <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
//           <p className="text-sm text-gray-500 max-w-2xl">{description}</p>
//         </div>
//         {hasToggle && (
//           <button
//             onClick={() => onToggle(!toggleValue)}
//             className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${toggleValue ? 'bg-blue-600' : 'bg-gray-300'}`}
//           >
//             <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${toggleValue ? 'translate-x-6' : ''}`} />
//           </button>
//         )}
//       </div>
//       {children}
//     </div>
//   );

//   return (
//     <div className="max-w-4xl mx-auto p-8 bg-white font-sans">

//       {/* Email Notification Section */}
//       <Section
//         title="Email Notification"
//         description="When you're busy or not online, can send you email notification for any new message"
//         hasToggle={true}
//         toggleValue={emailNotif}
//         onToggle={setEmailNotif}
//       />

//       {/* Frequency Section */}
//       <div className="py-6 border-b border-gray-100">
//         <h3 className="text-sm font-semibold text-gray-800 mb-4">Send me Email Notifications</h3>
//         <div className="space-y-3">
//           {['Send Me email Notification', 'Once an hour at most', 'Never'].map((label, idx) => (
//             <label key={idx} className="flex items-center space-x-3 cursor-pointer group">
//               <input type="radio" name="freq" defaultChecked={idx === 0} className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
//               <span className="text-sm text-gray-600 group-hover:text-gray-900">{label}</span>
//             </label>
//           ))}
//         </div>
//       </div>

//       {/* News and Updates Section */}
//       <div className="py-6 border-b border-gray-100">
//         <h3 className="text-lg font-semibold text-gray-800">Email News and Updates</h3>
//         <p className="text-sm text-gray-500 mb-6">From time to time we'd like to send you email with interesting news about RentMatch. You can choose which updates you'd like to receive.</p>

//         <div className="space-y-4">
//           <label className="flex items-center space-x-3">
//             <input type="checkbox" checked={newsletters.propertyMatch} onChange={() => {}} className="w-4 h-4 rounded border-gray-300 text-blue-600" />
//             <span className="text-sm text-gray-700">Property Match</span>
//           </label>
//           <label className="flex items-center space-x-3">
//             <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-blue-600" />
//             <span className="text-sm text-gray-700">Offers and Promotions</span>
//           </label>
//           <label className="flex items-start space-x-3">
//             <input type="checkbox" className="mt-1 w-4 h-4 rounded border-gray-300 text-blue-600" />
//             <div className="flex flex-col">
//                <span className="text-sm text-gray-700">RentMatch Platform changing: <span className="text-gray-500">Stay in the know when we make updates to our APIs</span></span>
//             </div>
//           </label>
//         </div>
//       </div>

//       {/* Profile Visibility Section */}
//       <Section
//         title="Profile Visibility"
//         description="If you active this feature you Email-ID, Phone number, Profile image will be always visible for all users"
//         hasToggle={true}
//         toggleValue={profileVisible}
//         onToggle={setProfileVisible}
//       />

//     </div>
//   );
// };

// export default RentMatchSettings;
