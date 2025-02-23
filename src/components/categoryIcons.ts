import default_icon from '../components/img/default_icon.svg';
import freizeit_icon from '../components/img/freizeit_icon.svg';
import wohnen_icon from '../components/img/wohnen_icon.svg';
import transport_icon from '../components/img/transport_icon.svg';
import einkauf_icon from '../components/img/einkauf_icon.svg';
import versicherung_icon from '../components/img/versicherung_icon.svg';
import uebertrag_icon from '../components/img/uebertrag_icon.svg';

const categoryIcons: Record<string, string> = {
    'Freizeit': freizeit_icon,
    'Wohnen': wohnen_icon,
    'Transport': transport_icon,
    'Einkauf': einkauf_icon,
    'Versicherung': versicherung_icon,
    'Übertrag': uebertrag_icon,
    'default': default_icon
}

export default categoryIcons;