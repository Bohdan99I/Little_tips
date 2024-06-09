// Отримуємо елемент з класом 'color'
const colorSpan = document.querySelector(".color");

// Отримуємо елемент з класом 'change-color'
const changeColor = document.querySelector(".change-color");

// Додаємо обробник події "click" до елемента 'change-color'
changeColor.addEventListener("click", onClick);

// Функція, що виконується при натисканні на кнопку
function onClick() {
  // Генеруємо випадковий колір у форматі Hex
  const randomColor = getRandomHexColor();

  // Змінюємо колір фону сторінки на випадковий колір
  document.body.style.backgroundColor = randomColor;

  // Встановлюємо текстовий вміст елемента 'colorSpan' на випадковий колір
  colorSpan.textContent = randomColor;
}

// Функція для генерації випадкового кольору у форматі Hex
function getRandomHexColor() {
  return `#${Math.floor(Math.random() * 16777215)
    .toString(16)
    .padStart(6, 0)}`;
}
