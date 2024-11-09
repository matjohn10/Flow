import { Player } from "../queries/games";

interface props {
  player: Player;
}

function PlayerCard({ player }: props) {
  return (
    <div
      style={{ backgroundColor: player.color }}
      className="flex flex-col items-center justify-center w-24 h-24 rounded-md gap-1 p-2"
    >
      <img
        src={`/avatars/${player.icon}.png`}
        alt={player.icon}
        className="w-12 h-12"
      />

      <h2 className="text-md font-semibold">{player.username}</h2>
    </div>
  );
}

export default PlayerCard;
