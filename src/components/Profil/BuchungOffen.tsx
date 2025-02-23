import React, { useEffect, useRef, useState } from 'react';
import { BuchungResource, BuchungskategorieResource, PocketResource } from '../../Resources';
import { deleteBuchung, zukunftBuchungAusfuehren } from '../../backend/api';
import '../../style/Baker_CSS/BuchungWiederkehrend.css';
import grocery_icon from '../img/grocery_icon.svg';
import clock from '../img/clock-01-stroke-rounded.svg';
import options_icon from '../../components/img/options_icon.svg';

type BuchungProps = {
    buchung: BuchungResource;
    kategorien: BuchungskategorieResource[];
    pockets: PocketResource[];
    onDelete: (id: string) => void;
    onExecute: (id: string) => void;
    openDropdownId: string | null;
    setOpenDropdownId: (id: string | null) => void;
};

const BuchungOffen: React.FC<BuchungProps> = ({ buchung, kategorien, pockets, onDelete,
    onExecute, openDropdownId, setOpenDropdownId
}) => {
    const kategorieName = kategorien.find(k => k.id === buchung.kategorie)?.name || buchung.kategorie;
    const pocketName = pockets.find(p => p.id === buchung.pocket)?.name || buchung.pocket;
    const isPositive = buchung.typ === 'einzahlung';
    const [openDetailsId, setOpenDetailsId] = useState<string | null>(null);
    const [isExecuting, setIsExecuting] = useState(false); // Ladezustand für "jetzt ausführen"
    const dropdownRef = useRef<HTMLDivElement>(null);

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
            onDelete(buchung.id!);
            console.log('Buchung deleted successfully');
        } catch (error) {
            console.error('Error deleting buchung:', error);
        }
    };

    const handleZukunftBuchungAusfuehren = async () => {
        if (!buchung.id) {
            console.error('Buchung hat keine ID.');
            return;
        }

        setIsExecuting(true);
        try {
            await zukunftBuchungAusfuehren(buchung.id);
            console.log('Buchung erfolgreich ausgeführt');
            onExecute(buchung.id);
            // 
        } catch (error) {
            console.error('Fehler beim Ausführen der Buchung:', error);
        } finally {
            setIsExecuting(false);
        }
    };

    return (
        <div className="buchungCard">
            <div className="buchungCardPC">
                <img src={clock} alt="Grocery Icon" className='buchungCardIcon' />
                <div>
                    <h4 className="buchungCardTitle">{buchung.name}</h4>
                    <p className="buchungCardPocket">{pocketName}</p>
                </div>
                <div className="buchungCardDateOrCategory">
                    <p>{buchung.datum}</p>
                    <button onClick={handleZukunftBuchungAusfuehren} disabled={isExecuting} className='ausfuehren_button'>
                        {isExecuting ? 'Wird ausgeführt...' : 'jetzt ausführen'}
                    </button>
                </div>
                <div className={`buchungCardPreis ${isPositive ? 'positiverBetrag' : 'negativerBetrag'}`}>
                    {isPositive ? '+' : '-'}{Math.abs(buchung.betrag)} €
                </div>
                <div className="cardOptions">
                    <button className="cardOptionsButton">
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
            <div className="buchungCardMobileWithAusfuhrenButton">
                <div className="buchungCardMobile">
                    <div className="buchungCardIconAndPT">
                        <img src={clock} alt="Grocery Icon" className='buchungCardIcon' />
                        <div>
                            <h4 className="buchungCardTitle">{buchung.name}</h4>
                            <p className="buchungCardPocket">{pocketName}</p>
                        </div>
                    </div>

                    <div className="cardOptionsCategoryPreis">
                        <div className="buchungCardDoCAndPreis">
                            <div className="buchungCardDateOrCategory">
                                <p>{buchung.datum}</p>
                            </div>
                            <div className={`buchungCardPreis ${isPositive ? 'positiverBetrag' : 'negativerBetrag'}`}>
                                {isPositive ? '+' : '-'}{Math.abs(buchung.betrag)} €
                            </div>
                        </div>


                        <div className="cardOptions">
                            <button className="cardOptionsButton">
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
                <div className='buchungCardAusfuehrenButton'>
                    <button onClick={handleZukunftBuchungAusfuehren} disabled={isExecuting} className='ausfuehren_button'>
                        {isExecuting ? 'Wird ausgeführt...' : 'jetzt ausführen'}
                    </button>
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
                        <div>
                            <p>Datum:</p>
                            <p>{buchung.datum}</p>
                        </div>
                        <div>
                            <p> Betrag:</p>
                            <p className={`${isPositive ? 'positiverBetrag' : 'negativerBetrag'}`}>
                                {isPositive ? '+' : '-'}{Math.abs(buchung.betrag)} €</p>
                        </div>
                        <div>
                            <p>Intervall: </p>
                            <p>{buchung.intervall}</p>
                        </div>
                        {buchung.notiz && (
                            <div>
                                <p> Notiz:

                                </p>
                                <span className="notiz-text">
                                    {buchung.notiz.split('€').map((part, index) => (
                                        <React.Fragment key={index}>
                                            {part}
                                            {index < buchung.notiz!.split('€').length - 1 && '€'}
                                            <br />
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

export default BuchungOffen;