import React, { useEffect, useState } from 'react';
import { BuchungResource, BuchungskategorieResource, PocketResource, SparzielResource } from '../Resources';
import { getAlleAusgabenBuchung, getAllebuchungen, getAlleEigeneKategorien, getAlleEinnahmenBuchung, getAlleKategorien, getAllePockets, getAlleSparziele, getAlleStandardKategorien, getBuchungenByKategorieId, getBuchungenByPocketId } from '../backend/api';
import Buchung from './Buchung';
import swap_icon from '../components/img/swap_icon.svg';
import { LoadingIndicator } from './LoadingIndicator';
import Filter from './Filter';
import { useMediaQuery } from 'react-responsive';
import { loadKategorien, loadPockets, loadSparziele } from '../dataLoader';

import introJs from 'intro.js';
import 'intro.js/minified/introjs.min.css';
import helpIcon from './../components/img/help.svg'

function AlleBuchungen() {

    const isPCScreen = useMediaQuery({ query: '(min-width: 850px)' });

    const [allBuchungen, setAllBuchungen] = useState<BuchungResource[]>([]);

    const [buchungen, setBuchungen] = useState<BuchungResource[]>([]);
    const [kategorien, setKategorien] = useState<BuchungskategorieResource[]>([]);
    const [pockets, setPockets] = useState<PocketResource[]>([]);
    const [sparziele, setSparziele] = useState<SparzielResource[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [sortMode, setSortMode] = useState<'kategorie' | 'datum'>('datum');
    const [filters, setFilters] = useState({
        artDerBuchung: 'alle',
        selectedKategorien: [] as string[],
        selectedPockets: [] as string[],
    });
    const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
    const [openDetailsId, setOpenDetailsId] = useState<string | null>(null);


    const handleDropdownToggle = (id: string | null) => {
        setOpenDropdownId(prevId => (prevId === id ? null : id));
    };

    const handleDetailsToggle = (id: string | null) => {
        setOpenDetailsId(prevId => (prevId === id ? null : id));
    };


    // Lade alle Kategorien und Pockets, damit ich deren Namen statt IDs anzeigen kann
    async function loadData() {
        await loadKategorien(setKategorien);
        await loadPockets(setPockets);
        await loadSparziele(setSparziele);
    }

    async function filterBuchungen() {
        let filtered = [...allBuchungen];

        if (filters.artDerBuchung === 'einnahmen') {
            filtered = filtered.filter(b => b.typ === 'einzahlung');
        } else if (filters.artDerBuchung === 'ausgaben') {
            filtered = filtered.filter(b => b.typ === 'ausgabe');
        }

        // Filter nach Kategorie
        if (filters.selectedKategorien.length > 0) {
            filtered = filtered.filter(b =>
                filters.selectedKategorien.includes(b.kategorie)
            );
        }

        // Filter nach Pocket
        if (filters.selectedPockets.length > 0) {
            filtered = filtered.filter(b =>
                filters.selectedPockets.includes(b.pocket)
            );
        }

        setBuchungen(filtered);
    }

    async function loadBuchungen() {
        setIsLoading(true);
        setIsLoading(true);
        try {
            const cachedBuchungen = localStorage.getItem('cachedAlleBuchungen');
            if (cachedBuchungen) {
                const fetchedBuchungen = JSON.parse(cachedBuchungen);
                setAllBuchungen(fetchedBuchungen);
            } else {
                const fetchedBuchungen = await getAllebuchungen();
                setAllBuchungen(fetchedBuchungen);
                localStorage.setItem('cachedAlleBuchungen', JSON.stringify(fetchedBuchungen));
            }
        } catch (error) {
            console.error('Error loading buchungen:', error);
        } finally {
            setIsLoading(false);
        }
    }


    useEffect(() => {
        loadBuchungen();
        // localStorage.removeItem('cachedBuchungen'); // Cache leeren
    }, [filters]);



    useEffect(() => {
        loadData();
        // localStorage.removeItem('cachedData');
    }, []);

    useEffect(() => {
        const handleBuchungAdded = () => {
            loadBuchungen();
        };

        window.addEventListener("buchungAdded", handleBuchungAdded);

        return () => {
            window.removeEventListener("buchungAdded", handleBuchungAdded);
        };
    }, []);


    useEffect(() => {
        filterBuchungen();
    }, [filters, allBuchungen]);



    const handleFilterChange = (updatedFilters: typeof filters) => {
        setFilters(updatedFilters);
    };

    const handleDelete = (id: string) => {
        // Entferne die Buchung mit der übergebenen ID aus dem Zustand
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

    // Sortiere Buchungen nach dem ausgewählten Sortiermodus
    const sortedBuchungen = [...buchungen].sort((a, b) => {
        if (sortMode === 'datum') {
            // Sortiere nach Datum absteigend (neuste zuerst)
            return parseDate(b.datum).getTime() - parseDate(a.datum).getTime();
        } else {
            // Sortiere nach Kategorie und dann nach Datum absteigend innerhalb jeder Kategorie
            const kategorieA = kategorien.find(k => k.id === a.kategorie)?.name || a.kategorie;
            const kategorieB = kategorien.find(k => k.id === b.kategorie)?.name || b.kategorie;
            if (kategorieA === kategorieB) {
                // Innerhalb der gleichen Kategorie nach Datum absteigend
                return parseDate(b.datum).getTime() - parseDate(a.datum).getTime();
            }
            return kategorieA.localeCompare(kategorieB);
        }
    });

    // Gruppiere die Buchungen nach Kategorien (nur wenn nach Kategorie sortiert wird)
    const groupedBuchungen = sortMode === 'kategorie' ?
        sortedBuchungen.reduce((acc, buchung) => {
            const kategorieName = kategorien.find(k => k.id === buchung.kategorie)?.name || buchung.kategorie;
            if (!acc[kategorieName]) {
                acc[kategorieName] = [];
            }
            acc[kategorieName].push(buchung);
            return acc;
        }, {} as Record<string, BuchungResource[]>) :
        sortedBuchungen.reduce((groups: Record<string, BuchungResource[]>, buchung) => {
            if (!groups[buchung.datum]) {
                groups[buchung.datum] = [];
            }
            groups[buchung.datum].push(buchung);
            return groups;
        }, {});

    const startIntro = () => {

        const isMobile = window.innerWidth < 851;
        const filterText = isMobile ? 'Um die Buchungen zu filtern, wähle die entsprechende Kategorie aus.' :
            'Um die Buchungen zu filtern, wähle die entsprechende Kategorie aus der linken Spalte unter "Filter" aus.';
        const intro = introJs();
        intro.setOptions({
            steps: [
                {
                    element: '#buchungenAnzeigenMain',
                    intro: 'Willkommen auf der Buchungs-Seite. Hier siehst alle deine getätigten Buchungen.',
                    position: 'right',
                },
                {
                    element: '.sortierenNach',
                    intro: 'Um die Buchungen zu sortieren, wähle die entsprechende Kategorie aus.',
                    position: 'left',
                },

                {
                    element: '.filterAccordionButton',
                    intro: filterText,
                    position: 'right',
                },
                {
                    element: '#buchungenAnzeigenMain',
                    intro: 'Um einzelne Buchungen zu bearbeiten, zu löschen oder Details einzusehen, klicke auf die 3 schwarzen Punkte.',
                    position: 'right',
                }
            ],
            showProgress: true,
            showBullets: false,
            nextLabel: 'Weiter →',
            prevLabel: '← Zurück',
            doneLabel: 'Fertig',
            scrollToElement: false,
        })
        intro.onchange((targetElement) => {
            let scrollOffset = 100; // Standardwert

            if (targetElement.id === 'buchungenAnzeigenMain') {
                scrollOffset = 150;
            } else if (targetElement.classList.contains('sortierenNach')) {
                scrollOffset = 200;
            } else if (targetElement.classList.contains('filterAccordionButton')) {
                scrollOffset = 250;
            } else if (targetElement.classList.contains('buchungen-group')) {
                scrollOffset = 300;
            }

            console.log(`Scrolling to: ${targetElement.id || targetElement.className}, Offset: ${scrollOffset}`);

            window.scrollTo({
                top: targetElement.getBoundingClientRect().top + window.scrollY - scrollOffset,
                behavior: 'smooth'
            });
        });


        intro.start();
    };

    return isPCScreen ? (
        <main id="buchungenAnzeigenMain">

            <Filter onFilterChange={handleFilterChange} filters={filters} />
            <section id="alleBuchungenSection">

                <div id="alleBuchungenHeader">
                    <div className="intro-wrap">
                        <h2 className="sectionTitle">Buchungen</h2>
                        <button
                            onClick={startIntro} className="intro-button"
                        >
                            <img src={helpIcon} alt="" />
                        </button>
                    </div>
                    <div className="sortierenNach">
                        <div className="sortierenNachTextAndIcon">
                            <img src={swap_icon} alt="upload Icon" />
                            <p>Sortieren nach:</p>
                        </div>
                        <div className="toggle-button">
                            <label
                                className={`radio ${sortMode === "kategorie" ? "selected" : ""}`}
                            >
                                <input
                                    type="radio"
                                    name="sortMode"
                                    value="katreogie"
                                    checked={sortMode === "kategorie"}
                                    onChange={() => setSortMode("kategorie")}
                                    required
                                />
                                Kategorie
                            </label>
                            <label className={`radio ${sortMode === "datum" ? "selected" : ""}`}>
                                <input
                                    type="radio"
                                    name="sortMode"
                                    value="datum"
                                    checked={sortMode === "datum"}
                                    onChange={() => setSortMode("datum")}
                                    required
                                />
                                Datum
                            </label>
                        </div>
                    </div>
                </div>
                <div className="buchungCardsContainer">
                    {Object.keys(groupedBuchungen).map((groupName) => (
                        <div key={groupName} className="kategorie-section">
                            <div className="buchungCardsContainerDateOrCategory">{groupName}</div>
                            {groupedBuchungen[groupName].map((buchung) => (
                                <Buchung
                                    key={buchung.id}
                                    buchung={buchung}
                                    kategorien={kategorien}
                                    pockets={pockets}
                                    sparziele={sparziele}
                                    onDelete={handleDelete}
                                    sortMode={sortMode}
                                    openDropdownId={openDropdownId}
                                    setOpenDropdownId={handleDropdownToggle}
                                    openDetailsId={openDetailsId}
                                    setOpenDetailsId={handleDetailsToggle}
                                />
                            ))}
                        </div>
                    ))}
                </div>
            </section>
        </main>
    ) : (
        <main id="buchungenAnzeigenMain">
            <section id="alleBuchungenSection">
                <div id="alleBuchungenHeader">
                    <div className="intro-wrap">
                        <h2 className="sectionTitle">Buchungen</h2>
                        <button
                            onClick={startIntro} className="intro-button"
                        >
                            <img src={helpIcon} alt="" />
                        </button>
                    </div>

                    <div className="sortierenNach">
                        <div className="sortierenNachTextAndIcon">
                            <img src={swap_icon} alt="upload Icon" />
                            <p>Sortieren nach:</p>
                        </div>
                        <div className="toggle-button">
                            <label
                                className={`radio ${sortMode === "kategorie" ? "selected" : ""}`}
                            >
                                <input
                                    type="radio"
                                    name="sortMode"
                                    value="katreogie"
                                    checked={sortMode === "kategorie"}
                                    onChange={() => setSortMode("kategorie")}
                                    required
                                />
                                Kategorie
                            </label>
                            <label className={`radio ${sortMode === "datum" ? "selected" : ""}`}>
                                <input
                                    type="radio"
                                    name="sortMode"
                                    value="datum"
                                    checked={sortMode === "datum"}
                                    onChange={() => setSortMode("datum")}
                                    required
                                />
                                Datum
                            </label>
                        </div>
                    </div>
                </div>

                <Filter onFilterChange={handleFilterChange} filters={filters} />
                <div className="buchungCardsContainer">
                    {Object.keys(groupedBuchungen).map((groupName) => (
                        <div key={groupName} className="kategorie-section">
                            <div className="buchungCardsContainerDateOrCategory">{groupName}</div>
                            {groupedBuchungen[groupName].map((buchung) => (
                                <Buchung
                                    key={buchung.id}
                                    buchung={buchung}
                                    kategorien={kategorien}
                                    pockets={pockets}
                                    sparziele={sparziele}
                                    onDelete={handleDelete}
                                    sortMode={sortMode}
                                    openDropdownId={openDropdownId}
                                    setOpenDropdownId={handleDropdownToggle}
                                    openDetailsId={openDetailsId}
                                    setOpenDetailsId={handleDetailsToggle}
                                />
                            ))}
                        </div>
                    ))}
                </div>
            </section>
        </main>
    );

}

export default AlleBuchungen;
