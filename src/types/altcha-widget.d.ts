import "react";

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "altcha-widget": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        auto?: "off" | "onfocus" | "onload" | "onsubmit";
        challengeurl?: string;
        credentials?: "omit" | "same-origin" | "include";
        hidefooter?: boolean | "true" | "false";
        hidelogo?: boolean | "true" | "false";
        language?: string;
        name?: string;
      };
    }
  }
}
