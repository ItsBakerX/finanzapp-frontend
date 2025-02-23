import mail_icon from "../../src/components/img/mail_icon.svg";
import "../../src/style/impressum.css";

function Datenschutz() {
  const intro = `Vielen Dank für Ihren Besuch auf unserer Webseite.Der Schutz Ihrer persönlichen Daten ist uns wichtig. `;
  const savedData = `Wir verwenden auf unserer Webseite weder Cookies noch speichern oder verarbeiten wir personenbezogene Daten.\r\n Es werden keine Informationen über Sie oder Ihr Verhalten auf unserer Webseite erfasst.`;
  const contact = `Bei weiteren Fragen zum Datenschutz können Sie uns gerne unter folgender E - Mail - Adresse kontaktieren:`;
  const email = "budgetbuddygab@gmail.com";
  const currentValidity = `Diese Datenschutzerklärung ist aktuell gültig und hat den Stand 10. Jan 2025.`;

  return (
    <div className="impressum">
      <div>
        <div className="paragraph">
          <p className="title">Datenschutzerklärung</p>
          <p className="text">
            {intro}
            <br />
          </p>
        </div>
        <div className="paragraph">
          <p>
            <b>Speichern von Daten</b>
          </p>
          <p className="text">
            {savedData}
            <br />
          </p>
        </div>
        <div className="paragraph">
          <p>
            <b>Kontakt</b>
          </p>
          <p className="text">
            {contact}
            <div className="contact">
              <img src={mail_icon} alt="Mail Icon" />
              <a href="mailto:budgetbuddygab@gmail.com">
                budgetbuddygab@gmail.com
              </a>
            </div>
          </p>
        </div>
        <div className="paragraph">
          <p>
            <b>Aktualität und Gültigkeit</b>
          </p>
          <p className="text">
            {currentValidity}
            <br />
          </p>
        </div>
      </div>
    </div>
  );
}

export default Datenschutz;
