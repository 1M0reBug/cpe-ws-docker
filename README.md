# CPE Workshop: Docker

Pour la préparation du workshop il est nécessaire d'avoir installé Docker au préalable.
Le site [docs.docker.com](https://docs.docker.com), fournit toutes les procédures nécessaires
quelque soit votre système d'exploitation.

Les éléments requis sont:
* [docker engine :arrow_upper_right:](https://docs.docker.com/engine/installation/) 
* [docker compose :arrow_upper_right:](https://docs.docker.com/compose/install/)

Si à l'issue de l'installation vous êtes capables de lancer le hello world, c'est l'essentiel, ce 
n'est pas la peine de chercher plus loin.

Une clef USB sera passée pour installer les images nécessaires et éviter de compter sur le réseau.
pour ce faire récupérez le dossier cpe-ws-docker sur votre ordinateur et lancer un terminal dans
le dossier (**sur votre ordinateur !**). Une fois que c'est fait vous pouvez lancer un

```shell
$ cd ~/Documents/src/cpe-ws-docker/
$ sudo docker load -i images.tar
``` 

sinon vous pouvez les installer à l'avance:

+ `sudo docker pull node:7.4.0-alpine`
+ `sudo docker pull mariadb:10.1.21`
+ `sudo docker pull swarm:1.2.6`

## But

Sur ce commit on arrive au bout de l'utilisation de l'application. On va juste essayer 
de créer un swarm dans lequel l'ensemble de notre application va tourner. 

On a ajouté un dispatcher qui permet d'utiliser un service au hasard dans le réseau privée.
Ainsi si un service a un alias de réseau `nouns`, on pourra le retrouver en cherchant par DNS le 
hostname `nouns`. Ce dernier ne sera accessible qu'au containers dans le même réseau.

Pour commencer il vous faut définir la variable `TEAM_NAME` dans le fichier `env.sh`. Ceci va
permettre d'ajouter un préfixe aux noms des services pour éviter les croisements. 

Chacun va builder l'image courante de son application (db et dispatcher inclus), soit 3 containers.
Une fois les images buildées on va ajouter votre ordinateur à notre cluster.

Pour ce faire, il faut attendre le token et l'adresse IP du manager. Ces éléments vous seront fournis
pendant l'atelier par slack ou facebook. Avec ces 2 éléments on pourra rejoindre le swarm comme suit

```shell
$ sudo docker swarm join --token <token> <ip>

This node joined a swarm as a worker
```
Pensez à vérifier que vous avez une des trois images `cpe-ws-docker/adjectives`, `cpe-ws-docker/nouns`,
`cpe-ws-docker/verbs` et `cpe-ws-docker/dispatcher` et `cpe-ws-docker/db` d'installée au moins sur
l'ensemble des PC.

À partir de là, tout peux arriver. [Un bug sur la version 1.12 de docker empêche la bonne découverte
des services sur le swarm](https://github.com/docker/docker/issues/24789).
Autrement dit il est possible que cela ne marche pas lors de l'atelier. 

Dans l'absolu, le service `dispatcher` utilise le nom du service auquel on veut accéder pour faire de
l'équilibrage de charge aléatoire entre les différents services répliqués sur l'ensemble des noeuds.
Ceux-ci peuvent toutefois être lancés sur la même machine en physique, mais ils doivent avoir une
adresse IP différente, qui doit s'afficher dans la réponse.

Si l'on se connecte à n'importe quel noeud en `http://localhost:8000/nouns`, on doit obtenir un nom
aléatoire et une adresse aléatoire des services nouns. L'adresse renvoyé provient directement du
service, autrement dit du container -> POC. 

On doit obtenir ce genre de réponse.

```json
{
    "noun": "dog",
    "ip": "10.0.0.5"
}
```

## Terminer l'atelier

il faut effectuer ces commandes:

```shell
$ sudo docker swarm leave
$ sudo docker ps -a 
$ sudo docker rm <images exited>
$ sudo docker rmi -f $(sudo docker images -f 'dangling=true')
$ sudo docker images -a
$ sudo docker rmi -f <images_a_supprimer>
```

Elles devraient permettre de supprimer l'ensemble des containers lancés pendant l'atelier,
mais aussi de nettoyer un peu. Penser à vérifier les containers qui tournent et à éliminer les
vieilles images qui prennent vite de la place !
 
## Build automatisé

### Application

Pour builder l'API REST dans un container il suffit de lancer:

```shell
$ sudo ./build.sh
```

Lors du premier lancement docker va se charger d'aller récupérer les images indiquées dans le
`Dockerfile` sur [hub.docker.com](https://hub.docker.com/), ou les récupérer sur votre ordinateur si
elle a déjà été téléchargée (voir ci-dessus).

Le script se contente de créer un nom pour l'image qu'il va builder et de lancer les 2 commandes
nécessaire pour builder et lancer.
À but pédagogique je vous invite à aller le visualiser.

## Application - branche `verbs`

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
   "verb": "eats",
    "ip": "192.168.0.33"
}
```

### POST /

Lorsqu'on ajoute un nouveau nom, la réponse consiste à le renvoyer, avec l'adresse
ip du serveur repondant.

+ Body
```json
{
    "verb": "runs"
}
```

+ Reponse 200 (`application/json`)
```json
{
    "verb": "runs",
    "ip": "192.168.0.33"
}
```

## Noms par défaut

Par défaut on utilise la liste suivant de verbes (dans la langue de Shakespeare):

+ eats
+ walks
+ sleeps

## Note

On a supprimé les tests qui prenaient trop de temps à maintenir.

Pour récupérer le binding de port pour le dispatcher :

```shell
sudo docker inspect \
  --format='{{range $p, $conf := .NetworkSettings.Ports}} \
  {{$p}} -> {{(index $conf 0).HostPort}} {{end}}' dispatcher
```
