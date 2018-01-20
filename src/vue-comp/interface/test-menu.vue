<template lang="html">

    <div class="menu">

        <aside class="side-menu-test">

            <h2>{{title}}</h2>
            <p>{{description}}</p>
            <button @click="sendTest" type="button" name="button">Готово</button>


        </aside>
    </div>

</template>

<script>
export default {

    props: ['testname', 'testdescription'],

    data() {
        return {
            title: this.testname,
            description: this.testdescription
        }
    },

    methods: {
        sendTest() {
            this.$emit('send-test');
        }
    }

}
</script>

<style lang="css">

    .menu {
        width: calc(var(--column) * 4);
        height: 100vh;
    }

    .side-menu-test {
        z-index: 102;
        position: fixed;
        top: 0;
        left: 0;
        width: calc(var(--column) * 4);
        height: 100vh;
        background-color: var(--purple);
        color: #fff;
    }

    .side-menu-test h2 {
        padding: 20px 10px;
        text-align: center;
        position: relative;
    }

    .side-menu-test h2:after {
        position: absolute;
        left: 25%;
        width: 50%;
        height: 3px;
        bottom: -10px;
        display: block;
        content: '';
        background-color: #fff;

    }

    .side-menu-test p{
        padding: 20px 10px;
        text-align: center;
    }

    .side-menu-test button {
        font-family: 'marta', sans-serif;
        position: absolute;
        width: 40%;
        left: 30%;
        bottom: 40px;
        background-color: var(--purple);
        border: 3px solid #fff;
        padding: 10px;
        color: #fff;
    }


</style>
