import '../../style/Muhammad_CSS/StandardEinstellungen.css';


function StandardEinstellungenAnzeigen() {

    return (
        <div className="standardContainer">
            <div className="content">
                <div className="standard-title">
                    <h2>Standard-Einstellungen</h2>
                </div>
                <label className="label">Sprache</label>
                <div className ="select-standard-einstellungen"> 
                <select className="select">
                    <option>Deutsch</option>
                    <option>Englisch</option>
                </select>

                <label className="label">Währung</label>
                <select className="select">
                    <option>Euro €</option>
                    <option>Dollar $</option>
                </select>

                <label className="label">Darstellung</label>
                <select className="select">
                    <option>Hell-Modus</option>
                    <option>Dunkel-Modus</option>
                </select>
                </div>
            </div>
        </div>
    );
}

export default StandardEinstellungenAnzeigen;
