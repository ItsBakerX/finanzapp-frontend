import React, { useEffect, useState } from 'react';
import { BuchungResource } from '../../Resources';
import { getAllebuchungen } from '../../backend/api';
import { getAusgabenMonat, getJahreAusgaben, getMonateAusgaben, getWochenAusgaben } from '../../backend/temp';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler } from "chart.js";
import { Line } from 'react-chartjs-2';
import '../../style/Baker_CSS/AnalysisCard.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler);

const TIME_PERIODS = {
    WEEK: '1W',
    MONTH: '1M',
    YEAR: '1Y'
};

function AnalysisCard() {
  const [averageSpending, setAverageSpending] = useState<number | null>(null);
  const [chartData, setChartData] = useState<number[]>([]);
  const [labels, setLabels] = useState<string[]>([]);
  const [timePeriod, setTimePeriod] = useState<string>(TIME_PERIODS.MONTH);
  const [title, setTitle] = useState<string>("");

  useEffect(() => {
    async function fetchData() {
      try {
        let fetchedData: number[] = [];
        let fetchedLabels: string[] = [];
        let totalSum = 0;
  
        switch (timePeriod) {
          case TIME_PERIODS.MONTH:
            const monthlyData = await getMonateAusgaben();
            fetchedData = monthlyData.values.reverse(); // Array von Werten
            fetchedLabels = monthlyData.wochen.reverse(); // ["Jan 2023", "Feb 2023", ...]
            break;
  
          case TIME_PERIODS.YEAR:
            const yearlyData = await getJahreAusgaben();
            fetchedData = yearlyData.values.reverse(); // Array von Werten
            fetchedLabels = yearlyData.wochen.reverse(); // ["2020", "2021", "2022", ...]
            break;
  
          case TIME_PERIODS.WEEK:
            const weeklyData = await getWochenAusgaben();
            fetchedData = weeklyData.values.reverse(); // Array von Werten
            fetchedLabels = weeklyData.wochen.reverse(); // ["Woche 1", "Woche 2", ...]
            break;
  
          default:
            break;
        }
  
        // Berechnung des Durchschnitts
        totalSum = fetchedData.reduce((sum, value) => sum + value, 0);
        const currentAverage = totalSum / fetchedData.length;
  
        setChartData(fetchedData);
        setLabels(fetchedLabels);
        setAverageSpending(currentAverage);
        setTitle(`durchschnittliche Ausgaben im ${timePeriod}`);
      } catch (error) {
        console.error("Fehler beim Abrufen der Daten:", error);
      }
    }
  
    fetchData();
  }, [timePeriod]);

    const handlePeriodChange = (period: string) => setTimePeriod(period);
    // Chart-Daten und Konfiguration
    const data = {
      labels: labels,
      datasets: [
          {
              label: `Ausgaben (${timePeriod})`,
              data: chartData,
              fill: true,
              backgroundColor: "rgba(0, 173, 165, .2)",
              borderColor: "rgba(0, 173, 165, 1)",
              pointBackgroundColor: "rgba(72, 187, 231, 1)",
          },
      ],
  };
  const options = {
    responsive: true,
    plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: (context: any) => `${context.raw}€` } },
    },
    scales: {
        x: { display: true },
        y: { beginAtZero: true, ticks: { callback: (value: any) => `${value}€` } },
    },
};

return (
  <div className="analysis-card">
      <div className="card-header">
          <h2>{averageSpending !== null ? `${averageSpending.toFixed(2)}€` : "Lädt..."}</h2>
          <p>{title}</p>
      </div>
      <Line data={data} options={options} />
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
};

export default AnalysisCard;
