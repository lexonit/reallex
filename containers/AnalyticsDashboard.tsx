import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/Card';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { AuditLogViewer } from './admin/AuditLogViewer';
import { Skeleton } from '../components/ui/Skeleton';

const PROPERTY_TREND_DATA = [
  { name: 'Mon', created: 4, sold: 1 },
  { name: 'Tue', created: 3, sold: 2 },
  { name: 'Wed', created: 2, sold: 0 },
  { name: 'Thu', created: 7, sold: 3 },
  { name: 'Fri', created: 5, sold: 2 },
  { name: 'Sat', created: 1, sold: 1 },
  { name: 'Sun', created: 0, sold: 0 },
];

const LEAD_SOURCE_DATA = [
  { name: 'Website', value: 400 },
  { name: 'Referral', value: 300 },
  { name: 'Zillow', value: 200 },
  { name: 'Social', value: 278 },
];

export const AnalyticsDashboard: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Analytics & Reports</h2>
        <p className="text-muted-foreground">Deep dive into your agency's performance.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Property Activity</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            {isLoading ? (
              <Skeleton className="w-full h-full" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={PROPERTY_TREND_DATA}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted/20" />
                  <XAxis dataKey="name" fontSize={12} stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
                  <YAxis fontSize={12} stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
                  <Tooltip 
                     contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                  />
                  <Legend />
                  <Bar dataKey="created" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Listed" />
                  <Bar dataKey="sold" fill="hsl(var(--secondary-foreground))" radius={[4, 4, 0, 0]} name="Sold" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Lead Volume Trend</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            {isLoading ? (
              <Skeleton className="w-full h-full" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={LEAD_SOURCE_DATA}>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted/20" />
                   <XAxis dataKey="name" fontSize={12} stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
                   <YAxis fontSize={12} stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
                   <Tooltip 
                     contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                  />
                   <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Audit Logs Section */}
      <Card>
        <CardContent className="pt-6">
          <AuditLogViewer />
        </CardContent>
      </Card>
    </div>
  );
};