<template lang="html">

    <div class="pop-up-question">
        <h3>{{title}}</h3>
        <ul
            v-if="type == 1 || type == 2"
        >
            <li
                v-for="item in variants"
                :key="item.var_bd_id"
                :class="[right.indexOf(item.question_client_id) >= 0 ? 'right' : 'false']"
            >{{item.var_text}}</li>
        </ul>
        <p class="string_right" v-else>{{right}}</p>
    </div>

</template>

<script>
export default {

    props: ['qsttitle', 'vars', 'answer', 'qsttype'],

    data() {
        return {
            title: this.qsttitle,
            variants: this.vars,
            right: this.answer,
            type: +this.qsttype
        }
    },

    created() {
        if(this.type == 1 || this.type == 2) {
            this.right = this.answer.length > 0 ? this.answer.split(',') : [this.anwer];
        }
    }

}
</script>

<style lang="css">

    @import './../../css/variables.css';

    .pop-up-question {
        display: flex;
        flex-wrap: wrap;
        margin-bottom: 20px;
        padding: 20px;
        -webkit-box-shadow: 0px 0px 4px rgba(101, 102, 149,0.3);
        box-shadow: 0px 0px 4px rgba(101, 102, 149,0.3);
        border-bottom: 6px solid rgba(101, 102, 149, .5);
        border-right: 3px solid rgba(101, 102, 149, .5);;
        border-radius: 20px;
    }

    .pop-up-question h3 {
        width: 100%;
        position: relative;
        text-align: left;
        margin-bottom: 20px;
        color: var(--blue);
        padding-top: 20px;
        text-align: center;
    }

    .pop-up-question h3:after {
        position: absolute;
        display: block;
        height: 3px;
        background-color: var(--purple);
        content: '';
        left: 45%;
        bottom: -10px;
        width: 10%;
    }

    .pop-up-question ul {
        width: 100%;
        margin: 40px 0px;
        list-style: none;
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
    }

    .pop-up-question li {
        display: block;
        text-align: left;
        color: var(--purple);
        opacity: .5;
    }

    .pop-up-question li.right {
        opacity: 1;
        text-decoration: underline;
    }

    .string_right {
        color: var(--purple);
        /* text-decoration: underline; */
    }



</style>
