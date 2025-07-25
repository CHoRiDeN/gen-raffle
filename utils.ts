import { Raffle, RaffleAnswer } from "./types";

export function convertMapToRaffle(mapData: any): Raffle {
    const answers = new Map<string, RaffleAnswer>();
    if (mapData.get('answers')) {
      const answersMap = mapData.get('answers');
      answersMap.forEach((value: any, key: string) => {
        answers.set(key, {
          address: value.get('address'),
          answer: value.get('answer'),
          score: value.get('score')
        });
      });
    }
    
    return {
      answers,
      evaluation_criteria: mapData.get('evaluation_criteria') || '',
      constraints: mapData.get('constraints') || '',
      title: mapData.get('title') || '',
      description: mapData.get('description') || '',
      winner: mapData.get('winner') || '',
      raffle_status: mapData.get('raffle_status') || ''
    };
  }