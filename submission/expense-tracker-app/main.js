// State Management
let transactions = [];
let editingTransactionId = null;
let searchQuery = '';

// DOM Elements
const transactionForm = document.getElementById('transactionForm');
const titleInput = document.getElementById('transactionFormTitleInput');
const amountInput = document.getElementById('transactionFormAmountInput');
const dateInput = document.getElementById('transactionFormDateInput');
const typeSelect = document.getElementById('transactionFormTypeSelect');
const submitButton = document.getElementById('transactionFormSubmitButton');

const searchForm = document.getElementById('searchTransactionForm');
const searchInput = document.getElementById('searchTransactionFormTitleInput');

const incomeList = document.getElementById('incomeList');
const expenseList = document.getElementById('expenseList');

const balanceDisplay = document.querySelector('.tracker-summary__balance-amount');
const incomeDisplay = document.querySelector('.tracker-summary__stat-amount--income');
const expenseDisplay = document.querySelector('.tracker-summary__stat-amount--expense');

// Initialize App
window.addEventListener('DOMContentLoaded', () => {
  // Load data from localStorage
  const savedTransactions = localStorage.getItem('transactions');
  if (savedTransactions) {
    transactions = JSON.parse(savedTransactions);
  }

  // Initial render
  document.dispatchEvent(new CustomEvent('transactions-changed'));

  // Set default date to today
  const today = new Date().toISOString().split('T')[0];
  dateInput.value = today;
});

// Save and Dispatch Change Event
const saveAndDispatch = () => {
  localStorage.setItem('transactions', JSON.stringify(transactions));
  document.dispatchEvent(new CustomEvent('transactions-changed'));
};

// Event Listener for State Changes
document.addEventListener('transactions-changed', () => {
  renderDashboard();
  renderLists();
});

// Render Dashboard (Balance, Income, Expense)
const renderDashboard = () => {
  let totalIncome = 0;
  let totalExpense = 0;

  transactions.forEach(t => {
    if (t.type === 'income') {
      totalIncome += t.amount;
    } else if (t.type === 'expense') {
      totalExpense += t.amount;
    }
  });

  const totalBalance = totalIncome - totalExpense;

  balanceDisplay.textContent = `Rp${totalBalance.toLocaleString('id-ID')}`;
  incomeDisplay.textContent = `Rp${totalIncome.toLocaleString('id-ID')}`;
  expenseDisplay.textContent = `Rp${totalExpense.toLocaleString('id-ID')}`;
};

// Render Transaction Lists
const renderLists = () => {
  // Clear lists
  incomeList.innerHTML = '';
  expenseList.innerHTML = '';

  // Filter transactions based on search query
  const filteredTransactions = transactions.filter(t => 
    t.title.toLowerCase().includes(searchQuery)
  );

  filteredTransactions.forEach(transaction => {
    const item = createTransactionElement(transaction);

    if (transaction.type === 'income') {
      incomeList.appendChild(item);
    } else {
      expenseList.appendChild(item);
    }
  });
};

// Create HTML Element using document.createElement
const createTransactionElement = (transaction) => {
  // Main Container
  const item = document.createElement('div');
  item.setAttribute('data-testid', 'transactionItem');
  item.classList.add('tracker-transaction-item');

  // Transaction Icon wrapper based on type
  const icon = document.createElement('div');
  icon.classList.add('tracker-transaction-item__icon');
  if (transaction.type === 'income') {
    icon.classList.add('tracker-transaction-item__icon--income');
    icon.textContent = '📈';
  } else {
    icon.classList.add('tracker-transaction-item__icon--expense');
    icon.textContent = '📉';
  }
  item.appendChild(icon);

  // Detail section
  const detail = document.createElement('div');
  detail.classList.add('tracker-transaction-item__detail');

  const title = document.createElement('h3');
  title.setAttribute('data-testid', 'transactionItemTitle');
  title.classList.add('tracker-transaction-item__title');
  title.textContent = transaction.title;
  detail.appendChild(title);

  const date = document.createElement('p');
  date.setAttribute('data-testid', 'transactionItemDate');
  date.classList.add('tracker-transaction-item__date');
  date.textContent = `Tanggal: ${transaction.date}`;
  detail.appendChild(date);

  const type = document.createElement('p');
  type.setAttribute('data-testid', 'transactionItemType');
  type.classList.add('visually-hidden'); // Hidden but present for test runner
  type.textContent = `Tipe: ${transaction.type === 'income' ? 'Pemasukan' : 'Pengeluaran'}`;
  detail.appendChild(type);

  item.appendChild(detail);

  // Right side (Amount & Buttons)
  const right = document.createElement('div');
  right.classList.add('tracker-transaction-item__right');

  const amount = document.createElement('p');
  amount.setAttribute('data-testid', 'transactionItemAmount');
  amount.classList.add('tracker-transaction-item__amount');
  if (transaction.type === 'income') {
    amount.classList.add('tracker-transaction-item__amount--income');
    amount.textContent = `Nominal: Rp${transaction.amount}`;
  } else {
    amount.classList.add('tracker-transaction-item__amount--expense');
    amount.textContent = `Nominal: Rp${transaction.amount}`;
  }
  right.appendChild(amount);

  // Action Buttons
  const actions = document.createElement('div');
  actions.classList.add('tracker-transaction-item__actions');

  // Edit Type button
  const editTypeBtn = document.createElement('button');
  editTypeBtn.setAttribute('data-testid', 'transactionItemEditTypeButton');
  editTypeBtn.classList.add('tracker-transaction-item__btn');
  editTypeBtn.textContent = 'Ubah Tipe';
  editTypeBtn.addEventListener('click', () => {
    transaction.type = transaction.type === 'income' ? 'expense' : 'income';
    saveAndDispatch();
  });
  actions.appendChild(editTypeBtn);

  // Edit fields button
  const editBtn = document.createElement('button');
  editBtn.setAttribute('data-testid', 'transactionItemEditButton');
  editBtn.classList.add('tracker-transaction-item__btn');
  editBtn.textContent = 'Edit';
  editBtn.addEventListener('click', () => {
    // Fill form fields
    titleInput.value = transaction.title;
    amountInput.value = transaction.amount;
    dateInput.value = transaction.date;
    typeSelect.value = transaction.type;

    // Set editing ID
    editingTransactionId = transaction.id;

    // Modify submit button text
    submitButton.textContent = 'Perbarui';
  });
  actions.appendChild(editBtn);

  // Delete button
  const deleteBtn = document.createElement('button');
  deleteBtn.setAttribute('data-testid', 'transactionItemDeleteButton');
  deleteBtn.classList.add('tracker-transaction-item__btn', 'tracker-transaction-item__btn--delete');
  deleteBtn.textContent = 'Hapus';
  deleteBtn.addEventListener('click', () => {
    transactions = transactions.filter(t => t.id !== transaction.id);
    saveAndDispatch();
    if (editingTransactionId === transaction.id) {
      resetFormMode();
    }
  });
  actions.appendChild(deleteBtn);

  right.appendChild(actions);
  item.appendChild(right);

  return item;
};

// Reset form back to 'Add' mode
const resetFormMode = () => {
  editingTransactionId = null;
  submitButton.textContent = 'Simpan';
  transactionForm.reset();
  // Set default date to today
  const today = new Date().toISOString().split('T')[0];
  dateInput.value = today;
};

// Handle Form Submission
transactionForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const title = titleInput.value.trim();
  const amount = parseInt(amountInput.value, 10);
  const date = dateInput.value;
  const type = typeSelect.value;

  // Validation
  if (!title) {
    alert('Keterangan transaksi tidak boleh kosong!');
    return;
  }
  if (isNaN(amount) || amount < 1) {
    alert('Nominal uang tidak boleh kosong dan harus minimal Rp1!');
    return;
  }
  if (!date) {
    alert('Tanggal transaksi tidak boleh kosong!');
    return;
  }

  if (editingTransactionId !== null) {
    // Edit mode
    const transactionIndex = transactions.findIndex(t => t.id === editingTransactionId);
    if (transactionIndex > -1) {
      transactions[transactionIndex] = {
        ...transactions[transactionIndex],
        title,
        amount,
        date,
        type
      };
      saveAndDispatch();
    }
    resetFormMode();
  } else {
    // Add mode
    const newTransaction = {
      id: +new Date(),
      title,
      amount,
      date,
      type
    };
    transactions.push(newTransaction);
    saveAndDispatch();
    resetFormMode();
  }
});

// Handle Real-time Search
searchInput.addEventListener('input', (e) => {
  searchQuery = e.target.value.trim().toLowerCase();
  renderLists();
});

// Handle Search Form Submission
searchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  searchQuery = searchInput.value.trim().toLowerCase();
  renderLists();
});
