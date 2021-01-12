import install from './install'
import createMatcher from './create-matcher'
import HashHistory from './history/hash'
export default class VueRouter {
  constructor(options) {
    // 1. 什么叫路由 根据不同的路径跳转不同的组件

    this.beforeHooks = []
    this.resolveHooks = []
    this.afterHooks = []

    // 将用户传递的routes转化成好维护的数据结构

    // match负责匹配路径{'/': '记录', 'about':'记录'}
    // addRoutes 动态添加路由配置
    this.matcher = createMatcher(options.routes || []);

    // 创建路由系统 根据模式来创建不同的路由对象
    this.mode = options.mode || 'hash';

    // History 基类
    // new HashHistory
    // new H5History

    this.history = new HashHistory(this);
  }
  init(app) { // app指代根实例
    // 根据当前路径，显示到指定的组件
    const history = this.history;
    const setupListeners = () => {
      history.setupHashListener();
    };
    history.transitionTo(history.getCurrentLocation(), setupListeners)

    history.listen((route) => {
      app._route = route;
    })
  }
  // 匹配路径
  match(location) {
    return this.matcher.match(location)
  }
  beforeEach(fn) {
    this.beforeHooks.push(fn);
  }
  beforeResolve(fn) {
    this.resolveHooks.push(fn);
  }
  afterEach(fn) {
    this.afterHooks.push(fn);
  }
  push() {

  }
  replace() {

  }
}

// 默认调用install方法
VueRouter.install = install;