<template lang="html">

    <div class="tester-page">

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
                @edit-test="editTestHandler"
            >

            </pop-up>
        </transition>

            <nav class="new-test-nav">
                <ul>
                    <li>
                        <a
                            href="save"
                            @click.prevent="showPublished"
                        >Опубликованные</a>
                    </li>
                    <li>
                        <a
                            href="publish"
                            @click.prevent="showDrafts"
                        >Черновики</a>
                    </li>
                </ul>
            </nav>

            <div class="loading" v-if="loading">

                <loading-indicator></loading-indicator>

            </div>

            <div class="tests-list" v-else>

                    <test-item
                    v-if="currentSection"
                    v-for="test in tests.published"
                    :description = "test.test_description"
                    :testtitle="test.test_name"
                    :testid="test.test_id"
                    :key="test_id"
                    :imglink="test.test_img"
                    :status="test.test_status"
                    @show-test="showTestHandler"
                    ></test-item>

                    <test-item v-else
                    v-for="test in tests.drafts"
                    :description = "test.test_description"
                    :testtitle="test.test_name"
                    :testid="test.test_id"
                    :key="test_id"
                    :imglink="test.test_img"
                    :status="test.test_status"
                    @show-test="showTestHandler"
                    ></test-item>

                <div class="add-new-test">

                </div>



            </div>

        </section>

    </div>

</template>

<script>

import sideMenu from './side-menu.vue';
import newTest from './new-test.vue';
import loadingIndicator from './interface/loading.vue';
import testItem from './interface/test-item.vue';
import popUpElem from './interface/pop-up-test.vue';
import axios from './../../node_modules/axios/dist/axios.js';

export default {

    components: {
       'side-menu': sideMenu,
       'loading-indicator': loadingIndicator,
       'test-item': testItem,
       'pop-up': popUpElem
   },

   data() {
       return {
           loading: false,
           tests: null,
           currentSection: true,
           popUp: false,
           currentTest: null
       }
   },

   created() {
       this.fetchData();
   },

   methods: {
       // Получаем данные о тестах с сервера
       fetchData() {
           this.loading = true;
           axios.get('php/gettests.php')
           .then( (res) => {
               this.loading = false;
               this.tests = {};
               this.tests.published = [];
               this.tests.drafts = [];
               res.data.tests.forEach( (v) => {
                   v.test_status == 1 ? this.tests.published.push(v) : this.tests.drafts.push(v);
               });
               console.log(this.tests);

           })
           .catch( (err) => {
               this.loading = false;
               console.log(err);
           });
       },
       //Показываем опубликованные тесты
       showPublished() {
           this.currentSection = true;
       },

       // Показываем черновики
       showDrafts() {
           this.currentSection = false;
       },
       //Выводим всплывающее окно с полной информацией о тесте
       showTestHandler(id) {
           let query = `?test_id=${id}`;
           axios.get(`php/gettest.php${query}`)
           .then( (res) => {
               this.currentTest = res.data.test;
               this.popUp = true;
           })
           .catch( (err) => console.log(err));
       },
       //Закрываем всплывающее окно
       closePopUp() {
           this.popUp = false;
       },
       //Редактирование теста
       editTestHandler(id) {
            localStorage.setItem('test', JSON.stringify(this.currentTest));
            this.$router.push('/newtest');
       }
   }


}
</script>

<style lang="css">

.content {
    margin-left: calc(var(--column) * 2);
    margin-right: calc(var(--column) * 2);
    width: calc(var(--column) * 16);
}

.tester-page {
    width: 100%;
    padding-top: calc(var(--row) * 2);
    display: flex;
}

.content {
    /* margin-left: calc(var(--column) * 6); */
}

.tests-list {
    width: 100%;
    /* min-height: 100vh; */
    display: flex;
    justify-content: flex-start;
    align-items: center;
}

.tests-list > div:nth-child(3n+1) {
    margin-right: calc(var(--column) * 2);
}

.tests-list > div:nth-child(3n+3) {
    margin-left: calc(var(--column) * 2);
}

.add-new-test {
    width: calc(var(--column) * 4);
    max-height: calc(var(--row) * 4);
    min-height: calc(var(--row) * 4);
    -webkit-box-shadow: 3px 3px 8px var(--purple);
    box-shadow: 3px 3px 8px var(--purple);
    cursor: pointer;
    opacity: .2;
    background-image: url('./../img/add.svg');
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    -webkit-transition: opacity .3s ease-in-out;
    -o-transition: opacity .3s ease-in-out;
    transition: opacity .3s ease-in-out;
}

.add-new-test:hover {
    opacity: 1;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}

</style>
