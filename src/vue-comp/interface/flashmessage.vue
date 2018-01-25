<template lang="html">

       <p
           :class="flashMsgClass"
       >{{this.message}}</p>


</template>

<script>
export default {

    props: ['code', 'text'],

    data() {
        return {
            message: this.text,
            status: this.code
        }
    },

    computed: {
        //Всплывающие сообщения
        flashMsgClass() {
            return {
                'test-flasgMesg' : true,
                'test-flasgMesg_error' : this.status == 1,
                'test-flasgMesg_warn' : this.status == 2,
                'test-flasgMesg_succes' : this.status == 3
            }
        }
    }

}
</script>

<style lang="css">

    @import './../../css/variables.css';

    .test-flasgMesg {
        position: fixed;
        max-width: 30%;
        top: 40px;
        right: 40px;
        padding: 10px;
        border: 3px solid var(--purple);
        color: #fff;
        font-size: 1.1rem;
        text-align: center;
        font-weight: bold;
        -webkit-box-shadow: 3px 3px 8px var(--purple);
        box-shadow: 3px 3px 8px var(--purple);
    }

    .test-flasgMesg_error {
        background-color: var(--red);
    }

    .test-flasgMesg_warn {
        background-color: var(--yellow);
    }

    .test-flasgMesg_succes {
        background-color: var(--green);
    }

    .fade-enter-active, .fade-leave-active {
        transition: opacity .3s ease-in-out;
    }

    .fade-enter, .fade-leave-to {
        opacity: 0;
    }

</style>
