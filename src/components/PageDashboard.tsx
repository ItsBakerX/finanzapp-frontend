import { useNavigate } from "react-router-dom";
import AnalysisCard from "./dashboard/AnalysisCard";
import BuchungenDashboard from "./dashboard/BuchungenDashboard";
import Uebersicht from "./dashboard/Uebersicht";
import Verhaeltnis from "./dashboard/Verhaeltnis";
import './../style/Baker_CSS/PageDashboard.css';
import './../style/intro.css';
import VerhaeltnisA from "./Analyse/VerhaeltnisA";
import DurchnittA from "./Analyse/DurchschnittA";
import GesamtKategorieA from "./Analyse/GesamtKategorieA";
import { getBenutzer, getLogin } from "../backend/api";
import { useEffect, useState } from "react";
import Willkommenspopup from "./Willkommenspopup";

import introJs from 'intro.js';
import 'intro.js/minified/introjs.min.css';
import helpIcon from './../components/img/help.svg'

export function PageDashboard() {
    const navigate = useNavigate();
    const [userName, setUserName] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            const BneutzerID = await getLogin();
            const { name } = await getBenutzer(BneutzerID.id);
            setUserName(name);
        })();
    }, []);

    const startIntro = () => {

        const intro = introJs();

        intro.setOptions({
            steps: [
                {
                    element: '.dashboard-group',
                    intro: 'Willkommen im Dashboard! Hier siehst du alle wichtigen Informationen auf einen Blick.',
                    position: 'right'
                },
                {
                    element: '.uebersicht-group',
                    intro: 'In der Übersicht siehst du deinen aktuellen Kassenstand.',
                    position: 'right'
                },
                {
                    element: '.analysis-group',
                    intro: 'Hier kannst du deine Analysen und Statistiken ansehen. Klicke auf "Mehr" für weitere Details.',
                    position: 'right'
                },
                {
                    element: '.buchungen-group',
                    intro: 'Hier findest du alle deine Buchungen. Klicke auf "Mehr" für weitere Details.',
                    position: 'top',
                }
            ],
            showProgress: true,
            showBullets: false,
            nextLabel: 'Weiter →',
            prevLabel: '← Zurück',
            doneLabel: 'Fertig',
            scrollToElement: false,
        })

        // Individuelles Scrollverhalten je nach Element
        intro.onchange((targetElement) => {
            let scrollOffset = 100;

            if (targetElement.classList.contains('dashboard-group')) {
                scrollOffset = 100;
            } else if (targetElement.classList.contains('uebersicht-group')) {
                scrollOffset = 200;
            } else if (targetElement.classList.contains('analysis-group')) {
                scrollOffset = 200;
            } else if (targetElement.classList.contains('buchungen-group')) {
                scrollOffset = 300;
            }

            window.scrollTo({
                top: targetElement.getBoundingClientRect().top + window.scrollY - scrollOffset,
                behavior: 'smooth'
            });
        });

        intro.start();
    };

    return (
        <div className="dashboard-group">
            <div className="intro-wrap">
                {userName && <h1>Willkommen zurück, {userName}!</h1>}
                <button onClick={startIntro} className="intro-button">
                    <img src={helpIcon} alt="" />
                </button>
            </div>
            <div className="dashboard-desktop">
                <div className="dashboard-desktop1">
                    <h2>Übersicht</h2>
                    <div className="uebersicht-group">
                        <Uebersicht />
                    </div>

                    <div className="analysis-group">
                        <div className="header-button-group">
                            <h2>Analysen</h2>
                            <button className="button" type="button" onClick={() => navigate(`/analysen`)}>Mehr →</button>
                        </div>
                        <div className="diagramm-group">
                            <div className="diagramm">
                                <AnalysisCard />
                            </div>
                            <div className="diagramm">
                                <Verhaeltnis />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="dashboard-desktop2">
                    <div className="buchungen-group">
                        <div className="header-button-group">
                            <h2>Buchungen</h2>
                            <button className="button" type="button" onClick={() => navigate(`/AlleBuchungen`)}>Mehr →</button>
                        </div>
                        <BuchungenDashboard />
                    </div>
                </div>
            </div>
        </div>
    )
}