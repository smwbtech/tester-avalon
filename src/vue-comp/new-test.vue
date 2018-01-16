<template lang="html">

    <div class="newtest-page">

        <side-menu></side-menu>
        <section class="content">

            <nav class="new-test-nav">
                <ul>
                    <li>
                        <a
                            href="save"
                            @click.prevent="saveTest(0)"
                        >Сохранить</a>
                    </li>
                    <li>
                        <a href="publish">Опубликовать</a>
                    </li>
                </ul>
            </nav>

            <form class="new-test-form">

                <input type="text" class="new-test-form__title" placeholder="Название теста" v-model="testTitle">

                <div class="new-test-form__options">
                    <h3>Описание:</h3>
                    <textarea v-model="testDescription" class="new-test-form__description" name="test_description"></textarea>

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
                        <input type="text" name="time" id="time" value="60" v-if="testOptions.timeLimit" @input="validTimeLimit">
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
                    @udpate-question="updateQuestionInfo"
                ></new-question>

                <button
                    type="button"
                    name="button"
                    @click="addQuestion"
                    class="new-test__add-question"
                >
                добавить вопрос</button>

                 <transition name="fade">
                    <p
                        v-if="flashMsg.text.length > 0"
                        :class="flashMsgClass"
                    >{{flashMsg.text}}</p>
                </transition>

            </form>

        </section>

    </div>

</template>

<script>

import sideMenu from './side-menu.vue';
import newQuestion from './new-question.vue';
import testCheck from './../js/test.js';
import axios from './../../node_modules/axios/dist/axios.js';


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
                   text: '',
                   id: 1,
                   vars: []
               }
           ],
           nextQuestionId: 2,
           flashMsg: {
               text: '',
               status: 1
           },
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
       },

       //Всплывающие сообщения
       flashMsgClass() {
           return {
               'test-flasgMesg' : true,
               'test-flasgMesg_error' : this.flashMsg.status == 1,
               'test-flasgMesg_warn' : this.flashMsg.status == 2,
               'test-flasgMesg_succes' : this.flashMsg.status == 3
           }
       }
   },

   methods: {

       //Вывод сообщения
       showFlashMsg(status, text) {
           this.flashMsg.status = status;
           this.flashMsg.text = text;
           setTimeout( () => this.flashMsg.text = '', 10000);
       },

       // Валидация лимита времени
       validTimeLimit(e) {
           let data = e.inputType === 'deleteContentBackward' ? e.target.value : e.data;
           if(!/\d/i.test(data)) {
               let msg = "Лимит времени задается только в числовом эквиваленте и не должен превышать разумных пределов";
               this.showFlashMsg(1, msg);
               e.target.value = this.testOptions.time;
           }
           else {
               if(+e.target.value > 240) {
                   let msg = "Вы установили очень большой лимит времени, подумайте, может стоит отключить эту опцию.";
                   this.showFlashMsg(2, msg);
                   this.testOptions.time = +e.target.value;
               }
               else if(+e.target.value < 10) {
                   let msg = "Вы установили очень низкий лимит времени!";
                   this.showFlashMsg(1, msg);
               }
               else {
                   this.testOptions.time = +e.target.value;
               }
           }
       },

       // Добавление нового вопроса
       addQuestion() {
           this.questions.push( {
                type: 1,
                text: '',
                id: this.nextQuestionId,
                vars: []
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

       // Обновляем информацию вопроса
       updateQuestionInfo(id, type, description, vars) {
           for(let i = 0; i < this.questions.length; i++) {
               if(this.questions[i].id === id) {
                   this.questions[i].type = type;
                   this.questions[i].text = description;
                   this.questions[i].vars = vars;
               }
           }
       },

       // Сохраняем тест
       saveTest(status) {
           let test = {
               title: this.testTitle,
               description: this.testDescription,
               options: this.testOptions,
               questions: this.questions,
               status: status
           };

           let res = testCheck.check(test);
           if(res.status) {
               axios.post('php/savetest.php', test)
               .then( (res) => {
                   if(!res.data.success) {
                       this.showFlashMsg(1, res.data.errorMsg);
                   }
                   else {
                       this.$router.push('/tester');
                   }
               })
               .catch( (err) => console.log(err));
               // console.log(JSON.stringify(test));
           }
           else {
               this.showFlashMsg(res.code, res.msg);
               document.querySelector('.new-test-form__title').scrollIntoView({ behavior: 'smooth' });
               if(res.questionId) {
                   for(let i = 0; i < this.$children.length; i++) {
                       if(this.$children[i].id === res.questionId) {
                           let elem = this.$children[i].$el;
                           elem.scrollIntoView({ behavior: 'smooth' });
                           elem.classList.add('question_error');
                           setTimeout( () => {
                               elem.classList.remove('question_error');
                           }, 8000)
                       }
                   }
               }
           }

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
        position: relative;
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
        background-color: #fff;
        border: 1px solid var(--blue);
        -webkit-box-shadow: 3px 3px 8px var(--purple);
        box-shadow: 3px 3px 8px var(--purple);
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

    .test-flasgMesg {
        position: fixed;
        max-width: 30%;
        top: 40px;
        right: 40px;
        padding: 20px;
        color: #fff;
        font-size: 1.1rem;
        text-align: center;
        font-weight: bold;
    }

    .test-flasgMesg_error {
        background-color: var(--red);
    }

    .test-flasgMesg_warn {
        background-color: var(--yellow);
    }

    .test-flasgMesg_succes {
        background-color: var(--green);
    }

    .fade-enter-active, .fade-leave-active {
        transition: opacity .3s ease-in-out;
    }

    .fade-enter, .fade-leave-to {
        opacity: 0;
    }



</style>
