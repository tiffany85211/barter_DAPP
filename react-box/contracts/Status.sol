pragma solidity ^0.4.25;
import "./Ownable.sol";

contract Status is Ownable {
    
    //define Status
    enum Status {POSTING, MATCHED}

    //function for status
    function isPosting(Status status) external view onlyOwner returns (bool){
        return status == Status.POSTING;
    }
    function isMatched(Status status) external view onlyOwner returns (bool){
        return status == Status.MATCHED;
    }
}