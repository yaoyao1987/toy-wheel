import History from './base'
export default class HashHistory extends History {
  constructor(router) { // router => new VueRouter
    super(router);
    ensureSlash();
    // this.router = router;
  }
  getCurrentLocation() {
    return getHash();
  }
  setupHashListener() {
    window.addEventListener("hashchange", () => {
      // 根据当前hash值 过度到对应路径
      this.transitionTo(this.getCurrentLocation())
    });
  }
}

function getHash() {
  return window.location.hash.slice(1);
}

function ensureSlash() {
  if (window.location.hash) {
    return;
  }
  window.location.hash = '/'
}