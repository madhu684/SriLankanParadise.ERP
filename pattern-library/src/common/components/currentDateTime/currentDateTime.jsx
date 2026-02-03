import React from "react";
import useCurrentDateTime from "./useCurrentDateTime";

const CurrentDateTime = () => {
  const currentDateTime = useCurrentDateTime();

  return <span>{currentDateTime}</span>;
};

export default CurrentDateTime;














