import * as signalR from "@microsoft/signalr";

// Connection state
let connection = null;
let isConnected = false;
let reconnectAttempts = 0;
const maxReconnectAttempts = 5;
const listeners = new Map();

// Create connection
const createConnection = (hubUrl) => {
  if (connection) {
    return connection;
  }

  connection = new signalR.HubConnectionBuilder()
    .withUrl(hubUrl, {
      skipNegotiation: false,
      transport:
        signalR.HttpTransportType.WebSockets |
        signalR.HttpTransportType.ServerSentEvents |
        signalR.HttpTransportType.LongPolling,
    })
    .withAutomaticReconnect({
      nextRetryDelayInMilliseconds: (retryContext) => {
        if (retryContext.elapsedMilliseconds < 60000) {
          return Math.random() * 10000;
        } else {
          return 30000;
        }
      },
    })
    .configureLogging(signalR.LogLevel.Information)
    .build();

  setupConnectionHandlers();
  return connection;
};

// Setup connection event handlers
const setupConnectionHandlers = () => {
  connection.onclose((error) => {
    isConnected = false;
    console.error("SignalR connection closed:", error);
    notifyListeners("connectionClosed", { error });
  });

  connection.onreconnecting((error) => {
    isConnected = false;
    console.warn("SignalR reconnecting:", error);
    notifyListeners("reconnecting", { error });
  });

  connection.onreconnected((connectionId) => {
    isConnected = true;
    reconnectAttempts = 0;
    console.log("SignalR reconnected:", connectionId);
    notifyListeners("reconnected", { connectionId });
  });
};

// Start connection
const startConnection = async (userId) => {
  if (!connection) {
    throw new Error("Connection not initialized. Call createConnection first.");
  }

  if (isConnected) {
    console.log("Already connected to SignalR");
    return;
  }

  try {
    await connection.start();
    isConnected = true;
    console.log("SignalR Connected successfully");

    if (userId) {
      await registerUser(userId);
    }

    notifyListeners("connected", { connectionId: connection.connectionId });
  } catch (error) {
    console.error("Error starting SignalR connection:", error);
    isConnected = false;
    throw error;
  }
};

// Stop connection
const stopConnection = async () => {
  if (connection && isConnected) {
    try {
      await connection.stop();
      isConnected = false;
      console.log("SignalR connection stopped");
      notifyListeners("disconnected", {});
    } catch (error) {
      console.error("Error stopping SignalR connection:", error);
    }
  }
};

// Register user with hub
const registerUser = async (userId) => {
  if (!isConnected) {
    throw new Error("Cannot register user - not connected");
  }

  try {
    await connection.invoke("RegisterUser", userId);
    console.log("User registered:", userId);
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};

// Subscribe to hub method
const on = (methodName, callback) => {
  if (!connection) {
    throw new Error("Connection not initialized");
  }
  connection.on(methodName, callback);
};

// Unsubscribe from hub method
const off = (methodName, callback) => {
  if (connection) {
    connection.off(methodName, callback);
  }
};

// Add connection state listener
const addListener = (listenerId, callback) => {
  listeners.set(listenerId, callback);
};

// Remove connection state listener
const removeListener = (listenerId) => {
  listeners.delete(listenerId);
};

// Notify all listeners
const notifyListeners = (event, data) => {
  listeners.forEach((callback) => {
    callback(event, data);
  });
};

// Get connection state
const getConnectionState = () => {
  if (!connection) return "disconnected";

  switch (connection.state) {
    case signalR.HubConnectionState.Connected:
      return "connected";
    case signalR.HubConnectionState.Connecting:
      return "connecting";
    case signalR.HubConnectionState.Reconnecting:
      return "reconnecting";
    case signalR.HubConnectionState.Disconnected:
      return "disconnected";
    default:
      return "unknown";
  }
};

// Check if connected
const isConnectionActive = () => {
  return (
    isConnected && connection?.state === signalR.HubConnectionState.Connected
  );
};

// Export all functions
const signalRService = {
  createConnection,
  startConnection,
  stopConnection,
  registerUser,
  on,
  off,
  addListener,
  removeListener,
  getConnectionState,
  isConnectionActive,
};

export default signalRService;
