import { Ticket, Status, Priority, COMPANIES, TEKNISI } from '../types';

const STORAGE_KEY = 'it_tickets_data';

// Mock initial data if empty
const INITIAL_DATA: Ticket[] = [
  {
    id: '1',
    date: new Date().toISOString().split('T')[0],
    company: COMPANIES[0],
    pic: TEKNISI[0],
    issue: 'PC Admin Gudang Mati Total (PSU)',
    type: 'HW',
    status: Status.PENDING,
    priority: Priority.HIGH,
    photoUrl: 'https://picsum.photos/200/200?random=1',
  },
  {
    id: '2',
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    company: COMPANIES[1],
    pic: TEKNISI[1],
    issue: 'Install Ulang Accurate Server',
    type: 'SW',
    status: Status.PROCESS,
    priority: Priority.NORMAL,
    photoUrl: 'https://picsum.photos/200/200?random=2',
  },
  {
    id: '3',
    date: new Date(Date.now() - 172800000).toISOString().split('T')[0],
    company: COMPANIES[2],
    pic: TEKNISI[2],
    issue: 'Printer Epson L3110 Paper Jam',
    type: 'HW',
    status: Status.DONE,
    priority: Priority.NORMAL,
    photoUrl: 'https://picsum.photos/200/200?random=3',
  }
];

export const getTickets = (): Ticket[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DATA));
    return INITIAL_DATA;
  }
  return JSON.parse(data);
};

export const saveTicket = (ticket: Ticket): void => {
  const tickets = getTickets();
  const existingIndex = tickets.findIndex(t => t.id === ticket.id);
  
  if (existingIndex >= 0) {
    tickets[existingIndex] = ticket;
  } else {
    tickets.unshift(ticket); // Add to top
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
};

export const deleteTicket = (id: string): void => {
  const tickets = getTickets().filter(t => t.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
};
