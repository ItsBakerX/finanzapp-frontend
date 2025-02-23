import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { getEinahmenMonat, getAusgabenMonat } from "../../backend/temp";
import '../../style/Muhammad_CSS/VerhaeltnisA.css';

ChartJS.register(ArcElement, Tooltip, Legend);

function VerhaeltnisA() {
  const [income, setIncome] = useState<number | null>(null);
  const [expenses, setExpenses] = useState<number | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [fetchedIncome, fetchedExpenses] = await Promise.all([
          getEinahmenMonat(),
          getAusgabenMonat(),
        ]);
        setIncome(fetchedIncome);
        setExpenses(fetchedExpenses);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, []);

  // Calculate percentages for the chart
  const total = (income || 0) + (expenses || 0);
  const incomePercentage = total > 0 ? ((income || 0) / total) * 100 : 0;
  const expensesPercentage = total > 0 ? ((expenses || 0) / total) * 100 : 0;

  // Chart.js data and configuration
  const data = {
    labels: ["Einnahmen", "Ausgaben"],
    datasets: [
      {
        data: [income || 0, expenses || 0],
        backgroundColor: ["#017771", "#00C0B7"],
        hoverBackgroundColor: ["#017771", "#00C0B7"],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (tooltipItem: any) =>
            `${tooltipItem.label}: ${tooltipItem.raw.toFixed(2)}€ (${(
              (tooltipItem.raw / total) *
              100
            ).toFixed(1)}%)`,
        },
      },
    },
    cutout: "74%",
  };

  return (
    <div className="income-expense-ratio-card-analysen">
      <p>Finanzübersicht des Monats</p>
      {income !== null && expenses !== null ? (
        income === 0 && expenses === 0 ? (
          <div className="no-data">
            <span role="img" aria-label="sad emoji">😢</span>
            <p>Keine Buchungen in diesem Monat</p>
          </div>
        ) : (
          <>
            <Doughnut data={data} options={options} />
            <div className="legend">
              <div className="legend-item">
                <div
                  className="color-box big"
                  style={{ backgroundColor: "#017771" }}
                />
                <span>Einnahmen</span>
              </div>
              <div className="legend-item">
                <div
                  className="color-box big"
                  style={{ backgroundColor: "#00C0B7" }}
                />
                <span>Ausgaben</span>
              </div>
            </div>
          </>
        )
      ) : (
        <div className="no-data">
          <span role="img" aria-label="sad emoji">😢</span>
          <p>Keine Buchungen in diesem Monat</p>
        </div>
      )}
    </div>
  );
}

export default VerhaeltnisA;
