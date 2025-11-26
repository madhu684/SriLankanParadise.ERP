import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import signalRService from "../services/signalRService";
import { UserContext } from "./userContext";

const SignalRContext = createContext(null);

export const useSignalR = () => {
  const context = useContext(SignalRContext);
  if (!context) {
    throw new Error("useSignalR must be used within SignalRProvider");
  }
  return context;
};

const STORAGE_KEY = "signalr_notifications";
const MAX_NOTIFICATIONS = 50; // Limit stored notifications

export const SignalRProvider = ({ children, hubUrl }) => {
  const [connectionState, setConnectionState] = useState("disconnected");

  // Load notifications from localStorage on mount
  const [notifications, setNotifications] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("Failed to load notifications from localStorage:", error);
      return [];
    }
  });

  const [error, setError] = useState(null);
  const isInitialized = useRef(false);
  const notificationIds = useRef(new Set());

  const { user } = useContext(UserContext);
  const userId = user?.userId;

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    try {
      // Keep only the latest MAX_NOTIFICATIONS
      const toStore = notifications.slice(0, MAX_NOTIFICATIONS);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
    } catch (error) {
      console.error("Failed to save notifications to localStorage:", error);
    }
  }, [notifications]);

  // Initialize notification IDs set from stored notifications
  useEffect(() => {
    notifications.forEach((notif) => {
      notificationIds.current.add(notif.id);
    });
  }, []);

  // Initialize connection
  useEffect(() => {
    if (isInitialized.current || !hubUrl) return;

    isInitialized.current = true;

    const initializeConnection = async () => {
      try {
        signalRService.createConnection(hubUrl);

        signalRService.addListener("main", (event, data) => {
          switch (event) {
            case "connected":
              setConnectionState("connected");
              setError(null);
              break;
            case "disconnected":
              setConnectionState("disconnected");
              break;
            case "reconnecting":
              setConnectionState("reconnecting");
              break;
            case "reconnected":
              setConnectionState("connected");
              setError(null);
              break;
            case "connectionClosed":
              setConnectionState("disconnected");
              setError(data.error?.message || "Connection closed");
              break;
            case "connectionFailed":
              setConnectionState("failed");
              setError(data.error?.message || "Connection failed");
              break;
            default:
              break;
          }
        });

        signalRService.on("ReceiveNotification", (notification) => {
          console.log("Notification received:", notification);

          // Generate a unique ID based on content and timestamp
          const uniqueId = notification.id;

          // Check if this notification was already received
          if (notificationIds.current.has(uniqueId)) {
            console.log("Duplicate notification detected, skipping:", uniqueId);
            return;
          }

          // Add to tracking set
          notificationIds.current.add(uniqueId);

          // Add notification to state
          setNotifications((prev) => {
            const newNotification = {
              id: uniqueId,
              title: notification.title || "Notification",
              message: notification.message || "",
              createdAt: notification.timestamp || new Date().toISOString(),
              read: false,
              ...notification,
            };

            // Check if notification already exists in state (extra safety)
            if (prev.some((n) => n.id === uniqueId)) {
              return prev;
            }

            return [newNotification, ...prev];
          });

          // Show browser notification if permission granted
          if (Notification.permission === "granted") {
            try {
              new Notification(notification.title || "New Notification", {
                body: notification.message || "",
                icon: "/notification-icon.png",
                badge: "/badge-icon.png",
                tag: uniqueId, // Prevents duplicate browser notifications
              });
            } catch (err) {
              console.error("Failed to show browser notification:", err);
            }
          }
        });

        signalRService.on("Registered", (message) => {
          console.log("Registration confirmed:", message);
        });

        if (userId) {
          setConnectionState("connecting");
          await signalRService.startConnection(userId);
        }
      } catch (error) {
        console.error("Failed to initialize SignalR:", error);
        setError(error.message);
        setConnectionState("failed");
      }
    };

    initializeConnection();

    return () => {
      signalRService.removeListener("main");
      signalRService.stopConnection();
      isInitialized.current = false;
    };
  }, [hubUrl, userId]);

  // Request browser notification permission
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission().then((permission) => {
        console.log("Notification permission:", permission);
      });
    }
  }, []);

  const markAsRead = useCallback((notificationId) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
  }, []);

  const clearNotification = useCallback((notificationId) => {
    setNotifications((prev) =>
      prev.filter((notif) => notif.id !== notificationId)
    );
    // Remove from tracking set
    notificationIds.current.delete(notificationId);
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
    // Clear tracking set
    notificationIds.current.clear();
  }, []);

  const getUnreadCount = useCallback(() => {
    return notifications.filter((n) => !n.read).length;
  }, [notifications]);

  const subscribe = useCallback((eventName, callback) => {
    signalRService.on(eventName, callback);
    return () => signalRService.off(eventName, callback);
  }, []);

  const reconnect = useCallback(async () => {
    try {
      setConnectionState("connecting");
      setError(null);
      await signalRService.stopConnection();
      await signalRService.startConnection(userId);
    } catch (error) {
      console.error("Failed to reconnect:", error);
      setError(error.message);
    }
  }, [userId]);

  const value = {
    connectionState,
    notifications,
    error,
    isConnected: connectionState === "connected",
    markAsRead,
    markAllAsRead,
    clearNotification,
    clearAllNotifications,
    getUnreadCount,
    subscribe,
    reconnect,
  };

  return (
    <SignalRContext.Provider value={value}>{children}</SignalRContext.Provider>
  );
};
