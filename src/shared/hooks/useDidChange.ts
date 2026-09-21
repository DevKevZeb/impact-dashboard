import { useState } from "react";

/**
 * Returns `true` on exactly the render where `value` differs from the value
 * seen on the previous render, then `false` again until it changes once more.
 *
 * This is React's own recommended "adjusting state when a prop changes"
 * pattern (https://react.dev/learn/you-might-not-need-an-effect) - tracking
 * the previous value via `useState` and comparing during render, rather than
 * via `useRef` (which the `react-hooks/refs` lint rule forbids reading
 * synchronously during render) or a `useEffect` that fires after commit
 * (which `react-hooks/set-state-in-effect` discourages for pure state
 * derivations). Same timing as the old ref+effect pattern: both resolve
 * before the next paint.
 */
export function useDidChange<T>(value: T): boolean {
  const [prev, setPrev] = useState(value);
  const changed = !Object.is(prev, value);
  if (changed) setPrev(value);
  return changed;
}

/** Runs `onChange(value)` synchronously during render whenever `value` changes, instead of in a `useEffect`. See `useDidChange` for why. */
export function useSyncOnChange<T>(value: T, onChange: (value: T) => void): void {
  if (useDidChange(value)) onChange(value);
}
