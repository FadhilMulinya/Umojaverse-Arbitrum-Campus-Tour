// SPDX-License-Identifier: MIT
pragma solidity 0.8.27;

/**
 * @title VotingDapp
 * @dev This contract allows users to create voting events and cast votes on various options.
 * Each voting event has a title, options to vote for, and a time window (start and end time) within which voting is allowed.
 * Users can only vote once per event, and votes are counted for each option.
 */
contract VotingDapp {

    /**
     * @dev Struct to define the voting event structure.
     * - title: Title of the voting event.
     * - options: A dynamic array of strings containing the options available for voting.
     * - startTime: Unix timestamp representing the start time of the voting event.
     * - endTime: Unix timestamp representing the end time of the voting event.
     * - voted: A mapping to track whether an address has already voted in this event.
     * - voteCount: A mapping to keep track of the vote count for each option.
     */
    struct votingEvent {
        string title;                      // Title of the voting event
        string[] options;                  // List of voting options
        uint256 startTime;                 // Voting start time (Unix timestamp)
        uint256 endTime;                   // Voting end time (Unix timestamp)
        mapping(address => bool) voted;    // Tracks whether an address has already voted
        mapping(uint256 => uint256) voteCount; // Stores the vote count for each option by index
    }

    // Mapping of voting events. Each event is identified by a unique ID (uint256).
    mapping(uint256 => votingEvent) public votingEvents;

    // Counter to track the number of voting events created. Used as an event ID.
    uint256 public eventCount;

    // Event emitted when a new voting event is created.
    event votingEventCreated(string _title, uint256 indexed _id, uint256 _startTime, uint256 _endTime);

    // Event emitted when a vote is cast in a voting event.
    event voteCast(uint256 optionIndex, uint256 indexed eventId);

    /**
     * @dev Function to create a new voting event. 
     * The creator specifies the title, options, start time, and end time for the event.
     * Emits a `votingEventCreated` event on successful creation.
     * @param _title The title of the voting event.
     * @param _options A dynamic array of strings representing the voting options.
     * @param _startTime Unix timestamp representing the start time of the voting event.
     * @param _endTime Unix timestamp representing the end time of the voting event.
     */
    function createVotingEvent(
        string memory _title, 
        string[] memory _options, 
        uint256 _startTime, 
        uint256 _endTime
    ) 
        public 
    {
        // Ensure the start time is before the end time.
        require(_startTime < _endTime, "Start time must be before end time");

        // Ensure that at least two voting options are provided.
        require(_options.length > 1, "At least two options required");

        // Increment the event counter to generate a new event ID.
        uint256 eventId = eventCount++;

        // Create a new voting event and store it in the mapping.
        votingEvent storage newEvent = votingEvents[eventId];
        newEvent.title = _title;
        newEvent.options = _options;
        newEvent.startTime = _startTime;
        newEvent.endTime = _endTime;

        // Emit an event to signal that a new voting event has been created.
        emit votingEventCreated(_title, eventId, _startTime, _endTime);
    }

    /**
     * @dev Function to cast a vote on a specific option in a voting event.
     * The function checks that the event is active, the user has not already voted, and that the chosen option is valid.
     * Emits a `voteCast` event after a vote is successfully cast.
     * @param _eventId The ID of the voting event.
     * @param _optionIndex The index of the option the voter wants to vote for (0-based index).
     */
    function castVote(uint256 _eventId, uint256 _optionIndex) public {
        // Fetch the voting event from the mapping.
        votingEvent storage votingEvent = votingEvents[_eventId];

        // Ensure the voting event is active (between startTime and endTime).
        require(
            block.timestamp >= votingEvent.startTime && block.timestamp <= votingEvent.endTime,
            "Voting is not active"
        );

        // Ensure the caller has not already voted in this event.
        require(!votingEvent.voted[msg.sender], "Already voted");

        // Ensure the selected option index is valid (within the range of options).
        require(_optionIndex < votingEvent.options.length, "Invalid option");

        // Mark the user as having voted.
        votingEvent.voted[msg.sender] = true;

        // Increment the vote count for the selected option.
        votingEvent.voteCount[_optionIndex]++;

        // Emit an event to signal that a vote has been cast.
        emit voteCast(_optionIndex, _eventId);
    }

    /**
     * @dev Function to retrieve details of a specific voting event.
     * Returns the title, options, start time, and end time of the event.
     * @param _eventId The ID of the voting event.
     * @return title The title of the voting event.
     * @return options The available voting options for the event.
     * @return startTime The start time of the voting event.
     * @return endTime The end time of the voting event.
     */
    function getVotingEventDetails(uint256 _eventId) 
        public 
        view 
        returns (string memory title, string[] memory options, uint256 startTime, uint256 endTime) 
    {
        // Fetch the voting event from the mapping.
        votingEvent storage votingEvent = votingEvents[_eventId];
        // Return the relevant details.
        return (votingEvent.title, votingEvent.options, votingEvent.startTime, votingEvent.endTime);
    }

    /**
     * @dev Function to get the vote count for a specific option in a voting event.
     * Returns the total number of votes for the given option index.
     * @param _eventId The ID of the voting event.
     * @param _optionIndex The index of the option to check the vote count for.
     * @return The total number of votes for the selected option.
     */
    function getVoteCount(uint256 _eventId, uint256 _optionIndex) public view returns (uint256) {
        // Return the vote count for the given option index in the specified voting event.
        return votingEvents[_eventId].voteCount[_optionIndex];
    }
}
