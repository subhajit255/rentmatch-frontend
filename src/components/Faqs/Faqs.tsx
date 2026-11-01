import React, { useEffect, useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { useQuery } from "@tanstack/react-query";
import { getFaqeList } from "../../actions/cms/faq";

const faqData = [
    {
        id: "item-1",
        question: "How Do I Get Started With Your Services?",
        answer:
            "Once your account is set up and you've familiarized yourself with the platform, you are ready to start using our services. Whether it's accessing specific features, making transactions, or utilizing our tools, you'll find everything you need at your fingertips.",
        defaultOpen: true,
    },
    {
        id: "item-2",
        question: "Why Should I Use Your Services?",
        answer: "Our services provide comprehensive property management solutions with 24/7 support, competitive pricing, and a user-friendly platform that makes finding and managing properties effortless.",
        defaultOpen: false,
    },
    {
        id: "item-3",
        question: "How Secure Are Your Services?",
        answer: "We use industry-standard encryption and security protocols to protect your data. All transactions are secured with SSL encryption and we comply with all relevant data protection regulations.",
        defaultOpen: false,
    },
    {
        id: "item-4",
        question: "Is There Customer Support Available?",
        answer: "Yes, we offer 24/7 customer support through multiple channels including live chat, email, and phone. Our dedicated support team is always ready to help you with any questions or issues.",
        defaultOpen: false,
    },
    {
        id: "item-5",
        question: "How Can I Update My Account Information?",
        answer: "You can easily update your account information by logging into your dashboard and navigating to the account settings section. Changes are saved automatically and take effect immediately.",
        defaultOpen: false,
    },
];

const Faqs = () => {

    const { data, isLoading } = useQuery({
        queryKey: ["faq"],
        queryFn: () => getFaqeList(),
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
        retry: 2,
    });

    return (
        <div className="common-container bg-white rounded-2xl border-accent shadow-md mb-4">
            <div className="w-full mx-auto flex flex-col gap-5">
                <div className="p-6">
                    <Accordion
                        type="single"
                        collapsible
                        defaultValue="item-1"
                        className={`sm:space-y-3 md:space-y-[11px]`}
                    >
                        {!isLoading && !!data?.result?.length && data?.result?.map((faq: { _id: string, description: string, name: string}) => (
                            <AccordionItem
                                key={faq._id}
                                value={faq._id}
                                className={`bg-white rounded-2xl border-[1px]`}
                            >
                                <AccordionTrigger className="px-4 md:px-[30px] py-4 md:py-6 hover:no-underline [&[data-state=open]>div]:text-primary [&[data-state=open]>div]:font-extrabold">
                                    <div className="font-heading-heading-06 font-[number:var(--heading-heading-06-font-weight)] text-foreground sm:text-base md:text-[length:var(--heading-heading-06-font-size)] tracking-[var(--heading-heading-06-letter-spacing)] leading-tight md:leading-[var(--heading-heading-06-line-height)] [font-style:var(--heading-heading-06-font-style)] text-left">
                                        {faq?.name}
                                    </div>
                                </AccordionTrigger>
                                {faq?.description && (
                                    <AccordionContent className="px-4 md:px-[30px] pb-4 md:pb-6 pt-0">
                                        <div className="font-body-body-default font-[number:var(--body-body-default-font-weight)] text-[#5b6268] sm:text-sm md:text-[length:var(--body-body-default-font-size)] tracking-[var(--body-body-default-letter-spacing)] leading-relaxed md:leading-[var(--body-body-default-line-height)] [font-style:var(--body-body-default-font-style)]">
                                            {faq?.description}
                                        </div>
                                    </AccordionContent>
                                )}
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </div>
        </div>
    );
};
export default Faqs;
