export default {

    //Проверка авторизации пользователя
    checkUser() {
        var token = localStorage.getItem('tester_token');
        if(!token) return false;
        else {
            return true;
        }
    }
}
