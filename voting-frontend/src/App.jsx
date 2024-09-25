import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import {CreateVotingEvent} from 'components/CreateVotingEvent';
import {CastVote} from 'components/CastVote';
import {DisplayResults} from 'components/DisplayResults';
import {VotingPlatformABI} from 'components/VotingPlatformABI.json';

const CONTRACT_ADDRESS = '0xfc7A2a63cC5F7eA9D794374867B72372B118DB69';

export default function VotingPlatform() {
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [eventCount, setEventCount] = useState(0);

  useEffect(() => {
    const init = async () => {
      if (typeof window.ethereum !== 'undefined') {
        try {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          const address = await signer.getAddress();
          setAccount(address);

          const votingContract = new ethers.Contract(CONTRACT_ADDRESS, VotingPlatformABI, signer);
          setContract(votingContract);

          const count = await votingContract.eventCount();
          setEventCount(count.toNumber());
        } catch (error) {
          console.error('Failed to connect to Ethereum:', error);
        }
      } else {
        console.log('Please install MetaMask!');
      }
    };

    init();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Voting Platform</h1>
      {account ? (
        <>
          <p className="mb-4">Connected Account: {account}</p>
          <CreateVotingEvent contract={contract} />
          <CastVote contract={contract} eventCount={eventCount} />
          <DisplayResults contract={contract} eventCount={eventCount} />
        </>
      ) : (
        <p>Please connect your wallet to use the voting platform.</p>
      )}
    </div>
  );
}