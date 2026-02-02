// useClickOutside.ts
import { useEffect } from "react";

export function useClickOutside(
  ref: React.RefObject<HTMLElement | null>,
  handler: () => void,
  ignoreRef?: React.RefObject<HTMLElement | null>
) {
  useEffect(() => {
    function listener(event: MouseEvent) {
      const target = event.target as Node;

      if (!ref.current) return;

      if (ref.current.contains(target)) return;
      if (ignoreRef?.current?.contains(target)) return;

      handler();
    }

    document.addEventListener("mousedown", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
    };
  }, [ref, handler, ignoreRef]);
}
