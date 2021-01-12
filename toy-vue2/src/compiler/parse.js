// ?: 匹配不捕获
const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`;
const qnameCapture = `((?:${ncname}\\:)?${ncname})`;
const startTagOpen = new RegExp(`^<${qnameCapture}`); // 标签开头的正则 捕获的内容是标签名
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`); // 匹配标签结尾的 </div>
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // 匹配属性的
const startTagClose = /^\s*(\/?)>/; // 匹配标签结束的 >

export function parseHTML(html) {
  function createASTElement(tag, attrs) {
    return {
      tag,
      type: 1,
      children: [],
      attrs,
      parent: null
    }
  }

  let root = null
  let currentParent;
  let stack = []
  // 根据开始标签 结束标签 文本内容 生成一个ast语法树
  function start(tagName, attrs) {
    let element = createASTElement(tagName, attrs)
    if (!root) {
      root = element
    }
    currentParent = element
    stack.push(element)
  }
  function end(tagName) {
    let element = stack.pop();
    currentParent = stack[stack.length - 1]
    if (currentParent) {
      element.parent = currentParent;
      currentParent.children.push(element)
    }
  }
  function chars(text) {
    text = text.replace(/\s/g, '')
    if (text) {
      currentParent.children.push({
        type: 3,
        text
      })
    }
  }
  function advance(n) {
    html = html.substring(n)
  }
  function parseStartTag() {
    const start = html.match(startTagOpen)
    if (start) {
      const match = {
        tagName: start[1],
        attrs: []
      }
      advance(start[0].length) // 将标签删除

      let end, attr;
      while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
        // 将属性进行解析
        advance(attr[0].length) // 将属性去掉
        match.attrs.push({
          name: attr[1],
          value: attr[3] || attr[4] || attr[5]
        })
      }
      if (end) { // 去掉开始标签的>
        advance(end[0].length);
        return match
      }
    }
  }
  // 不停去解析html字符串
  while (html) {
    const textEnd = html.indexOf('<');
    if (textEnd === 0) {
      // 如果当前索引为0，肯定是一个标签
      const startTagMatch = parseStartTag() // 通过这个方法获取到匹配的结果tagName, attrs
      if (startTagMatch) {
        start(startTagMatch.tagName, startTagMatch.attrs);
        continue; // 如果开始标签匹配完毕后，继续下一次
      }
      let endTagMatch = html.match(endTag);
      if (endTagMatch) {
        advance(endTagMatch[0].length);
        end(endTagMatch[1]);
        continue
      }
    }
    let text;
    if (textEnd >= 0) {
      text = html.substring(0, textEnd);
    }
    if (text) {
      advance(text.length)
      chars(text)
    }
  }
  return root
}