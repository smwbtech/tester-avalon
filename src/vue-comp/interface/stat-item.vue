<template lang="html">

    <div class="stat-item">

        <div class="stat-item-title">
            <h3>{{testTitle}}</h3>
        </div>
        <div class="stat-item-stat">
            <ul>
                <li class="stat-item-stat__1">{{respondentsNum}}</li>
                <li class="stat-item-stat__2">{{rightAnswers}}</li>
                <li class="stat-item-stat__3">{{wrongAnswers}}</li>
                <li>Респондентов</li>
                <li>Правильных</li>
                <li>Неправильных</li>
            </ul>
        </div>

    </div>

</template>

<script>
export default {

    props: ['tries'],

    data() {
        return {
            respondents: this.tries,
            testTitle: this.tries.test_name
        }
    },

    computed: {
        respondentsNum() {
            return this.respondents.tries.length
        },

        rightAnswers() {
            let right = 0;
            this.respondents.tries.forEach( (val,ind,arr) => {
                val.result.answers.forEach((v,i,a) => {
                    if(v.result) right++;
                });
            });
            return right;
        },

        wrongAnswers() {
            let wrong = 0;
            this.respondents.tries.forEach( (val,ind,arr) => {
                val.result.answers.forEach((v,i,a) => {
                    if(!v.result) wrong++;
                });
            });
            return wrong;
        }
    }

}
</script>

<style lang="css">

    @import './../../css/variables.css';

    .stat-item {
        display: flex;
        width: 90%;
        margin-bottom: 40px;
        -webkit-box-shadow: 1px 1px 4px rgba(0,0,0,0.1);
        box-shadow: 1px 1px 4px rgba(0,0,0,0.1);
        cursor: pointer;
        background-color: #fff;
        font-weight: bold;
        -webkit-transition: all .3s ease-in-out;
        -o-transition: all .3s ease-in-out;
        transition: all .3s ease-in-out;
    }

    .stat-item:hover .stat-item-title:before {
        left: 0;
    }

    .stat-item:hover .stat-item-title h3 {
        color: #fff;
    }

    .stat-item:hover .stat-item-title h3:after {
        left: 0;
    }

    .stat-item:hover .stat-item-stat ul {
        color: var(--purple);
    }

    .stat-item-title {
        padding: 40px;
        width: 50%;
        position: relative;
        overflow: hidden;
    }

    .stat-item-title h3 {
        color: var(--blue);
        z-index: 100;
        position: relative;
        -webkit-transition: all .3s ease-in-out;
        -o-transition: all .3s ease-in-out;
        transition: all .3s ease-in-out;
    }

    .stat-item-title h3:after {
        display: block;
        position: absolute;
        content: '';
        left: -100%;
        bottom: -10px;
        width: 40px;
        height: 3px;
        background-color: #fff;
        -webkit-transition: all .3s ease-in-out .1s;
        -o-transition: all .3s ease-in-out .1s;
        transition: all .3s ease-in-out .1s;

    }

    .stat-item-title:before {
        display: block;
        position: absolute;
        z-index: 99;
        left: -100%;
        top: 0px;
        background-color: var(--purple);
        content: '';
        width: 100%;
        height: 100%;
        -webkit-transition: all .3s ease-in-out;
        -o-transition: all .3s ease-in-out;
        transition: all .3s ease-in-out;
    }

    .stat-item-stat {
        padding: 40px;
        width: 50%;
    }

    .stat-item-stat ul{
        list-style: none;
        display: flex;
        justify-content: space-around;
        flex-wrap: wrap;
        color: var(--blue);
    }

    .stat-item-stat li {
        display: block;
        width: 30%;
        text-align: center;
        font-size: .8rem;
    }

    li[class^="stat-item-stat"] {
        font-size: 2rem;
    }

    @media screen and (max-width: 812px) {

        .stat-item {
            flex-direction: column;
        }

        .stat-item-title,
        .stat-item-stat {
            width: 100%;
        }

        .stat-item-stat {
            padding: 10px;
        }

        .stat-item-stat li {
            font-size: .6rem;
        }

        .stat-item:hover .stat-item-title h3:after {
            left: 40%;
        }

        .stat-item-title h3:after {
            width: 20%;
        }

        li[class^=stat-item-stat] {
            font-size: 1.2rem;
        }


    }

</style>
