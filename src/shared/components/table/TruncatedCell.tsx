import { useState, useRef, useCallback } from "react";

interface TruncatedCellProps {
  text: string;
  maxWidth?: string;
}

export function TruncatedCell({ text, maxWidth = "max-w-[160px]" }: TruncatedCellProps) {
  const [pos, setPos] = useState<{ x: number; y: number; below: boolean } | null>(null);
  const ref = useRef<HTMLSpanElement>(null);

  const show = useCallback(() => {
    if (!ref.current) return;
    // Only show tooltip if the text is actually truncated
    if (ref.current.scrollWidth <= ref.current.clientWidth) return;
    const r = ref.current.getBoundingClientRect();
    const below = window.innerHeight - r.bottom > 80;
    const x = Math.max(8, Math.min(r.left, window.innerWidth - 248));
    const y = below ? r.bottom + 6 : r.top - 6;
    setPos({ x, y, below });
  }, []);

  const hide = useCallback(() => setPos(null), []);

  return (
    <>
      <span
        ref={ref}
        className={`block truncate ${maxWidth} cursor-default`}
        onMouseEnter={show}
        onMouseLeave={hide}
      >
        {text}
      </span>
      {pos && (
        <div
          className="fixed z-9999 max-w-60 wrap-break-word rounded-lg bg-gray-900 px-3 py-2 text-xs text-white shadow-xl pointer-events-none"
          style={{
            left: pos.x,
            top: pos.y,
            transform: pos.below ? undefined : "translateY(-100%)",
          }}
        >
          {text}
        </div>
      )}
    </>
  );
}
