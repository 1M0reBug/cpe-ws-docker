CREATE TABLE IF NOT EXISTS adjectives (
    id int NOT NULL PRIMARY KEY AUTO_INCREMENT,
    word varchar(255) NOT NULL
);

INSERT INTO adjectives (word) VALUES ('great');
INSERT INTO adjectives (word) VALUES ('boring');
INSERT INTO adjectives (word) VALUES ('beautiful');
INSERT INTO adjectives (word) VALUES ('mesmerizing');

CREATE TABLE IF NOT EXISTS nouns (
    id int NOT NULL PRIMARY KEY AUTO_INCREMENT,
    word varchar(255) NOT NULL
);

INSERT INTO nouns (word) VALUES ('dog');
INSERT INTO nouns (word) VALUES ('cat');
INSERT INTO nouns (word) VALUES ('Jean-Louis');

CREATE TABLE IF NOT EXISTS verbs (
    id int NOT NULL PRIMARY KEY AUTO_INCREMENT,
    word varchar(255) NOT NULL
);

INSERT INTO verbs (word) VALUES ('eats');
INSERT INTO verbs (word) VALUES ('walks');
INSERT INTO verbs (word) VALUES ('sleeps');