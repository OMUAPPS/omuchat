import { writable, type Writable } from "svelte/store";

interface Theme {
    [key: string]: string;
}

const theme1: Theme = {
    "--color-bg-1": "#f6f3eb",
    "--color-bg-2": "#fffefc",
    "--color-1": "#0b6f72",
    "--color-2": "#35dfe1",
    "--color-text": "#444",
    "--color-outline": "rgba(0, 0, 0, 0.1)",
    "--margin": "10px",
}

const theme2: Theme = {
    "--color-bg-1": "#f0f0f0",
    "--color-bg-2": "#fffefc",
    // "--color-1": "#404040",
    "--color-1": "#0b6f72",
    "--color-2": "#35dfe1",
    "--color-text": "#444",
    "--color-outline": "rgba(0, 0, 0, 0.1)",
    "--margin": "10px",
}

const theme3: Theme = {
    "--color-bg-1": "#fafafa",
    "--color-bg-2": "#fffefc",
    "--color-1": "#242424",
    "--color-2": "#35dfe1",
    "--color-text": "#444",
    "--color-outline": "rgba(0, 0, 0, 0.1)",
    "--margin": "10px",
}

const theme4: Theme = {
    "--color-bg-1": "#bfbfbf",
    "--color-bg-2": "#e3e3e3",
    "--color-1": "#242424",
    "--color-2": "#f5f5f5",
    "--color-text": "#595959",
    "--color-outline": "rgba(0, 0, 0, 0.1)",
    "--margin": "10px",
}

export const themes: Theme[] = [theme1, theme2, theme3, theme4];
export const theme: Writable<Theme> = writable(theme1);