const StickyNote = ({ text }) => {
  const colors = [
    "bg-primary-100",
    "bg-primary-200",
    "bg-primary-300",
    "bg-primary-400",
  ];
  return (
    <div
      className={`${
        colors[Math.floor(Math.random() * colors.length)]
      } rounded-lg py-4 px-6 shadow-xl whitespace-pre-wrap`}
    >
      {text}
    </div>
  );
};

export default StickyNote;
