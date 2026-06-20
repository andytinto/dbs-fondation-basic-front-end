const storageKey = 'STORAGE_KEY';
const submitAction = document.getElementById('bookForm'); 
const searchButton = document.getElementById('searchSubmit'); 
const trashButton = document.createElement('button');

document.addEventListener('DOMContentLoaded', function() {
  if (checkForStorage()) {
		renderBookList();
  }
  
    searchButton.addEventListener('click', function(event) {
		event.preventDefault();

      const searchField = document.getElementById('searchBookTitle');

      if (searchField) {
        const searchBookTitle = searchField.value;
        const foundBook = findBook(searchBookTitle);
		console.log('Search Book Title:', searchBookTitle);

        if (foundBook) {
			renderInCompleteBookList(foundBook);
		  	renderCompleteBookList(foundBook);
        } else if (searchField.value !== '') {
			document.getElementById('incompleteBookList').innerHTML = '';
    		document.getElementById('completeBookList').innerHTML = '';
          	alert('Data not found!');
        }
      } else {
        console.error("Element 'searchBookTitle' not found in the DOM.");
      }
    });
});

trashButton.addEventListener('click', function() {
	if (checkForStorage()) {
		localStorage.removeItem(storageKey);
		renderBookList();
	}
});

submitAction.addEventListener('submit', function(event) {
	event.preventDefault(); // Prevent the default form submission (page reload)

	const bookId = generateId();
	const inputTitle = document.getElementById('bookFormTitle').value;
	const inputAuthor = document.getElementById('bookFormAuthor').value;
	const inputYear = document.getElementById('bookFormYear').value;
    const inputIsComplete = document.getElementById('bookFormIsComplete').checked;
	const newUserData = {
		id: bookId,
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

function generateId() {
	return Date.now();
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

function renderInCompleteBookList(bookData) {
	const incompleteBookData =(bookData || []).filter(book => !book.isComplete);
	const incompleteBookList = document.querySelector('#incompleteBookList');
	if (incompleteBookList) {
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
	}
}

function renderCompleteBookList(bookData) {
	const completeBookData = (bookData || []).filter(book => book.isComplete);
	const completeBookList = document.querySelector('#completeBookList');
	if (completeBookList) {
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
}

function renderBookList() {
	const bookData = getBooks();
	renderInCompleteBookList(bookData);
	renderCompleteBookList(bookData);
}

// function renderBookList() {
// 	const bookData = getBooks();
// 	const incompleteBookData = bookData.filter(book => !book.isComplete);
// 	const incompleteBookList = document.querySelector('#incompleteBookList');
// 	incompleteBookList.innerHTML = '';

// 	for (let book of incompleteBookData) {
// 		let bookItem = document.createElement('div');
// 		bookItem.setAttribute('data-bookid', book.id);
// 		bookItem.setAttribute('data-testid', 'bookItem');

// 		bookItem.innerHTML = `
// 			<h3 data-testid="bookItemTitle">${book.title}</h3>
// 			<p data-testid="bookItemAuthor">Penulis: ${book.author}</p>
// 			<p data-testid="bookItemYear">Tahun: ${book.year}</p>
// 			<div>
// 				<button data-testid="bookItemIsCompleteButton">
// 					${book.isComplete ? 'Belum selesai' : 'Selesai dibaca'}
// 				</button>
// 				<button data-testid="bookItemDeleteButton">Hapus</button>
// 				<button data-testid="bookItemEditButton">Edit</button>
// 			</div>
// 		`;

// 		incompleteBookList.appendChild(bookItem);
// 	}

// 	const completeBookData = bookData.filter(book => book.isComplete);
// 	const completeBookList = document.querySelector('#completeBookList');
// 	completeBookList.innerHTML = '';

// 	for (let book of completeBookData) {
// 		let bookItem = document.createElement('div');
// 		bookItem.setAttribute('data-bookid', book.id);
// 		bookItem.setAttribute('data-testid', 'bookItem');

// 		bookItem.innerHTML = `
// 			<h3 data-testid="bookItemTitle">${book.title}</h3>
// 			<p data-testid="bookItemAuthor">Penulis: ${book.author}</p>
// 			<p data-testid="bookItemYear">Tahun: ${book.year}</p>
// 			<div>
// 				<button data-testid="bookItemIsCompleteButton">
// 					${book.isComplete ? 'Belum selesai' : 'Selesai dibaca'}
// 				</button>
// 				<button data-testid="bookItemDeleteButton">Hapus</button>
// 				<button data-testid="bookItemEditButton">Edit</button>
// 			</div>
// 		`;

// 		completeBookList.appendChild(bookItem);
// 	}
// }

function getBooks() {
	if (checkForStorage()) {
		const books = JSON.parse(localStorage.getItem(storageKey)) || [];
		return books;
	} else {
		return [];
	}
}

function getBookByTitle(title) {
	const bookData = getBooks();
	return bookData.filter(book =>
		book.title.toLowerCase() === title.toLowerCase()
	);
}

function findBook(title){
	const bookData = getBookByTitle(title);
	return bookData.length > 0 ? bookData : null;
}