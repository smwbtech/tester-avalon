<template lang="html">

    <div class="respondents-page">

        <side-menu></side-menu>
        <section class="content">

            <div class="loading" v-if="loading">

                <loading-indicator></loading-indicator>

            </div>

            <div class="respondents-list">

                <div
                    class="resondents-test-item"
                    v-for="test in testsArr"
                    :key="test.test_id"
                >

                    <h2>{{test.test_name}}</h2>
                    <respondent-item
                        v-for="singleTry in test.tries"
                        :key="singleTry.test_answer_id"
                        :result="singleTry"
                    >

                    </respondent-item>

                </div>

            </div>


        </section>

    </div>

</template>

<script>

import sideMenu from './side-menu.vue';
import loadingIndicator from './interface/loading.vue';
import respondentItem from './interface/respondent-item.vue';
import axios from './../../node_modules/axios/dist/axios.js';

export default {

    components: {
        'side-menu': sideMenu,
        'loading-indicator': loadingIndicator,
        'respondent-item': respondentItem
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
                console.log(this.testsArr);

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

    .respondents-page {
        width: 100%;
        padding-top: calc(var(--row) * 2);
        display: flex;
        background-color: var(--background);
    }

    .respondents-list {
        width: 100%;
        display: flex;
        flex-flow: column;
        justify-content: center;
    }

    .resondents-test-item {
        max-height: calc(var(--row) * 4);
        overflow: hidden;
        margin-bottom: 40px;
        padding: 20px;
        -webkit-box-shadow: 1px 1px 4px rgba(0,0,0,0.1);
        box-shadow: 1px 1px 4px rgba(0,0,0,0.1);
        cursor: pointer;
        background-color: #fff;
    }


</style>
