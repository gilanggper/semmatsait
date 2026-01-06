import React from 'react';
import { Ticket, Status, Priority } from '../types';
import { Clock, AlertCircle, CheckCircle, Image as ImageIcon, Edit2, Trash2 } from 'lucide-react';

interface Props {
  ticket: Ticket;
  isAdmin: boolean;
  onEdit: (ticket: Ticket) => void;
  onDelete: (id: string) => void;
}

const TicketCard: React.FC<Props> = ({ ticket, isAdmin, onEdit, onDelete }) => {
  const getStatusColor = (status: Status) => {
    switch (status) {
      case Status.DONE: return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-100 dark:border-green-800';
      case Status.PROCESS: return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-100 dark:border-yellow-800';
      case Status.PENDING: return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-100 dark:border-red-800';
    }
  };

  const getStatusIcon = (status: Status) => {
    switch (status) {
      case Status.DONE: return <CheckCircle className="w-4 h-4 mr-1" />;
      case Status.PROCESS: return <Clock className="w-4 h-4 mr-1" />;
      case Status.PENDING: return <AlertCircle className="w-4 h-4 mr-1" />;
    }
  };

  const getStatusLabel = (status: Status) => {
    switch (status) {
        case Status.DONE: return 'Selesai';
        case Status.PROCESS: return 'Sedang Proses';
        case Status.PENDING: return 'Belum Dikerjakan';
    }
  }

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border p-4 mb-4 transition-all hover:shadow-md ${ticket.priority === Priority.HIGH && ticket.status !== Status.DONE ? 'border-l-4 border-l-red-500 dark:border-l-red-500' : 'border-gray-200 dark:border-gray-700'}`}>
      <div className="flex justify-between items-start mb-3">
        <div>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                {getStatusIcon(ticket.status)}
                {getStatusLabel(ticket.status)}
            </span>
            {ticket.priority === Priority.HIGH && ticket.status !== Status.DONE && (
                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-red-600 text-white animate-pulse">
                    PRIORITY
                </span>
            )}
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400 font-mono">
          {ticket.date}
        </div>
      </div>

      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 leading-snug">{ticket.issue}</h3>
      <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-2">{ticket.company}</p>
      
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
            <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                PIC: <strong>{ticket.pic}</strong>
            </span>
            <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs">
                {ticket.type}
            </span>
        </div>
        
        <div className="flex items-center space-x-2">
            {ticket.photoUrl && (
                <a href={ticket.photoUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 p-1">
                    <ImageIcon size={20} />
                </a>
            )}
            
            {isAdmin && (
                <>
                    <button onClick={() => onEdit(ticket)} className="text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 p-1">
                        <Edit2 size={18} />
                    </button>
                    <button onClick={() => onDelete(ticket.id)} className="text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 p-1">
                        <Trash2 size={18} />
                    </button>
                </>
            )}
        </div>
      </div>
    </div>
  );
};

export default TicketCard;