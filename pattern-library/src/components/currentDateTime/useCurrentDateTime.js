import { useState, useEffect } from "react";

const useCurrentDateTime = () => {
  const [currentDateTime, setCurrentDateTime] = useState(formatDateTime());

  function formatDateTime() {
    const now = new Date();
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return now.toLocaleDateString("en-US", options);
  }

  useEffect(() => {
    const intervalId = setInterval(() => {
      const seconds = new Date().getSeconds();
      if (seconds === 0) {
        setCurrentDateTime(formatDateTime());
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return currentDateTime;
};

export default useCurrentDateTime;
