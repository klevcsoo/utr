# Specifikáció frissítése

Az **utr-api-spec.yaml** fájl frissítése esetén szükséges az **utr-api-spec.md** frissítése.
Ezt a fejlesztői eszközön hajtsuk végre és szükséges hozzá `node` és `npm`.

**Nagyon fontos!**
Az **utr-api-spec.yaml** ha módosítunk valamit, mindig frissítsük a verziót a jelenlegi aktív
verzióra amin dolgozunk (az aktív jegynek a mérföldköve), nem a legutóbbi kiadott verzióra ami a
**pom.xml**-ben van.

### Telepítés

Ha még nem lenne telepítve a konvertáló npm csomag.

```shell
npm install -g widdershins
```

### Használat

Navigáljunk ebbe a mabbába _(utr/utr-api/spec/)_.

```shell
widdershins utr-api-spec.yaml -o utr-api-spec.md --language_tabs
```
