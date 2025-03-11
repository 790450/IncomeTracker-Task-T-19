let entries = JSON.parse(localStorage.getItem('entries')) || [];
let totalIncome = 0;
let totalExpense = 0;

const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount');
const typeInput = document.getElementById('type');
const entriesList = document.getElementById('entries');
const totalIncomeSpan = document.getElementById('total-income');
const totalExpenseSpan = document.getElementById('total-expense');
const netBalanceSpan = document.getElementById('net-balance');

function updateOverview() {
  totalIncome = entries.filter(entry => entry.type === 'income').reduce((sum, entry) => sum + entry.amount, 0);
  totalExpense = entries.filter(entry => entry.type === 'expense').reduce((sum, entry) => sum + entry.amount, 0);
  const netBalance = totalIncome - totalExpense;

  totalIncomeSpan.textContent = totalIncome;
  totalExpenseSpan.textContent = totalExpense;
  netBalanceSpan.textContent = netBalance;
}

function renderEntries(filter = 'all') {
  entriesList.innerHTML = '';
  const filteredEntries = entries.filter(entry => filter === 'all' || entry.type === filter);

  filteredEntries.forEach(entry => {
    const li = document.createElement('li');
    li.innerHTML = `
      ${entry.description} - ${entry.amount} (${entry.type})
      <span class="edit" onclick="editEntry(${entry.id})">Edit</span>
      <span class="delete" onclick="deleteEntry(${entry.id})">Delete</span>
    `;
    entriesList.appendChild(li);
  });
  updateOverview();
}

function addEntry() {
  const description = descriptionInput.value.trim();
  const amount = parseFloat(amountInput.value);
  const type = typeInput.value;

  if (description && amount) {
    const newEntry = {
      id: Date.now(),
      description,
      amount,
      type,
    };

    entries.push(newEntry);
    localStorage.setItem('entries', JSON.stringify(entries));

    descriptionInput.value = '';
    amountInput.value = '';
    renderEntries();
  }
}

function editEntry(id) {
  const entry = entries.find(e => e.id === id);
  descriptionInput.value = entry.description;
  amountInput.value = entry.amount;
  typeInput.value = entry.type;

  deleteEntry(id);
}

function deleteEntry(id) {
  entries = entries.filter(entry => entry.id !== id);
  localStorage.setItem('entries', JSON.stringify(entries));
  renderEntries();
}

function resetForm() {
  descriptionInput.value = '';
  amountInput.value = '';
}

document.querySelectorAll('input[name="filter"]').forEach(input => {
  input.addEventListener('change', (e) => {
    renderEntries(e.target.value);
  });
});

renderEntries();