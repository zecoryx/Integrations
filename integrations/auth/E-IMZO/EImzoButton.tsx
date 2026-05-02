import { useState } from "react";
import { signWithEImzo, EImzoSignResult } from "./eimzo.service";

interface EImzoButtonProps {
  challengeText: string;
  onSuccess: (result: EImzoSignResult) => void;
  onError?: (error: string) => void;
  label?: string;
}

const EImzoButton = ({
  challengeText,
  onSuccess,
  onError,
  label = "E-IMZO bilan kirish",
}: EImzoButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    try {
      const result = await signWithEImzo(challengeText);
      onSuccess(result);
    } catch (err) {
      const message = err instanceof Error ? err.message : "E-IMZO xatosi";
      onError?.(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button onClick={handleClick} disabled={isLoading}>
      {isLoading ? "Imzolanyapti..." : label}
    </button>
  );
};

export default EImzoButton;
