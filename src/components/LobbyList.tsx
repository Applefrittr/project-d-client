import { useQuery } from "@tanstack/react-query";
import { getLobbyList, type Lobby } from "../services/tanstack/queries";
import { useState } from "react";

type LobbyListProps = {
  handleSelect: (event: React.MouseEvent<HTMLLIElement, MouseEvent>) => void;
  selectedLobby: number | undefined;
};

function LobbyList({ handleSelect, selectedLobby }: LobbyListProps) {
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
