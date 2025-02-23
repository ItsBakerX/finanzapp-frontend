export async function getEinahmenMonat(): Promise<number> {
    const url = `${import.meta.env.VITE_API_SERVER_URL}/api/statistik/einnahmenMonat`;

    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "token": localStorage.getItem("token") || ""
        },
        credentials: "include" as RequestCredentials
    });

    if (!response.ok) {
        throw new Error("Failed to fetch monthly income");
    }
    const data = await response.json();
    return data.value;
}

export async function getAusgabenMonat(): Promise<number> {
    const url = `${import.meta.env.VITE_API_SERVER_URL}/api/statistik/ausgabenMonat`;

    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "token": localStorage.getItem("token") || ""
        },
        credentials: "include" as RequestCredentials
    });

    if (!response.ok) {
        throw new Error("Failed to fetch monthly expenses");
    }
    const data = await response.json();
    return data.value;
}

export async function getEinnahmenWoche(): Promise<number> {
    const url = `${import.meta.env.VITE_API_SERVER_URL}/api/statistik/einnahmenWoche`;

    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "token": localStorage.getItem("token") || ""
        },
        credentials: "include" as RequestCredentials
    });

    if (!response.ok) {
        throw new Error("Failed to fetch weekly income");
    }
    const data = await response.json();
    return data.value;
}

export async function getAusgabenWoche(): Promise<number> {
    const url = `${import.meta.env.VITE_API_SERVER_URL}/api/statistik/ausgabenWoche`;

    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "token": localStorage.getItem("token") || ""
        },
        credentials: "include" as RequestCredentials
    });

    if (!response.ok) {
        throw new Error("Failed to fetch weekly expenses");
    }
    const data = await response.json();
    return data.value;
}

export async function getEinnahmenJahr(): Promise<number> {
    const url = `${import.meta.env.VITE_API_SERVER_URL}/api/statistik/einnahmenJahr`;

    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "token": localStorage.getItem("token") || ""
        },
        credentials: "include" as RequestCredentials
    });

    if (!response.ok) {
        throw new Error("Failed to fetch yearly income");
    }
    const data = await response.json();
    return data.value;
}

export async function getAusgabenJahr(): Promise<number> {
    const url = `${import.meta.env.VITE_API_SERVER_URL}/api/statistik/ausgabenJahr`;

    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "token": localStorage.getItem("token") || ""
        },
        credentials: "include" as RequestCredentials
    });

    if (!response.ok) {
        throw new Error("Failed to fetch yearly expenses");
    }
    const data = await response.json();
    return data.value;
}

export async function getAlleEinnahmen(): Promise<number> {
    const url = `${import.meta.env.VITE_API_SERVER_URL}/api/statistik/alleEinnahmen`;

    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "token": localStorage.getItem("token") || ""
        },
        credentials: "include" as RequestCredentials
    });

    if (!response.ok) {
        throw new Error("Failed to fetch all income");
    }
    const data = await response.json();
    return data.value;
}

export async function getAlleAusgaben(): Promise<number> {
    const url = `${import.meta.env.VITE_API_SERVER_URL}/api/statistik/alleAusgaben`;

    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "token": localStorage.getItem("token") || ""
        },
        credentials: "include" as RequestCredentials
    });

    if (!response.ok) {
        throw new Error("Failed to fetch all expenses");
    }
    const data = await response.json();
    return data.value;
}

// Fetch the percentage share of all pockets in the total assets
export async function getPocketProzente(): Promise<Map<string, number>> {
    const url = `${import.meta.env.VITE_API_SERVER_URL}/api/statistik/pocketProzent`;

    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "token": localStorage.getItem("token") || ""
        },
        credentials: "include" as RequestCredentials
    });

    if (!response.ok) {
        throw new Error("Failed to fetch pocket percentages");
    }

    const data = await response.json();
    return new Map(Object.entries(data));
}

// Fetch weekly expenses
export async function getWochenAusgaben(): Promise<{ wochen: any, values: any }> {
    const url = `${import.meta.env.VITE_API_SERVER_URL}/api/statistik/wochenAusgaben`;

    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "token": localStorage.getItem("token") || ""
        },
        credentials: "include" as RequestCredentials
    });

    if (!response.ok) {
        throw new Error("Failed to fetch weekly expenses");
    }

    return await response.json();
}

// Fetch monthly expenses
export async function getMonateAusgaben(): Promise<{ wochen: any, values: any }> {
    const url = `${import.meta.env.VITE_API_SERVER_URL}/api/statistik/monateAusgaben`;

    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "token": localStorage.getItem("token") || ""
        },
        credentials: "include" as RequestCredentials
    });

    if (!response.ok) {
        throw new Error("Failed to fetch monthly expenses");
    }

    return await response.json();
}

// Fetch yearly expenses
export async function getJahreAusgaben(): Promise<{ wochen: any, values: any }> {
    const url = `${import.meta.env.VITE_API_SERVER_URL}/api/statistik/JahreAusgaben`;

    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "token": localStorage.getItem("token") || ""
        },
        credentials: "include" as RequestCredentials
    });

    if (!response.ok) {
        throw new Error("Failed to fetch yearly expenses");
    }

    return await response.json();
}


export async function getAnzahlBuchungen(): Promise<Map<string, number>> {
    const url = `${import.meta.env.VITE_API_SERVER_URL}/api/statistik/anzahlBuchungen`;

    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "token": localStorage.getItem("token") || ""
        },
        credentials: "include" as RequestCredentials
    });

    if (!response.ok) {
        throw new Error("Failed to fetch the number of bookings");
    }

    const data = await response.json();
    return new Map(Object.entries(data));
}

export async function getGesamtvermoegen(): Promise<number> {
    const url = `${import.meta.env.VITE_API_SERVER_URL}/api/statistik/gesamtvermoegen`;

    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "token": localStorage.getItem("token") || ""
        },
        credentials: "include" as RequestCredentials
    });

    if (!response.ok) {
        throw new Error("Failed to fetch total assets");
    }

    const data = await response.json();
    return data.value;
}


// Fetch weekly expenses by category
export async function getKategorieAusgabenWoche(): Promise<Map<string, number>> {
    const url = `${import.meta.env.VITE_API_SERVER_URL}/api/statistik/kategorieAusgaben/woche`;

    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "token": localStorage.getItem("token") || ""
        },
        credentials: "include" as RequestCredentials
    });

    if (!response.ok) {
        throw new Error("Failed to fetch weekly expenses");
    }

    const data =  await response.json();
    return new Map(Object.entries(data));
}

// Fetch monthly expenses by category
export async function getKategorieAusgabenMonat(): Promise<Map<string, number>> {
    const url = `${import.meta.env.VITE_API_SERVER_URL}/api/statistik/kategorieAusgaben/monat`;

    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "token": localStorage.getItem("token") || ""
        },
        credentials: "include" as RequestCredentials

    });

    if (!response.ok) {
        throw new Error("Failed to fetch monthly expenses by category");
    }

    const data = await response.json();
    return new Map(Object.entries(data));
}

// Fetch yearly expenses by category
export async function getKategorieAusgabenJahr(): Promise<Map<string, number>> {
    const url = `${import.meta.env.VITE_API_SERVER_URL}/api/statistik/kategorieAusgaben/jahr`;

    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "token": localStorage.getItem("token") || ""
        },
                credentials: "include" as RequestCredentials

    });

    if (!response.ok) {
        throw new Error("Failed to fetch yearly expenses by category");
    }

    const data = await response.json();
    return new Map(Object.entries(data));
}

export async function getKategorieLimitAusgaben(): Promise<Map<string,[number, number | null]>> {
    const url = `${import.meta.env.VITE_API_SERVER_URL}/api/statistik/kategorieLimitAusgaben`;

    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "token": localStorage.getItem("token") || ""
        },
        credentials: "include" as RequestCredentials
    });

    if (!response.ok) {
        throw new Error("Failed to fetch category limit expenses");
    }

    const data = await response.json();
    return new Map(Object.entries(data));
}


export async function getOutcomeTowardsLimitMonthly(kategoryId: string): Promise<number> {
    const url = `${import.meta.env.VITE_API_SERVER_URL}/api/limit/progress/${kategoryId}`;

    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "token": localStorage.getItem("token") || ""
        },
        credentials: "include" as RequestCredentials
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch progress for category ID ${kategoryId}`);
    }

    const data = await response.json();
    return data.progress;
}

export async function getOutcomeTowardsLimitMonthlyAllCategories(): Promise<{kategorie: string, progress: number}[]> {
    const url = `${import.meta.env.VITE_API_SERVER_URL}/api/limit/progress/all`;

    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "token": localStorage.getItem("token") || ""
        },
        credentials: "include" as RequestCredentials
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch progress for all categories: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
}

export async function isLimitReached(kategoryId: string): Promise<boolean> {
    const url = `${import.meta.env.VITE_API_SERVER_URL}/api/limit/limitReached/${kategoryId}`;

    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "token": localStorage.getItem("token") || ""
        },
        credentials: "include" as RequestCredentials
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch limit status for category ID ${kategoryId}`);
    }

    const data = await response.json();
    return data.limitReached;
}