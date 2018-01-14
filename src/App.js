import variables from './css/variables.css';
import css from './css/style.css';
import Vue from './../node_modules/vue/dist/vue.js';
import Router from './../node_modules/vue-router/dist/vue-router.js';
import Auth from './js/auth.js';

// компоненты

import login from './vue-comp/login.vue';
import tester from './vue-comp/tester.vue';
import newTest from './vue-comp/new-test.vue';



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
            component: login
        },

        {
            path: '/tester',
            component: tester,
            meta: {
                requiredAuth: true
            }
        },

        {
            path: '/newtest',
            component: newTest,
            meta: {
                requiredAuth: true
            }
        },

    ],

    mode: 'history'

});

router.beforeEach((to, from, next) => {
    if (to.meta.requiredAuth) {
        Auth.checkUser()
        .then( (res) => {
            console.log(res);
            if (!res) {
                router.push('/auth')
            }
            else {
                next()
            }
        });
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
        'login': login,
        'tester': tester,
        'new-test': newTest
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
