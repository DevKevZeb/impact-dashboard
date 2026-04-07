/**
 * Google reCAPTCHA v2 Type Declarations
 * Provides TypeScript definitions for the grecaptcha global object
 */

interface ReCaptchaV2 {
  /**
   * Runs the callback when reCAPTCHA is fully initialized.
   */
  ready(callback: () => void): void;

  /**
   * Renders an explicit reCAPTCHA widget
   * @param containerId ID of the div where the widget will be rendered
   * @param options Configuration options
   * @returns Widget ID for this reCAPTCHA instance
   */
  render(
    containerId: string,
    options?: {
      sitekey?: string;
      theme?: "light" | "dark";
      type?: "image" | "audio";
      tabindex?: number;
      callback?: (token: string) => void;
      expired_callback?: () => void;
      error_callback?: () => void;
    }
  ): number;

  /**
   * Gets the response from the reCAPTCHA widget
   * @param widgetId Optional widget ID for explicit rendering
   * @returns Response token string, or empty string if not completed
   */
  getResponse(widgetId?: number): string;

  /**
   * Resets the reCAPTCHA widget
   * @param widgetId Optional widget ID for explicit rendering
   */
  reset(widgetId?: number): void;

  /**
   * Removes the reCAPTCHA widget
   * @param widgetId Optional widget ID for explicit rendering
   */
  remove(widgetId?: number): void;
}

declare global {
  interface Window {
    grecaptcha: ReCaptchaV2;
  }
}

export {};
