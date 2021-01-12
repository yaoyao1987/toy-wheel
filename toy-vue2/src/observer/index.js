import { isObject, def } from '../util/index'
import { arrayMethods } from './array'
import Dep from './dep';

class Observer { // 观测值
  constructor(value) {

    // 给数组本身和对象本身增加一个dep属性
    this.dep = new Dep();

    // 给每个监测过的对象加一个__ob__属性
    def(value, '__ob__', this)

    // 如果是数组，不会对所以进行观测，因为会导致性能问题
    if (Array.isArray(value)) {
      value.__proto__ = arrayMethods; // 重写数组原型方法
      this.observeArray(value)
    } else {
      this.walk(value)
    }
  }
  observeArray(value) {
    for (let i = 0; i < value.length; i++) {
      observe(value[i])
    }
  }
  walk(data) { // 让对象上的所有属性依次进行观测
    let keys = Object.keys(data);
    for (let i = 0; i < keys.length; i++) {
      let key = keys[i];
      let value = data[key];
      defineReactive(data, key, value)
    }
  }
}

// 就是让里层数组收集外层数组的依赖，这样修改里层数组也可以
function dependArray(value) {
  for (let i = 0; i < value.length; i++) {
    let current = value[i];
    current.__ob__ && current.__ob__.dep.depend();
    if (Array.isArray(current)) {
      dependArray(current)
    }
  }
}

export function defineReactive(data, key, value) {
  let childOb = observe(value); // 递归实现深度检测
  let dep = new Dep();

  Object.defineProperty(data, key, {
    get() {
      if (Dep.target) { // 如果取值时有watcher
        dep.depend(); // 让watcher保存dep，并且让dep保存watcher
        if (childOb) {
          childOb.dep.depend(); // 收集数组依赖
          if (Array.isArray(value)) { // 如果内部还是数组
            dependArray(value); // 不停的进行依赖收集
          }
        }
      }
      return value
    },
    set(newValue) {
      if (newValue == value) return
      observe(newValue); // 继续劫持用户设置的值，因为有可能用户设置的值是一个对象
      value = newValue
      dep.notify(); // 通知渲染watcher去更新
    }
  })
}

export function observe(data) {
  let isObj = isObject(data);
  if (!isObj) return
  return new Observer(data)
}