import React from 'react';
// import grocery_icon from '../img/grocery_icon.svg';
import { BuchungResource, BuchungskategorieResource, PocketResource } from '../../Resources';
import categoryIcons from '../categoryIcons';
import '../../style/Baker_CSS/BuchungDashboard.css';




type BuchungProps = {
    buchung: BuchungResource;
    kategorien: BuchungskategorieResource[];
    pockets: PocketResource[];
};

const BuchungDashboard: React.FC<BuchungProps> = ({ buchung, kategorien, pockets }) => {
    const kategorieName = kategorien.find(k => k.id === buchung.kategorie)?.name || buchung.kategorie;
    const pocketName = pockets.find(p => p.id === buchung.pocket)?.name || buchung.pocket;
    const isPositive = buchung.typ === 'einzahlung';
    const categoryIcon = categoryIcons[kategorieName] || categoryIcons['default'];

    return (
        <div className='buchung-dashboard'>
            <div className="buchung-item-dashboard">
                <div className="buchung-icon-dashboard">
                    <img src={categoryIcon} alt={`${kategorieName} Icon`} />
                </div>
                {/* <div className="buchung-content"> */}
                <div className="buchung-details-dashboard">
                    <h3>{buchung.name}</h3>
                    <p>{pocketName}</p>
                    {/* <p>{buchung.datum}</p> */}
                </div>
                <div className={`buchung-amount ${isPositive ? 'positive' : 'negative'}`}>
                    {isPositive ? '+' : '-'}{Math.abs(buchung.betrag)} €
                </div>
                {/* </div> */}

            </div>
        </div>
    );
};

export default BuchungDashboard;