CREATE TABLE parishioners (
    id                  CHAR(36)    NOT NULL DEFAULT (UUID()) PRIMARY KEY,
    name                text        NOT NULL,
    city                text        NOT NULL,
    email               text        NOT NULL,
    is_registered       boolean     NOT NULL,
    members             int         NOT NULL
)