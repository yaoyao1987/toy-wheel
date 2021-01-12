import { parseHTML } from './parse'
import { generate } from './generate'

// ast语法树 用对象来描述原生语法; 虚拟dom用对象来描述dom节点
export function compileToFunctions(template) {
  let ast = parseHTML(template)
  let code = generate(ast)

  let render = `with(this){return ${code}}`;
  let renderFn = new Function(render);

  return renderFn
}