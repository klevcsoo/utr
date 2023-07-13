---
title: UTR API v0.3.0-alpha
language_tabs: []
language_clients: []
toc_footers: []
includes: []
search: true
highlight_theme: darkula
headingLevel: 2

---

<!-- Generator: Widdershins v4.0.1 -->

<h1 id="utr-api">UTR API v0.3.0-alpha</h1>

> Scroll down for example requests and responses.

Úszóverseny támogató rendszer API

Base URLs:

* <a href="https://utr.hu">https://utr.hu</a>

* <a href="http://localhost:8080">http://localhost:8080</a>

<h1 id="utr-api-default">Default</h1>

## listRoles

<a id="opIdlistRoles"></a>

> Code samples

`GET /api/auth/list-roles`

*GET api/auth/list-roles*

> Example responses

> 200 Response

<h3 id="listroles-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|

<h3 id="listroles-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|*anonymous*|[[Role](#schemarole)]|false|none|none|
|» id|integer(int32)|false|none|none|
|» name|string|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|name|ROLE_ADMIN|
|name|ROLE_IDOROGZITO|
|name|ROLE_ALLITOBIRO|
|name|ROLE_SPEAKER|

<aside class="success">
This operation does not require authentication
</aside>

## listUsers

<a id="opIdlistUsers"></a>

> Code samples

`GET /api/auth/list-users`

*GET api/auth/list-users*

> Example responses

> 200 Response

<h3 id="listusers-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|

<h3 id="listusers-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|*anonymous*|[[User](#schemauser)]|false|none|none|
|» id|integer(int64)|false|none|none|
|» username|string|false|none|none|
|» displayName|string|false|none|none|
|» password|string|false|none|none|
|» roles|[[Role](#schemarole)]|false|none|none|
|»» id|integer(int32)|false|none|none|
|»» name|string|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|name|ROLE_ADMIN|
|name|ROLE_IDOROGZITO|
|name|ROLE_ALLITOBIRO|
|name|ROLE_SPEAKER|

<aside class="success">
This operation does not require authentication
</aside>

## changeUserDisplayName

<a id="opIdchangeUserDisplayName"></a>

> Code samples

`POST /api/auth/change-display-name`

*POST api/auth/change-display-name*

<h3 id="changeuserdisplayname-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|userId|query|integer(int64)|true|none|
|displayName|query|string|true|none|

> Example responses

> 200 Response

<h3 id="changeuserdisplayname-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[MessageResponse](#schemamessageresponse)|

<aside class="success">
This operation does not require authentication
</aside>

## changeUserPassword

<a id="opIdchangeUserPassword"></a>

> Code samples

`POST /api/auth/change-password`

*POST api/auth/change-password*

> Body parameter

```json
{
  "userId": 0,
  "oldPassword": "string",
  "newPassword": "string"
}
```

<h3 id="changeuserpassword-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[ChangePasswordRequest](#schemachangepasswordrequest)|true|none|

> Example responses

> 200 Response

<h3 id="changeuserpassword-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[MessageResponse](#schemamessageresponse)|

<aside class="success">
This operation does not require authentication
</aside>

## changeUserRoles

<a id="opIdchangeUserRoles"></a>

> Code samples

`POST /api/auth/change-roles`

*POST api/auth/change-roles*

<h3 id="changeuserroles-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|userId|query|integer(int64)|true|none|
|role|query|array[string]|true|none|

> Example responses

> 200 Response

<h3 id="changeuserroles-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[MessageResponse](#schemamessageresponse)|

<aside class="success">
This operation does not require authentication
</aside>

## deleteUser

<a id="opIddeleteUser"></a>

> Code samples

`POST /api/auth/delete-user`

*POST api/auth/delete-user*

<h3 id="deleteuser-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|userId|query|integer(int64)|true|none|

> Example responses

> 200 Response

<h3 id="deleteuser-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[MessageResponse](#schemamessageresponse)|

<aside class="success">
This operation does not require authentication
</aside>

<h1 id="utr-api-hiteles-t-s">Hitelesítés</h1>

## authenticateUser

<a id="opIdauthenticateUser"></a>

> Code samples

`POST /api/auth/login`

*Felhasználói bejelentkezés*

> Body parameter

```json
{
  "username": "string",
  "password": "string"
}
```

<h3 id="authenticateuser-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[LoginRequest](#schemaloginrequest)|true|none|

> Example responses

> 200 Response

<h3 id="authenticateuser-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[JwtResponse](#schemajwtresponse)|

<aside class="success">
This operation does not require authentication
</aside>

## registerUser

<a id="opIdregisterUser"></a>

> Code samples

`POST /api/auth/new-user`

*Új felhasználó létrehozása*

> Body parameter

```json
{
  "username": "string",
  "displayName": "string",
  "role": [
    "string"
  ],
  "password": "string"
}
```

<h3 id="registeruser-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[NewUserRequest](#schemanewuserrequest)|true|none|

> Example responses

> 200 Response

<h3 id="registeruser-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[MessageResponse](#schemamessageresponse)|

<aside class="success">
This operation does not require authentication
</aside>

<h1 id="utr-api-hiteles-t-s-tesztel-s">Hitelesítés tesztelés</h1>

## adminAccess

<a id="opIdadminAccess"></a>

> Code samples

`GET /api/test/admin`

*Admin hitelesítési teszt*

> Example responses

> 200 Response

<h3 id="adminaccess-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|string|

<aside class="success">
This operation does not require authentication
</aside>

## allAccess

<a id="opIdallAccess"></a>

> Code samples

`GET /api/test/all`

*Nyitott hitelesítési teszt*

> Example responses

> 200 Response

<h3 id="allaccess-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|string|

<aside class="success">
This operation does not require authentication
</aside>

## allitobiroAccess

<a id="opIdallitobiroAccess"></a>

> Code samples

`GET /api/test/allitobiro`

*Állítóbíró hitelesítési teszt*

> Example responses

> 200 Response

<h3 id="allitobiroaccess-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|string|

<aside class="success">
This operation does not require authentication
</aside>

## idorogzitoAccess

<a id="opIdidorogzitoAccess"></a>

> Code samples

`GET /api/test/idorogzito`

*Időrögzítő hitelesítési teszt*

> Example responses

> 200 Response

<h3 id="idorogzitoaccess-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|string|

<aside class="success">
This operation does not require authentication
</aside>

## speakerAccess

<a id="opIdspeakerAccess"></a>

> Code samples

`GET /api/test/speaker`

*Speaker hitelesítési teszt*

> Example responses

> 200 Response

<h3 id="speakeraccess-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|string|

<aside class="success">
This operation does not require authentication
</aside>

<h1 id="utr-api-csapatok">Csapatok</h1>

## getAllCsapatok

<a id="opIdgetAllCsapatok"></a>

> Code samples

`GET /api/csapatok/`

*Összes csapat lekérdezése*

> Example responses

> 200 Response

<h3 id="getallcsapatok-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|

<h3 id="getallcsapatok-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|*anonymous*|[[Csapat](#schemacsapat)]|false|none|none|
|» id|integer(int64)|false|none|none|
|» nev|string|false|none|none|
|» varos|string|false|none|none|

<aside class="success">
This operation does not require authentication
</aside>

## createCsapat

<a id="opIdcreateCsapat"></a>

> Code samples

`PUT /api/csapatok/`

*Új csapat létrehozása*

<h3 id="createcsapat-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|nev|query|string|true|none|
|varos|query|string|false|none|

> Example responses

> 200 Response

<h3 id="createcsapat-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[MessageResponse](#schemamessageresponse)|

<aside class="success">
This operation does not require authentication
</aside>

## getCsapat

<a id="opIdgetCsapat"></a>

> Code samples

`GET /api/csapatok/{id}`

*Csapat lekérdezése azonosító alapján*

<h3 id="getcsapat-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|integer(int64)|true|none|

> Example responses

> 200 Response

<h3 id="getcsapat-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[Csapat](#schemacsapat)|

<aside class="success">
This operation does not require authentication
</aside>

## editCsapat

<a id="opIdeditCsapat"></a>

> Code samples

`PATCH /api/csapatok/{id}`

*Csapat adatainak szerkesztése*

<h3 id="editcsapat-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|integer(int64)|true|none|
|nev|query|string|false|none|
|varos|query|string|false|none|

> Example responses

> 200 Response

<h3 id="editcsapat-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[MessageResponse](#schemamessageresponse)|

<aside class="success">
This operation does not require authentication
</aside>

## deleteCsapat

<a id="opIddeleteCsapat"></a>

> Code samples

`DELETE /api/csapatok/{id}`

*Csapat törlése*

<h3 id="deletecsapat-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|integer(int64)|true|none|

> Example responses

> 200 Response

<h3 id="deletecsapat-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[MessageResponse](#schemamessageresponse)|

<aside class="success">
This operation does not require authentication
</aside>

<h1 id="utr-api--sz-k">Úszók</h1>

## getAllUszok

<a id="opIdgetAllUszok"></a>

> Code samples

`GET /api/uszok/`

*Úszók lekérdezése egy csapatban*

<h3 id="getalluszok-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|csapatId|query|integer(int64)|true|none|

> Example responses

> 200 Response

<h3 id="getalluszok-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|

<h3 id="getalluszok-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|*anonymous*|[[Uszo](#schemauszo)]|false|none|none|
|» id|integer(int64)|false|none|none|
|» nev|string|false|none|none|
|» szuletesiEv|integer(int32)|false|none|none|
|» csapatId|integer(int64)|false|none|none|
|» nem|string|false|none|none|

<aside class="success">
This operation does not require authentication
</aside>

## createUszo

<a id="opIdcreateUszo"></a>

> Code samples

`PUT /api/uszok/`

*Új úszó hozzáadása*

<h3 id="createuszo-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|csapatId|query|integer(int64)|true|none|
|nev|query|string|true|none|
|szuletesiEv|query|integer(int32)|true|none|
|nem|query|string|true|none|

> Example responses

> 200 Response

<h3 id="createuszo-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[MessageResponse](#schemamessageresponse)|

<aside class="success">
This operation does not require authentication
</aside>

## getUszo

<a id="opIdgetUszo"></a>

> Code samples

`GET /api/uszok/{id}`

*Úszó lekérdezése azonosító alapján*

<h3 id="getuszo-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|integer(int64)|true|none|

> Example responses

> 200 Response

<h3 id="getuszo-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[Uszo](#schemauszo)|

<aside class="success">
This operation does not require authentication
</aside>

## editUszo

<a id="opIdeditUszo"></a>

> Code samples

`PATCH /api/uszok/{id}`

*Úszó adatainak szerkesztése*

<h3 id="edituszo-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|integer(int64)|true|none|
|nev|query|string|false|none|
|szuletesiEv|query|string|false|none|
|csapat|query|integer(int64)|false|none|
|nem|query|string|false|none|

> Example responses

> 200 Response

<h3 id="edituszo-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[MessageResponse](#schemamessageresponse)|

<aside class="success">
This operation does not require authentication
</aside>

## deleteUszo

<a id="opIddeleteUszo"></a>

> Code samples

`DELETE /api/uszok/{id}`

*Úszó törlése*

<h3 id="deleteuszo-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|integer(int64)|true|none|

> Example responses

> 200 Response

<h3 id="deleteuszo-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[MessageResponse](#schemamessageresponse)|

<aside class="success">
This operation does not require authentication
</aside>

<h1 id="utr-api--sz-versenyek">Úszóversenyek</h1>

## getAllVersenyek

<a id="opIdgetAllVersenyek"></a>

> Code samples

`GET /api/uszoversenyek/`

*Összes úszóverseny lekérdezése*

> Example responses

> 200 Response

<h3 id="getallversenyek-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|

<h3 id="getallversenyek-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|*anonymous*|[[Uszoverseny](#schemauszoverseny)]|false|none|none|
|» id|integer(int64)|false|none|none|
|» nev|string|false|none|none|
|» helyszin|string|false|none|none|
|» datum|string(date-time)|false|none|none|
|» nyitott|boolean|false|none|none|

<aside class="success">
This operation does not require authentication
</aside>

## createNewVerseny

<a id="opIdcreateNewVerseny"></a>

> Code samples

`PUT /api/uszoversenyek/`

*Új úszóverseny létrehozása*

<h3 id="createnewverseny-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|nev|query|string|true|none|
|helyszin|query|string|false|none|
|datum|query|string(date-time)|false|none|

> Example responses

> 200 Response

<h3 id="createnewverseny-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[MessageResponse](#schemamessageresponse)|

<aside class="success">
This operation does not require authentication
</aside>

## getVerseny

<a id="opIdgetVerseny"></a>

> Code samples

`GET /api/uszoversenyek/{id}`

*Úszóverseny lekérdezése azonosító alapján*

<h3 id="getverseny-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|integer(int64)|true|none|

> Example responses

> 200 Response

<h3 id="getverseny-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[Uszoverseny](#schemauszoverseny)|

<aside class="success">
This operation does not require authentication
</aside>

## editVerseny

<a id="opIdeditVerseny"></a>

> Code samples

`PATCH /api/uszoversenyek/{id}`

*Úszóverseny adatainak szerkesztése*

<h3 id="editverseny-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|integer(int64)|true|none|
|nev|query|string|false|none|
|helyszin|query|string|false|none|
|datum|query|string(date-time)|false|none|

> Example responses

> 200 Response

<h3 id="editverseny-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[MessageResponse](#schemamessageresponse)|

<aside class="success">
This operation does not require authentication
</aside>

## deleteVerseny

<a id="opIddeleteVerseny"></a>

> Code samples

`DELETE /api/uszoversenyek/{id}`

*Úszóverseny törlése*

<h3 id="deleteverseny-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|integer(int64)|true|none|

> Example responses

> 200 Response

<h3 id="deleteverseny-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[MessageResponse](#schemamessageresponse)|

<aside class="success">
This operation does not require authentication
</aside>

## uszoversenyMegnyitasa

<a id="opIduszoversenyMegnyitasa"></a>

> Code samples

`POST /api/uszoversenyek/{id}/megnyitas`

*Úszóverseny megnyitása*

Abban az esetben, ha már van úszóverseny megnyitva, a request el fog bukni.

<h3 id="uszoversenymegnyitasa-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|integer(int64)|true|none|

> Example responses

> 200 Response

<h3 id="uszoversenymegnyitasa-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[MessageResponse](#schemamessageresponse)|

<aside class="success">
This operation does not require authentication
</aside>

<h1 id="utr-api-versenysz-mok">Versenyszámok</h1>

## getAllVersenyszamok

<a id="opIdgetAllVersenyszamok"></a>

> Code samples

`GET /api/versenyszamok/`

*Összes versenyszám lekérdezése úszóverseny alapján*

<h3 id="getallversenyszamok-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|versenyId|query|integer(int64)|true|none|

> Example responses

> 200 Response

<h3 id="getallversenyszamok-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|

<h3 id="getallversenyszamok-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|*anonymous*|[[Versenyszam](#schemaversenyszam)]|false|none|none|
|» id|integer(int64)|false|none|none|
|» versenyId|integer(int64)|false|none|none|
|» hossz|integer(int32)|false|none|none|
|» uszasnem|[Uszasnem](#schemauszasnem)|false|none|none|
|»» id|integer(int32)|false|none|none|
|»» elnevezes|string|false|none|none|
|» nem|string|false|none|none|
|» valto|integer(int32)|false|none|none|

<aside class="success">
This operation does not require authentication
</aside>

## createVersenyszam

<a id="opIdcreateVersenyszam"></a>

> Code samples

`PUT /api/versenyszamok/`

*Új versenyszám létrehozása*

<h3 id="createversenyszam-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|versenyId|query|integer(int64)|true|none|
|hossz|query|integer(int32)|true|none|
|uszasnemId|query|integer(int32)|true|none|
|emberiNemId|query|string|true|none|
|valto|query|integer(int32)|false|none|

> Example responses

> 200 Response

<h3 id="createversenyszam-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[MessageResponse](#schemamessageresponse)|

<aside class="success">
This operation does not require authentication
</aside>

## getVersenyszam

<a id="opIdgetVersenyszam"></a>

> Code samples

`GET /api/versenyszamok/{id}`

*Versenyszám lekérdezése azonosító alapján*

<h3 id="getversenyszam-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|integer(int64)|true|none|

> Example responses

> 200 Response

<h3 id="getversenyszam-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[Versenyszam](#schemaversenyszam)|

<aside class="success">
This operation does not require authentication
</aside>

## editVersenyszam

<a id="opIdeditVersenyszam"></a>

> Code samples

`PATCH /api/versenyszamok/{id}`

*Versenyszám adatainak szerkesztése*

<h3 id="editversenyszam-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|integer(int64)|true|none|
|hossz|query|integer(int32)|false|none|
|uszasnem|query|integer(int32)|false|none|
|nem|query|string|false|none|
|valto|query|integer(int32)|false|none|

> Example responses

> 200 Response

<h3 id="editversenyszam-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[MessageResponse](#schemamessageresponse)|

<aside class="success">
This operation does not require authentication
</aside>

## deleteVersenyszam

<a id="opIddeleteVersenyszam"></a>

> Code samples

`DELETE /api/versenyszamok/{id}`

*Versenyszám törlése*

<h3 id="deleteversenyszam-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|integer(int64)|true|none|

> Example responses

> 200 Response

<h3 id="deleteversenyszam-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[MessageResponse](#schemamessageresponse)|

<aside class="success">
This operation does not require authentication
</aside>

<h1 id="utr-api-nevez-sek">Nevezések</h1>

## getAllNevezesek

<a id="opIdgetAllNevezesek"></a>

> Code samples

`GET /api/nevezesek/`

*Összes nevezés lekérdezése a versenyszámban*

<h3 id="getallnevezesek-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|versenyszamId|query|integer(int64)|true|none|

> Example responses

> 200 Response

<h3 id="getallnevezesek-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|

<h3 id="getallnevezesek-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|*anonymous*|[[Nevezes](#schemanevezes)]|false|none|none|
|» id|integer(int64)|false|none|none|
|» uszo|[UszoDetailed](#schemauszodetailed)|false|none|none|
|»» id|integer(int64)|false|none|none|
|»» nev|string|false|none|none|
|»» szuletesiDatum|integer(int32)|false|none|none|
|»» csapat|[Csapat](#schemacsapat)|false|none|none|
|»»» id|integer(int64)|false|none|none|
|»»» nev|string|false|none|none|
|»»» varos|string|false|none|none|
|»» nem|string|false|none|none|
|» versenyszamId|integer(int64)|false|none|none|
|» nevezesiIdo|integer(int32)|false|none|none|
|» idoeredmeny|integer(int32)|false|none|none|
|» megjelent|boolean|false|none|none|

<aside class="success">
This operation does not require authentication
</aside>

## createNevezes

<a id="opIdcreateNevezes"></a>

> Code samples

`PUT /api/nevezesek/`

*Úszó benvezése a versenyszámban*

<h3 id="createnevezes-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|versenyszamId|query|integer(int64)|true|none|
|uszoId|query|integer(int64)|true|none|
|nevezesiIdo|query|string|false|none|

> Example responses

> 200 Response

<h3 id="createnevezes-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[MessageResponse](#schemamessageresponse)|

<aside class="success">
This operation does not require authentication
</aside>

## getNevezes

<a id="opIdgetNevezes"></a>

> Code samples

`GET /api/nevezesek/{id}`

*Nevezés lekérdezése azonosító alapján*

<h3 id="getnevezes-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|integer(int64)|true|none|

> Example responses

> 200 Response

<h3 id="getnevezes-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[Nevezes](#schemanevezes)|

<aside class="success">
This operation does not require authentication
</aside>

## editNevezes

<a id="opIdeditNevezes"></a>

> Code samples

`PATCH /api/nevezesek/{id}`

*Nevezés adatainak módosítása*

<h3 id="editnevezes-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|integer(int64)|true|none|
|versenyszamId|query|integer(int64)|false|none|
|uszoId|query|integer(int64)|false|none|
|nevezesiIdo|query|string|false|none|

> Example responses

> 200 Response

<h3 id="editnevezes-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[MessageResponse](#schemamessageresponse)|

<aside class="success">
This operation does not require authentication
</aside>

## deleteNevezes

<a id="opIddeleteNevezes"></a>

> Code samples

`DELETE /api/nevezesek/{id}`

*Nevezés törlése*

<h3 id="deletenevezes-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|integer(int64)|true|none|

> Example responses

> 200 Response

<h3 id="deletenevezes-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[MessageResponse](#schemamessageresponse)|

<aside class="success">
This operation does not require authentication
</aside>

<h1 id="utr-api-futamok">Futamok</h1>

## getAllFutamok

<a id="opIdgetAllFutamok"></a>

> Code samples

`GET /api/futamok/`

*Összes futam lekérdezése a versenyszámban*

<h3 id="getallfutamok-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|versenyszamId|query|integer(int64)|true|none|

> Example responses

> 200 Response

<h3 id="getallfutamok-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|

<h3 id="getallfutamok-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|*anonymous*|[[Futam](#schemafutam)]|false|none|none|
|» id|integer(int64)|false|none|none|
|» versenyszamId|integer(int64)|false|none|none|
|» rajtlista|[[NevezesDetailed](#schemanevezesdetailed)]|false|none|none|
|»» id|integer(int64)|false|none|none|
|»» uszo|[UszoDetailed](#schemauszodetailed)|false|none|none|
|»»» id|integer(int64)|false|none|none|
|»»» nev|string|false|none|none|
|»»» szuletesiDatum|integer(int32)|false|none|none|
|»»» csapat|[Csapat](#schemacsapat)|false|none|none|
|»»»» id|integer(int64)|false|none|none|
|»»»» nev|string|false|none|none|
|»»»» varos|string|false|none|none|
|»»» nem|string|false|none|none|
|»» versenyszam|[Versenyszam](#schemaversenyszam)|false|none|none|
|»»» id|integer(int64)|false|none|none|
|»»» versenyId|integer(int64)|false|none|none|
|»»» hossz|integer(int32)|false|none|none|
|»»» uszasnem|[Uszasnem](#schemauszasnem)|false|none|none|
|»»»» id|integer(int32)|false|none|none|
|»»»» elnevezes|string|false|none|none|
|»»» nem|string|false|none|none|
|»»» valto|integer(int32)|false|none|none|
|»» nevezesiIdo|integer(int32)|false|none|none|
|»» idoeredmeny|integer(int32)|false|none|none|
|»» megjelent|boolean|false|none|none|

<aside class="success">
This operation does not require authentication
</aside>

## createFutam

<a id="opIdcreateFutam"></a>

> Code samples

`PUT /api/futamok/`

*Futam létrehozása*

Deprecated! Ezt az endpoint-ot ne használjuk, jövőben el lesz távolítva. Futamokat csak a rendszer ad hozzá a rajtlista összeállításakor.

<h3 id="createfutam-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|versenyszamId|query|integer(int64)|true|none|

> Example responses

> 200 Response

<h3 id="createfutam-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[MessageResponse](#schemamessageresponse)|

<aside class="success">
This operation does not require authentication
</aside>

## getRajtlista

<a id="opIdgetRajtlista"></a>

> Code samples

`GET /api/futamok/{futamId}/rajtlista`

*Rajtlista lekérdezése azonosító alapján*

<h3 id="getrajtlista-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|futamId|path|integer(int64)|true|none|

> Example responses

> 200 Response

<h3 id="getrajtlista-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|

<h3 id="getrajtlista-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|*anonymous*|[[NevezesDetailed](#schemanevezesdetailed)]|false|none|none|
|» id|integer(int64)|false|none|none|
|» uszo|[UszoDetailed](#schemauszodetailed)|false|none|none|
|»» id|integer(int64)|false|none|none|
|»» nev|string|false|none|none|
|»» szuletesiDatum|integer(int32)|false|none|none|
|»» csapat|[Csapat](#schemacsapat)|false|none|none|
|»»» id|integer(int64)|false|none|none|
|»»» nev|string|false|none|none|
|»»» varos|string|false|none|none|
|»» nem|string|false|none|none|
|» versenyszam|[Versenyszam](#schemaversenyszam)|false|none|none|
|»» id|integer(int64)|false|none|none|
|»» versenyId|integer(int64)|false|none|none|
|»» hossz|integer(int32)|false|none|none|
|»» uszasnem|[Uszasnem](#schemauszasnem)|false|none|none|
|»»» id|integer(int32)|false|none|none|
|»»» elnevezes|string|false|none|none|
|»» nem|string|false|none|none|
|»» valto|integer(int32)|false|none|none|
|» nevezesiIdo|integer(int32)|false|none|none|
|» idoeredmeny|integer(int32)|false|none|none|
|» megjelent|boolean|false|none|none|

<aside class="success">
This operation does not require authentication
</aside>

<h1 id="utr-api-nyitott-sz-verseny">Nyitott úszóverseny</h1>

## editIdoeredmeny

<a id="opIdeditIdoeredmeny"></a>

> Code samples

`PATCH /api/nyitott/idoeredmeny`

*Nevezés időeredményének módosítása*

Csak a jelenleg nyitott úszóverseny versenyszámainak nevezéseiben használható.

<h3 id="editidoeredmeny-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|nevezesId|query|integer(int64)|true|none|
|idoeredmeny|query|string|true|none|

> Example responses

> 200 Response

<h3 id="editidoeredmeny-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[MessageResponse](#schemamessageresponse)|

<aside class="success">
This operation does not require authentication
</aside>

## deleteIdoeredmeny

<a id="opIddeleteIdoeredmeny"></a>

> Code samples

`DELETE /api/nyitott/idoeredmeny`

*Nevezés időeredményének törlése*

Csak a jelenleg nyitott úszóverseny versenyszámainak nevezéseiben használható.

<h3 id="deleteidoeredmeny-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|nevezesId|query|integer(int64)|true|none|

> Example responses

> 200 Response

<h3 id="deleteidoeredmeny-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[MessageResponse](#schemamessageresponse)|

<aside class="success">
This operation does not require authentication
</aside>

## editJelenlet

<a id="opIdeditJelenlet"></a>

> Code samples

`PATCH /api/nyitott/jelenlet`

*Úszó jelenlétének módosítása*

Csak a jelenleg nyitott úszóverseny versenyszámainak nevezéseiben használható.

<h3 id="editjelenlet-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|uszoId|query|integer(int64)|true|none|
|megjelent|query|boolean|true|none|

> Example responses

> 200 Response

<h3 id="editjelenlet-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[MessageResponse](#schemamessageresponse)|

<aside class="success">
This operation does not require authentication
</aside>

## uszoversenyLezarasa

<a id="opIduszoversenyLezarasa"></a>

> Code samples

`POST /api/nyitott/lezaras`

*Nyitott úszóverseny lezárása.*

> Example responses

> 200 Response

<h3 id="uszoversenylezarasa-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[MessageResponse](#schemamessageresponse)|

<aside class="success">
This operation does not require authentication
</aside>

## getRajtlista

<a id="opIdgetRajtlista"></a>

> Code samples

`GET /api/nyitott/rajtlista`

*Versenyszám rajtlistájának lekérdezése*

Csak a jelenleg nyitott úszóverseny versenyszámainak nevezéseiben használható. Abban az esetben, ha nincs rajtlista összeállítva a versenyhez, a request el fog bukni.

<h3 id="getrajtlista-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|versenyszamId|query|integer(int64)|true|none|

> Example responses

> 200 Response

<h3 id="getrajtlista-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|

<h3 id="getrajtlista-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|*anonymous*|[[Futam](#schemafutam)]|false|none|none|
|» id|integer(int64)|false|none|none|
|» versenyszamId|integer(int64)|false|none|none|
|» rajtlista|[[NevezesDetailed](#schemanevezesdetailed)]|false|none|none|
|»» id|integer(int64)|false|none|none|
|»» uszo|[UszoDetailed](#schemauszodetailed)|false|none|none|
|»»» id|integer(int64)|false|none|none|
|»»» nev|string|false|none|none|
|»»» szuletesiDatum|integer(int32)|false|none|none|
|»»» csapat|[Csapat](#schemacsapat)|false|none|none|
|»»»» id|integer(int64)|false|none|none|
|»»»» nev|string|false|none|none|
|»»»» varos|string|false|none|none|
|»»» nem|string|false|none|none|
|»» versenyszam|[Versenyszam](#schemaversenyszam)|false|none|none|
|»»» id|integer(int64)|false|none|none|
|»»» versenyId|integer(int64)|false|none|none|
|»»» hossz|integer(int32)|false|none|none|
|»»» uszasnem|[Uszasnem](#schemauszasnem)|false|none|none|
|»»»» id|integer(int32)|false|none|none|
|»»»» elnevezes|string|false|none|none|
|»»» nem|string|false|none|none|
|»»» valto|integer(int32)|false|none|none|
|»» nevezesiIdo|integer(int32)|false|none|none|
|»» idoeredmeny|integer(int32)|false|none|none|
|»» megjelent|boolean|false|none|none|

<aside class="success">
This operation does not require authentication
</aside>

## rajtlistaOsszeallitasa

<a id="opIdrajtlistaOsszeallitasa"></a>

> Code samples

`POST /api/nyitott/rajtlista`

*Rajtlista összeállítása*

Csak a jelenleg nyitott úszóverseny versenyszámainak nevezéseiben használható.

> Example responses

> 200 Response

<h3 id="rajtlistaosszeallitasa-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|

<h3 id="rajtlistaosszeallitasa-responseschema">Response Schema</h3>

<aside class="success">
This operation does not require authentication
</aside>

## nyitottVersenyReszletek

<a id="opIdnyitottVersenyReszletek"></a>

> Code samples

`GET /api/nyitott/reszletek`

*Nyitott úszóverseny adatainak lekérdezése*

> Example responses

> 200 Response

<h3 id="nyitottversenyreszletek-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[Uszoverseny](#schemauszoverseny)|

<aside class="success">
This operation does not require authentication
</aside>

## nyitottVersenyszamok

<a id="opIdnyitottVersenyszamok"></a>

> Code samples

`GET /api/nyitott/versenyszamok`

*Nyitott úszóverseny versenyszámainak lekérdezése*

> Example responses

> 200 Response

<h3 id="nyitottversenyszamok-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|

<h3 id="nyitottversenyszamok-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|*anonymous*|[[Versenyszam](#schemaversenyszam)]|false|none|none|
|» id|integer(int64)|false|none|none|
|» versenyId|integer(int64)|false|none|none|
|» hossz|integer(int32)|false|none|none|
|» uszasnem|[Uszasnem](#schemauszasnem)|false|none|none|
|»» id|integer(int32)|false|none|none|
|»» elnevezes|string|false|none|none|
|» nem|string|false|none|none|
|» valto|integer(int32)|false|none|none|

<aside class="success">
This operation does not require authentication
</aside>

<h1 id="utr-api-t-mogat-s">Támogatás</h1>

## getEnvironmentVariables

<a id="opIdgetEnvironmentVariables"></a>

> Code samples

`GET /api/support/env`

*Az API szerver környezeti változóinak lekérdezése*

> Example responses

> 200 Response

<h3 id="getenvironmentvariables-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|string|

<aside class="success">
This operation does not require authentication
</aside>

## getServerLog

<a id="opIdgetServerLog"></a>

> Code samples

`GET /api/support/log`

*Az API szerver eddigi log-jainak lekérdezése*

> Example responses

> 200 Response

<h3 id="getserverlog-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|

<h3 id="getserverlog-responseschema">Response Schema</h3>

<aside class="success">
This operation does not require authentication
</aside>

# Schemas

<h2 id="tocS_LoginRequest">LoginRequest</h2>
<!-- backwards compatibility -->
<a id="schemaloginrequest"></a>
<a id="schema_LoginRequest"></a>
<a id="tocSloginrequest"></a>
<a id="tocsloginrequest"></a>

```json
{
  "username": "string",
  "password": "string"
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|username|string|false|none|none|
|password|string|false|none|none|

<h2 id="tocS_JwtResponse">JwtResponse</h2>
<!-- backwards compatibility -->
<a id="schemajwtresponse"></a>
<a id="schema_JwtResponse"></a>
<a id="tocSjwtresponse"></a>
<a id="tocsjwtresponse"></a>

```json
{
  "token": "string",
  "type": "string",
  "id": 0,
  "username": "string",
  "displayName": "string",
  "roles": [
    "string"
  ]
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|token|string|false|none|none|
|type|string|false|none|none|
|id|integer(int64)|false|none|none|
|username|string|false|none|none|
|displayName|string|false|none|none|
|roles|[string]|false|none|none|

<h2 id="tocS_NewUserRequest">NewUserRequest</h2>
<!-- backwards compatibility -->
<a id="schemanewuserrequest"></a>
<a id="schema_NewUserRequest"></a>
<a id="tocSnewuserrequest"></a>
<a id="tocsnewuserrequest"></a>

```json
{
  "username": "string",
  "displayName": "string",
  "role": [
    "string"
  ],
  "password": "string"
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|username|string|false|none|none|
|displayName|string|false|none|none|
|role|[string]|false|none|none|
|password|string|false|none|none|

<h2 id="tocS_Role">Role</h2>
<!-- backwards compatibility -->
<a id="schemarole"></a>
<a id="schema_Role"></a>
<a id="tocSrole"></a>
<a id="tocsrole"></a>

```json
{
  "id": 0,
  "name": "ROLE_ADMIN"
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|integer(int32)|false|none|none|
|name|string|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|name|ROLE_ADMIN|
|name|ROLE_IDOROGZITO|
|name|ROLE_ALLITOBIRO|
|name|ROLE_SPEAKER|

<h2 id="tocS_User">User</h2>
<!-- backwards compatibility -->
<a id="schemauser"></a>
<a id="schema_User"></a>
<a id="tocSuser"></a>
<a id="tocsuser"></a>

```json
{
  "id": 0,
  "username": "string",
  "displayName": "string",
  "password": "string",
  "roles": [
    {
      "id": 0,
      "name": "ROLE_ADMIN"
    }
  ]
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|integer(int64)|false|none|none|
|username|string|false|none|none|
|displayName|string|false|none|none|
|password|string|false|none|none|
|roles|[[Role](#schemarole)]|false|none|none|

<h2 id="tocS_ChangePasswordRequest">ChangePasswordRequest</h2>
<!-- backwards compatibility -->
<a id="schemachangepasswordrequest"></a>
<a id="schema_ChangePasswordRequest"></a>
<a id="tocSchangepasswordrequest"></a>
<a id="tocschangepasswordrequest"></a>

```json
{
  "userId": 0,
  "oldPassword": "string",
  "newPassword": "string"
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|userId|integer(int64)|false|none|none|
|oldPassword|string|false|none|none|
|newPassword|string|false|none|none|

<h2 id="tocS_Uszo">Uszo</h2>
<!-- backwards compatibility -->
<a id="schemauszo"></a>
<a id="schema_Uszo"></a>
<a id="tocSuszo"></a>
<a id="tocsuszo"></a>

```json
{
  "id": 0,
  "nev": "string",
  "szuletesiEv": 0,
  "csapatId": 0,
  "nem": "string"
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|integer(int64)|false|none|none|
|nev|string|false|none|none|
|szuletesiEv|integer(int32)|false|none|none|
|csapatId|integer(int64)|false|none|none|
|nem|string|false|none|none|

<h2 id="tocS_MessageResponse">MessageResponse</h2>
<!-- backwards compatibility -->
<a id="schemamessageresponse"></a>
<a id="schema_MessageResponse"></a>
<a id="tocSmessageresponse"></a>
<a id="tocsmessageresponse"></a>

```json
{
  "message": "string"
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|message|string|false|none|none|

<h2 id="tocS_Uszoverseny">Uszoverseny</h2>
<!-- backwards compatibility -->
<a id="schemauszoverseny"></a>
<a id="schema_Uszoverseny"></a>
<a id="tocSuszoverseny"></a>
<a id="tocsuszoverseny"></a>

```json
{
  "id": 0,
  "nev": "string",
  "helyszin": "string",
  "datum": "2019-08-24T14:15:22Z",
  "nyitott": true
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|integer(int64)|false|none|none|
|nev|string|false|none|none|
|helyszin|string|false|none|none|
|datum|string(date-time)|false|none|none|
|nyitott|boolean|false|none|none|

<h2 id="tocS_Uszasnem">Uszasnem</h2>
<!-- backwards compatibility -->
<a id="schemauszasnem"></a>
<a id="schema_Uszasnem"></a>
<a id="tocSuszasnem"></a>
<a id="tocsuszasnem"></a>

```json
{
  "id": 0,
  "elnevezes": "string"
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|integer(int32)|false|none|none|
|elnevezes|string|false|none|none|

<h2 id="tocS_Versenyszam">Versenyszam</h2>
<!-- backwards compatibility -->
<a id="schemaversenyszam"></a>
<a id="schema_Versenyszam"></a>
<a id="tocSversenyszam"></a>
<a id="tocsversenyszam"></a>

```json
{
  "id": 0,
  "versenyId": 0,
  "hossz": 0,
  "uszasnem": {
    "id": 0,
    "elnevezes": "string"
  },
  "nem": "string",
  "valto": 0
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|integer(int64)|false|none|none|
|versenyId|integer(int64)|false|none|none|
|hossz|integer(int32)|false|none|none|
|uszasnem|[Uszasnem](#schemauszasnem)|false|none|none|
|nem|string|false|none|none|
|valto|integer(int32)|false|none|none|

<h2 id="tocS_Csapat">Csapat</h2>
<!-- backwards compatibility -->
<a id="schemacsapat"></a>
<a id="schema_Csapat"></a>
<a id="tocScsapat"></a>
<a id="tocscsapat"></a>

```json
{
  "id": 0,
  "nev": "string",
  "varos": "string"
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|integer(int64)|false|none|none|
|nev|string|false|none|none|
|varos|string|false|none|none|

<h2 id="tocS_UszoDetailed">UszoDetailed</h2>
<!-- backwards compatibility -->
<a id="schemauszodetailed"></a>
<a id="schema_UszoDetailed"></a>
<a id="tocSuszodetailed"></a>
<a id="tocsuszodetailed"></a>

```json
{
  "id": 0,
  "nev": "string",
  "szuletesiDatum": 0,
  "csapat": {
    "id": 0,
    "nev": "string",
    "varos": "string"
  },
  "nem": "string"
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|integer(int64)|false|none|none|
|nev|string|false|none|none|
|szuletesiDatum|integer(int32)|false|none|none|
|csapat|[Csapat](#schemacsapat)|false|none|none|
|nem|string|false|none|none|

<h2 id="tocS_Nevezes">Nevezes</h2>
<!-- backwards compatibility -->
<a id="schemanevezes"></a>
<a id="schema_Nevezes"></a>
<a id="tocSnevezes"></a>
<a id="tocsnevezes"></a>

```json
{
  "id": 0,
  "uszo": {
    "id": 0,
    "nev": "string",
    "szuletesiDatum": 0,
    "csapat": {
      "id": 0,
      "nev": "string",
      "varos": "string"
    },
    "nem": "string"
  },
  "versenyszamId": 0,
  "nevezesiIdo": 0,
  "idoeredmeny": 0,
  "megjelent": true
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|integer(int64)|false|none|none|
|uszo|[UszoDetailed](#schemauszodetailed)|false|none|none|
|versenyszamId|integer(int64)|false|none|none|
|nevezesiIdo|integer(int32)|false|none|none|
|idoeredmeny|integer(int32)|false|none|none|
|megjelent|boolean|false|none|none|

<h2 id="tocS_NevezesDetailed">NevezesDetailed</h2>
<!-- backwards compatibility -->
<a id="schemanevezesdetailed"></a>
<a id="schema_NevezesDetailed"></a>
<a id="tocSnevezesdetailed"></a>
<a id="tocsnevezesdetailed"></a>

```json
{
  "id": 0,
  "uszo": {
    "id": 0,
    "nev": "string",
    "szuletesiDatum": 0,
    "csapat": {
      "id": 0,
      "nev": "string",
      "varos": "string"
    },
    "nem": "string"
  },
  "versenyszam": {
    "id": 0,
    "versenyId": 0,
    "hossz": 0,
    "uszasnem": {
      "id": 0,
      "elnevezes": "string"
    },
    "nem": "string",
    "valto": 0
  },
  "nevezesiIdo": 0,
  "idoeredmeny": 0,
  "megjelent": true
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|integer(int64)|false|none|none|
|uszo|[UszoDetailed](#schemauszodetailed)|false|none|none|
|versenyszam|[Versenyszam](#schemaversenyszam)|false|none|none|
|nevezesiIdo|integer(int32)|false|none|none|
|idoeredmeny|integer(int32)|false|none|none|
|megjelent|boolean|false|none|none|

<h2 id="tocS_Futam">Futam</h2>
<!-- backwards compatibility -->
<a id="schemafutam"></a>
<a id="schema_Futam"></a>
<a id="tocSfutam"></a>
<a id="tocsfutam"></a>

```json
{
  "id": 0,
  "versenyszamId": 0,
  "rajtlista": [
    {
      "id": 0,
      "uszo": {
        "id": 0,
        "nev": "string",
        "szuletesiDatum": 0,
        "csapat": {
          "id": 0,
          "nev": "string",
          "varos": "string"
        },
        "nem": "string"
      },
      "versenyszam": {
        "id": 0,
        "versenyId": 0,
        "hossz": 0,
        "uszasnem": {
          "id": 0,
          "elnevezes": "string"
        },
        "nem": "string",
        "valto": 0
      },
      "nevezesiIdo": 0,
      "idoeredmeny": 0,
      "megjelent": true
    }
  ]
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|integer(int64)|false|none|none|
|versenyszamId|integer(int64)|false|none|none|
|rajtlista|[[NevezesDetailed](#schemanevezesdetailed)]|false|none|none|

