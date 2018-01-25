<template lang="html">

    <div class="user-try">

    </div>

</template>

<script>
export default {

    props: ['result'],

    data() {
        return {
            answers: this.result
        }
    },

    computed: {
        userEmail() {
            return
        }
    }
}
</script>

<style lang="css">
</style>
