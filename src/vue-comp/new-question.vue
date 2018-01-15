<template lang="html">

    <div class="question">

        <h3>Текст вопроса:</h3>
        <textarea class="question__description" name="name" rows="8" cols="80"></textarea>

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

    props: ['questiontype', 'questiontext', 'questionid'],

    components: {
       'single': single,
       'multiple': multiple,
       'string': string
   },

    data() {
        return {
            questionType: this.questiontype ? this.questiontype : 1,
            id: this.questionid,
            // Вопросы с одним вариантом
            single: {
                vars: [
                    {
                        text: 'Вариант ответа',
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
                        text: 'Вариант ответа',
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

        changeType(e) {

            this.questionType = +e.target.value;

            this.single = {
                vars: [
                    {
                        text: 'Вариант ответа',
                        isRight: false,
                        id: 1
                    }
                ],
                nextVarId: 2
            };

            this.multiple = {
                vars: [
                    {
                        text: 'Вариант ответа',
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
            this.single.vars.push({
                text: 'Вариант ответа',
                isRight: false,
                id: this.single.nextVarId
            });
            this.single.nextVarId++;
        },

        // Удаление вариантами
        removeVarHandler(id) {
            let index;
            for(let i = 0; i < this.single.vars.length; i++) {
                if(this.single.vars[i].id === id) index = i;
            }
            this.single.vars.splice(index, 1);
        },

        //Обновляем текст варианта
        singleUpdateVarHandler(id, text) {
            let index;
            for(let i = 0; i < this.single.vars.length; i++) {
                if(this.single.vars[i].id === id) index = i;
            }
            this.single.vars[index].text = text;
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
        },

        multipleUpdateVarHandler(id, text) {
            let index;
            for(let i = 0; i < this.multiple.vars.length; i++) {
                if(this.multiple.vars[i].id === id) index = i;
            }
            this.multiple.vars[index].text = text;
        },

        //Выбираем правильный вариант вопроса
        multipleUpdateRightVarHandler(index) {
            this.$children.forEach( (v,i) => {
                if(i === index) {
                    v.isRight ? v.isRight = false : v.isRight = true;
                    this.single.vars[index].isRight ? this.single.vars[index].isRight = false : this.single.vars[index].isRight = true;
                }
            });
        },

        /*Вопрос - строка*/

        stringUpdateVarHandler(text) {
            this.string.answer = text;
        },

        //Событие удаления вопроса
        deleteQuestion() {
            this.$emit('delete-question', this.id);
        }
    }

}
</script>

<style lang="css">

    .question {
        position: relative;
        border: 1px solid var(--blue);
        margin-top: 40px;
        padding: 20px;
    }

    .question h3 {
        margin-bottom: 20px;
        color: #8496b1;
    }

    .question-type {
        position: absolute;
        right: -1px;
        top: -1px;
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
        background-color: #dddde8;
    }

    .question-controls {
        position: absolute;
        bottom: 20px;
        right: 0px;
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
        padding: 0 10px;
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
