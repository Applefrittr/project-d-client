import { useState, useRef, useEffect, useMemo, useContext } from "react";
import Canvas from "./Canvas";
import Game, { type GameState } from "../engine/MultiplayerEngine";
import settings from "../engine/settings.json";
import MouseScrollOverlay from "./MouseScrollOverlay";
import socket from "../services/socket.io/socketInstance";
import { useNavigate } from "react-router";
import Button from "./Button";
import type { Lobby } from "../services/tanstack/queries";
import { RandomUserContext } from "../auth/demo/context/RandomUserContext";
import MsgModal from "./MsgModal";

type MultiplayerGameState = {
  lobby: Lobby | null;
  lobbyRdy: boolean;
  gameRunning: boolean;
};

function MultiplayerGame({ lobby }: { lobby: Lobby }) {
  const [state, setState] = useState<MultiplayerGameState>({
    lobby,
    lobbyRdy: false,
    gameRunning: false,
  });
  const user = useContext(RandomUserContext);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const navigate = useNavigate();

  const game = useMemo(
    () => new Game(settings["arena-width"], settings["arena-height"]),
    []
  );

  const sendReadySignal = () => {
    socket.emit("lby_ready", lobby.gameID, user);
  };

  const sendStartSignal = () => {
    console.log("Sending sever start message");
    socket.emit("sv_start", lobby.gameID);
    // setState({ ...state, gameRunning: true });
  };

  const leaveLobby = () => {
    navigate("/lobbies");
  };

  useEffect(() => {
    // Initialize socket connection
    // Add room connection -> room's based on lobby generated ID
    socket.connect();
    socket.emit("lby_join", lobby.gameID, user);

    socket.on("update_game", (state: GameState) => {
      game.appendBufferQueue(state);
    });

    socket.on("lby_update", (lobbyData: Lobby | null) => {
      let rdyCount =
        lobbyData?.players.reduce(
          (acc, player) => acc + Number(player.ready),
          0
        ) ?? 0;

      rdyCount === 2
        ? setState((prev) => {
            return { ...prev, lobbyRdy: true, lobby: lobbyData };
          })
        : setState((prev) => {
            return { ...prev, lobby: lobbyData };
          });
    });

    socket.on("cl_start", () => {
      console.log("recieved server start msg");
      game.loop(performance.now());
      setState((prev) => {
        return { ...prev, gameRunning: true };
      });
    });

    socket.on("connect_error", (error) => {
      console.log(error.message);
    });

    socket.on("sv_error", (msg) => {
      console.log(msg);
    });

    return () => {
      game.close();
      socket.off("update_game");
      socket.off("cl_start");
      socket.off("lby_update");
      socket.off("connect_error");
      socket.off("sv_error");
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    console.log("gameRunning update!", state.gameRunning);
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      game.setCanvasContext(ctx);
    }
  }, [state.gameRunning]);

  if (!state.lobby) {
    return (
      <MsgModal className={"bg-error"}>
        <h1 className="text-2xl font-medium mr-auto">Error!</h1>
        <p>Lobby closed! Host has left the game.</p>
        <Button cb={leaveLobby}>Return to Lobbies</Button>
      </MsgModal>
    );
  }

  if (!state.gameRunning) {
    return (
      <section className="p-9 bg-amber-300 rounded-md border border-black w-[600px] h-96 max-w-4/5 flex flex-col">
        <h1 className="text-4xl font-bold">{state.lobby?.name}</h1>
        <div className="flex-auto">
          Players
          <ul>
            {state.lobby?.players.map((player) => {
              return (
                <li key={player.username} className="p-3 w-full flex gap-3">
                  {player.username === state.lobby?.host
                    ? `${player.username} (host)`
                    : player.username}
                  {player.ready && (
                    <span className="font-bold text-green-400">READY</span>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
        <div className="flex justify-between w-full items-center">
          <div className="flex gap-4 flex-wrap">
            <Button cb={sendReadySignal}>Ready</Button>
            <Button cb={leaveLobby}>Leave</Button>
          </div>
          {state.lobby.host === user.id && state.lobbyRdy && (
            <Button cb={sendStartSignal}>Start</Button>
          )}
          {state.lobby.host === user.id && !state.lobbyRdy && (
            <Button disabled={true}>Start</Button>
          )}
        </div>
      </section>
    );
  }

  return (
    <>
      <MouseScrollOverlay />
      <Canvas canvasRef={canvasRef} />
    </>
  );
}

export default MultiplayerGame;
