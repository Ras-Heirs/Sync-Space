export interface User {
  id: number;
  username: string;
  domisili: string;
}

export interface Room {
  id: string;
  title: string;
  category: 'Gaming' | 'Studying' | 'Hangout';
  location: string;
  currentParticipants: number;
  maxParticipants: number;
  masterName: string;
}