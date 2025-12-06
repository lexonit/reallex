import React from 'react';
import { Property } from '../../types';
import { Card, CardContent } from '../Card';
import { Button } from '../Button';
import { BedDouble, Bath, Square, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { Skeleton } from '../ui/Skeleton';

interface PropertyCardProps {
  property: Property;
  onViewDetails: (id: string) => void;
}

export const PropertyCardSkeleton: React.FC = () => {
  return (
    <Card className="overflow-hidden border-border/50 bg-card/50">
      <div className="relative h-48 w-full">
        <Skeleton className="h-full w-full" />
      </div>
      <CardContent className="p-5">
        <Skeleton className="h-7 w-1/2 mb-2" />
        <div className="flex items-center gap-2 mb-4">
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
        <div className="grid grid-cols-3 gap-4 py-4 border-t border-b border-border/50">
          <div className="flex flex-col items-center gap-1">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-3 w-10" />
          </div>
          <div className="flex flex-col items-center gap-1 border-l border-r border-border/50">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-3 w-10" />
          </div>
          <div className="flex flex-col items-center gap-1">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-3 w-10" />
          </div>
        </div>
        <div className="mt-4">
          <Skeleton className="h-10 w-full" />
        </div>
      </CardContent>
    </Card>
  );
};

export const PropertyCard: React.FC<PropertyCardProps> = ({ property, onViewDetails }) => {
  const statusColors = {
    Active: 'bg-green-500/80',
    Pending: 'bg-yellow-500/80',
    Sold: 'bg-red-500/80',
    Draft: 'bg-gray-500/80',
    Submitted: 'bg-blue-500/80',
    Rejected: 'bg-red-700/80',
    Archived: 'bg-stone-500/80'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden group hover:shadow-lg transition-all duration-300 border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="relative h-48 w-full overflow-hidden">
          <img 
            src={property.image} 
            alt={property.address} 
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute top-2 right-2">
            <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-semibold backdrop-blur-md shadow-sm text-white ${statusColors[property.status]}`}>
              {property.status}
            </span>
          </div>
          <div className="absolute bottom-2 left-2">
            <span className="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium backdrop-blur-md bg-black/50 text-white border border-white/20">
              {property.type}
            </span>
          </div>
        </div>
        <CardContent className="p-5">
          <div className="mb-1 text-xl font-bold">${property.price.toLocaleString()}</div>
          <div className="flex items-start gap-2 text-muted-foreground mb-4 h-10">
            <MapPin className="h-4 w-4 mt-1 shrink-0" />
            <span className="text-sm line-clamp-2">{property.address}</span>
          </div>
          <div className="grid grid-cols-3 gap-4 py-4 border-t border-b border-border/50">
            <div className="flex flex-col items-center justify-center gap-1">
              <BedDouble className="h-4 w-4 text-primary" />
              <span className="text-xs font-medium">{property.beds} Beds</span>
            </div>
            <div className="flex flex-col items-center justify-center gap-1 border-l border-r border-border/50">
              <Bath className="h-4 w-4 text-primary" />
              <span className="text-xs font-medium">{property.baths} Baths</span>
            </div>
            <div className="flex flex-col items-center justify-center gap-1">
              <Square className="h-4 w-4 text-primary" />
              <span className="text-xs font-medium">{property.sqft} sqft</span>
            </div>
          </div>
          <div className="mt-4">
            <Button className="w-full" variant="outline" onClick={() => onViewDetails(property.id)}>
              View Details
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};