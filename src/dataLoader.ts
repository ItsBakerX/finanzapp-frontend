//hier werden die Pockets, Kategorien und Sparziele geladen

import { getAlleEigeneKategorien, getAllePockets, getAlleSparziele, getAlleStandardKategorien } from "./backend/api";


export async function loadKategorien(setKategorien: Function) {
    try {
        const cachedKategorien = localStorage.getItem('cachedKategorien');
        if (cachedKategorien) {
            console.log('Kategorien aus localStorage geladen');
            const { benutzerdefinierteKategorien, standardKategorien } = JSON.parse(cachedKategorien);

            // Kombiniere die beiden Arrays
            const combinedKategorien = [...benutzerdefinierteKategorien, ...standardKategorien];
            setKategorien(combinedKategorien);
        } else {
            console.log('Keine Kategorien im localStorage, lade von API');
            // Falls keine Kategorien im localStorage sind, lade sie von der API
            const standardKategorien = await getAlleStandardKategorien();
            const benutzerdefinierteKategorien = await getAlleEigeneKategorien();

            // Kombiniere die beiden Arrays
            const combinedKategorien = [...benutzerdefinierteKategorien, ...standardKategorien];
            setKategorien(combinedKategorien);

            // Speichere sie getrennt im localStorage
            localStorage.setItem(
                'cachedKategorien',
                JSON.stringify({
                    benutzerdefinierteKategorien,
                    standardKategorien,
                })
            );
        }
    } catch (error) {
        console.error('Error loading kategorien:', error);
    } finally {

    }
}

export async function loadPockets(setPockets: Function) {
    try {
        const cachedPockets = localStorage.getItem('cachedPockets');
        if (cachedPockets) {
            const fetchedPockets = JSON.parse(cachedPockets);
            setPockets(fetchedPockets);
        } else {
            const fetchedPockets = await getAllePockets();
            setPockets(fetchedPockets);
            localStorage.setItem('cachedPockets', JSON.stringify(fetchedPockets));
        }
    } catch (error) {
        console.error('Error loading pockets:', error);
    } finally {

    }
}

export async function loadSparziele(setSparziele: Function) {
    try {
        const cachedSparziele = localStorage.getItem('cachedSparziele');
        if (cachedSparziele) {
            const fetchedSparziele = JSON.parse(cachedSparziele);
            setSparziele(fetchedSparziele);
        } else {
            const fetchedSparziele = await getAlleSparziele();
            setSparziele(fetchedSparziele);
            localStorage.setItem('cachedSparziele', JSON.stringify(fetchedSparziele));
        }
    } catch (error) {
        console.error('Error loading sparziele:', error);
    } finally {

    }
}

export async function loadZukunftBuchungen(setBuchungen: Function) {
    try {
        const fetchedBuchungen = localStorage.getItem('cachedZukunftBuchungen');
    } catch (err) {
        console.error("Error loading ZukunftBuchungen" + err);
    }
}

export async function deleteCachedData() {
    localStorage.removeItem('cachedKategorien');
    localStorage.removeItem('cachedPockets');
    localStorage.removeItem('cachedSparziele');
}