<template lang="html">

    <div class="user-try">


            <p class="user-try__id">{{results.test_answer_id}}</p>
            <p class="user-try__email">{{userEmail}}</p>


    </div>

</template>

<script>
export default {

    props: ['result'],

    data() {
        return {
            results: this.result
        }
    },

    computed: {
        userEmail() {
            return this.results.user_email ? this.results.user_email : 'Anonym';
        }
    },

    created() {
        console.log(this.results);
    }

}
</script>

<style lang="css">

    @import './../../css/variables.css';

    .user-try {
        display: flex;
        -webkit-box-shadow: 1px 1px 4px rgba(0,0,0,0.1);
        box-shadow: 0px 0px 4px rgba(0,0,0,0.1);
        border-radius: 10px;
        cursor: pointer;
        background-color: #fff;
        margin-bottom: 20px;
    }


</style>
