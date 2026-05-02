import axios from "axios";
import { serverEnv } from "../../env";

// This service provides methods for validating reCAPTCHA tokens.
export class RecaptchaService {
  // The reCAPTCHA secret key, used for server-side verification.
  // This value should be kept secure and never exposed publicly.
  private SECRET_KEY = serverEnv.RECAPTCHA_SECRET_KEY;

  // Validates a reCAPTCHA token with Google.

  // @param token The reCAPTCHA token received from the frontend.
  // @returns A promise that resolves to true if the token is valid and the score is acceptable, false otherwise.
  async validate(token: string): Promise<boolean> {
    try {
      const url = `https://www.google.com/recaptcha/api/siteverify`;

      const response = await axios.post(url, null, {
        params: {
          secret: this.SECRET_KEY,
          response: token,
        },
      });

      const { success, score } = response.data;

      // The score ranges from 0.0 (likely a robot) to 1.0 (likely a human).
      // A common threshold is 0.5. Adjust this based on your application's sensitivity.
      if (success && score >= 0.5) {
        return true; // Human detected
      }

      console.warn(`reCAPTCHA: Robot detected or low score. Score: ${score}`);
      return false; // Robot or suspicious activity
    } catch (error) {
      console.error("Recaptcha validation error:", error);
      return false;
    }
  }
}