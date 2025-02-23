import { useRef } from "react";
import "../../src/style/kontakt.css"
import { sendKontaktEmail } from "../backend/dariusz_api";

export type EmailTemplate = {
    betreff: string,
    anliegen: string,
    email: string,
    message: string
}

function Kontakt() {
    let betreffinput = useRef<HTMLInputElement>(null);
    let anliegeninput = useRef<HTMLSelectElement>(null);
    let emailinput = useRef<HTMLInputElement>(null);
    let messageinput = useRef<HTMLTextAreaElement>(null);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        const email: EmailTemplate = {
            betreff: betreffinput.current!.value,
            anliegen: anliegeninput.current!.value,
            email: emailinput.current!.value,
            message: messageinput.current!.value
        }
        try {
            await sendKontaktEmail(email);
            betreffinput.current!.value = "";
            anliegeninput.current!.value = "frage";
            emailinput.current!.value = "";
            messageinput.current!.value = "";

        } catch (e) {
            console.error(e);
        }
    }

    return (
        <div className="kontakt">
            <div className="paragraph_kontakt">
                <p className="title_kontakt">
                    <b>Kontakt</b>
                </p>
                <p className="text_kontakt">
                    Hier findest du ein Kontaktformular, um uns zu erreichen. Wir freuen
                    uns auf deine Nachricht!
                </p>
            </div>

            <form className="kontakt_form" onSubmit={handleSubmit}>
                <label htmlFor="betreff">Betreff:</label>
                <br />
                <input
                    id="betreff"
                    type="text"
                    placeholder="Gib den Betreff ein"
                    required
                    className="eingabeFeld"
                    ref={betreffinput}
                ></input>
                <br />
                <label htmlFor="anliegen">Anliegen:</label>
                <br />
                <select
                    id="anliegen"
                    required
                    className="selectBox eingabeFeld"
                    ref={anliegeninput}
                >
                    <option className="opt" value="frage">
                        Frage
                    </option>
                    <option className="opt" value="anregung">
                        Anregung
                    </option>
                    <option className="opt" value="fehler">
                        Fehler
                    </option>
                    <option className="opt" value="sonstiges">
                        Sonstiges
                    </option>
                </select>
                <br />
                <label htmlFor="email">Email:</label>
                <br />
                <input
                    id="email"
                    type="text"
                    placeholder="example@email.to"
                    required
                    className="eingabeFeld"
                    ref={emailinput}
                ></input>
                <br />
                <label htmlFor="message">Nachricht:</label>
                <br />
                <textarea
                    id="message"
                    placeholder="Gebe hier deine Nachricht ein"
                    required
                    className="eingabeFeld"
                    ref={messageinput}
                ></textarea>
                <br />
                <button type="submit" className="submitButton_kontakt button">
                    Absenden
                </button>
            </form>
        </div>
    );
}

export default Kontakt;