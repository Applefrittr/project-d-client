import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type Lobby, createLobby } from "../services/tanstack/queries";
import { useContext } from "react";
import { useNavigate } from "react-router";
import { RandomUserContext } from "../auth/demo/context/RandomUserContext";
import Button from "./Button";

function CreateLobbyForm({
  setDisplayForm,
}: {
  setDisplayForm: (bool: boolean) => void;
}) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const user = useContext(RandomUserContext);

  const mutation = useMutation({
    mutationFn: (lobby: Lobby) => createLobby(lobby),
    onSuccess: async (data: Lobby) => {
      await queryClient.invalidateQueries({ queryKey: ["lobbies"] });
      console.log("mutate onSuccess: ", data);

      navigate(`/lobbies/${data.gameID}`);
    },
    onError: (error: Error) => {
      console.log(error);
    },
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const dataObj = Object.fromEntries(formData.entries());

    const newLobby: Lobby = {
      gameID: Math.floor(Math.random() * 1000000),
      name: dataObj.name as string,
      playerCount: 0,
      sockets: [],
      players: [user],
    };

    mutation.mutate(newLobby);
  };
  return (
    <>
      <form onSubmit={handleSubmit}>
        <label htmlFor="lobby-name">Name</label>
        <input id="lobby-name" name="name" placeholder="Lobby Name"></input>
        <div className="flex gap-6">
          <Button type={"submit"}>Create</Button>
          <Button cb={() => setDisplayForm(false)} type={"button"}>
            Cancel
          </Button>
        </div>
      </form>
    </>
  );
}

export default CreateLobbyForm;
