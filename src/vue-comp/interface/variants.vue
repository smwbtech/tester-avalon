<template lang="html">

<div class="variants">

    <div class="variant-item"
        v-if="qstType == 1"
    >
        <div v-for="variant in qstVars" :key="variant.var_bd_id">
            <input :value="variant.question_client_id" v-model="answer" @change="updateAnswer" type="radio" name="single_var" :id="variant.question_client_id">
            <label :for="variant.question_client_id">{{variant.var_text}}</label>
        </div>
    </div>

    <div class="variant-item"
        v-else-if="qstType == 2"
    >
        <div v-for="variant in qstVars"
        :key="variant.var_bd_id">
            <input :value="variant.question_client_id" v-model="answer" @change="updateAnswer" type="checkbox" name="single_var" :id="variant.question_client_id">
            <label :for="variant.question_client_id">{{variant.var_text}}</label>
        </div>
    </div>

    <div v-else class="variant-item">
        <input v-model="answerStr" @change="updateAnswer" class="variant-item__string" type="text" placeholder="Напишите ваш ответ">
    </div>


</div>





</template>

<script>
export default {

    props: ['type', 'questions', 'currentqst'],

    data() {
        return {
            qstType: this.type,
            navId: this.currentqst,
            qstVars: this.questions[this.currentqst].vars,
            questionsArr: this.questions,
            answer: [],
            answerStr: ''
        }
    },

    methods: {
        updateAnswer(e) {
            let answer = {};
            answer.answer = this.qstType == 1 || this.qstType == 2 ? this.answer: this.answerStr;
            answer.questionDbId = this.questions[this.currentqst].question_id;
            answer.questionType = this.qstType;
            console.log(this.answer);
            this.$emit('update-answer', answer);
        }
    },


    // эта функция запускается при любом изменении навинации
    watch: {
        currentqst: function (data) {
            this.qstVars = this.questionsArr[data].vars;
        },
        type: function (data) {
                this.qstType = data;
        }
    }

}

</script>

<style lang="css">

    .variant-item input[type="checkbox"],
    .variant-item input[type="radio"] {
        display: none;
    }

    .variant-item label {
        cursor: pointer;
        text-decoration: none;
        color: var(--purple);
        opacity: .5;
        -webkit-transition: all .3s ease-in-out;
        -o-transition: all .3s ease-in-out;
        transition: all .3s ease-in-out;
    }

    .variant-item input[type="checkbox"]:checked ~ label,
    .variant-item input[type="radio"]:checked ~ label {
        opacity: 1;
        text-decoration-color: var(--purple);
        text-decoration: underline;
    }

    .variant-item {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
    }

    .variant-item > div {
        width: 50%;
        text-align: center;
        margin: 20px 0px;
    }

    .variant-item label {
        font-size: 1.3rem;
    }

    .variant-item .variant-item__string {
        display: block;
        width: 90%;
        margin: 20px auto;
        text-align: center;
        border: none;
        border-bottom: 1px solid var(--blue);
        font-size: 1.3rem;
    }

</style>
