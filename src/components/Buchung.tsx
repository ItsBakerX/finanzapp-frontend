import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { BuchungResource, BuchungskategorieResource, PocketResource, SparzielResource } from '../Resources';
import grocery_icon from '../components/img/grocery_icon.svg';
import options_icon from '../components/img/options_icon.svg';
import buchung_wiederkehrend_icon from '../components/img/reload_icon.svg';
import success_icon from "../components/img/success_icon.svg";
import error_icon from "../components/img/error_icon.svg";
import categoryIcons from '../components/categoryIcons';
import { deleteBuchung, getAllePockets, getBuchungById } from '../backend/api';
import { get } from 'http';
import { toast } from 'react-toastify';

type BuchungProps = {
    buchung: BuchungResource;
    kategorien: BuchungskategorieResource[];
    pockets: PocketResource[];
    sparziele: SparzielResource[];
    onDelete: (id: string) => void;
    sortMode: 'kategorie' | 'datum';
    openDropdownId: string | null;
    setOpenDropdownId: (id: string | null) => void;
    openDetailsId: string | null;
    setOpenDetailsId: (id: string | null) => void;
};

const Buchung: React.FC<BuchungProps> = ({
    buchung, kategorien, pockets, sparziele, onDelete, sortMode,
    openDropdownId, setOpenDropdownId, openDetailsId, setOpenDetailsId }) => {

    const kategorieName = kategorien.find(k => k.id === buchung.kategorie)?.name || buchung.kategorie;
    const pocketName = pockets.find(p => p.id === buchung.pocket)?.name || buchung.pocket;
    const zielPocketName = pockets.find(p => p.id === buchung.zielPocket)?.name || sparziele.find(s => s.id === buchung.zielPocket)?.name || buchung.zielPocket;
    const isPositive = buchung.typ === 'einzahlung';
    const isWiederkehrend = buchung.fromWiederkehrend;
    const [detailsOpen, setDetailsOpen] = useState(false);

    const dropdownRef = useRef<HTMLDivElement>(null);

    const categoryIcon = categoryIcons[kategorieName] || categoryIcons['default'];

    const toggleDropdown = () => {
        setOpenDropdownId(openDropdownId === buchung.id ? null : buchung.id!);
    };
    // Schließen des Dropdowns, wenn außerhalb geklickt wird
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                // Nur schließen, wenn außerhalb des Dropdowns geklickt wurde
                setOpenDropdownId(null);
            }
        };

        // Event-Listener auf "mousedown" nur registrieren, wenn Dropdown geöffnet ist
        if (openDropdownId === buchung.id) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [openDropdownId, setOpenDropdownId, buchung.id]);


    const toggleDetailsPopup = () => {
        setOpenDetailsId(openDetailsId === buchung.id ? null : buchung.id!);
    };

    const handleDelete = async () => {
        try {

            await deleteBuchung(buchung.id!);

            const gespeicherteBuchungen = localStorage.getItem('cachedAlleBuchungen');
            const buchungen = gespeicherteBuchungen ? JSON.parse(gespeicherteBuchungen) : [];
            const aktualisierteBuchungen = buchungen.filter((b: BuchungResource) => b.id !== buchung.id);
            localStorage.setItem('cachedAlleBuchungen', JSON.stringify(aktualisierteBuchungen));
            console.log('Buchung deleted successfully');

            onDelete(buchung.id!);
            const ToastContentSuccess = () => (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img src={success_icon} alt="Success Icon" />
                    <div>
                        <h4 style={{ margin: 0, fontWeight: 'bold', color: '#333', fontSize: '1em' }}>
                            Buchung "{buchung.name}" erfolgreich gelöscht!
                        </h4>
                    </div>
                </div>
            );
            toast(<ToastContentSuccess />);
            //Die Klassennamen verhalten sich komisch, deshalb wird es HIER zum Klassennamen ein Color zugewiesen
            document.documentElement.style.setProperty('--toastify-color-progress-light', '#018D01');
        } catch (error) {

            const ToastContentError = () => (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img src={error_icon} alt="Error Icon" />
                    <div>
                        <h4 style={{ margin: 0, fontWeight: 'bold', color: '#333', fontSize: '1em' }}>
                            Die Buchung konnte nicht gelöscht werden!
                        </h4>
                    </div>
                </div>
            );
            toast(<ToastContentError />);
            //Die Klassennamen verhalten sich komisch, deshalb wird es HIER zum Klassennamen ein Color zugewiesen
            document.documentElement.style.setProperty('--toastify-color-progress-light', '#8D0103');
            console.error('Error deleting buchung:', error);
        } finally {
            const fetchedPockets = await getAllePockets();
            localStorage.setItem('cachedPockets', JSON.stringify(fetchedPockets));
        }
    };

    return (
        <div className="buchungCard">
            <div className="buchungCardPC">
                <img src={isWiederkehrend ? buchung_wiederkehrend_icon : categoryIcon}
                    alt={`${kategorieName} Icon`} className='buchungCardIcon' />
                <div className='buchungCardTitleAndPocket'>
                    <h4 className='buchungCardTitle'>{buchung.name}</h4>
                    <p className='buchungCardPocket'>{pocketName}</p>
                </div>
                <div className="buchungCardDateOrCategory">
                    {sortMode === 'datum' ? (
                        <p>{kategorieName}</p>
                    ) : (
                        <p>{buchung.datum}</p>
                    )}
                </div>
                <div className={`buchungCardPreis ${isPositive ? 'positiverBetrag' : 'negativerBetrag'}`}>
                    {isPositive ? '+' : '-'}{Math.abs(buchung.betrag)} €
                </div>
                <div className="cardOptions">
                    <button className='cardOptionsButton'>
                        <img src={options_icon} onClick={toggleDropdown} alt="Options Icon" />
                    </button>
                    {openDropdownId === buchung.id && (
                        <div className="options-dropdown" ref={dropdownRef} onMouseDown={(e) => e.stopPropagation()} onClick={(e) => e.stopPropagation()}>
                            <a onClick={handleDelete}>Löschen</a>
                            <a onClick={toggleDetailsPopup}>Details</a>
                        </div>
                    )}
                </div>
            </div>

            <div className="buchungCardMobile">
                <div className="buchungCardIconAndPT">
                    <img src={isWiederkehrend ? buchung_wiederkehrend_icon : categoryIcon}
                        alt={`${kategorieName} Icon`} className='buchungCardIcon' />
                    <div className='buchungCardTitleAndPocket'>
                        <h4 className='buchungCardTitle'>{buchung.name}</h4>
                        <p className='buchungCardPocket'>{pocketName}</p>
                    </div>
                </div>
                <div className="cardOptionsCategoryPreis">
                    <div className="buchungCardDoCAndPreis">
                        <div className="buchungCardDateOrCategory">
                            {sortMode === 'datum' ? (
                                <p>{kategorieName}</p>
                            ) : (
                                <p>{buchung.datum}</p>
                            )}
                        </div>
                        <div className={`buchungCardPreis ${isPositive ? 'positiverBetrag' : 'negativerBetrag'}`}>
                            {isPositive ? '+' : '-'}{Math.abs(buchung.betrag)} €
                        </div>
                    </div>
                    <div className="cardOptions">
                        <button className='cardOptionsButton'>
                            <img src={options_icon} onClick={toggleDropdown} alt="Options Icon" />
                        </button>
                        {openDropdownId === buchung.id && (
                            <div className="options-dropdown" ref={dropdownRef} onMouseDown={(e) => e.stopPropagation()} onClick={(e) => e.stopPropagation()}>
                                <a onClick={handleDelete}>Löschen</a>
                                <a onClick={toggleDetailsPopup}>Details</a>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Popup für Details */}
            {openDetailsId === buchung.id && (
                <div className="BuchungCardDetailsPopup">
                    <div className="BuchungCardDetailsPopupContent">
                        <h3 className='PopupContentHeader'> Buchung Details </h3>
                        <div>
                            <p> Name:</p>
                            <p>   {buchung.name}</p>
                        </div>
                        <div>
                            <p> Kategorie:</p>
                            <p>{kategorieName}</p>
                        </div>
                        <div>
                            <p> Pocket:</p>
                            <p>{pocketName}</p>
                        </div>
                        {
                            zielPocketName &&
                            <div>
                                <p> Ziel Pocket: </p>
                                <p>{zielPocketName}</p>
                            </div>
                        }
                        <div>
                            <p>Datum:</p>
                            <p>{buchung.datum}</p>
                        </div>
                        <div>
                            <p> Betrag:</p>
                            <p className={`${isPositive ? 'positiverBetrag' : 'negativerBetrag'}`}>
                                {isPositive ? '+' : '-'}{Math.abs(buchung.betrag)} €</p>
                        </div>
                        {buchung.notiz && (
                            <div>
                                <p> Notiz:</p>
                                <span className="notiz-text">
                                    {buchung.notiz.split('€').map((part, index, array) => (
                                        <React.Fragment key={index}>
                                            {part}
                                            {index < array.length - 1 && (
                                                <>
                                                    €
                                                    <br />
                                                </>
                                            )}
                                        </React.Fragment>
                                    ))}
                                </span>
                            </div>
                        )}
                        <button className="button abbrechenButton" onClick={toggleDetailsPopup}>Schließen</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Buchung;