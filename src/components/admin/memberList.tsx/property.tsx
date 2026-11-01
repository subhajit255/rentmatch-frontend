import React, { useState } from 'react';
import { useSheet } from '../../../context/sheetProvider';
import { Sparkles, TrendingUp } from 'lucide-react';
import { Button } from '../../ui/button';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '../../../custom-hooks/use-toast';
import { useModal } from '../../../context/modalProvider';
import { upgradeFeturedData } from '../../../actions/common';

// Minimal clean property listing component
const PropertiesFromOwner = ({
    _id,
    propertyList,
    propertyPage,
    propertyLimit,
    propertyTotalpage,
    setPropertyPage,
    setPropertyLimit
}: {
    _id: string;
    propertyList: any[];
    propertyPage: any
    propertyLimit: any
    propertyTotalpage: any
    setPropertyPage: (page: number) => void;
    setPropertyLimit: (limit: number) => void;
}) => {
    const queryClient = useQueryClient();
    const { openModal, setParameters, closeModal } = useModal();

    // console.log(propertyList, "<?? list")

    const { openSheet, setParameters: setDrawerParameters } = useSheet();

    const { mutate: updateToisFeatured } = useMutation({
        mutationFn: upgradeFeturedData,
        onSuccess: () => {
            // This will trigger refetch of
            queryClient.invalidateQueries({ queryKey: ['member-property-details'] });
            toast({
                title: `Property listed to featured`,
                description: ``,
                variant: "success",
            })
            closeModal()
        },
        onError: (error) => {
            // setServerError(error.response?.data?.message || 'Can not able to add user.');
            toast({
                title: `Delete Failed`,
                description: `Could not delete the property type. Please check try again.`,
                variant: "error",
            })
        },
    });

    const isFeatureChange = (id: string) => {
        openModal("remove")
        setParameters({
            header: `Are you sure you want to featured this property?`,
            actionBtn: "Confirm",
            outlineBtn: true,
            description: ``,
            fn: () => updateToisFeatured(id)
        })
    }

    if (!propertyList || propertyList.length === 0) {
        return (
            <div className="p-8 text-center text-gray-500">
                No properties found.
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-2xl font-bold mb-6">Your Properties</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {propertyList.map((property) => {
                    const basic = property.property_details?.basic || {};
                    const rent = property.property_details?.rent_details || {};

                    const name = basic.property_name || 'Unnamed Property';
                    const location = basic.full_address || basic.region_area || basic.subrup || 'Location not specified';
                    const price = rent.weekly_rent_price
                        ? `$${rent.weekly_rent_price}/week`
                        : rent.monthly_rent_price
                            ? `$${rent.monthly_rent_price}/month`
                            : 'Price on request';

                    const postedDate = property.createdAt
                        ? new Date(property.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                        })
                        : '—';

                    // Placeholder image (you can replace with real property image when available)
                    const imageUrl = basic.img
                        ? `/api/images/${basic.img}` // adjust according to your backend
                        : 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop';

                    return (
                        <div
                            key={property._id}
                            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200"
                        >
                            {/* Image */}
                            <div className="relative h-48 overflow-hidden">
                                <img
                                    src={imageUrl}
                                    alt={name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src =
                                            'https://images.unsplash.com/photo-1560518883-2e5c3868c2a0?w=800&auto=format&fit=crop';
                                    }}
                                />
                                {/* Optional badge */}
                                <div className="absolute top-3 left-3 bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded">
                                    For Rent
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-5">
                                <h3 className="font-semibold text-lg mb-1 line-clamp-2">{name}</h3>
                                <p className="text-gray-600 text-sm mb-3 line-clamp-1">{location}</p>

                                <div className="flex justify-between items-center mb-4">
                                    <div className="text-xl font-bold text-green-700">{price}</div>
                                    <div className="text-xs text-gray-500">
                                        Posted: {postedDate}
                                    </div>
                                </div>

                                {/* View Details Button */}
                                <div className='flex gap-3'>
                                    <Button
                                        onClick={() => isFeatureChange(property?._id)}
                                        className='right-3 top-1 rounded-full w-10 h-9 p-0 cursor-pointer flex items-center jistify-center hover:bg-primary/20'
                                        variant="outline"
                                        title={`Feturered this property`}
                                    >
                                        <TrendingUp fill={property.isFetured ? 'yellow' : undefined} size={18} />
                                    </Button>
                                    <button
                                        onClick={() => {
                                            setDrawerParameters({
                                                id: property._id,
                                                property: property,
                                            });
                                            openSheet("propertyDetails");
                                        }}
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-colors"
                                    >
                                        View Details
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Pagination */}
            {/* {propertyTotalpage > 1 && (
                <div className="mt-10 flex items-center justify-center gap-4">
                    <button
                        onClick={() => {
                            const newPage = Math.max(1, propertyPage - 1);
                            setPropertyPage(newPage);
                            setPropertyPage(newPage);
                        }}
                        disabled={propertyPage === 1}
                        className="px-5 py-2 bg-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-300 transition"
                    >
                        Previous
                    </button>

                    <span className="text-sm font-medium">
                        Page {propertyPage} of {propertyTotalpage}
                    </span>

                    <button
                        onClick={() => {
                            const newPage = Math.min(propertyTotalpage, propertyPage + 1);
                            setPropertyPage(newPage);
                        }}
                        disabled={propertyPage === propertyTotalpage}
                        className="px-5 py-2 bg-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-300 transition"
                    >
                        Next
                    </button>
                </div>
            )} */}
        </div>
    );
};

export default PropertiesFromOwner;