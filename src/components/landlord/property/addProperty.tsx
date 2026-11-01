import React, { lazy, Suspense, useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// import PropertyBasics from "./propertyBasics";
const PropertyBasics = lazy(() => import("./propertyBasics"));
import PropertyDetails from "./propertydetails";
import PropertyFeatures from "./propertyFeatures";
import InteriorFeatures from "./interiorFeatures";
import OutdoorFeatures from "./outdoorFeatures";
import AdditionalInformation from "./additionalInformation";
import PropertyDocument from "./propertydocument";
import { addPropertyValidateSchema } from "../../../schemas/property";

import { Button } from "../../ui/button";
import {
  addPropertyApi,
  uploadDocumentsApi,
  getMasterDataProperty,
} from "../../../actions/property";

import {
  default_basics,
  defaultAdditionalInformation,
  defaultDetails,
  defaultFeatures,
  defaultInterior,
  defaultOutdoor,
  owner_details_byPM,
  propertyAminities,
  propertyBasicTab,
} from "../../../constants/property";

import { DocItem, DocumentsPayload } from "@/src/types/property";
import { ImagePayload } from "@/src/actions/common";
import DynamicAminities from "./dynamicAminities";
import { useAuth } from "../../../context/AuthContext";
import OwnerDetailsByPM from "./ownerDetailsByPM";

/* ----------------------- DEFAULTS ----------------------- */

const defaultPayload = {
  is_complete: false,
  property_object_id: undefined as string | undefined,
  property_details: {
    basic: default_basics,
    rent_details: defaultDetails,
    features: defaultFeatures,
    interior: defaultInterior,
    outdoor: defaultOutdoor,
    additional_information: defaultAdditionalInformation,
  },
};

type BasicErrors = {
  property_name?: string;
  property_no?: string;
  property_type_id?: string;
  is_available_for_rent?: string;
  subrup?: string;
  state?: string;
  pincode?: string;
  full_address?: string;

  weekly_rent_price?: string;
  monthly_rent_price?: any;
  bond_or_security_deposit?: string;
  available_from?: string;
  rent_details_lease_terms?: string;

  no_of_bedrooms?: string;
  no_of_bathrooms?: string;
  parking?: string;
  land_size?: string;
  floor_area?: string;
};

const PropertyAddForm = () => {
  const { state } = useLocation();
  const { property_details, property_owner, _id, is_complete } = state || {};
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, token, loading } = useAuth();
  // console.log(user?.role, "<--user role or PROPERTY_MANAGER")

  /* ----------------------- STATE ----------------------- */

  const [property, setProperty] = useState(defaultPayload);
  const [basicDetails, setBasicDetails] = useState(default_basics);
  const [rentDetails, setRentDetails] = useState(defaultDetails);
  const [propertyFeatures, setPropertyFeatures] = useState(defaultFeatures);
  const [interiorPayload, setInteriorPayload] = useState(defaultInterior);
  const [outdoorPayload, setOutdoorPayload] = useState(defaultOutdoor);
  // const [aminityDataState, SetAminityDataState] = useState(propertyAminities);
  const [basicErrors, setBasicErrors] = useState<BasicErrors>({});
  const [additionalInfo, setAdditionalInfo] = useState(
    defaultAdditionalInformation,
  );
  const [ownerInfo, setOwnerInfo] = useState(
    owner_details_byPM,
  );

  const [documents, setDocuments] = useState<DocumentsPayload>({
    images: [],
    videos: [],
    floor_plans: [],
  });



  /* ----------------------- PREFILL (EDIT MODE) ----------------------- */

  useEffect(() => {
    if (!property_details) return;
    console.log(property_details, "<-----property_details");

    setProperty({
      is_complete,
      property_object_id: _id,
      property_details,
    });

    setBasicDetails({
      ...property_details.basic,
      property_type_id:
        property_details.basic.property_type_id?._id ??
        property_details.basic.property_type_id,
    });

    // setRentDetails(property_details.rent_details ?? defaultDetails);
    setRentDetails({
      ...defaultDetails, // fallback defaults
      ...property_details.rent_details, // override with real data
      weekly_rent_price:
        property_details.rent_details?.weekly_rent_price != null
          ? String(property_details.rent_details.weekly_rent_price)
          : "",
      bond_or_security_deposit:
        property_details.rent_details?.bond_or_security_deposit != null
          ? String(property_details.rent_details.bond_or_security_deposit)
          : "",
      available_from: property_details.rent_details?.available_from
        ? new Date(property_details.rent_details?.available_from)
        : null,
    });
    // setPropertyFeatures(property_details.features ?? defaultFeatures);
    setPropertyFeatures({
      ...defaultFeatures,
      ...property_details.features,
      no_of_bedrooms: String(property_details.features?.no_of_bedrooms ?? ""),
      no_of_bathrooms: String(property_details.features?.no_of_bathrooms ?? ""),
      no_of_garage: String(property_details.features?.no_of_garage ?? ""),
      land_size: String(property_details.features?.land_size ?? ""),
      floor_area: String(property_details.features?.floor_area ?? ""),
    });
    setInteriorPayload(property_details.interior ?? defaultInterior);
    setOutdoorPayload(property_details.outdoor ?? defaultOutdoor);
    // SetAminityDataState(
    //   property_details.amenities_features ?? propertyAminities,
    // );
    setAdditionalInfo(
      property_details.additional_information ?? defaultAdditionalInformation,
    );

    setOwnerInfo(
      property_owner ?? owner_details_byPM
    )
    setDocuments(
      property_details.documents ?? {
        images: [],
        videos: [],
        floor_plans: [],
      },
    );
  }, [_id, is_complete, property_details]);

  // useEffect(() => {
  //   console.log("documents in addproperty ::: ", documents);
  // }, [documents]);

  /* ----------------------- MUTATIONS ----------------------- */

  const uploadDocumentsMutation = useMutation({
    mutationFn: uploadDocumentsApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["property"] });
      queryClient.invalidateQueries({ queryKey: ["allProperty"] });
      navigate("/my-properties");
    },
  });

  const savePropertyMutation = useMutation({
    mutationFn: addPropertyApi,
    onSuccess: (res) => {
      console.log("res ::: ", res);
      queryClient.invalidateQueries({ queryKey: ["propertyDetails"] });
      queryClient.invalidateQueries({ queryKey: ["property"] });
      queryClient.invalidateQueries({ queryKey: ["allProperty"] });
      const propertyId = res?.data?._id;
      if (!propertyId) return;

      setProperty((prev) => ({
        ...prev,
        property_object_id: propertyId,
      }));
      console.log("documents ::: ", documents);

      if (
        documents.images.length ||
        documents.videos.length ||
        documents.floor_plans.length
      ) {
        uploadDocumentsMutation.mutate({
          images:
            (documents.images.filter(
              (item) => item.data instanceof File,
            ) as ImagePayload[]) ?? [],
          videos:
            (documents.videos.filter(
              (item) => item.data instanceof File,
            ) as ImagePayload[]) ?? [],
          floor_plans:
            (documents.floor_plans.filter(
              (item) => item.data instanceof File,
            ) as ImagePayload[]) ?? [],
          property_object_id: propertyId,
        });
      } else {
        navigate("/my-properties");
      }
    },
    onError: (err) => {
      console.error("Property save failed:", err);
    },
  });

  /* ----------------------- SUBMIT ----------------------- */
  const setErrorMessage = (zodErrors: any) => {
    const errors: BasicErrors = {};
    if (zodErrors && Array.isArray(zodErrors)) {
      zodErrors.forEach((issue) => {
        const fieldName = issue.path[
          issue.path.length - 1
        ] as keyof BasicErrors;

        if (!errors[fieldName]) {
          errors[fieldName] = issue.message;
        }
      });
    }

    // Update your state
    setBasicErrors(errors);

    console.log(errors, "<--- Processed Zod Errors");

    // Return true if no errors, false if errors exist
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = () => {
    const getPropertyPayload = () => ({
      ...property,
      property_owner: ownerInfo,
      property_details: {
        basic: basicDetails,
        rent_details: rentDetails,
        features: propertyFeatures,
        interior: interiorPayload,
        outdoor: outdoorPayload,
        // amenities_features: aminityDataState,
        amenities_features: [],
        additional_information: additionalInfo,
      },
    });
    const payload = getPropertyPayload();
    console.log(payload, "<----Payload");
    const validation = addPropertyValidateSchema.safeParse(payload);
    // console.log(validation?.error?.issues, "<---validate ");
    if (!validation.success) {
      setErrorMessage(validation.error.issues);
    } else {
      setBasicErrors({});
      savePropertyMutation.mutate(payload);
    }
  };

  /* ----- LOAD MASTER DATA ----------*/
  const {
    data: masterData,
    isLoading: isMasterLoading,
    isError: isMasterError,
    error: masterError,
  } = useQuery({
    queryKey: ["masterPropertyData"],
    queryFn: getMasterDataProperty,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });

  // console.log(masterData?.result?.outdoor_features, "<---masterData?.result?.outdoor_features")

  /* ----------------------- RENDER TAB ----------------------- */

  const renderComponent = useCallback(
    (id: string) => {
      if (isMasterLoading) {
        return <div>Loading...</div>;
      }

      if (isMasterError) {
        return <div>Error...</div>;
      }
      switch (id) {
        case "0": {
          return (
            <Suspense fallback={<div>Loading form sections...</div>}>

              <PropertyBasics
                basicDetails={basicDetails}
                setBasicDetails={setBasicDetails}
                MasterValues={!isMasterLoading ? masterData?.result : null}
                errors={basicErrors}
                setErrors={setBasicErrors}
              />

            </Suspense>
          );
        }
        case "1":
          return (
            <PropertyDetails
              rentDetails={rentDetails}
              setRentDetails={setRentDetails}
              errors={basicErrors}
              setErrors={setBasicErrors}
            />
          );
        case "2":
          return (
            <PropertyFeatures
              propertyFeatures={propertyFeatures}
              setPropertyFeatures={setPropertyFeatures}
              errors={basicErrors}
              setErrors={setBasicErrors}
            />
          );
        case "3":
          return (
            <InteriorFeatures
              interiorPayload={interiorPayload}
              setInteriorPayload={setInteriorPayload}
              MasterValues={!isMasterLoading ? masterData?.result : null}
              errors={basicErrors}
              setErrors={setBasicErrors}
            />
          );
        case "4": {
          return (
            <OutdoorFeatures
              outdoorPayload={outdoorPayload}
              setOutdoorPayload={setOutdoorPayload}
              outdoorMaster={!isMasterLoading ? masterData?.result : null}
              errors={basicErrors}
              setErrors={setBasicErrors}
            />
          );
        }
        // case "5":
        //   return (
        //     <DynamicAminities
        //       aminityDataState={aminityDataState}
        //       SetAminityDataState={SetAminityDataState}
        //     />
        //   );
        case "6":
          return (
            <AdditionalInformation
              additionalInfo={additionalInfo}
              setAdditionalInfo={setAdditionalInfo}
            />
          );
        case "7":
          return (
            <PropertyDocument
              documents={documents}
              setDocuments={setDocuments}
            />
          );

        case "8":
          if (user?.role === "PROPERTY MANAGER") {
            return (
              <OwnerDetailsByPM
                ownerInfo={ownerInfo}
                setOwnerInfo={setOwnerInfo}
              />
            )
          };
        default:
          return null;
      }
    },
    [
      basicDetails,
      rentDetails,
      propertyFeatures,
      interiorPayload,
      outdoorPayload,
      // aminityDataState,
      additionalInfo,
      ownerInfo,
      documents,
      basicErrors,
      isMasterLoading
    ],
  );

  const isSaving =
    savePropertyMutation.isPending || uploadDocumentsMutation.isPending;

  /* ----------------------- UI ----------------------- */

  return (
    <div className="flex flex-col gap-6 my-5">
      <div className="flex flex-col gap-6">
        {propertyBasicTab.filter((tab) => {
          if (tab.id === "8") {
            return user?.role === "PROPERTY MANAGER";
          }
          return true;
        })
          .map((tab) => (
            <div
              key={tab.id}
              className="bg-white rounded-lg shadow-sm hover:shadow-lg p-6 flex flex-col gap-5"
            >
              <div className="text-xl font-medium text-primary px-2">
                {tab.tab}
              </div>
              <div className="px-4 mt-4">{renderComponent(tab.id)}</div>
            </div>
          ))}
      </div>

      <div className="flex justify-end">
        <Button variant="secondary" disabled={isSaving} onClick={handleSubmit}>
          {isSaving ?
            `Saving & ${property_details ? "editing" : "Adding"}...` :
            `Save & ${property_details ? "edit" : "add"} Property`}
        </Button>
      </div>
      {basicErrors && (
        <p className=" flex justify-end text-sm text-red-500">
          {basicErrors[Object.keys(basicErrors)[0] as keyof BasicErrors]}
        </p>
      )}
    </div>
  );
};

export default PropertyAddForm;
