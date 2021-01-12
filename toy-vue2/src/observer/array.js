const oldArrayProtoMethods = Array.prototype;
export const arrayMethods = Object.create(oldArrayProtoMethods)

// 重写会导致数组本身发生变化的方法
const methods = [
  'push',
  'pop',
  'shift',
  'unshift',
  'reserve',
  'sort',
  'splice'
]

methods.forEach(method => {
  arrayMethods[method] = function (...args) {
    // AOP切片编程
    const result = oldArrayProtoMethods[method].apply(this, args); // 调用原生的数组方法
    const ob = this.__ob__;
    let inserted; // 当前用户插入的元素
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args;
        break;
      case 'splice':
        inserted = args.slice(2)
      default:
        break
    }
    if (inserted) ob.observeArray(inserted); // 对新增的每一项进行观测
    ob.dep.notify();
    return result
  }
})