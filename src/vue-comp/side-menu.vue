<template lang="html">

    <div class="menu">

        <aside class="side-menu">
            <p><a href="#">profile</a></p>

            <nav class="side-menu-nav">
                <ul>
                    <li><router-link to="/tester">Мои тесты</router-link></li>
                    <li><router-link to="/newtest">Новый тест</router-link></li>
                    <li><router-link to="/tester/respondents">Респонденты</router-link></li>
                    <li><router-link to="/tester/statistic">Статистика</router-link></li>
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
            axios.get('php/logout.php')
            .then( (res) => this.$router.push('/auth') )
            .catch( (err) => console.log(err));
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
    width: calc(var(--column) * 4);
    height: 100vh;
    background-color: var(--purple);
    color: #fff;
}

.side-menu-nav {
    padding-top: 40px;
}


.side-menu-nav li {
    position: relative;
    list-style: none;
    margin-bottom: 20px;
    padding-left: 40px;
}

.side-menu-nav li:before {
    position: absolute;
    left: -60px;
    top: 2px;
    display: block;
    content: '';
    width: 20px;
    height: 1rem;
    background-color: #fff;
    -webkit-transition: all .2s ease-in-out;
    -o-transition: all .2s ease-in-out;
    transition: all .2s ease-in-out;
}

.side-menu-nav li:hover:before {
    left: 0px;
}

.side-menu-nav a {
    color: #fff;
}
</style>
