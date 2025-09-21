import { useNavigate, useParams } from "react-router";
import Button from "../components/Button";
import { useQuery } from "@tanstack/react-query";
import { getLobby } from "../services/tanstack/queries";
import MultiplayerGame from "../components/MultiplayerGame";

function Lobby() {
  const navigate = useNavigate();
  const { id } = useParams();

  const { isPending, isError, data, error } = useQuery({
    queryKey: ["lobby", id],
    queryFn: () => getLobby(Number(id) ?? 0),
  });

  const leaveLobby = () => {
    navigate("/lobbies");
  };

  if (isPending) {
    return <span>Loading Lobby Info...</span>;
  }

  if (isError) {
    return (
      <div className="mt-96 m-auto p-6 w-max">
        <p>{error.message}</p>
        <Button cb={leaveLobby}>Return to Lobbies</Button>
      </div>
    );
  }
  return <MultiplayerGame lobby={data} />;
}

export default Lobby;
