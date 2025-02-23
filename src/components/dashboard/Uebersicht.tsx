import { useEffect, useState } from "react";
import { getAusgabenMonat, getEinahmenMonat, getGesamtvermoegen } from "../../backend/temp";
import trendingUp_icon from '../img/trendingUp_icon.svg';
import trendingDown_icon from '../img/trendingDown_icon.svg';
import moneyBag_icon from '../img/moneyBag_icon.svg';
import '../../style/Muhammad_CSS/UebersichtA.css';

function Uebersicht() {
  const [einahmen, setEinahmen] = useState<number | null>(null);
  const [ausgaben, setAusgaben] = useState<number | null>(null);
  const [differenz, setDifferenz] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const income = await getEinahmenMonat();
        const expenses = await getAusgabenMonat();
        const totalAssets = await getGesamtvermoegen();
        setEinahmen(income);
        setAusgaben(expenses);
        setDifferenz(totalAssets);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="analysen">
      <div className="analysen-card">
        <div className="analysen-card-content-no-img">
          <h2 className="smaller">{einahmen !== null ? `${einahmen.toFixed(2)}€` : "Lädt..."}</h2>
          <p>Einnahmen in diesem Monat insgesamt</p>
        </div>
        <img src={trendingUp_icon} className="analysen-card-img" alt="Trending up icon" />
      </div>
      <div className="analysen-card">
        <div className="analysen-card-content-no-img">
          <h2 className="smaller">{ausgaben !== null ? `${ausgaben.toFixed(2)}€` : "Lädt..."}</h2>
          <p>Ausgaben in diesem Monat insgesamt</p>
        </div>
        <img src={trendingDown_icon} className="analysen-card-img" alt="Trending down icon" />
      </div>
      <div className="analysen-card">
        <div className="analysen-card-content-no-img">
          <h2 className="smaller">{differenz !== null ? `${differenz.toFixed(2)}€` : "Lädt..."}</h2>
          <p>noch verfügbar</p>
        </div>
        <img src={moneyBag_icon} className="analysen-card-img" alt="Money bag icon" />
      </div>
    </div>
  );
}

export default Uebersicht;
