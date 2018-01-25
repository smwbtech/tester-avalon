<template lang="html">

    <div class="question-var-str">
        <p>Если вариант ответа предполагает несколько вариантов написания, просто перечислите их через строчку</p>
        <input class="var-string" type="text" name="" value="" placeholder="Введите свое описание" v-model="varText" @input="updateInfo">
    </div>

</template>

<script>
export default {

    props: ['text'],

    data() {
        return {
            varText: this.text ? this.text : ''
        }
    },

    methods: {
        updateInfo() {
            this.$emit('updateVar', this.varText);
        }
    }
}
</script>

<style lang="css">

@import './../../css/variables.css';

.question-var-str {
    display: flex;
    flex-wrap: wrap;
}

.var-string {
    width: calc(var(--column) * 10);
    border: none;
    border-bottom: 1px solid var(--blue);
}

</style>
