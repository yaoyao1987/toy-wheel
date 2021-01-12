export function isObject(data) {
  return typeof data === 'object' && data !== null;
}

export function def(data, key, value) {
  Object.defineProperty(data, key, {
    enumerable: false,
    configurable: false,
    value
  })
}
export const LIFECYCLE_HOOKS = [
  'beforeCreate',
  'created',
  'beforeMount',
  'mounted',
  'beforeUpdate',
  'updated',
  'beforeDestroy',
  'destroyed'
];
const strats = {};
function mergeHook(parentValue, childValue) {
  if (childValue) {
    if (parentValue) {
      return parentValue.concat(childValue)
    } else { // 如果儿子有父亲没有
      return [childValue]
    }
  } else {
    return parentValue // 儿子没有直接采用父亲
  }
}
LIFECYCLE_HOOKS.forEach(hook => {
  strats[hook] = mergeHook
})
export function mergeOptions(parent, child) {
  const options = {}
  // {a: 1} {a: 2} => {a: 2}
  // {a: 1} {} => {a: 1}
  // 自定义的策略
  // 1.如果父亲有的儿子也有，应该用儿子替换父亲
  // 2.如果父亲优质儿子没有，用父亲的
  for (const key in parent) {
    mergeField(key)
  }
  for (const key in child) {
    if (!parent.hasOwnProperty(key)) {
      mergeField(key)
    }
  }
  function mergeField(key) {
    // 策略模式
    if (strats[key]) {
      options[key] = strats[key](parent[key, child[key]]);
    } else {
      if (typeof parent[key] === 'object' && typeof child[key] == 'object') { // 父子的值都是对象
        options[key] = {
          ...parent[key],
          ...child[key]
        }
      } else {
        if (child[key]) { // 如果儿子有值
          options[key] = child[key]
        } else {
          options[key] = parent[key]
        }
      }
    }
  }
  return options
}