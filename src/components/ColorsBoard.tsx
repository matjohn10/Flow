import { isMobile } from "react-device-detect";
import { COLORS } from "../constants";

interface props {
  currColor: string;
  setColor: React.Dispatch<React.SetStateAction<string>>;
}

function ColorsBoard({ currColor, setColor }: props) {
  return (
    <div className="flex flex-wrap justify-center w-full md:w-1/6 xl:w-[12%] h-auto bg-blue-100 rounded-lg p-2 gap-2">
      {COLORS.map((c) => (
        <div
          key={c}
          onClick={() => setColor(c)}
          style={{
            backgroundColor: c,
            border:
              c === currColor
                ? `${isMobile ? 2 : 4}px solid ${c}`
                : `${isMobile ? 2 : 4}px solid black`,
          }}
          className="w-[5%] md:w-1/4 aspect-square rounded"
        />
      ))}
      <div
        style={{ backgroundColor: currColor, borderWidth: isMobile ? 2 : 4 }}
        className="w-[10%] md:w-full aspect-[2/1] border-4 border-black rounded"
      />
    </div>
  );
}

export default ColorsBoard;
