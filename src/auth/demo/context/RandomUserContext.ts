import { createContext } from "react";
import { type User } from "../../../services/tanstack/queries";

export const RandomUserContext = createContext<User>({
  id: "12345-abcd",
  username: "Demo-user",
  ready: false,
});
