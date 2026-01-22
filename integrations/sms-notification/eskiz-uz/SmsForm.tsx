import React, { useState } from "react";
import { useEskizSms } from "./useEskizSms";

// A form component for sending SMS messages via Eskiz.uz.
// It allows the user to input a phone number and a message, then sends the SMS.
const SmsForm: React.FC = () => {
  const [mobilePhone, setMobilePhone] = useState("");
  const [message, setMessage] = useState("");
  const { isLoading, error, sendSms } = useEskizSms();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendSms(mobilePhone, message);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="mobilePhone">Mobile Phone:</label>
        <input
          id="mobilePhone"
          type="text"
          value={mobilePhone}
          onChange={(e) => setMobilePhone(e.target.value)}
          placeholder="e.g., 998901234567"
          required
        />
      </div>
      <div>
        <label htmlFor="message">Message:</label>
        <textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Your message"
          required
        />
      </div>
      <button type="submit" disabled={isLoading}>
        {isLoading ? "Sending..." : "Send SMS"}
      </button>
      {error && <p style={{ color: "red" }}>Error: {error.message}</p>}
    </form>
  );
};

export default SmsForm;