'use strict';

function onInit() {
    renderBooks();
    renderPagination();
}

function renderBooks() {
    var books = getBooks();
    var strHtml = books
        .map(function (book) {
            return `
        <tr> 
            \t<td class="row-start id-cell">${book.id}</td>\n
            \t<td class="name-cell">${book.name}</td>\n
            \t<td class="price-cell">$${book.price}</td>\n
            \t<td class="action"><button  onclick="onReadBook('${book.id}')">Read</button></td>\n
            \t<td class="action"><button onclick="onUpdateBook('${book.id}')">Update</button></td>\n
            \t<td class="row-end action"><button onclick="onRemoveBook('${book.id}')">Delete</button></td>\n
        </tr>\n`;
        })
        .join('');

    document.querySelector('.books-list').innerHTML = strHtml;
}


function renderModal(elModal) {
    var currBook = getCurrBook();
    // console.log({currBook});
    elModal.querySelector('.book-name').innerText = currBook.name;
    elModal.querySelector('.book-cover').src = currBook.imgUrl;
    elModal.querySelector('.book-description').innerText = currBook.description;
    elModal.querySelector('div.rate.num').innerText = currBook.rate;
}

function renderPagination(){
    var pagesCount = getPagesCount();
    var startIdx = getCurrIdx();
    if(pagesCount-startIdx <3) startIdx =  pagesCount-3;
    var elPaginationUl = document.querySelector('.pagination ul');
    var strHtml = `<li><button class="end-button prev" onclick="onChangePage(-1)">Prev</button></li>`
    for(var i=startIdx; i<startIdx+3; i++){
        strHtml+=`<li><button class="mid-button page-num" onclick="onGoToPage(${(i)})">${(i+1)}</button></li>`
    }
    strHtml += `<li><button class="end-button next" onclick="onChangePage(1)">Next</button></li>`
    elPaginationUl.innerHTML = strHtml;
}

function onRemoveBook(bookId) {
    removeBook(bookId);
    renderBooks();
    renderPagination();
}

function onAddBook() {
    var elBookDetails = document.querySelector('.new-book.modal');
    elBookDetails.classList.remove('hide');
    renderPagination();

}

function onSubmitBook(ev){
    ev.preventDefault();

    var elBookName = document.querySelector('input[name=book-name]');
    var elBookPrice = document.querySelector('input[name=book-price]');
    var bookName = elBookName.value;
    var bookPrice = elBookPrice.value;
    addBook(bookName, bookPrice);
    
    elBookName.value = '';
    elBookPrice.value = '';
    renderBooks();
}

function onUpdateBook(bookId) {
    var elForm = document.querySelector('.update-price.modal')
    elForm.classList.remove('hide');
    setCurrBookById(bookId);
    renderUpdatePriceModal();
}

function onSubmitNewPrice(ev,elForm){
    ev.preventDefault();
    elForm.classList.add('hide');

    var elPriceInput = elForm.querySelector('input');
    var newPrice = elPriceInput.value;
    var bookId = getCurrBook().id;
    updateBook(bookId, newPrice);

    elPriceInput.value = '';
    renderBooks();
}

function onHideModal(className) {
    var elModal = document.querySelector(`${className}.modal`);
    elModal.classList.add('hide');
}

function onReadBook(bookId) {
    setCurrBookById(bookId);
    var elBookDetails = document.querySelector('.book-details.modal');
    elBookDetails.classList.remove('hide');
    renderModal(elBookDetails);
}

function onChangeRate(rateDiff) {
    changeRate(rateDiff);
    var bookId = getCurrBook().id;
    onReadBook(bookId);
}

function onChangePage(pageDiff){
    changePage(pageDiff);
    renderBooks();
    renderPagination();
}

function onGoToPage(pageIdx){
    updatePageIdx(pageIdx);
    renderBooks();
    renderPagination();

}

function onSortBooks(sortBy){
    setSortBy(sortBy);
    renderBooks();
}