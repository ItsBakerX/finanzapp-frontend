import React, { FormEvent, useState, useEffect, useRef } from "react";
import { getAlleKategorien, getAlleStandardKategorien, getLogin, postBuchungskategorie, getAlleEigeneKategorien, deleteBuchungskategorie, updateBuchungskategorie } from "../../backend/api";
import { useLoginContext } from "../LoginContext";
import { BuchungskategorieResource } from "../../Resources";
import benutzerdef_icon from '../img/benutzerdef_icon.svg';
import options_icon from '../img/options_icon.svg';
import '../../style/Muhammad_CSS/PageKategorie.css';
import categoryIcons from "../categoryIcons";

function KategorieAnzeigen() {
    const [showCategoryForm, setShowCategoryForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [kategoryName, setKategorie] = useState("");
    const [ausgabenlimit, setAusgabenlimit] = useState<number | undefined>(undefined);
    const [kategorien, setKategorien] = useState<BuchungskategorieResource[]>([]);
    const [benutzerdefinierteKategorien, setBenutzerdefinierteKategorien] = useState<BuchungskategorieResource[]>([]);
    const [editingCategory, setEditingCategory] = useState<BuchungskategorieResource | null>(null);
    const [isStandardCategory, setIsStandardCategory] = useState(false);
    const { loginInfo, setLoginInfo } = useLoginContext();
    const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);

    const dropdownRef = useRef<HTMLDivElement>(null);

    const categoryIcon = categoryIcons[kategoryName] || categoryIcons['default'];


    useEffect(() => {
        loadKategorien();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [setDropdownOpen]);

    async function loadKategorien() {
        try {
            // Prüfe, ob Kategorien im localStorage vorhanden sind
            const cachedData = localStorage.getItem('cachedKategorien');

            if (cachedData) {
                console.log("Kategorien aus localStorage geladen");
                const { standardKategorien, benutzerdefinierteKategorien } = JSON.parse(cachedData);

                if (standardKategorien) {
                    setKategorien(standardKategorien);
                }
                if (benutzerdefinierteKategorien) {
                    setBenutzerdefinierteKategorien(benutzerdefinierteKategorien);
                }
            } else {
                console.log("Keine Daten im localStorage, lade von API");
                // Daten von der API laden
                const [alleStandardKategorien, alleBenutzerdefinierteKategorien] = await Promise.all([
                    getAlleStandardKategorien(),
                    getAlleEigeneKategorien(),
                ]);

                // Zustand aktualisieren
                setKategorien(alleStandardKategorien);
                setBenutzerdefinierteKategorien(alleBenutzerdefinierteKategorien);

                // Daten in localStorage speichern
                localStorage.setItem(
                    'cachedKategorien',
                    JSON.stringify({
                        standardKategorien: alleStandardKategorien,
                        benutzerdefinierteKategorien: alleBenutzerdefinierteKategorien,
                    })
                );
            }
        } catch (error) {
            console.error("Fehler beim Laden der Kategorien", error);
        }
    }

    const handleCategoryButtonClick = () => {
        document.documentElement.classList.add("no-scroll");
        setShowCategoryForm(true);
        setEditingCategory(null);
        setIsStandardCategory(false);
    };

    //Bei PocketsAnzeigen müsste die gleiche Struktur (mit updateLocalStoragePockets) sein,
    //aber da wurde mit der Funktion nciht direkt neugerendert, aber ohne - schon
    async function updateLocalStorageCategories(
        standardKategorien: BuchungskategorieResource[],
        benutzerdefinierteKategorien: BuchungskategorieResource[]
    ) {
        try {
            // Hole den aktuellen Eintrag aus dem localStorage
            const cachedData = localStorage.getItem('cachedKategorien');
            let cachedObject = cachedData ? JSON.parse(cachedData) : {};

            // Aktualisiere Standard- und benutzerdefinierte Kategorien
            cachedObject.standardKategorien = standardKategorien;
            cachedObject.benutzerdefinierteKategorien = benutzerdefinierteKategorien;

            // Speichere die aktualisierten Daten zurück in den localStorage
            localStorage.setItem('cachedKategorien', JSON.stringify(cachedObject));

            console.log('Kategorien im localStorage erfolgreich aktualisiert.');
        } catch (error) {
            console.error('Fehler beim Aktualisieren der Kategorien im localStorage:', error);
        }
    }


    const handleCategorySubmit = async (event: FormEvent<HTMLFormElement>) => {
        document.documentElement.classList.remove("no-scroll");
        event.preventDefault();
        setLoginInfo(await getLogin());
        let benutzerId = "";
        if (loginInfo) {
            benutzerId = loginInfo.id;
        }

        try {
            let limitToSave = ausgabenlimit === undefined || ausgabenlimit === null ? 0 : ausgabenlimit; // Setze 0 falls leer

            if (editingCategory) {
                await updateBuchungskategorie(editingCategory.id!, kategoryName, limitToSave);
            } else {
                const category: BuchungskategorieResource = { name: kategoryName, benutzer: benutzerId, ausgabenlimit: limitToSave };
                await postBuchungskategorie(category.name, category.benutzer, category.ausgabenlimit);
            }
            setShowCategoryForm(false);
            setShowEditForm(false);
            setKategorie("");
            setAusgabenlimit(undefined);

            // Hol die Kategorien neu
            const fetchStandardKategorien = await getAlleStandardKategorien();
            const fetchBenutzerdefinierteKategorien = await getAlleEigeneKategorien();
            setKategorien(fetchStandardKategorien);
            setBenutzerdefinierteKategorien(fetchBenutzerdefinierteKategorien);

            // Aktualisiere nur die Kategorien im localStorage
            await updateLocalStorageCategories(fetchStandardKategorien, fetchBenutzerdefinierteKategorien);
        } catch (error) {
            console.error("Fehler Kategorie wurde nicht erstellt/aktualisiert", error);
        }
    };

    const handleCategoryCancel = () => {
        document.documentElement.classList.remove("no-scroll");
        setShowCategoryForm(false);
        setShowEditForm(false);
        setKategorie("");
        setAusgabenlimit(undefined);
        setEditingCategory(null);
        setIsStandardCategory(false);

    };

    const handleDeleteCategory = async (kategorieId: string) => {
        try {
            await deleteBuchungskategorie(kategorieId);

            // Hol die Kategorien neu
            const fetchStandardKategorien = await getAlleStandardKategorien();
            const fetchBenutzerdefinierteKategorien = await getAlleEigeneKategorien();
            setKategorien(fetchStandardKategorien);
            setBenutzerdefinierteKategorien(fetchBenutzerdefinierteKategorien);

            // Aktualisiere nur die Kategorien im localStorage
            await updateLocalStorageCategories(fetchStandardKategorien, fetchBenutzerdefinierteKategorien);
        } catch (error) {
            console.error("Fehler Kategorie wurde nicht gelöscht", error);
        }
    };

    const handleEditCategory = async (kategorie: BuchungskategorieResource, standardKategorieFeld: boolean) => {
        document.documentElement.classList.add("no-scroll");
        setKategorie(kategorie.name);
        setAusgabenlimit(kategorie.ausgabenlimit);
        setEditingCategory(kategorie);
        setShowEditForm(true);
        setIsStandardCategory(standardKategorieFeld);
        const fetchStandardKategorien = await getAlleStandardKategorien();
        const fetchBenutzerdefinierteKategorien = await getAlleEigeneKategorien();
        setKategorien(fetchStandardKategorien);
        setBenutzerdefinierteKategorien(fetchBenutzerdefinierteKategorien);

        // Aktualisiere nur die Kategorien im localStorage
        await updateLocalStorageCategories(fetchStandardKategorien, fetchBenutzerdefinierteKategorien);
    };

    return (
        <>
            {showCategoryForm && (
                <div className="overlay">
                    <div className="kategorie-card create-card">
                        <div className="create-card-header">
                            <h3 className="create-card-title">Kategorie erstellen</h3>
                            <div className="button-container">
                                <div>
                                    <button className="close-btn" onClick={handleCategoryCancel}>
                                        X
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="card-content">
                            <form className="kategorie-form" onSubmit={handleCategorySubmit}>
                                <div className="kategorieField">

                                    <h4 className="feldHeader">Titel</h4>
                                    <input className="eingabeFeld" type="text" placeholder="Gebe den Titel Kategorie eingeben" value={kategoryName} onChange={(e) => setKategorie(e.target.value)} maxLength={30} />

                                    <p className="help">*maximal 30 Zeichen</p>
                                </div>
                                <div className="kategorieField">
                                    <h4 className="feldHeader">Ausgabenlimit (optional)</h4>
                                    <input
                                        className="eingabeFeld"
                                        type="number"
                                        placeholder="Ausgabenlimit"
                                        value={ausgabenlimit === undefined || ausgabenlimit === null ? "" : ausgabenlimit}
                                        onChange={(e) => {
                                            if (e.target.value === "") {
                                                setAusgabenlimit(undefined);
                                            } else {
                                                setAusgabenlimit(parseFloat(e.target.value));
                                            }
                                        }}
                                    />

                                </div>
                                <div className="confirmButtons field">
                                    <button className="button submitButton"
                                        type="submit">Neue Kategorie erstellen</button>
                                    <button className="buttonAbbrechen button"
                                        type="button"
                                        onClick={handleCategoryCancel}>Abbrechen</button>

                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
            {showEditForm && (
                <div className="overlay">
                    <div className="kategorie-card create-card">
                        <div className="create-card-header">
                            <h3 className="create-card-title">Kategorie bearbeiten</h3>
                            <div className="button-container">
                                <div>
                                    <button className="close-btn" onClick={handleCategoryCancel}>
                                        X
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="card-content">
                            <form className="kategorie-form" onSubmit={handleCategorySubmit}>
                                {!isStandardCategory && (
                                    <div className="kategorieField">
                                        <h4 className="feldHeader">Titel</h4>

                                        <input className="eingabeFeld"
                                            type="text"
                                            placeholder="Gebe hier den Titel deiner Kategorie ein"
                                            value={kategoryName}
                                            onChange={(e) => setKategorie(e.target.value)}
                                            maxLength={30} />
                                        <p className="help">*maximal 30 Zeichen</p>
                                    </div>
                                )}
                                <div className="kategorieField">
                                    <h4 className="feldHeader">Ausgabenlimit (optional)</h4>

                                    <input
                                        className="eingabeFeld"
                                        type="number"
                                        placeholder="Ausgabenlimit"
                                        value={ausgabenlimit === undefined || ausgabenlimit === null ? "" : ausgabenlimit}
                                        onChange={(e) => {
                                            if (e.target.value === "") {
                                                setAusgabenlimit(undefined);
                                            } else {
                                                setAusgabenlimit(parseFloat(e.target.value));
                                            }
                                        }}
                                    />

                                </div>
                                <div className=" confirmButtons field">
                                    <button className="button submitButton" type="submit">Kategorie speichern</button>
                                    <button className="buttonAbbrechen button" type="button" onClick={handleCategoryCancel}>Abbrechen</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
            {/* Damit nicht die Rectangle auf dem Formular angezeigt werden */}
            {!showCategoryForm && !showEditForm && (
                <div>

                    <div className="kategorieTitleAndButton selectedContentHeader">
                        <h2>Kategorie</h2>
                        <button className="kategorieErstellenButton" onClick={handleCategoryButtonClick}>Neue Kategorie erstellen</button>
                    </div>
                    <div className="title-kategorie">
                        <h3> Standard-Kategorien</h3>
                    </div>
                    <p className="kategorien-tutorial">Diese Kategorien stehen dir bereits zur Verfügung. Du kannst dir deine eigene Limits setzen, wenn du auf "Bearbeiten" im Dropdown-Menü klickst.</p>
                    <div className="kategorien-container">
                        {kategorien.filter(kategorie => kategorie.name !== "Übertrag").map((kategorie) => (
                            <div key={kategorie.id} className="kategorie-rectangle" ref={dropdownRef}>
                                <img
                                    src={categoryIcons[kategorie.name] || categoryIcons['default']}
                                    alt={`${kategorie.name} Icon`}
                                    className="kategorie-img"
                                />
                                <div className="kategorie-details">
                                    <div className="kategorie-name">{kategorie.name}</div>
                                    {kategorie.ausgabenlimit !== undefined && kategorie.ausgabenlimit !== 0 && (
                                        <div className="maximales-Ausgabelimit">Limit: {kategorie.ausgabenlimit}€</div>
                                    )}

                                </div>
                                <div className="cardOptions" >
                                    <button className="cardOptionsButton">
                                        <img src={options_icon} onClick={() => {
                                            if (!dropdownOpen) {
                                                setDropdownOpen(kategorie.id!);
                                            } else {
                                                setDropdownOpen(null);
                                            }
                                        }} alt="Options Icon" />
                                    </button>
                                    {dropdownOpen === kategorie.id && (
                                        <div className="options-dropdown" ref={dropdownRef}>
                                            <a onClick={() => handleEditCategory(kategorie, false)}>Bearbeiten</a>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>


                    <div className="title-benutzerdefinierte-kategorie">
                        <h3>Benutzerdefinierte Kategorien</h3>
                    </div>
                    <p className="benutzerdefinierte-kategorien-tutorial">Hier kannst du deine selbst erstellten Kategorien einsehen, bearbeiten oder löschen.</p>
                    <div className="benutzerdefinierte-kategorien-container">
                        {benutzerdefinierteKategorien.map((kategorie) => (
                            <div key={kategorie.id} className="benutzer-rectangle" ref={dropdownRef}>
                                <img src={benutzerdef_icon} alt="Grocery Icon" className="kategorie-img" />
                                <div className="benutzer-details">
                                    <div className="kategorie-name">{kategorie.name}</div>
                                    {kategorie.ausgabenlimit !== undefined && kategorie.ausgabenlimit !== 0 && (
                                        <div className="maximales-Ausgabelimit">Limit: {kategorie.ausgabenlimit}€</div>
                                    )}

                                </div>
                                <div className="cardOptions">
                                    <button className="cardOptionsButton">
                                        <img src={options_icon} onClick={() => {
                                            if (!dropdownOpen) {
                                                setDropdownOpen(kategorie.id!);
                                            } else {
                                                setDropdownOpen(null);
                                            }
                                        }} alt="Options Icon" />
                                    </button>
                                    {dropdownOpen === kategorie.id && (
                                        <div className="options-dropdown" ref={dropdownRef}>
                                            <a onClick={() => handleEditCategory(kategorie, false)}>Bearbeiten</a>
                                            <a onClick={() => handleDeleteCategory(kategorie.id!)}>Löschen</a>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>


                </div>
            )}

        </>
    );
}

export default KategorieAnzeigen;