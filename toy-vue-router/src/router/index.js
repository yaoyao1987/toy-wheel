import Vue from 'vue'
import VueRouter from './lib'
import Home from '../views/Home.vue'
import About from '../views/About.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    component: About,
    children: [
      {
        path: 'a',
        component: {
          render(h) { return <h1>this is an about/a</h1> }
        }
      },
      {
        path: 'b',
        component: {
          render(h) { return <h1>this is an about/b</h1> }
        }
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
