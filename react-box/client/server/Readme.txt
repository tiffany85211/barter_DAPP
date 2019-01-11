===== DATABASE =====

data structure (ItemSchema):
{
    itemID: int
    likedList: int[]
    lastSeen: int
}

===== API =====
postItem: 
    url: '/api/item'
    method: POST
    function: post item全部資料
    request body: 整個要更新的ItemSchema
getItem:
    url: '/api/item/:id'
    method: GET
    function: get全部資料
    return: item json data
getLastSeen:
    url: '/api/lastSeen/:id'
    method: GET
    function: 
    return: lastSeen id
getLikeList: 
    url: '/api/likeList/:id'
    method: GET
    function: 
    return: likeList
putLastSeen: 
    url: '/api/lastSeen/:id'
    method: PUT
    function: 更新 lastSeen id
    request body:
putLikedList: 
    url: '/api/likeList/:id'
    method: PUT
    function: 更新 likeList
    request body: