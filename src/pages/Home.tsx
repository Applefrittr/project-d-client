import { Link } from "react-router";

function Home() {
  return (
    <main className="h-dvh w-full flex justify-center items-center">
      <header className="m-auto p-8">
        <h1 className="text-4xl font-bold m-3">Project D</h1>
        <div className="flex gap-6">
          <Link
            to="/singleplayer"
            className="px-8 py-2 bg-blue-800 text-white rounded-lg"
          >
            Singleplayer
          </Link>
          <Link
            to="/lobbies"
            className="px-8 py-2 bg-blue-800 text-white rounded-lg"
          >
            Multiplayer
          </Link>
        </div>
      </header>
    </main>
  );
}
export default Home;
