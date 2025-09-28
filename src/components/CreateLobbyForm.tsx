import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type Lobby, createLobby } from "../services/tanstack/queries";
import { useContext } from "react";
import { useNavigate } from "react-router";
import { RandomUserContext } from "../auth/demo/context/RandomUserContext";
import Button from "./Button";
import MsgModal from "./MsgModal";

function CreateLobbyForm({
  setDisplayForm,
}: {
  setDisplayForm: (bool: boolean) => void;
}) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const user = useContext(RandomUserContext);

  const { mutate, isError, isIdle, isPending, error } = useMutation({
    mutationFn: (lobby: Lobby) => createLobby(lobby),
    onSuccess: async (data: Lobby) => {
      await queryClient.invalidateQueries({ queryKey: ["lobbies"] });
      console.log("mutate onSuccess: ", data);

      navigate(`/lobbies/${data.gameID}`);
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
      players: [],
      host: user,
      gameRunning: false,
    };

    mutate(newLobby);
  };
  return (
    <section className="absolute top-0 left-0 h-dvh w-full flex justify-center items-center backdrop-blur-xs">
      {isIdle && (
        <form
          onSubmit={handleSubmit}
          className="p-6 rounded-md bg-main-theme border border-black flex flex-col gap-3"
        >
          <h2 className="text-2xl font-medium">Create New Lobby</h2>
          <label htmlFor="lobby-name">Name</label>
          <input
            id="lobby-name"
            name="name"
            placeholder="Lobby Name"
            className="focus:bg-white"
          ></input>
          <div className="flex gap-6">
            <Button type={"submit"}>Create</Button>
            <Button cb={() => setDisplayForm(false)} type={"button"}>
              Cancel
            </Button>
          </div>
        </form>
      )}
      {isPending && (
        <div className="p-6 rounded-md bg-main-theme border border-black">
          <h2>Creating Lobby...</h2>
        </div>
      )}
      {isError && (
        <MsgModal className={"bg-error"}>
          <h2 className="text-2xl font-medium mr-auto">Error</h2>
          <p>{error.message}</p>
          <Button cb={() => setDisplayForm(false)} type={"button"}>
            Close
          </Button>
        </MsgModal>
      )}
    </section>
  );
}

export default CreateLobbyForm;
