<template lang="html">

    <div class="tests-list-item" :id="testId + '_tst'" @click="showTest">

        <div class="tests-list-item-descr">
            <img class="tests-list-item__img" :src="testImage" alt="">
            <p class="tests-list-item__desc">{{testDescription}}</p>
        </div>

        <div class="tests-list-item-info">
            <h3>{{testTitle}}</h3>
            <a v-if="testStatus == 1" @click.stop.prevent="showLink" class="tests-list-item-info__link" href="link"><svg version="1.1" id="link" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	 viewBox="0 0 20 20" style="enable-background:new 0 0 20 20;" xml:space="preserve">
<g>
	<path class="st0" d="M17.3,2.4c-1.6-1.6-4.3-1.6-5.9,0l-3,3C8.2,5.6,8.2,6,8.4,6.2c0.3,0.3,0.7,0.3,0.9,0l3-3
		c0.5-0.5,1.3-0.8,2.1-0.8c0.8,0,1.5,0.3,2.1,0.8s0.8,1.3,0.8,2.1c0,0.8-0.3,1.5-0.8,2.1l-3.9,3.9c-1.1,1.1-3,1.1-4.1,0
		c-0.3-0.3-0.7-0.3-0.9,0s-0.3,0.7,0,0.9c0.8,0.8,1.9,1.2,3,1.2s2.1-0.4,3-1.2l3.9-3.9c0.8-0.8,1.2-1.8,1.2-3
		C18.6,4.2,18.1,3.1,17.3,2.4z"/>
	<path class="st0" d="M9.6,14.2l-2.5,2.5c-0.5,0.5-1.3,0.8-2.1,0.8c-0.8,0-1.5-0.3-2.1-0.8c-1.1-1.1-1.1-3,0-4.1L6.6,9
		c0.5-0.5,1.3-0.8,2.1-0.8c0.8,0,1.5,0.3,2.1,0.8c0.3,0.3,0.7,0.3,0.9,0c0.3-0.3,0.3-0.7,0-0.9c-1.6-1.6-4.3-1.6-5.9,0L2,11.7
		c-0.8,0.8-1.2,1.8-1.2,3c0,1.1,0.4,2.2,1.2,3c0.8,0.8,1.8,1.2,3,1.2c1.1,0,2.2-0.4,3-1.2l2.5-2.5c0.3-0.3,0.3-0.7,0-0.9
		C10.2,14,9.8,14,9.6,14.2z"/>
</g>
</svg>Ссылка</a>
            <a v-if="testStatus == 1" @ckick.stop.prevent="showResp" class="tests-list-item-info__resp" href=""><svg version="1.1" id="respondent" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	 viewBox="0 0 20 20" style="enable-background:new 0 0 20 20;" xml:space="preserve">
<g>
	<g>
		<path class="st0" d="M7.9,11.9H4.9c-2.1,0-3.7,1.6-3.8,3.7c-0.1,0.6-0.3,1.7,0.1,2.1c1,1,3.4,1.4,5.2,1.4c1.8,0,4.1-0.4,5.2-1.4
			c0.4-0.4,0.2-1.5,0.1-2.1C11.6,13.5,10,11.9,7.9,11.9z M11.1,17.1c-0.7,0.7-2.5,1.2-4.6,1.2c-2.1,0-3.9-0.5-4.6-1.2
			c-0.1-0.2-0.4-4.3,3.1-4.5c0.8,0,3.1,0,3.1,0C11.4,12.6,11.1,16.9,11.1,17.1L11.1,17.1z"/>
		<path class="st0" d="M6.4,11.2c1.7,0,3.1-1.4,3-3c0-1.7-1.3-3-3-3c-1.6,0-3,1.4-3,3C3.3,9.8,4.7,11.2,6.4,11.2z M6.4,5.9
			c1.3,0,2.3,1,2.3,2.3s-1,2.3-2.3,2.3s-2.3-1-2.3-2.3S5.1,5.9,6.4,5.9z"/>
		<path class="st0" d="M9.9,1v5.6h1.2v2.7l2.7-2.7H19V1H9.9z M18.3,5.8h-4.8l-1.7,1.7V5.8h-1.2V1.8h7.6V5.8z"/>
		<path class="st0" d="M14.4,2.8c0-0.1,0.1-0.1,0.2-0.1c0.1,0,0.2,0,0.2,0c0,0.1,0.1,0.2,0.1,0.2c0,0.1,0,0.2-0.1,0.2l-0.3,0.3
			c-0.1,0.1-0.2,0.2-0.2,0.3c0,0.1,0,0.2,0,0.3v0.3h0.7V4.2c0-0.1,0-0.2,0-0.2c0,0,0.1-0.1,0.2-0.2c0.1-0.1,0.2-0.2,0.2-0.2
			c0,0,0-0.1,0.1-0.1c0,0,0.1-0.1,0.1-0.1c0,0,0,0,0.1-0.1c0,0,0-0.2,0-0.3c0-0.3-0.1-0.5-0.3-0.7c-0.2-0.2-0.4-0.2-0.7-0.2
			c-0.3,0-0.5,0.1-0.7,0.3c-0.2,0.2-0.3,0.4-0.3,0.7h0.8C14.3,3,14.3,2.9,14.4,2.8L14.4,2.8z"/>
		<path class="st0" d="M14.6,4.6c-0.1,0-0.2,0-0.3,0.1c-0.1,0.1-0.1,0.2-0.1,0.3c0,0.1,0,0.2,0.1,0.3c0.1,0.1,0.2,0.1,0.3,0.1
			c0.1,0,0.2,0,0.3-0.1C14.9,5.3,15,5.2,15,5.1c0-0.1,0-0.2-0.1-0.3S14.7,4.6,14.6,4.6z"/>
	</g>
</g>
</svg>{{testRespondents}}</a>

        <a @click.stop.prevent="editHandler" href="" class="tests-list-item-info__link" v-if="testStatus == 0"><svg version="1.1" id="Layer_2" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	 viewBox="0 0 20 20" style="enable-background:new 0 0 20 20;" xml:space="preserve">
<path class="st0" d="M18.6,1.4c-1.2-1.2-3.2-1.2-4.4,0L1.8,13.8c0,0,0,0,0,0c0,0,0,0,0,0c0,0,0,0.1,0,0.1s0,0,0,0l0,0l-1.2,5.1
	c0,0,0,0,0,0.1l0,0c0,0,0,0.1,0,0.1c0,0,0,0,0,0s0,0.1,0.1,0.1c0,0,0.1,0.1,0.1,0.1c0,0,0.1,0,0.1,0c0,0,0.1,0,0.1,0L6,18.3h0h0
	c0,0,0,0,0.1,0c0,0,0,0,0,0l0,0L18.6,5.8C19.8,4.6,19.8,2.6,18.6,1.4z M18.1,1.9C19,2.7,19,4.1,18.4,5L15,1.6
	C15.9,1,17.3,1.1,18.1,1.9z M16.4,7L13,3.6l0.5-0.5l3.4,3.4L16.4,7z M2.2,17.8c-0.1-0.1-0.3-0.1-0.5,0l-0.3,0.2l0.9-3.7l1.5-0.2
	L3.7,16v0v0v0c0,0,0,0,0,0.1c0,0,0,0,0,0.1l0,0c0,0,0,0,0.1,0l0,0c0,0,0,0,0.1,0h0h0l0,0l0,0l0,0l0,0h0l1.8-0.2l-0.2,1.5l-3.7,0.9
	l0.3-0.3C2.4,18.2,2.4,18,2.2,17.8z M6.5,15.9l7.7-7.7c0.1-0.1,0.1-0.3,0-0.5c-0.1-0.1-0.3-0.1-0.5,0L6,15.4l-1.7,0.2L4.6,14
	l7.7-7.7c0.1-0.1,0.1-0.3,0-0.5c-0.1-0.1-0.3-0.1-0.5,0l-7.7,7.7L3,13.6l9.5-9.5l3.4,3.4L6.4,17L6.5,15.9z M17.4,6L14,2.6l0.5-0.5
	l3.4,3.4L17.4,6z"/>
</svg>редактировать</a>
        <a v-if="testStatus == 0" @click.stop.prevent="deleteHandler" class="tests-list-item-info__resp" href=""><svg version="1.1" id="delete" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	 viewBox="0 0 20 20" style="enable-background:new 0 0 20 20;" xml:space="preserve">
<g>
	<g>
		<g>
			<path class="st0" d="M15.5,6.4c0-0.2,0.1-0.3,0.3-0.3c0.2,0,0.3,0.1,0.3,0.3v10.8c0,0.5-0.2,0.9-0.5,1.2
				c-0.3,0.3-0.8,0.5-1.2,0.5H5.5c-0.5,0-0.9-0.2-1.2-0.5c-0.3-0.3-0.5-0.8-0.5-1.2V6.4c0-0.2,0.1-0.3,0.3-0.3s0.3,0.1,0.3,0.3v10.8
				c0,0.3,0.1,0.6,0.3,0.8c0.2,0.2,0.5,0.3,0.8,0.3h8.8c0.3,0,0.6-0.1,0.8-0.3s0.3-0.5,0.3-0.8L15.5,6.4L15.5,6.4z"/>
			<path class="st0" d="M7.8,16.5c0,0.2-0.1,0.3-0.3,0.3c-0.2,0-0.3-0.1-0.3-0.3v-10c0-0.2,0.1-0.3,0.3-0.3c0.2,0,0.3,0.1,0.3,0.3
				V16.5z"/>
			<path class="st0" d="M10.2,16.5c0,0.2-0.1,0.3-0.3,0.3c-0.2,0-0.3-0.1-0.3-0.3v-10c0-0.2,0.1-0.3,0.3-0.3c0.2,0,0.3,0.1,0.3,0.3
				V16.5z"/>
			<path class="st0" d="M12.6,16.5c0,0.2-0.1,0.3-0.3,0.3S12,16.7,12,16.5v-10c0-0.2,0.1-0.3,0.3-0.3s0.3,0.1,0.3,0.3V16.5
				L12.6,16.5z"/>
			<path class="st0" d="M7.6,2.6c0,0.2-0.1,0.3-0.3,0.3c-0.2,0-0.3-0.1-0.3-0.3c0-0.5,0.2-0.9,0.5-1.2c0.3-0.3,0.8-0.5,1.2-0.5H11
				c0.5,0,0.9,0.2,1.2,0.5c0.3,0.3,0.5,0.8,0.5,1.2c0,0.2-0.1,0.3-0.3,0.3s-0.3-0.1-0.3-0.3c0-0.3-0.1-0.6-0.3-0.8
				c-0.2-0.2-0.5-0.3-0.8-0.3H8.8C8.5,1.5,8.2,1.6,8,1.8C7.8,2,7.6,2.3,7.6,2.6z"/>
			<path class="st0" d="M3.3,3.5h13.2c0.3,0,0.5,0.1,0.7,0.3l0,0c0.2,0.2,0.3,0.4,0.3,0.7v0.7c0,0.2-0.1,0.3-0.3,0.3h0H2.6
				c-0.2,0-0.3-0.1-0.3-0.3v0V4.5c0-0.3,0.1-0.5,0.3-0.7l0,0C2.8,3.6,3,3.5,3.3,3.5L3.3,3.5z M16.5,4H3.3C3.2,4,3.1,4.1,3,4.2l0,0
				C2.9,4.2,2.9,4.3,2.9,4.5v0.4h14V4.5c0-0.1,0-0.2-0.1-0.3l0,0C16.7,4.1,16.6,4,16.5,4z"/>
		</g>
	</g>
</g>
</svg>удалить</a>


        </div>

        <input :class="[testLink]"></input>

    </div>

</template>

<script>

import axios from './../../../node_modules/axios/dist/axios.js';

export default {

    props: ['description', 'testtitle', 'status', 'imglink', 'testid', 'respondents'],

    data() {
        return {
            testTitle: this.testtitle,
            testDescription: this.description,
            testStatus: this.status,
            testId: this.testid,
            testImage: this.imglink ? this.imglink : 'img/default_test.svg',
            testRespondents: this.respondents,
            testLink: 'testLink-' + this.testid
        }
    },

    computed: {
        testLinkText() {
            return (window.location.origin + '/exec?' + encodeURIComponent(btoa('test_id=' + (+this.testid))));
        }
    },

    methods: {
        // Событие - показать ссылку на тест
        showLink() {
            var elem = document.querySelector('.testLink-' + this.testId);
            elem.value = window.location.origin + '/exec?' + encodeURIComponent(btoa('test_id=' + (+this.testid)));
            elem.select();
            document.execCommand('copy');
            let msg = 'Ссылка скопирована в буфер обмена';
            this.$emit('copy-link',msg);
        },

        // Событие - показать респондентов, которые прошли данный тест
        showResp() {
            console.log(this.testRespondents)
        },

        // Событие - редактирование теста
        editHandler() {
            this.$emit('edit-test-new', this.testId);
        },

        // Событие - удаление теста
        deleteHandler() {
            if(window.confirm('Вы точто хотите удалить тест?')) {
                let query = this.testId;
                axios.get(`php/deletetest.php?test_id=${query}`)
                .then( (res) => {
                    console.log('Server response after test deletion');
                    console.log(res.data);
                    if(res.data.status) {
                        let msg = 'Тест успешно удален из базы данных';
                        this.$emit('delete-info', 3, msg);
                    }
                    else {
                        let msg = 'Ошибка базы данных, попробуйте позже';
                        this.$emit('delete-info', 1, msg);
                    }
                })
                .catch( (err) => console.log(err));
            }
        },

        showTest(e) {
            this.$emit('show-test', this.testId);
        }
    }



}
</script>

<style lang="css">

@import './../../css/variables.css';

.tests-list-item {
    position: relative;
    width: calc(var(--column) * 4);
    min-height: calc(var(--row) * 4);
    margin-bottom: calc(var(--row) * 1);
    -webkit-box-shadow: 1px 1px 4px rgba(0,0,0,0.1);
    box-shadow: 1px 1px 4px rgba(0,0,0,0.1);
    cursor: pointer;
    background-color: #fff;
    -webkit-transition: all .3s ease-in-out;
    -o-transition: all .3s ease-in-out;
    transition: all .3s ease-in-out;
}

.tests-list-item:hover {
    background-color: var(--purple);
    -webkit-box-shadow: 2px 2px 6px rgba(0,0,0,0.3);
    box-shadow: 2px 2px 6px rgba(0,0,0,0.3);
}

.tests-list-item:hover .tests-list-item__img {
    opacity: 0;
}

.tests-list-item:hover .tests-list-item__desc {
    top: 20px;
    opacity: 1;
}

.tests-list-item:hover .tests-list-item-info h3 {
    color: #fff;
}

.tests-list-item:hover .tests-list-item-info h3:before {
    background-color: #fff;
}

.tests-list-item:hover .tests-list-item-info__link,
.tests-list-item:hover .tests-list-item-info__resp {
    color: #fff;
}

.tests-list-item:hover .tests-list-item-info__link svg,
.tests-list-item:hover .tests-list-item-info__resp svg {
    fill: #fff;
}

.tests-list-item-descr {
    position: relative;
    overflow: hidden;
}

.tests-list-item__img {
    display: block;
    width: 100%;
    max-height: 200px;
    -webkit-transition: opacity .1s ease-in-out;
    -o-transition: opacity .1s ease-in-out;
    transition: opacity .1s ease-in-out;
}

.tests-list-item__desc {
    position: absolute;
    top: -100%;
    padding: 0px 20px;
    opacity: 0;
    color: #fff;
    font-size: .9rem;
    -webkit-transition: all .3s ease-in-out;
    -o-transition: all .3s ease-in-out;
    transition: all .3s ease-in-out;
}

.tests-list-item-info {
    padding: 20px;
    margin-bottom: 30px;
}

.tests-list-item-info h3{
    position: relative;
    color: var(--blue);
    min-height: 4rem;
    max-height: 4.5rem;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-transition: all .3s ease-in-out;
    -o-transition: all .3s ease-in-out;
    transition: all .3s ease-in-out;
}

.tests-list-item-info h3:before {
    display: block;
    position: absolute;
    content: '';
    top: -5px;
    left: 0;
    width: 50px;
    height: 5px;
    background-color: var(--purple);
    -webkit-transition: all .3s ease-in-out;
    -o-transition: all .3s ease-in-out;
    transition: all .3s ease-in-out;
}

.tests-list-item-info__link,
.tests-list-item-info__resp
 {
    position: absolute;
    bottom: 20px;
    padding-left: 30px;
    display: block;
    color: var(--blue);
    font-size: .8rem;
    -webkit-transition: all .3s ease-in;
    -o-transition: all .3s ease-in;
    transition: all .3s ease-in;
}

.tests-list-item-info__link {
    left: 20px;
}

.tests-list-item-info__resp {
    right: 20px;
}

.tests-list-item-info__link svg,
.tests-list-item-info__resp svg {
    width: 20px;
    position: absolute;
    top: 0px;
    left: 0px;
    fill: var(--purple);
    padding-right: 5px;
    -webkit-transition: all .3s ease-in-out;
    -o-transition: all .3s ease-in-out;
    transition: all .3s ease-in-out;
}

input[class^="testLink"] {
    position: fixed;
    right: -200%;
}

@media screen and (max-width: 812px) {

    .tests-list-item {
        margin: 0;
        margin-bottom: 40px;
        width: 90%;
    }

}






</style>
