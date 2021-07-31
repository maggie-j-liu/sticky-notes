const StickyNoteGrid = ({ notes = [] }) => {
  console.log("notes", notes);
  const sorted = [...notes].sort((a, b) => b.timestamp - a.timestamp);
  return (
    <div className={"grid grid-cols-4 gap-4 px-12 bg-primary-200 pt-20 pb-16"}>
      {sorted.map((note, idx) => (
        <div className={"bg-gray-300"} key={idx}>
          {note.message}
        </div>
      ))}
    </div>
  );
};

export default StickyNoteGrid;
