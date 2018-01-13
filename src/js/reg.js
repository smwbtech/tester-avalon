export default {

    //Проверка регистрационных данных пользователя
    checkData(data) {

        let result = {success: true, errorMsg: ''};

        for(let prop in data) {
            switch (prop) {
                case 'userEmail':
                    var pattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                    result.success = pattern.test(data[prop]);
                    if(!result.success) {
                        result.errorMsg = 'Неверный формат электронной почты, пожалуйста, введите электронный адрес формата "example@domain.com"';
                        return result;
                    }
                    break;
                case 'userPassword':
                    var pattern = /[a-z0-9!@#$%^&*]/i;
                    result.success = pattern.test(data[prop]) && data[prop].length >= 6;
                    if(!result.success) {
                        result.errorMsg = 'Поле пароля долдно содержать только буквы латинского алфавита и спецсимволы !@#$%^&*, а также должно содержать минимуи 6 символов';
                        return result;
                    }
                    break;
                case 'userPassword_re':
                    var pattern = new RegExp(data.userPassword);
                    result.success = pattern.test(data[prop]);
                    if(!result.success) {
                        result.errorMsg = 'Введенные пароли не совпадают! Попробуйте еще раз.';
                        return result;
                    }
                    break;
            }
        }
        return result;
    }
}
