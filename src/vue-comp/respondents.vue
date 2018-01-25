<template lang="html">

    <div class="respondents-page">

        <side-menu></side-menu>
        <section class="content">

            <div class="loading" v-if="loading">

                <loading-indicator></loading-indicator>

            </div>

            <div v-else class="respondents-list">



            </div>


        </section>

    </div>

</template>

<script>

import sideMenu from './side-menu.vue';

export default {

    components: {
        'side-menu': sideMenu
    },

    data() {
        return {
            loading: false
        }
    }

}
</script>

<style lang="css">

    .content {
        margin-left: calc(var(--column) * 2);
        margin-right: calc(var(--column) * 2);
        width: calc(var(--column) * 16);
    }

    .respondents-page {
        width: 100%;
        padding-top: calc(var(--row) * 2);
        display: flex;
    }

    .respondents-list {
        width: 100%;
        display: flex;
        flex-flow: column;
        justify-content: center;
    }


</style>
