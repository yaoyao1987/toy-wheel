// 数组去重，求并集
function union(arr1, arr2) {
  return [...new Set([...arr1, ...arr2])]
}
console.log('union([1,2,3],[2,3,4,5])', union([1, 2, 3], [2, 3, 4, 5]))