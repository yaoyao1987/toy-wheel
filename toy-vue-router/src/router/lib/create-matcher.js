import createRouteMap from "./create-route-map";
import { createRoute } from "./history/base";

/**
 * 
 * @param {*} routes 用户当前传入的配置
 */
export default function createMatcher(routes) {
  // routes 用户当前传入的配置
  // 扁平化用户传入的数据 创建路由映射表

  // [/,/about,/about/a,/about/b]
  // [/:记录,/about:记录,/about/a:记录,/about/b:记录]
  let { pathList, pathMap } = createRouteMap(routes); // 初始化配置

  // 动态添加路由的方法
  function addRoutes(routes) {
    createRouteMap(routes, pathList, pathMap) // 添加新的配置
  }

  // 用来匹配路由的方法
  function match(location) {
    let record = pathMap[location];
    let local = { path: location };
    // 找到当前的记录
    // 根据记录产生一个匹配数组
    if (record) {
      return createRoute(record, local)
    }
    return createRoute(null, local)
  }
  return {
    match,
    addRoutes
  }
}