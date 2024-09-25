import React, { useState, useEffect } from 'react';

export default function DisplayResults({ contract, eventCount }) {
  const [eventId, setEventId] = useState(0);
  const [eventDetails, setEventDetails] = useState(null);
  const [voteCounts, setVoteCounts] = useState([]);

  useEffect(() => {
    if (contract && eventId !== null) {
      fetchEventDetails();
    }
  }, [contract, eventId]);

  const fetchEventDetails = async () => {
    try {
      const details = await contract.getVotingEventDetails(eventId);
      setEventDetails({
        title: details[0],
        options: details[1],
        startTime: new Date(details[2].toNumber() * 1000).toLocaleString(),
        endTime: new Date(details[3].toNumber() * 1000).toLocaleString(),
      });

      const counts = await Promise.all(
        details[1].map((_, index) => contract.getVoteCount(eventId, index))
      );
      setVoteCounts(counts.map(count => count.toNumber()));
    } catch (error) {
      console.error('Error fetching event details:', error);
    }
  };

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4">Voting Results</h2>
      <input
        type="number"
        value={eventId}
        onChange={(e) => setEventId(Number(e.target.value))}
        placeholder="Event ID"
        className="w-full p-2 border rounded mb-4"
        min="0"
        max={eventCount - 1}
        required
      />
      {eventDetails && (
        <div>
          <h3 className="text-xl font-semibold">{eventDetails.title}</h3>
          <p>Start: {eventDetails.startTime}</p>
          <p>End: {eventDetails.endTime}</p>
          <ul className="mt-4">
            {eventDetails.options.map((option, index) => (
              <li key={index} className="flex justify-between items-center mb-2">
                <span>{option}</span>
                <span className="font-bold">{voteCounts[index] || 0} votes</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}