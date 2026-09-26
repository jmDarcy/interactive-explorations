// Wspólne zachowanie strony apletu, zależne od wpisu w rejestrze.

import { APPLETS, DOMAINS } from "../applets/registry.js";

/**
 * Uzupełnia elementy zależne od rejestru:
 * - [data-notes-link] dostaje href z notesUrl albo jest usuwany, gdy notesUrl === null.
 * Zwraca { applet, domain } (lub undefined, gdy id nie ma w rejestrze).
 */
export function initAppletPage(id) {
  const applet = APPLETS.find((a) => a.id === id);
  if (!applet) {
    console.warn(`Aplet „${id}” nie jest wpisany do applets/registry.json.`);
    return undefined;
  }

  document.querySelectorAll("[data-notes-link]").forEach((link) => {
    if (applet.notesUrl) {
      link.href = applet.notesUrl;
      link.hidden = false;
    } else {
      link.remove();
    }
  });

  return { applet, domain: DOMAINS[applet.domain] };
}
