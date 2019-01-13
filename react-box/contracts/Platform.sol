pragma solidity ^0.4.24;
import "./Items.sol";

contract Platform is Items{

    function newItem(string name, string description) external payable returns(uint) {
        return _createItem(name, description);
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

    function getItem(string name) external view returns (string, string) {
        for(uint i = 0; i < _items.length; i++) {
            if(keccak256(abi.encodePacked(_items[i]._name)) == keccak256(abi.encodePacked(name))) {
                return (_items[i]._name, _items[i]._description); 
            }
        }
    }

    function getSize() external view returns (uint)  {
        return _listSize();
    }
    
    function getItem(uint i) external view returns (string memory, string memory) {
        return _item(i, msg.sender);
    }

    function listMatchItems() external view returns (uint[] memory) {
        return _getMatchItems(msg.sender);
    }
}