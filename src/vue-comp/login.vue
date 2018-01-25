<template lang="html">
    <div class="auth-page">

        <div class="forms">

            <div class="forms-nav">

                <a
                    href="/auth"
                    :class="[activeTab == 'auth' ? '' : 'from-nav__link_inactive']"
                    @click.prevent="changeTab"
                >
                Авторизация
                </a>

                <span>/</span>

                <a
                    href="/reg"
                    :class="[activeTab == 'reg' ? '' : 'from-nav__link_inactive']"
                    @click.prevent="changeTab"
                >
                Регистрация
                </a>

            </div>

            <form
                :class="authForm"
                @submit.prevent="authorize"
            >

                <input type="text" name="user_email_login" id="user_email_login" value="" placeholder="Email" v-model="loginFormData.userEmail" required>
                <input type="password" name="user_password_login" id="user_password_login" value="" placeholder="Пароль" v-model="loginFormData.userPassword" required>
                <input type="submit" name="Enter" value="Войти">

                <p :class="loginErrClass">{{loginFormErr}}</p>

            </form>

            <form
                :class="regForm"
                @submit.prevent="registration"
            >

                <input type="text" name="user_email" id="user_email" value="" placeholder="Email" v-model="regFormData.userEmail" required>
                <input type="password" name="user_password" id="user_password" value="" placeholder="Пароль" v-model="regFormData.userPassword" required>
                <input type="password" name="user_password_re" id="user_password_re" value="" placeholder="Повторите пароль" v-model="regFormData.userPassword_re" required>
                <input type="text" name="user_name" id="user_name" value="" placeholder="Имя" v-model="regFormData.userName">
                <input type="text" name="user_last_name" id="user_last_name" value="" placeholder="Фамилия" v-model="regFormData.userLastName">
                <input type="text" name="user_company" id="user_company" value="" placeholder="Компания" v-model="regFormData.userComapny">
                <input type="submit" name="Enter" value="Регистрация">

                <p :class="regErrClass">{{regFormErr}}</p>

            </form>

        </div>

        <div class="info">
            <h1>Добро пожаловать в Tester</h1>
            <p>Tester – это удобная платформа для быстрого создания опроса или тестирования. Вы можете быстро создать свой тест через веб-интерфейс и посмотреть статистику ответов. Гибкая настройка вопросов, возможность ограничить тестирование по времени. </p>
            <ul>
                <li>Гибкая настройка вопросов</li>
                <li>Общая статистика по каждому тесту</li>
                <li>Возможность ограничить тестирование по времени</li>
            </ul>
        </div>

    </div>




</template>

<script>

import variables from './../css/variables.css';
import Registration from './../js/reg.js';
import axios from './../../node_modules/axios/dist/axios.js';


export default {

    data() {
        return {
            // Активный таб
            activeTab: 'auth',

            // Ошибки формы авторизации
            loginFormErr: '',

            // Ошибки формы регистрации
            regFormErr: '',

            // Данные авторизации
            loginFormData: {
                userEmail: '',
                userPassword: ''
            },

            // Данные регистрации
            regFormData: {
                userEmail: '',
                userPassword: '',
                userPassword_re: '',
                userName: '',
                userLastName: '',
                userCompany: ''
            }
        }

    },

    computed: {
        // Объект класса формы авторизации
        authForm() {
            return {
                'auth-form': true,
                'auth-form_inactive': this.activeTab === 'reg'
            }
        },

        // Объект класса формы регистрации
        regForm() {
            return {
                'reg-form': true,
                'reg-form_inactive': this.activeTab === 'auth'
            }
        },

        loginErrClass() {
            return {
                'log-form__flashmsg': true,
                'log-form__flashmsg_inactive': this.regFormErr.length === 0
            }
        },

        // Объект класса поля ошибок формы регистрации
        regErrClass() {
            return {
                'reg-form__flashmsg': true,
                'reg-form__flashmsg_inactive': this.regFormErr.length === 0
            }
        }

    },

    methods: {
        // Обработчик события переключения табов Авторизация/Регистрация
        changeTab(e) {
            this.activeTab = e.target.getAttribute('href').slice(1);
            e.target.classList.contains
        },

        // Обработчик события авторизации пользователя
        authorize(e) {

            axios.post('php/auth.php',this.loginFormData)
            .then( (res) => {
                if(!res.data.success) {
                    console.log(res);
                    throw new Error(res.data.errorMsg);
                }
                else {
                    let query = localStorage.getItem('query');
                    localStorage.setItem('user_email', res.data.email);
                    console.log(res.data);
                    !query ? this.$router.push({path: '/tester'}) : window.location.href = window.location.origin + '/exec?' + query;
                }
            })
            .catch( (err) => {
                console.log(err);
                this.loginFormErr = err.message;
                setTimeout( () => this.regFormErr = '', 4000);
            });
        },

        // Обработчик события регистрации пользователя
        registration(e) {
            let res = Registration.checkData(this.regFormData);
            if(!res.success) {
                this.regFormErr = res.errorMsg;
                setTimeout( () => this.regFormErr = '', 4000);
            }
            else {
                axios.post('php/reg.php', this.regFormData)
                .then( (res) => {
                    console.log(res);
                    if(!res.data.success) {
                        throw new Error(res.data.errorMsg);
                    }
                    else {
                        let query = localStorage.getItem('query');
                        localStorage.setItem('user_email', res.data.email);
                        console.log(res.data);
                        !query ? this.$router.push({path: '/tester'}) : window.location.href = window.location.origin + '/exec?' + query;
                    }
                })
                .catch( (err) => {
                    console.log(err);
                    this.regFormErr = err.message;
                });
            }
        }
    },

    beforeRouteLeave(to, from, next) {
        localStorage.getItem('query') ? localStorage.removeItem('query') : false;
        next();
    }

}
</script>

<style lang="css">

    @import './../css/variables.css';

    .auth-page {
        width: 100%;
        height: 100vh;
        display: flex;
        font-weight: bold;

    }

    .forms,
    .info {
        width: 50%;
        padding-top: 15%;
        padding-left: calc(var(--column) * 2);
        padding-right: calc(var(--column) * 2);
    }

    .info {
        background-color: var(--purple);
        color: #fff;
    }

    .forms-nav {
        text-align: center;
        height: 2rem;
    }

    .forms-nav a {
        color: var(--blue);
        font-size: 2rem;
        -webkit-transition: all .2s ease-in-out;
        -o-transition: all .2s ease-in-out;
        transition: all .2s ease-in-out;
    }


    .forms-nav a.from-nav__link_inactive {
        color: var(--blue);
        font-size: 1.4rem;
        opacity: 0.5;
    }

    .auth-form_inactive,
    .reg-form_inactive {
        display: none;
    }

    .auth-form,
    .reg-form {
        padding-top: 20px;
    }

    .auth-form input,
    .reg-form input {
        display: block;
        width: 50%;
        margin: 0 auto;
        margin-bottom: 10px;
        background: none;
        background-color: #fff;
        border: none;
        border-bottom: 1px solid var(--blue);
        text-align: center;
        -webkit-transition: width .2s ease-in-out;
        -o-transition: width .2s ease-in-out;
        transition: width .2s ease-in-out;
    }

    .auth-form input:focus,
    .reg-form input:focus {
        width: 60%;
    }

    .auth-form input[type="submit"],
    .reg-form input[type="submit"] {
        width: 30%;
        margin-top: 40px;
        padding: 10px;
        background-color: var(--blue);
        color: #fff;
        font-weight: bold;
    }

    .log-form__flashmsg,
    .reg-form__flashmsg {
        width: 50%;
        opacity: 1;
        margin: 0 auto;
        padding-top: 40px;
        font-size: .8rem;
        text-align: center;
        color: var(--red);
    }


</style>
