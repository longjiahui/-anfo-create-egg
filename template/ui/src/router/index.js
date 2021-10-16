import { createRouter, createWebHistory } from 'vue-router'
import DefaultLayout from '../layout/default.vue'

const routes = [{
	path: '/',
	component: DefaultLayout,
}]

const router = createRouter({
  // history: createWebHistory(process.env.BASE_URL),
  history: createWebHistory(),
  routes
})

export default router
