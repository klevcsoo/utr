# Úszóverseny Támogató Rendszer

> A projektnek az a szála, amely a DE-IK Webfejlesztés tárgyhoz beandandó projektként készült, a [`feature/deik-webfejlesztes`](https://github.com/klevcsoo/utr/tree/feature/deik-webfejlesztes) branchen található meg.

 - **/utr-api:** Java Spring Boot API szerver ([dokumentáció](utr-api/spec/utr-api-spec.md))
 - **/utr-client:** Typescript React kliens
 - **/utr-system:** Python szkriptek a PI rendszeréhez

## Környezeti változók

### utr-api

 - **`UTR_SERVER_TIMEZONE`** (kötelező): az szerver időzónája, Magyarországon ez `Europe/Budapest`.
    - Típus: szöveg
 - **`UTR_JWT_SECRET`**: a JWT titkos kulcs ami hitelesítéshez van használva. **Dinamikusan generálja az utr-system modul, manuálisan ne töltsd!**
    - Típus: szöveg
    - Alapértelmezett érték: automatikusan töltött

### utr-client

 - **`REACT_APP_UTR_SERVER_HREF`** (kötelező): az API szervernek a címe protokollal, és porttal együtt. Például: `http://localhost:8080`
    - Típus: szöveg
 - **`REACT_APP_LOCALHOST_API_DELAY`**: szabályozza, hogy a kliens szimulálja-e az API requestek késését fejlesztői környezeten. Abban az esetben, ha nem `localhost` a host címe, ez a változó nem csinál semmit.
    - Típus: boolean (szöveg: "true" vagy "false")
    - Alapértelmezett érték: true
 - **`REACT_APP_PACKAGE_VERSION`**: a Node csomagnak a jelenlegi verzója, mely megegyezik a projekt jelenlegi verzójával. Ezen keresztül kapja meg a kliens az app verziót. **Automatikusan tölti a `.env` fájl, manuálisan ne töltsd!**
    - Típus: szöveg
    - Alapértelmezett érték: automatikusan töltött
 - **`REACT_APP_API_POLLING_RATE_MS`**: szabályozza, hogy milyen időközönként frissítsen rá a meglévő adatokra ezredmásodpercekben a kliens. **Tervek szerint 0.5.0-alpha verzióban kivezetésre kerül.**
    - Típus: szám
    - Alapértelmezett érték: 2000
