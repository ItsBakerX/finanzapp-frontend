import { useNavigate } from "react-router-dom";
import { useLoginContext } from "./LoginContext";
import { useEffect, useState } from "react";
import "../style/pageStart.css";
import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";
import img1 from "./img/screenshots/1.png";
import img2 from "./img/screenshots/2.png";
import img3 from "./img/screenshots/3.png";
import img4 from "./img/screenshots/4.png";

import darkImg1 from "./img/screenshots/dark_1.png";
import darkImg2 from "./img/screenshots/dark_2.png";
import darkImg3 from "./img/screenshots/dark_3.png";
import darkImg4 from "./img/screenshots/dark_4.png";

import mimg1 from "./img/screenshots/m1.png";
import mimg2 from "./img/screenshots/m2.png";
import mimg3 from "./img/screenshots/m3.png";
import mimg4 from "./img/screenshots/m4.png";

import darkmImg1 from "./img/screenshots/dark_m1.png";
import darkmImg2 from "./img/screenshots/dark_m2.png";
import darkmImg3 from "./img/screenshots/dark_m3.png";
import darkmImg4 from "./img/screenshots/dark_m4.png";

function Start() {
	const { loginInfo } = useLoginContext();
	const navigate = useNavigate();
	const [darkMode, setDarkMode] = useState(document.body.classList.contains('dark-mode'));


	const [screenSize, setScreenSize] = useState({
		width: window.innerWidth,
		height: window.innerHeight,
	});

	useEffect(() => {
		const handleResize = () => {
			setScreenSize({
				width: window.innerWidth,
				height: window.innerHeight,
			});
		};

		window.addEventListener("resize", handleResize);

		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	useEffect(() => {
		if (loginInfo) {
			navigate("/dashboard");
		}
	}, [loginInfo]);

	useEffect(() => {
		const observer = new MutationObserver(() => {
			setDarkMode(document.body.classList.contains('dark-mode'));
		});

		observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

		return () => {
			observer.disconnect();
		};
	}, []);

	return (
		<div className="start">
			<article className="start1">
				<div className="start-text">
					<h1>
						Verwalte deine Finanzen
						<br /> sicher und diskret.
					</h1>
					<p>
						Behalte den Überblick über alle deine Finanzen ohne externe
						Bankverbindungen.
						<br /> Organisiere deine Transaktionen über manuelle Benutzereingaben.
					</p>

					<div className="arrow-container">
						<button
							className="button primary-button"
							type="button"
							onClick={() => navigate(`/Registrieren`)}
						>
							Starte jetzt!
						</button>
						<button
							className="button secondary-button"
							type="button"
							onClick={() =>
								document
									.querySelector("#tutorial")
									?.scrollIntoView({ behavior: "smooth" })
							}
						>
							So funktionierts!
						</button>
						{/* <img className="imageArr" src={arr} /> */}
					</div>
				</div>
				<div className="dashboard-image"></div>
			</article>

			<article>
				<h2>Warum du BudgetBuddy nutzen solltest:</h2>
				<div className="card-container">
					<div className="card-content">
						{/* <img className="img-shapes" src={secureIcon} /> */}
						<h4>Sicher & unabhängig</h4>
						<p>
							BudgetBuddy stellt keine Verbindung zu externen Stellen, wie z.B. Banken
							her. So wird das Risiko von Datenlecks erheblich gesinkt. So haben alle
							Daten, die du BudgetBuddy zur Verfügung stellst, keinen Bezug zu deinen
							tatsächlichen Konten und können nicht zurückverfolgt werden.
						</p>
					</div>

					<div className="card-content">
						{/* <img className="img-shapes" src={easyIcon} /> */}
						<h4>Schnell & Einfach</h4>
						<p>
							In BudgetBuddy kannst du alle deine Transaktionen mit wenigen Klicks
							manuell eintragen. Gebe die entsprechende Transaktion einfach über die
							Texteingabe ein oder scanne Rechnungen per Foto ein.
						</p>
					</div>

					<div className="card-content">
						{/* <img className="img-shapes" src={configIcon} /> */}
						<h4>Vollständig konfigurierbar</h4>
						<p>
							BudgetBuddy passt sich ganz deinen Wünschen an. Passe deine gewünschte
							Sprache, Währung und Erscheinungsbild an. Lege sich wiederholende
							Transaktionen, wie z.B. Miete, oder personalisierte Kategorien für deine
							Einnahmen und Ausgaben fest.
						</p>
					</div>
				</div>
			</article>

			{screenSize.width > 900 ? (
				<div className="tutorial">
					<h2>So funktionierts!</h2>
					<div className="img-container">
						<AliceCarousel autoPlay autoPlayInterval={3000} infinite={true} items={
							(() => {
								if (darkMode) {
									return [
										<img src={darkImg1} className="sliderimg" alt="img1"/>,
										<img src={darkImg2} className="sliderimg" alt="img2"/>,
										<img src={darkImg3} className="sliderimg" alt="img3"/>,
										<img src={darkImg4} className="sliderimg" alt="img4"/>
									];
								} else {
									return [
										<img src={img1} className="sliderimg" alt="img1"/>,
										<img src={img2} className="sliderimg" alt="img2"/>,
										<img src={img3} className="sliderimg" alt="img3"/>,
										<img src={img4} className="sliderimg" alt="img4"/>
									];
								}
							})()
						} />
					</div>

				</div>
			) : (
				<div className="tutorial">
					<h2>So funktionierts!</h2>
					<div className="img-container">

					<AliceCarousel autoPlay autoPlayInterval={3000} infinite={true} items={
							(() => {
								if (darkMode) {
									return [
										<img src={darkmImg1} className="sliderimg" alt="img1"/>,
										<img src={darkmImg2} className="sliderimg" alt="img2"/>,
										<img src={darkmImg3} className="sliderimg" alt="img3"/>,
										<img src={darkmImg4} className="sliderimg" alt="img4"/>
									];
								} else {
									return [
										<img src={mimg1} className="sliderimg" alt="img1"/>,
										<img src={mimg2} className="sliderimg" alt="img2"/>,
										<img src={mimg3} className="sliderimg" alt="img3"/>,
										<img src={mimg4} className="sliderimg" alt="img4"/>
									];
								}
							})()
						} />
					</div>
				</div>
			)}
		</div>
	);
}
export default Start;
