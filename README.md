# CPE Workshop: Docker

Pour la préparation du workshop il est nécessaire d'avoir installé Docker au préalable.
Le site [docs.docker.com](https://docs.docker.com), fournit toutes les procédures nécessaires
quelque soit votre système d'exploitation.

Les éléments requis sont:
* [docker engine :arrow_upper_right:](https://docs.docker.com/engine/installation/) 
* [docker compose :arrow_upper_right:](https://docs.docker.com/compose/install/)

Si à l'issue de l'installation vous êtes capables de lancer le hello world, c'est l'essentiel, ce 
n'est pas la peine de chercher plus loin.

## Application - branche `nouns`

L'application que l'on va utiliser est un petit serveur nodejs. Si vous ne connaissez pas
(ou n'aimez pas/détestez) Javascript, ne vous inquiétez pas, on aurait très bien pu faire ça dans
n'importe quel autre langage.
L'application suivra le concept du [cadavre exquis][cadavre-exquis-wiki]: (*Nom*, Adjectif, Verbe,
Complément),chacun contenu dans un service différent.
Ce serveur web est une API REST avec quelques endpoints permettant de modifier une partie du jeu.

[cadavre-exquis-wiki]: https://www.wikiwand.com/fr/Cadavre_exquis_(jeu)

### GET /

+ Response 200 (`application/json`)
Retourne un nom au hasard

```json
{
   "noun": "dog",
    "ip": "192.168.0.33"
}
```

### POST /

Lorsqu'on ajoute un nouveau nom, la réponse consiste à le renvoyer, avec l'adresse
ip du serveur repondant.

+ Body
```json
{
    "noun": "fish"
}
```

+ Reponse 200 (`application/json`)
```json
{
    "noun": "fish",
    "ip": "192.168.0.33"
}
```

## Noms par défaut

Par défaut on utilise la liste suivant de noms (dans la langue de Shakespeare):

+ dog
+ cat
+ Jean-Louis
