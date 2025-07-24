export interface RaffleAnswer {
  address: string;
  answer: string;
  score: string;
}

export interface Raffle {
  answers: Map<string, RaffleAnswer>;
  evaluation_criteria: string;
  constraints: string;
  title: string;
  description: string;
  winner: string;
}

// Alternative interface using Record instead of Map for better JSON serialization
export interface RaffleWithRecord {
  answers: Record<string, RaffleAnswer>;
  evaluation_criteria: string;
  constraints: string;
  title: string;
  description: string;
  winner: string;
}
