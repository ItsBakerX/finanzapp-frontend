import React from 'react';
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BuchungResource, BuchungskategorieResource, PocketResource, SparzielResource } from "../Resources";
import { useLoginContext } from "./LoginContext";
import { getAllebuchungen, getAlleKategorien, getAllePockets, getAlleSparziele, getLogin, getPocket, isLimitReachedIfBuchungAdded, postBuchung } from "../backend/api";
import Upload from "./Uploud";
import success_icon from "../components/img/success_icon.svg";
import error_icon from "../components/img/error_icon.svg";
import './../style/Baker_CSS/BuchungNewModal.css';
import { toast } from 'react-toastify';


interface BuchungNewModalProps {
    isOpen: boolean;
    onRequestClose: () => void;
    reset?: boolean;
    onSuccess: () => void;
}

enum Intervall {
    TÄGLICH = 'tag',
    WÖCHENTLICH = 'woche',
    VIERZEHNTÄGIG = 'vierzehnTage',
    MONATLICH = 'monat',
    QUARTAL = 'quartal',
    HALBJAERLICH = 'halbesJahr',
    JAERLICH = 'jahr',
}

enum Typ {
    EINZAHLUNG = 'einzahlung',
    AUSGABE = 'ausgabe',
    UEBERTRAG = 'uebertrag',
}

const BuchungNewModal: React.FC<BuchungNewModalProps> = ({ isOpen, onRequestClose, reset = false, onSuccess }) => {


    //funktioniert warum auch immer nicht
    useEffect(() => {
        if (isOpen) {
            document.body.classList.add("no-scroll");
        } else {
            document.body.classList.remove("no-scroll");
        }

        return () => {
            document.body.classList.remove("no-scroll");
        };
    }, [isOpen]);


    const name = useRef<HTMLInputElement>(null);
    const datum = useRef<HTMLInputElement>(null);
    const betrag = useRef<HTMLInputElement>(null);

    const [isWiederkehrend, setIsWiederkehrend] = useState<boolean | null>(false); // Standardmäßig nicht gesetzt
    const [intervall, setIntervall] = useState<Intervall | null>(null);
    const [typ, setTyp] = useState<Typ | null>(Typ.AUSGABE);
    const [uebertragAsAusgabe, setUebertragAsAusgabe] = useState<Typ | null>(null);

    const [kategorien, setKategorien] = useState<BuchungskategorieResource[]>([]);
    const [selectedKategorie, setSelectedKategorie] = useState<string | null>(null);

    const [pockets, setPockets] = useState<PocketResource[]>([]);
    const [selectedPocket, setSelectedPocket] = useState<string | null>(null);
    const [zielPocket, setZielPocket] = useState<string | undefined>(undefined);
    const [sparziele, setSparziele] = useState<SparzielResource[]>([]);

    const [userId, setUserId] = useState<string | null>(null); // Benutzer-ID speichern

    const [notiz, setNotiz] = useState<string>(''); // Zustand für Notiz

    const [isTransferClicked, setIsTransferClicked] = useState(false);

    const [isUebertragSelected, setIsUebertragSelected] = useState(false);
    const [isIntervallSelected, setIsIntervallSelected] = useState(false);

    const [isWiederkehrendVisible, setIsWiederkehrendVisible] = useState(true);
    const [isUebertragVisible, setIsUebertragVisible] = useState(true);
    const [isPocket, setIsPocket] = useState<boolean>(false);

    const [isLimitReached, setIsLimitReached] = useState(false);
    const [confirmSave, setConfirmSave] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleTransferClick = () => {
        setIsTransferClicked(true);
    };

    const handleDepositClick = () => {
        setIsTransferClicked(false);
    };

    const handleExpenseClick = () => {
        setIsTransferClicked(false);
    };


    // Upload-Feedback
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [uploadResult, setUploadResult] = useState<any | null>(null);
    const [resetUpload, setResetUpload] = useState(false);


    const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIsWiederkehrend(event.target.value === 'wiederkehrend');
        setIsIntervallSelected(event.target.value === 'wiederkehrend');
        if (event.target.value === 'wiederkehrend') {
            setIsUebertragVisible(false);
        } else {
            setIsUebertragVisible(true);
        }
    };

    const handleIntervallChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setIntervall(event.target.value as Intervall);
    };

    const handleTypChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedTyp = event.target.value as Typ;
        setTyp(selectedTyp);

        if (selectedTyp === Typ.UEBERTRAG) {
            setUebertragAsAusgabe(Typ.AUSGABE);
            setIsUebertragSelected(true);
            setIsWiederkehrendVisible(false);

            // Kategorie auf "uebertrag" setzen (ID oder Name je nach Datenstruktur)
            const uebertragKategorie = kategorien.find(kat => kat.name === 'Übertrag');
            if (uebertragKategorie) {
                setSelectedKategorie(uebertragKategorie.id!);
            }
        } else {
            setIsUebertragSelected(false);
            setIsWiederkehrendVisible(true);
            setSelectedKategorie(null);
        }
    };



    const handleKategorieChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedKategorie(event.target.value);
    };

    const handlePocketChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedPocket(event.target.value);
    };

    const handleZielPocketChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setZielPocket(event.target.value);
    };

    // Handle-Date Methode wird verwendet, um das Datum in `dd.MM.yyyy` Format zu konvertieren
    const handleDate = () => {
        return new Date(datum.current!.value).toLocaleDateString('de-DE', { year: 'numeric', month: '2-digit', day: '2-digit' });
    };

    const { loginInfo, setLoginInfo } = useLoginContext();
    const { pocketId } = useParams<{ pocketId: string }>();
    const navigate = useNavigate();

    useEffect(() => {
        if (loginInfo) {
            async function loadPockets() {
                const fetchedPockets = await getAllePockets();
                setPockets(fetchedPockets);
            }

            async function loadKategorien() {
                const fetchedKategorien = await getAlleKategorien();
                setKategorien(fetchedKategorien);
            }

            loadPockets();
            loadKategorien();
        }

    }, []);

    useEffect(() => {
        async function loadPocket() {
            if (pocketId && loginInfo) {
                const pocket = await getPocket(pocketId);
                setSelectedPocket(pocket.id || null);
            }
        }
        if (loginInfo) {
            loadPocket();
        }
    }, [pocketId, loginInfo]);

    useEffect(() => {
        async function loadUserId() {
            const loginInfo = await getLogin();
            if (loginInfo) {
                setLoginInfo(loginInfo);
                setUserId(loginInfo.id);
            }
        }
        loadUserId();
    }, []);

    useEffect(() => {
        if (reset && isPocket) {
            resetForm();
        }
    }, [reset]);

    useEffect(() => {
        const fetchData = async () => {
            if (loginInfo) {
                try {
                    const [sparziele, pockets, kategorien] = await Promise.all([getAlleSparziele(), getAllePockets(), getAlleKategorien()]);
                    setSparziele(sparziele);
                    setPockets(pockets);
                    setKategorien(kategorien);
                } catch (error) {
                    console.error("Error fetching data", error);
                }
            }
        };
        if (loginInfo) {
            fetchData();
        }
    }, [loginInfo]);

    useEffect(() => {
        const isPockets = async () => {
            if (loginInfo) {
                try {
                    const response = await getAllePockets();
                    setIsPocket(response.length > 0);
                } catch (error) {
                    console.error('Fehler beim Abrufen der Pockets:', error);
                }
            }
        };

        isPockets();
    }, [loginInfo]);

    const resetForm = () => {
        // Nach erfolgreichem Absenden das Formular zurücksetzen
        name.current!.value = '';
        datum.current!.value = new Date().toISOString().split('T')[0]; // aktuelles Datum setzen
        betrag.current!.value = '';
        setIsWiederkehrend(false);
        setIntervall(null);
        setTyp(Typ.AUSGABE);
        setSelectedKategorie(null);
        setSelectedPocket(null);
        setZielPocket(undefined);
        setNotiz('');

        // Reset der Upload-Komponente
        setResetUpload(true);
        setTimeout(() => setResetUpload(false), 0);

        setErrorMessage('');
        setConfirmSave(false);
        setIsLimitReached(false);
    };

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const kategoryId = selectedKategorie;
        const amount = parseFloat(betrag.current!.value);

        try {
            const result = await isLimitReachedIfBuchungAdded(kategoryId!, amount);
            if (result.limitReached) {
                setIsLimitReached(true);
                setErrorMessage('Limit erreicht. Klicken Sie erneut auf Speichern, um die Buchung zu bestätigen.');
                if (confirmSave) {
                    await createBooking();

                    setConfirmSave(false);
                } else {
                    setConfirmSave(true);
                }
            } else {
                await createBooking();
                setConfirmSave(false);
            }
        } catch (error) {
            console.error('Error checking limit:', error);
            setErrorMessage('An error occurred while checking the limit.');
        }
    };

    const createBooking = async () => {

        try {
            const buchungResource: BuchungResource = {
                name: name.current!.value,
                pocket: selectedPocket!,
                kategorie: selectedKategorie!,
                datum: handleDate(),
                betrag: Number(betrag.current!.value),
                typ: typ !== 'uebertrag' ? typ!.toString() : uebertragAsAusgabe!.toString(),
                // Add interval if isWiederkehrend is true
                ...(isWiederkehrend && { intervall: intervall ? intervall.toString() : undefined }),
                zielPocket: zielPocket || undefined,
                notiz: notiz || undefined,
            };


            const ToastContentSuccess = () => (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img src={success_icon} alt="Error Icon" />
                    <div>
                        <h4 style={{ margin: 0, fontWeight: 'bold', color: '#333', fontSize: '1em' }}>
                            {buchungResource.typ === Typ.UEBERTRAG
                                ?
                                `Den Betrag wurde erfolgreich von ${buchungResource.pocket} 
                                    nach ${buchungResource.zielPocket} übertragen!`
                                :
                                `Die Buchung wurde erfolgreich erstellt!`}

                        </h4>
                        <p style={{ margin: 0, color: '#666', fontSize: '0.8em' }}>
                            Die Buchung wird nach dem Update der Seite in "Buchungen" angezeigt.
                        </p>
                    </div>
                </div>
            );

            const createdBuchung = await postBuchung(buchungResource);
            if (!createdBuchung.id) {
                throw new Error('Buchung konnte nicht korrekt erstellt werden (fehlende ID).');
            }

            const cachedBuchungen = JSON.parse(localStorage.getItem('cachedAlleBuchungen') || '[]');
            cachedBuchungen.push(createdBuchung);
            localStorage.setItem('cachedAlleBuchungen', JSON.stringify(cachedBuchungen));

            resetForm();
            // Modal schließen
            onSuccess();
            toast(<ToastContentSuccess />);
            //Die Klassennamen verhalten sich komisch, deshalb wird es HIER zum Klassennamen ein Color zugewiesen
            document.documentElement.style.setProperty('--toastify-color-progress-light', '#018D01');
        } catch (err) {
            const ToastContentError = () => (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img src={error_icon} alt="Error Icon" />
                    <div>
                        <h4 style={{ margin: 0, fontWeight: 'bold', color: '#333', fontSize: '1em' }}>
                            Die Buchung konnte nicht erstellt werden!
                        </h4>
                    </div>
                </div>
            );
            toast(<ToastContentError />);
            //Die Klassennamen verhalten sich komisch, deshalb wird es HIER zum Klassennamen ein Color zugewiesen
            document.documentElement.style.setProperty('--toastify-color-progress-light', '#8D0103');
            console.log(name);
            console.log(err);
        }
        finally {

            const fetchedSparziele = await getAlleSparziele();
            setSparziele(fetchedSparziele);
            const fetchedPockets = await getAllePockets();
            setPockets(fetchedPockets);
            localStorage.setItem('cachedSparziele', JSON.stringify(fetchedSparziele));
            localStorage.setItem('cachedPockets', JSON.stringify(fetchedPockets));
        }
    }

    // Helper-Funktion zum Formatieren des Datums in das ISO-Format (yyyy-MM-dd)
    function formatDateToISO(date: string): string {
        if (date.includes('.')) {
            const [day, month, year] = date.split('.');
            return `${year}-${month}-${day}`;
        }
        return date;
    }

    return isPocket ? (
        <div id="body-overlay" className={`${isOpen ? "sichtbar" : ""}`}>
            <div className={`buchungHinzufuegenPopup ${isOpen ? "sichtbar" : ""}`}>
                <div className="buchungHinzufuegen create-card-header">
                    <h3 className="buchungErstellenHeader create-card-title">Buchung hinzufügen</h3>
                    <div className="button-container">
                        <Upload
                            userId={userId}
                            onUploadComplete={(result) => {
                                setUploadResult(result);
                                setUploadError(null);

                                if (result) {
                                    name.current!.value = result.name || "";

                                    if (result.datum) {
                                        datum.current!.value = formatDateToISO(result.datum);
                                    }

                                    if (result.betrag) {
                                        betrag.current!.value = result.betrag;
                                    }

                                    setSelectedKategorie(
                                        kategorien.find((k) => k.name === result.kategorie)?.id || ""
                                    );
                                    setSelectedPocket(
                                        pockets.find((p) => p.name === result.pocket)?.id || ""
                                    );

                                    const typValue = result.typ?.trim().toLowerCase();
                                    setTyp(
                                        typValue === "einzahlung"
                                            ? Typ.EINZAHLUNG
                                            : Typ.AUSGABE
                                    );
                                    setIsWiederkehrend(false);
                                    setNotiz(result.notiz || "");
                                }
                            }}
                            reset={resetUpload}
                            onUploadError={(error) => setUploadError(error)}
                        />
                        <div>
                            <button className="close-btn" onClick={onRequestClose}>
                                X
                            </button>
                        </div>
                    </div>
                </div>
                <form onSubmit={onSubmit}>
                    <div className="buchungForm">
                        <div className="toggle-button gridItem1">
                            <label
                                className={`radio buchungErstellenRadio ${typ === Typ.EINZAHLUNG ? "selected" : ""
                                    }`}
                                onClick={handleDepositClick}
                            >
                                <input
                                    type="radio"
                                    name="buchungsart"
                                    value={Typ.EINZAHLUNG}
                                    checked={typ === Typ.EINZAHLUNG}
                                    onChange={handleTypChange}
                                    required
                                />
                                Einzahlung
                            </label>
                            <label
                                className={`radio buchungErstellenRadio ${typ === Typ.AUSGABE ? "selected" : ""
                                    }`}
                                onClick={handleExpenseClick}
                            >
                                <input
                                    type="radio"
                                    name="buchungsart"
                                    value={Typ.AUSGABE}
                                    checked={typ === Typ.AUSGABE}
                                    onChange={handleTypChange}
                                    required
                                />
                                Ausgabe
                            </label>
                            {isUebertragVisible && (
                                <label
                                    className={`radio buchungErstellenRadio ${typ === Typ.UEBERTRAG ? "selected" : ""
                                        }`}
                                    onClick={handleTransferClick}
                                >
                                    <input
                                        type="radio"
                                        name="buchungsart"
                                        value={Typ.UEBERTRAG}
                                        checked={typ === Typ.UEBERTRAG}
                                        onChange={handleTypChange}
                                        disabled={isWiederkehrend === true}
                                        required
                                    />
                                    Übertrag
                                </label>
                            )}
                        </div>
                        <div className="toggle-button gridItem2">
                            <label
                                className={`radio buchungErstellenRadio ${isWiederkehrend === false ? "selected" : ""
                                    }`}
                            >
                                <input
                                    type="radio"
                                    name="buchungstyp"
                                    value="einmalig"
                                    checked={isWiederkehrend === false}
                                    onChange={handleRadioChange}
                                    required
                                />
                                Einmalig
                            </label>
                            {isWiederkehrendVisible && (
                                <label
                                    className={`radio buchungErstellenRadio ${isWiederkehrend === true ? "selected" : ""
                                        }`}
                                >
                                    <input
                                        type="radio"
                                        name="buchungstyp"
                                        value="wiederkehrend"
                                        checked={isWiederkehrend === true}
                                        onChange={handleRadioChange}
                                        disabled={typ === Typ.UEBERTRAG}
                                        required
                                    />
                                    Wiederkehrend
                                </label>
                            )}
                        </div>
                        <div className="gridItem3">
                            <h4 className="feldHeader">Name</h4>
                            <input
                                id="name"
                                className="eingabeFeld"
                                type="text"
                                placeholder="Name der Buchung"
                                maxLength={20}
                                ref={name}
                                minLength={2}
                                required
                            />
                        </div>
                        <div className="gridItem4">
                            <div>
                                <h4 className="feldHeader">Betrag</h4>
                                <input
                                    id="betrag"
                                    className="eingabeFeld"
                                    type="text"
                                    step="any"
                                    placeholder="0.00"
                                    ref={betrag}
                                    pattern="[0-9.,]*"
                                    onKeyPress={(e) => {
                                        const charCode = e.charCode;
                                        if (
                                            (charCode >= 48 && charCode <= 57) ||
                                            charCode === 44 ||
                                            charCode === 46
                                        ) {
                                            return true;
                                        } else {
                                            e.preventDefault();
                                            return false;
                                        }
                                    }}
                                    onChange={(e) => {
                                        betrag.current!.value = e.target.value.replace(",", ".");
                                    }}
                                    required
                                />
                            </div>
                            <div>
                                <h4 className="feldHeader">Datum</h4>
                                <input
                                    id="datum"
                                    className="eingabeFeld"
                                    type="date"
                                    ref={datum}
                                    defaultValue={new Date()
                                        .toISOString()
                                        .split("T")[0]}
                                    required
                                />
                            </div>
                        </div>
                        <div className={`gridItem5 ${isUebertragSelected ? 'uebertragVisible' : ''}`}>
                            <div>
                                <h4 className='feldHeader'>Pocket</h4>
                                <select className="selectBox eingabeFeld" id="pocket" value={selectedPocket || ''} onChange={handlePocketChange} required>
                                    <option value="">Wähle Pocket aus</option>
                                    {isTransferClicked ? (
                                        <>
                                            {sparziele.map((sparziel) => (
                                                <option key={sparziel.id} value={sparziel.id}>
                                                    {sparziel.name}
                                                </option>
                                            ))}
                                            {pockets.map(pocket => (
                                                <option key={pocket.id} value={pocket.id}>
                                                    {pocket.name}
                                                </option>
                                            ))}
                                        </>
                                    ) : (
                                        <>
                                            {pockets.map(pocket => (
                                                <option key={pocket.id} value={pocket.id}>
                                                    {pocket.name}
                                                </option>
                                            ))}
                                        </>
                                    )}

                                </select>
                            </div>
                            {isUebertragSelected && (
                                <div>
                                    <h4 className={"feldHeader"}>
                                        Übertrag nach:
                                    </h4>
                                    <select
                                        id="zielPocket"
                                        className="selectBox eingabeFeld"
                                        value={zielPocket || ''}
                                        onChange={handleZielPocketChange}
                                        required
                                    >
                                        <option value={undefined}>Wähle Zielpocket aus</option>
                                        {sparziele.map((sparziel) => (
                                            <option key={sparziel.id} value={sparziel.id}>
                                                {sparziel.name}
                                            </option>
                                        ))}
                                        {pockets.map(pocket => (
                                            <option key={pocket.id} value={pocket.id}>
                                                {pocket.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}
                        </div>
                        <div className={`gridItem6 ${isIntervallSelected && isWiederkehrend ? 'intervallVisible' : ''}`}>
                            <div>
                                <h4 className='feldHeader'>
                                    Kategorie
                                </h4>
                                <select className="selectBox eingabeFeld" id="kategorie" value={selectedKategorie || ''} onChange={handleKategorieChange} required disabled={typ === Typ.UEBERTRAG}>
                                    <option value="">Wähle Kategorie aus</option>
                                    {kategorien.filter(kategorie => typ === Typ.UEBERTRAG || kategorie.name !== 'Übertrag').map(kategorie => (
                                        <option key={kategorie.id} value={kategorie.id}>
                                            {kategorie.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {isIntervallSelected && isWiederkehrend && (
                                <div>
                                    <h4 className={"feldHeader"}>
                                        Intervall
                                    </h4>
                                    <select
                                        id="intervall"
                                        className="selectBox eingabeFeld"
                                        value={intervall || ''}
                                        onChange={handleIntervallChange}
                                        required
                                    >
                                        <option value="">Wähle Intervall aus</option>
                                        <option value={Intervall.TÄGLICH}>Täglich</option>
                                        <option value={Intervall.WÖCHENTLICH}>Wöchentlich</option>
                                        <option value={Intervall.VIERZEHNTÄGIG}>14-tägig</option>
                                        <option value={Intervall.MONATLICH}>monatlich</option>
                                        <option value={Intervall.QUARTAL}>quartal</option>
                                        <option value={Intervall.HALBJAERLICH}>halbjährlich</option>
                                        <option value={Intervall.JAERLICH}>jährlich</option>
                                    </select>
                                </div>
                            )}
                        </div>




                        <div className="gridItemNotiz">
                            <h4 className="feldHeader">Notiz</h4>
                            <textarea
                                id="notiz"
                                className="eingabeFeld"
                                placeholder="Notiz (optional, max. 1000 Zeichen)"
                                maxLength={1000}
                                value={notiz}
                                onChange={(e) => setNotiz(e.target.value)}
                                rows={4}
                                style={{ resize: "none" }}
                            />
                        </div>
                    </div>
                    <div className="confirmButtons">
                        {errorMessage && <div className="error-message">{errorMessage}</div>}
                        <button className="submitButton button" type="submit">
                            Speichern
                        </button>
                        <button className="button" onClick={onRequestClose}>
                            Abbrechen
                        </button>
                    </div>
                </form>
            </div>
        </div>
    ) : (
        <div id="body-overlay" className={`${isOpen ? "sichtbar" : ""}`}>
            <div className={`buchungHinzufuegenPopup ${isOpen ? "sichtbar" : ""}`}>
                <div className="buchungHinzufuegen">
                    <h3 className="buchungErstellenHeader">
                        Bitte erstellen Sie zuerst ein Pocket, um eine Buchung erstellen zu können.
                    </h3>
                    <div className="button-container">
                        <button className="close-btn" onClick={onRequestClose}>
                            X
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

};

export default BuchungNewModal;
