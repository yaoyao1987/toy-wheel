export default {
  name: 'RouterView',
  functional: true,
  render(h, { parent, data }) {
    let route = parent.$route;
    let matched = route.matched;
    data._routeView = true; // 当前组件是一个routerView
    let depth = 0;

    while (parent) {
      if (parent.$vnode && parent.$vnode.data._routeView) {
        depth++;
      }
      parent = parent.$parent;
    }
    let record = matched[depth];
    if (!record) {
      return h();
    }
    let component = record.component;

    return h(component, data)
  }
}