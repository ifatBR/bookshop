function getRandomIntEx(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    var diff = max - min;
    var randNum = Math.floor(Math.random() * diff) + min;
    return randNum;
}

function makeId() {

    var chars = '1234567890abcdefghijklmnopqrstuvwxyz';
    var id = '';
    for (var i = 0; i < 6; i++) {
        id += chars.charAt(getRandomIntEx(0, chars.length));
    }
    return id;
}