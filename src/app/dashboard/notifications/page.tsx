"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Bell, Loader2, CheckCircle2 } from "lucide-react";

interface Notification {
  id: string;
  title: string;
  text: string;
  timestamp: string;
  isRead: boolean;
}

export default function NotificationsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Simulated Backend Fetch
  useEffect(() => {
    const fetchNotifications = async () => {
      setIsLoading(true);
      try {
        // Replace with actual API call: await axios.get('/api/notifications')
        // Note: The backend will be configured to only keep and return the latest 10 notifications.
        await new Promise(resolve => setTimeout(resolve, 800)); 
        
        // Dummy Data (Simulating the latest 10 notifications returned by the backend)
        setNotifications([
          { id: "notif-1", title: "Scores Submitted", text: "Dr. Alabi submitted defence scores for Project Group B.", timestamp: "10 mins ago", isRead: false },
          { id: "notif-2", title: "New File Upload", text: "Adeyemi, Chisom uploaded 'Chapter 3 - Methodology'.", timestamp: "1 hour ago", isRead: false },
          { id: "notif-3", title: "System Update", text: "The Athenas platform will undergo maintenance this Sunday.", timestamp: "Yesterday", isRead: true },
          { id: "notif-4", title: "Proposal Approved", text: "Your topic 'AI-Driven Agricultural Analytics' was approved by Dr. Okonkwo.", timestamp: "2 days ago", isRead: true },
          { id: "notif-5", title: "Group Formation", text: "Project Group C has been successfully created and members assigned.", timestamp: "3 days ago", isRead: true },
          { id: "notif-6", title: "Broadcast Sent", text: "Your broadcast to '@project-groups' was delivered successfully.", timestamp: "4 days ago", isRead: true },
          { id: "notif-7", title: "Panelist Assigned", text: "Dr. Nwachukwu has been assigned as an internal panelist for Group A.", timestamp: "5 days ago", isRead: true },
          { id: "notif-8", title: "File Downloaded", text: "Dr. Okonkwo downloaded your final report submission.", timestamp: "6 days ago", isRead: true },
          { id: "notif-9", title: "Deadline Reminder", text: "Final report submission closes in 3 days. Please ensure all files are uploaded.", timestamp: "1 week ago", isRead: true },
          { id: "notif-10", title: "Welcome", text: "Welcome to the 2023/2024 Project Portal. Your account is now active.", timestamp: "2 weeks ago", isRead: true },
        ]);
      } catch (error) {
        console.error("Failed to fetch notifications", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const markAllAsRead = () => {
    // In the future, this will trigger an API call to update the backend
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  // Safeguard: Ensure only the latest 10 notifications are displayed, 
  // accommodating the backend logic that removes older notifications.
  const displayNotifications = notifications.slice(0, 10);

  return (
    <div className="flex flex-col h-full w-full bg-[#F8F9FA] overflow-hidden">
      {/* Header */}
      <header className="shrink-0 bg-white border-b border-[var(--color-brand-light)]/70 px-8 py-6 flex items-center gap-4">
        <button 
          onClick={() => router.back()} 
          className="p-2 -ml-2 text-gray-400 hover:bg-gray-50 hover:text-[var(--color-brand-dark)] rounded-lg transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-[var(--color-brand-dark)] flex items-center gap-2">
              <Bell size={22} className="text-[#A32A2A]" />
              Notifications
            </h1>
            <p className="text-sm text-gray-400 mt-1">System alerts, file uploads, and grading updates.</p>
          </div>
          <button 
            onClick={markAllAsRead}
            className="flex items-center gap-2 text-sm font-bold text-[var(--color-brand-teal)] bg-[#EEF5F4] px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
          >
            <CheckCircle2 size={16} /> Mark all as read
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
        <div className="max-w-4xl mx-auto bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          
          {isLoading ? (
            <div className="flex flex-col items-center justify-center p-20 text-gray-400">
              <Loader2 size={32} className="animate-spin mb-4 text-[var(--color-brand-teal)]" />
              <p className="text-sm font-medium">Loading notifications...</p>
            </div>
          ) : displayNotifications.length === 0 ? (
            <div className="p-20 text-center text-gray-400 italic">No new notifications.</div>
          ) : (
            <div className="divide-y divide-gray-100">
              {displayNotifications.map((notif) => (
                <div key={notif.id} className={`p-6 transition-colors ${notif.isRead ? "bg-white opacity-60" : "bg-blue-50/20 hover:bg-gray-50"}`}>
                  <div className="flex justify-between items-start mb-1">
                    <h3 className={`text-sm ${notif.isRead ? "font-semibold text-gray-700" : "font-bold text-[var(--color-brand-dark)]"}`}>
                      {notif.title}
                    </h3>
                    <span className="text-xs font-medium text-gray-400">{notif.timestamp}</span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">{notif.text}</p>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}