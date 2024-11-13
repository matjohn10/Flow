interface props {
  func: () => void;
  text: string;
  className: string;
}

function DevButton({ func, text, className }: props) {
  return (
    <button className={className} onClick={() => func()}>
      DEV: {text}
    </button>
  );
}

export default DevButton;
