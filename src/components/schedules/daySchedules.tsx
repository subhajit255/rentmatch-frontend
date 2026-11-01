import { IMAGES } from "../../assets";
import React from "react";
function DaySchedules({
  visitOrDate
}: {
  visitOrDate: any
}) {
  // console.log(visitOrDate, "<----visitOrDate")
  return (
    <>

      {
        Array.isArray(visitOrDate) && visitOrDate?.length > 0 ? (
          <div className="space-y-3">
            <p className="text-sm font-medium">
              {new Date(visitOrDate[0].date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </p>

            {visitOrDate.map((details: any, index: number) =>
             {
              console.log(details?.property_object_id?.property_details?.documents?.images[0].url, "<=== url")
              return (
              <div
                key={index}
                className="flex rounded-lg  bg-white"
              >
                <div
                  className="w-18 h-full rounded-l-lg object-cover"
                >
                  <img
                    src={details?.property_object_id?.property_details?.documents?.images.length > 0 ?
                      details?.property_object_id?.property_details?.documents?.images[0].url :
                      IMAGES?.villa_image}
                    className="w-22 h-30 rounded-l-lg object-cover"
                  />
                </div>
                <div className="flex-1 rounded-r-lg border-y border-r border-border px-2 py-2 flex flex-col ">
                  <p className="text-sm font-medium line-clamp-1">
                    {details?.property_object_id?.property_details?.basic?.property_name}
                  </p>
                  <div className="flex items-center justify-between border-b pb-2">
                    <p className="text-xs text-muted-foreground">
                      {details?.property_object_id?.property_details?.basic?.full_address}

                    </p>
                    <p className="text-sm font-semibold text-primary">
                      $ {details?.property_object_id?.property_details?.rent_details?.weekly_rent_price} / week
                    </p>
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex gap-2 items-center">
                      {/* <div>
                        <img src={IMAGES.logo} alt="wesrtdyuiop" className="w-7 h-8 rounded-full" />
                      </div> */}
                      <div className="flex flex-col justify-center">
                        <h4 className="font-semibold text-sm">
                          {details?.visitor_id?.first_name} {details?.visitor_id?.last_name}

                        </h4>
                        <p className="font-medium text-xs">
                          {details?.visitor_id?.phone_number}
                        </p>
                      </div>
                    </div>
                    {/* <div className="text-xs text-muted-foreground">
                      10:24 AM
                    </div> */}
                  </div>
                </div>
              </div>
            )})}
          </div>
        ) : (
          <div className="rounded-xl border border-border bg-white p-4">
            <span>
              No visit schedule on this date
            </span>
          </div>
        )
      }
    </>

  );
}
export default DaySchedules;