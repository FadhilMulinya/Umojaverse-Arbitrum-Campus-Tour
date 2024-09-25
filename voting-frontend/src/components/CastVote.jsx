import React, { useState, useEffect } from 'react';

export default function CastVote({ contract, eventCount }) {
  const [eventId, setEventId] = useState(0);
  const [selectedOption, setSelectedOption] = useState(0);
  const [eventDetails, setEventDetails] = useState(null);

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
    } catch (error) {
      console.error('Error fetching event details:', error);
    }
  };

  const castVote = async (e) => {
    e.preventDefault();
    if (!contract) return;

    try {
      const tx = await contract.castVote(eventId, selectedOption);
      await tx.wait();
      console.log('Vote cast successfully');
    } catch (error) {
      console.error('Error casting vote:', error);
    }
  };

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4">Cast Your Vote</h2>
      <form onSubmit={castVote} className="space-y-4">
        <input
          type="number"
          value={eventId}
          onChange={(e) => setEventId(Number(e.target.value))}
          placeholder="Event ID"
          className="w-full p-2 border rounded"
          min="0"
          max={eventCount - 1}
          required
        />
        {eventDetails && (
          <div>
            <h3 className="text-xl font-semibold">{eventDetails.title}</h3>
            <p>Start: {eventDetails.startTime}</p>
            <p>End: {eventDetails.endTime}</p>
            <select
              value={selectedOption}
              onChange={(e) => setSelectedOption(Number(e.target.value))}
              className="w-full p-2 border rounded mt-2"
            >
              {eventDetails.options.map((option, index) => (
                <option key={index} value={index}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        )}
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Cast Vote
        </button>
      </form>
    </div>
  );
}