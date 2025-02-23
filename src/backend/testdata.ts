import { BenutzerResource, BuchungResource, BuchungskategorieResource, PocketResource, SparzielResource } from "../Resources";

export const benutzer: BenutzerResource[] = [
    {
        id: "301",
        name: "Thomas Mann",
        email: "thomas.mann@example.com",
        password: "securePassword123"
    },
    {
        id: "302",
        name: "Hermann Hesse",
        email: "hermann.hesse@example.com"
    }
];

export const pockets: PocketResource[] = [
    {
        id: "401",
        name: "Bargeld",
        benutzer: "301",
        notiz: "Ich bin echt reich!",
        betrag: 500
    },
    {
        id: "402",
        name: "Deutsche Bank",
        benutzer: "302",
        betrag: 1000
    }
];

export const sparziele: SparzielResource[] = [
    {
        id: "501",
        name: "Neuer Laptop",
        benutzer: "301",
        notiz: "MacBook Pro",
        betrag: 300,
        zielbetrag: 1500,
        faelligkeitsdatum: "01.12.2024"
    },
    {
        id: "502",
        name: "Sommerurlaub",
        benutzer: "302",
        betrag: 700,
        zielbetrag: 2000
    }
];

export const buchungskategorien: BuchungskategorieResource[] = [
    {
        id: "601",
        name: "Lebensmittel",
        benutzer: "301",
        ausgabenlimit: 300
    },
    {
        id: "602",
        name: "Freizeit",
        benutzer: "302",
        ausgabenlimit: 150
    }
];

export const buchungen: BuchungResource[] = [
    {
        id: "701",
        name: "Restaurantbesuch",
        pocket: "401",
        kategorie: "601",
        datum: "05.10.2023",
        betrag: 50,
        typ: "Ausgabe"
    },
    {
        id: "702",
        name: "Monatliches Sparen",
        pocket: "402",
        kategorie: "602",
        datum: "01.10.2023",
        betrag: 200,
        typ: "Einnahme",
        intervall: "monatlich",
        zielPocket: "501"
    }
];
