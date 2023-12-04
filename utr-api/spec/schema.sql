CREATE SEQUENCE users_id_seq;

ALTER SEQUENCE users_id_seq owner TO klevcsoo;

CREATE SEQUENCE csapatok_id_seq;

ALTER SEQUENCE csapatok_id_seq owner TO klevcsoo;

CREATE SEQUENCE futamok_id_seq;

ALTER SEQUENCE futamok_id_seq owner TO klevcsoo;

CREATE SEQUENCE versenyszamok_id_seq;

ALTER SEQUENCE versenyszamok_id_seq owner TO klevcsoo;

CREATE SEQUENCE versenyek_id_seq;

ALTER SEQUENCE versenyek_id_seq owner TO klevcsoo;

CREATE SEQUENCE hibernate_sequence;

ALTER SEQUENCE hibernate_sequence owner TO klevcsoo;

CREATE TABLE auth_user
(
    id           bigint DEFAULT nextval('users_id_seq'::regclass) NOT NULL
        CONSTRAINT users_pk
            PRIMARY KEY,
    username     text
        CONSTRAINT ukr43af9ap4edm43mmtq01oddj6
            UNIQUE,
    display_name text,
    password     text
) USING ???;

ALTER TABLE auth_user
    owner TO klevcsoo;

CREATE TABLE auth_role
(
    id   INTEGER NOT NULL
        CONSTRAINT roles_pk
            PRIMARY KEY,
    name VARCHAR(20)
) USING ???;

ALTER TABLE auth_role
    owner TO klevcsoo;

CREATE TABLE auth_user_roles
(
    user_id bigint  NOT NULL
        CONSTRAINT user_roles_users_id_fk
            REFERENCES auth_user,
    role_id INTEGER NOT NULL
        CONSTRAINT user_roles_roles_id_fk
            REFERENCES auth_role
) USING ???;

ALTER TABLE auth_user_roles
    owner TO klevcsoo;

CREATE INDEX user_roles_user_id_role_id_index
    ON auth_user_roles USING ??? (user_id, role_id);

CREATE TABLE csapat
(
    id    bigint DEFAULT nextval('csapatok_id_seq'::regclass) NOT NULL
        CONSTRAINT csapatok_pk
            PRIMARY KEY,
    nev   text,
    varos text
) USING ???;

ALTER TABLE csapat
    owner TO klevcsoo;

ALTER SEQUENCE csapatok_id_seq owned BY csapat.id;

CREATE TABLE uszoverseny
(
    id       bigint  DEFAULT nextval('versenyek_id_seq'::regclass) NOT NULL
        CONSTRAINT versenyek_pk
            PRIMARY KEY,
    nev      text                                                  NOT NULL,
    helyszin text,
    datum    DATE,
    nyitott  boolean DEFAULT FALSE                                 NOT NULL
) USING ???;

ALTER TABLE uszoverseny
    owner TO klevcsoo;

ALTER SEQUENCE versenyek_id_seq owned BY uszoverseny.id;

CREATE UNIQUE INDEX uszoversenyek_nyitott_idx
    ON uszoverseny USING ??? (nyitott)
    WHERE (nyitott = TRUE);

CREATE TABLE versenyszam
(
    id          bigint DEFAULT nextval('versenyszamok_id_seq'::regclass) NOT NULL
        CONSTRAINT versenyszamok_pk
            PRIMARY KEY,
    verseny_id  bigint                                                   NOT NULL
        CONSTRAINT versenyszamok_versenyek_id_fk
            REFERENCES uszoverseny,
    hossz       INTEGER                                                  NOT NULL,
    uszasnem    text                                                     NOT NULL,
    nem         text,
    valto       INTEGER,
    uszasnem_id VARCHAR(255)
) USING ???;

ALTER TABLE versenyszam
    owner TO klevcsoo;

ALTER SEQUENCE versenyszamok_id_seq owned BY versenyszam.id;

CREATE TABLE futam
(
    id             bigint DEFAULT nextval('futamok_id_seq'::regclass) NOT NULL
        CONSTRAINT futamok_pk
            PRIMARY KEY,
    versenyszam_id bigint                                             NOT NULL
        CONSTRAINT futamok_versenyszamok_id_fk
            REFERENCES versenyszam
) USING ???;

ALTER TABLE futam
    owner TO klevcsoo;

ALTER SEQUENCE futamok_id_seq owned BY futam.id;

CREATE TABLE uszasnem
(
    id VARCHAR(255) NOT NULL
        PRIMARY KEY
) USING ???;

ALTER TABLE uszasnem
    owner TO klevcsoo;

CREATE TABLE uszo
(
    id           bigserial
        CONSTRAINT uszok_pk
            PRIMARY KEY,
    nev          text NOT NULL,
    csapat_id    bigint
        CONSTRAINT uszo_csapat_id_fk
            REFERENCES csapat
            ON DELETE CASCADE,
    nem          text NOT NULL,
    szuletesi_ev SMALLINT
) USING ???;

ALTER TABLE uszo
    owner TO klevcsoo;

CREATE TABLE nevezes
(
    id             bigserial
        CONSTRAINT nevezesek_pk
            PRIMARY KEY,
    uszo_id        bigint               NOT NULL
        CONSTRAINT nevezes_uszo_id_fk
            REFERENCES uszo
            ON DELETE CASCADE,
    versenyszam_id bigint               NOT NULL
        CONSTRAINT nevezes_versenyszam_id_fk
            REFERENCES versenyszam,
    megjelent      boolean DEFAULT TRUE NOT NULL,
    nevezesi_ido   INTEGER,
    idoeredmeny    INTEGER
) USING ???;

ALTER TABLE nevezes
    owner TO klevcsoo;

CREATE INDEX nevezesek_idoeredmeny_index
    ON nevezes USING ??? (idoeredmeny);

CREATE TABLE rajtlista
(
    futam_id   bigint NOT NULL
        CONSTRAINT rajtlista_futamok_id_fk
            REFERENCES futam,
    nevezes_id bigint NOT NULL
        CONSTRAINT uk_ryvhj93vm46l90id5e089daq0
            UNIQUE
        CONSTRAINT rajtlista_nevezes_id_fk
            REFERENCES nevezes
) USING ???;

ALTER TABLE rajtlista
    owner TO klevcsoo;

CREATE INDEX rajtlista_futam_id_index
    ON rajtlista USING ??? (futam_id);

CREATE INDEX rajtlista_futam_id_nevezes_id_index
    ON rajtlista USING ??? (futam_id, nevezes_id);

CREATE INDEX uszok_nev_index
    ON uszo USING ??? (nev);
