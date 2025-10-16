import React, { createContext, useState, useEffect, useRef, useContext, ReactNode, useCallback } from 'react';
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { SOCKET_BASE_URL } from '../util/base';

// Define the type for a notification message
export interface NotificationMessage {
  id: number | string;
  title: string;
  content: string;
  type?: 'success' | 'warning' | 'error' | 'info' | string;
  isRead: boolean;
  timestamp: string;
  readTimestamp?: string; // Track when notification was marked as read
  _dedupeHash?: string;
}

// Define the shape of the context value
interface NotificationContextType {
  messages: NotificationMessage[];
  notifying: boolean;
  connectionStatus: string;
  markAsRead: (id: NotificationMessage['id']) => void;
  markAllAsRead: () => void;
  setNotifying: React.Dispatch<React.SetStateAction<boolean>>;
}

// Create the context
const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Key for localStorage
const LOCAL_STORAGE_KEY = "mwanamama_notifications";
// 24 hours in milliseconds
const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000; 

// Function to save notifications to localStorage
const saveNotificationsToStorage = (notifications: NotificationMessage[]) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(notifications));
  } catch (error) {
    console.error("Failed to save notifications to localStorage:", error);
  }
};

// Function to clean up old notifications - only delete READ notifications after 24 hours
const cleanupOldNotifications = (currentMessages: NotificationMessage[]) => {
  const now = Date.now();
  const filteredMessages = currentMessages.filter(msg => {
    // Keep unread notifications regardless of age
    if (!msg.isRead) {
      return true;
    }
    
    // For read notifications, check if 24 hours have passed since they were read
    if (msg.readTimestamp) {
      const readTime = new Date(msg.readTimestamp).getTime();
      return (now - readTime) < TWENTY_FOUR_HOURS;
    }
    
    // Fallback: if no readTimestamp but marked as read, use creation timestamp
    // This handles legacy notifications that might not have readTimestamp
    const msgTimestamp = new Date(msg.timestamp).getTime();
    return (now - msgTimestamp) < TWENTY_FOUR_HOURS;
  });
  return filteredMessages;
};

// Function to load notifications from localStorage
const loadNotificationsFromStorage = (): NotificationMessage[] => {
  try {
    const storedNotifications = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedNotifications) {
      const parsedNotifications: NotificationMessage[] = JSON.parse(storedNotifications);
      return cleanupOldNotifications(parsedNotifications);
    }
  } catch (error) {
    console.error("Failed to load notifications from localStorage:", error);
  }
  return [];
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [messages, setMessages] = useState<NotificationMessage[]>([]);
  const [notifying, setNotifying] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState("Disconnected");

  // Ref to store the STOMP client instance
  const stompClientRef = useRef<Client | null>(null);
  // Ref to store the hash of the last received message for deduplication
  const lastReceivedMessageHashRef = useRef<string | null>(null);
  // Ref to store the timestamp of the last received message for deduplication window
  const lastReceivedMessageTimestampRef = useRef<number>(0);

  const markAsRead = useCallback((id: NotificationMessage['id']) => {
    const readTimestamp = new Date().toISOString();
    setMessages(prev => {
      const updatedMessages = prev.map(msg => 
        msg.id === id ? { ...msg, isRead: true, readTimestamp } : msg
      );
      saveNotificationsToStorage(updatedMessages);
      return updatedMessages;
    });
  }, []);

  const markAllAsRead = useCallback(() => {
    const readTimestamp = new Date().toISOString();
    setMessages(prev => {
      const updatedMessages = prev.map(msg => ({ 
        ...msg, 
        isRead: true, 
        readTimestamp: msg.isRead ? msg.readTimestamp : readTimestamp 
      }));
      saveNotificationsToStorage(updatedMessages);
      return updatedMessages;
    });
    setNotifying(false);
  }, []);

  useEffect(() => {
    // console.log("Initializing WebSocket connection...");
    setConnectionStatus("Connecting...");

    // Load notifications from localStorage on mount
    const loadedNotifications = loadNotificationsFromStorage();
    setMessages(loadedNotifications);
    
    // Save cleaned notifications back to localStorage if any were removed
    if (loadedNotifications.length > 0) {
      saveNotificationsToStorage(loadedNotifications);
    }

    // Set up periodic cleanup - run every hour
    const cleanupInterval = setInterval(() => {
      setMessages(prevMessages => {
        const cleaned = cleanupOldNotifications(prevMessages);
        if (cleaned.length !== prevMessages.length) {
          // console.log(`Cleaned up ${prevMessages.length - cleaned.length} old read notifications`);
          saveNotificationsToStorage(cleaned);
        }
        return cleaned;
      });
    }, 60 * 60 * 1000); // Run every hour

    // Ensure any existing client is deactivated before creating a new one
    if (stompClientRef.current && stompClientRef.current.connected) {
      // console.log("Deactivating existing STOMP client before re-initialization.");
      stompClientRef.current.deactivate();
      stompClientRef.current = null;
    }
    
   
    const socket = new SockJS(SOCKET_BASE_URL);

    const stompClient = new Client({
      webSocketFactory: () => socket,
      debug: (str) => {
        // console.log("STOMP Debug:", str);
      },
      onConnect: (frame) => {
        // console.log("Connected to WebSocket:", frame);
        setConnectionStatus("Connected");
        
        stompClient.subscribe("/topic/notifications", (msg) => {
          // console.log("Raw message received:", msg);
          try {
            const rawPayload = JSON.parse(msg.body);
            const payload: NotificationMessage = {
              id: rawPayload.id || Date.now() + Math.random(),
              title: rawPayload.title,
              content: rawPayload.description,
              type: rawPayload.type,
              isRead: false,
              timestamp: new Date().toISOString()
            };
            // console.log("Parsed notification:", payload);

            // Generate a hash for deduplication based on logical content
            const dedupeContent = {
              title: payload.title,
              content: payload.content
            };
            const currentMessageHash = JSON.stringify(dedupeContent);
            const currentTime = Date.now();

            // Deduplication logic: check if the same logical message was received very recently
            if (
              lastReceivedMessageHashRef.current === currentMessageHash &&
              (currentTime - lastReceivedMessageTimestampRef.current < 500)
            ) {
              // console.log("Duplicate message detected and ignored based on content:", payload);
              return;
            }

            // Update refs for deduplication
            lastReceivedMessageHashRef.current = currentMessageHash;
            lastReceivedMessageTimestampRef.current = currentTime;
            
            setMessages(prev => {
              const updatedMessages = [payload, ...prev];
              saveNotificationsToStorage(updatedMessages);
              return updatedMessages;
            });
            setNotifying(true);
          } catch (error) {
            console.error("Error parsing message:", error);
          }
        });
      },
      onStompError: (frame) => {
        console.error("STOMP Broker error:", frame.headers["message"]);
        console.error("STOMP Error details:", frame.body);
        setConnectionStatus("Error");
      },
      onWebSocketError: (error) => {
        console.error("WebSocket error:", error);
        setConnectionStatus("WebSocket Error");
      },
      onDisconnect: () => {
        // console.log("Disconnected from WebSocket");
        setConnectionStatus("Disconnected");
      }
    });

    stompClientRef.current = stompClient;
    stompClient.activate();

    return () => {
      // console.log("Cleaning up WebSocket connection...");
      if (stompClientRef.current && stompClientRef.current.connected) {
        stompClientRef.current.deactivate();
      }
      stompClientRef.current = null;
      clearInterval(cleanupInterval);
    };
  }, []);

  const contextValue = {
    messages,
    notifying,
    connectionStatus,
    markAsRead,
    markAllAsRead,
    setNotifying,
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
};

// Custom hook to use the NotificationContext
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
