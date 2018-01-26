<template lang="html">

    <div class="user-try" @click="showTestHander">


            <p class="user-try__id">{{results.test_answer_id}}</p>
            <p class="user-try__email">{{userEmail}}</p>
            <p class="user-try__total">{{percents}}%</p>
            <p class="user-try__right">{{rightAnswers}}</p>
            <p class="user-try__false">{{falseAnswers}}</p>

    </div>

</template>

<script>
export default {

    props: ['result'],

    data() {
        return {
            results: this.result,
            rightAnswers: 0,
            falseAnswers: 0,
            percents: 0,
            testAnswerId: this.result.test_answer_id
        }
    },

    computed: {

        //Email пользователя
        userEmail() {
            return this.results.user_email ? this.results.user_email : 'Anonym';
        },

    },

    methods: {

        //показываем окно с информацией о тесте
        showTestHander() {
            console.log(this.testAnswerId);
        }

    },

    created() {
        console.log(this.results.result);
        for(let i = 0; i < this.results.result.answers.length; i++) {
            this.results.result.answers[i].result ? this.rightAnswers++ : this.falseAnswers++;
        }
        this.percents = this.rightAnswers / this.results.result.answers.length * 100;

    }

}
</script>

<style lang="css">

    @import './../../css/variables.css';

    .user-try {
        display: flex;
        justify-content: space-around;
        -webkit-box-shadow: 0px 0px 4px rgba(0,0,0,0.1);
        box-shadow: 0px 0px 4px rgba(0,0,0,0.1);
        border-radius: 10px;
        cursor: pointer;
        background-color: #fff;
        margin-bottom: 20px;
        transform: scale(.95);
        -webkit-transition: all .3s ease-in-out;
        -o-transition: all .3s ease-in-out;
        transition: all .3s ease-in-out;
    }

    .user-try:hover {
        -webkit-box-shadow: 0px 0px 6px rgba(0,0,0,0.3);
        box-shadow: 0px 0px 6px rgba(0,0,0,0.3);
        transform: scale(1);
    }

    .user-try__right,
    .user-try__false {
        width: 30px;
        height: 30px;
        text-align: center;
        border-radius: 20px;
        padding: 3px 9px;
        font-weight: bold;
        color: #fff;
    }

    .user-try__right {
        background-color: var(--green);
    }

    .user-try__false {
        background-color: var(--red);
    }


</style>
