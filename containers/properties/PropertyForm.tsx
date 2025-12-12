import React, { useRef, useState } from 'react';
import { Button } from '../../components/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/Card';
import { Property, PropertyType } from '../../types';
import { Upload, Map, Check, Home, DollarSign, Layout, List, Image as ImageIcon, X } from 'lucide-react';
import { cn } from '../../lib/utils';
import Cookies from 'js-cookie';
import { useMe } from '../../hooks/useAuth';
import { LocationPicker } from '../../components/ui/LocationPicker';

interface PropertyFormProps {
  initialData?: Partial<Property>;
  onSubmit: (data: Partial<Property>) => void;
  onCancel: () => void;
}

const PROPERTY_TYPES: PropertyType[] = ['Single Family', 'Condo', 'Townhouse', 'Multi-Family', 'Land', 'Commercial'];
const AMENITIES_LIST = [
  'Pool', 'Spa', 'AC', 'Solar', 'View', 'Waterfront', 
  'Gated', 'Smart Home', 'Guest House', 'Gym', 
  'Wine Cellar', 'Theater', 'Elevator', 'EV Charger'
];

export const PropertyForm: React.FC<PropertyFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const [step, setStep] = useState(1);
  const { data: userData } = useMe();
  const [formData, setFormData] = useState<Partial<Property>>(initialData || {
    address: '',
    price: 0,
    type: 'Single Family',
    status: 'Draft',
    beds: 0,
    baths: 0,
    sqft: 0,
    lotSize: 0,
    yearBuilt: new Date().getFullYear(),
    garage: 0,
    description: '',
    hoaFees: 0,
    taxes: 0,
    amenities: [],
    image: 'https://picsum.photos/400/300?random=10',
    images: [],
    documents: [],
    openHouses: []
  });
  const [locationData, setLocationData] = useState<any>(
    initialData?.location?.coordinates ? {
      address: initialData.address,
      coordinates: {
        lat: initialData.location.coordinates[1],
        lng: initialData.location.coordinates[0]
      }
    } : null
  );
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const docInputRef = useRef<HTMLInputElement | null>(null);
  const brochureInputRef = useRef<HTMLInputElement | null>(null);

  const isEditMode = !!initialData?.id;

  // Handle location change from LocationPicker
  const handleLocationChange = (location: any) => {
    setLocationData(location);
    setFormData(prev => ({
      ...prev,
      address: location.address,
      location: {
        type: 'Point',
        coordinates: [location.coordinates.lng, location.coordinates.lat] // [longitude, latitude]
      }
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value
    }));
  };

  const toggleAmenity = (amenity: string) => {
    setFormData(prev => {
      const current = prev.amenities || [];
      return {
        ...prev,
        amenities: current.includes(amenity) 
          ? current.filter(a => a !== amenity)
          : [...current, amenity]
      };
    });
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const API_BASE = (import.meta as any)?.env?.VITE_API_BASE_URL || 'http://localhost:5000';
      const token = Cookies.get('auth_token');
      const form = new FormData();
      form.append('file', file);
      
      // Add vendorId and propertyName for dynamic folder structure in Cloudinary
      const vendorId = (userData as any)?.me?.vendorId || 'default';
      const propertyName = formData.address || 'unnamed-property';
      form.append('vendorId', vendorId);
      form.append('propertyName', propertyName);
      
      const res = await fetch(`${API_BASE}/api/uploads/cloudinary`, {
        method: 'POST',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: form
      });
      if (!res.ok) throw new Error('Upload failed');
      const json = await res.json();
      const url = json.url || json.secure_url;
      if (!url) throw new Error('No URL returned');
      setFormData(prev => ({
        ...prev,
        images: [...(prev.images || []), url]
      }));
    } catch (err) {
      console.error('Upload error', err);
      alert('Image upload failed. Please try again.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDocSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const API_BASE = (import.meta as any)?.env?.VITE_API_BASE_URL || 'http://localhost:5000';
      const token = Cookies.get('auth_token');
      const form = new FormData();
      form.append('file', file);

      const vendorId = (userData as any)?.me?.vendorId || 'default';
      const propertyName = formData.address || 'unnamed-property';
      form.append('vendorId', vendorId);
      form.append('propertyName', propertyName);

      const res = await fetch(`${API_BASE}/api/uploads/cloudinary`, {
        method: 'POST',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: form
      });
      if (!res.ok) throw new Error('Upload failed');
      const json = await res.json();
      const url = json.url || json.secure_url;
      if (!url) throw new Error('No URL returned');
      setFormData(prev => ({
        ...prev,
        documents: [...(prev.documents || []), url]
      }));
    } catch (err) {
      console.error('Document upload error', err);
      alert('Document upload failed. Please try again.');
    } finally {
      setIsUploading(false);
      if (docInputRef.current) docInputRef.current.value = '';
      if (brochureInputRef.current) brochureInputRef.current.value = '';
    }
  };

  const removeDocument = (index: number) => {
    setFormData(prev => ({
      ...prev,
      documents: (prev.documents || []).filter((_, i) => i !== index)
    }));
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
        ...prev,
        images: prev.images?.filter((_, i) => i !== index)
    }));
  };

  const steps = [
    { number: 1, title: 'Basics', icon: Home },
    { number: 2, title: 'Specs', icon: Layout },
    { number: 3, title: 'Financials', icon: DollarSign },
    { number: 4, title: 'Features', icon: List },
    { number: 5, title: 'Media', icon: ImageIcon }
  ];

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => setStep(prev => prev - 1);

  return (
    <div className="max-w-4xl mx-auto space-y-6 md:space-y-8 pb-20 md:pb-0">
      {/* Stepper */}
      <div className="relative flex items-center justify-between px-2 md:px-10">
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-muted -z-10 hidden md:block" />
        {steps.map((s, i) => (
          <div key={s.number} className="flex flex-col items-center bg-background px-1 md:px-2 z-10">
            <div 
              className={cn(
                "w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300",
                step >= s.number 
                  ? "bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/30" 
                  : "bg-background border-muted text-muted-foreground"
              )}
            >
              {step > s.number ? <Check className="h-4 w-4 md:h-5 md:w-5" /> : <s.icon className="h-4 w-4 md:h-5 md:w-5" />}
            </div>
            <span className={cn(
              "text-[10px] md:text-xs mt-2 font-medium transition-colors text-center max-w-[50px] md:max-w-none",
              step >= s.number ? "text-primary" : "text-muted-foreground"
            )}>
              {s.title}
            </span>
          </div>
        ))}
      </div>

      <Card className="min-h-[auto] md:min-h-[500px] flex flex-col border-none shadow-none md:border md:shadow-sm">
        <CardHeader className="border-b bg-muted/20 px-4 md:px-6 py-4">
          <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
             {steps[step-1].title} Details
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 md:p-8 flex-1">
          {step === 1 && (
            <div className="space-y-6 animate-in slide-in-from-right duration-300 fade-in">
              <div className="space-y-2">
                <label className="text-sm font-medium">Property Type</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {PROPERTY_TYPES.map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, type }))}
                      className={cn(
                        "p-3 rounded-lg border text-sm font-medium transition-all text-center",
                        formData.type === type 
                          ? "border-primary bg-primary/10 text-primary ring-1 ring-primary" 
                          : "border-input hover:border-primary/50 hover:bg-muted"
                      )}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Location Picker with Map */}
              <LocationPicker
                value={locationData}
                onChange={handleLocationChange}
              />

              <div className="space-y-2">
                <label className="text-sm font-medium">Manual Address (optional)</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address || ''}
                  onChange={(e) => {
                    handleChange(e);
                    if (locationData) {
                      setLocationData({ ...locationData, address: e.target.value });
                    }
                  }}
                  placeholder="123 Main St, City, State ZIP"
                  className="w-full p-2.5 rounded-md border bg-background focus:ring-2 focus:ring-primary/20 outline-none"
                />
                <p className="text-xs text-muted-foreground">Use this if you prefer to type an address without selecting on the map.</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <textarea 
                  name="description" 
                  value={formData.description} 
                  onChange={handleChange}
                  rows={5}
                  className="w-full p-2.5 rounded-md border bg-background focus:ring-2 focus:ring-primary/20 outline-none resize-none" 
                  placeholder="Describe the property highlights..."
                />
              </div>

               <div className="space-y-2">
                <label className="text-sm font-medium">Listing Status</label>
                <select 
                   name="status"
                   value={formData.status}
                   onChange={handleChange}
                   className="w-full p-2.5 rounded-md border bg-background focus:ring-2 focus:ring-primary/20 outline-none"
                >
                    <option value="Draft">Draft</option>
                    <option value="Active">Active</option>
                    <option value="Pending">Pending</option>
                    <option value="Sold">Sold</option>
                </select>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in slide-in-from-right duration-300 fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Bedrooms</label>
                  <input type="number" name="beds" value={formData.beds} onChange={handleChange} className="w-full p-2.5 rounded-md border bg-background" min="0" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Bathrooms</label>
                  <input type="number" step="0.5" name="baths" value={formData.baths} onChange={handleChange} className="w-full p-2.5 rounded-md border bg-background" min="0" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Square Footage</label>
                  <input type="number" name="sqft" value={formData.sqft} onChange={handleChange} className="w-full p-2.5 rounded-md border bg-background" min="0" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Lot Size (sqft)</label>
                  <input type="number" name="lotSize" value={formData.lotSize} onChange={handleChange} className="w-full p-2.5 rounded-md border bg-background" min="0" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Year Built</label>
                  <input type="number" name="yearBuilt" value={formData.yearBuilt} onChange={handleChange} className="w-full p-2.5 rounded-md border bg-background" min="1800" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Garage Spaces</label>
                  <input type="number" name="garage" value={formData.garage} onChange={handleChange} className="w-full p-2.5 rounded-md border bg-background" min="0" />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-in slide-in-from-right duration-300 fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Listing Price</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                    <input 
                      type="number" 
                      name="price" 
                      value={formData.price} 
                      onChange={handleChange}
                      className="w-full pl-7 p-2.5 rounded-md border bg-background text-lg font-semibold" 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Annual Taxes (Est.)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                    <input 
                      type="number" 
                      name="taxes" 
                      value={formData.taxes} 
                      onChange={handleChange}
                      className="w-full pl-7 p-2.5 rounded-md border bg-background" 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Monthly HOA Fees</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                    <input 
                      type="number" 
                      name="hoaFees" 
                      value={formData.hoaFees} 
                      onChange={handleChange}
                      className="w-full pl-7 p-2.5 rounded-md border bg-background" 
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6 animate-in slide-in-from-right duration-300 fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                {AMENITIES_LIST.map(amenity => (
                  <button
                    key={amenity}
                    onClick={() => toggleAmenity(amenity)}
                    className={cn(
                      "flex items-center gap-2 p-3 rounded-lg border text-sm transition-all text-left",
                      formData.amenities?.includes(amenity)
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-input hover:bg-muted"
                    )}
                  >
                    <div className={cn(
                      "w-4 h-4 rounded border flex items-center justify-center transition-colors shrink-0",
                      formData.amenities?.includes(amenity) ? "bg-primary border-primary" : "border-muted-foreground"
                    )}>
                      {formData.amenities?.includes(amenity) && <Check className="h-3 w-3 text-white" />}
                    </div>
                    {amenity}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-8 animate-in slide-in-from-right duration-300 fade-in">
               <div className="space-y-4">
                  <label className="text-sm font-medium">Media Gallery</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {/* Existing Images */}
                      {formData.images && formData.images.map((img, idx) => (
                          <div key={idx} className="relative aspect-square rounded-lg overflow-hidden group border">
                              <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                              <button 
                                  onClick={() => removeImage(idx)}
                                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                  <X className="h-3 w-3" />
                              </button>
                          </div>
                      ))}
                      
                        {/* Upload Button */}
                        <button 
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="aspect-square rounded-lg border-2 border-dashed border-muted-foreground/25 flex flex-col items-center justify-center bg-muted/20 hover:bg-muted/40 transition-colors text-muted-foreground"
                          disabled={isUploading}
                        >
                          <Upload className={`h-6 w-6 mb-2 ${isUploading ? 'animate-pulse' : ''}`} />
                          <span className="text-xs">{isUploading ? 'Uploading...' : 'Add Photo'}</span>
                        </button>
                        <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileSelect}
                        />
                  </div>
                  <p className="text-xs text-muted-foreground">Drag and drop photos or click to upload.</p>
               </div>

               {/* Documents & Brochure Upload */}
               <div className="space-y-4">
                  <label className="text-sm font-medium">Documents</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* List existing documents */}
                    <div className="space-y-2">
                      {(formData.documents || []).length === 0 && (
                        <p className="text-xs text-muted-foreground">No documents uploaded yet.</p>
                      )}
                      {(formData.documents || []).map((docUrl, idx) => {
                        const name = docUrl.split('/').pop() || `Document ${idx+1}`;
                        return (
                          <div key={idx} className="flex items-center justify-between p-2 border rounded-md bg-muted/20">
                            <a href={docUrl} target="_blank" rel="noreferrer" className="text-sm text-primary underline truncate max-w-[70%]">{name}</a>
                            <button onClick={() => removeDocument(idx)} className="text-red-600 hover:underline text-xs">Remove</button>
                          </div>
                        );
                      })}
                    </div>

                    {/* Upload controls */}
                    <div className="flex flex-col gap-3">
                      <button 
                        type="button"
                        onClick={() => docInputRef.current?.click()}
                        className="rounded-md border-2 border-dashed border-muted-foreground/25 p-3 flex items-center justify-center bg-muted/20 hover:bg-muted/40 transition-colors text-sm"
                        disabled={isUploading}
                      >
                        <Upload className={`h-4 w-4 mr-2 ${isUploading ? 'animate-pulse' : ''}`} /> {isUploading ? 'Uploading...' : 'Upload Document'}
                      </button>
                      <input
                        ref={docInputRef}
                        type="file"
                        accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,image/*"
                        className="hidden"
                        onChange={handleDocSelect}
                      />

                      <button 
                        type="button"
                        onClick={() => brochureInputRef.current?.click()}
                        className="rounded-md border-2 border-dashed border-muted-foreground/25 p-3 flex items-center justify-center bg-muted/20 hover:bg-muted/40 transition-colors text-sm"
                        disabled={isUploading}
                      >
                        <Upload className={`h-4 w-4 mr-2 ${isUploading ? 'animate-pulse' : ''}`} /> {isUploading ? 'Uploading...' : 'Upload Brochure (PDF)'}
                      </button>
                      <input
                        ref={brochureInputRef}
                        type="file"
                        accept="application/pdf"
                        className="hidden"
                        onChange={handleDocSelect}
                      />
                      <p className="text-xs text-muted-foreground">Supported: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT.</p>
                    </div>
                  </div>
               </div>
               
               <div className="p-4 bg-muted/10 rounded-lg border">
                    <h3 className="font-semibold text-sm mb-3">Summary Preview</h3>
                    <div className="text-sm space-y-2">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Address</span>
                            <span>{formData.address || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Price</span>
                            <span>${formData.price?.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Photos</span>
                            <span>{formData.images?.length || 0} items</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Documents</span>
                            <span>{formData.documents?.length || 0} items</span>
                        </div>
                    </div>
               </div>
            </div>
          )}
        </CardContent>
        
        {/* Fixed Footer on Mobile, Static on Desktop */}
        <div className="p-4 md:p-6 border-t bg-background md:bg-muted/10 flex flex-col-reverse sm:flex-row justify-between items-center gap-3 fixed bottom-0 left-0 right-0 z-50 md:static">
            <Button 
                variant="ghost" 
                onClick={step === 1 ? onCancel : handleBack}
                className="w-full sm:w-auto"
            >
              {step === 1 ? 'Cancel' : 'Back'}
            </Button>
            
            <div className="w-full sm:w-auto">
               {step === 5 ? (
                 <Button onClick={() => onSubmit(formData)} className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white">
                   <Check className="mr-2 h-4 w-4" /> 
                   {isEditMode ? 'Save Changes' : 'Create Listing'}
                 </Button>
               ) : (
                 <Button onClick={handleNext} className="w-full sm:w-auto">
                   Next Step
                 </Button>
               )}
            </div>
        </div>
      </Card>
      {/* Spacer for mobile fixed footer */}
      <div className="h-20 md:hidden" />
    </div>
  );
};