import React from "react";
import {
  Calendar,
  Heart,
  MapPin,
} from "lucide-react";
import { Button } from "./../ui/button";
import { Card, CardContent } from "./../ui/card";
import { useNavigate } from "react-router-dom";
import { toast } from "../../custom-hooks/use-toast";
import { dateFormat } from "../../lib/utils";
import Icon from "../icons/icon";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LandLordOrPM_SavePostApi } from "../../actions/myPost";


type User = {
  name: string;
  image: string;
  gender?: string
  // Add other user properties here if needed
};

type TenantProps = {
  id: string;
  user: User;
  type: string;
  location: string;
  title: string;
  beds: number;
  baths: number;
  sqm: String;
  postedDate: Date | any;
  price: string | number;
  isUrgent: boolean;
};

const Tenant: React.FC<TenantProps> = ({
  id,
  user,
  type,
  location,
  title,
  beds,
  baths,
  sqm,
  postedDate,
  price,
  isUrgent
}) => {
  const navigate = useNavigate();
    const queryClient = useQueryClient();


  const handleRedirectFilter = () => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      navigate(`/tenant-post-details/${id}`)
    } else {
      toast({
        title: `Please Login to your account`,
        description: `Explore the advance search & other features.`,
        variant: "success",
      });
      navigate('/login');
    }
  }

      const { mutate: savePost } = useMutation({
        mutationFn: (property_object_id: string) =>
            LandLordOrPM_SavePostApi(property_object_id,false),
        onSuccess: () => {
              queryClient.invalidateQueries({ queryKey: ["saved-posts"] });
            toast({
                title: `Saved post`,
                description: `Property successfully removed from your favourite list.`,
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
  return (
    <Card key={id} className="hover:shadow-lg transition-shadow border border-card-border">
      <CardContent className="pt-6 pb-1 pr-6 pl-6">
        {/* User Info */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <img
              src={user.image}
              alt=""
              className="w-20 h-20 rounded-full"
            />
            <div>
              <h3 className="font-semibold text-gray-900">
                {user.name}
              </h3>
              {user.name !== "Anonymous" && (
                <span className="text-sm text-gray-500">{user.gender || "Male"}</span>
              )}
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="rounded-[99px] h-10 w-40 border border-primary text-primary"
            onClick={handleRedirectFilter}
          >
            View Details
          </Button>
        </div>

        {/* Title */}
        <h4 title={title} className="text-lg font-medium text-gray-900 mb-3 font-sansline-clamp-1">
          {/* {title} */}
          {title}
        </h4>

        {/* Location and Date */}
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-4 mb-4 text-sm text-gray-600">
          <div
            className="flex items-center font-sanstext-primary">
            <MapPin className="h-4 w-4 mr-1 text-[#000]" />
            {location}
          </div>
          <div className="flex items-center [font-family:'Manrope',Helvetica]">
            <Calendar className="h-4 w-4 mr-1" />
            {dateFormat(postedDate) || postedDate}
            {/* {postedDate} */}
          </div>
          {isUrgent && (
            <div
              className="rounded-[99px] h-6 pl-2 pr-2 bg-[#C10664] text-white ml-5 font-sansflex items-center"
            >
              Urgent
            </div>
          )}
        </div>
        <hr />
        {/* Property Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4 lg:gap-6 mt-4">
          <div>
            <div className="flex items-center text-sm text-gray-600 mb-1 [font-family:'Manrope',Helvetica]">
              Price:{" "}
              <span className="font-medium ml-1 text-primary">
                {price}
              </span>
            </div>
            <div className="flex items-center text-sm text-gray-600 mb-1 [font-family:'Manrope',Helvetica]">
              Property Type:{" "}
              <span className="font-medium ml-1 text-primary">
                {type}
              </span>
            </div>
            <div className="text-sm text-gray-600 [font-family:'Manrope',Helvetica]">
              Size:{" "}
              <span className="font-medium text-primary">
                {sqm}
              </span>
            </div>
          </div>
          <div>
            <div className="flex items-center text-sm text-gray-600 mb-1 [font-family:'Manrope',Helvetica]">
              No Of Bed Rooms:{" "}
              <span className="font-medium ml-1 text-primary">
                {beds}
              </span>
            </div>
            <div className="flex items-center text-sm text-gray-600 [font-family:'Manrope',Helvetica]">
              No Of Bathroom:{" "}
              <span className="font-medium ml-1 text-primary">
                {baths}
              </span>
            </div>
          </div>
        </div>

        {/* Heart Icon */}
        <div className="flex justify-end">
          <Button variant="ghost" size="sm" className="p-2" onClick={()=>savePost(id)}>
            <Icon
              name="Star"
              className="h-5 w-5 text-gray-400 hover:text-red-500 transition-colors"
              color="var(--chart-5)"
              fill={`${true ? "#f7f44b" : "transparent"}`}
            />
            {/* <Heart className="h-5 w-5 text-gray-400 hover:text-red-500 transition-colors" /> */}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Tenant;
