/// <reference types="vite-plugin-svgr/client" />

import { useState } from "react";
import KategorieAnzeigen from "./Profil/KategorieAnzeigen";
import PocketAnzeigen from "./Profil/PocketsAnzeigen";
import WiederkehrendeBuchungenAnzeigen from "./Profil/WiederkehrendeBuchungenAnzeigen";
import SparzieleAnzeigen from "./Profil/SparzieleAnzeigen";
import BenutzerEinstellungenAnzeigen from "./Profil/BenutzerEinstellungenAnzeigen";

import kategorien_icon from './img/kategorien_icon.svg';
import pockets_icon from './img/pockets_icon.svg';
import wiederkbuchungen_icon from './img/wiederkbuchungen_icon.svg';
import sparziele_icon from './img/sparziele_icon.svg';
import settings_icon from './img/settings_icon.svg';

import offeneBuchungen_icon from './img/date-time-stroke-rounded.svg';

import introJs from 'intro.js';
import 'intro.js/minified/introjs.min.css';
import helpIcon from './../components/img/help.svg'
import OffeneBuchungen from "./Profil/OffeneBuchungen";

function Profil() {
    const [cardTitle, setCardTitle] = useState("Kategorie");
    const [activeMenuItem, setActiveMenuItem] = useState("Kategorie");

    const handleTitleChange = (event: React.MouseEvent<HTMLDivElement> | null, newTitle: string) => {
        event?.preventDefault();
        setCardTitle(newTitle);
        setActiveMenuItem(newTitle);
    };

    const startIntro = () => {
        const intro = introJs();
        intro.setOptions({
            steps: [
                {
                    element: '.profilMain',
                    intro: 'Willkommen in deinem Profil. Hier kannst du verschiedene Einstellungen vornehmen, um deinen BudgetBuddy zu konfigurieren.',
                    position: 'right',
                },
                {
                    element: '.profilMenuContainer',
                    intro: 'Nutze die Navigationsleiste, um verschiedene Menü-Punkte anzusprechen.',
                    position: 'right',
                },
                {
                    element: '.selectedContent',
                    intro: 'Hier wird der Inhalt entsprechend deiner Auswahl angezeigt. Du kannst jegliche Daten stets über den türkisen Button oder die 3 Punkte bearbeiten.',
                    position: 'bottom',
                }
            ],
            showProgress: true,
            showBullets: false,
            nextLabel: 'Weiter →',
            prevLabel: '← Zurück',
            doneLabel: 'Fertig',
            scrollToElement: false
        })
        intro.onchange((targetElement) => {
            let scrollOffset = 100;

            if (targetElement.classList.contains('profilMain')) {
                scrollOffset = 150;
            } else if (targetElement.classList.contains('profilMenuContainer')) {
                scrollOffset = 200;
            } else if (targetElement.classList.contains('selectedContent')) {
                scrollOffset = 250;
            }
            window.scrollTo({
                top: targetElement.getBoundingClientRect().top + window.scrollY - scrollOffset,
                behavior: 'smooth'
            });
        });
        intro.start();
    };

    const renderContent = () => {
        switch (cardTitle) {
            case "Kategorie":
                return <KategorieAnzeigen />;
            case "Pocket":
                return <PocketAnzeigen />;
            case "Wiederkehrende Buchungen":
                return <WiederkehrendeBuchungenAnzeigen />;
            case "Offene Buchungen":
                return <OffeneBuchungen />;
            case "Sparziele":
                return <SparzieleAnzeigen />;
            case "Benutzer-Einstellungen":
                return <BenutzerEinstellungenAnzeigen />;
            default:
                return null;
        }
    };

    return (
        <main id="profilMain">
            <div className="profilMenuContainer">
                <div className="intro-wrap">
                    <h2 className="profilMenuTitle">Profil</h2>
                    <button onClick={startIntro} className="intro-button">
                        <img src={helpIcon} alt="" />
                    </button>
                </div>
                <nav className="profilMenuPC">
                    <div
                        className={`menuItem ${activeMenuItem === "Kategorie" ? "active" : ""}`}
                        onClick={(event) => handleTitleChange(event, "Kategorie")}
                    >
                        <img src={kategorien_icon} alt="Kategorien Icon" />
                        Kategorien
                    </div>
                    <div
                        className={`menuItem ${activeMenuItem === "Pocket" ? "active" : ""}`}
                        onClick={(event) => handleTitleChange(event, "Pocket")}
                    >
                        <img src={pockets_icon} alt="Pocket Icon" />
                        Pocket
                    </div>
                    <div
                        className={`menuItem ${activeMenuItem === "Wiederkehrende Buchungen" ? "active" : ""}`}
                        onClick={(event) => handleTitleChange(event, "Wiederkehrende Buchungen")}
                    >
                        <img src={wiederkbuchungen_icon} alt="Wiederkehrende Buchungen Icon" />
                        Wiederkehrende Buchungen
                    </div>
                    <div
                        className={`menuItem ${activeMenuItem === "Offene Buchungen" ? "active" : ""}`}
                        onClick={(event) => handleTitleChange(event, "Offene Buchungen")}
                    >
                        <img src={offeneBuchungen_icon} alt="Offene Buchungen Icon" />
                        Offene Buchungen
                    </div>
                    <div
                        className={`menuItem ${activeMenuItem === "Sparziele" ? "active" : ""}`}
                        onClick={(event) => handleTitleChange(event, "Sparziele")}
                    >
                        <img src={sparziele_icon} alt="Sparziele Icon" />
                        Sparziele
                    </div>
                    <div
                        className={`menuItem ${activeMenuItem === "Benutzer-Einstellungen" ? "active" : ""}`}
                        onClick={(event) => handleTitleChange(event, "Benutzer-Einstellungen")}
                    >
                        <img src={settings_icon} alt="Benutzer Einstellungen Icon" />
                        Benutzer-Einstellungen
                    </div>
                </nav>

                <nav className="profilMenuMobile">
                    <select
                        name="profilMenuSelectBox"
                        id="profilMenuSelectBox"
                        className="selectBox eingabeFeld"
                        onChange={(event) => handleTitleChange(null, event.target.value)}
                        value={activeMenuItem}
                    >
                        <option value="Kategorie">Kategorien</option>
                        <option value="Pocket">Pocket</option>
                        <option value="Wiederkehrende Buchungen">Wiederkehrende Buchungen</option>
                        <option value="Offene Buchungen">Offene Buchungen</option>
                        <option value="Sparziele">Sparziele</option>
                        <option value="Benutzer-Einstellungen">Benutzer Einstellungen</option>
                    </select>
                </nav>
            </div>

            <div className="selectedContent">
                {renderContent()}
            </div>
        </main>
    );
}

export default Profil;
