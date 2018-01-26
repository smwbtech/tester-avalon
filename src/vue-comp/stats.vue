<template lang="html">

    <div class="stats-page">

        <side-menu></side-menu>
        <section class="content">

            <div class="loading" v-if="loading">

                <loading-indicator></loading-indicator>

            </div>

            <div v-else class="stats-list">

                <stat-item
                    v-for="answer in testsArr"
                    :tries="answer"
                ></stat-item>

            </div>


        </section>

    </div>

</template>

<script>

import sideMenu from './side-menu.vue';
import loadingIndicator from './interface/loading.vue';
import statItem from './interface/stat-item.vue';
import axios from './../../node_modules/axios/dist/axios.js';

export default {

    components: {
        'side-menu': sideMenu,
        'loading-indicator': loadingIndicator,
        'stat-item': statItem
    },

    data() {
        return {
            loading: false,
            testsArr: null
        }
    },

    methods: {
        fetchData() {
            this.loading = true;
            axios.get('php/getstats.php')
            .then( (res) => {
                this.loading = false;
                this.testsArr = res.data.tests;
                console.log(res);

            })
            .catch( (err) => {
                this.loading = false;
                console.log(err);
            });
        }
    },

    created() {
        this.fetchData();
    }

}
</script>

<style lang="css">

@import './../css/variables.css';

.content {
    margin-left: calc(var(--column) * 2);
    margin-right: calc(var(--column) * 2);
    width: calc(var(--column) * 16);
}

.stats-page {
    width: 100%;
    padding-top: calc(var(--row) * 2);
    display: flex;
    background-color: var(--background);
}

.stats-list {
    width: 100%;
    display: flex;
    flex-flow: column;
    justify-content: center;
}

</style>
