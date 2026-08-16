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
  let costDay = 0, costNight = 0, costGas = 0, totalCost = 0, costLight = 0;
  let isBaseline = history.length === 0;

  if (!isBaseline) {
    const lastRecord = history[0];
    
    const diffDay = Math.max(0, currentDay - lastRecord.lightDay);
    const diffNight = Math.max(0, currentNight - lastRecord.lightNight);
    const diffGas = Math.max(0, currentGas - lastRecord.gas);

    costDay = diffDay * TARIFFS.lightDay;
    costNight = diffNight * TARIFFS.lightNight;
    costGas = diffGas * TARIFFS.gas;
    
    costLight = costDay + costNight;
    totalCost = costLight + costGas;
  }

  const newRecord = {
    id: Date.now(),
    date: new Date().toLocaleDateString('uk-UA'),
    lightDay: currentDay,
    lightNight: currentNight,
    gas: currentGas,
    costLight: parseFloat(costLight.toFixed(2)),
    costGas: parseFloat(costGas.toFixed(2)),
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
      <strong>Розрахунок за період:</strong><br>
      💡 Світло (День+Ніч): <strong>${record.costLight} ₴</strong><br>
      🔥 Газ: <strong>${record.costGas} ₴</strong><br>
      <hr style="margin: 8px 0; border: 0; border-top: 1px solid #c3e6cb;">
      <strong>Загальна сума: ${record.totalCost} ₴</strong>
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
    
    // Форматування колонки "Сума", щоб вмістити розбивку
    let sumDisplay = item.isBaseline ? '-' : 
      `<div style="text-align: left; font-size: 11px; line-height: 1.4;">
         Світло: ${item.costLight !== undefined ? item.costLight : '?'} ₴<br>
         Газ: ${item.costGas !== undefined ? item.costGas : '?'} ₴<br>
         <strong>Σ: ${item.totalCost} ₴</strong>
       </div>`;

    tr.innerHTML = `
      <td>${item.date}</td>
      <td>${item.lightDay} / ${item.lightNight}</td>
      <td>${item.gas}</td>
      <td>${sumDisplay}</td>
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
