let id = 0
class Watcher {
  constructor(vm, fn, cb, options) {
    this.vm = vm;
    this.fn = fn;
    this.cb = cb
    this.options = options;
    this.id = id++
    this.deps = [];
    this.depsId = new Set();
    this.fn(); // 调用传入的函数
  }
  // 这个方法中会对属性进行取值操作
  get() {
    pushTarget(this); // Dep.target = watcher
    this.getter(); // 会取值 vm_update(vm_render())
    popTarget(); // Dep.target = null
  }
  addDep(dep) {
    let id = dep.id;
    if (!this.depsId.has(id)) { // dep是非重复的，watcher肯定也不会重
      this.depsId.add(id);
      this.deps.push(dep);
      dep.addSub(this)
    }
  }
  update() {
    this.get() // 不停地渲染
  }
}
export default Watcher