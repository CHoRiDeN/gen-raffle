import { Raffle, RaffleAnswer } from "./types";
import moment from "moment";

export function formatDate(date: string): string {
  const now = moment();
  const inputDate = moment(date);
  const diffInHours = now.diff(inputDate, 'hours');

  if (diffInHours < 1) {
    return 'just now';
  }
  if (diffInHours < 24) {
    return `${diffInHours} hours ago`;
  } else if (now.isSame(inputDate, 'day')) {
    return 'yesterday';
  }
  return moment(date).format('DD MMM YY');
}

export function convertMapToRaffle(mapData: any): Raffle {
  const answers = new Map<string, RaffleAnswer>();
  if (mapData.get('answers')) {
    const answersMap = mapData.get('answers');
    answersMap.forEach((value: any, key: string) => {
      answers.set(key, {
        address: key,
        answer: value.get('answer'),
        score: value.get('score'),
        clerk_id: value.get('clerk_id'),
        name: value.get('name'),
        created_at: value.get('created_at')
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