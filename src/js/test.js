const QUESTIONS_MIN_NUM = 3;
const VARS_MIN_NUM = 2;
const VARS_MAX_NUM = 10;


export default {

    check(testObj) {

        // console.log(testObj);

        let res = {
            status: true,
            msg: '',
            code: 3,
            questionId: undefined
        };

        //Обходим объект теста и выполняем проверки
        for(let prop in testObj) {

            switch (prop) {
                case 'title':
                    res.status = checkTitle(testObj.title);
                    if(!res.status) {
                        res.msg = 'Поле названия теста должно быть заполнено и должно содержать строку длинной от 3 до 200 символов! Допкскаются буквы кириллического и латинского алфавита, а так же числа и знак нижнего подчеркивния';
                        res.code = 1;
                        return res;
                    }
                    break;
                case 'description':
                    res.status = checkDesc(testObj.description);
                    if(!res.status) {
                        res.msg = 'Поле описание должно быть не длиннее 1200 символов.';
                        res.code = 1;
                        return res;
                    }
                    break;
                case 'questions':

                    let check = checkQuestions(testObj.questions);
                    res.status = check.status;
                    if(!res.status) {
                        res.msg = check.msg;
                        res.questionId = check.questionId;
                        res.code = check.code;
                        return res;
                    }
                    break;
                default:

            }
        }

        return res;

    }

}

// Helpers
function checkTitle(title) {
    let pattern = /[а-яa-z0-9_"]{3,200}/i;
    return pattern.test(title);
}

function checkDesc(desc) {
    let pattern = /.{0,1200}/i;
    return pattern.test(desc);
}

function checkQuestions(questions) {
    let res = {
        status: true,
        msg: '',
        code: 3,
        questionId: undefined
    };

    // Если в тесте меньше константного значения вопросов
    if(questions.length <= QUESTIONS_MIN_NUM) {
        res.status = false;
        res.code = 1;
        res.msg = 'В тесте должно быть, как минимум 4 вопроса';
        return res;
    }

    for(let i = 0; i < questions.length; i++) {
        let check = checkQuestion(questions[i]);
        if(!check.status) {
            res.status = check.status;
            res.code = 1;
            res.msg = check.msg;
            res.questionId = check.questionId;
            return res;
        }
    }

    return res;
}

function checkQuestion(question) {

    let res = {
        status: true,
        questionId: question.id,
        msg: ''
    }
    // Проверяем поле описание вопроса
    if(question.text.length < 10 || question.text.length > 800) {
        res.status = false;
        res.questionId = question.id;
        res.msg = 'Поле текста вопроса должно быть заполнено. Количество символов должно быть больше 10 и меньше 800';
        return res;
    }

    else {

        // Проверка вариантов вопросов с одинм или несколькими вариантами ответа
        if(question.type === 1 || question.type === 2) {

            // Минимальное число вариантов
            if(question.vars.length < VARS_MIN_NUM) {
                res.status = false;
                res.questionId = question.id;
                res.msg = 'Вы должны предоставить пользователю как минимум ' + VARS_MIN_NUM + ' варианта на выбор';
                return res;
            }

            // Максимальное число вариантов
            else if(question.vars.length > VARS_MAX_NUM) {
                res.status = false;
                res.questionId = question.id;
                res.msg = 'Количество вариантов не должно превышать ' + VARS_MAN_NUM;
                return res;
            }

            else if(!checkMultiVarsText(question.vars)) {
                res.status = false;
                res.questionId = question.id;
                res.msg = 'Текст варианта ответа должен быть заполнен и не должен превышать длинной 200 символов';
                return res;
            }

            else if(!checkMultiVarsRights(question.vars)) {
                res.status = false;
                res.questionId = question.id;
                res.msg = 'Вы должны указать, как минимум 1 правильный вариант ответа';
                return res;
            }


        }

        //Проверка вопроса свариантом ответа - строка
        else if(question.type === 3) {
            if(question.vars.length === 0) {
                res.status = false;
                res.questionId = question.id;
                res.msg = 'Вы должны указать, как минимум 1 правильный вариант ответа';
                return res;
            }

        }
        return res;
    }
}

function checkMultiVarsRights(vars) {
    for(let i = 0; i < vars.length; i++) {
        if(vars[i].isRight) return true;
    }
    return false;
}

function checkMultiVarsText(vars) {
    for(let i = 0; i < vars.length; i++) {
        vars[i].text.length;
        if(vars[i].text.length === 0 || vars[i].text.length > 500) {
            return false;
        }
    }
    return true;
}
