# CPE Workshop: Docker

Pour la préparation du workshop il est nécessaire d'avoir installé Docker au préalable.
Le site [docs.docker.com](https://docs.docker.com), fournit toutes les procédures nécessaires
quelque soit votre système d'exploitation.

Les éléments requis sont:
* [docker engine :arrow_upper_right:](https://docs.docker.com/engine/installation/) 
* [docker compose :arrow_upper_right:](https://docs.docker.com/compose/install/)

Si à l'issue de l'installation vous êtes capables de lancer le hello world, c'est l'essentiel, ce 
n'est pas la peine de chercher plus loin.

## Application - branche `adjectives`

[![Travis CI][travis-badge-url]][travis-url]
[![Coverage][coveralls-badge-url]][coveralls-url]

L'application que l'on va utiliser est un petit serveur nodejs. Si vous ne connaissez pas
(ou n'aimez pas/détestez) Javascript, ne vous inquiétez pas, on aurait très bien pu faire ça dans
n'importe quel autre langage.
L'application suivra le concept du [cadavre exquis][cadavre-exquis-wiki]: (Nom, Adjectif, Verbe,
Complément),chacun contenu dans un service différent.
Ce serveur web est une API REST avec quelques endpoints permettant de modifier une partie du jeu.


[cadavre-exquis-wiki]: https://www.wikiwand.com/fr/Cadavre_exquis_(jeu)
[travis-badge-url]: https://api.travis-ci.org/1M0reBug/cpe-ws-docker.svg?branch=adjectives
[travis-url]: https://travis-ci.org/1M0reBug/cpe-ws-docker
[coveralls-badge-url]: https://coveralls.io/repos/github/1M0reBug/cpe-ws-docker/badge.svg?branch=adjectives
[coveralls-url]: https://coveralls.io/github/1M0reBug/cpe-ws-docker?branch=adjectives

### GET /

+ Response 200 (`application/json`)
Retourne un adjectif au hasard

```json
{
   "adjective": "beautiful",
    "ip": "192.168.0.33"
}
```

### POST /

Lorsqu'on ajoute un nouvel adjectif, la réponse consiste à le renvoyer, avec l'adresse
ip du serveur repondant.

+ Body
```json
{
    "adjective": "marvelous"
}
```

+ Reponse 200 (`application/json`)
```json
{
    "adjective": "marvelous",
    "ip": "192.168.0.33"
}
```

## Adjectifs par défaut

Par défaut on utilise la liste suivant d'adjectifs (dans la langue de Shakespeare):

+ great
+ boring
+ beautiful
+ mesmerizing
