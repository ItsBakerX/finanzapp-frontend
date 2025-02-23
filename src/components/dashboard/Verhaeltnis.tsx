import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { getEinahmenMonat, getAusgabenMonat } from "../../backend/temp";
import '../../style/Baker_CSS/Verhaeltnis.css';
import { LoadingIndicator } from "../LoadingIndicator";

ChartJS.register(ArcElement, Tooltip, Legend);

function Verhaeltnis() {
  const [income, setIncome] = useState<number | null>(null);
  const [expenses, setExpenses] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [fetchedIncome, fetchedExpenses] = await Promise.all([
          getEinahmenMonat(),
          getAusgabenMonat(),
        ]);
        setIncome(fetchedIncome);
        setExpenses(fetchedExpenses);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="verhaeltnis-loading-indicator">
        <LoadingIndicator />
      </div>
    );
  }

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
        backgroundColor: ["#00ada5", "#48bbe7"],
        hoverBackgroundColor: ["#00ada5", "#48bbe7"],
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
    <div className="income-expense-ratio-card">
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
                      style={{ backgroundColor: "#00ada5" }}
                />
                <span>Einnahmen</span>
              </div>
              <div className="legend-item">
                <div
                  className="color-box big"
                      style={{ backgroundColor: "#48bbe7" }}
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

export default Verhaeltnis;
