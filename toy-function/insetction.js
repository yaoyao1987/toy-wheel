// 求交集
function insetction(arr1, arr2) {
  return arr1.filter(item => new Set(arr2).has(item))
}