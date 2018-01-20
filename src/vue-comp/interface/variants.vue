<template lang="html">

<div class="variants">

    <div class="variant-item"
        v-if="qstType == 1"
    >
        <div v-for="variant in qstVars" :key="variant.var_bd_id">
            <label :for="variant.question_client_id">{{variant.var_text}}</label>
            <input type="radio" name="single_var" :id="variant.question_client_id">
        </div>
    </div>

    <div class="variant-item"
        v-else-if="qstType == 2"
    >
        <div v-for="variant in qstVars"
        :key="variant.var_bd_id">
            <label :for="variant.question_client_id">{{variant.var_text}}</label>
            <input type="checkbox" name="single_var" :id="variant.question_client_id">
        </div>
    </div>

    <div v-else class="variant-item">
        <input type="text" placeholder="Напишите ваш ответ">
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
            questionsArr: this.questions

        }
    },


    // эта функция запускается при любом изменении навинации
    watch: {
        currentqst: function (data) {
            this.qstVars = this.questionsArr[data].vars;
        },
        type: function (data) {
                console.log(data + ' - in comp');
                this.qstType = data;
                console.log(this.qstVars);
        }
    }

}

</script>

<style lang="css">

    .variant-item input[type="checkbox"],
    .variant-item input[type="radio"] {
        display: none;
    }

    .variant-item {
        width: 100%;
        display: flex;
        justify-content: space-between;
    }

</style>
