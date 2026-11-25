import React from "react";
import { BookmarkIcon, MapPinIcon } from "lucide-react";
// import { Badge } from "./ui/badge";
import { Badge } from "./../ui/badge";
import { Button } from "./../ui/button";
import { Card, CardContent } from "./../ui/card";
import { Separator } from "./../ui/separator";
import { IMAGES } from "../../assets/index";

type PropertyProps = {
  id: string | number;
  image: string;
  type: string;
  status: string;
  location: string;
  title: string;
  beds: number;
  baths: number;
  sqm: string | number;
  postedDate: Date;
  price: string | number;
};

const Property: React.FC<PropertyProps> = ({
  id,
  image,
  type,
  status,
  location,
  title,
  beds,
  baths,
  sqm,
  postedDate,
  price,
}) => {
  return (
    <Card
      key={id}
      className="bg-white rounded-2xl overflow-hidden shadow-sm border border-card-border"
    >
      <div className="relative">
        <div
          className="w-full h-[270px] bg-cover bg-center relative"
          style={{ backgroundImage: `url(${image})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent">
            <div className="absolute top-2.5 left-2.5 flex items-center gap-2">
              <Badge className="bg-chart-3 text-foreground hover:bg-chart-3 rounded-[99px] px-2 py-0 h-5 md:h-5">
                <span className="font-sans font-medium text-sm px-1 py-1">
                  {type}
                </span>
              </Badge>
              <Badge className="bg-white text-[#08914f] hover:bg-white rounded-[99px] px-2 py-0 h-5 md:h-5">
                <span className="font-sans font-medium text-sm px-1 py-1">
                  {status}
                </span>
              </Badge>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="absolute top-[237px] right-[9px] w-6 h-6 p-0 hover:bg-transparent"
            >
              <BookmarkIcon className="w-6 h-6 text-white" />
            </Button>

            <div className="absolute bottom-5 left-5 flex items-center gap-1">
              <MapPinIcon className="w-4 h-4 text-white" />
              <span className="font-sans font-normal text-white text-sm tracking-[0] leading-[19.6px]">
                {location}
              </span>
            </div>
          </div>
        </div>
      </div>

      <CardContent className="p-4 sm:p-5">
        <div className="flex flex-col gap-2.5">
          <div className="flex flex-col gap-2">
            <h3
              title={title}
              className="font-sans line-clamp-1 font-semibold text-foreground text-lg sm:text-xl tracking-[0] leading-tight"
            >
              {title}
            </h3>

            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 shrink-0">
                  {/* <BedIcon className="w-4 h-4" /> */}
                  <img src={IMAGES.beds} alt="" className="w-3.5 h-3.5 object-contain" />
                  <span className="font-sans font-normal text-muted-foreground text-xs tracking-[0]">
                    Beds:
                  </span>
                  <span className="font-sans font-semibold text-primary-foreground text-xs tracking-[0]">
                    {beds}
                  </span>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  {/* <BathIcon className="w-4 h-4" /> */}
                  <img src={IMAGES.baths} alt="" className="w-3.5 h-3.5 object-contain" />
                  <span className="font-sans font-normal text-muted-foreground text-xs tracking-[0]">
                    Baths:
                  </span>
                  <span className="font-sans font-semibold text-primary-foreground text-xs tracking-[0]">
                    {baths}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                {/* <SquareIcon className="w-4 h-4" /> */}
                <img src={IMAGES.sqm} alt="" className="w-3.5 h-3.5 object-contain" />
                <span className="font-sans font-normal text-muted-foreground text-xs tracking-[0]">
                  Area:
                </span>
                <span className="font-sans font-semibold text-primary-foreground text-xs tracking-[0]">
                  {sqm}
                </span>
              </div>
            </div>
          </div>

          <Separator className="bg-out-line" />

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
            <div className="flex items-center gap-2 flex-1">
              <span className="font-sans font-normal text-primary-foreground text-xs md:text-sm tracking-[0] leading-[19.6px]">
                <span className="font-medium">Posted On: </span>
                <span className="font-bold">
                  {postedDate instanceof Date
                    ? postedDate.toLocaleDateString()
                    : "N/A"}
                </span>
              </span>
            </div>
            <div className="font-sans font-bold text-primary text-base md:text-lg tracking-[0] leading-7 shrink-0 whitespace-nowrap">
              <span>$</span> {price}{String(price).toLowerCase().includes("week") || String(price).toLowerCase().includes("month") ? "" : " / week"}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Property;
