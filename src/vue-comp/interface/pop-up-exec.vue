<template lang="html">


    <div class="pop-up-exec">

        <div class="pop-up-exec-container">
            <div class="pop-up-info">
                <h2>Результаты вашейго теста</h2>
                <p>Количество правильных ответов: {{right}}</p>
                <p>Количество неправильных ответов: {{wrong}}</p>
                <!-- <p>Время затраченое на прохождение: {{timeLeft}}</p> -->
                <button type="button" name="button" @click="endTest">Завершить тестирование</button>
            </div>

        </div>
</div>


</template>

<script>
export default {

    props: ['results', 'timestart'],

    data() {
        return {
            res: this.results,
            time: this.timestart
        }
    },

    computed: {
        right() {
            let right = 0;
            this.res.result.answers.forEach( (v,i,a) => {
                if(v.result) right++;
            });
            return right;
        },

        wrong() {
            let wrong = 0;
            this.res.result.answers.forEach( (v,i,a) => {
                if(!v.result) wrong++;
            });
            return wrong;
        },

        timeLeft() {
            let end = new Date(+this.res.time_end);
            let start = new Date(this.time)
            return end.getMinutes() - start.getMinutes();
        }

    },

    methods: {
        endTest() {
            localStorage.clear();
            this.$router.replace('/tester');
        }
    },

    mounted() {
        console.log('mounted');
        console.log(this.res);
    }

}
</script>

<style lang="css">

    @import './../../css/variables.css';

    .pop-up-exec {
        position: fixed;
        left: 0px;
        top: 0;
        width: calc(var(--column) * 15);
        min-height: 100vh;
        min-width: 100vw;
        background-color: #fff;
        background-image: linear-gradient(to top, var(--darkpurple), var(--purple) 95%);
        z-index: 200;
    }

    .pop-up-exec-container {
        width: 50%;
        min-height: 50%;
        position: fixed;
        top: 25%;
        left: 25%;
        background-color: #fff;
        -webkit-box-shadow: 1px 1px 4px rgba(0,0,0,0.1);
        box-shadow: 1px 1px 4px rgba(0,0,0,0.1);
        z-index: 202;
    }

    .pop-up-info {
        padding: 40px;
        text-align: center;
        color: var(--blue);
    }

    .pop-up-info {
        margin: 20px 0px;
    }

    .pop-up-info p {
        font-size: 1.2rem;
        font-weight: bold;
        margin-bottom: 20px;
    }

    .pop-up-info button{
        text-align: center;
        padding: 5px;
        background-color: #fff;
        border: 3px solid var(--purple);
        cursor: pointer;
        font-family: 'marta', sans-serif;
        font-weight: bold;
    }

    @-webkit-keyframes bgMove {
        0% { left: -60%; top: -60%;}
        25% { left: 0%; top: 0%; }
        50% { left: -0%; top: -50%}
        100% { left: -50%; top: -50%;}
    }
    @-o-keyframes bgMove {
        0% { left: -60%; top: -60%;}
        25% { left: 0%; top: 0%; }
        50% { left: -0%; top: -50%}
        100% { left: -50%; top: -50%;}
    }
    @-moz-keyframes bgMove {
        0% { left: -60%; top: -60%;}
        25% { left: 0%; top: 0%; }
        50% { left: -0%; top: -50%}
        100% { left: -50%; top: -50%;}
    }
    @keyframes bgMove {
        0% { left: -60%; top: -60%;}
        25% { left: 0%; top: 0%; }
        50% { left: -0%; top: -50%}
        100% { left: -50%; top: -50%;}
    }


</style>
