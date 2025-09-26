import { useQuery } from "@tanstack/react-query";
import { getLobbyList, type Lobby } from "../services/tanstack/queries";
import MsgModal from "./MsgModal";

type LobbyListProps = {
  handleSelect: (event: React.MouseEvent<HTMLLIElement, MouseEvent>) => void;
  selectedLobby: number | undefined;
};

function LobbyList({ handleSelect, selectedLobby }: LobbyListProps) {
  const { isFetching, isError, data, error } = useQuery({
    queryKey: ["lobbies"],
    queryFn: getLobbyList,
  });

  if (isFetching) {
    return <span>Loading...</span>;
  }

  if (isError) {
    return (
      <MsgModal className={"bg-red-200"}>
        <h1 className="text-2xl font-medium mr-auto">Error</h1>
        <p>{error.message}</p>
      </MsgModal>
    );
  }

  return (
    <ul className="h-full w-full p-3">
      {data.length === 0 && (
        <p>
          <i>No Active lobbies</i>
        </p>
      )}
      {data.map((lobby: Lobby) => (
        <li
          key={lobby.gameID}
          data-gameid={lobby.gameID}
          onClick={(event) => handleSelect(event)}
          className={`p-3 w-full ${
            lobby.gameID === selectedLobby ? "bg-green-500" : "bg-inherit"
          } hover:cursor-pointer`}
        >
          <p className="text-2xl font-medium">{lobby.name}</p>
        </li>
      ))}
    </ul>
  );
}

export default LobbyList;
