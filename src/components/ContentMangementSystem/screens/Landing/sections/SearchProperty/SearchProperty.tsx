import React, { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../../ui/select";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Button } from "../../../../../ui/button";
import {
  MapPin,
  Search,
  Grid,
  List,
  Filter,
} from "lucide-react";
import { Input } from "../../../../../ui/input";
import { IMAGES } from "../../../../../../assets/index";
import GoogleMapComponent from "../../../../../ChildComponent/GoogleMapComponent";
import PropertyHorizontal from "../../../../../ChildComponent/PropertyHorizontal";
// import Property from "../../../../../ChildComponent/Property";
import { useInView } from 'react-intersection-observer';
// import Slider from 'react-slick';
import Property from '../../../../../ChildComponent/Common/Property';
import { cn } from '../../../../../lib/utils';
import { useNavigate } from 'react-router-dom';
import { toast } from '../../../../../../custom-hooks/use-toast';
import { PropertyFilter } from '../../../../../../components/Tenent/ExploreProperties';
import { useQuery } from '@tanstack/react-query';
import { getAllPropertyCMS } from '../../../../../../actions/property';
import { useGoogleMaps } from '../../../../../../context/GoogleMapsProvider';

const defaultFilter: PropertyFilter = {
  start_price: "",
  end_price: "0",
  type: "",
  search: "",
};

const SearchProperty = () => {
  const navigate = useNavigate();

  const [searchRef, inSearchView] = useInView({
    triggerOnce: true, // Trigger animation only once
    threshold: 0.3, // Trigger when 10% of the image is visible
  });
  const [leftRef, inLeftView] = useInView({
    triggerOnce: true, // Trigger animation only once
    threshold: 0.3, // Trigger when 10% of the image is visible
  });
  const [rightRef, inRightView] = useInView({
    triggerOnce: true, // Trigger animation only once
    threshold: 0.3, // Trigger when 10% of the image is visible
  });
  const properties = [
    {
      "_id": "6937da766147ed614c36fd21",
      "property_id": null,
      "is_complete": false,
      "is_active": true,
      "created_by": null,
      "is_send_request": false,
      "is_wishlist": false,
      "property_details": {
        "basic": {
          "property_name": "SFT TEST PROPERTY",
          "property_type_id": {
            "_id": "6909b9df6bd39a48cf4ff5ef",
            "name": "House",
            "slug": "House",
            "description": "House Description",
            "is_active": true,
            "__v": 0
          },
          "is_available_for_rent": true,
          "subrup": "DOWNTOWN",
          "state": "west bengal",
          "pincode": "700156",
          "region_area": "Newtown",
          "country": "",
          "latitude": null,
          "longitude": null,
          "full_address": "Gate 2, Candor, Newtown",
          "_id": "6937da766147ed614c36fd23"
        },
        "rent_details": {
          "weekly_rent_price": 2000,
          "monthly_rent_price": null,
          "bond_or_security_deposit": 10000,
          "available_from": "2025-12-09T08:05:17.179Z",
          "rent_details_lease_terms": "6",
          "_id": "6937da986147ed614c36fd2c"
        },
        "features": {
          "no_of_bedrooms": 4,
          "no_of_bathrooms": 4,
          "parking": "Car spacing",
          "land_size": "1200",
          "floor_area": "1000",
          "_id": "6937dab56147ed614c36fd31"
        },
        "interior": {
          "heating_and_cooling": [
            "Air conditioning",
            "Fans",
            "Ducted Heating"
          ],
          "kitchen_appliances": [
            "Dishwasher",
            "Oven",
            "Stove",
            "Pantry"
          ],
          "laundry_features": [
            "In-unit",
            "Shared",
            "Dryer",
            "Washer"
          ],
          "_id": "6937dac56147ed614c36fd37"
        },
        "outdoor": {
          "outdoor_entering_area": [
            "Storage"
          ],
          "balcony": true,
          "deck": true,
          "courtyard": true,
          "garden": true,
          "yard": false,
          "_id": "6937dae56147ed614c36fd45"
        },
        "additional_information": {
          "pet_allowed": false,
          "description": "What is Lorem Ipsum?\nLorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
          "energy_rating": 4,
          "_id": "6937dae56147ed614c36fd46"
        },
        "_id": "6937da766147ed614c36fd22"
      },
      "createdAt": "2025-12-09T08:14:46.019Z",
      "updatedAt": "2025-12-09T08:16:37.985Z",
      "__v": 0
    },
    {
      "_id": "6937d9296147ed614c36fce9",
      "property_id": null,
      "is_complete": false,
      "is_active": true,
      "created_by": null,
      "is_send_request": false,
      "is_wishlist": false,
      "property_details": {
        "basic": {
          "property_name": "Chinmoyee",
          "property_type_id": {
            "_id": "6909b9df6bd39a48cf4ff5ef",
            "name": "House",
            "slug": "House",
            "description": "House Description",
            "is_active": true,
            "__v": 0
          },
          "is_available_for_rent": true,
          "subrup": "RIVERSIDE",
          "state": "Uttar Pradesh",
          "pincode": "700019",
          "region_area": "Sector vIII",
          "country": "",
          "latitude": null,
          "longitude": null,
          "full_address": "12/1, Dhaniapara, Barrackpore, Kolkata",
          "_id": "6937d9296147ed614c36fceb"
        },
        "rent_details": {
          "weekly_rent_price": 1200,
          "monthly_rent_price": null,
          "bond_or_security_deposit": 200,
          "available_from": "2025-12-02T18:30:00.000Z",
          "rent_details_lease_terms": "15",
          "_id": "6937d9356147ed614c36fcf4"
        },
        "features": {
          "no_of_bedrooms": 7,
          "no_of_bathrooms": 1,
          "parking": "Mechanical parking",
          "land_size": "349",
          "floor_area": "8980",
          "_id": "6937d9416147ed614c36fcf9"
        },
        "interior": {
          "heating_and_cooling": [
            "Air conditioning",
            "Ducted Heating"
          ],
          "kitchen_appliances": [
            "Oven"
          ],
          "laundry_features": [
            "Dryer"
          ],
          "_id": "6937d9496147ed614c36fcff"
        },
        "outdoor": {
          "outdoor_entering_area": [
            "Storage"
          ],
          "balcony": true,
          "deck": false,
          "courtyard": false,
          "garden": false,
          "yard": false,
          "_id": "6937d9516147ed614c36fd0d"
        },
        "additional_information": {
          "pet_allowed": false,
          "description": "ASDFGHJKL;",
          "energy_rating": 3,
          "_id": "6937d9516147ed614c36fd0e"
        },
        "_id": "6937d9296147ed614c36fcea"
      },
      "createdAt": "2025-12-09T08:09:13.837Z",
      "updatedAt": "2025-12-09T08:14:22.531Z",
      "__v": 0
    },
    {
      "_id": "693696e5c183499222c1013a",
      "is_complete": false,
      "is_active": true,
      "created_by": null,
      "is_send_request": true,
      "is_wishlist": true,
      "property_details": {
        "basic": {
          "property_name": "sssssssss",
          "property_type_id": null,
          "is_available_for_rent": true,
          "subrup": "CENTER",
          "state": "West Bengal",
          "pincode": "700122",
          "region_area": "Kolkata",
          "country": "West Bengal",
          "latitude": null,
          "longitude": null,
          "full_address": "16/1, Dhaniapara 5th lane",
          "_id": "693696e5c183499222c1013c"
        },
        "rent_details": {
          "weekly_rent_price": 2000,
          "monthly_rent_price": 10000,
          "bond_or_security_deposit": 12,
          "available_from": "2025-12-11T00:00:00.000Z",
          "rent_details_lease_terms": "6",
          "_id": "693696e5c183499222c1013d"
        },
        "features": {
          "no_of_bedrooms": 2,
          "no_of_bathrooms": 1,
          "parking": "Mechanical parking",
          "land_size": "12",
          "floor_area": "11",
          "_id": "693696e5c183499222c1013e"
        },
        "interior": {
          "heating_and_cooling": [
            "Air conditioning",
            "Fans",
            "Ducted Heating"
          ],
          "kitchen_appliances": [
            "Dishwasher",
            "Oven",
            "Stove",
            "Pantry"
          ],
          "laundry_features": [
            "In-unit",
            "Shared",
            "Dryer",
            "Washer"
          ],
          "_id": "693696e5c183499222c1013f"
        },
        "outdoor": {
          "outdoor_entering_area": [
            "Shed",
            "Storage"
          ],
          "balcony": true,
          "deck": true,
          "courtyard": true,
          "garden": true,
          "yard": true,
          "_id": "693696e5c183499222c10140"
        },
        "additional_information": {
          "pet_allowed": false,
          "description": "",
          "energy_rating": 4,
          "_id": "693696e5c183499222c10141"
        },
        "_id": "693696e5c183499222c1013b"
      },
      "createdAt": "2025-12-08T09:14:13.900Z",
      "updatedAt": "2025-12-09T07:23:33.937Z",
      "__v": 0
    },
    {
      "_id": "692feb332708a6441a642ac4",
      "is_available_for_rent": true,
      "is_complete": false,
      "is_active": true,
      "created_by": null,
      "is_send_request": true,
      "is_wishlist": true,
      "property_details": {
        "basic": {
          "property_name": "Gleneries",
          "property_type_id": {
            "_id": "6912f0796bd39a48cf4ff764",
            "name": "Granny Appartment",
            "slug": "Granny-Appartment",
            "description": "Granny Appartment description",
            "is_active": true,
            "__v": 0
          },
          "is_available_for_rent": true,
          "subrup": "GREENFIELD",
          "state": "Uttar Pradesh",
          "pincode": "700012",
          "region_area": "Sector vIII",
          "country": "",
          "latitude": null,
          "longitude": null,
          "full_address": "123, 3rd floor, Wetty chol, Ranaghatti",
          "_id": "692feb332708a6441a642ac6"
        },
        "rent_details": {
          "weekly_rent_price": 6000,
          "monthly_rent_price": null,
          "bond_or_security_deposit": 203,
          "available_from": "2025-12-19T18:30:00.000Z",
          "rent_details_lease_terms": "12",
          "_id": "692feb472708a6441a642acf"
        },
        "features": {
          "no_of_bedrooms": 7,
          "no_of_bathrooms": 5,
          "parking": "Mechanical parking",
          "land_size": "34900",
          "floor_area": "8980",
          "_id": "692feb602708a6441a642ad4"
        },
        "interior": {
          "heating_and_cooling": [
            "Air conditioning",
            "Fans",
            "Ducted Heating"
          ],
          "kitchen_appliances": [
            "Oven",
            "Stove"
          ],
          "laundry_features": [
            "Shared"
          ],
          "_id": "692feb932708a6441a642ae2"
        },
        "outdoor": {
          "outdoor_entering_area": [
            "Storage"
          ],
          "balcony": true,
          "deck": true,
          "courtyard": false,
          "garden": false,
          "yard": false,
          "_id": "692febcb2708a6441a642afc"
        },
        "additional_information": {
          "pet_allowed": false,
          "description": "Property description",
          "energy_rating": 3,
          "_id": "692febcb2708a6441a642afd"
        },
        "_id": "692feb332708a6441a642ac5"
      },
      "createdAt": "2025-12-03T07:48:03.341Z",
      "updatedAt": "2025-12-05T11:59:18.199Z",
      "__v": 0
    },
    {
      "_id": "692f4e172708a6441a642945",
      "is_available_for_rent": false,
      "is_complete": false,
      "is_active": true,
      "created_by": null,
      "is_send_request": true,
      "is_wishlist": true,
      "property_details": {
        "basic": {
          "property_name": "Sara jibon",
          "property_type_id": {
            "_id": "6912f0796bd39a48cf4ff764",
            "name": "Granny Appartment",
            "slug": "Granny-Appartment",
            "description": "Granny Appartment description",
            "is_active": true,
            "__v": 0
          },
          "is_available_for_rent": true,
          "subrup": "LAKESIDE",
          "state": "Uttar Pradesh",
          "pincode": "700015",
          "region_area": "Sector v",
          "country": "",
          "latitude": null,
          "longitude": null,
          "full_address": "dsfghjk,.",
          "_id": "692f4e172708a6441a642947"
        },
        "rent_details": {
          "weekly_rent_price": 1200,
          "monthly_rent_price": null,
          "bond_or_security_deposit": 122,
          "available_from": "2025-12-09T18:30:00.000Z",
          "rent_details_lease_terms": "12",
          "_id": "692f4e2b2708a6441a642950"
        },
        "features": {
          "no_of_bedrooms": 7,
          "no_of_bathrooms": 4,
          "parking": "Mechanical parking",
          "land_size": "341",
          "floor_area": "1123",
          "_id": "692f4e4a2708a6441a642955"
        },
        "interior": {
          "heating_and_cooling": [
            "Air conditioning"
          ],
          "kitchen_appliances": [
            "Stove"
          ],
          "laundry_features": [
            "Shared",
            "Washer"
          ],
          "_id": "692f4e532708a6441a64295b"
        },
        "outdoor": {
          "outdoor_entering_area": [
            "Storage",
            "Shed"
          ],
          "balcony": true,
          "deck": false,
          "courtyard": true,
          "garden": false,
          "yard": true,
          "_id": "692f4e712708a6441a642969"
        },
        "additional_information": {
          "pet_allowed": false,
          "description": "sdxfcgvhbjnkml,.",
          "energy_rating": 5,
          "_id": "692f4e712708a6441a64296a"
        },
        "_id": "692f4e172708a6441a642946"
      },
      "createdAt": "2025-12-02T20:37:43.837Z",
      "updatedAt": "2025-12-05T13:31:36.419Z",
      "__v": 0
    },
    {
      "_id": "692f4ccb2708a6441a642930",
      "is_available_for_rent": false,
      "is_complete": false,
      "is_active": true,
      "created_by": null,
      "is_send_request": false,
      "is_wishlist": true,
      "property_details": {
        "basic": {
          "property_name": "Alooooooooooo",
          "property_type_id": {
            "_id": "6909b9df6bd39a48cf4ff5ef",
            "name": "House",
            "slug": "House",
            "description": "House Description",
            "is_active": true,
            "__v": 0
          },
          "is_available_for_rent": true,
          "subrup": "WEST END",
          "state": "Odisa",
          "pincode": "700012",
          "region_area": "Sector v",
          "country": "",
          "latitude": null,
          "longitude": null,
          "full_address": "aASADFTY",
          "_id": "692f4ccb2708a6441a642932"
        },
        "rent_details": {
          "weekly_rent_price": 1200,
          "monthly_rent_price": null,
          "bond_or_security_deposit": 200,
          "available_from": "2025-12-03T18:30:00.000Z",
          "rent_details_lease_terms": "12",
          "_id": "692f4cde2708a6441a64293b"
        },
        "features": {
          "no_of_bedrooms": 3,
          "no_of_bathrooms": 40,
          "parking": "Mechanical parking",
          "land_size": "34900",
          "floor_area": "214291",
          "_id": "692f4ccb2708a6441a642934"
        },
        "interior": {
          "heating_and_cooling": [
            "Air conditioning",
            "Ducted Heating",
            "Fans"
          ],
          "kitchen_appliances": [
            "Oven",
            "Stove",
            "Dishwasher",
            "Pantry"
          ],
          "laundry_features": [
            "Dryer",
            "Shared",
            "In-unit",
            "Washer"
          ],
          "_id": "692f4ccb2708a6441a642935"
        },
        "outdoor": {
          "outdoor_entering_area": [
            "Shed",
            "Storage"
          ],
          "balcony": true,
          "deck": true,
          "courtyard": true,
          "garden": true,
          "yard": true,
          "_id": "692f58332708a6441a6429f3"
        },
        "additional_information": {
          "pet_allowed": false,
          "description": "dfghjkl;",
          "energy_rating": 5,
          "_id": "692f4ccb2708a6441a642937"
        },
        "_id": "692f4ccb2708a6441a642931"
      },
      "createdAt": "2025-12-02T20:32:11.700Z",
      "updatedAt": "2025-12-05T13:31:50.844Z",
      "__v": 0
    },
    {
      "_id": "692f4c382708a6441a642920",
      "is_available_for_rent": false,
      "is_complete": false,
      "is_active": true,
      "created_by": null,
      "is_send_request": true,
      "is_wishlist": false,
      "property_details": {
        "basic": {
          "property_name": "Chinmoyee",
          "property_type_id": {
            "_id": "6912f0796bd39a48cf4ff764",
            "name": "Granny Appartment",
            "slug": "Granny-Appartment",
            "description": "Granny Appartment description",
            "is_active": true,
            "__v": 0
          },
          "is_available_for_rent": false,
          "subrup": "OAKWOOD",
          "state": "Rajastan",
          "pincode": "700019",
          "region_area": "Sector vIII",
          "country": "",
          "latitude": null,
          "longitude": null,
          "full_address": "xcvbhnjmkl,",
          "_id": "692f4c382708a6441a642922"
        },
        "rent_details": {
          "weekly_rent_price": 120,
          "monthly_rent_price": null,
          "bond_or_security_deposit": 2000,
          "available_from": "2025-12-18T18:30:00.000Z",
          "rent_details_lease_terms": "15",
          "_id": "692f4c4b2708a6441a64292b"
        },
        "features": {
          "no_of_bedrooms": null,
          "no_of_bathrooms": null,
          "parking": null,
          "land_size": null,
          "floor_area": null,
          "_id": "692f4c382708a6441a642924"
        },
        "interior": {
          "heating_and_cooling": [],
          "kitchen_appliances": [],
          "laundry_features": [],
          "_id": "692f4c382708a6441a642925"
        },
        "outdoor": {
          "outdoor_entering_area": [],
          "balcony": false,
          "deck": false,
          "courtyard": false,
          "garden": false,
          "yard": false,
          "_id": "692f4c382708a6441a642926"
        },
        "additional_information": {
          "pet_allowed": false,
          "description": null,
          "energy_rating": null,
          "_id": "692f4c382708a6441a642927"
        },
        "_id": "692f4c382708a6441a642921"
      },
      "createdAt": "2025-12-02T20:29:44.780Z",
      "updatedAt": "2025-12-05T09:35:25.265Z",
      "__v": 0
    },
    {
      "_id": "692f4ad02708a6441a642910",
      "is_available_for_rent": false,
      "is_complete": false,
      "is_active": true,
      "created_by": null,
      "is_send_request": false,
      "is_wishlist": false,
      "property_details": {
        "basic": {
          "property_name": "Alooooooooooo",
          "property_type_id": {
            "_id": "6912f0796bd39a48cf4ff764",
            "name": "Granny Appartment",
            "slug": "Granny-Appartment",
            "description": "Granny Appartment description",
            "is_active": true,
            "__v": 0
          },
          "is_available_for_rent": true,
          "subrup": "SOUTH PARK",
          "state": "Odisa",
          "pincode": "700015",
          "region_area": "Sector v",
          "country": "",
          "latitude": null,
          "longitude": null,
          "full_address": "asADzfghyjk",
          "_id": "692f4ad02708a6441a642912"
        },
        "rent_details": {
          "weekly_rent_price": 1200,
          "monthly_rent_price": null,
          "bond_or_security_deposit": 200,
          "available_from": "2025-12-03T18:30:00.000Z",
          "rent_details_lease_terms": "9",
          "_id": "692f4ae22708a6441a64291b"
        },
        "features": {
          "no_of_bedrooms": null,
          "no_of_bathrooms": null,
          "parking": null,
          "land_size": null,
          "floor_area": null,
          "_id": "692f4ad02708a6441a642914"
        },
        "interior": {
          "heating_and_cooling": [],
          "kitchen_appliances": [],
          "laundry_features": [],
          "_id": "692f4ad02708a6441a642915"
        },
        "outdoor": {
          "outdoor_entering_area": [],
          "balcony": false,
          "deck": false,
          "courtyard": false,
          "garden": false,
          "yard": false,
          "_id": "692f4ad02708a6441a642916"
        },
        "additional_information": {
          "pet_allowed": false,
          "description": null,
          "energy_rating": null,
          "_id": "692f4ad02708a6441a642917"
        },
        "_id": "692f4ad02708a6441a642911"
      },
      "createdAt": "2025-12-02T20:23:44.444Z",
      "updatedAt": "2025-12-02T20:24:02.158Z",
      "__v": 0
    },
    {
      "_id": "692f407c2708a6441a64281c",
      "is_available_for_rent": false,
      "is_complete": false,
      "is_active": true,
      "created_by": null,
      "is_send_request": false,
      "is_wishlist": false,
      "property_details": {
        "basic": {
          "property_name": "ami tumi",
          "property_type_id": {
            "_id": "6912f0796bd39a48cf4ff764",
            "name": "Granny Appartment",
            "slug": "Granny-Appartment",
            "description": "Granny Appartment description",
            "is_active": true,
            "__v": 0
          },
          "is_available_for_rent": false,
          "subrup": "MEADOWVILLE",
          "state": "west bengal",
          "pincode": "90699",
          "region_area": "TAS",
          "country": "",
          "latitude": null,
          "longitude": null,
          "full_address": "Facere sit ut qui n",
          "_id": "692f407c2708a6441a64281e"
        },
        "rent_details": {
          "weekly_rent_price": 12345,
          "monthly_rent_price": null,
          "bond_or_security_deposit": 2345,
          "available_from": "2025-12-10T18:30:00.000Z",
          "rent_details_lease_terms": "6",
          "_id": "692f407c2708a6441a64281f"
        },
        "features": {
          "no_of_bedrooms": null,
          "no_of_bathrooms": null,
          "parking": null,
          "land_size": null,
          "floor_area": null,
          "_id": "692f407c2708a6441a642820"
        },
        "interior": {
          "heating_and_cooling": [],
          "kitchen_appliances": [],
          "laundry_features": [],
          "_id": "692f407c2708a6441a642821"
        },
        "outdoor": {
          "outdoor_entering_area": [],
          "balcony": false,
          "deck": false,
          "courtyard": false,
          "garden": false,
          "yard": false,
          "_id": "692f407c2708a6441a642822"
        },
        "additional_information": {
          "pet_allowed": false,
          "description": null,
          "energy_rating": null,
          "_id": "692f407c2708a6441a642823"
        },
        "_id": "692f407c2708a6441a64281d"
      },
      "createdAt": "2025-12-02T19:39:40.979Z",
      "updatedAt": "2025-12-02T19:39:57.023Z",
      "__v": 0
    },
    {
      "_id": "692f3b162708a6441a6427f2",
      "is_available_for_rent": false,
      "is_complete": false,
      "is_active": true,
      "created_by": null,
      "is_send_request": false,
      "is_wishlist": false,
      "property_details": {
        "basic": {
          "property_name": "awertyuiop[]",
          "property_type_id": {
            "_id": "6912f0796bd39a48cf4ff764",
            "name": "Granny Appartment",
            "slug": "Granny-Appartment",
            "description": "Granny Appartment description",
            "is_active": true,
            "__v": 0
          },
          "is_available_for_rent": false,
          "subrup": "GREENFIELD",
          "state": "west bengal",
          "pincode": "700019",
          "region_area": "Sector vIII",
          "country": "",
          "latitude": null,
          "longitude": null,
          "full_address": "sadfghjkl;'\n",
          "_id": "692f3b162708a6441a6427f4"
        },
        "rent_details": {
          "weekly_rent_price": null,
          "monthly_rent_price": null,
          "bond_or_security_deposit": null,
          "available_from": null,
          "rent_details_lease_terms": null,
          "_id": "692f3b162708a6441a6427f5"
        },
        "features": {
          "no_of_bedrooms": null,
          "no_of_bathrooms": null,
          "parking": null,
          "land_size": null,
          "floor_area": null,
          "_id": "692f3b162708a6441a6427f6"
        },
        "interior": {
          "heating_and_cooling": [],
          "kitchen_appliances": [],
          "laundry_features": [],
          "_id": "692f3b162708a6441a6427f7"
        },
        "outdoor": {
          "outdoor_entering_area": [],
          "balcony": false,
          "deck": false,
          "courtyard": false,
          "garden": false,
          "yard": false,
          "_id": "692f3b162708a6441a6427f8"
        },
        "additional_information": {
          "pet_allowed": false,
          "description": null,
          "energy_rating": null,
          "_id": "692f3b162708a6441a6427f9"
        },
        "_id": "692f3b162708a6441a6427f3"
      },
      "createdAt": "2025-12-02T19:16:38.126Z",
      "updatedAt": "2025-12-02T19:16:38.126Z",
      "__v": 0
    },
    {
      "_id": "692f3a602708a6441a6427e6",
      "is_available_for_rent": false,
      "is_complete": false,
      "is_active": true,
      "created_by": null,
      "is_send_request": false,
      "is_wishlist": false,
      "property_details": {
        "basic": {
          "property_name": "Alo9",
          "property_type_id": null,
          "is_available_for_rent": false,
          "subrup": "LAKESIDE",
          "state": "west bengal",
          "pincode": "700015",
          "region_area": "Sector v",
          "country": "",
          "latitude": null,
          "longitude": null,
          "full_address": "zfdghjkl;",
          "_id": "692f3a602708a6441a6427e8"
        },
        "rent_details": {
          "weekly_rent_price": null,
          "monthly_rent_price": null,
          "bond_or_security_deposit": null,
          "available_from": null,
          "rent_details_lease_terms": null,
          "_id": "692f3a602708a6441a6427e9"
        },
        "features": {
          "no_of_bedrooms": null,
          "no_of_bathrooms": null,
          "parking": null,
          "land_size": null,
          "floor_area": null,
          "_id": "692f3a602708a6441a6427ea"
        },
        "interior": {
          "heating_and_cooling": [],
          "kitchen_appliances": [],
          "laundry_features": [],
          "_id": "692f3a602708a6441a6427eb"
        },
        "outdoor": {
          "outdoor_entering_area": [],
          "balcony": false,
          "deck": false,
          "courtyard": false,
          "garden": false,
          "yard": false,
          "_id": "692f3a602708a6441a6427ec"
        },
        "additional_information": {
          "pet_allowed": false,
          "description": null,
          "energy_rating": null,
          "_id": "692f3a602708a6441a6427ed"
        },
        "_id": "692f3a602708a6441a6427e7"
      },
      "createdAt": "2025-12-02T19:13:36.160Z",
      "updatedAt": "2025-12-02T19:13:36.160Z",
      "__v": 0
    },
    {
      "_id": "692f38f62708a6441a6427a8",
      "is_available_for_rent": false,
      "is_complete": false,
      "is_active": true,
      "created_by": null,
      "is_send_request": false,
      "is_wishlist": false,
      "property_details": {
        "basic": {
          "property_name": "Annapurna",
          "property_type_id": null,
          "is_available_for_rent": false,
          "subrup": "LAKESIDE",
          "state": "west bengal",
          "pincode": "700015",
          "region_area": "Sector v",
          "country": "",
          "latitude": null,
          "longitude": null,
          "full_address": "SZdxfghjkl;'sdfghjkl;'\ncghjkl;",
          "_id": "692f38f62708a6441a6427aa"
        },
        "rent_details": {
          "weekly_rent_price": 1200,
          "monthly_rent_price": null,
          "bond_or_security_deposit": 200,
          "available_from": "2025-12-08T18:30:00.000Z",
          "rent_details_lease_terms": "6",
          "_id": "692f39072708a6441a6427b3"
        },
        "features": {
          "no_of_bedrooms": 7,
          "no_of_bathrooms": null,
          "parking": "Mechanical parking",
          "land_size": "341",
          "floor_area": "126",
          "_id": "692f39252708a6441a6427bc"
        },
        "interior": {
          "heating_and_cooling": [
            "Air conditioning",
            "Fans",
            "Ducted Heating"
          ],
          "kitchen_appliances": [
            "Stove",
            "Pantry"
          ],
          "laundry_features": [
            "Shared"
          ],
          "_id": "692f39342708a6441a6427c5"
        },
        "outdoor": {
          "outdoor_entering_area": [
            "Storage"
          ],
          "balcony": true,
          "deck": false,
          "courtyard": false,
          "garden": true,
          "yard": false,
          "_id": "692f399e2708a6441a6427da"
        },
        "additional_information": {
          "pet_allowed": false,
          "description": "Description of Property",
          "energy_rating": 5,
          "_id": "692f399e2708a6441a6427db"
        },
        "_id": "692f38f62708a6441a6427a9"
      },
      "createdAt": "2025-12-02T19:07:34.591Z",
      "updatedAt": "2025-12-02T19:10:22.418Z",
      "__v": 0
    },
    {
      "_id": "692f36762708a6441a64276a",
      "is_available_for_rent": false,
      "is_complete": false,
      "is_active": true,
      "created_by": null,
      "is_send_request": false,
      "is_wishlist": false,
      "property_details": {
        "basic": {
          "property_name": "Alo",
          "property_type_id": null,
          "is_available_for_rent": false,
          "subrup": "HILLTOP",
          "state": "Rajastan",
          "pincode": "700015",
          "region_area": "Sector v",
          "country": "",
          "latitude": null,
          "longitude": null,
          "full_address": "16/1 Utta pally",
          "_id": "692f36762708a6441a64276c"
        },
        "rent_details": {
          "weekly_rent_price": 1201,
          "monthly_rent_price": null,
          "bond_or_security_deposit": 201,
          "available_from": "2025-12-21T18:30:00.000Z",
          "rent_details_lease_terms": "18",
          "_id": "692f368d2708a6441a642775"
        },
        "features": {
          "no_of_bedrooms": 4,
          "no_of_bathrooms": null,
          "parking": "Mechanical parking",
          "land_size": "349",
          "floor_area": "123",
          "_id": "692f36a52708a6441a64277e"
        },
        "interior": {
          "heating_and_cooling": [
            "Fans",
            "Ducted Heating"
          ],
          "kitchen_appliances": [
            "Dishwasher"
          ],
          "laundry_features": [
            "Dryer"
          ],
          "_id": "692f36b42708a6441a642787"
        },
        "outdoor": {
          "outdoor_entering_area": [
            "Storage",
            "Shed"
          ],
          "balcony": true,
          "deck": true,
          "courtyard": false,
          "garden": false,
          "yard": false,
          "_id": "692f37042708a6441a642798"
        },
        "additional_information": {
          "pet_allowed": false,
          "description": "zdxfghjkl;'",
          "energy_rating": 3,
          "_id": "692f37042708a6441a642799"
        },
        "_id": "692f36762708a6441a64276b"
      },
      "createdAt": "2025-12-02T18:56:54.189Z",
      "updatedAt": "2025-12-02T18:59:16.393Z",
      "__v": 0
    }
  ]
  const [view, setView] = useState("horizontal");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedType, setSelectedType] = useState<string>("");
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>("");

  const defaultCenter = { lat: -25.2744, lng: 133.7751 };
  const [mapZoom, setMapZoom] = useState(4);
  const { isLoaded, loadError } = useGoogleMaps();
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number }>(defaultCenter);





  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [filter, setFilter] = useState<PropertyFilter>(defaultFilter);

  const { data: property, isLoading } = useQuery({
    queryKey: ["allProperty", currentPage, limit, filter],
    queryFn: () => getAllPropertyCMS({ page: currentPage, limit, ...filter, }),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const handleCardClick = (id: number) => {
    setSelectedId(selectedId === id ? null : id); // Toggle selection
  };

  const handleRedirectFilter = () => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      navigate('/explore-properties')
    } else {
      toast({
        title: `Please Login to your account`,
        description: `Explore the advance search & other features.`,
        variant: "success",
      });
      navigate('/login');
    }
  }
  return (
    <>
      {
        property && property?.success ? <div className="bg-accent py-8">
          <div className={`w-full mx-auto px-4 sm:px-6 lg:px-8 ${inSearchView ? 'animate__animated animate__slideInLeft' : ''}`} ref={searchRef}>
            {/* Search Filters */}
            <div className="rounded-lg mb-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <div>
                  {/* <label className="block text-sm font-medium text-foreground mb-2">Location</label> */}
                  <div className="relative">
                    <Input
                      placeholder="Location"
                      className="pr-10 rounded-[99px] bg-white h-10"
                    />
                    <MapPin className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                  </div>
                </div>
                <div>
                  {/* <label className="block text-sm font-medium text-foreground mb-2">Type</label> */}
                  <Select
                    value={selectedType}
                    onValueChange={(value) => setSelectedType(value)}>
                    <SelectTrigger className="w-full rounded-[99px] bg-white h-10">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="house">House</SelectItem>
                      <SelectItem value="apartment">Apartment</SelectItem>
                      <SelectItem value="villa">Villa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  {/* <label className="block text-sm font-medium text-foreground mb-2">Price</label> */}
                  <Select
                    value={selectedPriceRange}
                    onValueChange={(value) => setSelectedPriceRange(value)}
                  >
                    <SelectTrigger className="w-full rounded-[99px] bg-white h-10">
                      <SelectValue placeholder="Price" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0-500">$0 - $500</SelectItem>
                      <SelectItem value="500-1000">$500 - $1000</SelectItem>
                      <SelectItem value="1000+">$1000+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="px-4 bg-white hover:bg-blue-700 rounded-[99px] h-10"
                    onClick={() => {
                      // Split the "0-500" string into start and end values
                      const [start, end] = selectedPriceRange.split("-");

                      setFilter((prev) => ({
                        ...prev,
                        type: selectedType || undefined,
                        start_price: start || "",
                        end_price: end || "0",
                      }));
                    }}
                  >
                    Search
                    <Search className="h-4 w-4" />
                  </Button>
                  <Button
                    className="bg-white hover:bg-blue-700 text-dark flex-1 rounded-[99px] h-10"
                    onClick={handleRedirectFilter}
                  >
                    Search advanced
                    <Filter className="h-4 w-4 mr-2" />
                  </Button>

                </div>
              </div>
            </div>
          </div>
          <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 sm:bg-white md:py-8">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Property Listings */}
              <div className={`lg:w-2/5 ${inLeftView ? 'animate__animated animate__slideInLeft' : ''}`} ref={leftRef}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {property?.pagination?.total_records} properties
                  </h2>
                  <div className="flex items-center gap-4">
                    <Select defaultValue="default">
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="default">Sort by Default</SelectItem>
                        <SelectItem value="price-low">
                          Price: Low to High
                        </SelectItem>
                        <SelectItem value="price-high">
                          Price: High to Low
                        </SelectItem>
                        <SelectItem value="newest">Newest First</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="flex border rounded-lg">
                      <Button variant="ghost" size="sm" id="vertical_view" onClick={() => setView("vertical")}
                        className={`px-3 ${view === "vertical" ? "bg-blue-500" : ""}`}>
                        <Grid className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" id="horizontal_view" onClick={() => setView("horizontal")}
                        className={`px-3 ${view === "horizontal" ? "bg-blue-500" : ""}`}>
                        <List className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  {view === "horizontal" && <div id="horizontal_slider"
                    className={cn("h-[500px] overflow-y-auto thin-scrollbar ",
                      // view === "horizontal" ? "block" : "hidden"
                    )}
                  // style={{
                  //   display: view === "horizontal" ? "block" : "none", height: "500px",
                  //   overflowY: "auto",
                  // }}
                  >
                    {property && property?.result.length > 0 && property?.result.map((property: any, index: number) => (
                      <PropertyHorizontal
                        id={property?._id}
                        property={property}
                      // onCardClick={() => handleCardClick(property?._id)}
                      />
                    ))}
                  </div>}
                  {view === "vertical" && <div id="vertical_slider"
                    className={cn("h-[500px] overflow-y-auto thin-scrollbar ",
                      // view === "vertical" ? "block" : "hidden"
                    )}
                  // style={{
                  //   display: view === "vertical" ? "block" : "none", height: "500px",
                  //   overflowY: "auto",
                  // }}
                  >
                    <div className="grid grid-cols-2">
                      {property && property?.result.length > 0 && property?.result.map((property: any, index: number) => (
                        <div key={property._id} className="px-2 col-span-1 mb-5">
                          <Property
                            id={property?._id}
                            property={property}
                          // onCardClick={() => handleCardClick(property?._id)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>}
                </div>
              </div>

              {/* Map */}
              <div className={`lg:w-3/5 ${inRightView ? 'animate__animated animate__slideInRight' : ''}`} ref={rightRef}>
                {/* <GoogleMapComponent center={mapCenter} zoom={mapZoom} userLocation={userLocation} /> */}
                {isLoaded ? <GoogleMapComponent center={mapCenter} zoom={mapZoom} userLocation={userLocation} propertiesData={property?.result} /> : <div>Map Loading...</div>}

              </div>
            </div>
          </div>
        </div> : null
      }

    </>
  );
}
export default SearchProperty;