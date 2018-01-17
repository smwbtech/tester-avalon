<template lang="html">

    <div class="tester-page">

        <side-menu></side-menu>
        <section class="content">

        </section>

    </div>

</template>

<script>

import sideMenu from './side-menu.vue';
import newTest from './new-test.vue';
import axios from './../../node_modules/axios/dist/axios.js';

export default {

    components: {
       'side-menu': sideMenu
   },

   data() {
       return {
           loading: false,
           tests: null
       }
   },

   created() {
       this.fetchData();
   },

   methods: {
       // Получаем данные о тестах с сервера
       fetchData() {
           this.loading = true;
           axios.get('php/gettests.php')
           .then( (res) => {
               console.log(res);
               this.loading = false;
               this.tests = {};
               this.tests.published = this.tests.drafts = [];

           })
           .catch( (err) => {
               this.loading = false;
               console.log(err);
           });
       }
   }


}
</script>

<style lang="css">

.tester-page {
    width: 100%;
}

.content {
    /* margin-left: calc(var(--column) * 6); */
}

</style>
