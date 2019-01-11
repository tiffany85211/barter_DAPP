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
    }

    //data
    Item[] public _items;
    mapping (uint => address) public itemToOwner;
    mapping (address => uint) ownerItemCount;

    function _createItem(string memory name, string memory description) internal {
        if (_items.length == 0) 
            _items.push(Item("[None]", "[First null element]", 0, Status.POSTING));
        uint id = _items.push(Item(name, description, 0, Status.POSTING))-1;
        itemToOwner[id] = msg.sender;
        ownerItemCount[msg.sender] = ownerItemCount[msg.sender].add(1);
    }

    function _changeWith(uint id1, uint id2) internal {
        _items[id1]._changeId = id2;
        _items[id1]._status = Status.MATCHED;
        _items[id2]._changeId = id1;
        _items[id2]._status = Status.MATCHED;
    }

    function _listItems() internal view returns (uint[] memory) {
        uint[] storage itemIds;
        for (uint i = 0; i < _items.length; i++) {
            if (itemToOwner[i] == msg.sender && _items[i]._changeId == 0) {
                itemIds.push(i);
            }
        }
        return itemIds;
    }
}