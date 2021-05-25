import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'

Vue.use(VueRouter)
const routes = [
  {
    path: '/',
    component: Login
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
  // ---------------------------------管理员页面-----------------------------------------------
  {
    path: '/Manager/home',
    name: 'Manager-Home',
    component: () => import('../views/manager/Home.vue')//管理员主页
  },
  {
    path: '/manager/addPerson',
    name: 'Manager-AddPerson',
    component: () => import('../views/manager/AddPerson.vue')//添加个人
  },
  {
    path: '/manager/editPerson',
    name: 'Manager-EditPerson',
    component: () => import('../views/manager/EditPerson.vue')//编辑个人
  },
  {
    path: '/manager/stockManage',
    name: 'Manager-StockManage',
    component: () => import('../views/manager/StockManage.vue')//库存管理 资源列表
  },
  {
    path: '/manager/addResources',
    name: 'Manager-AddResources',
    component: () => import('../views/manager/AddResources.vue')//添加资源
  },
  {
    path: '/manager/inStock',
    name: 'Manager-InStock',
    component: () => import('../views/manager/InStock.vue')//入库
  },
  {
    path: '/manager/stockPaper',
    name: 'Manager-StockPaper',
    component: () => import('../views/manager/StockPaper.vue')//单据
  },
  {
    path: '/manager/labManage',
    name: 'Manager-LabManage',
    component: () => import('../views/manager/LabManage.vue')//实验室管理页面
  },
  {
    path: '/manager/addLab',
    name: 'Manager-AddLab',
    component: () => import('../views/manager/AddLab.vue')//新增实验室页面
  },
  {
    path: '/manager/editLab',
    name: 'Manager-EditLab',
    component: () => import('../views/manager/EditLab.vue')//编辑实验室页面
  },
  // ---------------------------------老师页面-----------------------------------------------
  {
    path: '/teacher/home',
    name: 'Teacher-Home',
    component: () => import('../views/teacher/Home.vue')//老师主页
  },
  {
    path: '/teacher/experiment',
    name: 'Teacher-Experiment',
    component: () => import('../views/teacher/Experiment.vue')//实验列表页
  },
  {
    path: '/teacher/addExperiment',
    name: 'Teacher-AddExperiment',
    component: () => import('../views/teacher/AddExperiment.vue')//添加试验页
  },
  {
    path: '/teacher/applyLabResources',
    name: 'Teacher-ApplyLabResources',
    component: () => import('../views/teacher/ApplyLabResources.vue')//申请实验资源
  },
  {
    path: '/teacher/achievement',
    name: 'Teacher-Achievement',
    component: () => import('../views/teacher/Achievement.vue')//添加成果
  },
  {
    path: '/teacher/achievementManage',
    name: 'Teacher-AchievementManage',
    component: () => import('../views/teacher/AchievementManage.vue')//成果管理
  },
  {
    path: '/teacher/showAchievement',
    name: 'Teacher-ShowAchievement',
    component: () => import('../views/teacher/ShowAchievement.vue')//查看管理
  },
  // ---------------------------------学生页面-----------------------------------------------
  {
    path: '/student/home',
    name: 'Student-Home',
    component: () => import('../views/student/Home.vue')//学生主页
  },
  {
    path: '/student/showLab',
    name: 'Student-ShowLab',
    component: () => import('../views/student/ShowLab.vue')//已选择的实验
  },
  {
    path: '/student/achievement',
    name: 'Student-Achievement',
    component: () => import('../views/student/Achievement.vue')//提交实验报告
  }
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

export default router
