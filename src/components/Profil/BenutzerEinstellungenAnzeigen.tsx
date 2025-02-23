import "../../style/benutzer_settings.css";
import React from "react";
import { useEffect, useState } from "react";
import { getLogin } from "../../backend/api";
import { changeEmail, changeName, changePassword, deleteUser } from "../../backend/dariusz_api";
import { useNavigate } from "react-router-dom";
import { useLoginContext } from "../LoginContext";
import { LoadingIndicator } from "../LoadingIndicator";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

function BenutzerEinstellungenAnzeigen() {
	const navigate = useNavigate();
	const [userId, setUserId] = useState("");
	const [passwordVisible, setPasswordVisible] = useState(false);
	const [nameLabel, setNameLabel] = useState("");
	const [nameLabelcolor, setNameLabelcolor] = useState("");
	const [emailLabel, setEmailLabel] = useState("");
	const [emailLabelcolor, setEmailLabelcolor] = useState("");
	const [passwordLabel, setPasswordLabel] = useState("");
	const [passwordLabelcolor, setPasswordLabelcolor] = useState("");
	const [loading, setLoading] = useState(false);
	const [loadingPass, setLoadingPass] = useState(false);
	const [loadingKonto, setLoadingKonto] = useState(false);
	const [loadingEmail, setLoadingEmail] = useState(false);


	const nameRef = React.createRef<HTMLInputElement>();
	const emailRef = React.createRef<HTMLInputElement>();
	const passwordRef = React.createRef<HTMLInputElement>();
	const newPasswordRef = React.createRef<HTMLInputElement>();

	const { setLoginInfo } = useLoginContext();

	useEffect(() => {
		const fetchLogin = async () => {
			const login = await getLogin();
			setUserId(login.id);
		};
		fetchLogin();
	}, []);

	async function requestNameChange() {
		const name = nameRef.current?.value;
		if (name) {
			setLoading(true);
			try {
				await changeName(userId, name);
				//Schauen ob nameRef existiert
				if (nameRef.current) {
					nameRef.current.value = "";
				}
				setNameLabelcolor("green");
				setNameLabel("Name erfolgreich geändert.");
			} catch (e: any) {
				setNameLabelcolor("red");
				setNameLabel("Fehler beim Ändern des Namens." + e.message);
			}
			finally {
				setLoading(false)
			}
		} else {
			setNameLabelcolor("red");
			setNameLabel("Bitte geben Sie einen Namen ein.");
		}
	}

	async function requestEmailChange() {
		const email = emailRef.current?.value;
		if (email) {
			setLoadingEmail(true);
			try {
				await changeEmail(userId, email);
				if (emailRef.current) {
					emailRef.current.value = "";
				}
				setEmailLabelcolor("green");
				setEmailLabel("E-Mail erfolgreich geändert.");
			} catch (e: any) {
				setEmailLabelcolor("red");
				setEmailLabel("Fehler beim Ändern der E-Mail." + e.message);
			}
			finally {
				setLoadingEmail(false)
			}
		} else {
			setEmailLabelcolor("red");
			setEmailLabel("Bitte geben Sie einen Namen ein.");
		}
	}

	async function requestPasswordChange() {
		const password = passwordRef.current?.value;
		const newPassword = newPasswordRef.current?.value;
		if (password && newPassword) {
			setLoadingPass(true);
			try {
				await changePassword(userId, password, newPassword);
				passwordRef.current!.value = "";
				newPasswordRef.current!.value = "";
				setPasswordLabelcolor("green");
				setPasswordLabel(
					"Passwort erfolgreich geändert. Sie werden in 3 sekunden ausgeloggt."
				);
				setTimeout(async () => {
					await doLogout();
				}, 3000);
			} catch (e: any) {
				setPasswordLabelcolor("red");
				setPasswordLabel("Fehler beim Ändern des Passworts." + e.message);
			} finally {
				setLoadingPass(false)
			}
		} else {
			setPasswordLabelcolor("red");
			setPasswordLabel("Bitte geben Sie ein altes und ein neues Passwort ein.");
		}
	}

	async function requestDeleteUser() {
		setLoadingKonto(true);
		try {
			await deleteUser(userId);
			await doLogout();
		} finally {
			setLoadingKonto(false)
		}
	}

	async function doLogout() {
		localStorage.removeItem("token");
		setLoginInfo(false);
		navigate("/");
	}

	const togglePasswordVisibility = () => {
		setPasswordVisible(!passwordVisible);
	};

	return (
		<div className="benutzerEinstellungen">
			<div className="selectedContentHeader">
				<h2>Benutzer Einstellungen</h2>
			</div>

			<div className="input-wrapper">
				<h3 className="feldHeader">Email ändern</h3>
				<input className="eingabeFeld" type="text" placeholder="Name" ref={nameRef} />
				<button className="submitButton button" disabled={loading} onClick={requestNameChange}>
					{loading ? <LoadingIndicator size="small" color="white" showMessage={false} position="center" /> : "Änderung speichern"}
				</button>
				{nameLabel && <p style={{ color: nameLabelcolor }}>{nameLabel}</p>}
			</div>

			<div className="input-wrapper">
				<h3 className="feldHeader">Email ändern</h3>
				<input className="eingabeFeld" type="text" placeholder="Email" ref={emailRef} />
				<button className="submitButton button" disabled={loadingEmail} onClick={requestEmailChange}>
					{loadingEmail ? <LoadingIndicator size="small" color="white" showMessage={false} position="center" /> : "Änderung speichern"}
				</button>
				{emailLabel && <p style={{ color: emailLabelcolor }}>{emailLabel}</p>}
			</div>

			<div className="input-wrapper input-wrapper-password">
				<h3 className="feldHeader">Passwort ändern</h3>
				<div className="password-input">
					<input
						className="eingabeFeld"
						type={passwordVisible ? "text" : "password"}
						placeholder="Altes Password eingeben"
						ref={passwordRef}
					/>
					<FontAwesomeIcon
						icon={passwordVisible ? faEyeSlash : faEye}
						className="toggle-password"
						onClick={togglePasswordVisibility}
					/>
				</div>
				<div className="password-input">
					<input
						className="eingabeFeld"
						type={passwordVisible ? "text" : "password"}
						placeholder="Neues Passwort eingeben"
						ref={newPasswordRef}
					/>
					<FontAwesomeIcon
						icon={passwordVisible ? faEyeSlash : faEye}
						className="toggle-password"
						onClick={togglePasswordVisibility}
					/>
				</div>
				{passwordLabel && <p style={{ color: passwordLabelcolor }}>{passwordLabel}</p>}
				<button className="submitButton button" disabled={loadingPass} onClick={requestPasswordChange}>
					{loadingPass ? <LoadingIndicator size="small" color="white" showMessage={false} position="center" /> : "Änderung speichern"}
				</button>
			</div>

			<div className="danger-zone">
				<h3 className="feldHeader">Email ändern</h3>
				<button className="button dangerButton" disabled={loadingKonto} onClick={requestDeleteUser}>
					{loadingKonto ? <LoadingIndicator size="small" color="white" showMessage={false} position="center" /> : "Benutzerkonto löschen"}
				</button>
			</div>
		</div>
	);
}
export default BenutzerEinstellungenAnzeigen;
