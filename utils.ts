import { Raffle, RaffleAnswer } from "./types";
import moment from "moment";
import DOMPurify from 'dompurify';

export function formatDate(date: string): string {
  const parsedDate = moment(date, 'YYYY-MM-DD HH:mm:ss').utc();
  const now = moment();
  const diffInMinutes = now.diff(parsedDate, 'minutes');
  const yesterday = now.subtract(1, 'day');

  if (diffInMinutes < 60) {
    return 'few mins ago';
  }
  if (diffInMinutes/60 < 24) {
    return `${Math.floor(diffInMinutes/60)} hours ago`;
  } else if (yesterday.isSame(parsedDate, 'day')) {
    return 'yesterday';
  }
  return moment(date).format('DD MMM YY');
}


export function limitText(text: string, limit: number): string {
  if (text.length <= limit) {
    return text;
  }
  return text.slice(0, limit) + '...';
}

export function handleNewlines(text: string) {
  return text.replace(/\n/g, '<br />');
}
export function renderHTML(html: any) {
  return { __html: DOMPurify.sanitize(html) };
};

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