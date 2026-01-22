import React from "react";
import { calculateBytesToSize } from "./bytesToSize";

interface Props {
  value: number;
  className?: string;
}

// A React component that displays a file size in a human-readable format.
// It uses the `calculateBytesToSize` utility function for formatting.
//
// @param value The number of bytes to display.
// @param className Optional CSS class names for the span element.
export const BytesToSize: React.FC<Props> = ({ value, className }) => {
  return <span className={className}>{calculateBytesToSize(value)}</span>;
};