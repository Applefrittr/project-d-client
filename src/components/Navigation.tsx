import { useContext } from "react";
import { RandomUserContext } from "../auth/demo/context/RandomUserContext";
import { Link } from "react-router";

function Navigtation() {
  const user = useContext(RandomUserContext);
  return (
    <nav className="flex justify-between p-8 bg-main-theme fixed top-0 w-full">
      <h1>Project D</h1>
      <div className="flex gap-4">
        <p>{user}</p>
        <ul className="flex gap-2">
          <li>
            <Link
              to="/"
              className="px-8 py-2 bg-blue-800 text-white rounded-lg"
            >
              Home
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navigtation;
