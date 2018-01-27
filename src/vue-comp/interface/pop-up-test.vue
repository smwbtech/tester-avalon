<template lang="html">

    <div class="pop-up" @click="closeWindow">
        <div>
                <div class="pop-up-window" @click.stop>
                    <div class="pop-up-controls">
                        <button class="pop-up-controls__publish" v-if="!testStatus" type="button" name="button" title="опубликовать" @click="publish"></button>
                        <button class="pop-up-controls__edit" v-if="!testStatus" type="button" name="button" title="редактировать" @click="edit"></button>
                        <button class="pop-up-controls__delete" type="button" name="button" title="удалить" @click="deleteTest"></button>


                    </div>

                    <div class="pop-up-general">
                        <p v-if="testStatus == 1" class="link">Ссылка на тест: {{testLink}}</p>
                        <h2>{{testTitle}}</h2>
                        <p>{{testDescription}}</p>
                        <img :src="testImage" alt="">
                    </div>

                    <question-item
                    v-for="question in questions"
                    :key="question.question_id"
                    :qsttitle="question.question_description"
                    :vars="question.vars"
                    :answer="question.question_answer"
                    :qsttype="question.question_type_id"
                    :useranswer="question.user_answer"
                    :checkstatus="question.check_status"
                    >

                </question-item>

            </div>
        </div>
    </div>

</template>

<script>

import questionItem from './pop-up-question.vue';
import axios from './../../../node_modules/axios/dist/axios.js';

export default {

    props: [
        'testtite',
        'description',
        'imglink',
        'anonym',
        'time',
        'status',
        'testquestions',
        'testid'
    ],

    components: {
        'question-item': questionItem
    },

    data() {
        return {
            testTitle: this.testtite,
            testDescription: this.description,
            testImage: this.imglink ? this.imglink : 'img/default_test.svg',
            testStatus: +this.status ? true : false,
            testId: this.testid,
            testLink: window.location.origin + '/exec?' + encodeURIComponent(btoa('test_id=' + (+this.testid))), //кодируем запрос в формат base64
            testOptions: {
                timeLimit: +this.time !== 0 ? true : false,
                time: +this.time,
                anonym: +this.status ? true : false
            },
            questions: this.testquestions
        }
    },

    methods: {
        closeWindow() {
            // console.log(this.testId);
            this.$emit('close-window');
        },
        edit() {
            this.$emit('edit-test', this.testId);
        },
        //Удаляем тест
        deleteTest() {

            if(window.confirm('Вы точто хотите удалить тест?')) {
                let query = this.testId;
                axios.get(`php/deletetest.php?test_id=${query}`)
                .then( (res) => {
                    if(res.data.status) {
                        let msg = 'Тест успешно удален из базы данных';
                        this.$emit('delete-test', 3, msg);
                        this.closeWindow();
                    }
                    else {
                        let msg = 'Ошибка базы данных, попробуйте позже';
                        this.$emit('delete-test', 3, msg);
                        this.closeWindow();
                    }
                })
                .catch( (err) => console.log(err));
            }
        },

        //Публикуем тест
        publish() {
            let query = this.testId;
            axios.get(`php/changeteststatus.php?test_id=${query}`)
            .then( (res) => {
                if(res.data.status) {
                    let msg = 'Тест успешно опубликован';
                    this.$emit('update-test', 3, msg);
                    this.closeWindow();
                }
                else {
                    let msg = 'Ошибка базы данных, попробуйте позже';
                    this.$emit('update-test', 3, msg);
                    this.closeWindow();
                }
            })
            .catch( (err) => console.log(err));
        }

    },

    created () {
        document.body.style.overflow = 'hidden';
    },

    destroyed () {
        document.body.style.overflow = 'auto';
    }

}
</script>

<style lang="css">

    @import './../../css/variables.css';

    .pop-up {
        z-index: 105;
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.8);
        /* padding-top: calc(var(--row) * 2);
        padding-bottom: calc(var(--row) * 2); */
        overflow-y: scroll;
    }

    .pop-up > div {
        overflow-y: scroll;
    }

    .pop-up-controls {
        position: fixed;
        display: flex;
        flex-wrap: wrap;
        max-width: 50px;
        top: 0;
        left: calc(25% - 60px);
        background-color: #fff;
    }

    .pop-up-controls button {
        display: block;
        cursor: pointer;
        width: 50px;
        height: 50px;
        border: none;
        margin: 10px 5px;
        background-color: #fff;
        background-repeat: no-repeat;
        background-position: center;
        opacity: .5;
        -webkit-transition: opacity .3s ease-in-out;
        -o-transition: opacity .3s ease-in-out;
        transition: opacity .3s ease-in-out;
    }

    .pop-up-controls button:hover {
        opacity: 1;
    }

    .pop-up-controls__publish {
        background-image: url('./../../img/success.svg');
    }

    .pop-up-controls__edit {
        background-image: url('./../../img/edit.svg');
    }

    .pop-up-controls__delete {
        background-image: url('./../../img/dustbin.svg');
    }


    .pop-up-window {
        width: 50%;
        background-color: #fff;
        margin: 0 auto;
        padding: 40px;
        position: relative;
    }

    .pop-up-general {
        text-align: center;
        color: var(--blue);
        padding-top: calc(var(--column) * 2);
    }

    .pop-up-window img {
        display: block;
        margin: 0 auto;
        margin-bottom: 40px;
        max-height: 300px;
    }

    .link {
        position: absolute;
        background-color: var(--purple);
        color: #fff;
        margin: 0;
        padding: 23px;
        left: 0;
        top: 0;
    }

    @media screen and (max-width: 812px) {

        .pop-up {
            z-index: 111;
        }

        .pop-up-window {
            width: 80%;
            padding: 10px;
        }

        .pop-up-window h2 {
            font-size: 1.2rem;
        }

        .pop-up-window h3 {
            font-size: 1rem;
        }

        .pop-up-general {
            padding-top: calc(var(--row-mobile) * 6);
        }

        .pop-up-controls {
            top: 90%;
            left: 10%;
            z-index: 111;
            min-width: 80%;
            max-width: 0;
            height: 10%;
            background-color: #fff;
            box-shadow: 0px -2px 4px rgba(0,0,0,.1);
            z-index: 112;
            justify-content: center;
        }

        .pop-up-controls button {
            width: 30px;
            height: 30px;
        }
    }

</style>
