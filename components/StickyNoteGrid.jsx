const StickyNoteGrid = ({ notes = [] }) => {
  console.log("notes", notes);
  const reversed = [...notes].reverse();
  return (
    <div className={"grid grid-cols-4"}>
      {reversed.map((note, idx) => (
        <div className={"bg-gray-300"} key={idx}>
          {note.message}
        </div>
      ))}
    </div>
  );
};

export default StickyNoteGrid;
