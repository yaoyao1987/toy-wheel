import { initMixin } from './init'
import { lifecycleMixin } from './lifecycle'
import { renderMixin } from './render'
import { initGlobalAPI } from './global-api/index'


function Vue(options) {
  this._init(options)
}

initMixin(Vue); // 给原型上新增_init方法
lifecycleMixin(Vue); // 给原型上新增_update方法
renderMixin(Vue); // 给原型上新增_render方法
initGlobalAPI(Vue); //混合全局的API

export default Vue;