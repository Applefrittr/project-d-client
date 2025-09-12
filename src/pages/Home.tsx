import { Link } from "react-router";

export default function Home() {
  return (
    <main className="h-dvh w-full flex justify-center items-center">
      <header className="m-auto p-8">
        <h1 className="text-4xl font-bold m-3">Project D</h1>
        <div className="flex gap-6">
          <Link
            to="/singleplayer"
            className="p-2 bg-blue-300 rounded-xs m-auto"
          >
            Singleplayer
          </Link>
          <Link to="/multiplayer" className="p-2 bg-blue-300 rounded-xs m-auto">
            Multiplayer
          </Link>
        </div>
      </header>
    </main>
  );
}
