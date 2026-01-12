import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ProjectView from '../views/ProjectView.vue'
import ResultView from '../views/ResultView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    return { top: 0, behavior: 'smooth' }
  },
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/project',
      name: 'project',
      component: ProjectView
    },
    {
      path: '/resultaat',
      name: 'resultaat',
      component: ResultView
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/tools',
      name: 'tools',
      component: () => import('../views/ToolsHomeView.vue')
    },
    {
      path: '/tools/10-10-10',
      name: 'tententen',
      component: () => import('../views/TenTenTenView.vue')
    },
    {
      path: '/tools/regret',
      name: 'regret',
      component: () => import('../views/RegretView.vue')
    },
    {
      path: '/tools/pmi',
      name: 'pmi',
      component: () => import('../views/PmiView.vue')
    }
  ]
})

export default router
