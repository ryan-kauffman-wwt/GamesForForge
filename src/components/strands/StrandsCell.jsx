import { clsx } from "clsx";

/**
 * A single letter cell in the Strands grid.
 *
 * Props
 *  letter      – the uppercase letter to display
 *  state       – "idle" | "selected" | "found" | "spangram"
 *  isInPath    – true while the user is dragging through this cell
 *  onClick     – called when the cell is tapped/clicked
 *  onMouseEnter – called when the pointer enters during a drag
 */
export default function StrandsCell({
  letter,
  state = "idle",
  isInPath = false,
  onClick,
  onMouseEnter,
}) {
  const isFound     = state === "found";
  const isSpangram  = state === "spangram";
  const isSelected  = state === "selected" || isInPath;

  return (
    <button
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      disabled={isFound || isSpangram}
      aria-label={letter}
      className={clsx(
        "strands-cell",
        "relative flex items-center justify-center",
        "rounded-full font-bold uppercase select-none",
        "transition-all duration-150",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400",
        {
          // Spangram — gold/teal gradient
          "strands-cell--spangram": isSpangram,
          // Found theme word — soft blue
          "strands-cell--found": isFound && !isSpangram,
          // Currently selected / in drag path
          "strands-cell--selected": isSelected && !isFound && !isSpangram,
          // Default idle
          "strands-cell--idle": !isSelected && !isFound && !isSpangram,
        }
      )}
    >
      {letter}
    </button>
  );
}
