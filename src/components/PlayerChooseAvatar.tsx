interface props {
  name: string;
  icon: string;
  color: string;
  setIcon: (value: React.SetStateAction<string>) => void;
}
function PlayerChooseAvatar({ name, color, icon, setIcon }: props) {
  return (
    <div
      onClick={() => setIcon(name)}
      style={{ backgroundColor: icon === name ? color : "#242424" }}
      className="flex w-1/3 aspect-square justify-center items-center rounded-lg hover:opacity-75 hover:cursor-pointer active:opacity-20"
    >
      <img src={`/avatars/${name}.png`} className="w-full h-full" />
    </div>
  );
}

export default PlayerChooseAvatar;
