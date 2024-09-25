// SPDX-License-Identifier: MIT
pragma solidity 0.8.27;

contract VotingDapp {
    struct votingEvent{
        string title;
        string[] options;
        uint256 startTime;
        uint256 endTime;
        mapping(address => bool) voted;
        mapping(uint256 => uint256) voteCount;
    }
    mapping(uint256 => votingEvent) public votingEvents;
    uint256 public eventCount;

    event votingEventCreated(string _title, uint256 indexed _id, uint256 _startTime, uint256 _endTime);
    event voteCast(uint256 optionIndex, uint256 indexed eventId);

    function createVotingEvent(string memory _title, string[] memory _options, uint256 _startTime, uint256 _endTime) public {
        require(_startTime < _endTime,  "Start time must be before end time");
        require(_options.length > 1, "Atleast two options required");

        uint256 eventId = eventCount++;
        votingEvent storage newEvent = votingEvents[eventId];
        newEvent.title = _title;
        newEvent.options = _options;
        newEvent.startTime = _startTime;
        newEvent.endTime =  _endTime;

        emit  votingEventCreated(_title, eventId, _startTime, _endTime);
    }

    function castVote( uint256 _eventId, uint256 _optionIndex)public{
        votingEvent storage votingEvent = votingEvents[_eventId];
        require(block.timestamp >= votingEvent.startTime && block.timestamp <= votingEvent.endTime, "Voting is not active");
        require(!votingEvent.voted[msg.sender], "Already voted");
        require(_optionIndex < votingEvent.options.length, "Invalid options");

        votingEvent.voted[msg.sender] = true; 
        votingEvent.voteCount[_optionIndex] ++;

        emit voteCast(_optionIndex, _eventId);

    }
    function getVotingEventDetails(uint256 _eventId) public view returns (string memory, string[] memory, uint256, uint256){
            votingEvent storage votingEvent = votingEvents[_eventId];
            return (votingEvent.title, votingEvent.options, votingEvent.startTime, votingEvent.endTime);
        }
           function getVoteCount(uint256 _eventId,  uint256 _optionIndex) public view returns (uint256){
            return votingEvents[_eventId].voteCount[_optionIndex];
    }
     
}