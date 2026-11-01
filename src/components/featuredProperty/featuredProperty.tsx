import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useMemo } from 'react'
import Property from '../ChildComponent/Property';
import { getFeaturedProperty } from '../../actions/property';
import { IMAGES } from '../../assets';
import PropertyHorizontal from '../ChildComponent/PropertyHorizontal';
import { Button } from '../ui/button';
import { useModal } from '../../context/modalProvider';
import { upgradeFeturedData } from '../../actions/common';
import { toast } from '../../custom-hooks/use-toast';

function FeaturedProperty() {
    const [page, setPage] = React.useState(1);
    const [limit, setLimit] = React.useState(10);
    const [searchQuery, setSearchQuery] = React.useState("");
    const [searchTerm, setSearchTerm] = React.useState("");
    const [sortByFeatured, setSortByFeatured] = React.useState(false);

    const { openModal, setParameters, closeModal } = useModal();
    const queryClient = useQueryClient();



    const { data: featuredProperty, isLoading } = useQuery({
        queryKey: ["featured-properties"],
        queryFn: () => getFeaturedProperty({ page, limit, search: searchQuery }),
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
    });

    const { mutate: updateToisFeatured } = useMutation({
        mutationFn: upgradeFeturedData,
        onSuccess: () => {
            // This will trigger refetch of
            queryClient.invalidateQueries({ queryKey: ['featured-properties'] });
            queryClient.invalidateQueries({ queryKey: ['property-featured'] });
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




    console.log(featuredProperty?.result, "<---featuredProp")
    const list = featuredProperty?.result || [];

    const filteredAndSortedList = useMemo(() => {
        if (!list) return [];

        return list
            .filter((item: any) => {
                const name = item.property_details?.basic?.property_name?.toLowerCase() || "";
                return name.includes(searchTerm.toLowerCase());
            })
            .sort((a: any, b: any) => {
                if (sortByFeatured) {
                    // Sort so is_cms_featured: true comes first
                    return (a.is_cms_featured === b.is_cms_featured) ? 0 : a.is_cms_featured ? -1 : 1;
                }
                return 0;
            });
    }, [list, searchTerm, sortByFeatured]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center mt-10">
                <div className="flex justify-center items-center flex-col">
                    <img
                        src={IMAGES.error}
                        alt="Loading..."
                        className="mb-4 w-[50%]"
                    />
                    <p className="text-2xl">Loading featured properties...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="common-container max-w-7xl mx-auto px-4 py-8">
            {/* Search and Sort Controls */}
            <div className="flex flex-col md:flex-row gap-4 mb-8 items-center justify-between">
                <input
                    type="text"
                    placeholder="Search by property name..."
                    className="w-full md:max-w-sm p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#3b5998] outline-none"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

                <label className="flex items-center gap-2 cursor-pointer bg-white px-4 py-2 rounded-md border border-gray-300">
                    <input
                        type="checkbox"
                        checked={sortByFeatured}
                        onChange={(e) => setSortByFeatured(e.target.checked)}
                        className="w-4 h-4"
                    />
                    <span className="text-sm font-medium text-gray-700">Show Featured First</span>
                </label>
            </div>
            <div className="w-full">
                {/* Added gap and responsive grid settings */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-x-6 gap-y-10">
                    {filteredAndSortedList && filteredAndSortedList.length > 0 ? (
                        filteredAndSortedList.map((property: any, index: number) =>
                            property.property_details?.basic?.is_available_for_rent === true && (
                                // <div key={index} className="flex flex-col h-full bg-white rounded-lg">
                                <div key={index} className="flex flex-col mb-4 bg-white rounded-lg p-4 shadow-sm border border-card-border">

                                    {/* The property card itself */}
                                    <PropertyHorizontal
                                        id={property?._id}
                                        property={property}
                                    />

                                    {/* Button Container: mt-auto pushes the button to the bottom */}
                                    <div className="flex justify-end mt-4">
                                        {/* <Button className="bg-[#3b5998] hover:bg-[#2d4373] text-white px-6 py-2 rounded-md transition-all font-medium"> */}
                                        <Button
                                            onClick={() => isFeatureChange(property?._id)}
                                            className="bg-[#3b5998] hover:bg-[#2d4373] text-white px-6 py-2 rounded-md transition-all font-medium"
                                            variant="outline"
                                            title={`Feturered this property`}
                                        >
                                            {
                                                property.is_cms_featured ? 'Unmark Featured' : 'Mark as Featured'
                                            }
                                        </Button>
                                    </div>
                                </div>
                            )
                        )
                    ) : (
                        <div className="col-span-full flex flex-col justify-center items-center py-20">
                            <img
                                src={IMAGES.error}
                                alt="No Properties"
                                className="mb-4 w-64 opacity-50"
                            />
                            <p className="text-2xl font-semibold text-gray-500">
                                No properties are available!
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div >

    )
}

export default FeaturedProperty