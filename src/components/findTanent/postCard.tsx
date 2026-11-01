import React, { act, useMemo } from "react";
import { Card } from "../ui/card"
import Icon from "../icons/icon";
import { Button } from "../ui/button";
import { IMAGES } from "../../assets";
import { useNavigate } from "react-router-dom";
import { priceFormat } from "../../lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LandLordOrPM_SavePostApi } from "../../actions/myPost";
import { toast } from "../../custom-hooks/use-toast";

const PostCard = ({ postDetails, isGuest }: any) => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { _id, created_by, move_in_requirements, end_price, start_price, subject, location, created_date, is_wishlisted } = postDetails;
    const { first_name, last_name, gender } = created_by;

    const createdDateTime = useMemo(() => {
        if (created_date) {
            let actual_date_time = created_date.split(".")[0];
            actual_date_time = actual_date_time?.split("T");
            const actual_date = actual_date_time[0].split("-").reverse().join("/")
            const actual_time = actual_date_time[1]

            return <div className="flex items-center">
                <span className="border-r pr-1 border-card-foreground">
                    {`${actual_date}`}
                </span>
                <span className="border-l pl-1 border-card-foreground">{`${actual_time}`}</span>
            </div>
        } else {
            return "N/A"
        }
    }, [created_date]);

    const name = useMemo(() => {
        return (first_name ?? "") + " " + (last_name ?? "")
    }, [first_name, last_name]);

    const requirement = useMemo(() => {
        let moveInJSX;
        switch (move_in_requirements) {
            case "less_than_15_days":
                moveInJSX = <div className="text-xs py-1 px-2 rounded-full text-white bg-[#C10664] -bottom-1 left-1/2 -translate-x-1/2 absolute font-semibold">Urgent</div>
                break;
            default:
                break;
        }
        return moveInJSX;
    }, [move_in_requirements])

    const handleClick = (id: string) => {
        console.log("clicked");
        navigate(`/tenant-post-details/${id}`);
    };

    const { mutate: savePost } = useMutation({
        mutationFn: (property_object_id: string) =>
            LandLordOrPM_SavePostApi(property_object_id, is_wishlisted ? false : true),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["saved-posts"] });
            queryClient.invalidateQueries({ queryKey: ["all_post"] });
            toast({
                title: `Saved post`,
                description: `Property successfully add to your favourite list.`,
                variant: "success",
            });
        },
        onError: (error) => {
            toast({
                title: `Saved post Failed`,
                description: `Could not add the property to your favourite list. Please check try again.`,
                variant: "error",
            });
        },
    });

    return <Card className="rounded-lg relative border border-sidebar-ring shadow-sm">
        <div className="h-50 grid grid-rows-4 px-3  ">
            <div className="row-span-3 flex flex-col gap-2 py-2">
                <div className="flex items-center gap-3">
                    <div>
                        <div className="w-19 h-19 rounded-full relative">
                            <img src={IMAGES.user_img} alt="profile-pics" className="w-full h-full rounded-full object-content" />
                            {requirement}
                        </div>
                    </div>
                    <div className="flex flex-col justify-center">
                        <h4 className="text-xl font-bold text-foreground">{name}</h4>
                        <span className="flex items-center">
                            <Icon name="MaleGenderIcon" className="w-4 h-4 text-active flex items-center justify-center" />
                            {/* User -> male, UserCircle -> Female, UserRound -> Neuter */}
                            <span className="font-medium text-primary-foreground text-sm">{gender}</span>
                        </span>
                    </div>
                </div>
                <div className="flex flex-col gap-1">
                    <p title={subject} className="max-w-[285px] w-auto leading-[1.5] font-semibold text-foreground overflow-hidden whitespace-nowrap text-ellipsis w-full">{subject}</p>
                    <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1">
                            <Icon name="MapPin" className="w-3 h-3" />
                            <span title={location} className="text-xs font-medium text-primary w-auto max-w-[130px] overflow-hidden whitespace-nowrap text-ellipsis">{location}</span>
                        </span>
                        <span className="flex items-center gap-1">
                            <Icon name="CalendarClock" className="w-3 h-3" />
                            <span className="text-xs font-medium text-card-foreground">{createdDateTime}</span>
                        </span>
                    </div>
                </div>
            </div>
            <div className="border-t row-span-1 w-full flex items-center justify-between">
                <span className="text-sm font-semibold flex items-center gap-3">
                    <span className="text-muted-foreground">Price:</span>
                    <span className="text-primary">${priceFormat(start_price)} - ${priceFormat(end_price)}</span>
                </span>
                <Button variant="outline" size="sm" className="rounded-full cursor-pointer" onClick={() => handleClick(_id)}>View Details</Button>
            </div>
        </div>
        {
            !isGuest &&
            <a
                href="#"
                onClick={() => savePost(_id)}
            >
                <Icon
                    name="Star"
                    className="absolute top-2 right-2 w-4 h-4 cursor-pointer border-primary text-primary"
                    color="var(--chart-5)"
                    fill={`${is_wishlisted ? "#f7f44b" : "transparent"}`}
                />
            </a>
            // <Icon name="Star" className="absolute top-2 right-2 w-4 h-4 cursor-pointer border-primary text-primary" color="var(--chart-5)" />
        }
    </Card>
}

export default PostCard;