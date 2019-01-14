pragma solidity ^0.4.24;
import "./Items.sol";

contract Platform is Items{

    function newItem(string name, string description) external payable {
        _createItem(name, description);
    }

    function changeItem(uint id1, uint id2) external payable{
        _changeWith(id1, id2);
    }

    // function addPreferAndCheck(uint id, uint preferId) external view returns(bool) {
    //     return _addPreferAndCheck(id, preferId);
    // }

    function listUserItem() external view returns (uint[]) {
        return _listItems(msg.sender);
    }

    function getSize() external view returns (uint)  {
        return _listSize();
    }
    
    function getItem(uint i) external view returns (string memory, string memory) {
        return _item(i);
    }

    function listMatchItems() external view returns (uint[] memory) {
        return _getMatchItems(msg.sender);
    }
}