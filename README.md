# CPE Workshop - Docker

<a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/">
    <img alt="Creative Commons License" style="border-width:0" 
        src="https://i.creativecommons.org/l/by-nc-sa/4.0/80x15.png" />
</a>

Le but de ce workshop est de présenter d'un manière pratique
l'utilisation des conteneurs dans un contexte de micro-services.
 
Sur ce dépôt, trois branches sont disponibles correspondant à 3
services différents. 
Chacun des service propose un mot qu'il soit adjectif, nom ou verbe.

Le but d'un tel service serait de fournir une API REST, pour récupérer
ces mots et rédiger un [cadavre exquis][cadavre-exquis-wiki].
Ainsi en utilisant une URL telle que `/verbs` on ferait appel au service
verbs, etc. Le cas présenté est évidemment là à but pédagogique.

[cadavre-exquis-wiki]: https://www.wikiwand.com/fr/Cadavre_exquis_(jeu)

## Pour éviter les problèmes de réseaux

### Serveur externe 

Quentin, nous propose gentiment d'utiliser un de ses serveurs
pour l'atelier. Cette solution semble tout à fait judicieuse.
Pour se connecter il faut choisir un des 6 serveurs (on le fera
lors de l'atelier). L'adresse IP: `79.137.110.100`.
login: `docker`, mdp: `yjc495tfFj`.
Voilà la redirection des ports des serveurs vers l'extérieur:

+ Port SSH Serveur X: `2200X`
+ Port 80 Serveur X: `808X`
+ Port 8000 Serveur X: `800X`
+ Port 3306 Serveur X: `3306X`

Ainsi lorsque je mentionerais le port `8000`, il vous faudra utiliser
le port correspondant à votre serveur spécifique.

### Clé USB

Je vous propose une clé USB qui contient les images à télécharger, 
il vous suffit de faire un:

```
$ docker load -i images.tar
```
 copiez aussi le dossier `node_modules`.


## Organisation du workshop

Chacune des étapes de l'atelier sont représentées par des tag git. 

```
+ init-nouns,p1-nouns
|
+ p2-nouns
|
+ p3-nouns
|
+ p4-nouns
```
Remplacer `nouns` par la branche de votre choix

Ceci permettra à ceux qui se seraient perdu en cours de récupérer les 
éléments précédents.

Pour faciliter le travail, je vous propose de vous placer sur le premier tag
et de créer une branche pour l'atelier:

```
$ git checkout init-nouns
$ git checkout -b dev
```

## 1/ Partie 1
tag: `init-[nouns,adjectives,verbs]`

Pour cette première partie il va vous falloir monter un conteneur de l'application
constituée par `index.js`. Ce serveur se lance sur le port 3000 et affiche un mot
aléatoire sur sa racine. Ainsi lorsque l'on se rend sur [http://localhost:3000/](http://localhost:3000/),
on doit obtenir un résultat similaire au suivant (en fonction de la branche courante).

```json
{
    "noun": "dog",
    "ip": "10.0.0.5"
}
```
Docker prévoit un format de fichier particulier qui va décrire quels sont les éléments que notre
conteneur doit utiliser: le [Dockerfile][dockerfile-reference].
Voici le genre d'information que l'on retrouve dans un fichier Dockerfile

```dockerfile
FROM [image]
COPY [src] [dest]
RUN [cmd]
EXPOSE [port]
CMD ["bin", "arg1", "arg2"]
```

Ce fichier est un moyen de décrire l'utilisation des images hébergées par défaut
sur le [hub docker][docker-hub]. Elles sont en général bien documentée et
permettent de prendre rapidement en main l'outil. 
Pour cette première phase je vous demande de rédiger un Dockerfile complet, en
ayant pour seul base cette ligne

```dockerfile
FROM node:7.4.0-alpine
```
Le conteneur devra afficher son résultat sur le port 8000

En utilisant sa documentation, il devrait vous être possible de builder et lancer
le conteneur avec la commande suivante:

```shell
$ docker build -t cpe-ws-docker/[nouns,adjectives,verbs]:latest .
$ docker run -it --rm -p 8000:3000 --name [nouns,adjectives,verbs] cpe-ws-docker/[nouns,adjectives,verbs]
```

Si votre conteneur fonctionne vous devriez voir un résultat similaire à ci-dessus
dans votre navigateur à l'adresse [http://localhost:8000](http://localhost:8000), ou
autre si vous utilisez le serveur
(par exemple [http://79.137.110.100:8001/](http://79.137.110.100:8001/) ).

Lorsque c'est chose faite vous pouvez aider les autres et sinon

```
$ git commit -m 'p1 dockerfile'
$ git rebase p2-[nouns,adjectives,verbs]
```

[dockerfile-reference]: https://docs.docker.com/engine/reference/builder/
[docker-hub]: https://hub.docker.com

## 2/ Partie 2
tag: `p2-[nous,adjectives,verbs]`

Dans cette partie on va utiliser une base de données MariaDB pour pouvoir stocker les
mots du service. Il va nous falloir utiliser un script précis que voilà pour initialiser
les données

```sql
CREATE TABLE IF NOT EXISTS adjectives (
    id int NOT NULL PRIMARY KEY AUTO_INCREMENT,
    word varchar(255) NOT NULL
);

INSERT INTO adjectives (word) VALUES ('great');
INSERT INTO adjectives (word) VALUES ('boring');
INSERT INTO adjectives (word) VALUES ('mesmerizing');
INSERT INTO adjectives (word) VALUES ('beautiful')
```

Dans le cas ci-dessus on a représenté les adjectifs, à vous d'adapter le contenu 
en fonction de la branche que vous avez choisi à la base. 

De la même manière que précédemment, nous allons utiliser une version particulière
de [MariaDB][hub-maria]. Je vous invite à aller consulter la documentation, pour
comprendre les différents mécanismes mis en jeux pour cette image.

Lorsque vous aurez compris l'utilisation, vous pourrez rédiger un Dockerfile
qui devra créer un mot de passe Root, une base de données par défaut, ainsi qu'un
utilisateur et son mot de passe, tout en injectant le script sql ci-dessus. 

**Attention** Cette partie est piège, lisez attentivement la documentation

Vous utiliserez les mêmes commandes (build et run) que précédemment en ajoutant
les éléments nécessaires, sachant que l'application attend désormais 4 variables
d'environnement:

+ `MYSQL_HOST`
+ `MYSQL_DATABASE`
+ `MYSQL_USER`
+ `MYSQL_PASSWORD`

Enfin, pour permettre aux 2 containers de communiquer entre eux, il va être nécessaire
de rajouter un flag lors de l'éxécution du container application: `--link [container_name]`

On peut utiliser des commandes comme la suivante:

```shell
$ docker build -t cpe-ws-docker/[nous,adjectives,verbs]
$ docker run -e MYSQL_ROOT_PASSWORD="password" --name nouns_db \
    -d cpe-ws-docker/nouns_db
$ docker run -e MYSQL_ROOT_PASSWORD="password" --name nouns \
    -d --link cpe-ws-docker/nouns_db cpe-ws-docker/nouns 
```

Si on ne souhaite pas utiliser l'option '-e' on peut ajouter une entrée dans le Dockerfile 

```dockerfile
...
ENV MYSQL_PASSWORD="password" \
    MYSQL_DATABASE="nouns"
...
```
Pour optimisation il est préférable de n'utiliser qu'une instruction `ENV`.

[hub-maria]: https://hub.docker/_/MariaDB
### Aller plus loin

Le système de linking repose sur un réseau privé qui existe entre tous les containers,
cette méthode est dépréciée par la documentation Docker (voir [ici][doc-links]).
On souhaite utiliser des réseaux privés virtuels spécifiques.

Pour ce faire on peut utiliser la commande `docker network create`, vous pouvez consulter l'aide
en faisant `docker network create --help`.
Une fois le réseau crée il faudra utiliser `--network [nom]` pour les deux lancements.

à la fin 

```
$ git commit -m 'p2 dockerfile BDD + networks and env'
$ git rebase p3-[nouns,adjectives,verbs]
```

[doc-links]: https://docs.docker.com/engine/userguide/networking/default_network/dockerlinks/
## 3/ Partie 3
tag: `p3-[nouns,adjectives,verbs]`

On remarque que l'utilisation de la simple ligne de commande commence à devenir fastidieux.
Docker propose un service qui permet d'organiser les build et run de plusieurs conteneurs,
ainsi que les interactions entre eux: [docker-compose][dc-doc].

Pour fonctionner docker-compose nécessite un fichier de configuration .yml, la plupart
du temps appelé `docker-compose.yml`. La syntaxe est la suivante:

```
version: "2.0"
services:
    [nom]:
        build: [dossier contenant un Dockerfile]
        image: [nom de l'image buildée]
        container_name: [nom du container lancé]
        networks:
        - [nom d'un premier réseau interne]
        - network
        volumes:
        - [sur disque]:[dans le container]
        - ./nginx.conf:/etc/nginx/nginx.conf:ro
        ports:
        - [local]:[container]
        - 8000:3000
        environment:
            MY_VAR: value
            FOO: bar
        depends_on:
        - [nom du service dont on dépend]
    [nom]:
        image: [image de base sur docker hub]
networks:
    [nom du network]:
```

je ne pourrais pas décrire l'ensemble des options disponibles elles sont trop nombreuses,
mais la documentation les décrit toutes. 

Je vous demande de traduire les commandes que vous avez réalisé jusque là en fichier docker-compose.
Le but est donc d'avoir 2 services qui tourneront : l'application et la BDD.

Pour corser un peu je vous demande de toujours rendre accessible l'application sur le port 8000,
mais d'empêcher l'accès depuis l'extérieur à la base de données.

Lorsque vous aurez rédigé le fichier vous pouvez utiliser les 2 commandes suivante

```shell
# dans le dossier où se situe docker-compose.yml, sinon ajouter l'option -f
$ docker-compose config
# build les images et les lance en tâche de fond avec la configuration rédigée
$ docker-compose up -d 
```

Si le service est accessible et fonctionnel à [http://localhost:8000](http://localhost:8000),
vous pouvez

```
$ git commit -m 'p3 docker-compose'
$ git rebase p4-[nouns,adjectives,verbs]
```

**Attention**: docker-compose est passé en version 3 récemment, mais nous utiliserons la 2 pour
les besoins du workshop.

[dc-doc]: https://docs.docker.com/compose/compose-file
## 4/ Partie 4
tag: `p4-[nouns,adjectives,verbs]`

*INFO* Dans cette partie, vous n'allez pas faire grand chose. De de plus il y a de fortes chances
que la fonctionnalité ne marche pas. 

Il vous est nécessaire d'installer l'image swarm:

```
$ docker pull swarm:latest
```

Dans cette partie on va essayer de créer un cluster avec l'ensemble des serveurs.
Pour ce faire je vais créer un manager principal, auprès duquel vous allez vous enregistrer
comme noeud de travail.

Vous allez recevoir par slack/facebook, une commande qui vous permettra de vous enregistrer
auprès du manager. 
Elle se présente comme suit:

```
$ docker swarm join --token [token] [ip]
```

Une fois cette commande saisie docker vous indique si vous faite partie du swarm ou non.

Par la suite, je vais lancer des services (nouns, adjectives et verbs en même temps).
Ces services devraient se répartir en fonction de la charge sur l'ensemble des serveurs.
Chacun des services sera dupliqué 4 fois.

Lorsque je vous l'indiquerais vous pourrez observer de nouveaux containers (que vous n'avez pas
lancé en `docker ps -a`).

Si swarm décide de fonctionner (bug fixé dans la v1.13), on devrait pouvoir utiliser
le dispatcher qui permet de taper sur un service répliqué au hasard en allant sur 
[http://localhost:8000/{nouns,adjectives,verbs}](http://localhost:8000/nouns).
L'adresse IP du container qui a pris en charge la requête devrait s'afficher
dans la réponse en JSON.

### Bundle

Avec la dernière version de docker-compose on va peut-être pouvoir utiliser la fonctionnalité
bundle qui permet de créer un container contenant l'ensemble des contraintes que l'on a écrite
dans le fichier `docker-compose.yml`.

Créez un compte sur [hub.docker.com](https://hub.docker.com/) je vous ajouterais à l'équipe `cpewsdocker`,
ce qui vous permettra de télécharger les images qui j'ai uploadé à l'avance.
Pour les déployer sur le swarm il faut qu'une image soit associé à un registry docker (que l'on
verra si nécessaire). 

Si vous êtes un noeud du swarm vous pouvez lancer la commande suivante, en replaçant, `VOTRE_NOM` par
votre nom.

```shell
$ docker-compose bundle -o VOTRE_NOM.dab
$ docker deploy VOTRE_NOM
$ docker service ls
```

## Conclusion

Nous sommes à la fin de l'aventure. Si vous êtes arrivés jusqu'ici, il ne vous reste plus
grand chose pour être courant en docker, si ce n'est de pratiquer!

> That's all Folks!

## Rermerciements

Ce workshop est largement inspiré de
[lab-docker][lab-docker-url] qui est
une ressource actualisée de l'utilisation avancée de Docker.

[lab-docker-url]: https://github.com/CodeStory/lab-docker

## Licence

<a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/">
    <img alt="Creative Commons License" 
        style="border-width:0" 
        src="https://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png" />
</a>
<br />
This work is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/">Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License</a>.