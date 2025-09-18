import random from "./random_words.json";

export default function generateRandomUser() {
  const nounLen = random.nouns.length;
  const adjLen = random.adjectives.length;
  return `${random.adjectives[Math.floor(Math.random() * adjLen)]}_${
    random.nouns[Math.floor(Math.random() * nounLen)]
  }`;
}
