import { Player } from "../queries/games";
import { textColorFromBGHex } from "../utils/helpers";

interface props {
  player: Player;
}

function PlayerCard({ player }: props) {
  return (
    <div
      style={{ backgroundColor: player.color }}
      className="flex flex-row sm:flex-col items-center justify-center w-1/2 sm:w-24 sm:h-24 rounded-md gap-1 p-2"
    >
      <img
        src={`/avatars/${player.icon}.png`}
        alt={player.icon}
        className="w-8 h-8 sm:w-12 sm:h-12"
      />

      <h2
        style={{ color: textColorFromBGHex(player.color) }}
        className="text-sm sm:text-md font-semibold"
      >
        {player.username}
      </h2>
    </div>
  );
}

export default PlayerCard;
