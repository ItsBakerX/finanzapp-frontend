import React, { useState, useEffect } from 'react';
import { postBenutzerVerify } from '../backend/api';
import { useNavigate } from 'react-router-dom';

function Verify() {
    const [email, setEmail] = useState<string | null>(null);
    const [code, setCode] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);
    const navigate = useNavigate();

    useEffect(() => {
        const storageEmail = sessionStorage.getItem('email');
        if (storageEmail) {
            setEmail(storageEmail);
        }
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);

        if (email == null) {
            setError('E-Mail-Adresse ist erforderlich');
            return;
        }

        try {
            await postBenutzerVerify(email, code);
            setSuccess(true);
            navigate('/Login');
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div className="verify-container">
            <h1 className='verify-title'>Verifiziere dein Konto</h1>
            <form className="verify-form" onSubmit={handleSubmit}>
                {!email && (
                    <>
                        <label>E-Mail-Adresse</label>
                        <input type="email" placeholder="E-Mail-Adresse eingeben" value={email || ''} onChange={(e) => setEmail(e.target.value)} required />
                    </>
                )}
                <label>Verifizierungscode</label>
                <input type="text" placeholder="Verifizierungscode eingeben" value={code} onChange={(e) => setCode(e.target.value)} required />
                <button type="submit">Verifizieren</button>
                {success && <p className="verify">Verifizierung erfolgreich!</p>}
            </form>
        </div>
    );
}

export default Verify;