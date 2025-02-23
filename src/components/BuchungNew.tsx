import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BuchungResource, BuchungskategorieResource, PocketResource } from "../Resources";
import { useLoginContext } from "./LoginContext";
import { useErrorBoundary } from "react-error-boundary";
import { getAlleKategorien, getAllePockets, getLogin, getPocket, postBuchung } from "../backend/api";
import Upload from "./Uploud";
import './../style/Baker_CSS/BuchungNew.css';

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
}

function BuchungNew({ onSuccess, reset }: { onSuccess: () => void, reset?: boolean }) {

    const name = useRef<HTMLInputElement>(null);
    const datum = useRef<HTMLInputElement>(null);
    const betrag = useRef<HTMLInputElement>(null);

    const [isWiederkehrend, setIsWiederkehrend] = useState<boolean | null>(null); // Standardmäßig nicht gesetzt
    const [intervall, setIntervall] = useState<Intervall | null>(null);
    const [typ, setTyp] = useState<Typ | null>(null);

    const [kategorien, setKategorien] = useState<BuchungskategorieResource[]>([]);
    const [selectedKategorie, setSelectedKategorie] = useState<string | null>(null);

    const [pockets, setPockets] = useState<PocketResource[]>([]);
    const [selectedPocket, setSelectedPocket] = useState<string | null>(null);
    const [zielPocket, setZielPocket] = useState<string | undefined>(undefined);

    const [userId, setUserId] = useState<string | null>(null); // Benutzer-ID speichern

    const [notiz, setNotiz] = useState<string>(''); // Zustand für Notiz

    // Upload-Feedback
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [uploadResult, setUploadResult] = useState<any | null>(null);
    const [resetUpload, setResetUpload] = useState(false);


    const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIsWiederkehrend(event.target.value === 'wiederkehrend');
    };

    const handleIntervallChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setIntervall(event.target.value as Intervall);
    };

    const handleTypChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTyp(event.target.value as Typ);
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
    }, []);

    useEffect(() => {
        async function loadPocket() {
            if (pocketId) {
                const pocket = await getPocket(pocketId);
                setSelectedPocket(pocket.id || null);
            }
        }
        loadPocket();
    }, [pocketId]);

    useEffect(() => {
        async function loadUserId() {
            const loginInfo = await getLogin();
            setLoginInfo(loginInfo);
            if (loginInfo) setUserId(loginInfo.id);
        }
        loadUserId();
    }, [setLoginInfo]);

    useEffect(() => {
        if (reset) {
            resetForm();
        }
    }, [reset]);

    const resetForm = () => {
        // Nach erfolgreichem Absenden das Formular zurücksetzen
        name.current!.value = '';
        datum.current!.value = new Date().toISOString().split('T')[0]; // aktuelles Datum setzen
        betrag.current!.value = '';
        setIsWiederkehrend(null);
        setIntervall(null);
        setTyp(null);
        setSelectedKategorie(null);
        setSelectedPocket(null);
        setZielPocket(undefined);
        setNotiz('');

        // Reset der Upload-Komponente
        setResetUpload(true);
        setTimeout(() => setResetUpload(false), 0);
    };

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            const buchungResource: BuchungResource = {
                name: name.current!.value,
                pocket: selectedPocket!,
                kategorie: selectedKategorie!,
                datum: handleDate(),
                betrag: Number(betrag.current!.value),
                typ: typ ? typ.toString() : '',
                // Add interval if isWiederkehrend is true
                ...(isWiederkehrend && { intervall: intervall ? intervall.toString() : undefined }),
                zielPocket: zielPocket || undefined,
                notiz: notiz || undefined,
            };

            await postBuchung(buchungResource);

            resetForm();
            // Modal schließen
            onSuccess();

        } catch (err) {
            console.log(name);
            console.log(err);
        }
    };
    

    // Helper-Funktion zum Formatieren des Datums in das ISO-Format (yyyy-MM-dd)
    function formatDateToISO(date: string): string {
        if (date.includes('.')) {
            const [day, month, year] = date.split('.');
            return `${year}-${month}-${day}`;
        }
        return date;
    }

    return (
        <form onSubmit={onSubmit}>
            <div className="buchungForm">
                <div className="toggle-button gridItem1">
                    <label className="radio">
                        <input type="radio" name="buchungsart" value={Typ.EINZAHLUNG} checked={typ === Typ.EINZAHLUNG} onChange={handleTypChange} required />
                        Einzahlung
                    </label>
                    <label className="radio">
                        <input type="radio" name="buchungsart" value={Typ.AUSGABE} checked={typ === Typ.AUSGABE} onChange={handleTypChange} required />
                        Ausgabe
                    </label>
                </div>
                <div className="toggle-button gridItem2">
                    <label className="radio">
                        <input type="radio" name="buchungstyp" value="einmalig" checked={isWiederkehrend === false} onChange={handleRadioChange} required />
                        Einmalig
                    </label>
                    <label className="radio">
                        <input type="radio" name="buchungstyp" value="wiederkehrend" checked={isWiederkehrend === true} onChange={handleRadioChange} required />
                        Wiederkehrend
                    </label>
                </div>
                <div className="gridItem3">
                    <h4>
                        Name
                    </h4>
                    <input
                        id="name"
                        className="eingabeFeld"
                        type="text"
                        placeholder="name"
                        maxLength={20}
                        ref={name}
                        minLength={2}
                        required
                    />
                </div>

                <div className="gridItem4">
                    <h4>
                        Betrag
                    </h4>
                    <input
                        id="betrag"
                        className="eingabeFeld"
                        type="text"
                        step="any"
                        placeholder="betrag"
                        ref={betrag}
                        onChange={(e) => {
                            betrag.current!.value = e.target.value.replace(',', '.');
                        }}
                        required
                    />
                </div>

                <div className="gridItem5">
                    <h4>Pocket</h4>
                    <select className="selectBox eingabeFeld" id="pocket" value={selectedPocket || ''} onChange={handlePocketChange} required>
                        <option value="">Wähle Pocket aus</option>
                        {pockets.map(pocket => (
                            <option key={pocket.id} value={pocket.id}>
                                {pocket.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="gridItem6">
                    <h4>
                        Übertrag nach:
                    </h4>
                    <select
                        id="zielPocket"
                        className="selectBox eingabeFeld"
                        value={zielPocket || ''}
                        onChange={handleZielPocketChange}
                        required
                    >
                        <option value={undefined}>Wähle Ziel Pocket aus</option>
                        {pockets.map(pocket => (
                            <option key={pocket.id} value={pocket.id}>
                                {pocket.name}
                            </option>
                        ))}
                    </select>
                </div>



                <div className="gridItem7">
                    <h4>
                        Kategorie
                    </h4>
                    <select className="selectBox eingabeFeld" id="kategorie" value={selectedKategorie || ''} onChange={handleKategorieChange} required>
                        <option value="">Wähle Kategorie aus</option>
                        {kategorien.map(kategorie => (
                            <option key={kategorie.id} value={kategorie.id}>
                                {kategorie.name}
                            </option>
                        ))}
                    </select>

                </div>



                <div className="gridItem8">
                    <h4>
                        Datum
                    </h4>
                    <input
                        id="datum"
                        className="eingabeFeld"
                        type="date"
                        ref={datum}
                        defaultValue={new Date().toISOString().split('T')[0]}
                        required
                    />
                </div>

                <div className="gridItem9">
                    <h4>
                        Notiz
                    </h4>
                    <textarea
                        id="notiz"
                        className="eingabeFeld"
                        placeholder="Notiz (optional, max. 100 Zeichen)"
                        maxLength={100}
                        value={notiz} 
                        onChange={(e) => setNotiz(e.target.value)}
                        rows={4}
                        style={{ resize: 'none' }}
                    />
                </div>





                <div className="field-upload">
                    <label>Bild hochladen</label>
                    <Upload
                        userId={userId}
                        onUploadComplete={(result) => {
                            setUploadResult(result);
                            setUploadError(null);

                            // Setze die Werte der Eingabefelder, basierend auf dem Upload-Ergebnis
                            if (result) {
                                name.current!.value = result.name || '';

                                if (result.datum) {
                                    datum.current!.value = formatDateToISO(result.datum);
                                }


                                if (result.betrag) {
                                    betrag.current!.value = result.betrag;
                                }

                                setSelectedKategorie(kategorien.find(k => k.name === result.kategorie)?.id || '');
                                setSelectedPocket(pockets.find(p => p.name === result.pocket)?.id || '');
                                // trim() verwendet, um Leerzeichen zu entfernen.
                                // toLowerCase() genutzt, um die Groß-/Kleinschreibung zu ignorieren.
                                const typValue = result.typ?.trim().toLowerCase();
                                setTyp(typValue === 'einzahlung' ? Typ.EINZAHLUNG : Typ.AUSGABE);
                                setIsWiederkehrend(false);
                            }
                        }}
                        reset={resetUpload}
                        onUploadError={(error) => setUploadError(error)}
                    />
                </div>
                {uploadError && <p style={{ color: 'red' }}>{uploadError}</p>}

                {isWiederkehrend && (
                    <div className="field">
                        <label htmlFor="intervall">Intervall</label>
                        <select
                            id="intervall"
                            className="select is-rounded"
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
                {typ === Typ.AUSGABE && (
                    <div className="field">
                        <label htmlFor="zielPocket">Ziel Pocket</label>
                        <select
                            id="zielPocket"
                            className="select is-rounded"
                            value={zielPocket || ''}
                            onChange={handleZielPocketChange}
                            required
                        >
                            <option value={undefined}>Wähle Ziel Pocket aus</option>
                            {pockets.map(pocket => (
                                <option key={pocket.id} value={pocket.id}>
                                    {pocket.name}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

            </div>
            <div className="confirmButtons">
                <button className="submitButton button" type="submit">Buchung hinzufügen +</button>
            </div>
        </form >
    );
}

export default BuchungNew;
