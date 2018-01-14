import axios from './../../node_modules/axios/dist/axios.js';

export default {

    //Проверка авторизации пользователя
    checkUser() {

        return axios.get('php/checkauth.php')
        .then( (res) => {
            return res.data === 1;
        })
        .catch( (err) => {
            console.log(err);
        });
        // return false;

    }
}
