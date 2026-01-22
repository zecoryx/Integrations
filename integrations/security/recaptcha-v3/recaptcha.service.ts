import axios from "axios";
import { env } from "../../../core/env/index";

// This service provides methods for validating reCAPTCHA tokens.

// This service should ideally be a backend service that receives a reCAPTCHA token
// from the frontend and then verifies it with Google. For the purpose of this exercise,
// it is kept here, but in a real application, ensure this logic runs server-side.
export class RecaptchaService {
  // The reCAPTCHA secret key, used for server-side verification.
  // This value should be kept secure and never exposed publicly.
  private SECRET_KEY = env.RECAPTCHA_SECRET_KEY; // Assuming this is present in .env

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