# Projekthinweise für die Mobil-App

## Zwei getrennte App-Ordner

- `Mobileansicht/` enthält die Mobil-App für die mobile Ansicht.
- `Webansicht/` enthält die Web-App für die Desktop-/Webansicht und liegt im benachbarten Ordner `../Webansicht/`.
- Beide Apps sind eigenständige Oberflächen in getrennten Ordnern und verwenden dasselbe Supabase-Projekt `xflljuscywgxfhzdtaju` (MAG Sursee RapportApp).
- Bei Änderungen immer prüfen, ob die Mobil-App, die Web-App oder beide betroffen sind. Gemeinsame Funktionen und Datenbankänderungen müssen mit beiden Apps kompatibel bleiben; Anpassungen in beiden betroffenen Ordnern umsetzen.
- Die Hinweise in `../AGENTS.md` und bei Änderungen an der Web-App zusätzlich `../Webansicht/AGENTS.md` beachten.

## Verbindlicher Datenerhalt

- **Es dürfen keine bestehenden Daten in Supabase gelöscht werden**, auch nicht indirekt durch App-Code, Trigger, RPCs oder kaskadierende Löschungen.
- Keine `DELETE`-/`TRUNCATE`-Operationen auf bestehenden Daten ausführen.
- Keine Tabellen, Schemas oder Spalten mit bestehenden Daten entfernen; keine Datenbank-Resets oder destruktiven Migrationen ausführen.
- Bestehende Auth-Benutzer und ihre zugehörigen Daten erhalten.
- Änderungen an App und Datenbankschema müssen bestehende Daten vollständig erhalten. Vor der Ausführung Migrationen und ihre indirekten Auswirkungen auf Datenverlust prüfen.
- Eine allgemeine Umbau-, Bereinigungs- oder Migrationsanweisung hebt das Löschverbot nicht auf.
