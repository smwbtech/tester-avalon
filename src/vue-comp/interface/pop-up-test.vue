<template lang="html">

    <div class="pop-up" @click="closeWindow">
        <div>
                <div class="pop-up-window" @click.stop>
                    <div class="pop-up-controls">
                        <button class="pop-up-controls__publish" v-if="!testStatus" type="button" name="button" title="опубликовать"></button>
                        <button class="pop-up-controls__edit" v-if="!testStatus" type="button" name="button" title="редактировать" @click="edit"></button>
                        <button class="pop-up-controls__delete" type="button" name="button" title="удалить"></button>


                    </div>
                    <h2>{{testTitle}}</h2>
                    <p>{{testDescription}}</p>
                    <img :src="testImage" alt="">

                    <question-item
                    v-for="question in questions"
                    :key="question.question_id"
                    :qsttitle="question.question_description"
                    :vars="question.vars"
                    :answer="question.question_answer"
                    :qsttype="question.question_type_id"
                    >

                </question-item>

            </div>
        </div>
    </div>

</template>

<script>

import questionItem from './pop-up-question.vue';

export default {

    props: [
        'testtite',
        'description',
        'imglink',
        'anonym',
        'time',
        'status',
        'testquestions',
        'testid'
    ],

    components: {
        'question-item': questionItem
    },

    data() {
        return {
            testTitle: this.testtite,
            testDescription: this.description,
            testImage: this.imglink ? this.imglink : 'img/default_test.svg',
            testStatus: +this.status ? true : false,
            testId: +this.testid,
            testOptions: {
                timeLimit: +this.time !== 0 ? true : false,
                time: +this.time,
                anonym: +this.status ? true : false
            },
            questions: this.testquestions
        }
    },

    methods: {
        closeWindow() {
            // console.log(this.testId);
            this.$emit('close-window');
        },
        edit() {
            this.$emit('edit-test', this.testId);
        }
    },

    created () {
        document.body.style.overflow = 'hidden';
    },

    destroyed () {
        document.body.style.overflow = 'auto';
    }

}
</script>

<style lang="css">

    .pop-up {
        z-index: 105;
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.8);
        /* padding-top: calc(var(--row) * 2);
        padding-bottom: calc(var(--row) * 2); */
        overflow-y: scroll;
    }

    .pop-up > div {
        overflow-y: scroll;
    }

    .pop-up-controls {
        position: fixed;
        display: flex;
        flex-wrap: wrap;
        max-width: 50px;
        top: 0;
        left: calc(25% - 100px);
        background-color: #fff;
    }

    .pop-up-controls button {
        display: block;
        cursor: pointer;
        width: 50px;
        height: 50px;
        border: none;
        margin: 10px 5px;
        background-color: #fff;
        background-repeat: no-repeat;
        background-position: center;
        opacity: .5;
        -webkit-transition: opacity .3s ease-in-out;
        -o-transition: opacity .3s ease-in-out;
        transition: opacity .3s ease-in-out;
    }

    .pop-up-controls button:hover {
        opacity: 1;
    }

    .pop-up-controls__publish {
        background-image: url('./../../img/success.svg');
    }

    .pop-up-controls__edit {
        background-image: url('./../../img/edit.svg');
    }

    .pop-up-controls__delete {
        background-image: url('./../../img/dustbin.svg');
    }


    .pop-up-window {
        width: 50%;
        background-color: #fff;
        margin: 0 auto;
        padding: 40px;
    }

    .pop-up-window > h2,
    .pop-up-window > p {
        color: var(--blue);
    }

    .pop-up-window img {
        display: block;
        margin: 0 auto;
        max-height: 300px;
    }

</style>
