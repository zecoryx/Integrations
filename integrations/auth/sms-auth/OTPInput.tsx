import React, { useState, useRef, useEffect, ChangeEvent } from "react";

interface Props {
  length: number;
  value: string;
  onChange: (value: string) => void;
}

// A reusable component for entering a one-time password (OTP).
// @param length The number of digits in the OTP.
// @param value The current value of the OTP.
// @param onChange A function to call when the OTP value changes.
const OTPInput: React.FC<Props> = ({ length, value, onChange }) => {
  const [otp, setOtp] = useState<string[]>(() =>
    value ? value.slice(0, length).split("").concat(new Array(Math.max(0, length - value.length)).fill("")) : new Array(length).fill("")
  );
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Sync internal state when parent resets value (e.g. after form submit)
  useEffect(() => {
    const newOtp = value
      ? value.slice(0, length).split("").concat(new Array(Math.max(0, length - value.length)).fill(""))
      : new Array(length).fill("");
    setOtp(newOtp);
  }, [value, length]);

  const handleChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);
    onChange(newOtp.join(""));

    // Focus next input
    if (element.nextSibling && element.value) {
      (element.nextSibling as HTMLInputElement).focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (
      e.key === "Backspace" &&
      !otp[index] &&
      index > 0 &&
      inputRefs.current[index - 1]
    ) {
      // Focus previous input on backspace
      (inputRefs.current[index - 1] as HTMLInputElement).focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData("text/plain")
      .slice(0, length)
      .split("");
    if (pastedData.some((char) => isNaN(Number(char)))) return;

    const newOtp = [...otp];
    pastedData.forEach((char, index) => {
      newOtp[index] = char;
    });
    setOtp(newOtp);
    onChange(newOtp.join(""));
  };

  return (
    <div>
      {otp.map((data, index) => {
        return (
          <input
            key={index}
            type="text"
            maxLength={1}
            value={data}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              handleChange(e.target, index)
            }
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) =>
              handleKeyDown(e, index)
            }
            onFocus={(e) => e.target.select()}
            onPaste={handlePaste}
            ref={(el) => (inputRefs.current[index] = el)}
            style={{
              width: "40px",
              height: "40px",
              margin: "5px",
              textAlign: "center",
              fontSize: "1.5rem",
            }}
          />
        );
      })}
    </div>
  );
};

export default OTPInput;