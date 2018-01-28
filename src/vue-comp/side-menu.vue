<template lang="html">

    <div class="menu">

        <a href="" :class="triggerClass" @click.prevent="menuTrigger">
            <span></span>
            <span></span>
            <span></span>
        </a>

        <aside :class="sideMenuStyle">
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

    data() {
        return {
            mobileMenu: false
        }
    },

    methods: {

        //Выход их профиля
        logout() {
            localStorage.clear();
            axios.get('php/logout.php')
            .then( (res) => this.$router.push('/auth') )
            .catch( (err) => console.log(err));
        },

        menuTrigger() {
            this.mobileMenu ? this.mobileMenu = false : this.mobileMenu = true;
            console.log(this.mobileMenu);
        }

    },

    computed: {
        email() {
            return localStorage.getItem('user_email');
        },

        sideMenuStyle() {
            return {
                'side-menu': true,
                'side-menu__active': this.mobileMenu
            }
        },

        triggerClass() {
            return {
                'trigger': true,
                'trigger_active': this.mobileMenu
            }
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
    background-image: linear-gradient(to top, var(--darkpurple), var(--purple) 95%);
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
    display: block;
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

.trigger {
    display: none;
}

@media screen and (max-width: 812px) {
    .menu {
        width: 0;
    }

    .trigger {
        display: block;
        position: fixed;
        left: 10px;
        top: 10px;
        z-index: 110;
    }

    .trigger span {
        display: block;
        width: 40px;
        height: 5px;
        background-color: var(--darkpurple);
        -webkit-transition: all .3s ease-in-out;
        -o-transition: all .3s ease-in-out;
        transition: all .3s ease-in-out;
    }

    .trigger_active span {
        background-color: #fff;
    }

    .trigger span:nth-child(2) {
        margin: 10px 0px;
    }


    .side-menu {
        width: calc(var(--column-mobile) * 8);
        left: -100%;
        transition: left .3s ease-in-out;
    }

    .side-menu-nav {
        padding-top: 60px;
    }

    .side-menu p {
        position: absolute;
        font-size: .7rem;
        bottom: 10px;
        text-align: center;
        width: 100%;
    }

    .side-menu p a {
        display: block;
    }

    .side-menu__active {
        left: 0;
    }
}

</style>
