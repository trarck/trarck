drop table card;

drop table card_group;

drop table card_slot;

drop table "group";

drop table skill;

create table card (
id                   INTEGER                        not null,
name                 TEXT                           not null,
description          TEXT                           not null,
type                 INTEGER                        not null,
element              INTEGER                        not null,
category             INTEGER                        not null,
population           INTEGER                        not null,
wait_round           INTEGER                        not null,
hp                   INTEGER                        not null,
attack               INTEGER                        not null,
slot_1               INTEGER                        not null,
slot_2               INTEGER                        not null,
slot_3               INTEGER                        not null,
primary key (id)
);

create table card_group (
group_id             INTEGER,
card_id              INTEGER,
sequence             INTEGER
);

create table card_slot (
card_id              INTEGER                        not null,
slot_type            INTEGER                        not null,
value                INTEGER                        not null,
primary key (card_id, slot_type)
);

create table "group" (
id                   INTEGER    PRIMARY KEY AUTOINCREMENT              not null,
master_card_id       INTEGER                        not null default 0,
current_population   INTEGER                        not null default 0
);

create table skill (
id                   INTEGER                        not null,
name                 TEXT,
description          TEXT,
primary key (id)
);

