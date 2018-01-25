<template lang="html">

    <div class="menu">

        <aside class="side-menu">
            <p><a href="#">{{email}}</a></p>

            <nav class="side-menu-nav">
                <ul>
                    <li><router-link to="/tester">Мои тесты</router-link></li>
                    <li><router-link to="/newtest">Новый тест</router-link></li>
                    <li><router-link to="/respondents">Респонденты</router-link></li>
                    <li><router-link to="/stats">Статистика</router-link></li>
                    <li><a
                            href="exit"
                            @click.prevent="logout"
                        >
                        Выход</a></li>
                </ul>
            </nav>

        </aside>
    </div>

</template>

<script>

import axios from './../../node_modules/axios/dist/axios.js';

export default {

    methods: {

        //Выход их профиля
        logout() {
            localStorage.clear();
            axios.get('php/logout.php')
            .then( (res) => this.$router.push('/auth') )
            .catch( (err) => console.log(err));
        }

    },

    computed: {
        email() {
            return localStorage.getItem('user_email');
        }
    }

}
</script>

<style lang="css">

@import './../css/variables.css';

.menu {
    width: calc(var(--column) * 4);
    height: 100vh;
}

.side-menu {
    z-index: 102;
    position: fixed;
    top: 0;
    left: 0;
    -webkit-box-shadow: inset -4px 0px 3px rgba(0,0,0,0.2);
    box-shadow: inset -4px 0px 3px rgba(0,0,0,0.2);
    width: calc(var(--column) * 4);
    height: 100vh;
    background-color: var(--darkpurple);
    color: #fff;
}


.side-menu-nav {
    padding-top: 40px;
}


.side-menu-nav li {
    position: relative;
    list-style: none;
    padding: 20px 0px;
    padding-left: 40px;
    font-weight: bold;
    background-color: rgba(0,0,0,0);
    -webkit-transition: all .3s ease-in-out;
    -o-transition: all .3s ease-in-out;
    transition: all .3s ease-in-out;
}

.side-menu-nav li:hover {
    background-color: rgba(0,0,0,.4);
}

.side-menu-nav li:before {
    position: absolute;
    left: 0px;
    top: 0px;
    display: block;
    transform: scale(0);
    transform-origin: center;
    content: '';
    width: 3px;
    height: 100%;
    background-color: #fff;
    -webkit-transition: all .2s ease-in-out .2s;
    -o-transition: all .2s ease-in-out .2s;
    transition: all .2s ease-in-out .2s;
}

.side-menu-nav li:hover:before {
    transform: scale(1);
}

.side-menu-nav a {
    color: #fff;
}

.side-menu p {
    text-align: center;
}

.side-menu p:first-child a{
    color: #fff;
    opacity: .6;
    text-align: center;
    font-weight: bold;
}

</style>
