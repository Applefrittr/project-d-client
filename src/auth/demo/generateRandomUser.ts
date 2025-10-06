import random from "./random_words.json";
import { v4 as uuidv4 } from "uuid";
import { type User } from "../../services/tanstack/queries";

export default function generateRandomUser(): User {
  return { id: uuidv4(), username: genUsername(), ready: false };
}

function genUsername() {
  const nounLen = random.nouns.length;
  const adjLen = random.adjectives.length;
  return `${random.adjectives[Math.floor(Math.random() * adjLen)]}_${
    random.nouns[Math.floor(Math.random() * nounLen)]
  }`;
}
