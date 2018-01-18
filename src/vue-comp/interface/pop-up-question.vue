<template lang="html">

    <div class="pop-up-question">
        <h3>{{title}}</h3>
        <ul
            v-if="type == 1 || type == 2"
        >
            <li v-for="item in variants" :key="item.var_bd_id">{{item.var_text}}</li>
        </ul>
        <p v-else>{{right}}</p>
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
        console.log(this.right);
    }

}
</script>

<style lang="css">

    .pop-up-question {
        display: flex;
        flex-wrap: wrap;
        border-top: 1px solid var(--purple);
        border-bottom: 1px solid var(--purple);
        margin: 20px 0px;
    }


    .pop-up-question h3 {
        width: 100%;
        text-align: left;
        margin-bottom: 20px;
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
    }



</style>
