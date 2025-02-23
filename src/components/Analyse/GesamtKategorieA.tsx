import React, { useEffect, useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import "../../style/Muhammad_CSS/GesamtKategorieA.css";

import { getAlleKategorien } from "../../backend/api";
import { BuchungskategorieResource } from "../../Resources";
import { getKategorieAusgabenJahr, getKategorieAusgabenMonat, getKategorieAusgabenWoche } from "../../backend/temp";

ChartJS.register(ArcElement, Tooltip, Legend);

const TIME_PERIODS = {
  WEEK: "1W",
  MONTH: "1M",
  YEAR: "1Y",
};

function GesamtKategorieA() {
  const [averageSpending, setAverageSpending] = useState<number | null>(null);
  const [fkategorie, setfkategorie] = useState<BuchungskategorieResource[]>([]);

  const [chartData, setChartData] = useState<number[]>([]);
  const [labels, setLabels] = useState<string[]>([]);
  const [timePeriod, setTimePeriod] = useState<string>(TIME_PERIODS.MONTH);
  const [title, setTitle] = useState<string>("");

  async function loadCategories() {
    try {
      const fetchCategories = await getAlleKategorien();
      setfkategorie(fetchCategories);

    } catch (error) {
      console.error("Fehler beim Laden der Kategorien:", error);
    }
  }

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        let fetchedData: number[] = [];
        let fetchedLabels: string[] = [];
        let totalSum = 0;

        let expensesData: Map<string, number>;
        switch (timePeriod) {
          case TIME_PERIODS.WEEK:
            expensesData = await getKategorieAusgabenWoche();
            break;
          case TIME_PERIODS.MONTH:
            expensesData = await getKategorieAusgabenMonat();
            break;
          case TIME_PERIODS.YEAR:
            expensesData = await getKategorieAusgabenJahr();
            break;
          default:
            expensesData = new Map();
        }

        expensesData.forEach((wert, key) => {
          fetchedData.push(wert);
          totalSum += wert;
          const categoryName = fkategorie.find(c => c.id === key)?.name || key;
          fetchedLabels.push(categoryName);
        });

        const currentAverage = totalSum / fetchedData.length;

        setChartData(fetchedData);
        setLabels(fetchedLabels);
        setAverageSpending(currentAverage);
        setTitle(`Wöchentliche, monatliche und jährliche Ausgaben nach Kategorien`);
      } catch (error) {
        console.error("Fehler beim Abrufen der Daten:", error);
      }
    }

    fetchData();
  }, [timePeriod, fkategorie]);

  const handlePeriodChange = (period: string) => setTimePeriod(period);

  const data = {
    labels: labels,
    datasets: [
      {
        data: chartData,
        backgroundColor: [
          "rgba(0, 99, 132, 0.6)",
          "rgba(0, 162, 235, 0.6)",
          "rgba(0, 206, 86, 0.6)",
          "rgba(0, 192, 192, 0.6)",
          "rgba(0, 102, 255, 0.6)",
          "rgba(0, 159, 64, 0.6)",
          "rgba(0, 199, 199, 0.6)",
          "rgba(0, 102, 255, 0.6)",
          "rgba(0, 99, 71, 0.6)",
          "rgba(60, 179, 113, 0.6)",
          "rgba(106, 90, 205, 0.6)",
          "rgba(255, 140, 0, 0.6)",
          "rgba(255, 20, 147, 0.6)",
          "rgba(0, 191, 255, 0.6)",
          "rgba(218, 165, 32, 0.6)",
          "rgba(127, 255, 0, 0.6)",
          "rgba(255, 69, 0, 0.6)",
          "rgba(0, 255, 127, 0.6)",
          "rgba(70, 130, 180, 0.6)",
          "rgba(255, 105, 180, 0.6)",
          "rgba(255, 182, 193, 0.6)",
          "rgba(255, 228, 196, 0.6)",
          "rgba(255, 255, 224, 0.6)",
          "rgba(144, 238, 144, 0.6)",
          "rgba(173, 216, 230, 0.6)",
          "rgba(221, 160, 221, 0.6)",
          "rgba(240, 128, 128, 0.6)",
          "rgba(255, 215, 0, 0.6)",
          "rgba(0, 128, 128, 0.6)",
          "rgba(0, 0, 128, 0.6)",
          "rgba(128, 0, 128, 0.6)",
          "rgba(128, 128, 0, 0.6)",
          "rgba(128, 0, 0, 0.6)",
          "rgba(0, 128, 0, 0.6)",
          "rgba(0, 0, 255, 0.6)",
          "rgba(0, 255, 0, 0.6)",
          "rgba(255, 0, 0, 0.6)",
          "rgba(255, 0, 255, 0.6)",
          "rgba(0, 255, 255, 0.6)",
          "rgba(255, 255, 0, 0.6)",
          "rgba(199, 21, 133, 0.6)",
          "rgba(255, 20, 147, 0.6)",
          "rgba(0, 191, 255, 0.6)",
          "rgba(218, 165, 32, 0.6)",
          "rgba(127, 255, 0, 0.6)",
          "rgba(255, 140, 0, 0.6)",
          "rgba(255, 69, 0, 0.6)",
          "rgba(0, 255, 127, 0.6)",
          "rgba(70, 130, 180, 0.6)",
          "rgba(255, 105, 180, 0.6)"
        ],

        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    cutout: "70%",
  };

  return (
    <div className="gesamt-kategorie-card-analysen">
      <div className="card-header-analysen">
        <p>{title}</p>
        <h3>{averageSpending !== null ? averageSpending > 0 ? `${averageSpending.toFixed(2)}€` : "Du hast noch keine Ausgaben" : "Lädt..."} </h3>
      </div>
      <div className="chart-container">
        <div className="chart">
          <Doughnut data={data} options={options} />
        </div>
        <div className="legend-containerK">
          {labels.map((label, index) => (
            <div key={index} className="legend-itemK">
              <div
                className="color-boxK"
                style={{
                  backgroundColor: data.datasets[0].backgroundColor[index],
                }}
              ></div>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="time-periods">
        {Object.values(TIME_PERIODS).map((period) => (
          <button
            key={period}
            className={timePeriod === period ? "active" : ""}
            onClick={() => handlePeriodChange(period)}
          >
            {period}
          </button>
        ))}
      </div>
    </div>
  );
}

export default GesamtKategorieA;