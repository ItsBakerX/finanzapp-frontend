import mail_icon from '../../src/components/img/mail_icon.svg';
import tele_icon from '../../src/components/img/telephone_icon.svg';
import '../../src/style/impressum.css';

function Impressum() {
    return (
      <div className="impressum">
        <div>
          <div className="paragraph">
            <p className="title">Impressum</p>
            <p className="text">
              Hier liest du unser Impressum. Wenn du Fragen hast, kannst du uns
              gerne kontaktieren.
            </p>
          </div>
          <div className="paragraph">
            <p>
              <b>Gemeinschaftliches Arbeitsbündnis [GAB]</b>
              <br />
            </p>
            <p className="text">
              BudgetBuddy - Finanzmanager
              <br />
              Luxemburger Str. 10, <br />
              13353 Berlin
              <br />
              Bundesrepublik Deutschland
              <br />
            </p>
          </div>
          <div className="paragraph">
            <p>
              <b>Vertreten durch</b>
              <br />
            </p>
            <p className="text">
              Baker Al-Shaikhli
              <br />
              Brandenburgische Straße 14
              <br />
              12679 Berlin
              <br />
              Bundesrepublik Deutschland
              <br />
            </p>
          </div>
          <div className="paragraph">
            <p>
              <b>Kontakt</b>
              <br />
            </p>
            <div className="contact">
              <img src={tele_icon} alt="Telephone Icon" />
              <a href="tel:+4917657778199">+49 176 577 781 99</a>
            </div>
            <div className="contact">
              <img src={mail_icon} alt="Mail Icon" />
              <a href="mailto:budgetbuddygab@gmail.com">
                budgetbuddygab@gmail.com
              </a>
            </div>
          </div>
        </div>
      </div>
    );
}


export default Impressum;