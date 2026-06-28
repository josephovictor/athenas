"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, MessageSquare, Loader2 } from "lucide-react";

// --- INTERFACES (Structured for future backend integration) ---
interface BroadcastTarget {
  id: string;
  name: string; // The handle, e.g., "@all"
  displayName: string; // The readable name, e.g., "All Users"
  description: string;
}

interface BroadcastMessage {
  id: string;
  targetId: string; // Links to BroadcastTarget.id
  text: string;
  timestamp: string;
  // Future backend fields to consider:
  // senderId: string;
  // senderName: string;
  // readReceipts: number;
}

// --- HELPER FUNCTION ---
// Simple condition to generate the alphabet abbreviation for the receiving party
const getTargetAbbreviation = (displayName: string): string => {
  if (displayName.toLowerCase().includes("all")) return "ALL";
  
  const words = displayName.split(" ");
  if (words.length === 1) {
    return displayName.substring(0, 3).toUpperCase();
  }
  
  // Takes the first letter of each word (e.g., "Project Internal Panellist" -> "PIP")
  return words.map(w => w[0]).join("").toUpperCase();
};

export default function MessagesPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  
  // Separate states for targets (channels) and messages to mimic a relational database/API structure
  const [targets, setTargets] = useState<BroadcastTarget[]>([]);
  const [messages, setMessages] = useState<BroadcastMessage[]>([]);
  const [selectedTargetId, setSelectedTargetId] = useState<string | null>(null);

  // Simulated Backend Fetch
  useEffect(() => {
    const fetchBroadcastData = async () => {
      setIsLoading(true);
      try {
        // Replace with actual API calls later:
        // const targetsRes = await axios.get('/api/broadcasts/targets');
        // const messagesRes = await axios.get('/api/broadcasts/history');
        await new Promise(resolve => setTimeout(resolve, 800)); 
        
        // --- DUMMY TARGETS DATA ---
        const dummyTargets: BroadcastTarget[] = [
          { id: "all", name: "@all", displayName: "All Users", description: "Broadcasts sent to every user in the system." },
          { id: "pip", name: "@project-internal-panellists", displayName: "Project Internal Panellist", description: "Broadcasts sent to all project internal panellists." },
          { id: "pep", name: "@project-external-panellists", displayName: "Project External Panellist", description: "Broadcasts sent to all project external panellists." },
          { id: "sgb", name: "@seminar-group-b", displayName: "Seminar Group B", description: "Broadcasts sent to Seminar Group B." },
          { id: "psb", name: "@project-supervisor-b", displayName: "Project Supervisor B", description: "Broadcasts sent to Project Supervisor for Group B." },
          { id: "pg", name: "@project-groups", displayName: "Project Groups", description: "Broadcasts sent to all student project groups." },
        ];

        // --- DUMMY MESSAGES DATA ---
        const dummyMessages: BroadcastMessage[] = [
          { id: "msg-1", targetId: "pg", text: "Please ensure all final reports are uploaded by Friday 5PM.", timestamp: "2 hours ago" },
          { id: "msg-2", targetId: "psb", text: "Supervisor allocations have been finalized for this semester. Kindly check your dashboard.", timestamp: "Yesterday, 2:30 PM" },
          { id: "msg-3", targetId: "all", text: "Welcome to the 2023/2024 Project Portal.", timestamp: "Oct 12, 9:00 AM" },
          { id: "msg-4", targetId: "sgb", text: "Reminder: Seminar Group B needs to submit their proposals by end of day.", timestamp: "Oct 10, 10:00 AM" },
          { id: "msg-5", targetId: "pip", text: "Internal defence schedule for next week has been published. Please check your assignments.", timestamp: "Oct 08, 3:00 PM" },
          { id: "msg-6", targetId: "pep", text: "External panellist orientation is scheduled for Monday at 10 AM.", timestamp: "Oct 05, 11:00 AM" },
        ];

        setTargets(dummyTargets);
        setMessages(dummyMessages);
        
        // Auto-select the first target to show content immediately
        if (dummyTargets.length > 0) {
          setSelectedTargetId(dummyTargets[0].id);
        }
      } catch (error) {
        console.error("Failed to fetch broadcast data", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBroadcastData();
  }, []);

  const selectedTarget = targets.find(t => t.id === selectedTargetId);
  
  // Filter messages for the selected target. 
  const filteredMessages = messages
    .filter(msg => msg.targetId === selectedTargetId)
    .sort((a, b) => {
       return a.id.localeCompare(b.id) * -1; 
    });

  // Helper to get the last message for a target (used for the sidebar preview)
  const getLastMessage = (targetId: string) => {
    return messages.filter(m => m.targetId === targetId)[0]; 
  };

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
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-brand-dark)] flex items-center gap-2">
            <MessageSquare size={22} className="text-[var(--color-brand-teal)]" />
            Broadcast History
          </h1>
          <p className="text-sm text-gray-400 mt-1">A read-only log of all broadcasts sent from your account.</p>
        </div>
      </header>

      {/* Content: Two-Pane Layout */}
      <div className="flex-1 flex overflow-hidden p-8 gap-6">
        
        {/* Left Pane: Channels / Targets List */}
        <div className="w-1/3 max-w-sm bg-white border border-gray-200 rounded-2xl shadow-sm flex flex-col overflow-hidden">
          <div className="p-5 border-b border-gray-100 shrink-0">
            <h2 className="font-bold text-[var(--color-brand-dark)] text-sm uppercase tracking-wider">Channels</h2>
          </div>
          
          {isLoading ? (
            <div className="flex-1 flex items-center justify-center">
               <Loader2 size={24} className="animate-spin text-[var(--color-brand-teal)]" />
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {targets.map((target) => {
                const lastMsg = getLastMessage(target.id);
                const isActive = selectedTargetId === target.id;
                const abbreviation = getTargetAbbreviation(target.displayName);

                return (
                  <div
                    key={target.id}
                    onClick={() => setSelectedTargetId(target.id)}
                    className={`p-4 border-b border-gray-50 cursor-pointer transition-all group ${
                      isActive 
                        ? "bg-[#EEF5F4] border-l-4 border-l-[var(--color-brand-teal)]" 
                        : "hover:bg-gray-50 border-l-4 border-l-transparent"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Alphabetical Abbreviation Avatar */}
                      <div className={`w-10 h-10 flex items-center justify-center rounded-lg shrink-0 text-xs font-bold tracking-wider ${
                        isActive ? 'bg-[var(--color-brand-teal)] text-white' : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'
                      }`}>
                        {abbreviation}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center mb-1">
                          <span className={`font-bold text-sm truncate ${isActive ? 'text-[var(--color-brand-dark)]' : 'text-gray-700'}`}>
                            {target.name}
                          </span>
                          {lastMsg && (
                            <span className="text-[10px] text-gray-400 whitespace-nowrap ml-2">{lastMsg.timestamp}</span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 line-clamp-1">
                          {lastMsg ? lastMsg.text : target.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Pane: Message History */}
        <div className="flex-1 bg-white border border-gray-200 rounded-2xl shadow-sm flex flex-col overflow-hidden">
          {isLoading ? (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
              <Loader2 size={32} className="animate-spin mb-4 text-[var(--color-brand-teal)]" />
              <p className="text-sm font-medium">Loading history...</p>
            </div>
          ) : (
            <>
              {/* Right Pane Header */}
              <div className="p-5 border-b border-gray-100 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  {selectedTarget && (
                    <div className={`w-10 h-10 flex items-center justify-center rounded-lg text-xs font-bold tracking-wider bg-[#EEF5F4] text-[var(--color-brand-teal)]`}>
                      {getTargetAbbreviation(selectedTarget.displayName)}
                    </div>
                  )}
                  <div>
                    <h2 className="font-bold text-[var(--color-brand-dark)] text-lg">
                      {selectedTarget?.displayName || "Select a channel"}
                    </h2>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {selectedTarget?.description || ""}
                    </p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-gray-400 bg-gray-100 px-3 py-1 rounded-full shrink-0">
                  {filteredMessages.length} {filteredMessages.length === 1 ? 'broadcast' : 'broadcasts'}
                </span>
              </div>
              
              {/* Right Pane Content */}
              <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                {!selectedTargetId ? (
                  <div className="h-full flex items-center justify-center text-gray-400 italic">
                    Select a channel from the left to view its broadcast history.
                  </div>
                ) : filteredMessages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-gray-400">
                    <MessageSquare size={40} className="mb-3 opacity-20" />
                    <p className="italic">No broadcasts sent to this channel yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredMessages.map((msg) => (
                      <div key={msg.id} className="p-5 bg-gray-50 border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-xs font-bold text-[var(--color-brand-teal)] bg-[#EEF5F4] px-2.5 py-1 rounded-md border border-[var(--color-brand-teal)]/20">
                            {selectedTarget?.name}
                          </span>
                          <span className="text-xs font-medium text-gray-400">{msg.timestamp}</span>
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed">{msg.text}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}