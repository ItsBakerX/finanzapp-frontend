import React, { useEffect, useState } from "react";
import "../../style/Muhammad_CSS/ProzentualPocket.css";
import { getAllePockets, getBuchungenByPocketId } from "../../backend/api";
import { BuchungResource, PocketResource } from "../../Resources";
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function ProzentualPocketA() {
  const [fpockets, setfPockets] = useState<PocketResource[]>([]);
  const [pocketNames, setPocketNames] = useState<string[]>([]);
  const [buchungen, setBuchungen] = useState<BuchungResource[]>([]);

  async function loadPocket() {
    try {
      const fetchPockets = await getAllePockets();
      setfPockets(fetchPockets);
    } catch (error) {
      console.error("Fehler beim Laden der Pockets:", error);
    }
  }

  useEffect(() => {
    loadPocket();
  }, []);

  useEffect(() => {
    async function fetchBuchungen() {
      try {
        const allePockets = await getAllePockets();

        const alleBuchungenPromises = allePockets.map(pocket => getBuchungenByPocketId(pocket.id!));
        const alleBuchungenArrays = await Promise.all(alleBuchungenPromises);

        const alleBuchungen = alleBuchungenArrays.flat();
        setBuchungen(alleBuchungen);
      } catch (err) {
        console.error("Fehler beim Laden der Buchungen:", err);
      }
    }

    fetchBuchungen();
  }, []);

  useEffect(() => {
    const names = fpockets.map(pocket => pocket.name);
    setPocketNames(names);
  }, [fpockets]);

  const getBackgroundColor = (betrag: number) => {
    if (betrag < 0) {
      return "rgba(235, 135, 135)";
    } else {
      return "rgba(135, 206, 235)";
    }
  };

  const data = {
    labels: pocketNames,
    datasets: [
      {
        label: 'Pockets Übersicht',
        data: fpockets.map(pocket => pocket.betrag),
        backgroundColor: fpockets.map(pocket => getBackgroundColor(pocket.betrag)),

        borderWidth: 1,
        
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
  };

  return (
    <div className="prozentual-card">
      <div className="prozentual-header">
        <p>Pockets Übersicht</p>
      </div>
      <div className="prozentual-chart-container">
        <div className="prozentual-chart">
          {pocketNames.length > 0 ? (
            <Bar data={data} options={options} />
          ) : (
            <p>Keine Daten verfügbar</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProzentualPocketA;