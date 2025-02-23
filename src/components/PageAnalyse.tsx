import DurchnittA from "./Analyse/DurchschnittA";
import ProzentualPocketA from "./Analyse/ProzentualPocketA";
import UebersichtA from "./Analyse/UebersichtA";
import VerhaeltnisA from "./Analyse/VerhaeltnisA";
import GesamtKategorieA from "./Analyse/GesamtKategorieA";
import './../style/Muhammad_CSS/PageAnalyse.css';
import KategorienLimit from "./Analyse/KategorienLimit";

import introJs from 'intro.js';
import 'intro.js/minified/introjs.min.css';
import helpIcon from './../components/img/help.svg'


export function PageAnalyse() {

    const startIntro = () => {
        introJs().setOptions({
            steps: [
                {
                    element: '.analyse-seite',
                    intro: 'Willkommen auf der Analysen-Seite! Hier findest du verschiedene Diagramme und Einblicke in deine Finanzen.'
                },
                {
                    element: '.analysen',
                    intro: 'Erhalte hier einen Einblick zu deinem aktuellen Kassenstand.'
                },
                {
                    element: '.analysis-group',
                    intro: 'Analysiere deine Finanzen anhand unserer Diagramme. Einige davon sind interaktiv, probiere sie aus!'
                }
            ],
            showProgress: true,
            showBullets: false,
            nextLabel: 'Weiter →',
            prevLabel: '← Zurück',
            doneLabel: 'Fertig',
        }).start();
    };

    return (
        <div className="analyse-seite">
            <div className="intro-wrap">
                <h2>Übersicht</h2>
                <button onClick={startIntro} className="intro-button">
                    <img src={helpIcon} alt="" />
                </button>
            </div>
            <UebersichtA />
            <div className="analysis-group">
                <h2>Analysen</h2>
                <div className="diagramm-group">
                    <div className="diagramm">
                        <DurchnittA />
                    </div>
                    <div className="diagramm">
                        <ProzentualPocketA />
                    </div>

                </div>
                <div className="diagramm-group">

                </div>
                <div className="diagramm-group">
                    <div className="diagramm">
                        <VerhaeltnisA />
                    </div>
                    <div className="diagramm">
                        <KategorienLimit />
                    </div>

                </div>

                <div className="diagramm-group">
                    <div className="diagramm">
                        <GesamtKategorieA />
                    </div>


                </div>


            </div>
        </div>
    )
}