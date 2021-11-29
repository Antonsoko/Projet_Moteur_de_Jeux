let cnv = document.getElementById('myCanvas');
let context = cnv.getContext('2d');

window.addEventListener('resize', resizeCanvas, false);
function resizeCanvas() {
        cnv.width = window.innerWidth;
        cnv.height = window.innerHeight;
}
resizeCanvas();

class Pt {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    rotate(ref, angle) {
        let dx = this.x - ref.x;
        let dy = this.y - ref.y;
        let da = (Math.PI / 180) * angle;
        this.x = ref.x + dx * Math.cos(da) + dy * Math.sin(da);
        this.y = ref.y + dy * Math.cos(da) - dx * Math.sin(da);
    }
}
class Sgt {
    constructor(pt1, pt2) {
        this.pt1 = new Pt(pt1.x, pt1.y);
        this.pt2 = new Pt(pt2.x, pt2.y);
    }
    left(otherSgt) {
        return (cw(this.pt1, this.pt2, otherSgt.pt1) < 0 &&
            cw(this.pt1, this.pt2, otherSgt.pt2) < 0);
    }
    right(otherSgt) {
        return (cw(this.pt1, this.pt2, otherSgt.pt1) > 0 &&
            cw(this.pt1, this.pt2, otherSgt.pt2) > 0);
    }
    intersectionTest(otherSgt) {
        if (this.left(otherSgt) || this.right(otherSgt)) return false;
        if (otherSgt.left(this) || otherSgt.right(this)) return false
        if (cw(this.pt1, this.pt2, otherSgt.pt1) == 0 &&
            cw(this.pt1, this.pt2, otherSgt.pt2) == 0 &&
            cw(otherSgt.pt1, otherSgt.pt2, this.pt1) == 0 &&
            cw(otherSgt.pt1, otherSgt.pt2, this.pt2) == 0) return false;
        return true;
    }
}
function isIn(p0, P) { // Pt p0 is in polygon P ?
    let p1 = new Pt(0, 0); // infinite point or outside L
    let s0 = new Sgt(p0, p1);
    let nb_inters = 0;
    for (let i = 0; i < P.length; i++) {
        let s1;
        if (i == P.length - 1) s1 = new Sgt(P[i], P[0]);
        else s1 = new Sgt(P[i], P[i + 1]);
        if (s0.intersectionTest(s1)) nb_inters += 1;
    }
    return ((nb_inters % 2) == 1);
}
function cw(a, b, c) {
    return (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
}

//Class gérant les projectiles, avec :

// Coordonnées
// Vitesse
// Sprite
// Degats
// Frequence de tir
// taille
class projectile {
    constructor(x, y, vx, vy, src, degats, freq, size) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.src = src;
        this.degats = degats;
        this.frequence = freq;
        this.size = size;
    }
}

let all_img = [];
let img = new Image();
let anim_id = -1;
img.src = "./sprites/explosion.png";

//omportation image des explosions
img.onload = function() {
  let canvas1 = document.createElement('canvas');
  canvas1.width = 158*5;
  canvas1.height = 158*2;
  let context1 = canvas1.getContext('2d');
  context1.drawImage(img, 0,0,158*5,158*2);
  for(let j = 0; j < 2; j += 1) {
    let imax = 5;
    if(j == 2) { imax = 2; }
    for(let i = 0; i < imax; i += 1) {
      let canvasImageData1 = context1.getImageData(i*158, j*158, 158, 158);
      let canvas2 = document.createElement('canvas');
      canvas2.width = 158;
      canvas2.height = 158;
      let context2 = canvas2.getContext('2d');
      context2.putImageData(canvasImageData1, 0,0);
      all_img.push(canvas2);
    }
  }
  anim_id = 0;
};

var interval_r = null;
function explosiontest(point){
  let posX = 0;
  let posY = 0;
  let nbmax = 0;
  let explosion = [[anim_id,posX,posY]];
  explosion.push([0,0,0]);// sert a initialiser id de l'image
  
  let zoom = 2;
  interval_r = setInterval(
    function (){
  for(let i = 0;i<explosion.length;i++){
    explosion[i][1] = point.x;//position x
    explosion[i][2] = point.y;
      if(explosion[i][0] >= 0) {  
          context.drawImage(all_img[explosion[i][0]], explosion[i][1], explosion[i][2], 37*zoom, 48*zoom);
          explosion[i][0] += 1;
          if(explosion[i][0] == all_img.length) {
            explosion[i][0] = 0;
            clearInterval(interval_r);
            interval_r = null;
            explosion = [];
          }
      }
  }
},30);
  //ctx.clearRect(0, 0, cnv.width, cnv.h);
}

// Class Game qui va servir à gerer les différent lvl avec : 
//
// tableau des levels créé
// indice des levels
// Référence sur le level courant
// Booléan pour savoir si on a fini le niveau et passer au suivant.
//
// Initialisation : qui vérifie si il y a des levels créé.
// Next_level : qui passe au niveau suivant, si il n'y en a pas, le joueur gagne.

class Game {

    constructor(lvls) {
        this.levels = lvls;
        this.level_id = 0;
        this.current_level = null;
        this.finished = false;
    }

    initialisation() {
        if (this.levels.length != 0) {
            this.current_level = this.levels[0];
        }
        else{
            console.log("Pas levels crée");
        }
    }

    next_level() {
        this.level_id++;
        if (this.levels.length > this.level_id) {
            this.current_level = this.levels[this.level_id];
        } else {
            this.finished = true;
             console.log("perdu t'es nul lol mdr");
        clearInterval(setinterval_global_update_id);
        setinterval_global_update_id = null;
        clearInterval(setinterval_global_update_2_id);  
        setinterval_global_update_2_id = null; 
        clearInterval(setinterval_global_update_3_id);  
        setinterval_global_update_3_id = null; 
        clearInterval(setinterval_global_update_4_id);  
        setinterval_global_update_4_id = null; 

        clearInterval(setinterval_space_id);
        setinterval_space_id = null;
        myAudio.pause();
        myAudio = null;

        setTimeout(() => {
          context.drawImage(image_gagne,cnv.width/2-500,cnv.height/2-530 ,1000,1000);
          context.font = 'bold 100px Verdana, OCR A Std, serif';
          context.fillStyle = '#000';
          context.fillText('YOU WIN',cnv.width/2-235,cnv.height/2+75);
          context.fillStyle = '#FFF';
          context.fillText('YOU WIN',cnv.width/2-230,cnv.height/2+70);
        }, (50));
        }
    }
}

// Classe levels qui va servir à gerer les différentes waves ou manche d'un niveau, avec :
// 
// Tableau des wave/manches créée.
// l'image de fond du niveau
// taille de l'image du niveau
// L'image qu'on va afficher à chaque début de niveau.
//
// Initialisation : on vérifie si les waves/manches existes.
// Next_wave : On passe à la wave suivante.
// Affiche_img_lvl : On affiche la l'image qui préscide le numéro du level.

class levels {
    constructor(tab_of_wave, img, size, imglvl) {
        this.number_of_wave = tab_of_wave.length;
        this.waves = tab_of_wave;
        this.wave_id = 0;
        this.current_wave = 0;
        this.finished = false;
        this.img = img;
        this.size = size;
        this.img_level = imglvl;
        this.time_img_lvl = 3000;
    }

    initialisation() {
        if (this.waves.length >= 0) {
            this.current_wave = this.waves[0];
            this.wave_id = 0;
        }
        else{
            console.log("ERROR : Pas de wave");
        }
    }

    next_wave() {
        changement_arme();
        this.wave_id++;
        if (this.waves.length > this.wave_id) {
            this.current_wave = this.waves[this.wave_id];
        } else {
            this.finished = true;
            console.log("level finished");
        }

    }

    affiche_img_lvl() {
        let img = new Image();
        img.src = this.img_level;
        this.time_img_lvl -= 15;
        context.drawImage(img, cnv.width / 2 - 400, cnv.height / 2 - 100, img.width, img.height);


    }
}
// Class Bonus /!\ ne fonctionne pas /!\
// Etait prévu pour lorsque le joueur tue un enemeie il y ai un bonus qui tombe avec une certaine chance.
class bonus {
    constructor(x, y, type, img, size) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.img = img;
        this.size = size;
    }
}
function spawn_bonus(type) {
    let x_ = Math.round(Math.random() * (cnv.width - 300) + 150);
    let bonus_1;

    switch (type) {
        case 1:
            bonus_1 = new bonus(x_, -300, 'WP', './sprites/sat_1.png', 0.3); //changement arme
            break;
        case 2:
            bonus_1 = new bonus(x_, -300, 'LVL', './sprites/sat_1.png', 0.3); //ajoute niveau arme
            break;
        case 3:
            bonus_1 = new bonus(x_, -300, 'LF', './sprites/sat_1.png', 0.3); //vie
            break;
    }

    List_Bonus.append(bonus_1);
}


// Class wave qui gère le déroulement d'une wave, avec : 
//
// Nombre d'ennemie dans la wave
// Tabeau des ennemies 
// Le nombre d'ennemie differents.
// Nombre d'ennemie en vie
// Nombre d'ennemie mort
// Nombre d'ennemie Total
// Bouléan pour savoir si on la wave est finie.
// Bouléan pour savoir si la wave à été commencée.
//
// Create_wave : Fait spawn les ennemies aléatoirement en x en déhors du canvas, toutes les 1.5 secondes.

class wave {
    constructor(nb_ennemie, tab_ennemie) {
        this.nb_ennemies = nb_ennemie;
        this.ennemie_tab = tab_ennemie;
        this.nb_of_ennemie = tab_ennemie.length;
        this.ennemie_en_vie = 0;
        this.ennemie_mort = 0;
        this.ennemie_total = nb_ennemie;
        this.wave_end = false;
        this.HasSpawn = false;
    }

    create_wave() {
        let ennemie_restant_a_spawner = this.ennemie_total;

        let tab = this.ennemie_tab;

        let spawninterval = setInterval(
            function() {
                if (ennemie_restant_a_spawner <= 0) {
                    clearInterval(spawninterval);
                    game.current_level.current_wave.wave_end = true;
                    spawninterval = null;
                } else {
                    let nb_ennemie_a_spawn = Math.floor(Math.random() * 3) + 3;

                    if ((ennemie_restant_a_spawner - nb_ennemie_a_spawn) < 0) {
                        nb_ennemie_a_spawn = ennemie_restant_a_spawner;
                    }



                    let type_ennemie = Math.floor(Math.random() * game.current_level.current_wave.nb_of_ennemie);

                    let ennemie_a_spawn = tab[type_ennemie];

                    if (ennemie_a_spawn == ennemie_5) {
                        nb_ennemie_a_spawn = 1;
                    }

                    ennemie_restant_a_spawner -= nb_ennemie_a_spawn;

                    let y_ = -300;
                    let x_ = Math.floor(Math.random() * (cnv.width - 500));

                    for (let i = 0; i < nb_ennemie_a_spawn; i++) {
                        let x__ = x_ + (100 * i * (ennemie_a_spawn.size * 10));

                        let ennemie_1 = new Enemy(x__, y_, x__, y_, ennemie_a_spawn.vit, ennemie_a_spawn.type, ennemie_a_spawn.vie, ennemie_a_spawn.img, ennemie_a_spawn.projectile, ennemie_a_spawn.size, ennemie_a_spawn.proj_type);

                        game.current_level.current_wave.ennemie_en_vie++;

                        //ennemie_1.shoot_enemi();
                        List_Enemy.append(ennemie_1);

                    }
                }
            }, 1500
        );

    }
}

// Class Enemy avec :
//
// Coordonnées
// Coordonnées relative
// vitesse selon x et y
// Type de l'ennemie,
// Vie
// Sprite
// Un tableau avec les 4 points de collisions de l'ennemie calculé à partir de ses coordonnées x,y
// Le projectile qu'il tir
// Taille
// Type qui sert à determiné si il tir 1 ou plusieur projectil à la fois.
// Iterateur qui sert à déterminé quand est ce qu'il va tirer son projectile.
//
// draw_collisions : Dessine la collision de l'ennemie, sert uniquement pour le débug.
// shoot_ennemie : Ici on test la variable proj_type, pour savoir quel fonction de tir on va choisir.
// Iteration_shoot : Permet de calculer en fonction de l'update global quand est ce qu'il tir.
class Enemy {
    constructor(x, y, x_aux, y_aux, vit, type, vie, img, projectile_, size, pjts) {
        this.x = x;
        this.y = y;
        this.x_aux = x_aux;
        this.y_aux = y_aux;
        this.vit = vit;
        this.vit_x = vit/2;
        this.type = type;
        this.vie = vie;
        this.img = img;
        this.face_collision = [new Pt(this.x, this.y - 30 * (size * 10)), new Pt(this.x, this.y + 70 * (size * 10)), new Pt(this.x + 55 * (size * 10), this.y + 70 * (size * 10)), new Pt(this.x + 55 * (size * 10), this.y - 30 * (size * 10))];
        this.projectile = projectile_;
        this.size = size;
        this.proj_type = pjts;
        this.id_iterator = 0;
    }

    draw_collision() {
        context.beginPath();
        context.lineWidth = 2;
        context.strokeStyle = "grey";
        context.moveTo(this.face_collision[0].x, this.face_collision[0].y);
        context.lineTo(this.face_collision[1].x, this.face_collision[1].y);

        context.moveTo(this.face_collision[1].x, this.face_collision[1].y);
        context.lineTo(this.face_collision[2].x, this.face_collision[2].y);

        context.moveTo(this.face_collision[2].x, this.face_collision[2].y);
        context.lineTo(this.face_collision[3].x, this.face_collision[3].y);

        context.moveTo(this.face_collision[3].x, this.face_collision[3].y);
        context.lineTo(this.face_collision[0].x, this.face_collision[0].y);
        context.stroke();
        context.closePath();
    }

    shoot_enemi() {

        switch (this.proj_type) {
            case 0:
                break;
            case 1:
                tir_2.play();
                ennemie_shoot_simple(this, this.projectile);
                break;
            case 2:
                tir_2.play();
                ennemie_shoot_double(this, this.projectile);
                break;
            case 3:
                tir_2.play();
                ennemie_shoot_triple(this, this.projectile);
                break;
            case 4:

                ennemie_shoot_arc_cercle(this, this.projectile, 1);
                //ennemie_shoot_arc_cercle(this,this.projectile,-1);
                break;
            case 5:
                ennemie_shoot_arc_cercle(this, this.projectile, -1);
                break;
            
        }

    }

    iteration_shoot() {
        this.id_iterator += 15

        if (this.id_iterator >= this.projectile.frequence) {
            this.id_iterator = 0;
            this.shoot_enemi();
        }
    }
}
// Class decors
//
// Coordonnées
// Sprite (On) créer l'image en même temps).
// taille 
// vitesse en y
class decors {
    constructor(x, y, src, size, vy) {
        this.x = x;
        this.y = y;
        let image_ = new Image();
        image_.src = src;
        this.image = image_;
        this.size = size;
        this.vy = vy;
    }
}
// Fonction utilisé par shoot_ennemie (vu plus haut)
// tir un projectile
function ennemie_shoot_simple(ennemie, projec) {
    let proj_cp = projec;
    let proj = new projectile(ennemie.x, ennemie.y, proj_cp.vx, proj_cp.vy, proj_cp.src, proj_cp.degats, proj_cp.freq, proj_cp.size);
    List_projectile_Enemy.append(proj);
}
// Tir deux projectiles
function ennemie_shoot_double(ennemie, projec) {
    let proj_cp = projec;
    let proj_1 = new projectile(ennemie.x - (100 * ennemie.size), ennemie.y, proj_cp.vx, proj_cp.vy, proj_cp.src, proj_cp.degats, proj_cp.freq, proj_cp.size);
    let proj_2 = new projectile(ennemie.x + (100 * ennemie.size), ennemie.y, proj_cp.vx, proj_cp.vy, proj_cp.src, proj_cp.degats, proj_cp.freq, proj_cp.size);
    List_projectile_Enemy.append(proj_1);
    List_projectile_Enemy.append(proj_2);
}
// TIr trois projectiles
function ennemie_shoot_triple(ennemie, projec) {
    let proj_cp = projec;
    let proj_1 = new projectile(ennemie.x - (150 * ennemie.size), ennemie.y, proj_cp.vx, proj_cp.vy, proj_cp.src, proj_cp.degats, proj_cp.freq, proj_cp.size);
    let proj_2 = new projectile(ennemie.x, ennemie.y + (100 * ennemie.size), proj_cp.vx, proj_cp.vy, proj_cp.src, proj_cp.degats, proj_cp.freq, proj_cp.size);
    let proj_3 = new projectile(ennemie.x + (150 * ennemie.size), ennemie.y, proj_cp.vx, proj_cp.vy, proj_cp.src, proj_cp.degats, proj_cp.freq, proj_cp.size);
    List_projectile_Enemy.append(proj_1);
    List_projectile_Enemy.append(proj_2);
    List_projectile_Enemy.append(proj_3);
}
// Tir 15 projectiles en cercle.
function ennemie_shoot_arc_cercle(ennemie, projec, sens) {

    let proj_cp = projec;
    let nb_a_shooter = 0;
    let angle = 0;
    let vitesse = projec.vy;
    var tir_5 = document.createElement("audio");
    tir_5.src = "./Mp3/tir_long.mp3";
    tir_5.play();
    let shoot_in_circle = setInterval(
        function() {
            if (nb_a_shooter >= 15 || ennemie.vie <= 0) {
                clearInterval(shoot_in_circle);
                shoot_in_circle = null;
                tir_5.pause();
            } else {

                angle += 0.20;
                let vx_ = vitesse * Math.cos(angle * sens);
                let vy_ = vitesse * Math.sin(angle);
                nb_a_shooter++;
                let proj_1 = new projectile(ennemie.x + 50, ennemie.y + 50, vx_, vy_, proj_cp.src, proj_cp.degats, proj_cp.freq, proj_cp.size);
                List_projectile_Enemy.append(proj_1);

            }
        }, 100);
}
// Function qui sert à la classe ennemie, on itère sur chaque ennemie, le temps qu'il lui reste à attendre pour tirer à partir de la fonction globale update.
function iteration_enemi_shoot(liste) {
    let current = liste.get_head();

    while (current) {
        if(current.element.projectile != null){
            current.element.iteration_shoot();
            
        }
        current = current.next;
    }
}

// Class Player
//
// Coordonées
// vie
// points /!\ pas implementé /!\
// Tableau de points calculé à partir des coordonnées délimitant la collisions du joueur.
class Player {
    constructor(x, y, vie) {
        this.x = x;
        this.y = y;
        this.vie = vie;
        this.points = 0;
        this.face_collision = [new Pt(this.x - 35, this.y), new Pt(this.x - 35, this.y + 70), new Pt(this.x + 15, this.y + 70), new Pt(this.x + 15, this.y)];
    }
}
// Fonction qui test la vie du joueur, si celle si est inferieur à 0, on arrête le jeux et on lui affiche game over.
function joueur_test_vie() {

    if (Joueur.vie <= 0) {
        console.log("perdu t'es nul lol mdr");
        clearInterval(setinterval_global_update_id);
        setinterval_global_update_id = null;
        clearInterval(setinterval_global_update_2_id);  
        setinterval_global_update_2_id = null; 
        clearInterval(setinterval_global_update_3_id);  
        setinterval_global_update_3_id = null; 
        clearInterval(setinterval_global_update_4_id);  
        setinterval_global_update_4_id = null; 

        clearInterval(setinterval_space_id);
        setinterval_space_id = null;
        myAudio.pause();
        myAudio = null;

        setTimeout(() => {
          context.drawImage(image_mort,cnv.width/2-400,cnv.height/2-450,700,700);
          context.font = 'bold 100px Verdana, OCR A Std, serif';
          context.fillStyle = '#000';
          context.fillText('GAME OVER',cnv.width/2-375,cnv.height/2+305);
          context.fillStyle = '#F00';
          context.fillText('GAME OVER',cnv.width/2-370,cnv.height/2+300);
        }, (50));
        
    }
}

// Liste chainée
function LinkedListFactory() {
    let head = null;
    let length = 0;
    return {
        append,
        indexOf,
        remove,
        removeAt,
        toString,
        get_head,
        get_length,
    };

    function append(element) {
        const node = {
            element,
            next: null,
        };
        if (head === null) {
            head = node
        } else {
            let currentNode = head;
            while (currentNode.next !== null) {
                currentNode = currentNode.next;
            }
            currentNode.next = node;
        }
        length++;
    }

    function indexOf(element) {
        let nodeIndex = 0;
        let currentNode = head;
        while (currentNode) {
            if (element === currentNode.element) {
                return nodeIndex;
            }
            nodeIndex++;
            currentNode = currentNode.next;
        }
        return -1;
    }

    function removeAt(position) {
        const isPositionInTheRange = position > -1 && position < length;
        if (!isPositionInTheRange) {
            return null;
        }
        let currentNode = head;
        if (position === 0) {
            head = null;
            head = currentNode.next;
        } else {
            let index = 0;
            let previousNode = null;
            while (index++ < position) {
                previousNode = currentNode;
                currentNode = currentNode.next;
            }
            previousNode.next = currentNode.next;
            currentNode = null;

        }
        length--;
        //return currentNode.element;
    }

    function remove(element) {

        const elementIndex = indexOf(element);
        removeAt(elementIndex);
    }

    function toString() {
        let result = "";
        let current = head;
        while (current) {
            result += `${current.element}${current.next ? ", " : ""}`;
            current = current.next;
        }
        return result;
    }

    function get_head() {
        return head;
    }

    function get_length() {
        return length;
    }
}

// Déclaration de liste chainée Globales
const List_projectile_joueur = new LinkedListFactory();
const List_projectile_Enemy = new LinkedListFactory();
const List_Enemy = new LinkedListFactory();
const List_Bonus = new LinkedListFactory();


// Objets préfabriqués

// Projectiles des ennemies : 
let projectile_1_ennemie = new projectile(0, 0, 0, 28, './sprites/beams_green.png', 20, 3000, 1);
let projectile_2_ennemie = new projectile(0, 0, 0, 30, './sprites/beams_red.png', 40, 1500, 1);
let projectile_3_ennemie = new projectile(0, 0, 0, 28, './sprites/beams_blue_ball.png', 50, 3000, 2);
let projectile_4_ennemie = new projectile(0, 0, 0, 23, './sprites/beams_red.png', 100, 4500, 2);
let projectile_5_ennemie = new projectile(0, 0, 0, 23, './sprites/beams_blue.png', 15, 4500, 1.5);

// Projectiles du joueur : 
let projectile_1_joueur = new projectile(0, 0, 0, -18, './sprites/beams_blue.png', 50, 400, 1.5);
let projectile_2_joueur = new projectile(0, 0, 0, -36, './sprites/beams_red.png', 100, 700, 1);

// Enemies : 
let ennemie_1 = new Enemy(0, 0, 0, 0, 1.5, 'Normal', 50, './sprites/Enemy_n_2.png', projectile_1_ennemie, 0.075, 1);
let ennemie_2 = new Enemy(0, 0, 0, 0, 3.5, 'Normal', 20, './sprites/Enemy_n_1.png', projectile_2_ennemie, 0.075, 1);
let ennemie_3 = new Enemy(0, 0, 0, 0, 2, 'Normal', 200, './sprites/Enemy_n_1.png', projectile_3_ennemie, 0.15, 1);
let ennemie_4 = new Enemy(0, 0, 0, 0, 1, 'Normal', 400, './sprites/Enemy_n_2.png', projectile_4_ennemie, 0.22, 1);
let ennemie_5 = new Enemy(0, 0, 0, 0, 1, 'Normal', 800, './sprites/Enemy_n_2.png', projectile_5_ennemie, 0.22, 4);
let ennemie_6 = new Enemy(0, 0, 0, 0, 5, 'Tourne', 100, './sprites/Enemy_r_1.png', null, 0.075, 0);
let ennemie_7 = new Enemy(0, 0, 0, 0, 4, 'Tourne', 150, './sprites/Enemy_r_2.png', null, 0.15, 0);


// Variable globales : 
let Fond_space_1_i1 = new Image();
let Vaisseau_joueur = new Image();
Vaisseau_joueur.src = './sprites/Joueur.png';
let coord_fond_1;
let coord_fond_2;
let poussiere_tab = [];
let nb_poussière = 100;
let trainée = [];
let bout_trainée = [0, 0];
var lvl_canon = 5;
let type_canon = 2;
let frequence_tir_joueur = 1000;

let Joueur = new Player(cnv.width / 2 - 50, cnv.height- 150, 10000); //x,y,vie
let tab_decors_plan_1 = [];
let tab_decors_plan_2 = [];
let tab_decors_plan_3 = [];
let tab_decors_plan_4 = [];

// tableau des elements de décors.
let decors_sprites_plan_1 = ['./sprites/sat_1.png', './sprites/rock_1.png', './sprites/rock_2.png', './sprites/rock_3.png','./sprites/asteroid_3.png','./sprites/asteroid_4.png','./sprites/asteroid_5.png','./sprites/asteroid_6.png','./sprites/asteroid_7.png','./sprites/asteroid_8.png'];
let decors_sprites_plan_2 = ['./sprites/rock_1.png', './sprites/rock_2.png', './sprites/rock_3.png','./sprites/asteroid_3.png','./sprites/asteroid_4.png','./sprites/asteroid_5.png','./sprites/asteroid_6.png','./sprites/asteroid_7.png','./sprites/asteroid_8.png'];
let decors_sprites_plan_3 = ['./sprites/planet_2.png', './sprites/planet_3.png', './sprites/planet_4.png', './sprites/planet_5.png', './sprites/planet_6.png', './sprites/planet_7.png', './sprites/planet_8.png', './sprites/planet_10.png', './sprites/planet_11.png', './sprites/planet_12.png'];
let decors_sprites_plan_4 = ['./sprites/planet_2.png', './sprites/planet_3.png', './sprites/planet_4.png', './sprites/planet_5.png', './sprites/planet_6.png', './sprites/planet_7.png', './sprites/planet_8.png', './sprites/planet_10.png', './sprites/planet_11.png', './sprites/planet_12.png'];

// Fichier audios : 
let myAudio = document.createElement("audio");
myAudio.src = "./Mp3/Music1.mp3";
let tir_1 = document.createElement("audio");
tir_1.src = "./Mp3/Tir_1.mp3";
let tir_2 = document.createElement("audio");
tir_2.src = "./Mp3/Tir_2.mp3";
let tir_3 = document.createElement("audio");
tir_3.src = "./Mp3/Tir_3.mp3";
let tir_4 = document.createElement("audio");
tir_4.src = "./Mp3/tir_cour.mp3";
let tir_5 = document.createElement("audio");
tir_5.src = "./Mp3/tir_long.mp3";
let image_mort = new Image();
image_mort.src = './sprites/mort.png';
let image_gagne = new Image();
image_gagne.src = './sprites/gagne.png';

// Initialise les différents plans du décors.
init_decors_(tab_decors_plan_1, decors_sprites_plan_1, 3.5);
init_decors_(tab_decors_plan_2, decors_sprites_plan_2, 3);
init_decors_(tab_decors_plan_3, decors_sprites_plan_3, 2);
init_decors_(tab_decors_plan_4, decors_sprites_plan_4, 1.5);

function init_decors_(tab_decors, decors_sprites, n) {
    for (var i = 0; i < 10; i++) {
        var x_ = Math.round(Math.random() * cnv.width - 300);
        var y_ = -(((i + 1) * 800 * (4 / n)) + 800);
        let rand = Math.round(Math.random() * (decors_sprites.length - 1));
        
        let size_;
        if(n == 1.5){
            size_ = 0.25;
        }
        else{
            size_ = 2 / n;
        }
        
        let vy_ = 0.4 * (Math.exp(n + 0.5) / 15);
        let decor = new decors(x_, y_, decors_sprites[rand], size_, vy_);
        tab_decors.push(decor);
    }
}

// Fonction qui sert à chercher les ennemies que le joueur doit détruire, 
//
// Il se déplace en fonction des ennemies les plus bas,
// Si un ennemies est trop bas il ne cherchera plus à le détruire et le laissera passer.
function joueur_cherche_ennemie() {

    let x_joueur = Joueur.x;
    let y_joueur = Joueur.y;
    let current = List_Enemy.get_head();

    let y_enemi_pb = 0;

    let ennemie_a_trouve = null;
    while (current) {
        let y_enemi = current.element.y;
        if (y_enemi > y_enemi_pb && y_joueur - 250 > y_enemi) {
            y_enemi_pb = y_enemi;
            ennemie_a_trouve = current.element;
        }
        current = current.next;
    }

    if (ennemie_a_trouve == null && setinterval_space_id) {
        joueur_tir();
    } else if (ennemie_a_trouve && setinterval_space_id == null) {
        joueur_tir();
    }



    if (ennemie_a_trouve) {
        if (x_joueur > ennemie_a_trouve.x) {
            dash_left();
        }
        if (x_joueur < ennemie_a_trouve.x) {
            dash_right();
        }
    }


}

// Fonction testant la vie d'un ennemie. Si sa vie est infèrieur à 0, on le détruit et actualise les informations sur la wave courrante.
function test_vie(liste, element) {
    var explo_1 = document.createElement("audio");
    explo_1.src = "./Mp3/explo_1.mp3";
    if (element.vie <= 0) {

        game.current_level.current_wave.ennemie_en_vie--;
        game.current_level.current_wave.ennemie_mort++;
        explo_1.play();
        //console.log("En vie : ",Enemis_Vivant,"Mort : ",Enemis_mort,"Total : ", Total_enemis);
        liste.remove(element);

    }
}
// Fonction qui affiche les projectiles, avec un code commenté qui sert à affiché le point de collisions de chacun des projectiles.
function affiche_projectile(liste) {
    let current = liste.get_head();

    while (current) {
        let image = new Image();
        image.src = current.element.src;
        let grandeur = current.element.size;

        context.drawImage(image, current.element.x, current.element.y, image.width * grandeur, image.height * grandeur);

        /*
          context.beginPath();
          context.lineWidth = 2;
          context.strokeStyle = "grey";
          context.rect(current.element.x+25,current.element.y+20,10,10);
          context.stroke();
          context.closePath(); 
        */

        current = current.next;
    }
}
var ang = 0

// Fonction qui affiche les ennemies.
function affiche_enemy(liste) {

    let current = liste.get_head();

    while (current) {
        let image = new Image();
        image.src = current.element.img;

        let img_enemy_tourne = new Image();
        img_enemy_tourne.src = current.element.img;

        let grandeur = current.element.size;
        if (current.element.type == 'Tourne') {
            context.save()
            context.translate(current.element.x, current.element.y)
            context.rotate(Math.PI / 180 * (ang += 0.2))

            context.drawImage(image, (-image.width / 2) * grandeur, (-image.height / 2) * grandeur, (image.width) * grandeur, (image.height) * grandeur)
            context.restore()
        } else {
            context.drawImage(image, current.element.x, current.element.y, image.width * grandeur, image.height * grandeur);
            //current.element.draw_collision();
        }
        current = current.next;
    }
}
// Fonction qui affiches les bonus /!\ Non foncionnelle /!\
function affiche_bonus(liste) {

    let current = liste.get_head();

    while (current) {
        let image = new Image();
        image.src = current.element.img;

        let grandeur = current.element.size;
        context.drawImage(image, current.element.x, current.element.y, image.width * grandeur, image.height * grandeur);
        //current.element.draw_collision();
        current = current.next;
    }
}
// Fonction qui actualise les positions des projectiles en fonction de leurs coordonnées et de leurs vitesse en x et en y.
function update_pos_projectiles(liste) {
    let current = liste.get_head();
    while (current) {

        current.element.x += current.element.vx;
        current.element.y += current.element.vy;

        if (current.element.y < -100 || current.element.y > cnv.height || current.element.x < -150 || current.element.x > cnv.width) {
            liste.remove(current.element);
            //current= null;
            break;
        }
        current = current.next;
    }
}
// Fonction qui actualise les positions des ennemies en fonction de leurs coordonnées et de leurs vitesse en x et en y, et en même actualise leurs points de collisions
function update_pos_enemy_normaux(liste) {
    let current = liste.get_head();

    while (current) {



        if(current.element.type == 'Tourne'){
            let vit = current.element.vit;
            current.element.y += vit;
    
            current.element.face_collision[0].y += vit;
            current.element.face_collision[1].y += vit;
            current.element.face_collision[2].y += vit;
            current.element.face_collision[3].y += vit;

            
            if(current.element.x-30 < current.element.x_aux){
                current.element.vit_x = - current.element.vit_x;
            }
            if(current.element.x+30> current.element.x_aux){
                current.element.vit_x = - current.element.vit_x;
            }

            let vitx = current.element.vit_x;

            current.element.x += vitx;
            current.element.face_collision[0].x += vitx;
            current.element.face_collision[1].x += vitx;
            current.element.face_collision[2].x += vitx;
            current.element.face_collision[3].x += vitx;
        }
        else{
            let vit = current.element.vit;
            current.element.y += vit;
    
            current.element.face_collision[0].y += vit;
            current.element.face_collision[1].y += vit;
            current.element.face_collision[2].y += vit;
            current.element.face_collision[3].y += vit;
        }

        let current_a_détruire = current;

        current = current.next;

        if (current_a_détruire.element.y >= cnv.height) {
            game.current_level.current_wave.ennemie_en_vie--;
            game.current_level.current_wave.ennemie_mort++;
            liste.remove(current_a_détruire.element);
            //current_a_détruire = null;
        }
    }
}
// Fonction qui actualise la position des bonus /!\ Non foncionnelle /!\
function update_pos_bonus(liste) {
    let current = liste.get_head();

    while (current) {

        let vit = 10;
        current.element.y += vit;
        let current_a_détruire = current;

        current = current.next;

        if (current_a_détruire.element.y >= cnv.height) {
            liste.remove(current_a_détruire.element);
        }
    }
}
// Fonction qui test pour chaque projectiles si il collisionne un autre objets
// Un projectile n'a comme surface de collision qu'un points, mais le joueur et les ennemies, on un tableau de 4 points qui créent une surface de collisions.
// Ici on test donc un point : le projectile, et un tableau de points avec la fonction IsIn().
function test_collision_projectiles(liste_colliders, liste_collided) {
    let current_Lpj = liste_colliders.get_head(); //liste projectile joueur

    while (current_Lpj) {
        let point_a_test = new Pt(current_Lpj.element.x + 25, current_Lpj.element.y + 20);
        let current_Le = liste_collided.get_head(); //liste enemy
        while (current_Le) {
            let surface_collision_a_test = current_Le.element.face_collision;
            if (isIn(point_a_test, surface_collision_a_test)) {
                explosiontest(point_a_test);
                current_Le.element.vie -= current_Lpj.element.degats;
                test_vie(liste_collided, current_Le.element);
                liste_colliders.remove(current_Lpj.element);
                //current_Lpj = null;
            }
            current_Le = current_Le.next;
        }

        current_Lpj = current_Lpj.next;
    }
}
// Ici on test pour une liste de projectile s'il touche le joueur.
function test_collision_joueur(liste) {

    let current_Lpe = liste.get_head();
    let tableau_a_test = Joueur.face_collision;

    while (current_Lpe) {
        let point_a_test = new Pt(current_Lpe.element.x + 25, current_Lpe.element.y + 20);
        if (isIn(point_a_test, tableau_a_test)) {
            Joueur.vie -= current_Lpe.element.degats;
            joueur_test_vie();
            liste.remove(current_Lpe.element);
            //current_Lpe = null;
        }

        current_Lpe = current_Lpe.next;
    }
}
// Ici on test pour tous les ennemies du type 'Tourne' si il touche le joueur.
// Donc Pour chaque points de la surface d'un ennemie on test si il se trouve dans la surface de collisions du joueur. et on itère sur les 3 autres points de l'ennemie.
function test_collision_ennemie_joueur(liste) {
    let current_Lpe = liste.get_head();
    let tableau_a_test = Joueur.face_collision;

    while (current_Lpe) {
        if(current_Lpe.element.type == 'Tourne'){
            for(var i = 0;i< 4 ;i++){   
                let point_a_test = current_Lpe.element.face_collision[i];
                if (isIn(point_a_test, tableau_a_test)) {
                    Joueur.vie -= 20;
                    joueur_test_vie();
                    game.current_level.current_wave.ennemie_en_vie--;
                    game.current_level.current_wave.ennemie_mort++;
                    liste.remove(current_Lpe.element);
                }
            }
        }
        current_Lpe = current_Lpe.next;
    }

}

for (let i = 0; i < nb_poussière; i++) {
    let poussiere = [0, 0, 0];
    if (i % 2 == 0) {
        poussiere = [Math.round(Math.random() * cnv.width), Math.round(Math.random() * cnv.height), Math.round(Math.random() * 3) + 0.25];
    } else {
        poussiere = [Math.round(Math.random() * cnv.width), Math.round(Math.random() * cnv.height), Math.round(Math.random() * 10 + 5)];
    }
    poussiere_tab.push(poussiere);
}
// Fonction qui dessine tout le jeu.
function draw() {

    context.clearRect(0, 0, cnv.width ,cnv.height)
    let size_ = game.current_level.size;
    context.drawImage(Fond_space_1_i1, coord_fond_1[0], coord_fond_1[1], Fond_space_1_i1.width * size_, Fond_space_1_i1.height * size_);
    context.drawImage(Fond_space_1_i1, coord_fond_2[0], coord_fond_2[1], Fond_space_1_i1.width * size_, Fond_space_1_i1.height * size_);

    for (var i = 0; i < tab_decors_plan_4.length; i++) {
        var size = tab_decors_plan_4[i].size / 2;
        context.drawImage(tab_decors_plan_4[i].image, tab_decors_plan_4[i].x, tab_decors_plan_4[i].y, tab_decors_plan_4[i].image.width * size, tab_decors_plan_4[i].image.height * size);
    }
    for (var i = 0; i < tab_decors_plan_3.length; i++) {
        var size = tab_decors_plan_3[i].size;
        context.drawImage(tab_decors_plan_3[i].image, tab_decors_plan_3[i].x, tab_decors_plan_3[i].y, tab_decors_plan_3[i].image.width * size, tab_decors_plan_3[i].image.height * size);
    }
    for (var i = 0; i < tab_decors_plan_2.length; i++) {
        var size = tab_decors_plan_2[i].size;
        context.drawImage(tab_decors_plan_2[i].image, tab_decors_plan_2[i].x, tab_decors_plan_2[i].y, tab_decors_plan_2[i].image.width * size, tab_decors_plan_2[i].image.height * size);
    }
    for (var i = 0; i < tab_decors_plan_1.length; i++) {
        var size = tab_decors_plan_1[i].size;
        context.drawImage(tab_decors_plan_1[i].image, tab_decors_plan_1[i].x, tab_decors_plan_1[i].y, tab_decors_plan_1[i].image.width * size, tab_decors_plan_1[i].image.height * size);
    }

    for (let i = 0; i < poussiere_tab.length; i++) {
        context.beginPath();
        context.arc(poussiere_tab[i][0], poussiere_tab[i][1], Math.random() * 0.5 + 1.5, 0, 2 * Math.PI);
        context.fillStyle = "#FFFFFF";
        context.fill();
        context.closePath();
    }

    affiche_projectile(List_projectile_joueur);
    affiche_projectile(List_projectile_Enemy);
    affiche_enemy(List_Enemy);
    //affiche_enemy(List_Bonus);
    iteration_enemi_shoot(List_Enemy);

    context.drawImage(Vaisseau_joueur, Joueur.x - 54, Joueur.y, Vaisseau_joueur.width * 0.1, Vaisseau_joueur.height * 0.1);

    /*
    context.beginPath();
    context.lineWidth = 2;
    context.strokeStyle = "grey";
    
    context.moveTo(Joueur.face_collision[0].x,Joueur.face_collision[0].y);
    context.lineTo(Joueur.face_collision[1].x,Joueur.face_collision[1].y);

    context.moveTo(Joueur.face_collision[1].x,Joueur.face_collision[1].y);
    context.lineTo(Joueur.face_collision[2].x,Joueur.face_collision[2].y);

    context.moveTo(Joueur.face_collision[2].x,Joueur.face_collision[2].y);
    context.lineTo(Joueur.face_collision[3].x,Joueur.face_collision[3].y);

    context.moveTo(Joueur.face_collision[3].x,Joueur.face_collision[3].y);
    context.lineTo(Joueur.face_collision[0].x,Joueur.face_collision[0].y);
    context.stroke();
    context.closePath(); 

    */
    
    if (game.current_level.time_img_lvl > 0) {
        game.current_level.affiche_img_lvl();
    }
}
// Fonction qui actualise les coordonnées de l'image de fond, des poussières, des elements de décors, des ennemies, et des projectiles.
function update_pos() {

    let size = game.current_level.size;
    if (coord_fond_1[1] >= cnv.height) {
        coord_fond_1 = [0, -(Fond_space_1_i1.height * size - cnv.height)];
        coord_fond_2 = [0, -(Fond_space_1_i1.height * size - cnv.height) - Fond_space_1_i1.height * size];
    } else {
        coord_fond_1[1] += 0.15;
        coord_fond_2[1] += 0.15;
    }

    for (let i = 0; i < poussiere_tab.length; i++) {
        if (poussiere_tab[i][1] > cnv.height) {
            poussiere_tab[i][1] = 0;
        } else {
            poussiere_tab[i][1] += poussiere_tab[i][2];
        }

    }

    for (var i = 0; i < tab_decors_plan_1.length; i++) {
        tab_decors_plan_1[i].y += tab_decors_plan_1[i].vy;

        if (tab_decors_plan_1[i].y > cnv.height + 100) {
            tab_decors_plan_1[i].y -= 8800;
        }
    }

    for (var i = 0; i < tab_decors_plan_2.length; i++) {
        tab_decors_plan_2[i].y += tab_decors_plan_2[i].vy;

        if (tab_decors_plan_2[i].y > cnv.height + 100) {
            tab_decors_plan_2[i].y -= 8800;
        }
    }
    for (var i = 0; i < tab_decors_plan_3.length; i++) {
        tab_decors_plan_3[i].y += tab_decors_plan_3[i].vy;

        if (tab_decors_plan_3[i].y > cnv.height + 100) {
            tab_decors_plan_3[i].y -= 8800;
        }
    }
    for (var i = 0; i < tab_decors_plan_4.length; i++) {
        tab_decors_plan_4[i].y += tab_decors_plan_4[i].vy;

        if (tab_decors_plan_4[i].y > cnv.height + 100) {
            tab_decors_plan_4[i].y -= 8800;
        }
    }



    update_pos_enemy_normaux(List_Enemy);
    //update_pos_bonus(List_Bonus);
    update_pos_projectiles(List_projectile_joueur);
    update_pos_projectiles(List_projectile_Enemy);

}
// Fonction qui sert à switcher entre 2 armes, à changé si on veut plus de 2 armes.
function changement_arme() {
    if (type_canon == 1) {
        type_canon = 2;
    } else if (type_canon == 2) {
        type_canon = 1;
    }
    choosing_type_canon(type_canon);
}
function lerp(start, end, amt) {
    return (1 - amt) * start + amt * end;
}
// Fonction qui affiche la vie du joueur, et la wave courante.
function affiche_info_joueur(){
    context.font = 'bold 70px Verdana, OCR A Std, serif';
    context.fillStyle = '#48B';
    context.fillText('LIFE ' + Joueur.vie,50,cnv.height-50);
    context.fillText('WAVE ' + (game.current_level.wave_id+1),cnv.width-350,cnv.height-50);
}

// variable globale et référence sur les setInterval des dash, pour pouvoir ne faire qu'un seul dash à la fois dans nimporte quelle direction.
var intervalid_dr = null;
var intervalid_dl = null;
var intervalid_du = null;
var intervalid_dd = null;
// 4 Fonctions dash qui font bouger le joueur.
function dash_right() {
    let x_vise = Joueur.x + 80;
    if (Joueur.x < cnv.width - 100 && candash()) {
        intervalid_dr = setInterval(
            function() {
                if (Joueur.x >= x_vise) {
                    clearInterval(intervalid_dr);
                    intervalid_dr = null;
                } else {
                    let prout = lerp(Joueur.x, x_vise, 0.2);
                    Joueur.x = prout + 3;
                    Joueur.face_collision[0].x = prout + 3 - 35;
                    Joueur.face_collision[1].x = prout + 3 - 35;
                    Joueur.face_collision[2].x = prout + 3 + 15;
                    Joueur.face_collision[3].x = prout + 3 + 15;
                }
            }, 5);
    }
}
function dash_left() {
    let x_vise = Joueur.x - 80;
    if (Joueur.x > 100 && candash()) {
        intervalid_dl = setInterval(
            function() {
                if (Joueur.x <= x_vise) {
                    clearInterval(intervalid_dl);
                    intervalid_dl = null;
                } else {
                    let prout = lerp(Joueur.x, x_vise, 0.2);
                    Joueur.x = prout - 3;
                    Joueur.face_collision[0].x = prout - 3 - 35;
                    Joueur.face_collision[1].x = prout - 3 - 35;
                    Joueur.face_collision[2].x = prout - 3 + 15;
                    Joueur.face_collision[3].x = prout - 3 + 15;
                }
            }, 5);
    }

}
function dash_up() {
    let y_vise = Joueur.y - 80;

    intervalid_du = setInterval(
        function() {
            if (Joueur.y <= y_vise) {
                clearInterval(intervalid_du);
                intervalid_du = null;
            } else {
                let prout = lerp(Joueur.y, y_vise, 0.2);
                Joueur.y = prout - 3;

                Joueur.face_collision[0].y = prout - 3;
                Joueur.face_collision[1].y = prout - 3 + 70;
                Joueur.face_collision[2].y = prout - 3 + 70;
                Joueur.face_collision[3].y = prout - 3;
            }
        }, 5);

}
function dash_down() {
    let y_vise = Joueur.y + 80;

    intervalid_dd = setInterval(
        function() {
            if (Joueur.y >= y_vise) {
                clearInterval(intervalid_dd);
                intervalid_dd = null;
            } else {
                let prout = lerp(Joueur.y, y_vise, 0.2);
                Joueur.y = prout + 3;


                Joueur.face_collision[0].y = prout + 3;
                Joueur.face_collision[1].y = prout + 3 + 70;
                Joueur.face_collision[2].y = prout + 3 + 70;
                Joueur.face_collision[3].y = prout + 3;
            }
        }, 5);
}
function candash() {
    if (intervalid_dr == null && intervalid_dl == null && intervalid_du == null && intervalid_dd == null) {
        return true;
    }
    return false;
}
window.addEventListener('keydown', keydown_fun, false);
let setinterval_space_id = null;
// Fonction qui écoute le clavié du joueur.
function keydown_fun(e) {

    switch (e.code) {
        case "ArrowRight":
            if (Joueur.x < cnv.width - 100 && candash()) {
                dash_right();
            }
            break;
        case "ArrowLeft":
            if (Joueur.x > 100 && candash()) {
                dash_left();
            }
            break;
        case "ArrowUp":
            if (Joueur.y > 100 && candash()) {
                dash_up();
            }
            break;
        case "ArrowDown":
            if (Joueur.y < cnv.height - 100 && candash()) {
                dash_down();
            }
            break;
        case "Space":
            joueur_tir();
            break;
        case "Enter":
          clearInterval(affiche_ecran_titre_id);
          affiche_ecran_titre_id = null;
          start_game();
          
        
          myAudio.play();

          break;
    }

}

// Fonction qui siwtch entre tirer ou non.
function joueur_tir() {
    if (setinterval_space_id == null) {
        setinterval_space_id = setInterval(PlayerShooting, frequence_tir_joueur);
    } else {
        clearInterval(setinterval_space_id);
        setinterval_space_id = null;
    }
}

let projectile_1 = new projectile(0, 0, 0, 0, 0, 0, 0, 0);
let projectile_1_1 = new projectile(0, 0, 0, 0, 0, 0, 0, 0);
let projectile_1_2 = new projectile(0, 0, 0, 0, 0, 0, 0, 0);
let projectile_2 = new projectile(0, 0, 0, 0, 0, 0, 0, 0);
let projectile_3 = new projectile(0, 0, 0, 0, 0, 0, 0, 0);
let projectile_4 = new projectile(0, 0, 0, 0, 0, 0, 0, 0);
let projectile_5 = new projectile(0, 0, 0, 0, 0, 0, 0, 0);


// Fonction qui en fonction du type d'arme du joueur, créer différents projectiles.
function choosing_type_canon(type_canon) {

    let vx_ = 0;
    let vy_ = 0;
    let src_ = 0;
    let degats_ = 0;
    let freq_ = 0;
    let size_ = 0;

    switch (type_canon) {
        case 1:

            vx_ = projectile_1_joueur.vx;
            vy_ = projectile_1_joueur.vy;
            src_ = projectile_1_joueur.src;
            degats_ = projectile_1_joueur.degats;
            freq_ = projectile_1_joueur.frequence;
            size_ = projectile_1_joueur.size;

            projectile_1 = new projectile(0, 0, vx_, vy_, src_, degats_, freq_, size_);
            projectile_1_1 = new projectile(0, 0, vx_ - 1, vy_ + 1, src_, degats_, freq_, size_);
            projectile_1_2 = new projectile(0, 0, vx_ + 1, vy_ + 1, src_, degats_, freq_, size_);
            projectile_2 = new projectile(0, 0, vx_ - 2.7, vy_ + 2, src_, degats_, freq_, size_);
            projectile_3 = new projectile(0, 0, vx_ + 2.7, vy_ + 2, src_, degats_, freq_, size_);
            projectile_4 = new projectile(0, 0, vx_ - 5.2, vy_ + 2.7, src_, degats_, freq_, size_);
            projectile_5 = new projectile(0, 0, vx_ + 5.2, vy_ + 2.7, src_, degats_, freq_, size_);

            frequence_tir_joueur = freq_;
            break;

        case 2:

            vx_ = projectile_2_joueur.vx;
            vy_ = projectile_2_joueur.vy;
            src_ = projectile_2_joueur.src;
            degats_ = projectile_2_joueur.degats;
            freq_ = projectile_2_joueur.frequence;
            size_ = projectile_2_joueur.size;

            projectile_1 = new projectile(0, 0, vx_, vy_, src_, degats_, freq_, size_);
            projectile_1_1 = new projectile(15, 0, vx_, vy_, src_, degats_, freq_, size_);
            projectile_1_2 = new projectile(-22, 0, vx_, vy_, src_, degats_, freq_, size_);
            projectile_2 = new projectile(35, 25, vx_, vy_, src_, degats_, freq_, size_);
            projectile_3 = new projectile(-45, 25, vx_, vy_, src_, degats_, freq_, size_);
            projectile_4 = new projectile(75, 50, vx_, vy_, src_, degats_, freq_, size_);
            projectile_5 = new projectile(-85, 50, vx_, vy_, src_, degats_, freq_, size_);

            frequence_tir_joueur = freq_;
            break;

    }
}
// Fonction qui en fonction du niveau d'amre du joueur, instancie différents projectiles.
function PlayerShooting() {

    var x = Joueur.x - 15;
    var y = Joueur.y - 20;

    if (type_canon == 1) {
        tir_4.play();
    } else if (type_canon == 2) {
        tir_1.play();
    }

    let projectile_1_ = new projectile(projectile_1.x, projectile_1.y, projectile_1.vx, projectile_1.vy, projectile_1.src, projectile_1.degats, projectile_1.freq, projectile_1.size);
    projectile_1_.x += x;
    projectile_1_.y += y;

    let projectile_1_1_ = new projectile(projectile_1_1.x, projectile_1_1.y, projectile_1_1.vx, projectile_1_1.vy, projectile_1_1.src, projectile_1_1.degats, projectile_1_1.freq, projectile_1_1.size);
    projectile_1_1_.x += x;
    projectile_1_1_.y += y;

    let projectile_1_2_ = new projectile(projectile_1_2.x, projectile_1_2.y, projectile_1_2.vx, projectile_1_2.vy, projectile_1_2.src, projectile_1_2.degats, projectile_1_2.freq, projectile_1_2.size);
    projectile_1_2_.x += x;
    projectile_1_2_.y += y;

    let projectile_2_ = new projectile(projectile_2.x, projectile_2.y, projectile_2.vx, projectile_2.vy, projectile_2.src, projectile_2.degats, projectile_2.freq, projectile_2.size);
    projectile_2_.x += x;
    projectile_2_.y += y;

    let projectile_3_ = new projectile(projectile_3.x, projectile_3.y, projectile_3.vx, projectile_3.vy, projectile_3.src, projectile_3.degats, projectile_3.freq, projectile_3.size);
    projectile_3_.x += x;
    projectile_3_.y += y;

    let projectile_4_ = new projectile(projectile_4.x, projectile_4.y, projectile_4.vx, projectile_4.vy, projectile_4.src, projectile_4.degats, projectile_4.freq, projectile_4.size);
    projectile_4_.x += x;
    projectile_4_.y += y;

    let projectile_5_ = new projectile(projectile_5.x, projectile_5.y, projectile_5.vx, projectile_5.vy, projectile_5.src, projectile_5.degats, projectile_5.freq, projectile_5.size);
    projectile_5_.x += x;
    projectile_5_.y += y;


    switch (lvl_canon) {
        case 1:
            List_projectile_joueur.append(projectile_1_);
            break;

        case 2:
            List_projectile_joueur.append(projectile_1_1_);
            List_projectile_joueur.append(projectile_1_2_);
            break;
        case 3:
            List_projectile_joueur.append(projectile_1_);
            List_projectile_joueur.append(projectile_2_);
            List_projectile_joueur.append(projectile_3_);
            break;
        case 4:
            List_projectile_joueur.append(projectile_1_1_);
            List_projectile_joueur.append(projectile_1_2_);
            List_projectile_joueur.append(projectile_2_);
            List_projectile_joueur.append(projectile_3_);
            break;
        case 5:
            List_projectile_joueur.append(projectile_1_);
            List_projectile_joueur.append(projectile_2_);
            List_projectile_joueur.append(projectile_3_);
            List_projectile_joueur.append(projectile_4_);
            List_projectile_joueur.append(projectile_5_);
            break;

    }


}

function update() {
    draw();
    update_pos();
    affiche_info_joueur();
}
function update2() {
    test_collision_projectiles(List_projectile_joueur, List_Enemy);
    test_collision_joueur(List_projectile_Enemy);
    test_collision_ennemie_joueur(List_Enemy);
    
}

let setinterval_global_update_id = null;
let setinterval_global_update_2_id = null;
let setinterval_global_update_3_id = null;
let setinterval_global_update_4_id = null;


// Fonction qui démare le jeu, en initialisant l'image de fond à l'image du premier niveau.
function start_game() {

    Fond_space_1_i1.src = game.current_level.img;
    let size = game.current_level.size;
    coord_fond_1 = [0, -(Fond_space_1_i1.height * size - cnv.height)];
    coord_fond_2 = [0, -(Fond_space_1_i1.height * size - cnv.height) - Fond_space_1_i1.height * size];
    setinterval_global_update_id = setInterval(update, 15);
    setinterval_global_update_2_id = setInterval(update2, 30);
    setinterval_global_update_3_id = setInterval(current, 500);
    setinterval_global_update_4_id = setInterval(joueur_cherche_ennemie, 100);
    changement_arme();
    joueur_tir();
}

// Fonction Qui va tester toutes les n secondes si on doit passer à la wave suivante ou au niveau suivant, en fonction des ennemies vivant, mort, et totaux de la wave en cours.
function current() {
    let e_t = game.current_level.current_wave.ennemie_total;
    let e_m = game.current_level.current_wave.ennemie_mort;
    let e_v = game.current_level.current_wave.ennemie_en_vie;

    if (!game.current_level.current_wave.HasSpawn) {
        game.current_level.current_wave.create_wave();
        game.current_level.current_wave.HasSpawn = true;
    }
    if (e_t == e_m && game.current_level.current_wave.wave_end) {
        game.current_level.next_wave();
    }

    if (game.current_level.finished) {
        game.next_level();
        Fond_space_1_i1.src = game.current_level.img;

    }
}

// Objets préfabriqué : 

// Waves du level 1
let wave1_1 = new wave(1, [ennemie_1]);
let wave2_1 = new wave(1, [ennemie_1, ennemie_2]);
let wave3_1 = new wave(1, [ennemie_2, ennemie_3, ennemie_4, ennemie_5]);
let wave4_1 = new wave(1, [ennemie_5, ennemie_4]);

// Création du level 1 avec un tableau de wave;
let level_1 = new levels([wave1_1,wave2_1,wave3_1,wave4_1], './sprites/space_9.jpg', 2, './Image/lvl1.png');

let wave1_2 = new wave(1, [ennemie_1]);
let wave2_2 = new wave(1, [ennemie_1, ennemie_2,ennemie_6]);
let wave3_2 = new wave(1, [ennemie_1, ennemie_3, ennemie_4, ennemie_5,ennemie_6]);
let wave4_2 = new wave(1, [ennemie_1, ennemie_2, ennemie_4, ennemie_5,ennemie_6,ennemie_7]);

let level_2 = new levels([wave1_2, wave2_2, wave3_2, wave4_2], './sprites/space_8.jpg', 2, './Image/lvl2.png');

let wave1_3 = new wave(20, [ennemie_1]);
let wave2_3 = new wave(30, [ennemie_1, ennemie_2]);
let wave3_3 = new wave(50, [ennemie_1, ennemie_3, ennemie_4]);
let wave4_3 = new wave(100, [ennemie_1, ennemie_2,ennemie_3, ennemie_4, ennemie_5,ennemie_6,ennemie_7]);

let level_3 = new levels([wave1_3, wave2_3, wave3_3, wave4_3], './sprites/space_4.jpg', 2, './Image/lvl3.png');

// Initialisation des levels, pour vérifié si on a des érreurs
level_1.initialisation();
level_2.initialisation();
level_3.initialisation();

// Instantiation du jeu avec une liste des levels,
let game = new Game([level_1,level_2,level_3]);
// On vérifie qu'il n'y ai pas dérreurs.
game.initialisation();


// affichage de l'écran titre.
function draw_ecran_titre() {

    let img_titre_jeu = new Image();
    img_titre_jeu.src = './Image/nom_jeu.png';

    let img_titre_fond = new Image();
    img_titre_fond.src = './sprites/space_9.jpg';

    context.drawImage(img_titre_fond, 0, -(img_titre_fond.height * 2 - cnv.height), img_titre_fond.width * 2, img_titre_fond.height * 2);

    for (let i = 0; i < poussiere_tab.length; i++) {
        context.beginPath();
        context.arc(poussiere_tab[i][0], poussiere_tab[i][1], Math.random() * 0.5 + 1.5, 0, 2 * Math.PI);
        context.fillStyle = "#FFFFFF";
        context.fill();
        context.closePath();
    }

    for (let i = 0; i < poussiere_tab.length; i++) {
        if (poussiere_tab[i][1] > cnv.height) {
            poussiere_tab[i][1] = 0;
        } else {
            poussiere_tab[i][1] += poussiere_tab[i][2];
        }

    }

    context.drawImage(Vaisseau_joueur, Joueur.x - 54, Joueur.y, Vaisseau_joueur.width * 0.1, Vaisseau_joueur.height * 0.1);
    context.drawImage(img_titre_jeu, 300, 100, img_titre_jeu.width * 1.5, img_titre_jeu.height * 1.5);

    context.font = 'bold 50px Verdana, OCR A Std, serif';
    context.fillStyle = '#000';
    context.fillText('PRESS ENTER TO PLAY',cnv.width/2-335,cnv.height/2+55);
    context.fillStyle = '#F00';
    context.fillText('PRESS ENTER TO PLAY',cnv.width/2-330,cnv.height/2+50);
    
}
// Lorsqu'on load la page, on lance direment l'écran titre du jeu.
let affiche_ecran_titre_id = setInterval(draw_ecran_titre, 15);
