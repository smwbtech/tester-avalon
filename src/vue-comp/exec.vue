<template lang="html">

    <div class="exec-page">

        <div v-if="!loaded">

            <loading></loading>

        </div>

        <div v-else>

            <test-menu
                :testname="test.test_name"
                :testdescription="test.test_description"
                @send-test="sendTestHander(false)"
            >

            </test-menu>

            <section class="content">

                <nav class="new-test-nav">
                    <ul class="test-info">
                        <li class="question">Вы ответили на <span>{{answers.length}}</span><span>/</span><span>{{questions.length}}</span></li>
                        <li class="time-limit" v-if="timeLimit"><img src="img/stopwatch.svg" alt="">{{timeLeft}}:00</li>
                    </ul>
                </nav>

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

                    <div class="mobile-nav">
                        <button class="back" @click="mobileNavQst(-1)"></button>
                        <button class="send" @click="sendTestHander(false)">Готово</button>
                        <button class="forward" @click="mobileNavQst(1)"></button>
                    </div>

                    <pop-up v-if="popUp"
                        :results="testResults"
                        :timestart="timeStart"
                    ></pop-up>

            </section>

        </div>

    </div>

</template>

<script>

import testMenu from './interface/test-menu.vue';
import loadingElem from './interface/loading.vue';
import variantsElem from './interface/variants.vue';
import popUpExec from './interface/pop-up-exec.vue';
import axios from './../../node_modules/axios/dist/axios.js';
import Auth from './../js/auth.js';

export default {

    components: {
        'test-menu': testMenu,
        'loading': loadingElem,
        'variants': variantsElem,
        'pop-up': popUpExec
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
            timeStart: 0,
            time: 60,
            timeLimit: false,
            timeLeft: 60,
            popUp: false,
            testResults: {}
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
            let query = "?" + atob(decodeURIComponent(window.location.search.slice(1)));
            Auth.checkUser()
            .then( (res) => {
                let auth = res;
                //Если тест уже есть в localStorage берем данные от туда, в противном случае, загружаем их с сервера
                axios.get(`php/getexectest.php${query}`)
                .then( (res) => {
                    console.log(res);
                    let date = new Date();
                    let testId = +query.slice(9);
                    let testData = JSON.parse(localStorage.getItem('current_test'));

                    // Устанавливани все параметры теста
                    this.test = res.data.test;
                    this.questions = res.data.test.questions;

                    this.timeStart = testData && +testData.test_db_id == testId? testData.time_start : date.getTime();
                    this.answers = testData && +testData.test_db_id == testId? testData.answers : [];
                    this.currentQstType = testData && +testData.test_db_id == testId? testData.currentQstType : +res.data.test.questions[0].question_type_id;
                    this.currentQstId = testData && +testData.test_db_id == testId? testData.currentQstId : 0;
                    this.loaded = true;

                    setTimeout( () => {
                        let id = this.currentQstId + 1;
                        let elem = document.getElementById(`qst_${id}`);
                        elem.click();
                    }, 0);

                    if(+res.data.test.test_anonym == 0 && !auth) {
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

                        // Если тест на время, то будет отсчитывать время
                        if(+res.data.test.test_time > 0) {
                            console.log('Это тест на время');
                            this.timeLimit = true;
                            this.time = res.data.test.test_time;
                            let date = new Date(this.timeStart);

                            //Проверка времени
                            let timeStart = date.getMinutes();
                            let interval = setInterval( () => {
                                let newDate = new Date();
                                let timeNow = newDate.getMinutes();
                                let timeDifference = timeNow - timeStart;
                                let minutes = new Date(timeDifference * 1000);
                                this.timeLeft = this.time - timeDifference;
                                if(this.timeLeft <= 0) {
                                    console.log('Время теста истекло, ваши данные отправлены на сервер');
                                    window.alert('Время теста истекло, ваши данные отправлены на сервер');
                                    this.sendTestHander(true);
                                    clearInterval(interval);
                                }

                            }, 1000);
                        }
                    }
                })
                .catch( (err) => console.log(err));

            })
            .catch( (err) => console.log(err));
        },

        //Навигация по вопросам
        changeQst(e) {
            let elemId = e.target.id;
            let children = e.target.parentElement.children;
            e.target.classList.contains('active') ? false : e.target.classList.add('active');
            for(let i = 0; i < children.length; i++) {
                if(children[i].id !== elemId) {
                    children[i].classList.contains('active') ? children[i].classList.remove('active') : false;
                }
            }
            this.userProgress.currentQstId = +e.target.id.slice(4) - 1;
            this.currentQstType = +this.test.questions[this.userProgress.currentQstId].question_type_id;
            this.saveLocalStorage();
            console.log(this.answers);
        },

        mobileNavQst(ind) {

            if(ind < 0) {
                let elem = document.querySelector('.active').previousSibling;
                if(elem) {
                    elem.click();
                }
            }
            else {
                let elem = document.querySelector('.active').nextSibling;
                if(elem) {
                    elem.click();
                }
            }
        },

        //Обновляем информацию ответов и сохраняем объект теста в localStorage
        updateAnswerHandler(answers) {
            this.answers = answers;
            this.saveLocalStorage();
        },

        saveLocalStorage() {
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
        sendTestHander(autoEnd) {
            localStorage.removeItem('current_test');
            let date = new Date();
            let test = {
                test_db_id: this.test.test_id,
                anonym:  this.test.test_anonym,
                token: this.token ? this.token : btoa(date.getTime()),
                answers: this.answers
            };
            console.log('test');
            console.log(test);
            // return test;
            if(!autoEnd && window.confirm('Вы готовы отправить ответы на проверку?')) {
                axios.post('php/saveexectest.php', test)
                .then( (res) => {
                    console.log(res);
                    this.testResults = res.data;
                    this.popUp = true;
                })
                .catch( (err) => {
                    console.log(err);
                });
            }
            else {
                axios.post('php/saveexectest.php', test)
                .then( (res) => {
                    console.log(res);
                    this.testResults = res.data;
                    this.popUp = true;
                })
                .catch( (err) => {
                    console.log(err);
                });
            }
        }
    },

    // Перед тем, как пользователь попадет на страницу, проверим, установлено ли id вопроса
    beforeRouteEnter (to, from, next) {
        let check = decodeURIComponent(window.location.search.slice(1));
        if(/test_id/.test(atob(check))) {
            next();
        }
        else {
            window.location.pathname = '/tester';
        }
    }

}

</script>

<style lang="css">

@import './../css/variables.css';

    .mobile-nav {
        display: none;
    }

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
        top: 9px;
        left: -41px;
    }

    .test-nav li:after {
        top: 9px;
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

    .test-info {
        max-width: 100%;
        padding-top: 20px;
        padding-right: 40px;
        display: flex;
        justify-content: flex-end;
        align-items: center;

    }

    .test-info li {
        display: block;
        position: relative;
        margin-left: 50px;
        font-size: 1.2rem;

    }

    .test-info li img {
        position: absolute;
        top: -10px;
        left: -5px;
    }

    .time-limit img {
        width: 40px;
    }

    .time-limit {
        padding-left: 0px;
    }
    .test-info .question {
        opacity: 1;
        color: var(--blue);
    }

    .test-info .question span:last-child {
        opacity: .5;
        color: var(--purple);
    }

    @media screen and (max-width: 812px) {

        .exec-page > div {
            width: 100%;
        }

        .exec-page .content {
            width: 100%;
            padding-top: calc(var(--row-mobile) * 3);
            margin: 0;
        }

        .exec-page .menu{
            display: none;
        }

        .new-test-nav {
            padding: 10px;
        }

        .test-info {
            width: 100%;
            padding-right: 0px;
            max-width: none;
            display: flex;
            justify-content: space-between;
        }

        .new-test-nav li:last-child {
            padding: 0px;
            font-size: .8rem;
        }

        .test-info li {
            margin: 0;
        }

        .test-info li img {
            max-width: 25px;
            left: -25px;
        }

        .test-info .question {
            width: 50%;
            font-size: .9rem;
        }

        .variants .variant-item label{
            font-size: .8rem;
        }

        .test-nav {
            opacity: 0;
            bottom: -100%;
        }

        .mobile-nav {
            position: fixed;
            bottom: 0;
            left: 0;
            padding-bottom: 10px;
            width: 100%;
            display: flex;
            justify-content: space-around;
        }

        .mobile-nav .forward,
        .mobile-nav .back {
            width: 30px;
            height: 30px;
            display: block;
            background-color: #fff;
            border: none;
        }

        .send {
            display: block;
        }



        .mobile-nav .back {

            background-image: url('./../img/arrow-right.svg');
        }

        .mobile-nav .forward {
            background-image: url('./../img/arrow-left.svg');
        }
    }


</style>
