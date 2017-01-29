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

CREATE OR REPLACE USER adjectives_u@'%' IDENTIFIED BY 'pwd_adjectives_u';
GRANT ALL ON `adjectives`.* TO 'adjectives_u'@'%';

CREATE OR REPLACE USER nouns_u@'%' IDENTIFIED BY 'pwd_nouns_u';
GRANT ALL ON `nouns`.* TO 'nouns_u'@'%';

CREATE OR REPLACE USER verbs_u@'%' IDENTIFIED BY 'pwd_verbs_u';
GRANT ALL ON `verbs`.* TO 'verbs_u'@'%';
