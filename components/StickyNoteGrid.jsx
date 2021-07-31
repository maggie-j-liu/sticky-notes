import StickyNote from "./StickyNote";
const StickyNoteGrid = ({ notes = [] }) => {
  const sorted = [...notes].sort((a, b) => b.timestamp - a.timestamp);
  return (
    <div
      className={
        "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 px-12 bg-white pt-20 pb-16"
      }
    >
      {sorted.map((note, idx) => (
        <StickyNote key={idx} text={note.message} />
      ))}
    </div>
  );
};

export default StickyNoteGrid;
