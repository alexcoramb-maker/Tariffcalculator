const TARIFFS = {
  lightDay: 4.32,
  lightNight: 2.16,
  gas: 7.96
};

document.addEventListener('DOMContentLoaded', () => {
  loadHistory();
  document.getElementById('calculateBtn').addEventListener('click', calculateAndSave);
  document.getElementById('clearBtn').addEventListener('click', clearHistory);
});

// Функція для отримання даних з localStorage
function getHistory() {
  const data = localStorage.getItem('utilityHistory');
  return data ? JSON.parse(data) : [];
}

// Функція для збереження даних у localStorage
function saveHistory(history) {
  localStorage.setItem('utilityHistory', JSON.stringify(history));
}

function calculateAndSave() {
  const currentDay = parseFloat(document.getElementById('lightDay').value);
  const currentNight = parseFloat(document.getElementById('lightNight').value);
  const currentGas = parseFloat(document.getElementById('gas').value);

  if (isNaN(currentDay) || isNaN(currentNight) || isNaN(currentGas)) {
    alert('Будь ласка, заповніть всі поля.');
    return;
  }

  let history = getHistory();
  let costDay = 0, costNight = 0, costGas = 0, totalCost = 0;
  let isBaseline = history.length === 0;

  if (!isBaseline) {
    const lastRecord = history[0];
    
    const diffDay = Math.max(0, currentDay - lastRecord.lightDay);
    const diffNight = Math.max(0, currentNight - lastRecord.lightNight);
    const diffGas = Math.max(0, currentGas - lastRecord.gas);

    costDay = diffDay * TARIFFS.lightDay;
    costNight = diffNight * TARIFFS.lightNight;
    costGas = diffGas * TARIFFS.gas;
    totalCost = costDay + costNight + costGas;
  }

  const newRecord = {
    id: Date.now(),
    date: new Date().toLocaleDateString('uk-UA'),
    lightDay: currentDay,
    lightNight: currentNight,
    gas: currentGas,
    totalCost: parseFloat(totalCost.toFixed(2)),
    isBaseline: isBaseline
  };

  history.unshift(newRecord);
  saveHistory(history);
  
  showResult(newRecord);
  renderTable(history);
  clearInputs();
}

function showResult(record) {
  const resultBox = document.getElementById('resultBox');
  if (record.isBaseline) {
    resultBox.innerHTML = `<strong>Показники збережено як стартові.</strong> Розрахунок почнеться з наступного місяця.`;
  } else {
    resultBox.innerHTML = `
      <strong>Загальна сума до сплати: ${record.totalCost} ₴</strong>
    `;
  }
  resultBox.classList.remove('hidden');
}

function loadHistory() {
  renderTable(getHistory());
}

function renderTable(history) {
  const tbody = document.querySelector('#historyTable tbody');
  tbody.innerHTML = '';

  history.forEach(item => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${item.date}</td>
      <td>${item.lightDay} / ${item.lightNight}</td>
      <td>${item.gas}</td>
      <td><strong>${item.isBaseline ? '-' : item.totalCost}</strong></td>
    `;
    tbody.appendChild(tr);
  });
}

function clearHistory() {
  if(confirm('Ви впевнені, що хочете видалити всю історію?')) {
    localStorage.removeItem('utilityHistory');
    renderTable([]);
    document.getElementById('resultBox').classList.add('hidden');
  }
}

function clearInputs() {
  document.getElementById('lightDay').value = '';
  document.getElementById('lightNight').value = '';
  document.getElementById('gas').value = '';
}
