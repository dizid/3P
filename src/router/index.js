import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/AuthStore'
import { useSubscriptionStore } from '@/stores/SubscriptionStore'

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
      name: 'landing',
      component: () => import('../views/LandingView.vue')
    },
    // Legacy redirects for old 3P's routes
    {
      path: '/project',
      redirect: '/tools/3ps'
    },
    {
      path: '/resultaat',
      redirect: '/tools/3ps'
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
    },
    {
      path: '/tools/swot',
      name: 'swot',
      component: () => import('../views/SwotView.vue')
    },
    {
      path: '/tools/opportunity-cost',
      name: 'opportunity-cost',
      component: () => import('../views/OpportunityCostView.vue')
    },
    {
      path: '/tools/coin-flip',
      name: 'coin-flip',
      component: () => import('../views/CoinFlipView.vue')
    },
    {
      path: '/tools/fear-regret',
      name: 'fear-regret',
      component: () => import('../views/FearRegretView.vue')
    },
    {
      path: '/tools/3ps',
      name: 'threeps',
      component: () => import('../views/ThreePsView.vue')
    },
    {
      path: '/history',
      name: 'history',
      component: () => import('../views/HistoryView.vue')
    },
    {
      path: '/compare',
      name: 'compare',
      component: () => import('../views/CompareView.vue')
    },
    {
      path: '/insights',
      name: 'insights',
      component: () => import('../views/InsightsView.vue'),
      meta: { requiresPro: true }
    },
    {
      path: '/help',
      name: 'help',
      component: () => import('../views/HelpView.vue')
    },
    {
      path: '/pricing',
      name: 'pricing',
      component: () => import('../views/PricingView.vue')
    },
    {
      path: '/success',
      name: 'success',
      component: () => import('../views/SuccessView.vue')
    },
    {
      path: '/shared/:token',
      name: 'shared',
      component: () => import('../views/SharedDecisionView.vue')
    },
    {
      path: '/auth/verify',
      name: 'auth-verify',
      component: () => import('../views/AuthVerifyView.vue')
    }
  ]
})

// Route guard for Pro-only routes
router.beforeEach((to) => {
  if (to.meta.requiresPro) {
    const authStore = useAuthStore()
    const subStore = useSubscriptionStore()

    if (!authStore.isAuthenticated) {
      return { name: 'pricing', query: { reason: 'login-required' } }
    }
    if (!subStore.isPro) {
      return { name: 'pricing', query: { reason: 'upgrade-required' } }
    }
  }
})

export default router
