import React, { useState } from "react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Required } from "../ui/miscellenious";
import { Textarea } from "../ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calander";
import Icon from "../icons/icon";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useSheet } from "../../context/sheetProvider";
import { toast } from "../../custom-hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSchedulevisit } from "../../actions/propertyMaster";
import { schedulePayloadType } from "../../types/property";

const hours = Array.from({ length: 24 }, (_, i) => i);
const minutes = Array.from({ length: 60 }, (_, i) => i);


const PropertySchedulerForm = ({ id }: { id: string }) => {
    const queryClient = useQueryClient();
    const { closeSheet } = useSheet();
    const [schedulePayload, setSchedulePayload] = useState<schedulePayloadType>({ date: null, discription: "", property_object_id: id });

    const { mutate: createPropertyType, isPending } = useMutation({
        mutationFn: (payload: schedulePayloadType) => createSchedulevisit(payload),
        onSuccess: () => {
            // This will trigger refetch of ['users']
            queryClient.invalidateQueries({ queryKey: ['schedules'] });
            toast({
                title: `Schedule Created`,
                description: `The new property Type account has been successfully created.`,
                variant: "success",
            });
            closeSheet()
            // navigate('/property-type/')
        },
        onError: (error) => {

            toast({
                title: `Failed to Update Schedule`,
                description: `An error occurred while creating the property Type. Please try again.`,
                variant: "error",
            })
            // setServerError(error.response?.data?.message || 'Can not able to add user.');
        },
    });

    const createSchedule = () => {
        if (!schedulePayload.date) {
            return toast({
                title: "Required Field",
                description: "Please select a date and time for the visit.",
                variant: "destructive", // or "error" based on your toast config
            });
        }

        if (!schedulePayload.discription || schedulePayload.discription.trim().length < 5) {
            return toast({
                title: "Required Field",
                description: "Please provide a brief description (min 5 characters).",
                variant: "destructive",
            });
        }
        console.log("payload to schedule -> ", schedulePayload);
        createPropertyType(schedulePayload)
    }

    const cancelSchedule = () => {
        closeSheet();
    }

    return <div className="flex flex-col gap-2">
        <div className="bg-primary text-white px-5 py-6 text-xl font-medium">
            <h2>Schedule Visit</h2>
        </div>
        <div className="flex flex-col items-center justify-between p-4 h-[calc(100dvh-130px)]">
            <div className="space-y-4 px-3  w-full">
                <div className="w-full flex flex-col gap-2">
                    <div className="w-full flex flex-col gap-2">
                        <Label>Date <Required /></Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className="w-full h-12 justify-between border-border-input/53 shadow-none px-4">
                                    {schedulePayload?.date
                                        ? schedulePayload?.date?.toLocaleDateString("en-GB")
                                        : "Select Date"}
                                    <Icon name="CalendarCheck2" />
                                </Button>
                            </PopoverTrigger>

                            <PopoverContent className="p-0">
                                <Calendar
                                    mode="single"
                                    className="w-full"
                                    selected={schedulePayload.date ?? undefined}
                                    disabled={{ before: new Date() }}
                                    onSelect={(date) => setSchedulePayload(prev => {
                                        if (!date) return { ...prev, date: null };
                                        // keep previously chosen hours/minutes when the day changes
                                        const d = new Date(date);
                                        if (prev.date) {
                                            d.setHours(prev.date.getHours(), prev.date.getMinutes(), 0, 0);
                                        }
                                        return { ...prev, date: d };
                                    })}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>
                <div className="w-full flex flex-col gap-2">
                    <div className="w-full flex flex-col gap-2">
                        <Label>Time <Required /></Label>
                        <div className="flex gap-2">
                            {/* Hour */}
                            <Select
                                disabled={!schedulePayload.date}
                                onValueChange={(val) => {
                                    if (!schedulePayload.date) return;

                                    const d = new Date(schedulePayload.date);
                                    d.setHours(Number(val));

                                    setSchedulePayload(prev => ({ ...prev, date: d }));
                                }} >
                                <SelectTrigger className="w-full border rounded p-2 h-12 rounded-lg shadow-none border-Primary">
                                    <SelectValue placeholder="Select Hours" />
                                </SelectTrigger>
                                <SelectContent className="max-h-65">
                                    <SelectItem key={24} value={"0"} className="bg-primary/33" disabled>Hours</SelectItem>
                                    {

                                        hours.map(h => (
                                            <SelectItem key={h} value={h.toString()} >
                                                {h.toString().padStart(2, "0")}
                                            </SelectItem>
                                        ))
                                    }
                                </SelectContent>
                            </Select>

                            {/* Minute */}

                            <Select
                                disabled={!schedulePayload.date}
                                onValueChange={(val) => {
                                    if (!schedulePayload.date) return;

                                    const d = new Date(schedulePayload.date);
                                    d.setMinutes(Number(val));

                                    setSchedulePayload(prev => ({ ...prev, date: d }));
                                }} >
                                <SelectTrigger className="w-full border rounded p-2 h-12 rounded-lg shadow-none border-Primary">
                                    <SelectValue placeholder="Select Minute" />
                                </SelectTrigger>
                                <SelectContent className="max-h-65">
                                    <SelectItem key={24} value={"00"} className="bg-primary/33" disabled>Minute</SelectItem>
                                    {

                                        minutes.map(m => (
                                            <SelectItem key={m} value={m.toString()}>
                                                {m.toString().padStart(2, "0")}
                                            </SelectItem>
                                        ))
                                    }
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
                <div className="w-full flex flex-col gap-2">
                    <div className="w-full flex flex-col gap-2">
                        <Label>Description <Required /></Label>
                        <Textarea onChange={(e) => setSchedulePayload(prev => ({ ...prev, discription: e.target.value }))} className="h-20" />
                    </div>
                </div>
            </div>
            <div className="flex gap-6 w-full px-9">
                <Button variant="cancel" size="rounded" className="" onClick={cancelSchedule}>Cancel</Button>
                <Button variant="secondary" size="rounded" className="" onClick={createSchedule} disabled={isPending}>{isPending ? "Creating..." : "Create Schedule"}</Button>
            </div>
        </div>
    </div>
}

export default PropertySchedulerForm;