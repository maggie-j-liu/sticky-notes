const StickyNote = ({ text, className }) => {
  const colors = [
    "bg-primary-100",
    "bg-primary-200",
    "bg-primary-300",
    "bg-primary-400",
  ];
  return (
    <div
      className={`rounded-lg py-4 px-6 shadow-xl whitespace-pre-wrap ${className}`}
    >
      {text}
    </div>
  );
};

export default StickyNote;
