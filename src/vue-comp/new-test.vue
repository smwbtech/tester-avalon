<template lang="html">

    <div class="newtest-page">

        <side-menu></side-menu>
        <section class="content">

            <nav class="new-test-nav">
                <ul>
                    <li>
                        <a
                            href="save"
                            @click.prevent="saveTest"
                        >Сохранить</a>
                    </li>
                    <li>
                        <a href="publish">Опубликовать</a>
                    </li>
                </ul>
            </nav>

            <form class="new-test-form">

                <input type="text" class="new-test-form__title" placeholder="Название теста">

                <div class="new-test-form__options">
                    <h3>Описание:</h3>
                    <textarea class="new-test-form__description" name="test_description"></textarea>

                    <div class="new-test-form__inputs">
                        <img :src="timeToggle" alt="">
                        <label for="time_limit" :class="labelTime">Лимит по времени</label>
                        <input type="checkbox" name="time_limit" id="time_limit" v-model="testOptions.timeLimit">
                        <transition name="fade">
                        <img src="img/stopwatch.svg" alt="" v-if="testOptions.timeLimit">
                        </transition>
                        <transition name="fade">
                        <label class="active" for="time" v-if="testOptions.timeLimit">Время в мин.:</label>
                        </transition>
                        <transition name="fade">
                        <input type="text" name="time" id="time" value="" v-if="testOptions.timeLimit">
                        </transition>
                        <img :src="anonymToggle" alt="">
                        <label for="anonym" :class="labelAnonym">Анонимное прохождение</label>
                        <input type="checkbox" name="anonym" id="anonym" v-model="testOptions.anonym">
                    </div>

                </div>

                <new-question
                    v-for="question in questions"
                    :key="question.id"
                    :questiontype="question.type"
                    :questiontext="question.text"
                    :questionid="question.id"
                    @delete-question="deleteQuestionHandler"
                ></new-question>

                <button
                    type="button"
                    name="button"
                    @click="addQuestion"
                    class="new-test__add-question"
                >
                добавить вопрос</button>

            </form>

        </section>

    </div>

</template>

<script>

import sideMenu from './side-menu.vue';
import newQuestion from './new-question.vue';

export default {

    components: {
       'side-menu': sideMenu,
       'new-question': newQuestion
   },

   data() {
       return {
           testTitle: '',
           testDescription: '',
           testOptions: {
               timeLimit: false,
               time: 60,
               anonym: false
           },
           questions: [
               {
                   type: 1,
                   text: 'Введите свое описание вопроса',
                   id: 1
               }
           ],
           nextQuestionId: 2
       }
   },

   computed: {
       // Объект класса переключателя ограничения по вреиени
       timeToggle() {
           return this.testOptions.timeLimit === false ? 'img/switch_left.svg' : 'img/switch_rigth.svg';
       },

       // Объект класса переключателя анонимного прохождения
       anonymToggle() {
           return this.testOptions.anonym === false ? 'img/switch_left.svg' : 'img/switch_rigth.svg';
       },

       labelTime() {
           return {
               'active': this.testOptions.timeLimit
           }
       },

       labelAnonym() {
           return {
               'active' : this.testOptions.anonym
           }
       }
   },

   methods: {
       // Добавление нового вопроса
       addQuestion() {
           this.questions.push( {
                type: 1,
                text: 'Введите свое описание вопроса',
                id: this.nextQuestionId
            });
            this.nextQuestionId++;
       },
       // Удаляем вопрос
       deleteQuestionHandler(id) {
           console.log('ded');
           let index = this.questions.map( (v,i) => {
               if(v.id === id) return i;
           });
           index.length > 1 ? index = index.filter( (v) => {if(typeof v == 'number') return v})[0] : index = index[0];
           this.questions.splice(index, 1);
       },
       // Сохраняем тест
       saveTest() {

       }

   }

}
</script>

<style lang="css">

    .newtest-page {
        /* margin-left: calc(var(--column) * 6); */

        display: flex;
    }

    .newtest-page .content {
        margin-left: calc(var(--column) * 2);
        margin-right: calc(var(--column) * 2);
        width: calc(var(--column) * 16);
    }

    .new-test-nav {
        z-index: 101;
        position: fixed;
        top: 0px;
        left: 0px;
        width: 100%;
        padding: 20px 0px;
        padding-left: calc(var(--column) * 6);
        background-color: #fff;
    }

    .new-test-nav li {
        list-style: none;
        display: inline-block;
        opacity: .5;
        -webkit-transition: opacity .2s ease-in-out;
        -o-transition: opacity .2s ease-in-out;
        transition: opacity .2s ease-in-out;
    }

    .new-test-nav li:hover {
        opacity: 1;
    }

    .new-test-nav li:last-child{
        padding-left: 40px;
    }

    .new-test-form {
        padding-top: calc(var(--column) * 2);
    }

    .new-test-form__title {
        display: block;
        width: 100%;
        border: none;
        border-bottom: 1px solid var(--blue);
        margin-bottom: 40px;
        font-family: 'marta';
        font-size: 3rem;
        color: var(--blue);
    }

    .new-test-form__options {
        background-color: #dddde8;
        padding: 20px;
    }

    .new-test-form__options h3 {
        padding: 0;
        margin: 0;
        margin-bottom: 20px;
        color: #8496b1;
    }

    .new-test-form__description {
        padding: 10px;
        background-color: #dddde8;
        border: none;
        margin-bottom: 20px;
        width: 98%;
        max-width: 98%;
        min-width: 98%;
        max-height: calc(var(--row) * 2);
        min-height: calc(var(--row) * 2);
        height: calc(var(--row) * 2);
        border: 1px solid var(--blue);
    }

    .new-test-form__options label {
        color: #8496b1;
    }

    .new-test-form__options label.active {
        color: var(--purple);
    }

    .new-test-form__inputs > * {
        display: inline-block;
    }

    .new-test-form__inputs img {
        max-width: 30px;
        margin-bottom: -10px;
        padding-left: 20px;
    }

    .new-test-form__inputs img:first-child {
        padding-left: 0px;
    }

    .new-test-form__inputs input[type="text"] {
        background-color: #dddde8;
        border: none;
        border-bottom: 1px solid var(--blue);
        width: 50px;
        text-align: center;
    }

    .new-test-form__inputs input[type="checkbox"] {
        display: none;
    }

    .new-test__add-question {
        border: none;
        margin: 40px 0px;
        padding-left: 40px;
        font-family: 'marta';
        font-size: 1.2rem;
        font-weight: bold;
        cursor: pointer;
        background-image: url('./../img/add.svg');
        background-repeat: no-repeat;
        background-position: left;
        background-color: #fff;
        color: var(--purple);
        opacity: 0.5;
        -webkit-transition: opacity .2s ease-in-out;
        -o-transition: opacity .2s ease-in-out;
        transition: opacity .2s ease-in-out;
    }

    .new-test__add-question:hover {
        opacity: 1;
    }

    .fade-enter-active, .fade-leave-active {
        transition: opacity .3s ease-in-out;
    }

    .fade-enter, .fade-leave-to {
        opacity: 0;
    }



</style>
