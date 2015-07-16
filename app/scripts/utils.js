var Utils = {
  isHeroku: (document.location.host.search('herokuapp.com') > -1),
  findIdInArray: function (arr, idVal, idKey) {
    if (typeof idKey == 'undefined') idKey = '_id';
    for (var i = 0, a; a = arr[i]; i++) {
      if (a[idKey] == idVal) {
        return a;
      }
    }
    return false;
  }
}

var Consts = {
  OunceToGrams: 28.3495,
  api_root: (Utils.isHeroku ? 'https://turkenich-api.herokuapp.com/' : 'http://localhost:3000/'),
}

function yo(title, data) {
  console.log(title, data);
}

Array.prototype.findById = function (idVal, idKey) {
  if (typeof idKey == 'undefined') idKey = '_id';
  for (var i = 0, a; a = this[i]; i++) {
    if (a[idKey] == idVal) {
      return a;
    }
  }
  return {};
}

Array.prototype.findIndexById = function (idVal, idKey) {
  if (typeof idKey == 'undefined') idKey = '_id';
  for (var i = 0, a; a = this[i]; i++) {
    if (a[idKey] == idVal) {
      return i;
    }
  }
  return -1;
}

Array.prototype.findNextById = function (idVal, idKey) {
  if (typeof idKey == 'undefined') idKey = '_id';
  var res = {};
  for (var i = 0, a; a = this[i]; i++) {
    if (a[idKey] > idVal) {
      if (!res[idKey] || a[idKey] < res[idKey]) {
        res = a;
      }
    }
  }
  return res;
}

Array.prototype.findPrevById = function (idVal, idKey) {
  if (typeof idKey == 'undefined') idKey = '_id';
  var res = {};
  for (var i = 0, a; a = this[i]; i++) {
    if (a[idKey] < idVal) {
      if (!res[idKey] || a[idKey] > res[idKey]) {
        res = a;
      }
    }
  }

  return res;
}

String.prototype.isJson = function (text) {
  if (/^[\],:{}\s]*$/.test(text.replace(/\\["\\\/bfnrtu]/g, '@').
      replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
      replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

    //the json is ok
    return true;
  } else {

    //the json is not ok
    return false;

  }
}
