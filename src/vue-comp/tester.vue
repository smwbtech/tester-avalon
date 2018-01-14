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

export default {

    components: {
       'side-menu': sideMenu
   },


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
