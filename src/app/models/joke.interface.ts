export interface JokeInterface {
  jokes: Joke[];
  available: number;
}

export interface Joke {
  id: number;
  joke: string;
}
