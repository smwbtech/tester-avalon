<template lang="html">

    <div class="respondents-page">

        <side-menu></side-menu>
        <section class="content">

            <transition name="fade">
              <pop-up
                  v-if="popUp"
                  :testtite="currentTest.test_name"
                  :description="currentTest.test_description"
                  :imglink="currentTest.test_image"
                  :anonym="currentTest.test_anonym"
                  :time="currentTest.test_time"
                  :status="currentTest.test_status"
                  :testquestions="currentTest.questions"
                  :testid="currentTest.test_id"
                  @close-window="closePopUp"
              >

              </pop-up>
          </transition>

            <div class="loading" v-if="loading">

                <loading-indicator></loading-indicator>

            </div>

            <div class="respondents-list">

                <div
                    class="resondents-test-item"
                    v-for="test in testsArr"
                    :key="test.test_id"
                >

                    <a class="resondents-test-item__show" @click.prevent="showListHandler" href="">список <img src="img/arrow-down.svg" alt=""></a>
                    <h2>{{test.test_name}}</h2>
                    <respondent-item
                        v-for="singleTry in test.tries"
                        :key="singleTry.test_answer_id"
                        :result="singleTry"
                        @show-info="showTryInfo"
                    >
                    </respondent-item>


                </div>

            </div>


        </section>

    </div>

</template>

<script>

import sideMenu from './side-menu.vue';
import loadingIndicator from './interface/loading.vue';
import respondentItem from './interface/respondent-item.vue';
import popUpElem from './interface/pop-up-test.vue';
import axios from './../../node_modules/axios/dist/axios.js';

export default {

    components: {
        'side-menu': sideMenu,
        'loading-indicator': loadingIndicator,
        'respondent-item': respondentItem,
        'pop-up': popUpElem
    },

    data() {
        return {
            loading: false,
            testsArr: null,
            currentTest: null,
            popUp: false
        }
    },

    methods: {
        fetchData() {
            this.loading = true;
            axios.get('php/getstats.php')
            .then( (res) => {
                console.log(res);
                this.loading = false;
                this.testsArr = res.data.tests;
                console.log(this.testsArr);

            })
            .catch( (err) => {
                this.loading = false;
                console.log(err);
            });
        },

        //Разворачиваем список респондентов
        showListHandler(e) {
            e.target.parentNode.classList.toggle('resondents-test-item__active');
            e.target.classList.toggle('active');
        },

        //Показываем всплывающее окно с подробностями о результатах пользователя
        showTryInfo(id, answers){
            console.log(id);
            console.log(answers);
            axios.get(`php/gettest.php?test_id=${id}`)
            .then( (res) => {
                this.currentTest = res.data.test;
                this.popUp = true;
                console.log(this.currentTest);
            })
            .catch( (err) => console.log(err));
        },

        //Закрываем всплывающее окно
        closePopUp() {
            this.popUp = false;
        }

    },

    created() {
        this.fetchData();
    }

}
</script>

<style lang="css">

@import './../css/variables.css';

    .content {
        margin-left: calc(var(--column) * 2);
        margin-right: calc(var(--column) * 2);
        width: calc(var(--column) * 16);
    }

    .respondents-page {
        width: 100%;
        padding-top: calc(var(--row) * 2);
        display: flex;
        background-color: var(--background);
    }

    .respondents-list {
        width: 100%;
        display: flex;
        flex-flow: column;
        justify-content: center;
    }

    .resondents-test-item {
        max-height: calc(var(--row) * 4);
        overflow: hidden;
        position: relative;
        margin-bottom: 40px;
        padding: 20px;
        -webkit-box-shadow: 1px 1px 4px rgba(0,0,0,0.1);
        box-shadow: 1px 1px 4px rgba(0,0,0,0.1);
        cursor: pointer;
        background-color: #fff;
        -webkit-transition: all 1s ease-in-out;
        -o-transition: all 1s ease-in-out;
        transition: all 1s ease-in-out;
    }

    .resondents-test-item__active {
        max-height: 10000px;
        /* height: auto; */
    }

    .resondents-test-item__active.resondents-test-item__active:after {
        opacity: 0;
        visibility: hidden;
        top: 120%;
    }

    .resondents-test-item h2 {
        margin-bottom: 20px;
        color: var(--blue);
    }

    .resondents-test-item:after {
        display: block;
        position: absolute;
        content: '';
        width: 100%;
        height: 100px;
        top: calc(var(--row) * 4 - 100px);
        background-image: linear-gradient(to top, #fff, rgba(255,255,255,0.6));
        -webkit-transition: all .8s ease-in-out;
        -o-transition: all .8s ease-in-out;
        transition: all .8s ease-in-out;
    }

    .resondents-test-item__show {
        color: var(--purple);
        font-size: .9rem;
        font-weight: bold;
        position: absolute;
        padding-left: 30px;
        right: 20px;
        top: 20px;
    }

    .resondents-test-item__show.active img{
        transform: rotate(180deg);
    }

    .resondents-test-item__show img {
        max-width: 20px;
        position: absolute;
        top: 2px;
        left: 0;
        transform: rotate(0deg);
        -webkit-transition: all .5s ease-in-out;
        -o-transition: all .5s ease-in-out;
        transition: all .5s ease-in-out;
    }

    .fade-enter-active, .fade-leave-active {
      transition: opacity .5s;
    }
    .fade-enter, .fade-leave-to {
      opacity: 0;
    }



</style>
