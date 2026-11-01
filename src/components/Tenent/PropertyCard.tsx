import React from 'react';
import { Star, MapPin } from 'lucide-react';
import { Property } from '../types';

interface PropertyCardProps {
  property: Property;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all hover:scale-105 cursor-pointer">
      {/* Property Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={property.image}
          alt={property.title}
          className="w-full h-full object-cover"
        />
        {property.featured && (
          <div className="absolute top-3 left-3 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-medium">
            Featured
          </div>
        )}
        <div className="absolute top-3 right-3 bg-white bg-opacity-90 px-2 py-1 rounded-full text-xs font-medium text-foreground">
          For Rent
        </div>
      </div>

      {/* Property Details */}
      <div className="p-4">
        <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">{property.title}</h3>
        
        <div className="flex items-center text-sm text-gray-600 mb-2">
          <MapPin className="w-4 h-4 mr-1" />
          <span className="truncate">{property.location}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Star className="w-4 h-4 text-yellow-500 fill-current" />
            <span className="text-sm text-gray-600 ml-1">
              {property.rating} ({property.reviews})
            </span>
          </div>
          <div className="text-lg font-bold text-gray-900">
            ${property.price}<span className="text-sm text-gray-500 font-normal">/month</span>
          </div>
        </div>
      </div>
    </div>
  );
};