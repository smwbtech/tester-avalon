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
        border-bottom: 1px solid var(--purple);
    }

    .pop-up-question:last-of-type {
        border-bottom: none;
    }


    .pop-up-question h3 {
        width: 100%;
        text-align: left;
        margin-bottom: 20px;
        color: var(--blue);
        padding-top: 20px;
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
