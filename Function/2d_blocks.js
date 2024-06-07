// Створює об'єкт блоку з вказаною шириною, висотою, початковими координатами та кольором.
function createBlock(blockWidth, blockHeight) {
  return {
    width: blockWidth,
    height: blockHeight,
    isPlaced: false, // Вказує, чи розміщено блок у контейнері
    coordinates: { top: null, left: null, right: null, bottom: null }, // Початкові координати блоку
    color: null, // Колір блоку
  };
}

// Створює об'єкт контейнера з вказаними розмірами та однією порожниною, що займає всю площу контейнера.
function createContainer(containerWidth, containerHeight) {
  return {
    width: containerWidth,
    height: containerHeight,
    internalCavities: [
      { top: 0, left: 0, right: containerWidth, bottom: containerHeight }, // Визначає всю область контейнера як одну порожнину
    ],
  };
}

// Розраховує метрики заповненості контейнера блоками.
function calcMetrics(blocks, container) {
  // Розраховує загальну площу всіх блоків
  const totalBlockArea = blocks.reduce(
    (total, block) => total + block.width * block.height,
    0
  );

  // Розраховує загальну площу внутрішніх порожнин контейнера
  const internalCavitiesArea = container.internalCavities.reduce(
    (total, space) =>
      total + (space.right - space.left) * (space.bottom - space.top),
    0
  );

  // Розраховує заповненість контейнера (частку зайнятої площі)
  const fullness =
    1 - internalCavitiesArea / (internalCavitiesArea + totalBlockArea);

  // Отримує координати всіх розміщених блоків
  const blockCoordinates = blocks
    .filter((block) => block.isPlaced)
    .map((block, index) => ({
      top: block.coordinates.top,
      left: block.coordinates.left,
      right: block.coordinates.right,
      bottom: block.coordinates.bottom,
      initialOrder: index,
      color: block.color,
    }));

  return { fullness, blockCoordinates };
}

// Розміщує блоки в контейнері, якщо це можливо, та оновлює внутрішні порожнини.
function stackBlocks(blocks, container) {
  // Сортує блоки за площею (в порядку спадання)
  blocks.sort((a, b) => b.width * b.height - a.width * a.height);
  for (const block of blocks) {
    // Знаходить відповідну порожнину для блоку
    const spaceIndex = container.internalCavities.findIndex(
      (space) =>
        block.width <= space.right - space.left &&
        block.height <= space.bottom - space.top
    );

    if (spaceIndex !== -1) {
      const space = container.internalCavities[spaceIndex];

      // Встановлює координати блоку
      block.coordinates = {
        top: space.top,
        left: space.left,
        right: Math.min(space.left + block.width, space.right),
        bottom: Math.min(space.top + block.height, space.bottom),
      };

      block.isPlaced = true;

      // Оновлює внутрішні порожнини контейнера
      const newInternalCavities = [
        {
          top: space.top,
          left: space.left,
          right: space.right,
          bottom: block.coordinates.top,
        },
        {
          top: block.coordinates.bottom,
          left: space.left,
          right: space.right,
          bottom: space.bottom,
        },
        {
          top: space.top,
          left: space.left,
          right: block.coordinates.left,
          bottom: block.coordinates.bottom,
        },
        {
          top: space.top,
          left: block.coordinates.right,
          right: space.right,
          bottom: block.coordinates.bottom,
        },
      ];

      container.internalCavities.splice(spaceIndex, 1, ...newInternalCavities);
    } else {
      console.error(
        `Cannot place block with width ${block.width} and height ${block.height}.`
      );
    }
  }

  addColor(blocks);
  return calcMetrics(blocks, container);
}

// Генерує випадковий колір.
function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

// Додає колір блокам, забезпечуючи унікальність кольорів для блоків однакового розміру.
function addColor(blocks) {
  const uniqueBlockSizes = {};
  for (const block of blocks) {
    const { width, height } = block;
    if (block.color === null) {
      block.color = uniqueBlockSizes[`${width}-${height}`] || getRandomColor();

      uniqueBlockSizes[`${width}-${height}`] = block.color;
    }
  }
}

// Завантажує дані блоків із зовнішнього файлу.
async function loadBlocksData() {
  const response = await fetch("blocks.json");
  const blocksInfo = await response.json();
  return blocksInfo;
}

// Оновлює інтерфейс користувача відповідно до результатів розміщення блоків.
function updateUI(result, containerInfo) {
  const containerDiv = document.getElementById("container");
  containerDiv.style.width = containerInfo.width + "px";
  containerDiv.style.height = containerInfo.height + "px";
  const fullness = document.getElementById("fullness-value");
  fullness.textContent = result.fullness.toFixed(2);

  containerDiv.innerHTML = "";

  // Створює HTML-елементи для кожного блоку та додає їх до контейнера
  result.blockCoordinates.forEach((coords) => {
    const block = document.createElement("div");
    block.className = "block";
    block.textContent = `${coords.initialOrder}`;
    block.style.width = `${coords.right - coords.left}px`;
    block.style.height = `${coords.bottom - coords.top}px`;
    block.style.top = `${coords.top}px`;
    block.style.left = `${coords.left}px`;
    block.style.right = `${coords.right}px`;
    block.style.bottom = `${coords.bottom}px`;
    block.style.backgroundColor = `${coords.color}`;
    containerDiv.appendChild(block);
  });
}

// Ініціалізує процес розміщення блоків та оновлення інтерфейсу.
async function initialize() {
  const blocksInfo = await loadBlocksData();
  const blocks = blocksInfo.map((info) => createBlock(info.width, info.height));

  const containerInfo = {
    width: 350,
    height: 300,
  };
  const container = createContainer(containerInfo.width, containerInfo.height);
  const result = stackBlocks(blocks, container);
  updateUI(result, containerInfo);

  // Оновлює розміщення блоків при зміні розміру вікна
  window.addEventListener("resize", () => {
    containerInfo.width = window.innerWidth;
    containerInfo.height = window.innerHeight;
    const result = stackBlocks(blocks, container);
    updateUI(result, containerInfo);
  });
}

// Викликає функцію initialize при завантаженні сторінки
window.onload = initialize;
