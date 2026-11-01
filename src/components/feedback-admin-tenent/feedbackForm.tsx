import React, { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Star, X, MessageSquarePlus, Loader2 } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { sendRating } from '../../actions/helpCentreApis';
import { toast } from '../../custom-hooks/use-toast';

// Helper for tailwind merging (using your installed tailwind-merge/clsx)
function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// Validation Schema
const feedbackSchema = z.object({
    rating: z.number().min(1, "Please select a rating").max(5),
    subject: z.string().min(10, "Feedback must be at least 10 characters"),
    commend: z.string().min(5, "Title must be at least 5 characters")
});

type FeedbackFormValues = z.infer<typeof feedbackSchema>;

const FeedbackModal = () => {
  const queryClient = useQueryClient();

    const [open, setOpen] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors },
    } = useForm<FeedbackFormValues>({
        resolver: zodResolver(feedbackSchema),
        defaultValues: { rating: 0, subject: "",commend:"" },
    });

    const currentRating = watch("rating");

    const sendMutation = useMutation({
        mutationFn: (data: any) => sendRating(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["property-feedback-cms"] });
            queryClient.invalidateQueries({ queryKey: ["property-rating-feedback"] });
            toast({
                title: "Rating & review saved",
                description: "Thank you for your feedback!",
                variant: "success",
            });
            setOpen(false);
            reset();
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

    const isSubmitting = sendMutation.isPending;

    const onSubmit = async (data: FeedbackFormValues) => {
        if (sendMutation.isPending) return;
        // close/reset happens in onSuccess so the form stays open on error
        sendMutation.mutate(data);
    };

    return (
        <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger asChild>
                <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                    <MessageSquarePlus size={18} />
                    Give Feedback
                </button>
            </Dialog.Trigger>

            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300 z-50" />
                <Dialog.Content className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] w-full max-w-md bg-white p-6 rounded-2xl shadow-xl z-50 animate-in zoom-in-95 duration-200">

                    <div className="flex justify-between items-center mb-4">
                        <Dialog.Title className="text-xl font-bold text-gray-900">Submit Feedback</Dialog.Title>
                        <Dialog.Close asChild>
                            <button className="text-gray-400 hover:text-gray-600 transition-colors">
                                <X size={20} />
                            </button>
                        </Dialog.Close>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Rating Stars */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">How would you rate your experience?</label>
                            <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setValue("rating", star)}
                                        className="focus:outline-none transition-transform active:scale-90"
                                    >
                                        <Star
                                            size={28}
                                            className={cn(
                                                "transition-colors",
                                                star <= currentRating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                            )}
                                        />
                                    </button>
                                ))}
                            </div>
                            {errors.rating && <p className="mt-1 text-xs text-red-500">{errors.rating.message}</p>}
                        </div>

                         {/* title */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                            <input
                                {...register("commend")}
                                className={cn(
                                    "w-full p-3 border rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all min-h-[80px] resize-none",
                                    errors.commend ? "border-red-500 bg-red-50" : "border-gray-200"
                                )}
                                placeholder=""
                            />
                            {errors.commend && <p className="mt-1 text-xs text-red-500">{errors.commend.message}</p>}
                        </div>

                        {/* Subject/Comment */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Tell us more</label>
                            <textarea
                                {...register("subject")}
                                className={cn(
                                    "w-full p-3 border rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all min-h-[120px] resize-none",
                                    errors.subject ? "border-red-500 bg-red-50" : "border-gray-200"
                                )}
                                placeholder=""
                            />
                            {errors.subject && <p className="mt-1 text-xs text-red-500">{errors.subject.message}</p>}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
                        >
                            {isSubmitting && <Loader2 className="animate-spin" size={18} />}
                            {isSubmitting ? "Submitting..." : "Submit Review"}
                        </button>
                    </form>

                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
};

export default FeedbackModal;
