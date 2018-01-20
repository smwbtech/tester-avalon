<template lang="html">

    <div class="exec-page">

        <div v-if="!loaded">

            <loading></loading>

        </div>

        <div v-else>

            <test-menu
                :testname="test.test_name"
                :testdescription="test.test_description"
            >

            </test-menu>

            <section class="content">

                    <div v-if="!authorized" class="warning">
                        <loading></loading>
                        <p> Данный тест доступен только зарегистрированным пользователям. Сейчас вы будете перенаправленны на страницу авторизации и регистрации. После входа в систему вы автоматически вернетесь к прохождению теста</p>
                    </div>

                    <div v-else>

                        <h2>{{test.questions[userProgress.currentQstId].question_description}}</h2>
                        <p>{{questionDescr}}</p>
                        <variants
                            :type="currentQstType"
                            :questions="questions"
                            :currentqst="userProgress.currentQstId"
                        ></variants>

                        <ul class="test-nav">
                            <li
                                v-for="n in test.questions.length"
                                :id="'qst_'+n"
                                @click="changeQst"
                            >{{n}}</li>
                        </ul>



                    </div>

            </section>

        </div>

    </div>

</template>

<script>

import testMenu from './interface/test-menu.vue';
import loadingElem from './interface/loading.vue';
import variantsElem from './interface/variants.vue';
import axios from './../../node_modules/axios/dist/axios.js';
import Auth from './../js/auth.js';

export default {

    components: {
        'test-menu': testMenu,
        'loading': loadingElem,
        'variants': variantsElem
    },

    // Когда компонент создан, получаем тест, проверяем, аторизацию пользвателя
    created() {
        this.fetchData();
    },

    data() {
        return {

            test: null,
            questions: null,
            authorized: false,
            loaded: false,
            userProgress: {
                currentQstId: 0
            },
            currentQstType: 1
        }
    },

    computed: {

        //Описание вопроса в зависимости от типа
        questionDescr() {
            switch (+this.questions[this.userProgress.currentQstId].question_type_id) {
                case 1:
                    return 'Выберите один вариант ответа';
                    break;
                case 2:
                    return 'Выберите несколько вариантов';
                    break;
                case 3:
                    return 'Напишите вариант ответа';
                    break;
                default:

            }
        }
    },

    methods: {
        //Получаем данные с сервер, сверяем авторизацию пользователя и возможность анонимного прохождения
        fetchData() {
            let query = "?" + atob(window.location.search.slice(1));
            Auth.checkUser()
            .then( (res) => {
                let auth = res;
                axios.get(`php/getexectest.php${query}`)
                .then( (res) => {
                    console.log(res);
                    this.test = res.data.test;
                    this.questions = res.data.test.questions;
                    this.loaded = true;
                    console.log(this.questions);
                    if(!res.data.anonym && !auth) {
                        console.log('Просим авторизоваться');
                        this.authorized = false;
                        window.localStorage.setItem('query', window.location.search.slice(1));
                        setTimeout( () => {
                            this.$router.replace('/auth');
                        },8000)
                    }
                    else {
                        console.log('Показываем тест');
                        this.authorized = true;
                    }
                })
                .catch( (err) => console.log(err));

            })
            .catch( (err) => console.log(err));
        },

        //Навигация по вопросам
        changeQst(e) {
            this.userProgress.currentQstId = +e.target.id.slice(4) - 1;
            this.currentQstType = +this.test.questions[this.userProgress.currentQstId].question_type_id;
            console.log(this.currentQstType + ' - type');
            // console.log(this.variants);
        }
    },

    // Перед тем, как пользователь попадет на страницу, проверим, установлено ли id вопроса
    beforeRouteEnter (to, from, next) {

        let check = atob(window.location.search.slice(1)).slice(0,7);
        if(check == 'test_id') {
            next();
        }
        else {
            window.location.pathname = '/tester';
        }
    }

}

</script>

<style lang="css">

    .exec-page{
        width: 100%;
        display: flex;
    }

    .exec-page .content {
        margin-left: calc(var(--column) * 2);
        margin-right: calc(var(--column) * 2);
        width: calc(var(--column) * 16);
        display: flex;
    }

    .exec-page > div {
        display: flex;
    }

    .content > div {
        width: 100%;
    }


    .warning {
        align-self: center;
    }

</style>
