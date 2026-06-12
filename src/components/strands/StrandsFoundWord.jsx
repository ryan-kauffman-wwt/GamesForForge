/**
 * Displays a single found word (theme word or spangram) in the sidebar / list.
 */
export default function StrandsFoundWord({ word, isSpangram }) {
  return (
    <div
      className="strands-found-word bounce-in flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold"
      style={
        isSpangram
          ? {
              background: "linear-gradient(135deg, #fbbf24 0%, #34d399 100%)",
              color: "#1c1c1e",
              boxShadow: "0 2px 10px rgba(251,191,36,0.35)",
            }
          : {
              background: "#dbeafe",
              color: "#1e3a8a",
              boxShadow: "0 1px 4px rgba(59,130,246,0.15)",
            }
      }
    >
      {isSpangram && <span style={{ fontSize: "0.85rem" }}>✦</span>}
      {word}
    </div>
  );
}
