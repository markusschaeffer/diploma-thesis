pragma solidity ^0.4.0;

contract Ballot {

    struct Voter {
        uint weight; //weight of voting
        bool voted; //true/false
        uint8 vote; //id of proposal
    }

    struct Proposal {
        uint voteCount;
    }
    
    address chairperson;
    mapping(address => Voter) voters;
    Proposal[] proposals;

    /// Create a new ballot with $(_numProposals) different proposals.
    constructor (uint8 _numProposals) public {
        chairperson = msg.sender;
        voters[chairperson].weight = 1;
        proposals.length = _numProposals;
    }

    /// Give $(toVoter) the right to vote on this ballot.
    /// May only be called by $(chairperson).
    function giveRightToVote(address toVoter) public {
        if (msg.sender != chairperson || voters[toVoter].voted) 
            return;
        voters[toVoter].weight = 1;
    }

    /// Give a single vote to proposal $(toProposal).
    function vote(uint8 toProposal) public {
        Voter storage sender = voters[msg.sender];
        if (sender.voted || toProposal >= proposals.length) 
            return;
        sender.voted = true;
        sender.vote = toProposal;
        //increase voteCount for specific proposal
        proposals[toProposal].voteCount += sender.weight; 
    }

    //output winning proposal id
    function winningProposal() public constant returns (uint8 _winningProposal) {
        uint256 winningVoteCount = 0;
        for (uint8 prop = 0; prop < proposals.length; prop++)
            if (proposals[prop].voteCount > winningVoteCount) {
                winningVoteCount = proposals[prop].voteCount;
                _winningProposal = prop;
            }
    }
}
