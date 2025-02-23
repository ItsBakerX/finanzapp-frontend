import React, { useEffect, useState } from 'react';
import { BuchungResource, BuchungskategorieResource, PocketResource, SparzielResource } from '../../Resources';
import { getAllebuchungen, getAlleKategorien, getAllePockets, getAlleSparziele } from '../../backend/api';
import { LoadingIndicator } from '../LoadingIndicator';
import BuchungDashboard from './BuchungDashboard';
import '../../style/Baker_CSS/BuchungenDashboard.css';
import { loadKategorien, loadPockets, loadSparziele } from '../../dataLoader';
import { get } from 'http';


function BuchungenDashboard() {

  const [buchungen, setBuchungen] = useState<BuchungResource[]>([]);
  const [kategorien, setKategorien] = useState<BuchungskategorieResource[]>([]);
  const [sparziele, setSparziele] = useState<SparzielResource[]>([]);
  const [pockets, setPockets] = useState<PocketResource[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  async function loadBuchungen() {
    try {
      const cachedBuchungen = localStorage.getItem('cachedAlleBuchungen');
      if (cachedBuchungen) {
        const fetchedBuchungen = JSON.parse(cachedBuchungen);
        setBuchungen(fetchedBuchungen);
      } else {
        const [fetchedBuchungen] = await Promise.all([
          getAllebuchungen()
        ]);
        setBuchungen(fetchedBuchungen);
        localStorage.setItem('cachedAlleBuchungen', JSON.stringify(fetchedBuchungen));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  async function loadData() {
    loadKategorien(setKategorien);
    loadPockets(setPockets);
    loadSparziele(setSparziele);
  }

  useEffect(() => {
    loadBuchungen();
  }, []);

  useEffect(() => {
    loadData();
  }, []);

  // Hilfsfunktion zur Umwandlung von 'DD.MM.YYYY' nach Date-Objekt
  const parseDate = (dateString: string) => {
    const [day, month, year] = dateString.split('.').map(Number);
    return new Date(year, month - 1, day);
  };

  // Sortiere nach Datum absteigend (neuste zuerst)
  const sortedBuchungen = [...buchungen].sort((a, b) => parseDate(b.datum).getTime() - parseDate(a.datum).getTime());

  // Limitiere auf die ersten 7 Buchungen
  const limitedBuchungen = sortedBuchungen.slice(0, 6);
  // Gruppiere Buchungen nach Datum
  const groupedBuchungen = limitedBuchungen.reduce((groups: Record<string, BuchungResource[]>, buchung) => {
    if (!groups[buchung.datum]) {
      groups[buchung.datum] = [];
    }
    groups[buchung.datum].push(buchung);
    return groups;
  }, {});

  if (isLoading) {
    return <LoadingIndicator />;
  }
  return (
    <div className="buchungsliste">
      {Object.keys(groupedBuchungen).map((datum) => (
        <div key={datum} className="buchung-gruppe">
          <h3>{datum}</h3>
          {groupedBuchungen[datum].map((buchung) => (
            <BuchungDashboard
              key={buchung.id}
              buchung={buchung}
              kategorien={kategorien}
              pockets={pockets}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default BuchungenDashboard;
