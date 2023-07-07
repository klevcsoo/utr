# Specifikáció frissítése

Az **utr-api-spec.yaml** fájl frissítése esetén szükséges az **utr-api-spec.md** frissítése.
Ezt a fejlesztői eszközön hajtsuk végre és szükséges hozzá `node` és `npm`.

**Nagyon fontos!**
Az **utr-api-spec.yaml** ha módosítunk valamit, mindig frissítsük a verziót az **utr-api** Maven
modul pom.xml-ben található verziójával.
Ha nem változik a specifikáció akkor nem kell, de ha igen, akkor mindig a jelenlegi verzióra
frissüljön a YAML fájl.

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
