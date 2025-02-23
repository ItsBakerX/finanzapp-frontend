import React, { FormEvent, useState, useEffect, useRef } from "react";
import { useLoginContext } from "../LoginContext";
import { deletePocket, getAllePockets, getLogin, postPocket, updatePocketNameOrNotiz } from "../../backend/api";
import { PocketResource } from "../../Resources";
import options_icon from '../img/options_icon.svg';
import { loadKategorien, loadPockets, loadSparziele } from '../../dataLoader';
import '../../style/Muhammad_CSS/PagePocket.css';
import { getAnzahlBuchungen } from "../../backend/temp";


function PocketAnzeigen() {
    const [showPocketForm, setShowPocketForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [pocketName, setPocketName] = useState("");
    const [betrag, setBetrag] = useState<number | undefined>(undefined);
    const [notiz, setNotiz] = useState("");
    const [pockets, setPockets] = useState<PocketResource[]>([]);
    const [editingPocket, setEditingPocket] = useState<PocketResource | null>(null);
    const { loginInfo, setLoginInfo } = useLoginContext();
    const [gesamtVermoegen, setGesamtVermoegen] = useState(0);
    const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
    const [transaktionen, setTransaktionen] = useState<Map<string, number>>(new Map());
    const dropdownRef = useRef<HTMLDivElement>(null);


    useEffect(() => {
        const fetchPockets = async () => {
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
                console.error('Fehler beim Laden der Pockets:', error);
            }
        };
        fetchPockets();
    }, []);


    // useEffect(() => {
    //     const handleClickOutside = (event: MouseEvent) => {
    //         if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
    //             setDropdownOpen(null);
    //         }
    //     };

    //     document.addEventListener('mousedown', handleClickOutside);
    //     return () => {
    //         document.removeEventListener('mousedown', handleClickOutside);
    //     };
    // }, [setDropdownOpen]);



    useEffect(() => {
        let gesamt = 0;
        pockets.forEach((pocket) => {
            gesamt += pocket.betrag;
        });
        setGesamtVermoegen(gesamt);
    }, [pockets]);

    useEffect(() => {
        const fetchTransaktionen = async () => {
            try {
                const buchungenMap = await getAnzahlBuchungen();
                setTransaktionen(buchungenMap);
            } catch (error) {
                console.error("Fehler beim Laden der Transaktionen", error);
            }
        };
        fetchTransaktionen();
    }, []);


    const handlePocketButtonClick = () => {
        document.documentElement.classList.add("no-scroll");
        setShowPocketForm(true);
        setEditingPocket(null);
    };

    const handlePocketSubmit = async (event: FormEvent<HTMLFormElement>) => {
        document.documentElement.classList.remove("no-scroll");
        event.preventDefault();

        const loginInfo = await getLogin();
        let benutzerId = loginInfo ? loginInfo.id : "";

        try {
            if (editingPocket) {
                // Aktualisiere ein bestehendes Pocket
                await updatePocketNameOrNotiz(editingPocket.id!, pocketName, betrag || 0, notiz, benutzerId);
            } else {
                // Erstelle ein neues Pocket
                const newPocket: PocketResource = { name: pocketName, benutzer: benutzerId, betrag: betrag || 0, notiz };
                await postPocket(newPocket);
            }

            // Formular und Zustand zurücksetzen
            setShowPocketForm(false);
            setShowEditForm(false);
            setPocketName("");
            setBetrag(undefined);
            setNotiz("");

            // Hol die aktualisierten Pockets und speichere sie in den Zustand und den localStorage
            const fetchedPockets = await getAllePockets();
            setPockets(fetchedPockets);
            localStorage.setItem('cachedPockets', JSON.stringify(fetchedPockets));
        } catch (error) {
            console.error("Fehler beim Erstellen/Aktualisieren des Pockets:", error);
        }
    };

    const handlePocketCancel = () => {
        document.documentElement.classList.remove("no-scroll");
        setShowPocketForm(false);
        setShowEditForm(false);
        setPocketName("");
        setBetrag(undefined);
        setNotiz("");
        setEditingPocket(null);
    };

    const handleDeletePocket = async (pocketId: string) => {
        try {
            // Lösche das Pocket
            await deletePocket(pocketId);

            // Aktualisiere den Zustand und den localStorage
            const fetchedPockets = await getAllePockets();
            setPockets(fetchedPockets);
            localStorage.setItem('cachedPockets', JSON.stringify(fetchedPockets));
        } catch (error) {
            console.error("Fehler beim Löschen des Pockets:", error);
        }
    };

    const handleEditPocket = async (pocket: PocketResource) => {
        document.documentElement.classList.add("no-scroll");
        setPocketName(pocket.name);
        setBetrag(pocket.betrag);
        setNotiz(pocket.notiz || "");
        setEditingPocket(pocket);
        setShowEditForm(true);
        const fetchedPockets = await getAllePockets();
        setPockets(fetchedPockets);
        localStorage.setItem('cachedPockets', JSON.stringify(fetchedPockets));
    };

    return (
        <>
            {/* Pocker erstellen Fenster */}
            {showPocketForm && (
                <div className="overlay">
                    <div className="pocket-card create-card">
                        <div className="create-card-header">
                            <h3 className="create-card-title">Neues Pocket erstellen</h3>
                            <div className="button-container">
                                <div>
                                    <button className="close-btn" onClick={handlePocketCancel}>
                                        X
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="card-content">
                            <form className="pocket-form" onSubmit={handlePocketSubmit}>
                                <div className="field">
                                    <div>
                                        <h4 className="feldHeader">Name</h4>
                                        <input className="eingabeFeld"
                                            type="text"
                                            placeholder="Name"
                                            value={pocketName}
                                            onChange={(e) => setPocketName(e.target.value)}
                                            maxLength={30} />

                                        <p className="help">*maximal 30 Zeichen</p>
                                    </div>
                                    <div>
                                        <h4 className="feldHeader">Gesamtguthaben</h4>
                                        <input className="eingabeFeld"
                                            type="number"
                                            placeholder="Gesamtguthaben"
                                            value={betrag}
                                            onChange={(e) => setBetrag(parseFloat(e.target.value))} />
                                    </div>
                                </div>

                                <div>
                                    <h4 className="feldHeader">Notiz</h4>
                                    <textarea className="eingabeFeld"
                                        placeholder="Notiz (optional)"
                                        maxLength={140}
                                        value={notiz}
                                        rows={2}
                                        style={{ resize: "none" }}
                                        onChange={(e) => setNotiz(e.target.value)} />

                                </div>
                                <div className="field confirmButtons">
                                    <button className="button submitButton" type="submit">Neues Pocket erstellen</button>
                                    <button className="buttonAbbrechen button " type="button" onClick={handlePocketCancel}>Abbrechen</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Pocket bearbeiten Fenster */}
            {showEditForm && (
                <div className="pocket-overlay">
                    <div className="pocket-card create-card">
                        <div className="create-card-header">
                            <h3 className="create-card-title">Pocket bearbeiten</h3>
                            <div className="button-container">
                                <div>
                                    <button className="close-btn" onClick={handlePocketCancel}>
                                        X
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="card-content">
                            <form className="pocket-form" onSubmit={handlePocketSubmit}>
                                <div className="field">
                                    <div>
                                        <h4 className="feldHeader">Name</h4>
                                        <input
                                            className="eingabeFeld"
                                            type="text"
                                            placeholder="Name"
                                            value={pocketName}
                                            onChange={(e) => setPocketName(e.target.value)}
                                            maxLength={30}
                                        />

                                        <p className="help">*maximal 30 Zeichen</p>
                                    </div>

                                </div>
                                <div>
                                    <h4 className="feldHeader">Notiz</h4>
                                    <textarea className="eingabeFeld"
                                        placeholder="Notiz (optional)"
                                        maxLength={140}
                                        value={notiz}
                                        rows={2}
                                        style={{ resize: "none" }}
                                        onChange={(e) => setNotiz(e.target.value)} />
                                </div>
                                <div className="confirmButtons field">
                                    <button className="button submitButton" type="submit">
                                        Pocket speichern
                                    </button>
                                    <button className="buttonAbbrechen button" type="button" onClick={handlePocketCancel}>
                                        Abbrechen
                                    </button>

                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}


            {/* DROPDOWN */}
            {!showPocketForm && !showEditForm && (
                <div>
                    <div className="pocketTitleAndButton selectedContentHeader">
                        <h2>Pocket</h2>
                        <button className="pocketErstellenButton" onClick={handlePocketButtonClick}>Neues Pocket erstellen</button>
                    </div>
                    <div className="pocketField">
                        <div>
                            <h3>Gesamtvermögen</h3>
                            <p className="pocketsStand">Aktueller Stand: {gesamtVermoegen.toFixed(2)}€</p>
                        </div>
                        <div>
                            <div>
                                <h3 className="pocketsTitle">Meine Pockets</h3>
                                <p className="pocketsTutorial">Hier kannst du deine Pockets einsehen, bearbeiten oder löschen</p>
                            </div>
                        </div>
                        <div className="pocketCards">
                            {pockets.map((pocket) => (
                                <div key={pocket.id} className="pocketCard">
                                    <div className="pocketItem1">
                                        <div className="pocketTitleHistory">
                                            <p className="pocketTitle">{pocket.name}</p>
                                            <p className="pocketHistory">
                                                {(() => {
                                                    const anzahl = transaktionen.get(pocket.id!);
                                                    if (anzahl) {
                                                        return `${anzahl} Transaktion(en) in den letzten 14 Tagen`;
                                                    } else {
                                                        return "Keine Transaktionen in den letzten 14 Tagen";
                                                    }
                                                })()}
                                            </p>
                                        </div>
                                        <div className="pocketOptionsMobile">
                                            <div className="cardOptions">
                                                <button className="cardOptionsButton">
                                                    <img src={options_icon} alt="Options Icon" onClick={() => {
                                                        if (!dropdownOpen) {
                                                            setDropdownOpen(pocket.id!);
                                                        } else {
                                                            setDropdownOpen(null);
                                                        }
                                                    }} />
                                                </button>
                                                {dropdownOpen === pocket.id && (
                                                    <div className="options-dropdown" ref={dropdownRef}>
                                                        <a onClick={() => handleEditPocket(pocket)}>Bearbeiten</a>
                                                        <a onClick={() => handleDeletePocket(pocket.id!)}>Löschen</a>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="pocketItem2">
                                        <p className="pocketGuthaben">Gesamtguthaben: <span>{pocket.betrag.toFixed(2)}€</span></p>
                                        <p className="pocketNotiz">{pocket.notiz}</p>
                                    </div>
                                    <div className="pocketOptionsPC">
                                        <div className="cardOptions">
                                            <button className="cardOptionsButton">
                                                <img src={options_icon} alt="Options Icon" onClick={() => {
                                                    if (!dropdownOpen) {
                                                        setDropdownOpen(pocket.id!);
                                                    } else {
                                                        setDropdownOpen(null);
                                                    }
                                                }} />
                                            </button>
                                            {dropdownOpen === pocket.id && (
                                                <div className="options-dropdown" ref={dropdownRef}>
                                                    <a onClick={() => handleEditPocket(pocket)}>Bearbeiten</a>
                                                    <a onClick={() => handleDeletePocket(pocket.id!)}>Löschen</a>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                </div>

                            ))}
                        </div>
                    </div>
                </div>
            )
            }
        </>
    );
}

export default PocketAnzeigen;