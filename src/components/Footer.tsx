import logo from '../components/img/logo.png';
import logo_dark_icon from '../components/img/footer_dark_icon.svg';
import { Link } from 'react-router-dom';
import './../style/Baker_CSS/Footer.css';
function Footer() {
    return (
        <footer className="footer">
            <div className="content has-text-centered">
                <img src={logo} alt="logo" className='logo light-mode-logo' />
                <img src={logo_dark_icon} alt="logo" className='logo dark-mode-logo' />
                <br></br>
                <div className="text">
                    <Link to="/impressum"><b>Impressum</b></Link>
                    <Link to="/datenschutz"><b>Datenschutz</b></Link>
                    <Link to={"/kontakt"}><b>Kontakt</b></Link>
                </div>
            </div>
        </footer>
    )
}
export default Footer;