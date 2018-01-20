<template lang="html">

    <div class="menu">

        <aside class="side-menu">

            <h2>{{title}}</h2>
            <p>{{description}}</p>
            <button type="button" name="button">Готово</button>


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
    }

}
</script>

<style lang="css">

    .menu {
        width: calc(var(--column) * 4);
        height: 100vh;
    }

    .side-menu {
        z-index: 102;
        position: fixed;
        top: 0;
        left: 0;
        width: calc(var(--column) * 4);
        height: 100vh;
        background-color: var(--purple);
        color: #fff;
    }


</style>
