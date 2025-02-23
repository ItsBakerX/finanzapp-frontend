import React, { useState, useEffect, FormEvent, useRef } from 'react';
import { getAlleSparziele, postSparziel, deleteSparziel, updateSparziel, getLogin, getFaelligkeitTageById } from '../../backend/api';
import { useLoginContext } from '../LoginContext';
import { SparzielResource } from '../../Resources';
import options_icon from '../img/options_icon.svg';

import '../../style/Muhammad_CSS/PageSparziel.css';

function SparzieleAnzeigen() {
    const [showSparzielForm, setShowSparzielForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [name, setName] = useState('');
    const [betrag, setBetrag] = useState<number | undefined>(undefined);
    const [zielbetrag, setZielbetrag] = useState<number | undefined>(undefined);
    const [datum, setDatum] = useState('');
    const [notiz, setNotiz] = useState('');
    const [sparziele, setSparziele] = useState<SparzielResource[]>([]);
    const [editingSparziel, setEditingSparziel] = useState<SparzielResource | null>(null);
    const { loginInfo, setLoginInfo } = useLoginContext();
    const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
    const [faelligkeitTage, setFaelligkeitTage] = useState<{ [key: string]: number | null }>({});

    const dropdownRef = useRef<HTMLDivElement>(null);


    async function fetchSparziele() {
        try {
            const cachedSparziele = localStorage.getItem('cachedSparziele');
            if (cachedSparziele) {
                const sparziele = JSON.parse(cachedSparziele);
                const sparzieleWithTage = await Promise.all(
                    sparziele.map(async (sparziel: SparzielResource) => {
                        try {
                            const tage = await getFaelligkeitTageById(sparziel.id!);
                            return { ...sparziel, tage };
                        } catch (error) {
                            console.error('Fehler beim Laden der Fälligkeitstage für Sparziel:', error);
                            return { ...sparziel, tage: null };
                        }
                    })
                );
                const tageMap = Object.fromEntries(
                    sparzieleWithTage.map(({ id, tage }) => [id, tage])
                );
                setSparziele(sparzieleWithTage);
                setFaelligkeitTage(tageMap);
            } else {
                const sparziele = await getAlleSparziele();
                const sparzieleWithTage = await Promise.all(
                    sparziele.map(async (sparziel) => {
                        try {
                            const tage = await getFaelligkeitTageById(sparziel.id!);
                            return { ...sparziel, tage };
                        } catch (error) {
                            console.error('Fehler beim Laden der Fälligkeitstage für Sparziel:', error);
                            return { ...sparziel, tage: null };
                        }
                    })
                );
                const tageMap = Object.fromEntries(
                    sparzieleWithTage.map(({ id, tage }) => [id, tage])
                );

                setSparziele(sparzieleWithTage);
                setFaelligkeitTage(tageMap);
                localStorage.setItem('cachedSparziele', JSON.stringify(sparzieleWithTage));
            }
        } catch (error) {
            console.error('Fehler beim Laden der Sparziele:', error);
        }
    }


    useEffect(() => {
        fetchSparziele();
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

    const tage = (sparzielId: string): string => {
        const date = faelligkeitTage[sparzielId];
        if (date == null) {
            return "Nicht verfügbar";
        }
        if (date === 0) {
            return "Heute fällig";
        }
        if (date < 0) {
            return `Überfällig seit ${Math.abs(date)} Tagen`;
        }
        return `In ${date} Tagen fällig`;
    };

    const handleOpenForm = () => {
        document.documentElement.classList.add("no-scroll");
        setShowSparzielForm(true);
        setEditingSparziel(null);
    };


    const handleDate = () => {
        return new Date(datum).toLocaleDateString('de-DE', { year: 'numeric', month: '2-digit', day: '2-digit' });
    };

    const handleSparzielSubmit = async (event: FormEvent<HTMLFormElement>) => {
        document.documentElement.classList.remove("no-scroll");
        event.preventDefault();
        const login = await getLogin();
        setLoginInfo(login);
        let benutzerId = "";
        if (loginInfo) {
            benutzerId = loginInfo.id;
        }

        try {
            if (editingSparziel) {
                await updateSparziel(editingSparziel.id!, name, benutzerId, betrag, zielbetrag, handleDate(), notiz);
            } else {
                await postSparziel(name, benutzerId, betrag!, zielbetrag!, handleDate(), notiz);
            }
            setShowSparzielForm(false);
            setShowEditForm(false);
            setName('');
            setBetrag(undefined);
            setZielbetrag(undefined);
            setDatum('');
            setNotiz('');

            const fetchedSparziele = await getAlleSparziele();
            setSparziele(fetchedSparziele);
            localStorage.setItem('cachedSparziele', JSON.stringify(fetchedSparziele));
        } catch (error) {
            console.error("Fehler Sparziel wurde nicht erstellt/aktualisiert", error);
        }
    };

    const handleSparzielCancel = () => {
        document.documentElement.classList.remove("no-scroll");
        setShowSparzielForm(false);
        setShowEditForm(false);
        setName('');
        setBetrag(undefined);
        setZielbetrag(undefined);
        setDatum('');
        setNotiz('');
        setEditingSparziel(null);
    };

    const handleDeleteSparziel = async (sparzielId: string) => {
        try {
            await deleteSparziel(sparzielId);
            await fetchSparziele();
            const fetchedSparziele = await getAlleSparziele();
            setSparziele(fetchedSparziele);
            localStorage.setItem('cachedSparziele', JSON.stringify(fetchedSparziele));
        } catch (error) {
            console.error("Fehler Sparziel wurde nicht gelöscht", error);
        }
    };




    const handleEditSparziel = async (sparziel: SparzielResource) => {
        document.documentElement.classList.add("no-scroll");
        setName(sparziel.name);
        setBetrag(sparziel.betrag);
        setZielbetrag(sparziel.zielbetrag);
        if (sparziel.faelligkeitsdatum) {
            //Konvertieren von DD.MM_YYY -> DD-MM-YYY
            const [day, month, year] = sparziel.faelligkeitsdatum.split(".");
            setDatum(`${year}-${month}-${day}`);
        }

        setNotiz(sparziel.notiz || '');
        setEditingSparziel(sparziel);
        setShowEditForm(true);
        const fetchedSparziele = await getAlleSparziele();
        setSparziele(fetchedSparziele);
        localStorage.setItem('cachedSparziele', JSON.stringify(fetchedSparziele));
    };

    const progressCalc = (betrag: number, zielbetrag: number) => {
        return (betrag / zielbetrag) * 100;
    };

    return (
        <>
            <div className="sparzielTitleAndButton selectedContentHeader">
                <h2>Sparziele</h2>
                <button className="sparzielErstellenButton" onClick={handleOpenForm}>Neues Sparziel erstellen</button>
            </div>
            {showSparzielForm && (
                <div className="overlay">
                    <div className="sparziel-card create-card">
                        <div className="create-card-header">
                            <h3 className="create-card-title">Neues Pocket erstellen</h3>
                            <div className="button-container">
                                <div>
                                    <button className="close-btn" onClick={handleSparzielCancel}>
                                        X
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="card-content">
                            <form className="sparziel-form" onSubmit={handleSparzielSubmit}>
                                <div className="sparzielTitleDateField field">
                                    <div>
                                        <h4 className="feldHeader">Titel</h4>
                                        <input className="eingabeFeld"
                                            type="text"
                                            placeholder="Gebe hier den Titel deines Sparziels ein"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            maxLength={30} />
                                        <p className="help">*maximal 30 Zeichen</p>
                                    </div>
                                    <div>
                                        <h4 className="feldHeader">Fälligkeitsdatum</h4>
                                        <input className="eingabeFeld"
                                            type="date"
                                            value={datum}
                                            onChange={(e) => setDatum(e.target.value)} />
                                    </div>
                                </div>
                                <div className="field">
                                    <div>
                                        <h4 className="feldHeader">Betrag</h4>
                                        <input className="eingabeFeld"
                                            type="number"
                                            placeholder="Betrag"
                                            value={betrag}
                                            onChange={(e) => setBetrag(parseFloat(e.target.value))} />
                                    </div>
                                    <div>
                                        <h4 className="feldHeader">Zielbetrag</h4>
                                        <input className="eingabeFeld"
                                            type="number"
                                            placeholder="Zielbetrag"
                                            value={zielbetrag}
                                            onChange={(e) => setZielbetrag(parseFloat(e.target.value))} />
                                    </div>

                                </div>
                                <div className="">
                                    <h4 className="feldHeader">Notiz</h4>
                                    <textarea className="eingabeFeld"
                                        placeholder="Notiz (optional)"
                                        maxLength={140}
                                        value={notiz}
                                        rows={2}
                                        style={{ resize: "none" }}
                                        onChange={(e) => setNotiz(e.target.value)} />
                                </div>
                                <div className='confirmButtons field'>
                                    <button className="button submitButton" type="submit">
                                        Sparziel speichern
                                    </button>
                                    <button
                                        className="buttonAbbrechen button"
                                        type="button"
                                        onClick={handleSparzielCancel}
                                    >
                                        Abbrechen
                                    </button>

                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {showEditForm && (
                <div className="overlay">
                    <div className="sparziel-card create-card">
                        <div className="create-card-header ">
                            <h3 className="create-card-title">Sparziel bearbeiten</h3>
                            <div className="button-container">
                                <div>
                                    <button className="close-btn" onClick={handleSparzielCancel}>
                                        X
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="card-content">
                            <form className="sparziel-form" onSubmit={handleSparzielSubmit}>
                                <div className="sparzielTitleDateField field">
                                    <div>
                                        <h4 className="feldHeader">Titel</h4>
                                        <input className="eingabeFeld"
                                            type="text"
                                            placeholder="Gebe hier den Titel deines Sparziels ein"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            maxLength={30} />
                                        <p className="help">*maximal 30 Zeichen</p>
                                    </div>
                                    <div>
                                        <h4 className="feldHeader">Fälligkeitsdatum</h4>
                                        <input className="eingabeFeld"
                                            type="date"
                                            value={datum}
                                            onChange={(e) => setDatum(e.target.value)} />
                                    </div>
                                </div>
                                <div className="field">
                                    <div>
                                        <h4 className="feldHeader">Betrag</h4>
                                        <input className="eingabeFeld"
                                            type="number"
                                            placeholder="Betrag"
                                            value={betrag}
                                            onChange={(e) => setBetrag(parseFloat(e.target.value))} />
                                    </div>
                                    <div>
                                        <h4 className="feldHeader">Zielbetrag</h4>

                                        <input className="eingabeFeld"
                                            type="number"
                                            placeholder="Zielbetrag"
                                            value={zielbetrag}
                                            onChange={(e) => setZielbetrag(parseFloat(e.target.value))} />
                                    </div>

                                </div>
                                <div className="">
                                    <h4 className="feldHeader">Notiz</h4>
                                    <textarea className="eingabeFeld"
                                        placeholder="Notiz (optional)"
                                        maxLength={140}
                                        value={notiz}
                                        rows={2}
                                        style={{ resize: "none" }}
                                        onChange={(e) => setNotiz(e.target.value)} />
                                </div>
                                <div className='confirmButtons field'>
                                    <button className="button submitButton" type="submit">
                                        Sparziel speichern
                                    </button>
                                    <button
                                        className="buttonAbbrechen button"
                                        type="button"
                                        onClick={handleSparzielCancel}
                                    >
                                        Abbrechen
                                    </button>

                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}


            {!showSparzielForm && !showEditForm && (
                <div className="benutzerdefinierte-sparziele-container">
                    <h3 className="sparzieleTitle"> Meine Sparziele</h3>
                    <p className='sparzielTutorial'>Hier kannst du deine selbst erstellten Sparziel einsehen, bearbeiten oder löschen.</p>
                    <div className='sparzielCards'>
                        {sparziele.map((sparziel) => (
                            <div key={sparziel.id} className="sparzielCard">
                                <div className="sparzielItem1">
                                    <div className='sparzielNameBetragTage'>
                                        <p className="sparzielName">{sparziel.name}</p>
                                        <p className='sparzielBetrag'>Betrag: {sparziel.betrag}€</p>
                                        <p className='sparzielTage'>{tage(sparziel.id!)}</p>
                                    </div>
                                    <div className="sparzielOptionsMobile">
                                        <div className="cardOptions">
                                            <button className="cardOptionsButton">
                                                <img src={options_icon} onClick={() => {
                                                    if (!dropdownOpen) {
                                                        setDropdownOpen(sparziel.id!);
                                                    } else {
                                                        setDropdownOpen(null);
                                                    }
                                                }} alt="Options Icon" />
                                            </button>
                                            {dropdownOpen === sparziel.id && (
                                                <div className="options-dropdown" ref={dropdownRef}>
                                                    <a onClick={() => handleEditSparziel(sparziel)}>Bearbeiten</a>
                                                    <a onClick={() => handleDeleteSparziel(sparziel.id!)}>Löschen</a>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="sparzielItem2">
                                    <p className='sparzielZielbetrag'>Zielbetrag: <span> {sparziel.zielbetrag}€ </span></p>
                                    <p className='sparzielFaelligkeitsdatum'>Fälligkeitsdatum: <span> {sparziel.faelligkeitsdatum} </span></p>
                                    <div className="fortschrittsbalkenItem2 ">
                                        <div className="fortschrittsbalken" style={{ width: `${progressCalc(sparziel.betrag!, sparziel.zielbetrag!)}%` }}>
                                            <p>{`${progressCalc(sparziel.betrag!, sparziel.zielbetrag!).toFixed(2)}%`}</p>
                                        </div>
                                    </div>
                                    <p className='sparzielNotiz'>{sparziel.notiz}</p>
                                </div>

                                <div className="sparzielOptionsPC">
                                    <div className="cardOptions">
                                        <button className="cardOptionsButton">
                                            <img src={options_icon} onClick={() => {
                                                if (!dropdownOpen) {
                                                    setDropdownOpen(sparziel.id!);
                                                } else {
                                                    setDropdownOpen(null);
                                                }
                                            }} alt="Options Icon" />
                                        </button>
                                        {dropdownOpen === sparziel.id && (
                                            <div className="options-dropdown" ref={dropdownRef}>
                                                <a onClick={() => handleEditSparziel(sparziel)}>Bearbeiten</a>
                                                <a onClick={() => handleDeleteSparziel(sparziel.id!)}>Löschen</a>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            )}

        </>
    );
}

export default SparzieleAnzeigen;