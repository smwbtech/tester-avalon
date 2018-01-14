<template lang="html">

    <div class="tester-page">

        <side-menu></side-menu>

    </div>

</template>

<script>

import sideMenu from './side-menu.vue';

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

</style>
