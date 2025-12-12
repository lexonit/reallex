import React, { useEffect, useState } from 'react';
import { Bell, X, Check, Clock, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';
import { useNavigate } from 'react-router-dom';

interface Notification {
  _id: string;
  type: string;
  title: string;
  message: string;
  relatedPropertyId?: string;
  relatedAgentId?: string;
  isRead: boolean;
  actionUrl?: string;
  createdAt: string;
}

interface NotificationPanelProps {
  vendorId?: string;
  userId?: string;
}

export const NotificationPanel: React.FC<NotificationPanelProps> = ({ vendorId, userId }) => {
  const [hoverOpen, setHoverOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const unreadCount = notifications.filter(n => !n.isRead).length;

  // Fetch notifications
  const fetchNotifications = async () => {
    if (!userId) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/properties/notifications/list', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setNotifications(data);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch on mount and when panel opens
  useEffect(() => {
    if (userId) {
      fetchNotifications();
      // Poll every 30 seconds for new notifications
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [userId]);


  // Mark notification as read
  const markAsRead = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/properties/notifications/${notificationId}/read`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        setNotifications(prev =>
          prev.map(n => n._id === notificationId ? { ...n, isRead: true } : n)
        );
      }
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  // Handle notification click
  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification._id);
    
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
    } else if (notification.relatedPropertyId) {
      navigate(`/properties/${notification.relatedPropertyId}`);
    }
  };

  // Get icon based on notification type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'PROPERTY_APPROVAL':
        return <Clock className="h-4 w-4 text-orange-500" />;
      case 'PROPERTY_APPROVED':
        return <Check className="h-4 w-4 text-green-500" />;
      case 'PROPERTY_REJECTED':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Bell className="h-4 w-4 text-blue-500" />;
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <>
      {/* Notification Bell + Hover Dropdown */}
      <div
        className="relative"
        onMouseEnter={() => { setHoverOpen(true); fetchNotifications(); }}
        onMouseLeave={() => setHoverOpen(false)}
      >
        <motion.button
          whileHover={{ scale: 1.05, rotate: 0 }}
          whileTap={{ scale: 0.95 }}
          className="relative p-2 rounded-lg hover:bg-accent transition-colors"
        >
          <motion.span
            initial={{ rotate: 0 }}
            animate={hoverOpen ? { rotate: -10 } : { rotate: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <Bell className="h-5 w-5 text-muted-foreground" />
          </motion.span>
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </motion.button>

        {/* Hover Dropdown */}
        <AnimatePresence>
          {hoverOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              className="absolute right-0 mt-2 z-50 w-80 rounded-xl border border-border bg-card shadow-xl backdrop-blur-sm"
            >
              <div className="p-3 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 border border-blue-500/20">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                <div className="text-xs text-muted-foreground">
                  Hovering preview
                </div>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {loading ? (
                  <div className="flex items-center justify-center h-24">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="p-4 text-center text-xs text-muted-foreground">No notifications</div>
                ) : (
                  <ul className="divide-y divide-border">
                    {notifications.slice(0, 6).map((n) => (
                      <li key={n._id}>
                        <button
                          onClick={() => { handleNotificationClick(n); setHoverOpen(false); }}
                          className={cn(
                            "w-full px-4 py-3 text-left hover:bg-accent transition-colors flex gap-3",
                            !n.isRead && "bg-primary/5 dark:bg-primary/10"
                          )}
                        >
                          <div className={cn("mt-0.5 p-1.5 rounded-lg", !n.isRead ? "bg-primary/10" : "bg-muted")}>{getNotificationIcon(n.type)}</div>
                          <div className="flex-1 min-w-0">
                            <p className={cn("text-xs font-semibold truncate", !n.isRead ? "text-foreground" : "text-muted-foreground")}>{n.title}</p>
                            <p className="text-[11px] text-muted-foreground truncate">{n.message}</p>
                            <p className="text-[10px] text-muted-foreground/70 mt-0.5">{formatDate(n.createdAt)}</p>
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="p-2 border-t border-border flex items-center justify-between">
                <button
                  onClick={() => {
                    notifications.forEach(n => { if (!n.isRead) markAsRead(n._id); });
                  }}
                  className="text-[11px] text-primary hover:text-primary/80"
                >
                  Mark all as read
                </button>
                <div className="text-[11px] text-muted-foreground">Preview limited</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Removed old click-to-open notification side panel in favor of hover dropdown */}
    </>
  );
};
