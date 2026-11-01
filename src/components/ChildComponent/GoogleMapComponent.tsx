import React, { useCallback, useState } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import { IMAGES } from "../../assets/index";
import { MapPin, UserIcon } from "lucide-react";
import { priceFormat } from "../../lib/utils";

const containerStyle = {
  width: "100%",
  height: "80%",
};

type Property = {
  id: string;
  position: [number, number];
  title: string;
  description: string;
  price: string;
  bedrooms: number;
  bathrooms: number;
  area: string;
  imageUrl: string;
  location: string;
  beds: number;
  baths: number;
  featured: number | boolean;
  forRent: number | boolean;
  postedDate: string;
};

// const containerStyle = {
//   width: "100%",
//   height: "500px", // Changed from 80% to 500px to ensure it's visible in the layout
// };

// // ... Property Type and properties array stay the same ...

interface Props {
  center: google.maps.LatLngLiteral;
  zoom: number;
  userLocation: google.maps.LatLngLiteral;
  propertiesData: any
}

function modifyProperty(rawData: any) {
  if (!Array.isArray(rawData)) return [];

  return rawData
    // 1. Filter out items missing latitude or longitude
    .filter((item) => {
      const basic = item.property_details?.basic;
      return basic?.latitude && basic?.longitude;
    })
    // 2. Map to your desired structure
    .map((item: any) => {
      const { basic, rent_details, features, additional_information, documents } =
        item.property_details;

      return {
        id: item._id, // Added missing comma here
        position: [parseFloat(basic.latitude), parseFloat(basic.longitude)],
        title: basic.property_name,
        description: additional_information.description,
        price: `$${rent_details.weekly_rent_price || "0"}/week`,
        bedrooms: parseInt(features.no_of_bedrooms),
        bathrooms: parseInt(features.no_of_bathrooms),
        area: `${features.floor_area} sq ft`,
        imageUrl: documents && documents.images.length > 0 ? documents.images[0].url : IMAGES.villa_image,
        location: `${basic.region_area}, ${basic.state}`,
        beds: parseInt(features.no_of_bedrooms),
        baths: parseInt(features.no_of_bathrooms),
        featured: item.is_cms_featured,
        forRent: basic.is_available_for_rent,
        postedDate: new Date(item.createdAt).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
      };
    });
}


const properties: Property[] = [
  {
    id: "1",
    position: [22.578638, 88.485119], // Example position
    title: "Luxury Manhattan Apartment",
    description:
      "Modern 2BR apartment in the heart of Manhattan with stunning city views",
    price: `$${priceFormat("4,500")}/month`,
    bedrooms: 2,
    bathrooms: 2,
    area: "1,200 sq ft",
    imageUrl: IMAGES.villa_image,
    location: "New York, NY",
    beds: 4,
    baths: 3,
    featured: false,
    forRent: true,
    postedDate: "16 Aug 2025",
  },
  {
    id: "2",
    position: [22.591338, 88.473575], // Example position
    title: "Victorian House in London",
    description: "Beautiful Victorian house in Central London with garden",
    price: `£${priceFormat("3,200")}/month`,
    bedrooms: 3,
    bathrooms: 2,
    area: "1,500 sq ft",
    imageUrl: IMAGES.villa_image,
    location: "Machala",
    beds: 4,
    baths: 3,
    featured: false,
    forRent: true,
    postedDate: "16 Aug 2025",
  },
];


const GoogleMapComponent = ({ center, zoom, userLocation, propertiesData }: Props) => {
  const modifiedProperties = modifyProperty(propertiesData)
  const [selectedProperty, setSelectedProperty] = useState<any | null>(
    null,
  );
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const onMapLoad = useCallback((mapInstance: google.maps.Map) => {
    setMap(mapInstance);
    // Auto-fit markers on initial load
    const bounds = new window.google.maps.LatLngBounds();
    properties.forEach((property) => {
      bounds.extend({ lat: property.position[0], lng: property.position[1] });
    });
    mapInstance.fitBounds(bounds);
  }, []);

  const handleMarkerClick = (property: Property) => {
    setSelectedProperty(property);
  };

  const handleCloseClick = () => {
    setSelectedProperty(null);
  };
  const userIcon = {
    path: window.google?.maps?.SymbolPath?.CIRCLE,
    fillColor: "#4285F4",
    fillOpacity: 1,
    scale: 8,
    strokeColor: "white",
    strokeWeight: 2,
  };
  const onLoad = (mapInstance: google.maps.Map) => {
    const bounds = new window.google.maps.LatLngBounds();

    modifiedProperties.forEach((property) => {
      bounds.extend({ lat: property.position[0], lng: property.position[1] });
    });
    if (userLocation) {
      bounds.extend(userLocation);
    }
    // fitBounds on empty bounds zooms to the whole world; keep center/zoom from props instead
    if (!bounds.isEmpty()) {
      mapInstance.fitBounds(bounds); // Fit the map to the bounds of the markers
    }
  };

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      onLoad={onLoad}
      center={center} // Controlled by parent (Autocomplete)
      zoom={zoom}
    >
      {/* --- USER POINTER --- */}
      {userLocation && (
        <Marker
          position={userLocation}
          title="Your Location"
          icon={userIcon}
          zIndex={10} // Ensure it stays above property markers
        />
      )}

      {modifiedProperties.map((property) => (
        <Marker
          key={property.id}
          position={{ lat: property.position[0], lng: property.position[1] }}
          onClick={() => setSelectedProperty(property)}
        />
      ))}

      {selectedProperty && (
        <InfoWindow
          position={{
            lat: selectedProperty.position[0],
            lng: selectedProperty.position[1],
          }}
          onCloseClick={() => setSelectedProperty(null)}
        >
          <div className="flex gap-2">
            <div className="relative w-48 h-37">
              <img
                src={selectedProperty.imageUrl}
                alt={selectedProperty.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="font-semibold text-gray-900 text-lg">
                <h3
                  title={selectedProperty.title}
                  className="font-semibold text-gray-900 text-lg line-clamp-1"
                >
                  {selectedProperty.title}
                </h3>
              </div>
              <div className="flex flex-wrap items-start gap-2 md:gap-4">
                <div className="flex items-center gap-1">
                  <img src={IMAGES.beds} alt="" />
                  <span className="font-sans font-normal text-muted-foreground text-xs md:text-sm tracking-[0] leading-[19.6px]">
                    Beds:
                  </span>
                  <span className="font-sans font-semibold text-primary-foreground text-xs md:text-sm tracking-[0] leading-[19.6px]">
                    {selectedProperty.beds}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <img src={IMAGES.baths} alt="" />
                  <span className="font-sans font-normal text-muted-foreground text-xs md:text-sm tracking-[0] leading-[19.6px]">
                    Baths:
                  </span>
                  <span className="font-sans font-semibold text-primary-foreground text-xs md:text-sm tracking-[0] leading-[19.6px]">
                    {selectedProperty.baths}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <img src={IMAGES.sqm} alt="" />
                  <span className="font-sans font-normal text-muted-foreground text-xs md:text-sm tracking-[0] leading-[19.6px]">
                    sqm:
                  </span>
                  <span className="font-sans font-semibold text-primary-foreground text-xs md:text-sm tracking-[0] leading-[19.6px]">
                    {selectedProperty.area}
                  </span>
                </div>
              </div>
              <div className="flex items-center text-gray-600 mb-3 mt-2">
                <MapPin className="h-4 w-4 mr-1" />
                <span
                  title={selectedProperty?.location}
                  className="text-sm line-clamp-1"
                >
                  {selectedProperty?.location}
                </span>
              </div>
              <hr />
              <div className="flex justify-between items-center mb-2">
                <div className="text-sm text-gray-500">
                  Posted On: {selectedProperty.postedDate}
                </div>
                <span className="text-2l font-bold text-blue-600">
                  {selectedProperty.price}
                </span>
              </div>
            </div>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
};

export default GoogleMapComponent;

//____________WORKING COMPONENT____________

// import React, { useState, useCallback } from "react";
// import { GoogleMap, Marker, InfoWindow } from "@react-google-maps/api";
// import { IMAGES } from "../../assets/index";
// import { MapPin } from "lucide-react";
// import { priceFormat } from "../../lib/utils";

// const properties: any[] = [
//   {
//     id: "1",
//     position: [22.578638, 88.485119], // Example position
//     title: "Luxury Manhattan Apartment",
//     description:
//       "Modern 2BR apartment in the heart of Manhattan with stunning city views",
//     price: `$${priceFormat("4,500")}/month`,
//     bedrooms: 2,
//     bathrooms: 2,
//     area: "1,200 sq ft",
//     imageUrl: IMAGES.villa_image,
//     location: "New York, NY",
//     beds: 4,
//     baths: 3,
//     featured: false,
//     forRent: true,
//     postedDate: "16 Aug 2025",
//   },
//   {
//     id: "2",
//     position: [22.591338, 88.473575], // Example position
//     title: "Victorian House in London",
//     description: "Beautiful Victorian house in Central London with garden",
//     price: `£${priceFormat("3,200")}/month`,
//     bedrooms: 3,
//     bathrooms: 2,
//     area: "1,500 sq ft",
//     imageUrl: IMAGES.villa_image,
//     location: "Machala",
//     beds: 4,
//     baths: 3,
//     featured: false,
//     forRent: true,
//     postedDate: "16 Aug 2025",
//   },
// ];

// const containerStyle = {
//   width: "100%",
//   height: "500px", // Changed from 80% to 500px to ensure it's visible in the layout
// };

// // ... Property Type and properties array stay the same ...

// interface Props {
//   center: google.maps.LatLngLiteral;
//   zoom: number;
// }

// const GoogleMapComponent = ({ center, zoom }: Props) => {
//   const [selectedProperty, setSelectedProperty] = useState<any | null>(null);
//   const [map, setMap] = useState<google.maps.Map | null>(null);

//   const onMapLoad = useCallback((mapInstance: google.maps.Map) => {
//     setMap(mapInstance);

//     // Auto-fit markers on initial load
//     const bounds = new window.google.maps.LatLngBounds();
//     properties.forEach((property) => {
//       bounds.extend({ lat: property.position[0], lng: property.position[1] });
//     });
//     mapInstance.fitBounds(bounds);
//   }, []);

//   return (
//     // 1. REMOVED <LoadScript> - It is already loaded in the parent
//     <GoogleMap
//       mapContainerStyle={containerStyle}
//       onLoad={onMapLoad}
//       center={center} // Controlled by parent (Autocomplete)
//       zoom={zoom}     // Controlled by parent (Autocomplete)
//     >
//       {properties.map((property) => (
//         <Marker
//           key={property.id}
//           position={{ lat: property.position[0], lng: property.position[1] }}
//           onClick={() => setSelectedProperty(property)}
//         />
//       ))}

//       {selectedProperty && (
//         <InfoWindow
//           position={{
//             lat: selectedProperty.position[0],
//             lng: selectedProperty.position[1],
//           }}
//           onCloseClick={() => setSelectedProperty(null)}
//         >
//           {/* InfoWindow Content - Keep your existing JSX here */}
//           <div className="flex gap-2 p-1 min-w-[300px]">
//              {/* ... your existing InfoWindow UI ... */}
//              <div className="font-semibold">{selectedProperty.title}</div>
//              <div>{selectedProperty.price}</div>
//           </div>
//         </InfoWindow>
//       )}
//     </GoogleMap>
//   );
// };

// export default GoogleMapComponent;
