let id = 0;
class Dep {
  constructor() {
    this.id = id++;
    this.subs = [];
  }
  depend() {
    if (Dep.target) {
      Dep.target.addDep(this); // 让watcher去存放dep
    }
  }
  addSub(watcher) { // 存储watcher
    this.subs.push(watcher)
  }
  notify() {
    this.subs.forEach(watcher => watcher.update())
  }
}

let stack = [];
export function pushTarget(watcher) {
  Dep.target = watcher;
  stack.push(watcher)
}

export function popTarget() {
  stack.pop();
  Dep.target = stack[stack.length - 1]
}

export default Dep;