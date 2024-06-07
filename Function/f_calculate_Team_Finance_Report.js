function calculateTeamFinanceReport(salaries, team) {
  let report = { totalBudgetTeam: 0 };

  // Ініціалізація бюджетів для кожної спеціалізації
  for (let specialization in salaries) {
    report[`totalBudget${specialization}`] = 0;
  }

  // Прохід по кожному члену команди
  team.forEach((member) => {
    let specialization = member.specialization;
    if (salaries[specialization]) {
      let salaryInfo = salaries[specialization];
      let salary = salaryInfo.salary;
      let taxPercent = parseFloat(salaryInfo.tax) / 100;
      let totalSalary = salary / (1 - taxPercent);

      // Додавання зарплатні до відповідної спеціалізації та загальної суми
      report[`totalBudget${specialization}`] += totalSalary;
      report.totalBudgetTeam += totalSalary;
    }
  });

  // Округлення всіх значень до цілих чисел
  for (let key in report) {
    report[key] = Math.trunc(report[key]);
  }

  return report;
}

// Приклад для тестування
const salaries1 = {
  Manager: { salary: 1000, tax: "10%" },
  Designer: { salary: 600, tax: "30%" },
  Artist: { salary: 1500, tax: "15%" },
};

const team1 = [
  { name: "Misha", specialization: "Manager" },
  { name: "Max", specialization: "Designer" },
  { name: "Vova", specialization: "Designer" },
  { name: "Leo", specialization: "Artist" },
];

const financeReport1 = calculateTeamFinanceReport(salaries1, team1);
console.log(JSON.stringify(financeReport1));

const salaries2 = {
  TeamLead: { salary: 1000, tax: "99%" },
  Architect: { salary: 9000, tax: "34%" },
};

const team2 = [
  { name: "Alexander", specialization: "TeamLead" },
  { name: "Gaudi", specialization: "Architect" },
  { name: "Koolhas", specialization: "Architect" },
  { name: "Foster", specialization: "Architect" },
  { name: "Napoleon", specialization: "General" },
];

const financeReport2 = calculateTeamFinanceReport(salaries2, team2);
console.log(JSON.stringify(financeReport2));

////////////////////////////////////////////////////////////////////////////
//Функція перевіряє правильність даних в salaries та team//////////////////
///////////////////////////////////////////////////////////////////////////

function calculateTeamFinanceReport(salaries, team) {
  // Перевірка даних salaries
  if (!salaries || typeof salaries !== "object") {
    throw new Error("Необхідно надати об'єкт salaries.");
  }

  for (let specialization in salaries) {
    if (
      !salaries[specialization] ||
      typeof salaries[specialization] !== "object"
    ) {
      throw new Error(
        `Неправильна інформація про зарплату для спеціалізації ${specialization}.`
      );
    }

    if (
      !salaries[specialization].salary ||
      typeof salaries[specialization].salary !== "number"
    ) {
      throw new Error(
        `Неправильна інформація про зарплату для спеціалізації ${specialization}: відсутнє поле salary або воно не є числом.`
      );
    }

    if (
      !salaries[specialization].tax ||
      typeof salaries[specialization].tax !== "string"
    ) {
      throw new Error(
        `Неправильна інформація про податки для спеціалізації ${specialization}: відсутнє поле tax або воно не є рядком.`
      );
    }
  }

  // Перевірка даних team
  if (!team || !Array.isArray(team)) {
    throw new Error("Необхідно надати масив team.");
  }

  for (let member of team) {
    if (!member || typeof member !== "object") {
      throw new Error("Неправильний опис члена команди.");
    }

    if (!member.name || typeof member.name !== "string") {
      throw new Error("Відсутнє поле name або воно не є рядком.");
    }

    if (!member.specialization || typeof member.specialization !== "string") {
      throw new Error("Відсутнє поле specialization або воно не є рядком.");
    }
  }

  // Ініціалізація звіту
  let report = { totalBudgetTeam: 0 };

  // Ініціалізація бюджетів для кожної спеціалізації
  for (let specialization in salaries) {
    report[`totalBudget${specialization}`] = 0;
  }

  // Прохід по кожному члену команди
  team.forEach((member) => {
    let specialization = member.specialization;
    if (salaries[specialization]) {
      let salaryInfo = salaries[specialization];
      let salary = salaryInfo.salary;
      let taxPercent = parseFloat(salaryInfo.tax) / 100;
      let totalSalary = salary / (1 - taxPercent);

      // Додавання зарплатні до відповідної спеціалізації та загальної суми
      report[`totalBudget${specialization}`] += totalSalary;
      report.totalBudgetTeam += totalSalary;
    }
  });

  // Округлення всіх значень до цілих чисел
  for (let key in report) {
    report[key] = Math.trunc(report[key]);
  }

  return report;
}
