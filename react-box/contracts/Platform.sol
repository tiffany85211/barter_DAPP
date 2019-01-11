pragma solidity ^0.4.24;
import "./Items.sol";

contract Platform is Items{

    function newItem(string name, string description) external {
        _createItem(name, description);
    }

    function changeItem(uint id1, uint id2) external {
        _changeWith(id1, id2);
    }

    function listUserItem() external view returns (uint[] memory) {
        return _listItems();
    }
    
}