import React, { useEffect, useState } from 'react';
import { BuchungskategorieResource, PocketResource } from '../Resources';
import { getAlleKategorien, getAllePockets } from '../backend/api';
import { useMediaQuery } from 'react-responsive';


interface FilterProps {
    onFilterChange: (filters: {
        artDerBuchung: string;
        selectedKategorien: string[];
        selectedPockets: string[];
    }) => void;
    filters: {
        artDerBuchung: string;
        selectedKategorien: string[];
        selectedPockets: string[];
    };
}

const Filter: React.FC<FilterProps> = ({ onFilterChange, filters }) => {

    const isPCScreen = useMediaQuery({ query: '(min-width: 850px)' });
    const [isAccordionOpen, setIsAccordionOpen] = useState(false);
    const toggleAccordion = () => {
        setIsAccordionOpen(!isAccordionOpen);
    }

    const [kategorien, setKategorien] = useState<BuchungskategorieResource[]>([]);
    const [pockets, setPockets] = useState<PocketResource[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [kategorienData, pocketsData] = await Promise.all([getAlleKategorien(), getAllePockets()]);
                setKategorien(kategorienData);
                setPockets(pocketsData);
            } catch (error) {
                console.error('Error loading filter data:', error);
            }
        };
        fetchData();
    }, []);

    const handleArtDerBuchungChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value;
        onFilterChange({ ...filters, artDerBuchung: value });
    };

    const handleKategorieChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value;
        onFilterChange({ ...filters, selectedKategorien: value ? [value] : [] });
    };

    const handlePocketChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value;
        onFilterChange({ ...filters, selectedPockets: value ? [value] : [] });
    };

    return isPCScreen ? (

        <section id="filterSectionPC">
            <h2 className="sectionTitle">Filter</h2>
            <div className="filterSelectContainer">
                <h4>Art der Buchung</h4>
                <select name="artBuchung" id="artBuchung" className='selectBox eingabeFeld'
                    value={filters.artDerBuchung} onChange={handleArtDerBuchungChange}>
                    <option value="alle">Alle Buchungen</option>
                    <option value="einnahmen">Einnahmen</option>
                    <option value="ausgaben">Ausgaben</option>
                </select>
            </div>

            <div className="filterSelectContainer">
                <h4>Kategorie</h4>
                <select name="kategorie" id="kategorie" className='selectBox eingabeFeld'
                    value={filters.selectedKategorien[0] || ''}
                    onChange={handleKategorieChange}
                >
                    <option value="">Alle Kategorien</option>
                    {kategorien.map(kategorie => (
                        <option key={kategorie.id} value={kategorie.id}>
                            {kategorie.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="filterSelectContainer">
                <h4>Pocket</h4>
                <select name="pocket" id="pocket" className='selectBox eingabeFeld'
                    value={filters.selectedPockets[0] || ''} onChange={handlePocketChange}
                >
                    <option value="">Alle Pockets</option>
                    {pockets.map(pocket => (
                        <option key={pocket.id} value={pocket.id}>
                            {pocket.name}
                        </option>
                    ))}
                </select>
            </div>
        </section>


    ) : (
        <div id="filterAccordion">
            <button className="filterAccordionButton" onClick={toggleAccordion}>
                <h3>Filter</h3>
            </button>
            <div className="accordionContent" style={{
                maxHeight: isAccordionOpen ? '500px' : '0',
            }}>
                <div>
                    <h4>Art der Buchung</h4>
                    <select name="artBuchung" id="artBuchung" className='selectBox eingabeFeld'
                        value={filters.artDerBuchung} onChange={handleArtDerBuchungChange}>
                        <option value="alle">Alle Buchungen</option>
                        <option value="einnahmen">Einnahmen</option>
                        <option value="ausgaben">Ausgaben</option>
                    </select>
                </div>

                <div className="accordionContentPocketAndKategorien">
                    <div>
                        <h4>Kategorie</h4>
                        <select name="kategorie" id="kategorie" className='selectBox eingabeFeld'
                            value={filters.selectedKategorien[0] || ''}
                            onChange={handleKategorieChange}
                        >
                            <option value="">Alle Kategorien</option>
                            {kategorien.map(kategorie => (
                                <option key={kategorie.id} value={kategorie.id}>
                                    {kategorie.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <h4>Pocket</h4>
                        <select name="pocket" id="pocket" className='selectBox eingabeFeld'
                            value={filters.selectedPockets[0] || ''} onChange={handlePocketChange}
                        >
                            <option value="">Alle Pockets</option>
                            {pockets.map(pocket => (
                                <option key={pocket.id} value={pocket.id}>
                                    {pocket.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Filter;
