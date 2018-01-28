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
                        <a href="publish"
                        @click.prevent="saveTest(1)"
                    >Опубликовать</a>
                    </li>
                </ul>
            </nav>

            <form class="new-test-form">


                <div class="new-test-form__options">
                    <input type="text" class="new-test-form__title" placeholder="Название теста" v-model="testTitle">
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
                        <input type="text" name="time" id="time" value="60" v-if="testOptions.timeLimit" @change="validTimeLimit">
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
                    :questiondbid="question.db_id"
                    :questionvars="question.vars"
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
                   <flash-message
                       v-if="flashMsg.text.length > 0"
                       :code="flashMsg.status"
                       :text="flashMsg.text"
                   >
                   </flash-message>
              </transition>

            </form>

        </section>

    </div>

</template>

<script>

import sideMenu from './side-menu.vue';
import newQuestion from './new-question.vue';
import flashMessage from './interface/flashmessage.vue';
import testCheck from './../js/test.js';
import axios from './../../node_modules/axios/dist/axios.js';


export default {

    components: {
       'side-menu': sideMenu,
       'new-question': newQuestion,
       'flash-message': flashMessage
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
           testId: undefined
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

       // Устанавливаем данные теста из ДБ
       fetchTestDb(test) {
           this.testTitle = test.test_name;
           this.testDescription = test.test_description;
           this.testId = +test.test_id;
           this.testOptions.timeLimit = +test.test_time ? true : false;
           this.testOptions.time = +test.test_time;
           this.testOptions.anonym = +test.test_anonym;
           this.questions = [];
           this.nextQuestionId = +test.questions[test.questions.length-1].question_client_id + 1;
           for(let i = 0; i < test.questions.length; i++) {
               this.questions[i] = {
                   type: +test.questions[i].question_type_id,
                   text: test.questions[i].question_description,
                   id: +test.questions[i].question_client_id,
                   db_id: +test.questions[i].question_id,
                   vars: []
               };
               let type = +test.questions[i].question_type_id;
               if(type === 1 || type == 2) {
                   for(let j = 0; j < test.questions[i].vars.length; j++) {
                       let answer = test.questions[i].question_answer.length === 1 ? [test.questions[i].question_answer] : test.questions[i].question_answer.split(',');
                       this.questions[i].vars.push({
                           text: test.questions[i].vars[j].var_text,
                           id: +test.questions[i].vars[j].question_client_id,
                           db_id: +test.questions[i].vars[j].question_client_id,
                           isRight: answer.indexOf(test.questions[i].vars[j].question_client_id) >= 0 ? true : false
                       });
                   }
               }
               else {
                   this.questions[i].vars =  test.questions[i].question_answer;
               }



           }
       },

       //Вывод сообщения
       showFlashMsg(status, text) {
           this.flashMsg.status = status;
           this.flashMsg.text = text;
           setTimeout( () => this.flashMsg.text = '', 10000);
       },

       // Валидация лимита времени
       validTimeLimit(e) {
           let data = e.target.value;
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
                   e.target.value = 60;
               }
               else if(+e.target.value < 10) {
                   e.target.value = 10;
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
                vars: [{
                    text: '',
                    isRight: false,
                    id: 1
                }]
            });
            this.nextQuestionId++;
       },

       // Удаляем вопрос
       deleteQuestionHandler(id) {
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

       publishTest() {
           this.saveTest(1);
       },

       // Сохраняем тест
       saveTest(status) {
           var status = status ? status : 0;
           let test = {
               title: this.testTitle,
               description: this.testDescription,
               options: this.testOptions,
               questions: this.questions,
               status: status,
               testId: this.testId
           };

           let res = testCheck.check(test);


           if(res.status) {
               axios.post('php/savetest.php', test)
               .then( (res) => {
                   console.log(res);
                   if(!res.data.success) {
                       this.showFlashMsg(1, res.data.errorMsg);
                   }
                   else {
                       let msg = status == 0 ? 'Тест успешно сохранен в базе данных' : 'Тест опубликован';
                       this.showFlashMsg(3, msg);
                       setTimeout( () => this.$router.push('/tester'), 2000);
                   }
               })
               .catch( (err) => console.log(err));
           }
           else {
               console.log('мы здесь');
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

   },

   // При создании компонента, проверяем localStorage и если в нем есть объект тест выводим его данные
   created() {
       if(localStorage.getItem('test')) {
           let test = JSON.parse(localStorage.getItem('test'));
           this.fetchTestDb(test);
       }
   },

   // Перед уходом очищаем localStorage;
   beforeRouteLeave(to, from, next) {
       localStorage.getItem('test') ? localStorage.removeItem('test') : false;
       next();
   }

}
</script>

<style lang="css">

@import './../css/variables.css';

    .newtest-page {
        /* margin-left: calc(var(--column) * 6); */
        background-color: var(--background);
        display: flex;
    }

    .newtest-page .content {
        margin-left: calc(var(--column) * 2);
        margin-right: calc(var(--column) * 2);
        width: calc(var(--column) * 16);
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
        -webkit-box-shadow: 1px 1px 4px rgba(0,0,0,0.1);
        box-shadow: 1px 1px 4px rgba(0,0,0,0.1);
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
        margin-left: 20px;
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
        background-color: var(--background);
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
        z-index: 201;
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

    @media screen and (max-width: 812px) {

        .newtest-page .content{
            width: 100%;
            margin: 0;
            justify-content: center;
            align-items: center;
        }

        .new-test-nav {
            padding: 10px;
        }

        .new-test-nav ul {
            display: flex;
            justify-content: flex-end;
        }

        .new-test-nav li {
            min-width: calc(var(--column-mobile) * 3);
            font-size: .8rem;
        }

        .new-test-nav li:last-child {
            padding-left: 10px;
        }

        .new-test-form {
            padding-top: calc(var(--row-mobile) * 4);
        }

        .new-test-form__options {
            width: 90%;
            margin: 0 auto;

        }

        .new-test-form__inputs img {
            float: left;
            clear: left;
            margin-bottom: 1px;
        }

        .new-test-form__options label {
            font-size: .8rem;
            padding-left: 40px;
            margin-bottom: 12px;
        }

        .new-test__add-question {
            display: block;
            margin: 40px auto;
        }




    }



</style>
