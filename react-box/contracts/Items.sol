pragma solidity ^0.4.24;
import "./Ownable.sol";
import "./SafeMath.sol";
import "./Status.sol";

contract Items is Ownable, Stat{
    using SafeMath for uint256;

    struct Item{
        string _name;
        string _description;
        uint _changeId;
        Status _status;
        // uint[] _preferItem;
    }

    //data
    Item[] public _items;
    mapping (uint => address) public itemToOwner;
    mapping (address => uint) ownerItemCount;

    function _createItem(string memory name, string memory description) internal returns(uint) {
        if (_items.length == 0) 
            _items.push(Item("[None]", "[First null element]", 0, Status.POSTING));
        uint id = _items.push(Item(name, description, 0, Status.POSTING))-1;
        itemToOwner[id] = msg.sender;
        ownerItemCount[msg.sender] = ownerItemCount[msg.sender].add(1);
        return id;
    }

    function _changeWith(uint id1, uint id2) internal {
        _items[id1]._changeId = id2;
        _items[id1]._status = Status.MATCHED;
        _items[id2]._changeId = id1;
        _items[id2]._status = Status.MATCHED;
    }

    function _listItems(address _owner) internal view returns (uint[]) {
        uint[] memory itemIds = new uint[](ownerItemCount[_owner]);
        uint counter = 0;
        for (uint i = 0; i < _items.length; i++) {
            if (itemToOwner[i] == _owner && _items[i]._changeId == 0) {
                itemIds[counter] = i;
                counter++;
            }
        }
        return itemIds;
    }

    function _listSize() internal view returns (uint) {
        return _items.length;
    }

    function _item(uint i, address _owner) internal view returns (string memory, string memory) {
        if (_owner == itemToOwner[i] && _items[i]._status == Status.POSTING) {
            return (_items[i]._name, _items[i]._description );
        }
        else {
            return ("", "");
        }
    }

    function _getMatchItems(address user) internal view returns (uint[] memory) {
        uint[] memory itemIds = new uint[](_items.length);
        uint counter = 0;
        for (uint i = 1; i < _items.length; i++) {
            if (itemToOwner[i] != user && _items[i]._status == Status.POSTING) {
                itemIds[counter] = i;
                counter++;
            }
        }
        return itemIds;
    }

    // function _addPreferAndCheck(uint id, uint preferId) internal view returns(bool){
    //     for (uint i = 0; i < _items[preferId]._preferItem.length; i++) {
    //         if (_items[preferId]._preferItem[i] == id && _items[preferId]._status == Status.POSTING) {
    //             _changeWith(id, preferId);
    //             return true;
    //         }
    //     }
    //     _items[id]._preferItem.push(preferId);
    //     return false;
    // }
}