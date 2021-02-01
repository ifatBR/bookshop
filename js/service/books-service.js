'use strict';

var gBooks;
var gCurrBook;

const BOOKS_KEY = 'books';
const CURR_BOOK_KEY = 'currBook';
const PAGE_SIZE = 6;
var gPageIdx = 0;

var gSortBy = 'id';

_createBooks();

function getBooks() {
    var startIdx = PAGE_SIZE * gPageIdx;
    var books = sortBooks();

    return books.slice(startIdx, startIdx + PAGE_SIZE);
}

function removeBook(bookId) {
    var bookIdx = _getBookIdxById(bookId);

    if (bookIdx >= 0) gBooks.splice(bookIdx, 1);
    _saveBooksToStorage();
}

function addBook(bookName, price) {
    gBooks.push(_createBook(bookName, price));
    _saveBooksToStorage();
}

function updateBook(bookId, newPrice) {
    var bookIdx = _getBookIdxById(bookId);
    gBooks[bookIdx].price = newPrice;
    _saveBooksToStorage();
}

function getBookById(bookId) {
    var bookIdx = _getBookIdxById(bookId);
    return gBooks[bookIdx];
}

function setCurrBookById(bookId) {
    gCurrBook = getBookById(bookId);
    _saveCurrBookToStorage();
}

function getCurrBook() {
    return loadFromStorage(CURR_BOOK_KEY);
}

function changeRate(rateDiff) {
    var bookId = getCurrBook().id;
    var book = getBookById(bookId);
    if(!book.rate && rateDiff <0 || book.rate ===10 && rateDiff>0) return; //BETTER option, saves some actions
    var rate = book.rate;
    book.rate += rateDiff;
    // if (book.rate < 0) book.rate = 0;
    // else if (book.rate > 10) book.rate = 10;

    gCurrBook = book;
    _saveCurrBookToStorage();
    _saveBooksToStorage();
}

function changePage(pageDiff) {
    if(((gPageIdx+1) * PAGE_SIZE >= gBooks.length && pageDiff>0) || (gPageIdx <= 0 && pageDiff<0)) return; //BETTER option, saves some actions
    gPageIdx += pageDiff;

    // if (gPageIdx * PAGE_SIZE >= gBooks.length) {
    //     var maxPagesCount = Math.ceil(gBooks.length / PAGE_SIZE) - 1;//-1 because its idx
    //     gPageIdx = maxPagesCount;
    // } else if (gPageIdx < 0) gPageIdx = 0;
}

function sortBooks() {
    var books = [...gBooks];//notice- copying the global array! not sorting the original
    return books.sort(function (book1, book2) {
        if (gSortBy === 'price') return book1[gSortBy] - book2[gSortBy];
        return book1[gSortBy].localeCompare(book2[gSortBy]);
    });
}

function setSortBy(sortBy) {
    gSortBy = sortBy;
}

function getPagesCount() {
    return Math.ceil(gBooks.length / PAGE_SIZE);
}

function getCurrIdx(){
    return gPageIdx;
}

function updatePageIdx(pageIdx){
    gPageIdx = pageIdx;
}

//private funcs\\\\\\\\\\\\\\\
function _createBooks() {
    var books = loadFromStorage(BOOKS_KEY);
    if (!books || !books.length) {
        books = [];

        for (var i = 0; i < 30; i++) {
            var price = getRandomIntEx(30, 101);
            var bookName = _genBookName();
            books.push(_createBook(bookName, price));
        }
    }
    gBooks = books;
    _saveBooksToStorage();
}

function _createBook(name, price) {
    var book = {
        id: makeId(),
        name,
        price,
        imgUrl: _getBookCover(),
        description: _genBookDescription(),
        rate: 0,
    };

    return book;
}

function _saveBooksToStorage() {
    saveToStorage(BOOKS_KEY, gBooks);
}

function _saveCurrBookToStorage() {
    saveToStorage(CURR_BOOK_KEY, gCurrBook);
}

function _getBookIdxById(bookId) {
    return gBooks.findIndex(function (book) {
        return book.id === bookId;
    });
}

function _getBookCover() {
    var idx = getRandomIntEx(1, 5);
    return `img/book${idx}.jpg`;
}

function _genBookName() {
    var prefix = ['a', 'the', 'my', 'your', 'for a'];
    var objects = [
        'river',
        'house',
        'town',
        'world',
        'family',
        'box',
        'table',
        'doll',
        'truth',
        'woman',
        'man',
        'girl',
        'car',
        'boss',
        'soul'
    ];

    var adjectives = [
        'peculiar',
        'heavy',
        'lovley',
        'angry',
        'soft',
        'happy',
        'sad',
        'scary',
        'startling',
        'burning',
        'hard',
        'tough',
        'crazy',
        'poor',
        'joyfull',
    ];

    var randPrefix = prefix[getRandomIntEx(0, prefix.length)];
    var randAdjective = adjectives[getRandomIntEx(0, adjectives.length)];
    var randObject = objects[getRandomIntEx(0, objects.length)];
    var bookName = `${randPrefix} ${randAdjective} ${randObject}`;
    return bookName;
}

function _genBookDescription() {
    var storyTypes = ['book', 'story', 'tale', 'background', 'history'];
    var objects = ['river', 'house', 'small town', 'world', 'family'];
    var adjectives = ['mesmerizing', 'heavy', 'lovley', 'happy', 'sad', 'scary', 'startling'];
    var connectingWords = ['or', 'and', 'of', 'about', 'about', 'from', 'where'];
    var bookDescription = 'a';
    for (var i = 0; i < 30; i++) {
        var randObject = objects[getRandomIntEx(0, objects.length)];
        var randStoryType = storyTypes[getRandomIntEx(0, storyTypes.length)];
        var randAdjective = adjectives[getRandomIntEx(0, adjectives.length)];
        var randConnectWord = connectingWords[getRandomIntEx(0, connectingWords.length)];
        bookDescription += ` ${randAdjective} ${randStoryType} ${randConnectWord}`;

        randAdjective = adjectives[getRandomIntEx(0, adjectives.length)];
        randConnectWord = connectingWords[getRandomIntEx(0, connectingWords.length)];
        bookDescription += ` ${randAdjective} ${randObject} ${randConnectWord}`;
    }
    var people = ['woman', 'boy', 'man', 'girl', 'nomad', 'farmer', 'housewife'];
    var randPerson = people[getRandomIntEx(0, people.length)];
    bookDescription += ` a ${randPerson}.`;
    return bookDescription;
}
