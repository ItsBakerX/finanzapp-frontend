import { useEffect, useRef, useState } from "react";
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { createBuchungFromImg } from "../backend/api";
import upload_icon from './img/upload_icon.svg';
import './../style/Baker_CSS/Uploud.css';

interface UploadProps {
    userId: string | null;
    onUploadComplete: (result: any) => void;
    onUploadError: (error: string) => void;
    reset: boolean;
}

export default function Upload({ userId, onUploadComplete, onUploadError, reset }: UploadProps) {
    const [processing, setProcessing] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null); // Ref für das File-Input-Element

    useEffect(() => {
        if (reset && fileInputRef.current) {
            fileInputRef.current.value = ""; // Datei-Input leeren
        }
    }, [reset]);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
            const MAX_SIZE_MB = 5;

            if (!allowedTypes.includes(selectedFile.type)) {
                onUploadError('Nur JPEG- oder PNG-Dateien sind erlaubt!');
                return;
            }

            if (selectedFile.size > MAX_SIZE_MB * 1024 * 1024) {
                onUploadError('Die Datei darf maximal 5 MB groß sein!');
                return;
            }

            // Automatisch hochladen
            setProcessing(true);
            try {
                const response = await createBuchungFromImg(userId || '', selectedFile); // Datei direkt senden
                onUploadComplete(response); // Erfolg an die Elternkomponente weitergeben
            } catch (error: any) {
                onUploadError(error.message || 'Fehler beim Verarbeiten des Bildes.');
            } finally {
                setProcessing(false);
            }
        }
    };

    return (
        <div className="Upload">
            <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                ref={fileInputRef}
                id="file-upload"
            />
            <label htmlFor="file-upload" className={`upload-button ${processing ? 'loading' : ''}`}>
                {processing ? (
                    <>
                        <FontAwesomeIcon icon={faSpinner} spin className="upload-spinner" />
                        <span>Lädt...</span>
                    </>
                ) : (
                    <>
                        <p>Dokument hochladen</p>
                        <img src={upload_icon} alt="Upload Icon" className="upload-icon" />
                    </>
                )}
            </label>
        </div>
    );
}
