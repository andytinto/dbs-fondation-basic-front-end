const storageKey = 'STORAGE_KEY';
const submitAction = document.getElementById('bookForm'); 

document.addEventListener('DOMContentLoaded', function() {
  if (checkForStorage()) {
    renderBookList();
  }
});

submitAction.addEventListener('submit', function(event) {
	event.preventDefault(); // Prevent the default form submission (page reload)

	const inputTitle = document.getElementById('bookFormTitle').value;
	const inputAuthor = document.getElementById('bookFormAuthor').value;
	const inputYear = document.getElementById('bookFormYear').value;
    const inputIsComplete = document.getElementById('bookFormIsComplete').checked;
	const newUserData = {
		title: inputTitle,
		author: inputAuthor,
		year: inputYear,
		isComplete: inputIsComplete
	}
	putBookList(newUserData);
	renderBookList();
});

function checkForStorage() {
	return typeof(Storage) !== 'undefined';
}

function putBookList(data) {
	if (checkForStorage()) {
		let bookData = [];
		if (localStorage.getItem(storageKey) !== null) {
			bookData = JSON.parse(localStorage.getItem(storageKey));
		}
		bookData.unshift(data);
		localStorage.setItem(storageKey, JSON.stringify(bookData));
	}
}

function renderBookList() {
	const bookData = getBooks();
	const incompleteBookData = bookData.filter(book => !book.isComplete);
	const incompleteBookList = document.querySelector('#incompleteBookList');
	incompleteBookList.innerHTML = '';

	for (let book of incompleteBookData) {
		let bookItem = document.createElement('div');
		bookItem.setAttribute('data-bookid', book.id);
		bookItem.setAttribute('data-testid', 'bookItem');

		bookItem.innerHTML = `
			<h3 data-testid="bookItemTitle">${book.title}</h3>
			<p data-testid="bookItemAuthor">Penulis: ${book.author}</p>
			<p data-testid="bookItemYear">Tahun: ${book.year}</p>
			<div>
				<button data-testid="bookItemIsCompleteButton">
					${book.isComplete ? 'Belum selesai' : 'Selesai dibaca'}
				</button>
				<button data-testid="bookItemDeleteButton">Hapus</button>
				<button data-testid="bookItemEditButton">Edit</button>
			</div>
		`;

		incompleteBookList.appendChild(bookItem);
	}

	const completeBookData = bookData.filter(book => book.isComplete);
	const completeBookList = document.querySelector('#completeBookList');
	completeBookList.innerHTML = '';

	for (let book of completeBookData) {
		let bookItem = document.createElement('div');
		bookItem.setAttribute('data-bookid', book.id);
		bookItem.setAttribute('data-testid', 'bookItem');

		bookItem.innerHTML = `
			<h3 data-testid="bookItemTitle">${book.title}</h3>
			<p data-testid="bookItemAuthor">Penulis: ${book.author}</p>
			<p data-testid="bookItemYear">Tahun: ${book.year}</p>
			<div>
				<button data-testid="bookItemIsCompleteButton">
					${book.isComplete ? 'Belum selesai' : 'Selesai dibaca'}
				</button>
				<button data-testid="bookItemDeleteButton">Hapus</button>
				<button data-testid="bookItemEditButton">Edit</button>
			</div>
		`;

		completeBookList.appendChild(bookItem);
	}
}

function getBooks() {
	if (checkForStorage()) {
		const books = JSON.parse(localStorage.getItem(storageKey)) || [];
		return books;
	} else {
		return [];
	}
}