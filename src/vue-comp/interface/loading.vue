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
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;
        width: 100px;
        height: 100px;
        height: auto;
        opacity: 1;
    }

    span[class^="loading-indicator"] {
        width: 45px;
        height: 45px;
        transform: scale(1);
        background-color: var(--purple);

    }

    .loading-indicator__1 {
        -webkit-animation: load 1.5s ease-in-out infinite;
        animation: load 1.5s ease-in-out infinite;
        /* animation-delay: .5s; */
    }

    .loading-indicator__2 {
        -webkit-animation: load 1.5s ease-in-out infinite;
        animation: load 2s ease-in-out infinite;
        animation-delay: .1s;
    }

    .loading-indicator__3 {
        -webkit-animation: load 1.5s ease-in-out infinite;
        animation: load 1.5s ease-in-out infinite;
        animation-delay: .2s;
    }

    .loading-indicator__4 {
        -webkit-animation: load 1.5s ease-in-out infinite;
        animation: load 1.5s ease-in-out infinite;
        animation-delay: .3s;
    }

    @-webkit-keyframes load {
        0% { transform: scale(1); opacity: 1;}
        50% { transform: scale(.1); opacity: .2;}
        100% { transform: scale(1); opacity: 1;}
    }
    @-o-keyframes load {
        0% { transform: scale(1); opacity: 1;}
        50% { transform: scale(.1); opacity: .2;}
        100% { transform: scale(1); opacity: 1;}
    }
    @-moz-keyframes load {
        0% { transform: scale(1); opacity: 1;}
        50% { transform: scale(.1); opacity: .2;}
        100% { transform: scale(1); opacity: 1;}
    }
    @keyframes load {
        0% { transform: scale(1); opacity: 1;}
        50% { transform: scale(.1); opacity: .2;}
        100% { transform: scale(1); opacity: 1;}
    }



</style>
