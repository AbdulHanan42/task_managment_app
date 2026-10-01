import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import LoginView from '../views/auth/LoginView.vue'
import RegisterView from '../views/auth/RegisterView.vue'
import DashboardView from '../views/dashboard/DashboardView.vue'
import TaskListView from '../views/tasks/TaskListView.vue'
import TaskEditorView from '../views/tasks/TaskEditorView.vue'
import TaskDetailsView from '../views/tasks/TaskDetailsView.vue'
import ProfileView from '../views/profile/ProfileView.vue'
import ErrorView from '../views/errors/ErrorView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/dashboard' },
    { path: '/login', name: 'login', component: LoginView, meta: { layout: 'auth' } },
    { path: '/register', name: 'register', component: RegisterView, meta: { layout: 'auth' } },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
      meta: { requiresAuth: true, title: 'Overview' },
    },
    {
      path: '/tasks',
      name: 'tasks',
      component: TaskListView,
      meta: { requiresAuth: true, title: 'Tasks' },
    },
    {
      path: '/tasks/create',
      name: 'task-create',
      component: TaskEditorView,
      meta: { requiresAuth: true, title: 'New task' },
    },
    {
      path: '/tasks/:id',
      name: 'task-details',
      component: TaskDetailsView,
      meta: { requiresAuth: true, title: 'Task details' },
    },
    {
      path: '/tasks/:id/edit',
      name: 'task-edit',
      component: TaskEditorView,
      meta: { requiresAuth: true, title: 'Edit task' },
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView,
      meta: { requiresAuth: true, title: 'Profile' },
    },
    {
      path: '/401',
      name: 'unauthorized',
      component: ErrorView,
      props: { code: '401' },
      meta: { layout: 'plain' },
    },
    {
      path: '/403',
      name: 'forbidden',
      component: ErrorView,
      props: { code: '403' },
      meta: { layout: 'plain' },
    },
    {
      path: '/404',
      name: 'not-found',
      component: ErrorView,
      props: { code: '404' },
      meta: { layout: 'plain' },
    },
    { path: '/:pathMatch(.*)*', redirect: '/404' },
  ],
})

router.beforeEach(async (to) => {
  const auth = useAuthStore()
  if (auth.token && !auth.initialized) {
    try {
      await auth.getCurrentUser()
    } catch {
      if (to.meta.requiresAuth) return { name: 'login', query: { next: to.fullPath } }
    }
  }
  if (to.meta.requiresAuth && !auth.isAuthenticated)
    return { name: 'login', query: { next: to.fullPath } }
  if (to.meta.layout === 'auth' && auth.isAuthenticated) return { name: 'dashboard' }
})

export default router
