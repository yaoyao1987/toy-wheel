const { iteratee } = require("lodash");

// 差集
function diffrence(arr1, arr2) {
  return arr1.filter(item => !new Set(arr2).has(item)))
}