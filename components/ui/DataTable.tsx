import React, { useState, useEffect } from 'react';
import { cn } from '../../lib/utils';
import { Button } from '../Button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Skeleton } from './Skeleton';

interface Column<T> {
  header: string;
  accessorKey?: keyof T;
  cell?: (item: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onRowClick?: (item: T) => void;
  isLoading?: boolean;
  pageSize?: number;
  className?: string;
}

export function DataTable<T extends { id: string }>({ 
  data, 
  columns, 
  onRowClick,
  isLoading,
  pageSize = 5,
  className
}: DataTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);

  // Reset to page 1 if data source changes (e.g. filtering)
  useEffect(() => {
    setCurrentPage(1);
  }, [data.length]);

  const totalPages = Math.ceil(data.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, data.length);
  
  const currentData = isLoading ? [] : data.slice(startIndex, endIndex);

  return (
    <div className={cn("w-full border rounded-xl overflow-hidden bg-card shadow-sm", className)}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted/40 text-muted-foreground border-b border-border/50 uppercase tracking-wider text-[11px] font-semibold">
            <tr>
              {columns.map((col, idx) => (
                <th key={idx} className={cn("px-6 py-4", col.className)}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/30">
            {isLoading ? (
               Array.from({ length: pageSize }).map((_, rowIndex) => (
                 <tr key={rowIndex}>
                   {columns.map((_, colIndex) => (
                     <td key={colIndex} className="px-6 py-4 align-middle">
                       <Skeleton className="h-5 w-full rounded-sm opacity-50" />
                     </td>
                   ))}
                 </tr>
               ))
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center text-muted-foreground">
                  No results found.
                </td>
              </tr>
            ) : (
              currentData.map((row) => (
                <tr 
                  key={row.id} 
                  className={cn(
                    "hover:bg-muted/30 transition-colors",
                    onRowClick && "cursor-pointer active:bg-muted/50"
                  )}
                  onClick={() => onRowClick && onRowClick(row)}
                >
                  {columns.map((col, idx) => (
                    <td key={idx} className={cn("px-6 py-4 align-middle", col.className)}>
                      {col.cell ? col.cell(row) : (row[col.accessorKey as keyof T] as React.ReactNode)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination Footer */}
      {!isLoading && data.length > 0 && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-border/50 bg-muted/10">
          <div className="text-xs text-muted-foreground font-medium">
            Showing <span className="text-foreground">{startIndex + 1}</span> to <span className="text-foreground">{endIndex}</span> of <span className="text-foreground">{data.length}</span> entries
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8 w-8 p-0"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-xs font-medium px-2 min-w-[3rem] text-center">
              Page {currentPage} of {totalPages}
            </span>
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8 w-8 p-0"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}