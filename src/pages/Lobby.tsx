import { useNavigate, useParams } from "react-router";
import Button from "../components/Button";
import { useQuery } from "@tanstack/react-query";
import { getLobby } from "../services/tanstack/queries";
import MultiplayerGame from "../components/MultiplayerGame";
import MsgModal from "../components/MsgModal";

function Lobby() {
  const navigate = useNavigate();
  const { id } = useParams();

  const { isPending, isError, data, error } = useQuery({
    queryKey: ["lobby", id],
    queryFn: () => getLobby(Number(id) ?? 0),
    refetchOnWindowFocus: false,
  });

  const leaveLobby = () => {
    navigate("/lobbies");
  };

  if (isPending) {
    return <MsgModal>Loading Lobby info...</MsgModal>;
  }

  if (isError) {
    return (
      <MsgModal className={"bg-red-200"}>
        <h1 className="text-2xl font-medium mr-auto">Error!</h1>
        <p>{error.message}</p>
        <Button cb={leaveLobby}>Return to Lobbies</Button>
      </MsgModal>
    );
  }
  return <MultiplayerGame lobby={data} />;
}

export default Lobby;
