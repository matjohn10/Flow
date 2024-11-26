import { Link } from "react-router-dom";
import { APP_NAME } from "./constants";
import { isMobile } from "react-device-detect";
import { Copyright, FileText, ShieldCheck } from "lucide-react";

function App() {
  return (
    <div className="relative w-full h-full flex flex-col p-24 gap-4 overflow-hidden">
      <h1 className="font-extrabold text-7xl md:text-9xl">{APP_NAME}</h1>

      <p className="font-semibold text-2xl sm:text-4xl ml-4 md:ml-12">
        Draw. Guess. Pass. Laugh.
      </p>
      <p className="font-semibold text-sm sm:text-lg ml-4 md:ml-12">
        Unleash your creativity and connect with friends in a fun, fast-paced
        game of drawing and guessing!
      </p>
      <div className="flex w-full h-full justify-center items-center">
        <button>
          <Link
            className="bg-gray-200 border-2 rounded text-black px-4 md:px-8 py-2 md:py-3 text-2xl font-semibold shadow shadow-gray-800"
            to="/game"
          >
            Start Game
          </Link>
        </button>
      </div>
      {isMobile ? (
        <div className="absolute -z-40 flex top-0 left-0 w-full h-full">
          <img className="w-full object-cover" src="/bg-home.svg" alt="svg" />
        </div>
      ) : (
        <div
          style={{ width: window.innerWidth, height: window.innerHeight }}
          className="absolute -right-[250px] -z-40 flex justify-center items-center"
        >
          <img className="w-full" src="/bg-home.svg" alt="svg" />
        </div>
      )}

      <div className="absolute bottom-0 left-0 flex w-full justify-center gap-4 sm:gap-10 md:gap-14 lg:gap-30 p-4">
        <a
          className="hidden sm:block underline"
          target="_blank"
          href="https://www.freeprivacypolicy.com/live/54d9c160-b289-4de7-b51a-4d96c0e8d63e"
        >
          Terms & Conditions
        </a>
        <a
          className="sm:hidden underline"
          target="_blank"
          href="https://www.freeprivacypolicy.com/live/54d9c160-b289-4de7-b51a-4d96c0e8d63e"
        >
          <FileText className="text-gray-90" size={20} />
        </a>
        <a
          className="hidden sm:block underline"
          href="https://www.freeprivacypolicy.com/live/2fd41011-84f8-48d9-8045-d0c14dfc3c88"
          target="_blank"
        >
          Privacy policy
        </a>
        <a
          className="sm:hidden underline"
          target="_blank"
          href="https://www.freeprivacypolicy.com/live/2fd41011-84f8-48d9-8045-d0c14dfc3c88"
        >
          <ShieldCheck className="text-gray-90" size={20} />
        </a>
        <a
          className="hidden sm:block underline"
          href="https://github.com/matjohn10"
          target="_blank"
        >
          &copy; Mathieu Johnson
        </a>
        <a
          className="sm:hidden underline"
          target="_blank"
          href="https://github.com/matjohn10"
        >
          <Copyright className="text-gray-90" size={20} />
        </a>
      </div>
    </div>
  );
}

export default App;
