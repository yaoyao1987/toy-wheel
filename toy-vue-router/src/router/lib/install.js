import View from "./components/view";
import Link from "./components/link";

// 安装插件，插件依赖于vue
export let _Vue;
export default function install(Vue) { // Vue是vue的构造函数
  _Vue = Vue;

  // 把用户注入的router属性
  Vue.mixin({
    beforeCreate() {
      // 根实例
      if (this.$options.router) { // 深度优先
        this._routerRoot = this;
        this._router = this.$options.router;

        // 初始化
        this._router.init(this); // 初始化方法

        Vue.util.defineReactive(this, '_route', this._router.history.current)
      } else {
        // 子组件
        this._routerRoot = (this.$parent && this.$parent._routerRoot) || this;
        this._router = this.$parent && this.$parent._router;
      }
    }
  })

  Object.defineProperty(Vue.prototype, '$route', {
    get() {
      return this._routerRoot._route
    }
  })

  Object.defineProperty(Vue.prototype, '$router', {
    get() {
      return this._routerRoot._router
    }
  })
  // 1. 注册全局属性$route $router
  // 2. 注册全局指令v-scroll 
  // 3. 注册全局的组件 router-view router-link
  Vue.component('RouterView', View)
  Vue.component('RouterLink', Link)
}

