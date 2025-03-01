import { useState } from 'react';

export default function SupportTickets({ tickets, onResolve }) {
  const [expandedTicket, setExpandedTicket] = useState(null);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr>
            <th className="px-4 py-2 text-left">Subject</th>
            <th className="px-4 py-2 text-left">User</th>
            <th className="px-4 py-2 text-left">Status</th>
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map(ticket => (
            <>
              <tr 
                key={ticket.id} 
                className="border-t cursor-pointer hover:bg-gray-50"
                onClick={() => setExpandedTicket(
                  expandedTicket === ticket.id ? null : ticket.id
                )}
              >
                <td className="px-4 py-2">{ticket.subject}</td>
                <td className="px-4 py-2">{ticket.userEmail}</td>
                <td className="px-4 py-2">
                  <span className={`px-2 py-1 rounded-full text-sm ${
                    ticket.status === 'open' 
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {ticket.status}
                  </span>
                </td>
                <td className="px-4 py-2">
                  {ticket.status === 'open' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onResolve(ticket.id);
                      }}
                      className="text-green-500 hover:text-green-700"
                    >
                      Resolve
                    </button>
                  )}
                </td>
              </tr>
              {expandedTicket === ticket.id && (
                <tr>
                  <td colSpan="4" className="px-4 py-2 bg-gray-50">
                    <div className="space-y-2">
                      <div>
                        <strong>Description:</strong>
                        <p className="text-gray-700">{ticket.description}</p>
                      </div>
                      <div>
                        <strong>Attachments:</strong>
                        <div className="flex space-x-2 mt-1">
                          {ticket.attachments?.map((url, i) => (
                            <a 
                              key={i}
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:underline"
                            >
                              Attachment {i + 1}
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
}
