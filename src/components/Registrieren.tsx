import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import React, { useState } from 'react';
import { postBenutzer } from '../backend/api';
import { useNavigate } from 'react-router-dom';
import { LoadingIndicator } from './LoadingIndicator';

function Registieren() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const toggleConfirmPasswordVisibility = () => {
        setConfirmPasswordVisible(!confirmPasswordVisible);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);
        setLoading(true);

        if (password !== confirmPassword) {
            setError('Passwörter stimmen nicht überein');
            setLoading(false);
            return;
        }

        try {
            await postBenutzer(name, email, password);
            setSuccess(true);
            sessionStorage.setItem('email', email);
            navigate('/Verify');
        } catch (err: any) {
            setError(err.message);
        }finally {
            setLoading(false);
        }
    };

    return (
        <div className="registrieren-container">
            <h1 className='registrieren-title'>Behalte deine Finanzen im Blick. <br /> Melde dich an!</h1>
            <form className="registrieren-form" onSubmit={handleSubmit}>
                <label>Name</label>
                <input
                    type="text"
                    placeholder="Name eingeben"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <label>E-Mail-Adresse</label>
                <input
                    type="email"
                    placeholder="E-Mail-Adresse eingeben"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <label>Passwort</label>
                <div className="password-container">
                    <input
                        type={passwordVisible ? "text" : "password"}
                        placeholder="Passwort eingeben"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <FontAwesomeIcon
                        icon={passwordVisible ? faEyeSlash : faEye}
                        className="toggle-password"
                        onClick={togglePasswordVisibility}
                    />
                </div>
                <label>Passwort wiederholen</label>
                <div className="password-container">
                    <input
                        type={confirmPasswordVisible ? "text" : "password"}
                        placeholder="Passwort wiederholen"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                    <FontAwesomeIcon
                        icon={confirmPasswordVisible ? faEyeSlash : faEye}
                        className="toggle-password"
                        onClick={toggleConfirmPasswordVisibility}
                    />
                </div>
                <p className="password-info">
                    Dein Passwort muss mindestens 8 Zeichen lang sein, einen Großbuchstaben und ein Sonderzeichen enthalten!
                </p>
                <button type="submit" disabled={loading}>
                {loading ? <LoadingIndicator size="small" color="white" showMessage={false} position="y-axis" /> : "Konto erstellen"}
                </button>
                {error && <div style={{ color: 'red' }}>{error}</div>}
                {success && <div style={{ color: 'green' }}>Registration successful!</div>}
            </form>
        </div>
    );
}

export default Registieren;
