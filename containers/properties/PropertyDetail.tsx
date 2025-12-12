import React, { useState } from 'react';
import { Property } from '../../types';
import { Button } from '../../components/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/Card';
import { ArrowLeft, Edit, Trash2, Share2, Printer, CheckCircle, MapPin, BedDouble, Bath, Square, Calendar, Car, Home, DollarSign, Download, FileText, Clock, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Avatar } from '../../components/ui/Avatar';
import { cn } from '../../lib/utils';
import { AnimatePresence, motion } from 'framer-motion';

interface PropertyDetailProps {
  property: Property;
  onBack: () => void;
  onEdit: () => void;
  onApprove?: (id: string) => Promise<void> | void;
  onReject?: (id: string) => Promise<void> | void;
}

export const PropertyDetail: React.FC<PropertyDetailProps> = ({ property, onBack, onEdit, onApprove, onReject }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  const makeCloudinaryDownloadUrl = (rawUrl: string) => {
    try {
      if (!rawUrl.includes('res.cloudinary.com')) return rawUrl;
      
      // Simple approach: add fl_attachment before the version or file path
      const url = new URL(rawUrl);
      const pathParts = url.pathname.split('/');
      const uploadIndex = pathParts.findIndex(part => part === 'upload');
      
      if (uploadIndex !== -1 && uploadIndex < pathParts.length - 1) {
        // Insert fl_attachment after /upload/
        pathParts.splice(uploadIndex + 1, 0, 'fl_attachment');
        url.pathname = pathParts.join('/');
        return url.toString();
      }
      
      return rawUrl;
    } catch {
      return rawUrl;
    }
  };

  const handleDownload = (originalUrl: string, fileName: string) => {
    try {
      // Try direct Cloudinary download first
      const cloudinaryUrl = makeCloudinaryDownloadUrl(originalUrl);
      
      // Open in new tab for download
      window.open(cloudinaryUrl, '_blank');
    } catch (error) {
      console.error('Download failed:', error);
      // Fallback to backend proxy
      const API_BASE = (import.meta as any)?.env?.VITE_API_BASE_URL || 'http://localhost:5000';
      const proxyUrl = `${API_BASE}/api/uploads/download?url=${encodeURIComponent(originalUrl)}&filename=${encodeURIComponent(fileName)}`;
      window.open(proxyUrl, '_blank');
    }
  };

  // Fallback if no images array
  const gallery = property.images && property.images.length > 0 ? property.images : [property.image];

  const handleNextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedImageIndex((prev) => (prev + 1) % gallery.length);
  };

  const handlePrevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedImageIndex((prev) => (prev - 1 + gallery.length) % gallery.length);
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-right duration-300 pb-20 md:pb-10">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <Button variant="ghost" onClick={onBack} className="gap-2 pl-0 hover:pl-2 transition-all w-fit">
          <ArrowLeft className="h-4 w-4" /> Back to Properties
        </Button>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" className="flex-1 md:flex-none"><Printer className="h-4 w-4 md:mr-2" /><span className="hidden md:inline">Print</span></Button>
          <Button variant="outline" size="sm" className="flex-1 md:flex-none"><Share2 className="h-4 w-4 md:mr-2" /><span className="hidden md:inline">Share</span></Button>
          <Button variant="primary" size="sm" className="gap-2 w-full md:w-auto" onClick={onEdit}>
            <Edit className="h-4 w-4" /> Edit Property
          </Button>
        </div>
      </div>

      {/* Hero Section & Gallery */}
      <div className="space-y-4">
         {/* Main Hero Image */}
        <div className="relative h-[300px] md:h-[400px] rounded-xl overflow-hidden group cursor-pointer" onClick={() => setIsGalleryOpen(true)}>
            <img src={gallery[selectedImageIndex]} alt={property.address} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
            
            {/* Gallery Navigation Controls (Overlay) */}
            {gallery.length > 1 && (
                <>
                    <button onClick={handlePrevImage} className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors opacity-0 group-hover:opacity-100"><ChevronLeft className="h-6 w-6" /></button>
                    <button onClick={handleNextImage} className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors opacity-0 group-hover:opacity-100"><ChevronRight className="h-6 w-6" /></button>
                </>
            )}

            <div className="absolute bottom-0 left-0 p-4 md:p-8 w-full">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div className="w-full">
                    <div className="flex items-center gap-2 mb-2">
                        <span className={cn(
                            "inline-flex items-center rounded-full px-2 py-0.5 md:px-3 md:py-1 text-xs font-semibold backdrop-blur-md",
                            property.status === 'Active' ? 'bg-green-500/20 text-green-300 border border-green-500/30' : 
                            property.status === 'Pending' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' :
                            'bg-gray-500/20 text-gray-300 border border-gray-500/30'
                        )}>
                            {property.status}
                        </span>
                        <span className="text-white/80 text-xs md:text-sm font-medium bg-black/30 px-2 py-0.5 md:px-3 md:py-1 rounded-full backdrop-blur-md border border-white/10">
                            {property.type}
                        </span>
                    </div>
                    <h1 className="text-2xl md:text-4xl font-bold text-white mb-1 md:mb-2">{property.address}</h1>
                    <p className="text-white/80 flex items-center gap-1 text-sm md:text-base">
                        <MapPin className="h-3 w-3 md:h-4 md:w-4" /> Beverly Hills, CA 90210
                    </p>
                </div>
                <div className="text-left md:text-right w-full md:w-auto mt-2 md:mt-0">
                    <div className="text-3xl md:text-4xl font-bold text-white mb-1">
                        ${property.price.toLocaleString()}
                    </div>
                    <p className="text-white/70 text-sm">
                        Est. Payment: ${Math.round(property.price * 0.005).toLocaleString()}/mo
                    </p>
                </div>
            </div>
            </div>
            
            <div className="absolute top-4 right-4 bg-black/60 text-white text-xs px-2 py-1 rounded backdrop-blur-md">
                {selectedImageIndex + 1} / {gallery.length}
            </div>
        </div>

        {/* Thumbnails */}
        {gallery.length > 1 && (
            <div className="flex gap-4 overflow-x-auto pb-2 snap-x">
                {gallery.map((img, idx) => (
                    <button 
                        key={idx} 
                        onClick={() => setSelectedImageIndex(idx)}
                        className={cn(
                            "relative h-20 w-32 rounded-lg overflow-hidden shrink-0 border-2 transition-all snap-start",
                            idx === selectedImageIndex ? "border-primary ring-2 ring-primary/20" : "border-transparent opacity-70 hover:opacity-100"
                        )}
                    >
                        <img src={img} alt="thumbnail" className="h-full w-full object-cover" />
                    </button>
                ))}
            </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6 md:space-y-8">
           {/* Key Specs */}
           <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
              <div className="bg-card border rounded-xl p-3 md:p-4 flex flex-col items-center justify-center text-center hover:border-primary/50 transition-colors">
                 <BedDouble className="h-5 w-5 md:h-6 md:w-6 text-primary mb-1 md:mb-2" />
                 <span className="text-xl md:text-2xl font-bold">{property.beds}</span>
                 <span className="text-[10px] md:text-xs text-muted-foreground uppercase tracking-wider">Bedrooms</span>
              </div>
              <div className="bg-card border rounded-xl p-3 md:p-4 flex flex-col items-center justify-center text-center hover:border-primary/50 transition-colors">
                 <Bath className="h-5 w-5 md:h-6 md:w-6 text-primary mb-1 md:mb-2" />
                 <span className="text-xl md:text-2xl font-bold">{property.baths}</span>
                 <span className="text-[10px] md:text-xs text-muted-foreground uppercase tracking-wider">Bathrooms</span>
              </div>
              <div className="bg-card border rounded-xl p-3 md:p-4 flex flex-col items-center justify-center text-center hover:border-primary/50 transition-colors">
                 <Square className="h-5 w-5 md:h-6 md:w-6 text-primary mb-1 md:mb-2" />
                 <span className="text-xl md:text-2xl font-bold">{property.sqft.toLocaleString()}</span>
                 <span className="text-[10px] md:text-xs text-muted-foreground uppercase tracking-wider">Sq Ft</span>
              </div>
              <div className="bg-card border rounded-xl p-3 md:p-4 flex flex-col items-center justify-center text-center hover:border-primary/50 transition-colors">
                 <Car className="h-5 w-5 md:h-6 md:w-6 text-primary mb-1 md:mb-2" />
                 <span className="text-xl md:text-2xl font-bold">{property.garage}</span>
                 <span className="text-[10px] md:text-xs text-muted-foreground uppercase tracking-wider">Garage</span>
              </div>
           </div>

           {/* Description */}
           <div className="space-y-3 md:space-y-4">
              <h3 className="text-lg md:text-xl font-bold">About this home</h3>
              <p className="text-muted-foreground leading-relaxed text-base md:text-lg">
                 {property.description || "No description provided."}
              </p>
           </div>

           {/* Amenities */}
           <div>
              <h3 className="text-lg md:text-xl font-bold mb-3 md:mb-4">Features & Amenities</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-3 gap-x-4 md:gap-x-8">
                 {property.amenities && property.amenities.length > 0 ? (
                    property.amenities.map((amenity, i) => (
                       <div key={i} className="flex items-center gap-2 md:gap-3 text-sm md:text-base text-muted-foreground">
                          <div className="h-1.5 w-1.5 md:h-2 md:w-2 rounded-full bg-primary shrink-0" />
                          <span>{amenity}</span>
                       </div>
                    ))
                 ) : (
                    <p className="text-muted-foreground italic">No amenities listed.</p>
                 )}
              </div>
           </div>

           {/* Documents Section */}
           <Card>
              <CardHeader>
                  <CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5" /> Property Documents</CardTitle>
              </CardHeader>
              <CardContent>
                  {property.documents && property.documents.length > 0 ? (
                      <div className="space-y-3">
                          {property.documents.map((docItem: any, idx: number) => {
                            const url: string = typeof docItem === 'string' ? docItem : (docItem.url || '');
                            const fileName = url ? decodeURIComponent(url.split('?')[0].split('/').pop() || `Document-${idx+1}`) : (docItem.name || `Document-${idx+1}`);
                            const ext = fileName.includes('.') ? fileName.split('.').pop()?.toUpperCase() : undefined;
                            return (
                              <div key={idx} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/30 transition-colors">
                                  <div className="flex items-center gap-3">
                                      <div className="h-10 w-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center">
                                          <FileText className="h-5 w-5" />
                                      </div>
                                      <div>
                                          <p className="font-medium text-sm truncate max-w-[280px] md:max-w-[420px]" title={fileName}>{fileName}</p>
                                          <p className="text-xs text-muted-foreground">{ext || (docItem.type || 'FILE')}</p>
                                      </div>
                                  </div>
                                  {url ? (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 px-2 gap-2"
                                      onClick={() => handleDownload(url, fileName)}
                                    >
                                      <Download className="h-4 w-4" /> Download
                                    </Button>
                                  ) : (
                                    <Button variant="ghost" size="sm" className="h-8 px-2" disabled>
                                      <Download className="h-4 w-4" />
                                    </Button>
                                  )}
                              </div>
                            );
                          })}
                      </div>
                  ) : (
                      <p className="text-muted-foreground text-sm italic">No documents uploaded.</p>
                  )}
              </CardContent>
           </Card>

           {/* Details Grid */}
           <Card>
              <CardHeader>
                 <CardTitle>Property Details</CardTitle>
              </CardHeader>
              <CardContent className="grid sm:grid-cols-2 gap-y-6 gap-x-12">
                 <div className="space-y-4">
                    <h4 className="font-semibold flex items-center gap-2 text-sm md:text-base"><Home className="h-4 w-4" /> Interior</h4>
                    <dl className="space-y-2 text-sm">
                       <div className="flex justify-between border-b pb-2">
                          <dt className="text-muted-foreground">Type</dt>
                          <dd className="font-medium">{property.type}</dd>
                       </div>
                       <div className="flex justify-between border-b pb-2">
                          <dt className="text-muted-foreground">Year Built</dt>
                          <dd className="font-medium">{property.yearBuilt}</dd>
                       </div>
                       <div className="flex justify-between border-b pb-2">
                          <dt className="text-muted-foreground">Price / Sqft</dt>
                          <dd className="font-medium">${Math.round(property.price / property.sqft)}</dd>
                       </div>
                    </dl>
                 </div>
                 <div className="space-y-4">
                    <h4 className="font-semibold flex items-center gap-2 text-sm md:text-base"><DollarSign className="h-4 w-4" /> Financials</h4>
                     <dl className="space-y-2 text-sm">
                       <div className="flex justify-between border-b pb-2">
                          <dt className="text-muted-foreground">Annual Taxes</dt>
                          <dd className="font-medium">{property.taxes ? `$${property.taxes.toLocaleString()}` : 'N/A'}</dd>
                       </div>
                       <div className="flex justify-between border-b pb-2">
                          <dt className="text-muted-foreground">HOA Fees</dt>
                          <dd className="font-medium">{property.hoaFees ? `$${property.hoaFees}/mo` : 'None'}</dd>
                       </div>
                        <div className="flex justify-between border-b pb-2">
                          <dt className="text-muted-foreground">Lot Size</dt>
                          <dd className="font-medium">{property.lotSize ? `${property.lotSize.toLocaleString()} sqft` : 'N/A'}</dd>
                       </div>
                    </dl>
                 </div>
              </CardContent>
           </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
           {/* Open House Schedule */}
           <Card className="border-l-4 border-l-primary">
               <CardHeader>
                   <CardTitle className="flex items-center gap-2 text-sm uppercase tracking-wider text-muted-foreground">
                       <Calendar className="h-4 w-4" /> Open House Schedule
                   </CardTitle>
               </CardHeader>
               <CardContent>
                   {property.openHouses && property.openHouses.length > 0 ? (
                       <div className="space-y-4">
                           {property.openHouses.map((oh, idx) => (
                               <div key={idx} className="flex gap-3">
                                   <div className="flex-col items-center justify-center bg-primary/10 text-primary rounded-lg px-2 py-1 text-center min-w-[50px] hidden sm:flex">
                                       <span className="text-xs font-bold uppercase">{new Date(oh.date).toLocaleString('default', { month: 'short' })}</span>
                                       <span className="text-lg font-bold">{new Date(oh.date).getDate()}</span>
                                   </div>
                                   <div>
                                       <p className="font-semibold text-sm">{new Date(oh.date).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                                       <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                                           <Clock className="h-3 w-3" /> {oh.start} - {oh.end}
                                       </p>
                                       <p className="text-xs text-muted-foreground mt-1">Hosted by {oh.host}</p>
                                   </div>
                               </div>
                           ))}
                       </div>
                   ) : (
                       <p className="text-sm text-muted-foreground">No open houses scheduled.</p>
                   )}
                   <Button className="w-full mt-4" variant="outline" size="sm">Add to Schedule</Button>
               </CardContent>
           </Card>

           <Card>
             <CardHeader>
               <CardTitle className="text-xs md:text-sm uppercase tracking-wider text-muted-foreground">Agent Info</CardTitle>
             </CardHeader>
             <CardContent>
                <div className="flex items-center gap-4 mb-6">
                   <Avatar name={property.agent || "Agent"} className="h-12 w-12" />
                   <div>
                     <p className="font-bold text-lg">{property.agent || "Assigned Agent"}</p>
                     <p className="text-sm text-muted-foreground">Created this property</p>
                     {property.agentEmail && (
                       <p className="text-sm text-muted-foreground">{property.agentEmail}</p>
                     )}
                   </div>
                </div>
                <div className="space-y-3">
                   <Button
                     className="w-full"
                     variant="outline"
                     disabled={!property.agentEmail}
                     onClick={() => {
                       if (property.agentEmail) {
                         window.location.href = `mailto:${property.agentEmail}`;
                       }
                     }}
                   >
                     Contact Agent{!property.agentEmail ? ' (no email)' : ''}
                   </Button>
                   <Button className="w-full" variant="ghost">View Listings</Button>
                </div>
             </CardContent>
           </Card>

           <Card>
             <CardHeader>
               <CardTitle className="text-xs md:text-sm uppercase tracking-wider text-muted-foreground">Internal Actions</CardTitle>
             </CardHeader>
             <CardContent className="space-y-3">
               <Button
                 className="w-full justify-between group"
                 variant="outline"
                 disabled={!onApprove}
                 onClick={() => onApprove && onApprove(property.id)}
               >
                 Publish Listing <CheckCircle className="h-4 w-4 text-green-500 group-hover:text-green-600" />
               </Button>
               <Button
                 className="w-full justify-between group hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                 variant="outline"
                 disabled={!onReject}
                 onClick={() => onReject && onReject(property.id)}
               >
                 Delete Property <Trash2 className="h-4 w-4 text-muted-foreground group-hover:text-red-500" />
               </Button>
             </CardContent>
           </Card>
           
           <div className="rounded-xl overflow-hidden h-48 md:h-64 bg-muted relative group cursor-pointer">
               {/* Static Map Mock */}
               <div className="absolute inset-0 bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=Beverly+Hills,CA&zoom=13&size=400x300&sensor=false')] bg-cover bg-center opacity-80 transition-opacity group-hover:opacity-100" />
               <div className="absolute inset-0 flex items-center justify-center">
                  <Button variant="secondary" size="sm" className="shadow-lg"><MapPin className="mr-2 h-4 w-4" /> View on Map</Button>
               </div>
           </div>
        </div>
      </div>

      {/* Full Screen Gallery Modal */}
      <AnimatePresence>
        {isGalleryOpen && (
            <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center"
            >
                <button onClick={() => setIsGalleryOpen(false)} className="absolute top-4 right-4 text-white p-2 hover:bg-white/10 rounded-full">
                    <X className="h-8 w-8" />
                </button>
                
                <div className="w-full h-full p-4 md:p-10 flex items-center justify-center relative">
                    <img src={gallery[selectedImageIndex]} alt="Fullscreen" className="max-h-full max-w-full object-contain" />
                    
                    <button onClick={handlePrevImage} className="absolute left-4 md:left-10 text-white p-3 hover:bg-white/10 rounded-full">
                        <ChevronLeft className="h-8 w-8" />
                    </button>
                    <button onClick={handleNextImage} className="absolute right-4 md:right-10 text-white p-3 hover:bg-white/10 rounded-full">
                        <ChevronRight className="h-8 w-8" />
                    </button>
                </div>

                <div className="absolute bottom-6 flex gap-2 overflow-x-auto max-w-full px-4">
                    {gallery.map((img, idx) => (
                        <button 
                            key={idx}
                            onClick={() => setSelectedImageIndex(idx)}
                            className={cn(
                                "h-16 w-24 rounded overflow-hidden border-2 transition-all opacity-70 hover:opacity-100",
                                idx === selectedImageIndex ? "border-white opacity-100" : "border-transparent"
                            )}
                        >
                            <img src={img} className="h-full w-full object-cover" alt="thumb" />
                        </button>
                    ))}
                </div>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};