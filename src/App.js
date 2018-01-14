import variables from './css/variables.css';
import css from './css/style.css';
import Vue from './../node_modules/vue/dist/vue.js';
import Router from './../node_modules/vue-router/dist/vue-router.js';
import Auth from './js/auth.js';

// компоненты

import auth from './vue-comp/auth.vue';
import tester from './vue-comp/tester.vue';


// Маршруты

Vue.use(Router);

const router = new Router({
    routes: [

        {
            path: '/',
            component: tester,
            meta: {
                requiredAuth: true
            }
        },

        {
            path: '/auth',
            component: auth
        },

        {
            path: '/tester',
            component: tester,
            meta: {
                requiredAuth: true
            }
        },

    ],

    mode: 'history'

});

router.beforeEach((to, from, next) => {
    if (to.meta.requiredAuth) {
        console.log(Auth.checkUser());
        if (!Auth.checkUser()) {
            console.log(to.path)
            console.log(Auth.checkUser());
            router.push('/auth')
        }
        else {
            next()
        }
  }
    else {
        next()
    }
});


let app = new Vue({
    router,

    data: {
        user: {
            authinticate: false
        }
    },

    components: {
        'auth': auth,
        'tester': tester
    },

    methods: {
        //Событие успешной авторизации или регистрации
        loginHandler() {
            console.log('вот тут должна сработать переадресация');
            this.authinticate = true;
            // DELETE
            localStorage.setItem('tester_token', true);
            // DELETEEND
            router.push({path: '/tester'});
        }
    }
}).$mount('#app');
