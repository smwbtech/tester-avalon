<template lang="html">

<div class="variants">

    <div class="variant-item"
        v-if="qstType == 1"
    >
        <div v-for="variant in qstVars" :key="variant.var_bd_id">
            <input :value="variant.question_client_id" :data-questionid="variant.question_db_id"  @change="updateAnswer" type="radio" :name="'single_var_'+variant.question_db_id" :id="variant.question_client_id">
            <label :for="variant.question_client_id">{{variant.var_text}}</label>
        </div>
    </div>

    <div class="variant-item"
        v-else-if="qstType == 2"
    >
        <div v-for="variant in qstVars"
        :key="variant.var_bd_id">
            <input :value="variant.question_client_id" :data-questionid="variant.question_db_id" @change="updateAnswer" type="checkbox" :name="'multiple_var_'+variant.question_db_id" :id="variant.question_client_id">
            <label :for="variant.question_client_id">{{variant.var_text}}</label>
        </div>
    </div>

    <div v-else class="variant-item">
        <input :data-questionid="qstId" @change="updateAnswer" class="variant-item__string" type="text" placeholder="Напишите ваш ответ">
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
            answers: [],
            qstId: undefined
        }
    },

    methods: {

        getMultipleAnswers(id) {
            let answer = '';
            let vars = document.querySelectorAll(`input[name="multiple_var_${id}"]`);
            for(let i = 0; i < vars.length; i++) {
                if(vars[i].checked) {
                    answer.length == 0 ? answer += vars[i].value : answer += (',' + vars[i].value);
                }
            }
            return answer;
        },

        // Обновляем информацию о вопросе
        updateAnswer(e) {

            let check = true;
            let answer = {
                answer: this.qstType !== 2 ? e.target.value : this.getMultipleAnswers(+e.target.getAttribute('data-questionid')),
                questionDbId: +e.target.getAttribute('data-questionid')
            };
            this.answers.forEach( (v,i,a) => {
                if(v.questionDbId == answer.questionDbId) {
                    a[i] = answer;
                    check = false;
                }
            });
            check ? this.answers.push(answer) : false;
            this.$emit('update-answer', this.answers);
        }
    },


    // эта функция запускается при любом изменении навинации
    watch: {
        currentqst: function (data) {
            this.qstVars = this.questionsArr[data].vars;
            this.qstId = this.questionsArr[data].question_id;
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
