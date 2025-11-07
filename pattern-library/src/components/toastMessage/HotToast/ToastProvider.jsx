import { Toaster } from "react-hot-toast";

const ToastProvider = () => {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      gutter={12}
      containerStyle={{
        top: 50,
        right: 20,
      }}
      toastOptions={{
        duration: 4000,
        style: {
          background: "#fff",
          color: "#333",
          fontSize: "14px",
          padding: "16px 20px",
          borderRadius: "12px",
          boxShadow:
            "0 8px 24px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08)",
          border: "1px solid rgba(0, 0, 0, 0.06)",
          maxWidth: "400px",
          fontWeight: "500",
          backdropFilter: "blur(10px)",
        },
        success: {
          duration: 3500,
          icon: "✓",
          iconTheme: {
            primary: "#10b981",
            secondary: "#fff",
          },
          style: {
            background: "linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)",
            color: "#065f46",
            border: "1px solid #6ee7b7",
            boxShadow:
              "0 8px 24px rgba(16, 185, 129, 0.2), 0 2px 8px rgba(16, 185, 129, 0.1)",
            fontWeight: "600",
          },
        },
        error: {
          duration: 5000,
          icon: "✕",
          iconTheme: {
            primary: "#ef4444",
            secondary: "#fff",
          },
          style: {
            background: "linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)",
            color: "#991b1b",
            border: "1px solid #fca5a5",
            boxShadow:
              "0 8px 24px rgba(239, 68, 68, 0.2), 0 2px 8px rgba(239, 68, 68, 0.1)",
            fontWeight: "600",
          },
        },
        loading: {
          icon: "⏳",
          style: {
            background: "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)",
            color: "#1e40af",
            border: "1px solid #93c5fd",
            boxShadow:
              "0 8px 24px rgba(59, 130, 246, 0.2), 0 2px 8px rgba(59, 130, 246, 0.1)",
          },
        },
      }}
    />
  );
};

export default ToastProvider;
