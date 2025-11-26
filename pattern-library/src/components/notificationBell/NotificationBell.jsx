// src/components/NotificationBell.tsx
import React from "react";
import { useSignalR } from "../../context/SignalRContext";
import {
  BiBell,
  BiSolidBellRing,
  BiCheck,
  BiCheckDouble,
  BiTrash,
  BiTime,
} from "react-icons/bi";
import TimeAgo from "./TimeAgo";

const NotificationBell = () => {
  const {
    notifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
    clearNotification,
    clearAllNotifications,
    isConnected,
  } = useSignalR();

  const unreadCount = getUnreadCount();

  return (
    <div className="dropdown">
      {/* Bell Button with Animation */}
      <button
        className="btn btn-link position-relative p-2 rounded-circle hover-effect"
        type="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
        style={{
          transition: "all 0.3s ease",
        }}
      >
        {isConnected && unreadCount > 0 ? (
          <BiSolidBellRing
            size={26}
            className="text-primary"
            style={{
              animation: unreadCount > 0 ? "bellRing 1s ease-in-out" : "none",
            }}
          />
        ) : (
          <BiBell size={26} className="text-secondary" />
        )}

        {/* Enhanced Badge */}
        {unreadCount > 0 && (
          <span
            className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger shadow-sm"
            style={{
              fontSize: "0.65rem",
              animation: "pulse 2s ease-in-out infinite",
            }}
          >
            {unreadCount > 99 ? "99+" : unreadCount}
            <span className="visually-hidden">unread notifications</span>
          </span>
        )}
      </button>

      {/* Modern Dropdown */}
      <div
        className="dropdown-menu dropdown-menu-end shadow border-0 rounded-3 overflow-hidden"
        style={{
          width: "400px",
          maxHeight: "85vh",
          marginTop: "0.5rem",
        }}
      >
        {/* Gradient Header */}
        <div
          className="d-flex justify-content-between align-items-center p-3 text-white"
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          }}
        >
          <div>
            <h6 className="mb-0 fw-bold">Notifications</h6>
            {unreadCount > 0 && (
              <small className="opacity-90">{unreadCount} unread</small>
            )}
          </div>
          <div className="d-flex gap-2">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="btn btn-sm btn-light rounded-pill px-3"
                title="Mark all as read"
              >
                <BiCheckDouble size={18} className="me-1" />
                Read all
              </button>
            )}
            {notifications.length > 0 && (
              <button
                onClick={clearAllNotifications}
                className="btn btn-sm btn-light rounded-pill"
                title="Clear all"
              >
                <BiTrash size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Notification List */}
        <div
          className="overflow-auto"
          style={{ maxHeight: "calc(85vh - 140px)" }}
        >
          {notifications.length === 0 ? (
            <div className="p-5 text-center">
              <div className="mb-3">
                <BiBell
                  size={56}
                  className="text-muted opacity-25"
                  style={{ animation: "pulse 0.9s ease-in-out infinite" }}
                />
              </div>
              <h6 className="text-muted mb-2">All caught up!</h6>
              <p className="text-muted small mb-0">
                No notifications at the moment
              </p>
            </div>
          ) : (
            <div className="list-group list-group-flush">
              {notifications.map((notif, index) => (
                <div
                  key={notif.id}
                  className="list-group-item list-group-item-action border-0 px-3 py-3 position-relative overflow-hidden"
                  style={{
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    borderBottom:
                      index < notifications.length - 1
                        ? "1px solid #f0f0f0"
                        : "none",
                    backgroundColor: !notif.read
                      ? "rgba(59, 130, 246, 0.08)"
                      : "transparent",
                  }}
                  onClick={() => !notif.read && markAsRead(notif.id)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = !notif.read
                      ? "rgba(59, 130, 246, 0.15)"
                      : "#f8f9fa";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = !notif.read
                      ? "rgba(59, 130, 246, 0.08)"
                      : "transparent";
                  }}
                >
                  {!notif.read && (
                    <div
                      className="position-absolute start-0 top-0 bottom-0 bg-primary"
                      style={{ width: "4px" }}
                    />
                  )}
                  <div className="d-flex w-100 justify-content-between align-items-start">
                    <div className="flex-grow-1 pe-2">
                      {/* Message */}
                      <p
                        className="mb-2 text-secondary small"
                        style={{ lineHeight: "1.5" }}
                      >
                        {notif.title}
                      </p>

                      {/* Timestamp */}
                      {notif.createdAt && (
                        <div className="d-flex align-items-center gap-1">
                          <BiTime size={14} className="text-muted" />
                          <small className="text-muted">
                            <TimeAgo date={notif.createdAt} />
                          </small>
                        </div>
                      )}

                      {/* Action hint for unread */}
                      {!notif.read && (
                        <small className="text-primary mt-2 d-block fw-medium">
                          <BiCheck size={16} className="me-1" />
                          Click to mark as read
                        </small>
                      )}
                    </div>

                    {/* Delete Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        clearNotification(notif.id);
                      }}
                      className="btn btn-sm btn-light rounded-circle p-0 d-flex align-items-center justify-content-center"
                      style={{ width: "28px", height: "28px" }}
                      title="Remove notification"
                    >
                      <BiTrash size={16} className="text-danger" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modern Footer */}
        <div
          className="p-3 text-center border-top"
          style={{ backgroundColor: "#fafbfc" }}
        >
          <div className="d-flex align-items-center justify-content-center gap-2">
            {isConnected ? (
              <>
                <span
                  className="badge rounded-circle p-1"
                  style={{
                    backgroundColor: "#10b981",
                    width: "8px",
                    height: "8px",
                    animation: "pulse 2s ease-in-out infinite",
                  }}
                ></span>
                <small className="text-success fw-medium">Connected</small>
              </>
            ) : (
              <>
                <span
                  className="spinner-border spinner-border-sm text-warning"
                  style={{ width: "12px", height: "12px" }}
                ></span>
                <small className="text-warning fw-medium">
                  Reconnecting...
                </small>
              </>
            )}
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes bellRing {
          0%, 100% { transform: rotate(0deg); }
          10%, 30% { transform: rotate(-10deg); }
          20%, 40% { transform: rotate(10deg); }
          50% { transform: rotate(0deg); }
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }

        .hover-effect:hover {
          background-color: rgba(0, 0, 0, 0.05) !important;
          transform: scale(1.05);
        }

        .dropdown-menu {
          animation: slideDown 0.3s ease-out;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default NotificationBell;
