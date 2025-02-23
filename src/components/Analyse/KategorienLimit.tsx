import React, { useEffect, useState } from "react";
import "../../style/Muhammad_CSS/KategorienLimit.css";
import { getAlleKategorien } from "../../backend/api";
import { BuchungskategorieResource } from "../../Resources";
import { getOutcomeTowardsLimitMonthly, isLimitReached } from "../../backend/temp";
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function KategorienLimit() {
  const [fkategorie, setfkategorie] = useState<BuchungskategorieResource[]>([]);
  const [chartData, setChartData] = useState<number[]>([]);
  // Prozuentual
  const [remainingLimit, setRemainingLimit] = useState<number[]>([]);
  const [labels, setLabels] = useState<string[]>([]);
  const [title, setTitle] = useState<string>("Kategorienausgaben im Überblick");
  const [actualAmounts, setActualAmounts] = useState<number[]>([]);
  const [remainingLimitAbsolut, setRemainingAbsolut] = useState<number[]>([]);

  async function loadCategories() {
    try {
      const fetchCategories = await getAlleKategorien();
      const filterCategory = fetchCategories.filter(
        (category) => category.ausgabenlimit && category.ausgabenlimit > 0
      );
      setfkategorie(filterCategory);
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
        let fetchedRemainingLimit: number[] = [];
        let fetchedLabels: string[] = [];
        let fetchedActualOutgoings: number[] = [];
        let fetchedRemainingAmounts: number[] = [];

        await Promise.all(fkategorie.map(async (category) => {
          try {
            console.log(`Richtige ID ${category.id}`);
      
            const limitMonthly = await getOutcomeTowardsLimitMonthly(category.id!);
            const remainingLimit = category.ausgabenlimit! - limitMonthly;
            const limitReached = await isLimitReached(category.id!);
      
            const limitPercentage = (limitMonthly / category.ausgabenlimit!) * 100;
            const remainingPercentage = (remainingLimit / category.ausgabenlimit!) * 100;
      
            fetchedData.push(limitPercentage);
            fetchedRemainingLimit.push(Math.max(remainingPercentage, 0));
            fetchedActualOutgoings.push(limitMonthly);
            fetchedRemainingAmounts.push(remainingLimit);
            
            if (limitReached) {
              fetchedLabels.push(`${category.name}(Limit: ${category.ausgabenlimit}€) (Limit wurde erreicht)`);
            } else {
              fetchedLabels.push(`${category.name}(Limit: ${category.ausgabenlimit}€)`);
            }
      
          } catch (error) {
            console.error(`Fehler beim Abrufen der Daten für Kategorie ${category.id}:`, error);
          }
        }));
        setChartData(fetchedData);
        setRemainingLimit(fetchedRemainingLimit);
        setLabels(fetchedLabels);
        setTitle(`Kategorienausgaben im Überblick`);
        setActualAmounts(fetchedActualOutgoings);
        setRemainingAbsolut(fetchedRemainingAmounts);
      } catch (error) {
        console.error("Fehler beim Abrufen der Daten:", error);
      }
    }

    if (fkategorie.length > 0) {
      fetchData();
    }
  }, [fkategorie]);

  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Ausgaben in (%)',
        data: chartData,
        backgroundColor: 'rgba(192, 75, 75)',
        stack: "Stack 0",
      },
      {
        label: 'Verbleibendes Limit in (%)',
        data: remainingLimit,
        backgroundColor: 'rgba(75, 192, 192)',
        stack: "Stack 0",
      },
    ],
  };

  const options = {
    indexAxis: 'y' as const,
    responsive: true,
    plugins: {
      legend: { display: true },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const index = context.dataIndex;
            if (context.dataset.label === 'Ausgaben in (%)') {
              const amount = actualAmounts[index];
              return `Ausgaben: ${amount.toFixed(2)}€`;
            } else if (context.dataset.label === 'Verbleibendes Limit in (%)') {
              const remaining = remainingLimitAbsolut[index];
              return `Verbleibendes Limit: ${remaining.toFixed(2)}€`;
            }
            return '';
          },
        },
      },
    },
  };

  return (
    <div className="gesamt-kategorieLimit-card-analysen">
      <div className="card-header-kategorieLimit">
        <p>{title}</p>
        {/* <p> Ein Limit wird überschritten, wenn 100% erreicht wird!</p> */}
        
      </div>
      <div className="chart-containerLimit">
        <div className="kategorieLimit-chart">
          <Bar data={data} options={options} />
        </div>
      </div>
    </div>
  );
}

export default KategorienLimit;