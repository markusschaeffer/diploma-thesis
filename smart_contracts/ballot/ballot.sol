pragma solidity ^0.4.0;

/*
 * Simplified voting contract (allowing multiple votes per voter) 
 */

contract Ballot {

    struct Proposal {
        uint voteCount;
    }
    
    Proposal[] proposals;

    /// Create a new ballot with $(_numProposals) different proposals.
    constructor (uint8 _numProposals) public {
        proposals.length = _numProposals;
    }

    /// Give a single vote to proposal $(toProposal).
    function vote(uint8 toProposal) public {
        //increase voteCount for specific proposal
        proposals[toProposal].voteCount += 1; 
    }

    //output winning proposal id
    function winningProposal() public view returns (uint8 _winningProposal) {
        uint256 winningVoteCount = 0;
        for (uint8 prop = 0; prop < proposals.length; prop++)
            if (proposals[prop].voteCount > winningVoteCount) {
                winningVoteCount = proposals[prop].voteCount;
                _winningProposal = prop;
            }
    }
    
    //output voteCount for specific proposal
    function getVoteCountForProposal(uint8 _proposalId) public view returns (uint _voteCount){
        _voteCount =  proposals[_proposalId].voteCount;
    }
}
