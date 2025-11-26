// src/components/TimeAgo.jsx
import { useState, useEffect } from "react";

const TimeAgo = ({ date }) => {
  const [timeAgo, setTimeAgo] = useState("");

  const calculateTimeAgo = (date) => {
    const now = new Date();
    const then = new Date(date);
    const diffMs = now.getTime() - then.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return then.toLocaleDateString();
  };

  useEffect(() => {
    setTimeAgo(calculateTimeAgo(date));

    const interval = setInterval(() => {
      setTimeAgo(calculateTimeAgo(date));
    }, 60000);

    return () => clearInterval(interval);
  }, [date]);

  return <>{timeAgo}</>;
};

export default TimeAgo;
