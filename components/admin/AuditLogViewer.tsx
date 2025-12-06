import React, { useState, useEffect } from 'react';
import { DataTable } from '../ui/DataTable';
import { Button } from '../Button';
import { Download, Activity } from 'lucide-react';
import { AuditLog } from '../../types';

export const AuditLogViewer: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(false);

  // Mock fetching data
  useEffect(() => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const mockLogs: AuditLog[] = [
        {
          id: '1',
          action: 'CREATE_PROPERTY',
          targetModel: 'Property',
          details: { initialStatus: 'DRAFT' },
          timestamp: new Date().toISOString(),
          userId: { firstName: 'John', lastName: 'Doe', email: 'john@example.com' }
        },
        {
          id: '2',
          action: 'APPROVE_PROPERTY',
          targetModel: 'Property',
          details: { approvedBy: 'sarah_connor' },
          timestamp: new Date(Date.now() - 86400000).toISOString(),
          userId: { firstName: 'Sarah', lastName: 'Connor', email: 'sarah@example.com' }
        },
        {
          id: '3',
          action: 'LOGIN',
          targetModel: 'User',
          details: { ip: '192.168.1.1' },
          timestamp: new Date(Date.now() - 172800000).toISOString(),
          userId: { firstName: 'John', lastName: 'Doe', email: 'john@example.com' }
        }
      ];
      setLogs(mockLogs);
      setLoading(false);
    }, 1000);
  }, []);

  const handleExport = () => {
    // In real app: window.open('/api/analytics/export/audit-logs');
    alert('Downloading CSV...');
  };

  const columns = [
    { 
      header: 'Timestamp', 
      accessorKey: 'timestamp' as keyof AuditLog,
      cell: (log: AuditLog) => new Date(log.timestamp).toLocaleString()
    },
    { header: 'Action', accessorKey: 'action' as keyof AuditLog, className: 'font-medium' },
    { 
      header: 'User', 
      accessorKey: 'userId' as keyof AuditLog, 
      cell: (log: AuditLog) => log.userId ? `${log.userId.firstName} ${log.userId.lastName}` : 'System' 
    },
    { header: 'Target', accessorKey: 'targetModel' as keyof AuditLog },
    { 
      header: 'Details', 
      accessorKey: 'details' as keyof AuditLog, 
      cell: (log: AuditLog) => (
        <span className="text-xs font-mono text-muted-foreground truncate max-w-[200px] block">
          {JSON.stringify(log.details)}
        </span>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            System Activity
          </h3>
          <p className="text-sm text-muted-foreground">Monitor user actions and compliance logs.</p>
        </div>
        <Button variant="outline" size="sm" onClick={handleExport}>
          <Download className="mr-2 h-4 w-4" /> Export CSV
        </Button>
      </div>
      
      <DataTable 
        data={logs} 
        columns={columns} 
        isLoading={loading}
      />
    </div>
  );
};