import { createRouter, createWebHistory } from 'vue-router'
import { h } from 'vue'
import { RouterView } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import StoreFinderView from '../views/StoreFinderView.vue'
import store from '../store'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/:lang?',
      name: 'root',
      redirect: to => {
        // Default to 'sv_se' if no language specified
        const lang = to.params.lang || 'sv_se';
        return { path: `/${lang}/stores` };
      }
    },
    {
      path: '/',
      redirect: '/sv_se'
    },
    {
      path: '/:lang',
      component: {
        render() {
          return h(RouterView);
        }
      },
      children: [
        {
          path: '',
          name: 'home',
          component: HomeView,
        },
        {
          path: 'about',
          name: 'about',
          component: () => import('../views/AboutView.vue'),
        },
        {
          path: 'stores',
          name: 'store-finder',
          component: StoreFinderView
        },
      ]
    }
  ],
})

// Update store language when route changes but avoid duplicate reloads
router.beforeEach((to, from, next) => {
  const lang = to.params.lang;
  
  // Only dispatch changeLanguage if this navigation wasn't triggered by the LanguageSelector
  // (which already dispatched changeLanguage)
  if (lang && store.state.currentLanguage !== lang && 
      from.fullPath !== from.fullPath.replace(`/${from.params.lang}/`, `/${lang}/`)) {
    store.dispatch('changeLanguage', lang);
  }
  
  next();
});

export default router
