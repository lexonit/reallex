
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from './Card';
import { Button } from './Button';
import { OrgDocument, CurrentUser, DocumentVersion } from '../types';
import { 
  FileText, Image as ImageIcon, UploadCloud, Search, Filter, 
  MoreHorizontal, Download, History, Trash2, Eye, LayoutGrid, 
  List as ListIcon, X, CheckCircle, File, Loader2, ChevronRight, FileSpreadsheet
} from 'lucide-react';
import { Modal } from './ui/Modal';
import { Toast } from './ui/Toast';
import { cn } from '../lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { Avatar } from './ui/Avatar';

interface DocumentsPageProps {
  user: CurrentUser | null;
}

export const DocumentsPage: React.FC<DocumentsPageProps> = ({ user }) => {
  const [documents, setDocuments] = useState<OrgDocument[]>([]);
  const [filteredDocs, setFilteredDocs] = useState<OrgDocument[]>([]);
  const [viewMode, setViewMode] = useState<'GRID' | 'LIST'>('GRID');
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [isLoading, setIsLoading] = useState(true);
  
  // Upload State
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [newFile, setNewFile] = useState<File | null>(null);
  
  // Preview State
  const [selectedDoc, setSelectedDoc] = useState<OrgDocument | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedVersionId, setSelectedVersionId] = useState<string | null>(null);

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    // Mock Data
    const mockDocs: OrgDocument[] = [
      {
        id: '1',
        name: 'Beverly Hills Purchase Agreement',
        type: 'PDF',
        size: '2.4 MB',
        updatedAt: new Date().toISOString(),
        owner: 'Sarah Connor',
        category: 'CONTRACTS',
        tags: ['Important', 'Sale'],
        versions: [
          { id: 'v2', version: 2, uploadedAt: new Date().toISOString(), uploadedBy: 'Sarah Connor', url: '#', size: '2.4 MB', comment: 'Final revision' },
          { id: 'v1', version: 1, uploadedAt: new Date(Date.now() - 86400000).toISOString(), uploadedBy: 'Mike Ross', url: '#', size: '2.2 MB', comment: 'Initial draft' }
        ]
      },
      {
        id: '2',
        name: 'Property Disclosure - Ocean Ave',
        type: 'PDF',
        size: '1.1 MB',
        updatedAt: new Date(Date.now() - 172800000).toISOString(),
        owner: 'Mike Ross',
        category: 'LEGAL',
        tags: ['Disclosure'],
        versions: [
          { id: 'v1', version: 1, uploadedAt: new Date(Date.now() - 172800000).toISOString(), uploadedBy: 'Mike Ross', url: '#', size: '1.1 MB' }
        ]
      },
      {
        id: '3',
        name: 'Living Room Staging',
        type: 'IMAGE',
        size: '4.5 MB',
        updatedAt: new Date(Date.now() - 250000000).toISOString(),
        owner: 'Emily Rose',
        category: 'MARKETING',
        tags: ['Photos', 'Staging'],
        versions: [
          { id: 'v1', version: 1, uploadedAt: new Date(Date.now() - 250000000).toISOString(), uploadedBy: 'Emily Rose', url: 'https://picsum.photos/800/600', size: '4.5 MB' }
        ]
      },
      {
        id: '4',
        name: 'Q4 Marketing Budget',
        type: 'SPREADSHEET',
        size: '56 KB',
        updatedAt: new Date(Date.now() - 30000000).toISOString(),
        owner: 'John Doe',
        category: 'MARKETING',
        tags: ['Internal'],
        versions: [
          { id: 'v1', version: 1, uploadedAt: new Date(Date.now() - 30000000).toISOString(), uploadedBy: 'John Doe', url: '#', size: '56 KB' }
        ]
      }
    ];

    setTimeout(() => {
      setDocuments(mockDocs);
      setIsLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let result = documents;
    
    if (searchQuery) {
      result = result.filter(d => d.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    
    if (typeFilter !== 'ALL') {
      result = result.filter(d => d.type === typeFilter);
    }
    
    setFilteredDocs(result);
  }, [documents, searchQuery, typeFilter]);

  // Upload Handlers
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!newFile) return;
    
    setIsUploading(true);
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        completeUpload();
      }
    }, 200);
  };

  const completeUpload = () => {
    // If uploading a new version to selected doc
    if (selectedDoc) {
       const newVersion: DocumentVersion = {
          id: Math.random().toString(36).substr(2, 9),
          version: selectedDoc.versions.length + 1,
          uploadedAt: new Date().toISOString(),
          uploadedBy: user?.name || 'Me',
          url: '#',
          size: '2 MB', // Mock
          comment: 'New version uploaded'
       };
       
       const updatedDoc = {
          ...selectedDoc,
          updatedAt: new Date().toISOString(),
          versions: [newVersion, ...selectedDoc.versions]
       };
       
       setDocuments(prev => prev.map(d => d.id === selectedDoc.id ? updatedDoc : d));
       setSelectedDoc(updatedDoc); // Update modal view
       setToast({ message: 'New version uploaded successfully', type: 'success' });
    } else {
        // New Document
        const newDoc: OrgDocument = {
            id: Math.random().toString(36).substr(2, 9),
            name: newFile?.name || 'New Document',
            type: newFile?.type.includes('image') ? 'IMAGE' : newFile?.type.includes('pdf') ? 'PDF' : 'DOC',
            size: '2 MB',
            updatedAt: new Date().toISOString(),
            owner: user?.name || 'Me',
            category: 'OTHER',
            tags: ['New'],
            versions: [
                {
                    id: Math.random().toString(36).substr(2, 9),
                    version: 1,
                    uploadedAt: new Date().toISOString(),
                    uploadedBy: user?.name || 'Me',
                    url: '#',
                    size: '2 MB'
                }
            ]
        };
        setDocuments([newDoc, ...documents]);
        setToast({ message: 'Document uploaded successfully', type: 'success' });
    }

    setIsUploading(false);
    setUploadProgress(0);
    setNewFile(null);
    setIsUploadModalOpen(false);
    setTimeout(() => setToast(null), 3000);
  };

  const openPreview = (doc: OrgDocument) => {
    setSelectedDoc(doc);
    setSelectedVersionId(doc.versions[0].id); // Default to latest
    setIsPreviewOpen(true);
  };

  // Icon Helper
  const getFileIcon = (type: string, size: string = 'md') => {
    const s = size === 'lg' ? 'h-10 w-10' : 'h-5 w-5';
    switch(type) {
      case 'PDF': return <div className={`flex items-center justify-center rounded bg-red-100 text-red-600 dark:bg-red-900/30 ${s}`}><FileText className={size === 'lg' ? 'h-6 w-6' : 'h-3 w-3'} /></div>;
      case 'IMAGE': return <div className={`flex items-center justify-center rounded bg-blue-100 text-blue-600 dark:bg-blue-900/30 ${s}`}><ImageIcon className={size === 'lg' ? 'h-6 w-6' : 'h-3 w-3'} /></div>;
      case 'SPREADSHEET': return <div className={`flex items-center justify-center rounded bg-green-100 text-green-600 dark:bg-green-900/30 ${s}`}><FileSpreadsheet className={size === 'lg' ? 'h-6 w-6' : 'h-3 w-3'} /></div>;
      default: return <div className={`flex items-center justify-center rounded bg-gray-100 text-gray-600 dark:bg-gray-800 ${s}`}><File className={size === 'lg' ? 'h-6 w-6' : 'h-3 w-3'} /></div>;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10 h-full flex flex-col">
      <AnimatePresence>
         {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </AnimatePresence>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
         <div>
            <h2 className="text-2xl font-bold tracking-tight">Documents</h2>
            <p className="text-muted-foreground">Manage contracts, disclosures, and marketing assets.</p>
         </div>
         <Button onClick={() => { setSelectedDoc(null); setIsUploadModalOpen(true); }} className="shadow-lg shadow-primary/20">
            <UploadCloud className="mr-2 h-4 w-4" /> Upload Document
         </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-card border rounded-xl p-4 shadow-sm shrink-0">
         <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <input 
               placeholder="Search documents..." 
               className="w-full pl-9 pr-4 py-2 rounded-md border bg-background focus:ring-2 focus:ring-primary/50 outline-none text-sm transition-all"
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
            />
         </div>
         
         <div className="flex items-center gap-2 w-full md:w-auto">
             <select 
                className="h-9 rounded-md border bg-background px-3 text-sm focus:ring-2 focus:ring-primary/50 outline-none flex-1 md:flex-none"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
             >
                <option value="ALL">All Types</option>
                <option value="PDF">PDFs</option>
                <option value="IMAGE">Images</option>
                <option value="SPREADSHEET">Spreadsheets</option>
             </select>
             
             <div className="flex items-center bg-muted/50 rounded-lg p-1 border">
                <button 
                   onClick={() => setViewMode('GRID')}
                   className={cn("p-1.5 rounded-md transition-all", viewMode === 'GRID' ? "bg-background shadow text-primary" : "text-muted-foreground hover:text-foreground")}
                >
                   <LayoutGrid className="h-4 w-4" />
                </button>
                <button 
                   onClick={() => setViewMode('LIST')}
                   className={cn("p-1.5 rounded-md transition-all", viewMode === 'LIST' ? "bg-background shadow text-primary" : "text-muted-foreground hover:text-foreground")}
                >
                   <ListIcon className="h-4 w-4" />
                </button>
             </div>
         </div>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0">
         {isLoading ? (
             <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                 {Array.from({length: 8}).map((_, i) => (
                     <div key={i} className="h-48 rounded-xl border bg-card animate-pulse" />
                 ))}
             </div>
         ) : filteredDocs.length === 0 ? (
             <div className="text-center py-20 text-muted-foreground">
                 <File className="h-12 w-12 mx-auto mb-4 opacity-20" />
                 <p>No documents found.</p>
             </div>
         ) : viewMode === 'GRID' ? (
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                 {filteredDocs.map(doc => (
                     <Card key={doc.id} className="group hover:shadow-md transition-all cursor-pointer border-border/50" onClick={() => openPreview(doc)}>
                         <CardContent className="p-4 flex flex-col h-full">
                             <div className="flex items-start justify-between mb-4">
                                 {getFileIcon(doc.type, 'lg')}
                                 <button className="text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-muted rounded">
                                     <MoreHorizontal className="h-4 w-4" />
                                 </button>
                             </div>
                             <div className="mt-auto">
                                 <h3 className="font-semibold text-sm truncate mb-1" title={doc.name}>{doc.name}</h3>
                                 <div className="flex items-center justify-between text-xs text-muted-foreground">
                                     <span>{doc.size}</span>
                                     <span>{new Date(doc.updatedAt).toLocaleDateString()}</span>
                                 </div>
                                 <div className="flex items-center gap-2 mt-3 pt-3 border-t border-dashed">
                                     <Avatar name={doc.owner} className="h-5 w-5 text-[9px]" />
                                     <span className="text-xs text-muted-foreground truncate">by {doc.owner}</span>
                                 </div>
                             </div>
                         </CardContent>
                     </Card>
                 ))}
             </div>
         ) : (
             <div className="bg-card border rounded-xl overflow-hidden">
                 <table className="w-full text-sm text-left">
                     <thead className="bg-muted/40 text-muted-foreground border-b border-border/50 uppercase tracking-wider text-[11px] font-semibold">
                         <tr>
                             <th className="px-6 py-3">Name</th>
                             <th className="px-6 py-3">Type</th>
                             <th className="px-6 py-3">Size</th>
                             <th className="px-6 py-3">Uploaded</th>
                             <th className="px-6 py-3">Owner</th>
                             <th className="px-6 py-3 text-right">Actions</th>
                         </tr>
                     </thead>
                     <tbody className="divide-y divide-border/30">
                         {filteredDocs.map(doc => (
                             <tr key={doc.id} className="hover:bg-muted/30 transition-colors cursor-pointer" onClick={() => openPreview(doc)}>
                                 <td className="px-6 py-3 font-medium">
                                     <div className="flex items-center gap-3">
                                         {getFileIcon(doc.type)}
                                         <span className="truncate max-w-[200px]">{doc.name}</span>
                                     </div>
                                 </td>
                                 <td className="px-6 py-3">{doc.type}</td>
                                 <td className="px-6 py-3">{doc.size}</td>
                                 <td className="px-6 py-3">{new Date(doc.updatedAt).toLocaleDateString()}</td>
                                 <td className="px-6 py-3">
                                     <div className="flex items-center gap-2">
                                         <Avatar name={doc.owner} className="h-5 w-5 text-[9px]" />
                                         <span>{doc.owner}</span>
                                     </div>
                                 </td>
                                 <td className="px-6 py-3 text-right">
                                     <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                         <Eye className="h-4 w-4" />
                                     </Button>
                                 </td>
                             </tr>
                         ))}
                     </tbody>
                 </table>
             </div>
         )}
      </div>

      {/* Upload Modal */}
      <Modal
         isOpen={isUploadModalOpen}
         onClose={() => setIsUploadModalOpen(false)}
         title={selectedDoc ? "Upload New Version" : "Upload Document"}
      >
         <div className="space-y-6 py-4">
             {!isUploading ? (
                 <div className="flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-xl p-8 bg-muted/5 hover:bg-muted/10 transition-colors text-center cursor-pointer relative">
                     <input 
                        type="file" 
                        className="absolute inset-0 opacity-0 cursor-pointer" 
                        onChange={handleFileChange}
                     />
                     <div className="bg-primary/10 p-4 rounded-full mb-4 text-primary">
                         <UploadCloud className="h-8 w-8" />
                     </div>
                     <h3 className="font-semibold text-lg">{newFile ? newFile.name : 'Click to Upload or Drag & Drop'}</h3>
                     <p className="text-sm text-muted-foreground mt-2">
                         {newFile ? `${(newFile.size / 1024 / 1024).toFixed(2)} MB` : 'PDF, DOCX, JPG, PNG (Max 10MB)'}
                     </p>
                 </div>
             ) : (
                 <div className="space-y-4 py-8">
                     <div className="flex justify-between text-sm mb-1">
                         <span>Uploading...</span>
                         <span>{uploadProgress}%</span>
                     </div>
                     <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                         <div 
                            className="h-full bg-primary transition-all duration-200" 
                            style={{ width: `${uploadProgress}%` }}
                         />
                     </div>
                     <div className="flex justify-center mt-4">
                         <Loader2 className="h-6 w-6 animate-spin text-primary" />
                     </div>
                 </div>
             )}
             
             <div className="flex justify-end gap-2">
                 <Button variant="ghost" onClick={() => setIsUploadModalOpen(false)} disabled={isUploading}>Cancel</Button>
                 <Button onClick={handleUpload} disabled={!newFile || isUploading}>
                     {isUploading ? 'Uploading...' : selectedDoc ? 'Upload Version' : 'Upload File'}
                 </Button>
             </div>
         </div>
      </Modal>

      {/* Preview Modal */}
      <AnimatePresence>
         {isPreviewOpen && selectedDoc && (
             <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 md:p-8"
                onClick={() => setIsPreviewOpen(false)}
             >
                 <motion.div 
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    className="bg-background w-full max-w-6xl h-[90vh] rounded-2xl overflow-hidden flex flex-col md:flex-row shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                 >
                     {/* Main Preview Area */}
                     <div className="flex-1 flex flex-col min-w-0 bg-neutral-100 dark:bg-neutral-900/50">
                         <div className="h-16 border-b bg-card flex items-center justify-between px-6 shrink-0">
                             <div className="flex items-center gap-3 overflow-hidden">
                                 {getFileIcon(selectedDoc.type)}
                                 <div>
                                     <h2 className="font-bold text-sm md:text-base truncate">{selectedDoc.name}</h2>
                                     <p className="text-xs text-muted-foreground flex items-center gap-2">
                                         Version {selectedDoc.versions.find(v => v.id === selectedVersionId)?.version} • 
                                         Updated {new Date(selectedDoc.updatedAt).toLocaleDateString()}
                                     </p>
                                 </div>
                             </div>
                             <div className="flex items-center gap-2">
                                 <Button variant="outline" size="sm" onClick={() => setIsUploadModalOpen(true)}>
                                     <UploadCloud className="h-4 w-4 mr-2" /> New Version
                                 </Button>
                                 <Button variant="ghost" size="icon" onClick={() => setIsPreviewOpen(false)}>
                                     <X className="h-5 w-5" />
                                 </Button>
                             </div>
                         </div>
                         
                         <div className="flex-1 overflow-auto flex items-center justify-center p-4">
                             {selectedDoc.type === 'IMAGE' ? (
                                 <img 
                                    src={selectedDoc.versions.find(v => v.id === selectedVersionId)?.url || 'https://picsum.photos/800/600'} 
                                    alt="Preview" 
                                    className="max-h-full max-w-full object-contain rounded shadow-sm" 
                                 />
                             ) : (
                                 <div className="text-center p-12 bg-white dark:bg-black border rounded-xl shadow-sm max-w-md">
                                     <FileText className="h-20 w-20 text-muted-foreground mx-auto mb-4" />
                                     <h3 className="font-semibold text-lg">PDF Preview Not Available</h3>
                                     <p className="text-muted-foreground text-sm mb-6">Download the file to view its contents.</p>
                                     <Button>
                                         <Download className="mr-2 h-4 w-4" /> Download File
                                     </Button>
                                 </div>
                             )}
                         </div>
                     </div>

                     {/* Sidebar: Version History */}
                     <div className="w-full md:w-80 border-l bg-card flex flex-col shrink-0">
                         <div className="p-4 border-b">
                             <h3 className="font-bold flex items-center gap-2"><History className="h-4 w-4" /> Version History</h3>
                         </div>
                         <div className="flex-1 overflow-y-auto p-4 space-y-4">
                             {selectedDoc.versions.map((version, idx) => (
                                 <div 
                                    key={version.id} 
                                    className={cn(
                                        "p-3 rounded-lg border transition-all cursor-pointer relative",
                                        version.id === selectedVersionId ? "bg-primary/5 border-primary ring-1 ring-primary/20" : "hover:bg-muted/50"
                                    )}
                                    onClick={() => setSelectedVersionId(version.id)}
                                 >
                                     {version.id === selectedVersionId && (
                                         <div className="absolute top-2 right-2 text-primary"><CheckCircle className="h-4 w-4" /></div>
                                     )}
                                     <div className="flex items-center gap-2 mb-2">
                                         <span className="font-bold text-sm bg-muted px-1.5 rounded text-muted-foreground">v{version.version}</span>
                                         <span className="text-xs text-muted-foreground">{new Date(version.uploadedAt).toLocaleDateString()}</span>
                                     </div>
                                     <div className="flex items-center gap-2 mb-1">
                                         <Avatar name={version.uploadedBy} className="h-5 w-5 text-[9px]" />
                                         <span className="text-xs font-medium">{version.uploadedBy}</span>
                                     </div>
                                     {version.comment && (
                                         <p className="text-xs text-muted-foreground mt-2 italic bg-muted/30 p-1.5 rounded">
                                             "{version.comment}"
                                         </p>
                                     )}
                                     <div className="mt-2 flex gap-2">
                                         <Button variant="ghost" size="sm" className="h-6 text-[10px] px-2 w-full">Download</Button>
                                     </div>
                                 </div>
                             ))}
                         </div>
                         <div className="p-4 border-t mt-auto">
                             <Button variant="ghost" className="w-full text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10">
                                 <Trash2 className="mr-2 h-4 w-4" /> Delete Document
                             </Button>
                         </div>
                     </div>
                 </motion.div>
             </motion.div>
         )}
      </AnimatePresence>
    </div>
  );
};
