import { mergeOptions } from '../util/index'

export function initGlobalAPI(Vue) {
  Vue.options = {}
  Vue.mixin = function (mixin) {
    // 将属性合并到Vue.options上
    this.options = mergeOptions(this.options, mixin);
    return this;
  }
}