var Utils = {
    isBchmn: (document.location.host.search('bchmn.com') > -1),
    isHeroku: (document.location.host.search('herokuapp.com') > -1),
    findIdInArray: function(arr, idVal, idKey){
        if (typeof idKey == 'undefined') idKey = '_id';
        for (var i=0, a; a = arr[i]; i++){
            if (a[idKey] == idVal){
                return a;
            }
        }
        return false;
    }
}

var Consts = {
    api_root: Utils.isBchmn ? 'http://tfl.bchmn.com/' : (Utils.isHeroku ? 'http://treatsforlife-api.herokuapp.com/' : 'http://localhost:3000/')
}

Array.prototype.findById = function(idVal, idKey){
    if (typeof idKey == 'undefined') idKey = '_id';
    for (var i=0, a; a = this[i]; i++){
        if (a[idKey] == idVal){
            return a;
        }
    }
    return false;
}

Array.prototype.findIndexById = function(idVal, idKey){
    if (typeof idKey == 'undefined') idKey = '_id';
    for (var i=0, a; a = this[i]; i++){
        if (a[idKey] == idVal){
            return i;
        }
    }
    return false;
}