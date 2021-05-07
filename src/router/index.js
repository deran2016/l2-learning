import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '../store/index';

Vue.use(VueRouter);

const routes = [
  {
    path: '/404',
    name: '404',
    component: () => import('../views/404.vue'),
  },
  {
    path: '/:preset/',
    name: 'Intro',
    component: () => import('../views/Intro.vue'),
  },
  {
    path: '/:preset/terms',
    name: 'terms',
    component: () => import('../views/Terms.vue'),
  },
  {
    path: '/:preset/explanation',
    name: 'explanation',
    component: () => import('../views/Explanation.vue'),
  },
  {
    path: '/:preset/pre',
    name: 'pre',
    component: () => import('../views/PreExperiment.vue'),
  },
  {
    path: '/:preset/ex',
    name: 'ex',
    component: () => import('../views/Experiment.vue'),
  },
  {
    path: '/:preset/test',
    name: 'test',
    component: () => import('../views/Test.vue'),
  },
  {
    path: '/:preset/submit',
    name: 'submit',
    component: () => import('../views/Submit.vue'),
  },

  { path: '*', redirect: '/404', hidden: true },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.params.preset) {
    const { preset } = to.params;

    switch (preset) {
      case '1':
        console.log('남_원어민');
        store.state.data.experimentType = '원어민';
        store.state.data.participantSex = '남';
        next();
        break;
      case '2':
        console.log('여_원어민');
        store.state.data.experimentType = '원어민';
        store.state.data.participantSex = '여';
        next();
        break;
      case '3':
        console.log('남_내목소리');
        store.state.data.experimentType = '내목소리';
        store.state.data.participantSex = '남';
        next();
        break;
      case '4':
        console.log('여_내목소리');
        store.state.data.experimentType = '내목소리';
        store.state.data.participantSex = '여';
        next();
        break;
      case '5':
        console.log('남_다른사람');
        store.state.data.experimentType = '다른사람';
        store.state.data.participantSex = '남';
        next();
        break;
      case '6':
        console.log('여_다른사람');
        store.state.data.experimentType = '다른사람';
        store.state.data.participantSex = '여';
        next();
        break;
      default:
        console.log('wrong preset');
        next({ name: '404' });
        // store.state.data.experimentType = 'no';
        // next();
    }
  }
  next();
});

export default router;
