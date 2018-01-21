<template lang="html">

    <div class="exec-page">

        <div v-if="!loaded">

            <loading></loading>

        </div>

        <div v-else>

            <test-menu
                :testname="test.test_name"
                :testdescription="test.test_description"
                @send-test="sendTestHander"
            >

            </test-menu>

            <section class="content">

                    <div v-if="!authorized" class="warning">
                        <loading></loading>
                        <p> Данный тест доступен только зарегистрированным пользователям. Сейчас вы будете перенаправленны на страницу авторизации и регистрации. После входа в систему вы автоматически вернетесь к прохождению теста</p>
                    </div>

                    <div v-else>

                        <h2 class="test-title">{{test.questions[userProgress.currentQstId].question_description}}</h2>
                        <p class="test-descr">{{questionDescr}}</p>
                        <variants
                            :type="currentQstType"
                            :questions="questions"
                            :answersarr="answers"
                            :currentqst="userProgress.currentQstId"
                            @update-answer="updateAnswerHandler"

                        ></variants>

                        <div class="test-nav">
                            <ul>
                                <li
                                v-for="n in test.questions.length"
                                :id="'qst_'+n"
                                :class="{active: n==1}"
                                @click="changeQst"
                                >{{n}}</li>
                            </ul>
                        </div>



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
            currentQstType: 1,
            answers: [],
            timeStart: 0
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
                let testId = +query.slice(9);
                let test = JSON.parse(localStorage.getItem('current_test'));
                //Если тест уже есть в localStorage берем данные от туда, в противном случае, загружаем их с сервера
                axios.get(`php/getexectest.php${query}`)
                .then( (res) => {
                    console.log(res);
                    let date = new Date();
                    this.test = res.data.test;
                    this.questions = res.data.test.questions;
                    this.timeStart = test && +test.test_db_id == testId? test.time_start : date.getTime();
                    this.answers = test && +test.test_db_id == testId? test.answers : [];
                    this.currentQstType = test && +test.test_db_id == testId? test.currentQstType : +res.data.test.questions[0].question_type_id;
                    this.currentQstId = test && +test.test_db_id == testId? test.currentQstId : 1;
                    this.loaded = true;
                    // console.log('Ответы')
                    // console.log(this.answers);
                    // console.log('Текущий вопрос')
                    // console.log(this.currentQstId);
                    setTimeout( () => {
                        var elem = document.getElementById(`qst_${this.currentQstId + 1}`);
                        elem.click();
                    }, 100);
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
            console.log(1);
            let elemId = e.target.id;
            let children = e.path[1].children;
            e.target.classList.contains('active') ? false : e.target.classList.add('active');
            for(let i = 0; i < children.length; i++) {
                if(children[i].id !== elemId) {
                    children[i].classList.contains('active') ? children[i].classList.remove('active') : false;
                }
            }
            this.userProgress.currentQstId = +e.target.id.slice(4) - 1;
            this.currentQstType = +this.test.questions[this.userProgress.currentQstId].question_type_id;
        },

        //Обновляем информацию ответов и сохраняем объект теста в localStorage
        updateAnswerHandler(answers) {
            this.answers = answers;
            let date = new Date();
            let test = {
                test_db_id: this.test.test_id,
                test: this.test,
                anonym:  this.test.test_anonym,
                token: this.test.token ? this.test.token : btoa(date.getTime()),
                answers: this.answers,
                time_start: this.timeStart,
                currentQstType: this.currentQstType,
                currentQstId: this.userProgress.currentQstId
            };

            localStorage.setItem('current_test', JSON.stringify(test));
        },

        // Отправляем тест
        sendTestHander() {
            if(window.confirm('Вы готовы отправить ответы на проверку?')) {
                console.log(this.answers);
                let date = new Date();
                let test = {
                    test_db_id: this.test.test_id,
                    anonym:  this.test.test_anonym,
                    token: btoa(date.getTime()),
                    answers: this.answers
                };
                axios.post('php/saveexectest.php', test)
                .then( (res) => {
                    console.log(res);
                })
                .catch( (err) => {
                    console.log(err);
                });
            }
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
        padding-top: calc(var(--row) * 2);
        color: var(--blue);
    }

    .test-title, .test-descr {
        text-align: center;
    }

    .test-title {
        position: relative;
    }

    .test-title:after {
        position: absolute;
        left: 30%;
        bottom: -10px;
        display: block;
        content: '';
        width: 40%;
        height: 3px;
        background-color: var(--purple);
    }


    .warning {
        align-self: center;
    }

    .test-nav {
        position: fixed;
        display: flex;
        padding-bottom: 40px;
        justify-content: center;
        width: calc(var(--column) * 20);
        z-index: 102;
        bottom: 0;
        right: 0;
        background-color: #fff;
    }

    .test-nav ul {
        position: relative;
        display: flex;
        justify-content: center;
        width: calc(var(--column) * 16);
        min-height: 0 20px;
        list-style: none;
        margin: 0 auto;
    }

    .test-nav li {
        position: relative;
        display: block;
        cursor: pointer;
        width: 20px;
        height: 20px;
        margin: 0px 20px;
        text-align: center;
        padding: 5px;
        border: 1px solid var(--purple);
        background-color: var(--purple);
        color: #fff;
        border-radius: 20px;
        -webkit-transition: all .3s ease-in-out;
        -o-transition: all .3s ease-in-out;
        transition: all .3s ease-in-out;
    }

    .test-nav li:before,
    .test-nav li:after {
        width: 40px;
        position: absolute;
        content: '';
        display: block;
        height: 3px;
        background-color: var(--purple);
    }

    .test-nav li:before {
        top: 14px;
        left: -41px;
    }

    .test-nav li:after {
        top: 14px;
        right: -41px;
    }

    .test-nav li:first-child {
        margin-left: 0;
    }

    .test-nav li:first-child:before {
        display: none;
    }

    .test-nav li:last-child {
        margin-right: 0;
    }

    .test-nav li:last-child:after {
        display: none;
    }

    .test-nav li.active {
        background-color: #fff;
        color: var(--purple);
    }

</style>
