import React, { useEffect, useState } from 'react';
import { BuchungResource, BuchungskategorieResource, PocketResource } from '../../Resources';
import { getAllebuchungenWiederkehrend, getAlleKategorien, getAllePockets, getAlleZukunftBuchungen } from '../../backend/api';
import { LoadingIndicator } from '../LoadingIndicator';

import '../../style/Baker_CSS/WiederkehrendeBuchungenAnzeigen.css';
import BuchungWiederkehrend from './BuchungWiederkehrend';
import BuchungOffen from './BuchungOffen';
import { loadKategorien, loadPockets } from '../../dataLoader';

function OffeneBuchungen() {
    const [buchungen, setBuchungen] = useState<BuchungResource[]>([]);
    const [kategorien, setKategorien] = useState<BuchungskategorieResource[]>([]);
    const [pockets, setPockets] = useState<PocketResource[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [sortMode, setSortMode] = useState<'kategorie' | 'datum'>('kategorie');
    const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

    const handleDropdownToggle = (id: string | null) => {
        setOpenDropdownId(prevId => (prevId === id ? null : id));
    };
    async function loadData() {
        await loadKategorien(setKategorien);
        await loadPockets(setPockets);
        try {
            const [fetchedBuchungen] = await Promise.all([
                getAlleZukunftBuchungen()
            ]);
            setBuchungen(fetchedBuchungen);
            setIsLoading(false);
        } catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {
        loadData();
    }, []);

    // Diese Methode entfernt die Buchung direkt aus dem Zustand
    const handleDelete = (id: string) => {
        setBuchungen(prevBuchungen => prevBuchungen.filter(buchung => buchung.id !== id));
    };

    const handleExecute = (id: string) => {
        setBuchungen(prevBuchungen => prevBuchungen.filter(buchung => buchung.id !== id));
    };


    if (isLoading) {
        return <LoadingIndicator />;
    }

    // Hilfsfunktion zur Umwandlung von 'DD.MM.YYYY' nach Date-Objekt
    const parseDate = (dateString: string) => {
        const [day, month, year] = dateString.split('.').map(Number);
        return new Date(year, month - 1, day);
    };

    const sortedBuchungen = [...buchungen].sort((a, b) => {
        // Sortiere nach Kategorie und dann nach Datum absteigend innerhalb jeder Kategorie
        const kategorieA = kategorien.find(k => k.id === a.kategorie)?.name || a.kategorie;
        const kategorieB = kategorien.find(k => k.id === b.kategorie)?.name || b.kategorie;
        if (kategorieA === kategorieB) {
            // Innerhalb der gleichen Kategorie nach Datum absteigend
            return parseDate(b.datum).getTime() - parseDate(a.datum).getTime();
        }
        return kategorieA.localeCompare(kategorieB);

    });

    // Gruppiere die Buchungen nach Kategorien (nur wenn nach Kategorie sortiert wird)
    const groupedBuchungen = sortedBuchungen.reduce((acc, buchung) => {
        const kategorieName = kategorien.find(k => k.id === buchung.kategorie)?.name || buchung.kategorie;
        if (!acc[kategorieName]) {
            acc[kategorieName] = [];
        }
        acc[kategorieName].push(buchung);
        return acc;
    }, {} as Record<string, BuchungResource[]>)

    return (
        <div className="offene-buchungen">
            <div className='selectedContentHeader'>
                <h2>Offene Buchungen</h2>
            </div>
            <div className="buchungen-list">
                {Object.keys(groupedBuchungen).map(groupName => (
                    <div key={groupName} className="kategorie-section">
                        <h3 className="kategorie-name">{groupName}</h3>
                        {groupedBuchungen[groupName].map(buchung => (
                            <BuchungOffen
                                key={buchung.id}
                                buchung={buchung}
                                kategorien={kategorien}
                                pockets={pockets}
                                openDropdownId={openDropdownId}
                                setOpenDropdownId={handleDropdownToggle}
                                onDelete={handleDelete}
                                onExecute={handleExecute} />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default OffeneBuchungen;