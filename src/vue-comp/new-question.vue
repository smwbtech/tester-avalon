<template lang="html">

    <div class="question">

        <h3>Текст вопроса:</h3>
        <textarea class="question__description" name="name" rows="8" cols="80"></textarea>

        <select class="" name="" class="question-type" v-model="questionType">
            <option value="1">Один из списка</option>
            <option value="2">Несколько из списка</option>
        </select>

        <div class="variants">
            <single
            v-if="questionType === 1"
            v-for="(variant, index) in vars"
            :text="variant.text"
            :status="variant.isRight"
            :key="variant.id"
            @removeVar="vars.splice(index, 1)"
            @updateVar="updateVarHandler"
            ></single>
            <multiple v-else></multiple>
        </div>

        <button type="button" name="button" @click="addVar">добавить вариант</button>


        <div class="question-controls">
            <img src="img/success.svg" alt="">
            <img src="img/edit.svg" alt="">
            <img src="img/dustbin.svg" alt="">

        </div>



    </div>

</template>

<script>

import single from './questions/single.vue';
import multiple from './questions/multiple.vue';

export default {

    components: {
       'single': single,
       'multiple': multiple
   },

    data() {
        return {
            questionType: 1,
            vars: [
                    {
                        text: 'Вариант ответа',
                        isRight: false,
                        id: 1
                    }
                ],
            nextVarId: 2
        }
    },

    methods: {
        //Добавляем вариант ответа
        addVar() {
            this.vars.push({
                    text: 'Вариант ответа',
                    isRight: false,
                    id: this.nextVarId
                });
            this.nextVarId++;
        },
        //Удаляем вариант ответа
        removeVarHandler(index) {
            // console.log(this.vars);
            // console.log(index);
            // console.log(this.vars[index]);
            this.vars.splice(index, 1);
        },
        //Обновляем текст варианта
        updateVarHandler(index, text) {
            this.vars[index].text = text;
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
        max-width: 30px;
        display: inline-block;
    }

    .question-controls img:nth-child(2) {
        padding: 0 10px;
    }

</style>
