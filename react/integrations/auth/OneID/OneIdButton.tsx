import React from "react";
import { getOneIdUrl } from "./oneid.utils";

// A button component that initiates the OneID login flow.
// When clicked, it redirects the user to the OneID authorization URL.
const OneIdButton: React.FC = () => {
  const handleClick = () => {
    window.location.href = getOneIdUrl();
  };

  return <button onClick={handleClick}>Login with OneID</button>;
};

export default OneIdButton;