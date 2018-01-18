<template lang="html">

    <div class="pop-up" @click="closeWindow">
        <div>
                <div class="pop-up-window" @click.stop>
                    <div class="pop-up-controls"></div>
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
        'testquestions'
    ],

    components: {
        'question-item': questionItem
    },

    data() {
        return {
            testTitle: this.testtite,
            testDescription: this.description,
            testImage: this.imglink ? this.imglink : 'img/default_test.svg',
            testStatus: this.status,
            testOptions: {
                timeLimit: +this.time !== 0 ? true : false,
                time: +this.time,
                anonym: +this.status ? true : false
            },
            questions: this.testquestions,
            pageY: undefined
        }
    },

    methods: {
        closeWindow() {
            console.log(this.questions);
            this.$emit('close-window');
        },

        handleScroll(e){
            console.log(e);
        }
    },

    created () {
        window.addEventListener('wheel', this.handleScroll);
        document.body.style.overflow = 'hidden';
    },

    destroyed () {
        window.removeEventListener('wheel', this.handleScroll);
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
    }

    .pop-up > div {
        overflow-y: scroll;
    }

    .pop-up-window {
        width: 50%;
        background-color: #fff;
        margin: 0 auto;
        padding: 40px;
    }

    .pop-up-window img {
        display: block;
        margin: 0 auto;
        max-height: 300px;
    }

</style>
