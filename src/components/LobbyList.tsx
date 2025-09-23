import { useQuery } from "@tanstack/react-query";
import { getLobbyList, type Lobby } from "../services/tanstack/queries";

function LobbyList() {
  const { isPending, isError, data, error } = useQuery({
    queryKey: ["lobbies"],
    queryFn: getLobbyList,
  });

  if (isPending) {
    return <span>Loading...</span>;
  }

  if (isError) {
    return <span>Error: {error.message}</span>;
  }

  return (
    <ul>
      {data.map((lobby: Lobby) => (
        <li key={lobby.gameID}>{lobby.name}</li>
      ))}
    </ul>
  );
}

export default LobbyList;
