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
