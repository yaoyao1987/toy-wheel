export default class History {
  constructor(router) {
    this.router = router;
    // 默认路由中报错一个当前的路径，后续更改
    this.current = createRoute(null, {
      matched: [],
      path: "/"
    });
  }
  // location 跳转目的地，onComplete 成功后执行的方法
  transitionTo(location, onComplete) {
    let route = this.router.match(location); // 找出对应的记录

    // 相同路径就不跳转了
    if (this.current.path === location && route.matched.length === this.current.matched.length) {
      return
    }
    let queue = [].concat(this.router.beforeHooks);
    const iterator = (hook, next) => {
      hook(route, this.current, () => {
        next();
      })
    }

    runQueue(queue, iterator, () => {
      this.updateRoute(route);
      onComplete && onComplete()
    })
  }
  updateRoute(route) {
    this.current = route;
    this.cb && this.cb(route)
  }
  listen(cb) {
    this.cb = cb;
  }
}

export function createRoute(record, location) {
  let res = [];
  if (record) {
    while (record) {
      res.unshift(record);
      record = record.parentRecord
    }
  }
  return {
    ...location,
    matched: res
  }
}

function runQueue(queue, iterator, cb) { // // 迭代queue
  function step(index) {
    if (index >= queue.length) {
      cb();
    } else {
      let hook = queue[index];
      iterator(hook, () => {
        step(index + 1)
      })
    }
  }
  step(0)
}