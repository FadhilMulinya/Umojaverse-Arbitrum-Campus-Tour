import React, { useState } from 'react';

export default function CreateVotingEvent({ contract }) {
  const [title, setTitle] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const addOption = () => {
    setOptions([...options, '']);
  };

  const createEvent = async (e) => {
    e.preventDefault();
    if (!contract) return;

    try {
      const startTimestamp = Math.floor(new Date(startTime).getTime() / 1000);
      const endTimestamp = Math.floor(new Date(endTime).getTime() / 1000);
      const tx = await contract.createVotingEvent(title, options, startTimestamp, endTimestamp);
      await tx.wait();
      console.log('Voting event created successfully');
      // Reset form
      setTitle('');
      setOptions(['', '']);
      setStartTime('');
      setEndTime('');
    } catch (error) {
      console.error('Error creating voting event:', error);
    }
  };

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4">Create Voting Event</h2>
      <form onSubmit={createEvent} className="space-y-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Event Title"
          className="w-full p-2 border rounded"
          required
        />
        {options.map((option, index) => (
          <input
            key={index}
            type="text"
            value={option}
            onChange={(e) => handleOptionChange(index, e.target.value)}
            placeholder={`Option ${index + 1}`}
            className="w-full p-2 border rounded"
            required
          />
        ))}
        <button type="button" onClick={addOption} className="bg-blue-500 text-white p-2 rounded">
          Add Option
        </button>
        <input
          type="datetime-local"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="datetime-local"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <button type="submit" className="bg-green-500 text-white p-2 rounded">
          Create Event
        </button>
      </form>
    </div>
  );
}