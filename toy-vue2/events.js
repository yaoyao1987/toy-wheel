let compiler = require("vue-template-compiler");
// let r1 = compiler.compile('<div @click="fn()"></div>')
// let r2 = compiler.compile('<my-component @click.native="fn" @click="fn1"></my-component>')

// console.log('r1.render', r1.render) // {on:{click}}
// console.log('r2.render', r2.render)// {nativeOn:{click},on:{click}}

const ele = compiler.compile('<input type="checkbox" v-model="value" />');

console.log("ele.render", ele.render);

with (this) {
  return _c("input", {
    directives: [
      { name: "model", rawName: "v-model", value: value, expression: "value" },
    ],
    attrs: { type: "checkbox" },
    domProps: { checked: Array.isArray(value) ? _i(value, null) > -1 : value },
    on: {
      change: function($event) {
        var $$a = value,
          $$el = $event.target,
          $$c = $$el.checked ? true : false;
        if (Array.isArray($$a)) {
          var $$v = null,
            $$i = _i($$a, $$v);
          if ($$el.checked) {
            $$i < 0 && (value = $$a.concat([$$v]));
          } else {
            $$i > -1 && (value = $$a.slice(0, $$i).concat($$a.slice($$i + 1)));
          }
        } else {
          value = $$c;
        }
      },
    },
  });
}
