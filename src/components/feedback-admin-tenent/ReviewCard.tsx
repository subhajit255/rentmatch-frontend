import React from 'react'
import { IMAGES } from '../../assets'
import ToggleButton from '../ChildComponent/ToggleButton'
import { updateRatingFeedbackStatus } from '../../actions/cms/cmsPageApis';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '../../custom-hooks/use-toast';


function ReviewCard({ item }: any) {
    const queryClient = useQueryClient();

    // 1. Initialize state from the item prop
    const [isRatingActive, setIsRatingActive] = React.useState(item?.is_active || false);

    const statusMutation = useMutation({
        // 2. Pass the toggle value to your API function
        mutationFn: (newStatus: boolean) => updateRatingFeedbackStatus(item._id),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["property-rating-feedback"] });

            // 3. Update local state only after a successful API call
            setIsRatingActive(!isRatingActive);

            toast({
                title: `Status updated successfully`,
                description: "The visibility of this review has been changed.",
                variant: "success",
            });
        },
        onError: (error: any) => {
            toast({
                title: "Update failed",
                description: error?.response?.data?.message || "Could not change status",
                variant: "destructive",
            });
        }
    });

    const handleToggle = () => {
        // 4. Trigger the mutation
        statusMutation.mutate(!isRatingActive);
    };

    console.log(item, "<---item")
    return (
        <div
            key={item?._id}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col transition-all hover:shadow-md"
        >
            {/* Profile Header */}
            <div className="flex items-center space-x-4 mb-5">
                {item?.member_id?.profile_image ? (
                    <img
                        src={item?.member_id?.profile_image || IMAGES.play_store}
                        alt={item?.member_id?.first_name || "N/A"}
                        className="h-12 w-12 rounded-full object-cover"
                    />
                ) : (
                    <div className="h-12 w-12 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                        {item?.member_id?.first_name.charAt(0).toUpperCase()}
                    </div>
                )}
                <div>
                    <h3 className="font-bold text-gray-900 leading-tight">
                        {item?.member_id?.first_name} {item?.member_id?.last_name}
                    </h3>
                    <span className="inline-block px-2 py-0.5 mt-1 text-[10px] font-bold tracking-wider text-indigo-700 bg-indigo-50 rounded uppercase border border-indigo-100">
                        {item?.role}
                    </span>
                </div>
            </div>

            {/* Star Rating */}
            <div className="flex items-center mb-3">
                {[...Array(5)].map((_, i) => (
                    <svg
                        key={i}
                        className={`w-4 h-4 ${i < item?.rating ? 'text-yellow-400' : 'text-gray-200'} fill-current`}
                        viewBox="0 0 20 20"
                    >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                ))}
                <span className="ml-2 text-xs font-semibold text-gray-500">{item?.rating.toFixed(1)}</span>
            </div>

            {/* Review Content */}
            <div className="flex-grow">
                <span>{item?.commend.trim()}</span>
                <p className="text-gray-700 text-sm leading-relaxed italic">
                    &ldquo;{item?.subject.trim()}&rdquo;
                </p>
            </div>

            {/* Status Footer */}
            <div className="mt-6 pt-4 border-t border-gray-50 flex items-center justify-between">
                <div className="flex items-center space-x-1.5">
                    <div className={`h-2 w-2 rounded-full ${item?.is_active ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    <ToggleButton
                        isToggled={isRatingActive}
                        onToggle={handleToggle} // 5. Call the handler here
                    />

                    <span className="text-[11px] text-gray-400 font-medium">
                        {item?.is_active ? 'Active rating' : 'Inactive rating'}
                    </span>
                </div>
                <span className="text-[10px] text-gray-300 font-mono">ID: {item?._id.slice(-6)}</span>
            </div>
        </div>
    )
}

export default ReviewCard