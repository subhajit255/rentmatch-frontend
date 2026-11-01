import React, { useState } from "react";
import type { SyntheticEvent } from "react";
import AttachedPropertyCard from "../ChildComponent/Common/AttachedPropertyCard";
import { Button } from "./button";
import { toast } from "../../../src/custom-hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "../../../src/lib/queryClient";
import { postRequestSendApi } from "../../../src/actions/myPost";

const PropertyDropDown = ({ className, list, postId, onClose }: {
    className?: string,
    list: any,
    postId?: string
    onClose: () => void;  
}) => {
    const [selectedProperties, setSelectedProperties] = useState<string[]>([]); // State to track selected property IDs
    const [error, setError] = useState<string | null>(null); // State to track error messages

    const handleCheckboxChange = (propertyId: string) => {
        setSelectedProperties(prev => {
            if (prev.includes(propertyId)) {
                return prev.filter(id => id !== propertyId); // Uncheck
            } else {
                return [...prev, propertyId]; // Check
            }
        });
    };

    const { mutate: sendPostRequest } = useMutation({
        mutationFn: (payload: any) => postRequestSendApi(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['property'] });
            queryClient.invalidateQueries({ queryKey: ['postDetails'] });
            toast({
                title: `Request Sent`,
                description: `Request successfully sent.`,
                variant: "success",
            });
            onClose();
        },
        onError: (error) => {
            toast({
                title: `Request Send Failed`,
                description: `Could not send the request. Please try again.`,
                variant: "error",
            });
            onClose();
        },
    });

    const handleSendRequest = (e: SyntheticEvent) => {
        e.preventDefault();
        if (selectedProperties.length === 0) {
            toast({
                title: `Property Not Selected`,
                description: `Please select a property to send the request.`,
                variant: "error",
            })
        } else {
            const payload = {
                property_post_object_id: postId,
                properties: selectedProperties.map(propertyId => ({
                    property_object_id: propertyId
                }))
            };

            // Call the mutation with the prepared payload
            sendPostRequest(payload);
        }
    };

    return (
        <div className={`${className} border border-black/10 bg-white shadow-md rounded-md`}>
            <div className={`px-2 py-1`}>
                <ul>
                    {
                        list?.map((property: any) => (
                            <li>
                                <AttachedPropertyCard id={property?._id} property={property} onCheckboxChange={handleCheckboxChange} />
                            </li>
                        ))
                    }
                </ul>
            </div>
            <Button
                variant="ghost"
                size="lg"
                className="bg-[#1563DF33] w-full text-primary rounded-t-none rounded-b-md hover:bg-primary hover:text-white"
                onClick={handleSendRequest}>
                Send Request
            </Button>
        </div>

    )
}

export default PropertyDropDown;