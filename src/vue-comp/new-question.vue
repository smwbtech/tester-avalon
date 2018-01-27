<template lang="html">

    <div class="question">

        <h3>Текст вопроса:</h3>
        <textarea class="question__description" v-model="description" @input="updateDescription"></textarea>

        <select class="" name="" class="question-type" @change="changeType">
            <option value="1">Один из списка</option>
            <option value="2">Несколько из списка</option>
            <option value="3">Строка</option>
        </select>

        <div class="variants">

            <div v-if="questionType === 1" key="single-question">
                <single
                    v-for="(variant, index) in single.vars"
                    :text="variant.text"
                    :status="variant.isRight"
                    :id="variant.id"
                    :key="variant.id"
                    @removeVar="removeVarHandler"
                    @updateVar="singleUpdateVarHandler"
                    @updateRightVar="singleUpdateRightVarHandler"
                ></single>
                <button key="add-single"  class="question__add-var-button sngl" type="button" name="button" @click="singleAddVar">добавить вариант</button>
            </div>

            <div v-else-if="questionType === 2" key="multiple-question">
                <multiple

                    v-for="(variant, index) in multiple.vars"
                    :text="variant.text"
                    :status="variant.isRight"
                    :id="variant.id"
                    :key="variant.id"
                    @removeVar="multipleRemoveVarHandler"
                    @updateVar="multipleUpdateVarHandler"
                    @updateRightVar="multipleUpdateRightVarHandler"
                >
                </multiple>
                <button key="add-multiple" class="question__add-var-button mlt" type="button" name="button" @click="multipleAddVar">добавить вариант</button>
            </div>

            <div v-else key="string-question">
                <string
                    :text="string.answer"
                    @updateVar="stringUpdateVarHandler"
                ></string>
            </div>

        </div>



        <div class="question-controls">
            <img src="img/success.svg" alt="">
            <img src="img/edit.svg" alt="">
            <img @click="deleteQuestion" src="img/dustbin.svg" alt="">

        </div>



    </div>

</template>

<script>

import single from './questions/single.vue';
import multiple from './questions/multiple.vue';
import string from './questions/string.vue';

export default {

    props: [
        'questiontype',
        'questiontext',
        'questionid',
        'questiondbid',
        'questionvars'
    ],

    components: {
       'single': single,
       'multiple': multiple,
       'string': string
   },

    data() {
        return {
            questionType: this.questiontype ? this.questiontype : 1,
            id: this.questionid,
            db_id: this.questiondbid,
            description: this.questiontext ? this.questiontext : '',
            // Вопросы с одним вариантом
            single: {
                vars: [
                    {
                        text: '',
                        isRight: false,
                        id: 1
                    }
                ],
                nextVarId: 2
            },
            // Вопросы с несколькими вариантами ответа
            multiple: {
                vars: [
                    {
                        text: '',
                        isRight: false,
                        id: 1
                    }
                ],
                nextVarId: 2
            },
            //Вопрос с вводом строки
            string: {
                answer: ''
            }

        }
    },

    methods: {

        updateDescription() {
            this.updateQuestionVars();
        },


        changeType(e) {

            this.questionType = +e.target.value;

            this.single = {
                vars: [
                    {
                        text: '',
                        isRight: false,
                        id: 1
                    }
                ],
                nextVarId: 2
            };

            this.multiple = {
                vars: [
                    {
                        text: '',
                        isRight: false,
                        id: 1
                    }
                ],
                nextVarId: 2
            };
        },

        /*Вопросы с одним варианторм*/

        //Добавляем вариант ответа
        singleAddVar() {
            this.single.nextVarId++;
            this.single.vars.push({
                text: '',
                isRight: false,
                id: this.single.nextVarId
            });

        },

        // Удаление вариантами
        removeVarHandler(id) {
            let index;
            for(let i = 0; i < this.single.vars.length; i++) {
                if(this.single.vars[i].id === id) index = i;
            }
            this.single.vars.splice(index, 1);
            this.updateQuestionVars();
        },

        //Обновляем текст варианта
        singleUpdateVarHandler(id, text) {
            let index;
            for(let i = 0; i < this.single.vars.length; i++) {
                if(this.single.vars[i].id === id) index = i;
            }
            this.single.vars[index].text = text;
            this.updateQuestionVars();
        },

        //Выбираем правильный вариант вопроса
        singleUpdateRightVarHandler(index) {
            this.$children.forEach( (v,i) => {
                if(i === index) {
                    v.isRight ? v.isRight = false : v.isRight = true;
                    this.single.vars[index].isRight ? this.single.vars[index].isRight = false : this.single.vars[index].isRight = true;
                }
                else {
                    v.isRight = false;
                    this.single.vars[i].isRight = false;
                }
            });
            this.updateQuestionVars();
        },

        /*Вопросы с несолькими вариантами*/

        //Добавляем вариант ответа
        multipleAddVar() {
            this.multiple.vars.push({
                text: 'Вариант ответа',
                isRight: false,
                id: this.multiple.nextVarId
            });
            this.multiple.nextVarId++;
        },

        // Удаляем вариант ответа
        multipleRemoveVarHandler(id) {
            let index;
            for(let i = 0; i < this.multiple.vars.length; i++) {
                if(this.multiple.vars[i].id === id) index = i;
            }
            this.multiple.vars.splice(index, 1);
            this.updateQuestionVars();
        },

        multipleUpdateVarHandler(id, text) {
            let index;
            for(let i = 0; i < this.multiple.vars.length; i++) {
                if(this.multiple.vars[i].id === id) index = i;
            }
            this.multiple.vars[index].text = text;
            this.updateQuestionVars();
        },

        //Выбираем правильный вариант вопроса
        multipleUpdateRightVarHandler(index) {
            this.$children.forEach( (v,i) => {
                if(i === index) {
                    v.isRight ? v.isRight = false : v.isRight = true;
                    this.multiple.vars[index].isRight ? this.multiple.vars[index].isRight = false : this.multiple.vars[index].isRight = true;
                }
            });
            this.updateQuestionVars();
        },

        /*Вопрос - строка*/

        stringUpdateVarHandler(text) {
            this.string.answer = text;
            this.updateQuestionVars();
        },

        //Обновляем варианты в объекте вопроса в тесте
        updateQuestionVars() {
            switch (this.questionType) {
                case 1:
                    this.$emit('udpate-question', this.id, this.questionType, this.description, this.single.vars);
                    break;
                case 2:
                    this.$emit('udpate-question', this.id, this.questionType, this.description, this.multiple.vars);
                    break;
                case 3:
                    this.$emit('udpate-question', this.id, this.questionType, this.description, this.string.answer);
                    break;
                default:

            }
        },

        //Событие удаления вопроса
        deleteQuestion() {
            this.$emit('delete-question', this.id);
        }
    },

    created() {
        switch(this.questiontype) {
            case 1:
                this.single.vars = this.questionvars;
                this.single.nextVarId = this.questionvars[this.questionvars.length-1].id;
                break;
            case 2:
                this.multiple.vars = this.questionvars;
                this.multiple.nextVarId = this.questionvars[this.questionvars.length-1].id;
                break;
            case 3:
                this.string.answer = this.questionvars;
                break;
        }
    }

}
</script>

<style lang="css">

    @import './../css/variables.css';

    .question {
        position: relative;
        margin-top: 40px;
        padding: 20px;
        background-color: #fff;
        -webkit-box-shadow: 1px 1px 4px rgba(0,0,0,0.1);
        box-shadow: 1px 1px 4px rgba(0,0,0,0.1);
        -webkit-transition: all .3s ease-in-out;
        -o-transition: all .3s ease-in-out;
        transition: all .3s ease-in-out;
    }

    .question_error {
        border: 1px solid var(--red);
        -webkit-box-shadow: 3px 3px 8px var(--red);
        box-shadow: 3px 3px 8px var(--red);
    }

    .question h3 {
        margin-bottom: 20px;
        color: #8496b1;
    }

    .question-type {
        position: absolute;
        right: -1px;
        top: -1px;
        border: none;
        background-color: var(--purple);
        color: #fff;
        font-family: 'marta';
        padding: 10px;
    }

    .question-type option{
        padding: 10px;
    }

    .question__description {
        width: calc(var(--column) * 10);
        max-width: calc(var(--column) * 10);
        min-width: calc(var(--column) * 10);
        height: calc(var(--row) * 1);
        min-height: calc(var(--row) * 1);
        max-height: calc(var(--row) * 1);
        margin-bottom: 20px;
        border: none;
        border: 1px solid var(--blue);
    }

    .question-controls {
        position: absolute;
        bottom: 20px;
        right: 10px;
        width: calc(var(--column) * 2);
    }
    .question-controls img {
        cursor: pointer;
        max-width: 30px;
        display: inline-block;
        opacity: 0.5;
        -webkit-transition: opacity 0.2s ease-in-out;
        -o-transition: opacity 0.2s ease-in-out;
        transition: opacity 0.2s ease-in-out;
    }

    .question-controls img:hover {
        opacity: 1;
    }

    .question-controls img:nth-child(2) {
        margin: 0 10px;
    }

    .question__add-var-button {
        border: none;
        padding-left: 30px;
        cursor: pointer;
        font-family: 'marta';
        font-weight: bold;
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

    .question__add-var-button:hover {
        opacity: 1;
    }

</style>
