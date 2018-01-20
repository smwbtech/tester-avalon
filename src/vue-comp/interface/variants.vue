<template lang="html">


    <ul v-if="qstType == 1">
        <li
            v-for="variant in vars"
            @click="addSingleVar"
        >{{variant.var_text}}</li>
    </ul>

    <ul v-if="qstType == 2">
        <li
            v-for="variant in vars"
            @click="addMultipleVar"
        >{{variant.var_text}}</li>
    </ul>

    <input v-else type="text">




</template>

<script>
export default {

    props: ['type', 'vars'],

    data() {
        return {
            qstType: +this.type,
            qstVars: this.vars
        }
    }

}
</script>

<style lang="css">
</style>
