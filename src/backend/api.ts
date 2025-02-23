import { LoginInfo } from "../components/LoginContext";
import { BenutzerResource, BuchungResource, BuchungskategorieResource, PocketResource, SparzielResource } from "../Resources";
import { buchungen, pockets } from "./testdata";

// **************************************Pocket Router**********************************
export async function getAllePockets(): Promise<PocketResource[]> {
    // Fetch-Call, um die Daten von unserem Server zu laden. 
    const res = await fetch(`${import.meta.env.VITE_API_SERVER_URL}/api/pocket/alle`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "token": localStorage.getItem("token") || "null"
        },
        credentials: "include" as RequestCredentials
    })
    if (!res.ok) {
        throw new Error("response error");
    }
    return await res.json();
}

export async function getPocket(pocketId: string): Promise<PocketResource> {
    if (import.meta.env.VITE_REAL_FETCH !== 'true') {
        await new Promise(r => setTimeout(r, 700));
        const pock = pockets.find(p => p.id === pocketId);
        if (!pock) {
            throw new Error(`pocket not found`);
        }
        return pock;
    } else {
        const res = await fetch(`${import.meta.env.VITE_API_SERVER_URL}/api/pocket/${pocketId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "token": localStorage.getItem("token") || "null"
            },
            credentials: "include" as RequestCredentials
        })
        if (!res.ok) {
            throw new Error("response error");
        }
        return await res.json();
    }
}

export async function postPocket(pocked: PocketResource) {
    const url = `${import.meta.env.VITE_API_SERVER_URL}/api/pocket`;

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "token": localStorage.getItem("token") || "null"
        },
        credentials: "include" as RequestCredentials,
        body: JSON.stringify({
            name: pocked.name,
            benutzer: pocked.benutzer,
            notiz: pocked.notiz ? pocked.notiz : undefined,
            betrag: pocked.betrag,
        })
    });
    return await response.json();
}


export async function updatePocketNameOrNotiz(id: string, name: string, betrag: number, notiz: string, benutzer: string): Promise<PocketResource> {
    const url = `${import.meta.env.VITE_API_SERVER_URL}/api/pocket/${id}`;

    const response = await fetch(url, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "token": localStorage.getItem("token") || "null"
        },
        credentials: "include" as RequestCredentials,
        body: JSON.stringify({
            name,
            betrag,
            notiz,
            benutzer
        })
    });

    if (!response.ok) {
        throw new Error("Pocket kann nicht aktualisiert werden!");
    }

    return await response.json();
}


export async function deletePocket(pocketId: string) {
    const url = `${import.meta.env.VITE_API_SERVER_URL}/api/pocket/${pocketId}`;
    const response = await fetch(url, {

        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "token": localStorage.getItem("token") || "null"
        },

        credentials: "include" as RequestCredentials
    });
    if (response.ok) {
        return;
    }
    throw new Error(`Error deleting pocket, status: ${response.status}`);
}

// **********************************Buchung Router**********************************
export async function getAllebuchungen(): Promise<BuchungResource[]> {
    const res = await fetch(`${import.meta.env.VITE_API_SERVER_URL}/api/buchung/alle`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "token": localStorage.getItem("token") || "null"
        },
        credentials: "include" as RequestCredentials
    })
    if (!res.ok) {
        const errorMsg = await res.text(); // Falls Backend relevante Fehlertexte sendet
        throw new Error(`Error fetching buchungen: ${res.status} ${errorMsg}`);
    }
    return await res.json();
}
// get eine Buchung
export async function getBuchungById(buchungId: string): Promise<BuchungResource> {
    const url = `${import.meta.env.VITE_API_SERVER_URL}/api/buchung/single/${buchungId}`;
    const res = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "token": localStorage.getItem("token") || "null"
        },
        credentials: "include" as RequestCredentials
    });
    if (!res.ok) {
        if (res.status === 404) {
            const errorData = await res.json();
            throw new Error(errorData.errors[0].msg);
        }
        throw new Error("response error");
    }
    return await res.json();
}

export async function getAllebuchungenWiederkehrend(): Promise<BuchungResource[]> {
    const res = await fetch(`${import.meta.env.VITE_API_SERVER_URL}/api/buchung/wiederkehrend`, {

        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "token": localStorage.getItem("token") || "null"
        }, credentials: "include" as RequestCredentials
    })
    if (!res.ok) {
        throw new Error("response error");
    }
    return await res.json();
}


export async function postBuchung(buchung: BuchungResource) {
    const url = `${import.meta.env.VITE_API_SERVER_URL}/api/buchung`;
    try {


        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "token": localStorage.getItem("token") || "null"
            },
            credentials: "include" as RequestCredentials,
            body: JSON.stringify({
                name: buchung.name,
                pocket: buchung.pocket,
                kategorie: buchung.kategorie,
                datum: buchung.datum,
                betrag: buchung.betrag,
                typ: buchung.typ,
                intervall: buchung.intervall ? buchung.intervall : undefined,
                zielPocket: buchung.zielPocket ? buchung.zielPocket : undefined,
                notiz: buchung.notiz ? buchung.notiz : undefined
            })
        });
        return await response.json();
    } catch (err) {
        const status = (err as any).status;
        if (status === 400) {
            throw new Error("Buchung is closed");
        }
    }
}


export async function deleteBuchung(buchungId: string) {
    const url = `${import.meta.env.VITE_API_SERVER_URL}/api/buchung/${buchungId}`;
    const response = await fetch(url, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "token": localStorage.getItem("token") || "null"
        },
        credentials: "include" as RequestCredentials
    });
    if (response.ok) {
        return;
    }
    throw new Error(`Error deleting buchung, status: ${response.status}`);
}

// Fetch all bookings for a specific category
export async function getBuchungenByKategorieId(kategorieId: string): Promise<BuchungResource[]> {
    const res = await fetch(`${import.meta.env.VITE_API_SERVER_URL}/api/buchung/${kategorieId}/kategorie/buchungen`, {

        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "token": localStorage.getItem("token") || "null"
        },

        credentials: "include" as RequestCredentials
    });
    if (!res.ok) {
        const errorMsg = await res.text();
        throw new Error(`Error fetching buchungen for kategorieId ${kategorieId}: ${res.status} ${errorMsg}`);
    }
    return await res.json();
}

// Fetch all bookings for a specific pocket
export async function getBuchungenByPocketId(pocketId: string): Promise<BuchungResource[]> {
    const res = await fetch(`${import.meta.env.VITE_API_SERVER_URL}/api/buchung/${pocketId}/buchungen`, {

        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "token": localStorage.getItem("token") || "null"
        },

        credentials: "include" as RequestCredentials
    });
    if (!res.ok) {
        const errorMsg = await res.text();
        throw new Error(`Error fetching buchungen for pocketId ${pocketId}: ${res.status} ${errorMsg}`);
    }
    return await res.json();
}

// Fetch alle Ausgaben
export async function getAlleAusgabenBuchung(): Promise<BuchungResource[]> {
    const url = `${import.meta.env.VITE_API_SERVER_URL}/api/buchung/ausgaben`;
    const res = await fetch(url, {

        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "token": localStorage.getItem("token") || "null"
        },

        credentials: "include" as RequestCredentials
    });
    if (!res.ok) {
        const errorMsg = await res.text();
        throw new Error(`Error fetching ausgaben: ${res.status} ${errorMsg}`);
    }
    return await res.json();
}

// Fetch alle Einnahmen
export async function getAlleEinnahmenBuchung(): Promise<BuchungResource[]> {
    const url = `${import.meta.env.VITE_API_SERVER_URL}/api/buchung/einnahmen`;
    const res = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "token": localStorage.getItem("token") || "null"
        },

        credentials: "include" as RequestCredentials
    });
    if (!res.ok) {
        const errorMsg = await res.text();
        throw new Error(`Error fetching einnahmen: ${res.status} ${errorMsg}`);
    }
    return await res.json();
}



/************************* Login *************************** */

export async function postLogin(email: string, password: string) {
    const url = `${import.meta.env.VITE_API_SERVER_URL}/api/login`;

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include" as RequestCredentials,
        body: JSON.stringify({ email: email, password: password })
    });

    if (response.ok) {
        const data = await response.json();
        const token = data.token || "null";
        localStorage.setItem("token", token);
        return;
    } else if (response.status === 401) {
        throw new Error("Invalid credentials");
    } else {
        throw new Error(`Error connecting to ${import.meta.env.VITE_API_SERVER_URL}: ${response.statusText}`);
    }
}


export async function getLogin() {
    const url = `${import.meta.env.VITE_API_SERVER_URL}/api/login`;
    const token = localStorage.getItem("token") || "null";
    console.log("Requesting:", url, "with token:", token);

    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "token": token
        },
        credentials: "include" as RequestCredentials,
    });
    console.log("Response status:", response.status);
    if (response.ok) {
        const loginInfo: LoginInfo = await response.json();
        return loginInfo;
    }
    if (response.status === 401) {
        throw new Error("Invalid credentials");
    }
    throw new Error(`Error connecting to ${import.meta.env.VITE_API_SERVER_URL}: ${response.statusText}`);
}


export async function deleteLogin(): Promise<void> {
    const url = `${import.meta.env.VITE_API_SERVER_URL}/api/login`;
    const response = await fetch(url, { 
        method: "DELETE", 
        credentials: "include" as RequestCredentials 
    });

    if (response.ok) {
        localStorage.removeItem("token");
        return;
    }
    throw new Error(`Error logging out, status: ${response.status}`);
}

export async function postBenutzer(name: string, email: string, password: string): Promise<BenutzerResource> {
    const url = `${import.meta.env.VITE_API_SERVER_URL}/api/benutzer/register`;

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "token": localStorage.getItem("token") || "null"
        },
        body: JSON.stringify({ name, email, password }),
        credentials: "include" as RequestCredentials,
    });

    if (response.ok) {
        const benutzer: BenutzerResource = await response.json();
        return benutzer;
    }

    if (response.status === 400) {
        const errorMessage = await response.text();
        throw new Error(errorMessage);
    }

    throw new Error(`Error connecting to ${import.meta.env.VITE_API_SERVER_URL}: ${response.statusText}`);
}

export async function postBenutzerVerify(email: string, code: string): Promise<void> {
    const url = `${import.meta.env.VITE_API_SERVER_URL}/api/benutzer/verify`;

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "token": localStorage.getItem("token") || "null"
        },
        body: JSON.stringify({ email, code }),
        credentials: "include" as RequestCredentials,
    });

    if (response.ok) {
        return;
    }

    if (response.status === 400) {
        const errorMessage = await response.text();
        throw new Error(errorMessage);
    }

    throw new Error(`Error connecting to ${import.meta.env.VITE_API_SERVER_URL}: ${response.statusText}`);
}

// **********************************Buchungskategorie Router**********************************
export async function getAlleKategorien(): Promise<BuchungskategorieResource[]> {
    // Fetch-Call, um die Daten von unserem Server zu laden. 
    const res = await fetch(`${import.meta.env.VITE_API_SERVER_URL}/api/buchungskategorie/alleKategorien`, { 
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "token": localStorage.getItem("token") || "null"
        },
        credentials: "include" as RequestCredentials })
    if (!res.ok) {
        throw new Error("response error");
    }
    return await res.json();
    // }
}


export async function getAlleStandardKategorien(): Promise<BuchungskategorieResource[]> {
    const url = `${import.meta.env.VITE_API_SERVER_URL}/api/buchungskategorie/alleStandardKategorien`;

    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "token": localStorage.getItem("token") || "null"

        },
        credentials: "include" as RequestCredentials
    });

    if (!response.ok) {
        throw new Error("Failed to fetch standard categories");
    }
    return await response.json();
}

export async function getAlleEigeneKategorien(): Promise<BuchungskategorieResource[]> {
    const url = `${import.meta.env.VITE_API_SERVER_URL}/api/buchungskategorie/alleEigeneKategorien`;

    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "token": localStorage.getItem("token") || "null"
        },
        credentials: "include" as RequestCredentials
    });

    if (!response.ok) {
        throw new Error("Failed to fetch own categories");
    }
    return await response.json();
}


// Fetch a specific booking category by ID
export async function getBuchungskategorieById(id: string): Promise<BuchungskategorieResource> {
    const url = `${import.meta.env.VITE_API_SERVER_URL}/api/buchungskategorie/${id}`;

    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "token": localStorage.getItem("token") || "null"
        },
        credentials: "include" as RequestCredentials
    });

    if (!response.ok) {
        if (response.status === 404) {
            throw new Error(`Buchungskategorie with ID ${id} not found`);
        }
        const errorMsg = await response.text();
        throw new Error(`Error fetching buchungskategorie: ${response.status} ${errorMsg}`);
    }
    return await response.json();
}


export async function postBuchungskategorie(name: string, benutzer: string, ausgabenlimit?: number): Promise<BuchungskategorieResource> {
    const url = `${import.meta.env.VITE_API_SERVER_URL}/api/buchungskategorie`;

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "token": localStorage.getItem("token") || "null"
        },
        credentials: "include" as RequestCredentials,
        body: JSON.stringify({
            name,
            benutzer,
            ausgabenlimit
        })
    });

    if (!response.ok) {

        throw new Error("Buchungskategorie kann nicht erstellt werden!");
    }
    return await response.json();
}


export async function updateBuchungskategorie(id: string, name?: string, ausgabenlimit?: number): Promise<BuchungskategorieResource> {
    const url = `${import.meta.env.VITE_API_SERVER_URL}/api/buchungskategorie/${id}`;

    const response = await fetch(url, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "token": localStorage.getItem("token") || "null"
        },
        credentials: "include" as RequestCredentials,
        body: JSON.stringify({
            name,
            ausgabenlimit
        })
    });

    if (!response.ok) {
        throw new Error("Buchungskategorie kann nicht aktualisiert werden!");
    }

    return await response.json();
}

export async function deleteBuchungskategorie(kategorieId: string): Promise<void> {
    const url = `${import.meta.env.VITE_API_SERVER_URL}/api/buchungskategorie/${kategorieId}`;
    const response = await fetch(url, { method: "DELETE", 
        headers: {
            "Content-Type": "application/json",
            "token": localStorage.getItem("token") || "null"
        },
        credentials: "include" as RequestCredentials });
    if (response.ok) {
        return;
    }
    if (response.status === 404) {
        throw new Error("Buchungskategorie nicht gefunden");
    }
    throw new Error(`Error deleting buchungskategorie, status: ${response.status}`);
}




/*************************** Statistik ************************* */




/********************* Sparziele ************************** */

export async function getAlleSparziele(): Promise<SparzielResource[]> {
    const url = `${import.meta.env.VITE_API_SERVER_URL}/api/sparziel/alle`;

    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "token": localStorage.getItem("token") || "null"
        },
        credentials: "include" as RequestCredentials
    });

    if (!response.ok) {
        throw new Error("Failed to fetch all savings goals");
    }

    return await response.json();
}

export async function getSparziel(id: string): Promise<any> {
    const url = `${import.meta.env.VITE_API_SERVER_URL}/api/sparziel/${id}`;

    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "token": localStorage.getItem("token") || "null"
        },
        credentials: "include" as RequestCredentials
    });

    if (!response.ok) {
        throw new Error("Failed to fetch savings goal");
    }

    return await response.json();
}

export async function postSparziel(name: string, benutzer: string, betrag: number, zielbetrag: number, faelligkeitsdatum?: string, notiz?: string): Promise<SparzielResource> {
    const url = `${import.meta.env.VITE_API_SERVER_URL}/api/sparziel/`;

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "token": localStorage.getItem("token") || "null"
        },
        body: JSON.stringify({ name, benutzer, betrag, zielbetrag, faelligkeitsdatum, notiz }),
        credentials: "include" as RequestCredentials,
    });

    if (!response.ok) {

        throw new Error("Sparziel kann nicht erstellt werden!");
    }

    return await response.json();
}


export async function updateSparziel(id: string, name?: string, benutzer?: string, betrag?: number, zielbetrag?: number, faelligkeitsdatum?: string, notiz?: string): Promise<SparzielResource> {
    const url = `${import.meta.env.VITE_API_SERVER_URL}/api/sparziel/${id}`;

    const response = await fetch(url, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "token": localStorage.getItem("token") || "null"
        },
        body: JSON.stringify({ name, benutzer, betrag, zielbetrag, faelligkeitsdatum, notiz }),
        credentials: "include" as RequestCredentials,
    });

    if (!response.ok) {

        throw new Error("Sparziel kann nicht geupgradet werden!");
    }

    return await response.json();
}

export async function deleteSparziel(sparzielId: string) {
    const url = `${import.meta.env.VITE_API_SERVER_URL}/api/sparziel/${sparzielId}`;

    const response = await fetch(url, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "token": localStorage.getItem("token") || "null"
        },
        credentials: "include" as RequestCredentials
    });

    if (response.ok) {
        return;
    }
    throw new Error("Sparziel kann nicht gelöscht werden!");


    return await response.json();
}

// Fetch the number of days until the due date for a specific sparziel
export async function getFaelligkeitTageById(id: string): Promise<number | null> {
    const url = `${import.meta.env.VITE_API_SERVER_URL}/api/sparziel/${id}/faelligkeitTage`;

    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "token": localStorage.getItem("token") || "null"
        },
        credentials: "include" as RequestCredentials
    });

    if (!response.ok) {
        if (response.status === 404) {
            throw new Error(`Sparziel with ID ${id} not found`);
        }
        const errorMsg = await response.text();
        throw new Error(`Error fetching faelligkeitTage: ${response.status} ${errorMsg}`);
    }
    const result = await response.json();
    return result.value;
}


// **********************************Scanner Router**********************************

// Create a booking from an image
export async function createBuchungFromImg(userId: string, image: File): Promise<BuchungResource> {
    const url = `${import.meta.env.VITE_API_SERVER_URL}/api/buchung/upload`;

    //FormData, um die Datei als Anhang zu senden
    const formData = new FormData();
    formData.append("userId", userId);
    formData.append("image", image);

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "token": localStorage.getItem("token") || "null"
        },
        body: formData,
        credentials: "include" as RequestCredentials
    });

    if (!response.ok) {
        const errorMsg = await response.text();
        if (response.status === 404) {
            if (errorMsg.includes('Benutzer nicht gefunden.')) {
                throw new Error('Benutzer nicht gefunden.');
            }
            if (errorMsg.includes('Keine Kategorien gefunden.')) {
                throw new Error('Keine Kategorien gefunden.');
            }
            if (errorMsg.includes('Pocket nicht gefunden.')) {
                throw new Error('Pocket nicht gefunden.');
            }
        }
        throw new Error('Error creating buchung from image: ${response.status} ${errorMsg}');
    }

    return await response.json();
}

// *****************************************************Benutzer Router***********************************************************

// Fetch a specific user by ID
export async function getBenutzer(id: string): Promise<BenutzerResource> {
    const url = `${import.meta.env.VITE_API_SERVER_URL}/api/benutzer/${id}`;
    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "token": localStorage.getItem("token") || "null"
        },
        credentials: "include" as RequestCredentials
    });
    if (!response.ok) {
        throw new Error(`Failed to fetch user with ID ${id}`);
    }
    return await response.json();
}

// Delete a specific user by ID
export async function deleteBenutzer(id: string): Promise<void> {
    const url = `${import.meta.env.VITE_API_SERVER_URL}/api/benutzer/${id}`;
    const response = await fetch(url, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "token": localStorage.getItem("token") || "null"
        },
        credentials: "include" as RequestCredentials
    });
    if (!response.ok) {
        throw new Error(`Failed to delete user with ID ${id}`);
    }
}

// Update a user
export async function updateBenutzer(id: string, data: Partial<BenutzerResource>): Promise<BenutzerResource> {
    const url = `${import.meta.env.VITE_API_SERVER_URL}/api/benutzer/${id}`;
    const response = await fetch(url, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "token": localStorage.getItem("token") || "null"
        },
        body: JSON.stringify(data),
        credentials: "include" as RequestCredentials
    });
    if (!response.ok) {
        throw new Error(`Failed to update user with ID ${id}`);
    }
    return await response.json();
}

// Fetch all future bookings
export async function getAlleZukunftBuchungen(): Promise<BuchungResource[]> {
    const url = `${import.meta.env.VITE_API_SERVER_URL}/api/buchung/alleZukunft`;
    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "token": localStorage.getItem("token") || "null"
        },
        credentials: "include" as RequestCredentials
    });
    if (!response.ok) {
        throw new Error("Failed to fetch future bookings");
    }
    return await response.json();
}

// Execute a future booking
export async function zukunftBuchungAusfuehren(id: string): Promise<void> {
    const url = `${import.meta.env.VITE_API_SERVER_URL}/api/buchung/zukunftAusfuehren/${id}`;
    const response = await fetch(url, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "token": localStorage.getItem("token") || "null"
        },
        credentials: "include" as RequestCredentials
    });
    if (!response.ok) {
        throw new Error(`Failed to execute future booking with ID ${id}`);
    }
}

// Check if limit is reached when a booking is added
export async function isLimitReachedIfBuchungAdded(kategoryId: string, betrag: number): Promise<{ limitReached: boolean }> {
    const url = `${import.meta.env.VITE_API_SERVER_URL}/api/limit/limitReached/${kategoryId}/${betrag}`;
    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "token": localStorage.getItem("token") || "null"
        },
        credentials: "include" as RequestCredentials
    });
    if (!response.ok) {
        throw new Error("Failed to check if limit is reached");
    }
    return await response.json();
}

// **********************************Mitteilungen Router*************************************

// Fetch all notifications
export async function fetchAllNotifications(): Promise<any> {
    const url = `${import.meta.env.VITE_API_SERVER_URL}/api/notification/allNotifs`;
    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "token": localStorage.getItem("token") || "null"
        },
        credentials: "include" as RequestCredentials
    });
    if (!response.ok) {
        throw new Error("Failed to fetch all notifications");
    }
    return await response.json();
}

// Fetch all unread notifications
export async function fetchUnreadNotifications(): Promise<any> {
    const url = `${import.meta.env.VITE_API_SERVER_URL}/api/notification/unreadNotifs`;
    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "token": localStorage.getItem("token") || "null"
        },
        credentials: "include" as RequestCredentials
    });
    if (!response.ok) {
        throw new Error("Failed to fetch unread notifications");
    }
    return await response.json();
}

// Mark all notifications as read
export async function markAllNotificationsAsRead(): Promise<any> {
    const url = `${import.meta.env.VITE_API_SERVER_URL}/api/notification/readAllNotifs`;
    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "token": localStorage.getItem("token") || "null"
        },
        credentials: "include" as RequestCredentials
    });
    if (!response.ok) {
        throw new Error("Failed to mark all notifications as read");
    }
    return await response.json();
}

// Mark a single notification as read
export async function markNotificationAsRead(notificationId: string): Promise<any> {
    const url = `${import.meta.env.VITE_API_SERVER_URL}/api/notification/readNotif/${notificationId}`;
    const response = await fetch(url, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "token": localStorage.getItem("token") || "null"
        },
        credentials: "include" as RequestCredentials
    });
    if (!response.ok) {
        throw new Error(`Failed to mark notification ${notificationId} as read`);
    }
    return await response.json();
}
