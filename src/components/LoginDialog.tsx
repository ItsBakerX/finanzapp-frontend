import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useLoginContext } from './LoginContext';
import { getLogin, postLogin } from '../backend/api';
import { Link, useNavigate } from 'react-router-dom';
import { LoadingIndicator } from './LoadingIndicator';

function LoginDialog() {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const navigate = useNavigate();
    const { setLoginInfo } = useLoginContext();
    const [loginData, setLoginData] = useState({ email: "", password: "" });
    const [loginFailed, setLoginFailed] = useState<string>("");
    const [loading, setLoading] = useState(false);

    const [fieldErrors, setFieldErrors] = useState({ email: false, password: false });

    async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setLoading(true);
        try {
            await postLogin(loginData.email, loginData.password);
            const response = await getLogin();
            setLoginInfo(response);
            setLoginFailed("");
            setFieldErrors({ email: false, password: false });
            navigate("/dashboard");
        } catch (err) {
            setLoginInfo(false);
            setLoginFailed("E-mail oder Passwort ist falsch. Bitte erneut versuchen!");
            setFieldErrors({ email: true, password: true });
        } finally {
            setLoading(false);
        }
    }

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const validationErrors = (fieldError: boolean): string => {
        if (fieldError) {
            return "error-border";
        }
        return "";
    }
    

    return (
        <div className="login-container">
            <h1 className='LoginTitle'>Behalte deine Finanzen im Blick.<br />Melde dich an!</h1>
            <form className="login-form" onSubmit={handleLogin}>
                <label>Email-Adresse</label>
                <input
                    type="text"
                    placeholder="E-Mail-Adresse eingeben"
                    className={validationErrors(fieldErrors.email)}
                    onChange={e => setLoginData({ ...loginData, email: e.target.value })}
                    required
                />
                <label>Passwort</label>
                <div className="password-container">
                    <input
                        type={passwordVisible ? "text" : "password"}
                        placeholder="Password eingeben"
                        className={validationErrors(fieldErrors.password)}
                        onChange={e => setLoginData({ ...loginData, password: e.target.value })}
                        required
                    />
                    <FontAwesomeIcon
                        icon={passwordVisible ? faEyeSlash : faEye}
                        className="toggle-password"
                        onClick={togglePasswordVisibility}
                    />
                </div>
                {loginFailed && <p className="failed-error-message">{loginFailed}</p>}
                <button type="submit" className="login-button" disabled={loading}>
                    {loading ? <LoadingIndicator size="small" color="white" showMessage={false} position="y-axis" /> : "Anmelden"}
                </button>
            </form>
            <div className="signup-text">
                <p>Du hast noch kein Konto?</p>
                <Link to="/Registrieren" className="signup-link">Melde dich an!</Link>
            </div>
        </div>
    );
}

export default LoginDialog;