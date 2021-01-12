let callbacks = [];
function flushCallbacks() {
  callbacks.forEach(cb => cb())
}
let timerFunc;
if (Promise) { // then方法是异步的
  timerFunc = () => {
    Promise.resolve().then(flushCallbacks)
  }
} else if (MutationObserver) {// MutationObserver 也是一个异步方法
  let observe = new MutationObserver(flushCallbacks);
  let textNode = document.createTextNode(1);
  observe.observe(textNode, { characterData: true })
  timerFunc = () => {
    textNode.textContent = 2;
  }
} else if (setImmediate) {
  timerFunc = () => {
    setImmediate(flushCallbacks)
  }
} else {
  timerFunc = () => {
    setTimeout(flushCallbacks, 0);
  }
}
export function nextTick(cb) {
  callbacks.push(cb);
  timerFunc()
}