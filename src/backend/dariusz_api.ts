/// <reference types="vite/client" />
import { EmailTemplate } from "../components/Kontakt";

export async function sendKontaktEmail(email: EmailTemplate): Promise<void> {
    const response = await fetch(`${import.meta.env.VITE_API_SERVER_URL}/api/kontakt/`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                betreff: email.betreff,
                anliegen: email.anliegen,
                email: email.email,
                message: email.message
            })
        }
    )
    if (!response.ok) {
        throw new Error(`Failed to send email: ${response.status}`);
    }
}

export async function deleteUser(userId: string): Promise<void> {
    const token = localStorage.getItem("token") || "null";
    const response = await fetch(`${import.meta.env.VITE_API_SERVER_URL}/api/benutzer/${userId}`,
        {
            method: 'DELETE',
            headers: {
                token: token
            },
            credentials: "include" as RequestCredentials,
        }
    )
    if (!response.ok) {
        throw new Error(`Failed to delete user: ${response.status}`);
    }
}

export async function changeName(userId: string, name: string): Promise<void> {
	const token = localStorage.getItem("token") || "null";
	const response = await fetch(`${import.meta.env.VITE_API_SERVER_URL}/api/benutzer/${userId}`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
			token: token,
		},
		body: JSON.stringify({
			name: name,
		}),
		credentials: "include" as RequestCredentials,
	});
	if (!response.ok) {
		throw new Error(`Failed to change name: ${response.status}`);
	}
}

export async function changeEmail(userId: string, email: string): Promise<void> {
	const token = localStorage.getItem("token") || "null";
	const response = await fetch(`${import.meta.env.VITE_API_SERVER_URL}/api/benutzer/${userId}`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
			token: token,
		},
		body: JSON.stringify({
			email: email,
		}),
		credentials: "include" as RequestCredentials,
	});
	if (!response.ok) {
		throw new Error(`Failed to change email: ${response.status}`);
	}
}

export async function changePassword(
	userId: string,
	password: string,
	newPassword: string
): Promise<void> {
	const token = localStorage.getItem("token") || "null";
	const checkResponse = await fetch(
		`${import.meta.env.VITE_API_SERVER_URL}/api/benutzer/checkPassword`,
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				token: token,
			},
			body: JSON.stringify({
				password: password,
			}),
			credentials: "include" as RequestCredentials,
		}
	);
	if (!checkResponse.ok) {
		throw new Error(`Failed to check password: ${checkResponse.status}`);
	}
	const response = await fetch(`${import.meta.env.VITE_API_SERVER_URL}/api/benutzer/${userId}`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
			token: token,
		},
		body: JSON.stringify({
			password: newPassword,
		}),
		credentials: "include" as RequestCredentials,
	});
	if (!response.ok) {
		throw new Error(`Failed to change password: ${response.status}`);
	}
}