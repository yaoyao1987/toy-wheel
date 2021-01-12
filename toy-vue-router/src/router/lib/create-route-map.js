/**
 * 将用户传入的数据进行格式化
 * @param {*} routes 
 * @param {*} oldPathList 
 * @param {*} oldPathMap 
 */
export default function createRouteMap(routes, oldPathList, oldPathMap) {
  let pathList = oldPathList || [];
  let pathMap = oldPathMap || Object.create(null);

  routes.forEach(route => {
    addRouteRecord(route, pathList, pathMap);
  });
  console.log('pathList', pathList)
  console.log('pathMap', pathMap)
  return {
    pathList,
    pathMap
  }
}

function addRouteRecord(route, pathList, pathMap, parentRecord) {
  let path = parentRecord ? `${parentRecord.path}/${route.path}` : route.path
  let record = {
    path,
    component: route.component,
    parentRecord
  }
  if (!pathMap[path]) {
    pathList.push(path) // 将路径添加到pathList
    pathMap[path] = record;
  }

  if (route.children) {
    route.children.forEach(child => {
      addRouteRecord(child, pathList, pathMap, record) // 如果有含有children属性，则进行递归处理
    });
  }
}