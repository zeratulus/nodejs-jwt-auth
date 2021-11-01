// Каррирование (currying, curry) -> sum(a, b, c) can call as sum(a)(b)(c) || sum(a)(b)
//wtf?! =] -> https://learn.javascript.ru/currying-partials

function sum(a, b, c) {
    return a + b + c;
}

function curry(func) {
    // Новую функцию можно вызывать со случайным кол-вом аргументов Поэтому складываем их в массив
    return function curried(...args) {
        // Если все аргументы были переданны
        // Например для sum() нужно чтобы было передано 3 аргумента
        // У функции есть свойство length - ожидаемое кол-во аргументов
        if (args.length >= func.length) {
            return func.apply(this, args); // возвращаем результат функции
        } else {
            // Если не все еще аргументы были переданы - создаём новую функцию
            return function (...args2) {
                // Снова вызываем curried, конкатенируя аргументы двух функций
                return curried.apply(this, args.concat(args));
            };
        }
    };
}

let curriedSum = curry(sum);
console.log(curriedSum(1, 2, 3)); // 6, всё ещё можно вызывать нормально
console.log(curriedSum(1)(2, 3)); // 6, каррирование первого аргумента
console.log(curriedSum(1)(2)(3)); // 6, каррирование всех аргументов