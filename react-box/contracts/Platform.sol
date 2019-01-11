pragma solidity ^0.4.24;
import "./Items.sol";

contract Platform is Items{

    function newItem(string name, string description) external payable {
        _createItem(name, description);
    }

    function changeItem(uint id1, uint id2) external payable{
        _changeWith(id1, id2);
    }

    function listUserItem() external view returns (uint[] memory) {
        return _listItems();
    }

    function getItem(string name) external view returns (string) {
        for(uint i = 0; i < _items.length; i++) {
            if(keccak256(abi.encodePacked(_items[i]._name)) == keccak256(abi.encodePacked(name))) {return _items[i]._description;}
        }
    }


}