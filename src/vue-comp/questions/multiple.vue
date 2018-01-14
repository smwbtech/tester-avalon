<template lang="html">

    <div class="question-var">
        <input type="text" name="" value="" placeholder="Вариант ответа">
        <img src="img/cross.svg" alt="">
        <label for="right_var">правильный</label>
        <input type="checkbox" name="" value="" id="right_var">
    </div>

</template>

<script>
export default {
}
</script>

<style lang="css">

    .question-var {
        display: flex;
        width: calc(var(--column) * 10);
        max-height: 40px;
        margin-bottom: 20px;
        justify-content: space-between;
    }

    .question-var > * {
        display: block;
        max-width: calc(var(--column) * 10);
        align-self: center;
    }

    .question-var input[type="text"] {
        max-width: calc(var(--column) * 6);
        border: none;
        border-bottom: 1px solid var(--blue);
    }

    .question-var img{
        max-width: 20px;
        cursor: pointer;
        opacity: 0.5;
        -webkit-transition: opacity .2s ease-in-out;
        -o-transition: opacity .2s ease-in-out;
        transition: opacity .2s ease-in-out;
    }

    .question-var img:hover {
        opacity: 1;
    }

    .question-var input[type="checkbox"] {
        display: none;
    }

    label[for="right_var"] {
        cursor: pointer;
        color: var(--blue);
        opacity: .5;
        -webkit-transition: opacity .2s ease-in-out;
        -o-transition: opacity .2s ease-in-out;
        transition: opacity .2s ease-in-out;
    }

    label[for="right_var"]:hover {
        opacity: 1;
    }

</style>
