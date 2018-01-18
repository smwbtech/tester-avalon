<template lang="html">

    <div class="loading-indicator">
        <span class="loading-indicator__1"></span>
        <span class="loading-indicator__2"></span>
        <span class="loading-indicator__3"></span>
        <span class="loading-indicator__4"></span>
    </div>

</template>

<script>
export default {
}
</script>

<style lang="css">

    .loading-indicator {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 300px;
        height: 300px;
        height: auto;
    }

    span[class^="loading-indicator"] {
        width: 125px;
        height: 125px;
        transform: scale(1);
        background-color: var(--purple);
        -webkit-animation: load 2s ease-in-out infinite;
        animation: load 2s ease-in-out infinite;
    }

    .loading-indicator-1 {
        animation-delay: .5s;
    }

    .loading-indicator-2 {
        animation-delay: 1s;
    }

    .loading-indicator-3 {
        animation-delay: 1.5s;
    }

    .loading-indicator-4 {
        animation-delay: 2s;
    }

    @-webkit-keyframes load {
        0% { transform: scale(1); }
        50% { transform: scale(.1); }
        100% { transform: scale(1); }
    }
    @-o-keyframes load {
        0% { transform: scale(1); }
        50% { transform: scale(.1); }
        100% { transform: scale(1); }
    }
    @-moz-keyframes load {
        0% { transform: scale(1); }
        50% { transform: scale(.1); }
        100% { transform: scale(1); }
    }
    @keyframes load {
        0% { transform: scale(1); }
        50% { transform: scale(.1); }
        100% { transform: scale(1); }
    }



</style>
