const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g

function genProps(attrs) { // 生成属性
  let str = '';
  for (let i = 0; i < attrs.length; i++) {
    let attr = attrs[i];
    if (attr.name === 'style') {
      let obj = {}
      attr.value.split(';').forEach(item => {
        let [key, value] = item.split(':');
        obj[key] = value;
      })
      attr.value = obj;
    }
    str += `${attr.name}:${JSON.stringify(attr.value)},`;
  }
  return `{${str.slice(0, -1)}}`;
}
function getChildren(el) {
  const children = el.children;
  if (children) {
    return `${children.map(child => gen(child)).join(',')}`
  } else {
    return false;
  }
}
// 区分是元素还是文本
function gen(node) {
  if (node.type == 1) {
    return generate(node);
  } else {
    // 文本逻辑不能用_c来处理
    // 有{{}}普通文本 混合文本{{aa}}bb{{cc}}ddd
    let text = node.text
    if (!defaultTagRE.test(text)) {
      return `_v(${JSON.stringify(text)})`
    }

    // 带有{{}}
    let lastIndex = defaultTagRE.lastIndex = 0
    let tokens = [];
    let match, index;
    while (match = defaultTagRE.exec(text)) {
      index = match.index;
      if (index > lastIndex) {
        tokens.push(JSON.stringify(text.slice(lastIndex, index)));
      }
      tokens.push(`_s(${match[1].trim()})`)
      lastIndex = index + match[0].length
    }
    if (lastIndex < text.length) {
      tokens.push(JSON.stringify(text.slice(lastIndex)))
    }
    return `_v(${tokens.join('+')})`;
  }
}
export function generate(el) {// 转换成render代码
  let children = getChildren(el);
  let code = `_c('${el.tag}',${
    el.attrs.length ? `${genProps(el.attrs)}` : 'undefined'
    }${
    children ? `,${children}` : ''
    })`;
  return code;
}