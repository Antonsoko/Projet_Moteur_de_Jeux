let cnv = document.getElementById('myCanvas');
let context = cnv.getContext('2d');

class Pt {
  constructor(x, y) {
    this.x = x; this.y = y;
  }
  rotate(ref, angle) {
      let dx = this.x - ref.x;
      let dy = this.y - ref.y;
      let da = (Math.PI / 180) * angle;
      this.x = ref.x + dx*Math.cos(da) + dy*Math.sin(da);
      this.y = ref.y + dy*Math.cos(da) - dx*Math.sin(da);
  }
}
class Sgt {
  constructor(pt1,pt2) {
    this.pt1 = new Pt(pt1.x,pt1.y);
    this.pt2 = new Pt(pt2.x,pt2.y);
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
    if(this.left(otherSgt) || this.right(otherSgt)) return false;
    if(otherSgt.left(this) || otherSgt.right(this)) return false
    if(cw(this.pt1, this.pt2, otherSgt.pt1) == 0 &&
      cw(this.pt1, this.pt2, otherSgt.pt2) == 0 &&
      cw(otherSgt.pt1, otherSgt.pt2, this.pt1) == 0 &&
      cw(otherSgt.pt1, otherSgt.pt2, this.pt2) == 0) return false;
    return true;
  }
} 
function isIn(p0, P) { // Pt p0 is in polygon P ?
  let p1 = new Pt(0,0); // infinite point or outside L
  let s0 = new Sgt(p0, p1);
  let nb_inters = 0;
  for (let i = 0; i < P.length; i++) {
    let s1;
    if(i == P.length-1) s1 = new Sgt(P[i], P[0]);
    else s1 = new Sgt(P[i], P[i+1]);
    if(s0.intersectionTest(s1)) nb_inters += 1;
  }
return ((nb_inters%2) == 1);
}
function cw(a,b,c) {
  return (b.x - a.x)*(c.y-a.y) - (b.y-a.y)*(c.x-a.x);
}
class projectile{
  constructor(x,y,vx,vy,src,degats,freq,size){
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
class Game{

    constructor(lvls){
      this.levels = lvls;
      this.level_id = 0;
      this.current_level = null;
      this.finished = false;
    }

    initialisation(){
      if(this.levels.length != 0){
        this.current_level = this.levels[0];
      }
    }

    next_level(){
      this.level_id++;
      if(this.levels.length > this.level_id){
        this.current_level = this.levels[this.level_id];
      }
      else{
        this.finished = true;
        console.log("level finished");
      }
    }
}

class levels{
  constructor(tab_of_wave,img,size){
    this.number_of_wave = tab_of_wave.length;
    this.waves = tab_of_wave;
    this.wave_id = 0;
    this.current_wave = 0;
    this.finished = false;
    this.img = img;
    this.size = size;
  }

  initialisation(){
    if(this.waves.length >= 0){
      this.current_wave = this.waves[0];
      this.wave_id = 0;
    }
  }

  next_wave(){
    this.wave_id++;
    if(this.waves.length > this.wave_id){
      this.current_wave = this.waves[this.wave_id];
    }
    else{
      this.finished = true;
      console.log("level finished");
    }
  }
}


class wave{
  constructor(nb_enemie,tab_enemie,nbe){
    this.nb_enemies = nb_enemie;
    this.enemie_tab = tab_enemie;
    this.nb_of_enemie = nbe;
    this.enemie_en_vie = 0;
    this.enemie_mort = 0;
    this.enemie_total = nb_enemie;
    this.wave_end = false;
    this.HasSpawn = false;
  }

  create_wave(){
    let enemie_restant_a_spawner = this.enemie_total;

    let tab = this.enemie_tab;

    let spawninterval = setInterval(
      function(){
        if(enemie_restant_a_spawner <= 0){
          clearInterval(spawninterval);
          game.current_level.current_wave.wave_end = true;
          spawninterval = null;
        }
        else{
          let nb_enemie_a_spawn = Math.floor(Math.random() * 3)+1;

          if((enemie_restant_a_spawner - nb_enemie_a_spawn)< 0){
            nb_enemie_a_spawn = enemie_restant_a_spawner;
          }
          


          let type_enemie = Math.floor(Math.random() * game.current_level.current_wave.nb_of_enemie);

          let enemie_a_spawn = tab[type_enemie];

          if(enemie_a_spawn ==  enemie_5){
            nb_enemie_a_spawn = 1;
          }

          enemie_restant_a_spawner -= nb_enemie_a_spawn;

          let y_ = -300;
          let x_ = Math.floor(Math.random() * (cnv.width-500));

          for(let i = 0;i<nb_enemie_a_spawn;i++){
            let x__ = x_ + (100*i*(enemie_a_spawn.size*10));

            let enemie_1 = new Enemy(x__,y_,x__,y_,enemie_a_spawn.vit,enemie_a_spawn.type,enemie_a_spawn.vie,enemie_a_spawn.img,enemie_a_spawn.projectile,enemie_a_spawn.size,enemie_a_spawn.proj_type);
            
            game.current_level.current_wave.enemie_en_vie++;
            
            //enemie_1.shoot_enemi();
            List_Enemy.append(enemie_1);

          }
        }
      }
    ,2000
    );
    
  }
}


class Enemy{
  constructor(x,y,x_aux,y_aux,vit,type,vie,img,projectile_,size,pjt){
    this.x = x;
    this.y = y;
    this.x_aux = x_aux;
    this.y_aux = y_aux;
    this.vit = vit;
    this.type = type;
    this.vie = vie;
    this.img = img;
    this.face_collision = [new Pt(this.x,this.y-30*(size*10)),new Pt(this.x,this.y+70*(size*10)),new Pt(this.x+55*(size*10),this.y+70*(size*10)),new Pt(this.x+55*(size*10),this.y-30*(size*10))];
    this.projectile = projectile_;
    this.size = size;
    this.proj_type = pjt;
    this.id_iterator = 0;
  }

  draw_collision(){
    context.beginPath();
    context.lineWidth = 2;
    context.strokeStyle = "grey";
    context.moveTo(this.face_collision[0].x,this.face_collision[0].y);
    context.lineTo(this.face_collision[1].x,this.face_collision[1].y);

    context.moveTo(this.face_collision[1].x,this.face_collision[1].y);
    context.lineTo(this.face_collision[2].x,this.face_collision[2].y);

    context.moveTo(this.face_collision[2].x,this.face_collision[2].y);
    context.lineTo(this.face_collision[3].x,this.face_collision[3].y);

    context.moveTo(this.face_collision[3].x,this.face_collision[3].y);
    context.lineTo(this.face_collision[0].x,this.face_collision[0].y);
    context.stroke();
    context.closePath(); 
  }

  create_face_collision(){
    this.face_collision = [new Pt(this.x,this.y-30*(size*10)),new Pt(this.x,this.y+70*(size*10)),new Pt(this.x+55*(size*10),this.y+70*(size*10)),new Pt(this.x+55*(size*10),this.y-30*(size*10))];
  }

  change_coord(x,y){
    this.x = x;
    this.y = y;
    this.create_face_collision();
  }

  change_src(src){
    this.img = src;
  }

  shoot_enemi(){
    
    switch(this.proj_type){
      case 1 :
        enemie_shoot_simple(this,this.projectile);
      break;
      case 2 :
        enemie_shoot_double(this,this.projectile);
      break;
      case 3 :
        enemie_shoot_triple(this,this.projectile);
      break;
      case 4 :
        enemie_shoot_arc_cercle(this,this.projectile,1);
        //enemie_shoot_arc_cercle(this,this.projectile,-1);
      break;
      case 5 :
        enemie_shoot_arc_cercle(this,this.projectile,-1);
      break;

    }
    
  }

  iteration_shoot(){
    this.id_iterator += 15

    if(this.id_iterator >=this.projectile.frequence){
      this.id_iterator = 0;
      this.shoot_enemi();
    }
  }
}
class decors{
  constructor(x,y,src,size,vy){
    this.x = x;
    this.y = y;
    let image_ = new Image();
    image_.src = src;
    this.image = image_;
    this.size = size;
    this.vy = vy;
    
  }
}

function enemie_shoot_simple(enemie,projec){
  let proj_cp = projec;
  let proj = new projectile(enemie.x,enemie.y,proj_cp.vx,proj_cp.vy,proj_cp.src,proj_cp.degats,proj_cp.freq,proj_cp.size);
  List_projectile_Enemy.append(proj);
}

function enemie_shoot_double(enemie,projec){
  let proj_cp = projec;
  let proj_1 = new projectile(enemie.x-(100*enemie.size),enemie.y,proj_cp.vx,proj_cp.vy,proj_cp.src,proj_cp.degats,proj_cp.freq,proj_cp.size);
  let proj_2 = new projectile(enemie.x+(100*enemie.size),enemie.y,proj_cp.vx,proj_cp.vy,proj_cp.src,proj_cp.degats,proj_cp.freq,proj_cp.size);
  List_projectile_Enemy.append(proj_1);
  List_projectile_Enemy.append(proj_2);
}

function enemie_shoot_triple(enemie,projec){
  let proj_cp = projec;
  let proj_1 = new projectile(enemie.x-(150*enemie.size),enemie.y,proj_cp.vx,proj_cp.vy,proj_cp.src,proj_cp.degats,proj_cp.freq,proj_cp.size);
  let proj_2 = new projectile(enemie.x,enemie.y+(100*enemie.size),proj_cp.vx,proj_cp.vy,proj_cp.src,proj_cp.degats,proj_cp.freq,proj_cp.size);
  let proj_3 = new projectile(enemie.x+(150*enemie.size),enemie.y,proj_cp.vx,proj_cp.vy,proj_cp.src,proj_cp.degats,proj_cp.freq,proj_cp.size);
  List_projectile_Enemy.append(proj_1);
  List_projectile_Enemy.append(proj_2);
  List_projectile_Enemy.append(proj_3);
}

function enemie_shoot_arc_cercle(enemie,projec,sens){
  console.log("prout");
  let proj_cp = projec;
  let nb_a_shooter = 0;
  let angle = 0;
  let vitesse = projec.vy;
  let shoot_in_circle = setInterval(  
    function(){
      if(nb_a_shooter>=15 || enemie.vie <= 0){
        clearInterval(shoot_in_circle);
        shoot_in_circle = null;
      }
      else{
        angle+=0.20;
        let vx_ = vitesse*Math.cos(angle*sens);
        let vy_ = vitesse*Math.sin(angle);
        nb_a_shooter++;
        let proj_1 = new projectile(enemie.x+50,enemie.y+50,vx_,vy_,proj_cp.src,proj_cp.degats,proj_cp.freq,proj_cp.size);
        List_projectile_Enemy.append(proj_1);
        
      }
    }
  ,100); 
}

function iteration_enemi_shoot(liste){
  let current = liste.get_head();

  while(current){
    current.element.iteration_shoot();
    current = current.next;
  }
}

class Player{
  constructor(x,y,vie){
    this.x = x;
    this.y = y;
    this.vie = vie;
    this.points = 0;
    this.face_collision = [new Pt(this.x-23,this.y),new Pt(this.x-23,this.y+100),new Pt(this.x+50,this.y+100),new Pt(this.x+50,this.y)];
  }
}
function joueur_test_vie(){

  if(Joueur.vie <= 0){
    console.log("perdu t'es nul lol mdr");
  }
}
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
  function get_head(){
    return head;
  }
  function get_length(){
    return length;
  }
}

const List_projectile_joueur = new LinkedListFactory();
const List_projectile_Enemy = new LinkedListFactory();
const List_Enemy = new LinkedListFactory();

let projectile_1_enemie = new projectile(0,0,0,35,'./sprites/beams_green.png',20,1111,1);
let projectile_2_enemie = new projectile(0,0,0,40,'./sprites/beams_red.png',40,1111,1);
let projectile_3_enemie = new projectile(0,0,0,35,'./sprites/beams_blue_ball.png',50,2222,2);
let projectile_4_enemie = new projectile(0,0,0,30,'./sprites/beams_red.png',100,3333,2);
let projectile_5_enemie = new projectile(0,0,0,30,'./sprites/beams_blue.png',15,2222,1.5);

let projectile_1_joueur = new projectile(0,0,0,-30,'./sprites/beams_blue.png',15,250,1.5);
let projectile_2_joueur = new projectile(0,0,0,-55,'./sprites/beams_red.png',50,600,1);
let projectile_3_joueur = new projectile(0,0,0,-20,'./sprites/beams_blue.png',20,200,1);

let enemie_1 = new Enemy(0,0,0,0,2,'Normal',50,'./sprites/Enemy_n_2.png',projectile_1_enemie,0.1,1);
let enemie_2 = new Enemy(0,0,0,0,4,'Normal',20,'./sprites/Enemy_n_1.png',projectile_2_enemie,0.1,1);
let enemie_3 = new Enemy(0,0,0,0,3,'Normal',200,'./sprites/Enemy_n_1.png',projectile_3_enemie,0.2,1);
let enemie_4 = new Enemy(0,0,0,0,1.5,'Normal',400,'./sprites/Enemy_n_2.png',projectile_4_enemie,0.3,1);
let enemie_5 = new Enemy(0,0,0,0,1.5,'Normal',400,'./sprites/Enemy_n_2.png',projectile_5_enemie,0.3,4);

let nombre_enemie = 4;

let Fond_space_1_i1 = new Image();

let Vaisseau_joueur = new Image();
Vaisseau_joueur.src = './sprites/Joueur.png';


let coord_fond_1;
let coord_fond_2;
let poussiere_tab = [];
let nb_poussière = 100;
let trainée = [];
let bout_trainée = [0,0];
var lvl_canon = 4;
let Joueur = new Player(1000,1000,1000);//x,y,vie

let tab_decors_plan_1 = [];
let tab_decors_plan_2 = [];
let tab_decors_plan_3 = [];
let tab_decors_plan_4 = [];

let decors_sprites_plan_1 = ['./sprites/sat_1.png','./sprites/rock_1.png','./sprites/rock_2.png','./sprites/rock_3.png'];
let decors_sprites_plan_2 = ['./sprites/rock_1.png','./sprites/rock_2.png','./sprites/rock_3.png'];
let decors_sprites_plan_3 = ['./sprites/planet_2.png','./sprites/planet_3.png','./sprites/planet_4.png','./sprites/planet_5.png','./sprites/planet_6.png','./sprites/planet_7.png','./sprites/planet_8.png','./sprites/planet_10.png','./sprites/planet_11.png','./sprites/planet_12.png'];
let decors_sprites_plan_4 = ['./sprites/neb_1.png','./sprites/neb_2.png','./sprites/neb_3.png'];

function init_decors_(tab_decors,decors_sprites,n){
  for(var i = 0;i<10;i++){
    var x_ = Math.round(Math.random() * cnv.width - 300);
    var y_ = -(((i+1)*1000*(4/n))+1000);
    let rand = Math.round(Math.random() * (decors_sprites.length-1));
    let size_ = 2/n;
    let vy_   = 0.4 * (Math.exp(n+0.5)/15);
    let decor = new decors(x_,y_,decors_sprites[rand],size_,vy_);
    tab_decors.push(decor);
  }
}

init_decors_(tab_decors_plan_1,decors_sprites_plan_1,3.5);
init_decors_(tab_decors_plan_2,decors_sprites_plan_2,3);
init_decors_(tab_decors_plan_3,decors_sprites_plan_3,2);
init_decors_(tab_decors_plan_4,decors_sprites_plan_4,1.8);

let Enemis_Vivant = 0;
let Enemis_mort = 0;
let Total_enemis = 0;

function test_vie(liste,element){
  if(element.vie <= 0){
    game.current_level.current_wave.enemie_en_vie--;
    game.current_level.current_wave.enemie_mort++;
    //console.log("En vie : ",Enemis_Vivant,"Mort : ",Enemis_mort,"Total : ", Total_enemis);
    liste.remove(element);
    
  }
}

function affiche_projectile(liste){
  let current = liste.get_head();

  while(current){
    let image = new Image();
    image.src = current.element.src;
    let grandeur = current.element.size;

    context.drawImage(image,current.element.x,current.element.y,image.width*grandeur,image.height*grandeur);
      
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

function affiche_enemy(liste){

  let current = liste.get_head();

  while(current){
    let image = new Image();
    image.src = current.element.img;
    let grandeur = current.element.size;
    context.drawImage(image,current.element.x,current.element.y,image.width*grandeur,image.height*grandeur);
    //current.element.draw_collision();
    current = current.next;
  }
}
function return_element_aleatoire(liste){

  let position = Math.round(Math.random() * (length-2)+1);
  let index = 0;
  let current = liste.get_head();
  while(index++ < position) {
    current = current.next;
  }
  
  if(Enemis_Vivant >0){
    return current.element;
  }
}
function update_pos_projectiles(liste){
  let current = liste.get_head();
  while(current){

    current.element.x += current.element.vx;
    current.element.y += current.element.vy;
  
    if(current.element.y < -100 || current.element.y > cnv.height || current.element.x < -150 || current.element.x > cnv.width){
      liste.remove(current.element);
      //current= null;
      break;
    }
    current = current.next;
  }
}
function update_pos_enemy_normaux(liste){
  let current = liste.get_head();

  while(current){

    let vit = current.element.vit;
    current.element.y += vit;

    current.element.face_collision[0].y += vit;
    current.element.face_collision[1].y += vit;
    current.element.face_collision[2].y += vit;
    current.element.face_collision[3].y += vit;

    
    let current_a_détruire = current;

    current = current.next;

    if(current_a_détruire.element.y >= cnv.height){
      game.current_level.current_wave.enemie_en_vie--;
      game.current_level.current_wave.enemie_mort++;
      liste.remove(current_a_détruire.element);
      //current_a_détruire = null;
    }
  }
}
function test_collision_projectiles(liste_colliders,liste_collided){
  let current_Lpj = liste_colliders.get_head();//liste projectile joueur
  
  while(current_Lpj){
    let point_a_test = new Pt(current_Lpj.element.x+25,current_Lpj.element.y+20);
    let current_Le = liste_collided.get_head(); //liste enemy
    while(current_Le){
      let surface_collision_a_test = current_Le.element.face_collision;
      if(isIn(point_a_test,surface_collision_a_test)){
        current_Le.element.vie -= current_Lpj.element.degats;
        test_vie(liste_collided,current_Le.element);
        liste_colliders.remove(current_Lpj.element);
        //current_Lpj = null;
      }
      current_Le = current_Le.next;
    }

    current_Lpj = current_Lpj.next;
  }
}
function test_collision_joueur(liste){

  let current_Lpe = liste.get_head();
  let tableau_a_test = Joueur.face_collision;

  while(current_Lpe){
    let point_a_test = new Pt(current_Lpe.element.x+25,current_Lpe.element.y+20);
    if(isIn(point_a_test,tableau_a_test)){
      Joueur.vie -= current_Lpe.element.degats;
      joueur_test_vie();
      liste.remove(current_Lpe.element);
      //current_Lpe = null;
    }

    current_Lpe = current_Lpe.next;
  }
}

for(let i = 0;i<nb_poussière;i++){
  let poussiere = [0,0,0];
  if(i%2 == 0){
    poussiere = [Math.round(Math.random() * cnv.width),Math.round(Math.random() * cnv.height),Math.round(Math.random() * 3)+0.25];
  }
  else{
    poussiere = [Math.round(Math.random() * cnv.width),Math.round(Math.random() * cnv.height),Math.round(Math.random() * 10+5)];
  }
  poussiere_tab.push(poussiere);
}

function draw(){
  context.clearRect(-10000,-1000,3000,3000)
  let size_ = game.current_level.size;
  context.drawImage(Fond_space_1_i1,coord_fond_1[0],coord_fond_1[1],Fond_space_1_i1.width*size_,Fond_space_1_i1.height*size_);
  context.drawImage(Fond_space_1_i1,coord_fond_2[0],coord_fond_2[1],Fond_space_1_i1.width*size_,Fond_space_1_i1.height*size_);

  for(var i = 0;i<tab_decors_plan_4.length;i++){
    var size = tab_decors_plan_4[i].size;
    context.drawImage(tab_decors_plan_4[i].image,tab_decors_plan_4[i].x,tab_decors_plan_4[i].y,tab_decors_plan_4[i].image.width*size,tab_decors_plan_4[i].image.height*size);
  }
  for(var i = 0;i<tab_decors_plan_3.length;i++){
    var size = tab_decors_plan_3[i].size;
    context.drawImage(tab_decors_plan_3[i].image,tab_decors_plan_3[i].x,tab_decors_plan_3[i].y,tab_decors_plan_3[i].image.width*size,tab_decors_plan_3[i].image.height*size);
  }
  for(var i = 0;i<tab_decors_plan_2.length;i++){
    var size = tab_decors_plan_2[i].size;
    context.drawImage(tab_decors_plan_2[i].image,tab_decors_plan_2[i].x,tab_decors_plan_2[i].y,tab_decors_plan_2[i].image.width*size,tab_decors_plan_2[i].image.height*size);
  }
  for(var i = 0;i<tab_decors_plan_1.length;i++){
    var size = tab_decors_plan_1[i].size;
    context.drawImage(tab_decors_plan_1[i].image,tab_decors_plan_1[i].x,tab_decors_plan_1[i].y,tab_decors_plan_1[i].image.width*size,tab_decors_plan_1[i].image.height*size);
  }

  for(let i = 0;i<poussiere_tab.length;i++){
    context.beginPath();
    context.arc(poussiere_tab[i][0],poussiere_tab[i][1],Math.random() * 0.5 +1.5, 0, 2*Math.PI);
    context.fillStyle = "#FFFFFF";
    context.fill();
    context.closePath(); 
  }

  //List_projectile_joueur.affiche(Vaisseau_joueur.src,0.05);
  //List_projectile_Enemy.affiche('./sprites/Enemy_n_2.png',0.05);
  //List_Enemy.affiche_enemy('./sprites/Enemy_n_2.png',0.1);

  affiche_projectile(List_projectile_joueur);
  affiche_projectile(List_projectile_Enemy);
  affiche_enemy(List_Enemy);
  iteration_enemi_shoot(List_Enemy);

  context.drawImage(Vaisseau_joueur,Joueur.x-54,Joueur.y,Vaisseau_joueur.width*0.15,Vaisseau_joueur.height*0.15);  
  context.beginPath();
  context.lineWidth = 2;
  context.strokeStyle = "grey";
  /*
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

}

function upgrade_pos(){
  if(coord_fond_1[1]>=Fond_space_1_i1.height*2){
    coord_fond_1[1] = 0;
    coord_fond_2[1] = -Fond_space_1_i1.height*2;
  }
  else{
    coord_fond_1[1] +=0.15;
    coord_fond_2[1] +=0.15;
  }

  for(let i = 0;i<poussiere_tab.length;i++){
    if(poussiere_tab[i][1]>cnv.height){
      poussiere_tab[i][1] =0;
    }
    else{
      poussiere_tab[i][1] += poussiere_tab[i][2];
    }
    
  }

  for(var i = 0;i<tab_decors_plan_1.length;i++){
    tab_decors_plan_1[i].y += tab_decors_plan_1[i].vy;

    if(tab_decors_plan_1[i].y > cnv.height+100){
      tab_decors_plan_1[i].y -=11000;
    }
  }

  for(var i = 0;i<tab_decors_plan_2.length;i++){
    tab_decors_plan_2[i].y += tab_decors_plan_2[i].vy;

    if(tab_decors_plan_2[i].y > cnv.height+100){
      tab_decors_plan_2[i].y -=11000;
    }
  }
  for(var i = 0;i<tab_decors_plan_3.length;i++){
    tab_decors_plan_3[i].y += tab_decors_plan_3[i].vy;

    if(tab_decors_plan_3[i].y > cnv.height+100){
      tab_decors_plan_3[i].y -=11000;
    }
  }
  for(var i = 0;i<tab_decors_plan_4.length;i++){
    tab_decors_plan_4[i].y += tab_decors_plan_4[i].vy;

    if(tab_decors_plan_4[i].y > cnv.height+100){
      tab_decors_plan_4[i].y -=11000;
    }
  }

  

  //List_projectile_joueur.update_pos_projectiles();
  //List_Enemy.update_pos_enemy_normaux();
  //List_projectile_Enemy.update_pos_projectiles();
  update_pos_enemy_normaux(List_Enemy);
  update_pos_projectiles(List_projectile_joueur);
  update_pos_projectiles(List_projectile_Enemy);

}

function lerp (start, end, amt){
  return (1-amt)*start+amt*end;
}

var intervalid_dr = null;
var intervalid_dl = null;
var intervalid_du = null;
var intervalid_dd = null;

function dash_right(){
  let x_vise = Joueur.x+80;

  intervalid_dr = setInterval(
    function (){
      if(Joueur.x >= x_vise){
        clearInterval(intervalid_dr);
        intervalid_dr = null;
      }
      else{
        let prout = lerp(Joueur.x, x_vise, 0.2);
        Joueur.x = prout+3;
        Joueur.face_collision[0].x =prout+3-23;
        Joueur.face_collision[1].x =prout+3-23;
        Joueur.face_collision[2].x =prout+3+50;
        Joueur.face_collision[3].x =prout+3+50;
      }
    }
    ,5);
}
function dash_left(){
  let x_vise = Joueur.x-80;

  intervalid_dl = setInterval(
    function (){
      if(Joueur.x <= x_vise){
        clearInterval(intervalid_dl);
        intervalid_dl = null;
      }
      else{
        let prout = lerp(Joueur.x, x_vise, 0.2);
        Joueur.x = prout-3;
        Joueur.face_collision[0].x =prout-3-23;
        Joueur.face_collision[1].x =prout-3-23;
        Joueur.face_collision[2].x =prout-3+50;
        Joueur.face_collision[3].x =prout-3+50;
      }
    }
    ,5);

}
function dash_up(){
  let y_vise = Joueur.y-80;

  intervalid_du = setInterval(
    function (){
      if(Joueur.y <= y_vise){
        clearInterval(intervalid_du);
        intervalid_du = null;
      }
      else{
        let prout = lerp(Joueur.y, y_vise, 0.2);
        Joueur.y = prout-3;

        Joueur.face_collision[0].y =prout-3;
        Joueur.face_collision[1].y =prout-3+100;
        Joueur.face_collision[2].y =prout-3+100;
        Joueur.face_collision[3].y =prout-3;
      }
    }
    ,5);

}
function dash_down(){
  let y_vise = Joueur.y+80;

  intervalid_dd = setInterval(
    function (){
      if(Joueur.y >= y_vise){
        clearInterval(intervalid_dd);
        intervalid_dd = null;
      }
      else{
        let prout = lerp(Joueur.y, y_vise, 0.2);
        Joueur.y = prout+3;


        Joueur.face_collision[0].y =prout+3;
        Joueur.face_collision[1].y =prout+3+100;
        Joueur.face_collision[2].y =prout+3+100;
        Joueur.face_collision[3].y =prout+3;
      }
    }
    ,5);
}
function candash(){
  if(intervalid_dr == null && intervalid_dl == null && intervalid_du == null && intervalid_dd == null){
    return true;
  }
  return false;
}

window.addEventListener('keydown', keydown_fun, false);
let setinterval_space_id = null;
function keydown_fun(e) {
  
  switch(e.code) {
    case "ArrowRight":
      if(Joueur.x<cnv.width-100 && candash()){
        dash_right();
      }
    break;
    case "ArrowLeft":
      if(Joueur.x>100 && candash()){
        dash_left();
      }
    break;
    case "ArrowUp":
      if(Joueur.y> 100  && candash()){
        dash_up();
      }
    break;
    case "ArrowDown":
      if(Joueur.y<cnv.height-100  && candash()){
        dash_down();
      }
    break;
    case "Space":
      if(setinterval_space_id == null){
        setinterval_space_id = setInterval(PlayerShooting, frequence_tir_joueur);
      }
      else{
        clearInterval(setinterval_space_id);
        setinterval_space_id = null;
      }
    break;
    case "Enter":
      start_game();
    break;
    }
    
}

let projectile_1 = new projectile(0,0,0,0,0,0,0,0);
let projectile_1_1 = new projectile(0,0,0,0,0,0,0,0);
let projectile_1_2 = new projectile(0,0,0,0,0,0,0,0);
let projectile_2 = new projectile(0,0,0,0,0,0,0,0);
let projectile_3 = new projectile(0,0,0,0,0,0,0,0);
let projectile_4 = new projectile(0,0,0,0,0,0,0,0);
let projectile_5 = new projectile(0,0,0,0,0,0,0,0);

let type_canon = 2;
let frequence_tir_joueur = 1000;


choosing_type_canon(type_canon);

function choosing_type_canon(type_canon){
  
  let vx_ = 0;
  let vy_ = 0;
  let src_= 0;
  let degats_ = 0;
  let freq_ = 0;
  let size_ = 0;

  switch(type_canon){
    case 1:
      vx_ = projectile_1_joueur.vx;
      vy_ = projectile_1_joueur.vy;
      src_= projectile_1_joueur.src;
      degats_ = projectile_1_joueur.degats;
      freq_ = projectile_1_joueur.frequence;
      size_ = projectile_1_joueur.size;

      projectile_1 = new projectile(0,0,vx_,vy_,src_,degats_,freq_,size_);
      projectile_1_1 = new projectile(0,0,vx_-1,vy_+1,src_,degats_,freq_,size_);
      projectile_1_2 = new projectile(0,0,vx_+1,vy_+1,src_,degats_,freq_,size_);
      projectile_2 = new projectile(0,0,vx_-2.7,vy_+2,src_,degats_,freq_,size_);
      projectile_3 = new projectile(0,0,vx_+2.7,vy_+2,src_,degats_,freq_,size_);
      projectile_4 = new projectile(0,0,vx_-5.2,vy_+2.7,src_,degats_,freq_,size_);
      projectile_5 = new projectile(0,0,vx_+5.2,vy_+2.7,src_,degats_,freq_,size_);

      frequence_tir_joueur = freq_;
    break;

    case 2:
      vx_ = projectile_2_joueur.vx;
      vy_ = projectile_2_joueur.vy;
      src_ = projectile_2_joueur.src;
      degats_ = projectile_2_joueur.degats;
      freq_ = projectile_2_joueur.frequence;
      size_ = projectile_2_joueur.size;

      projectile_1 = new projectile(0,0,vx_,vy_,src_,degats_,freq_,size_);
      projectile_1_1=new projectile(15,0,vx_,vy_,src_,degats_,freq_,size_);
      projectile_1_2=new projectile(-22,0,vx_,vy_,src_,degats_,freq_,size_);
      projectile_2 = new projectile(35,25,vx_,vy_,src_,degats_,freq_,size_);
      projectile_3 = new projectile(-45,25,vx_,vy_,src_,degats_,freq_,size_);
      projectile_4 = new projectile(75,50,vx_,vy_,src_,degats_,freq_,size_);
      projectile_5 = new projectile(-85,50,vx_,vy_,src_,degats_,freq_,size_);

      frequence_tir_joueur = freq_;
    break;
    
  }
}

function PlayerShooting(){

  var x = Joueur.x-15;
  var y = Joueur.y-20;

  let projectile_1_ = new projectile(projectile_1.x,projectile_1.y,projectile_1.vx,projectile_1.vy,projectile_1.src,projectile_1.degats,projectile_1.freq,projectile_1.size);
  projectile_1_.x += x;
  projectile_1_.y += y;
  
  let projectile_1_1_ = new projectile(projectile_1_1.x,projectile_1_1.y,projectile_1_1.vx,projectile_1_1.vy,projectile_1_1.src,projectile_1_1.degats,projectile_1_1.freq,projectile_1_1.size);
  projectile_1_1_.x += x;
  projectile_1_1_.y += y;

  let projectile_1_2_ = new projectile(projectile_1_2.x,projectile_1_2.y,projectile_1_2.vx,projectile_1_2.vy,projectile_1_2.src,projectile_1_2.degats,projectile_1_2.freq,projectile_1_2.size);
  projectile_1_2_.x += x;
  projectile_1_2_.y += y;

  let projectile_2_ = new projectile(projectile_2.x,projectile_2.y,projectile_2.vx,projectile_2.vy,projectile_2.src,projectile_2.degats,projectile_2.freq,projectile_2.size);
  projectile_2_.x += x;
  projectile_2_.y += y;

  let projectile_3_ = new projectile(projectile_3.x,projectile_3.y,projectile_3.vx,projectile_3.vy,projectile_3.src,projectile_3.degats,projectile_3.freq,projectile_3.size);
  projectile_3_.x += x;
  projectile_3_.y += y;

  let projectile_4_ = new projectile(projectile_4.x,projectile_4.y,projectile_4.vx,projectile_4.vy,projectile_4.src,projectile_4.degats,projectile_4.freq,projectile_4.size);
  projectile_4_.x += x;
  projectile_4_.y += y;

  let projectile_5_ = new projectile(projectile_5.x,projectile_5.y,projectile_5.vx,projectile_5.vy,projectile_5.src,projectile_5.degats,projectile_5.freq,projectile_5.size);
  projectile_5_.x += x;
  projectile_5_.y += y;
  

  switch(lvl_canon){
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
  upgrade_pos();
}



function update2(){
  test_collision_projectiles(List_projectile_joueur,List_Enemy);
  test_collision_joueur(List_projectile_Enemy);
}

function start_game(){
  Fond_space_1_i1.src = game.current_level.img;
  coord_fond_1 = [-300,-Fond_space_1_i1.height*2+cnv.height];
  coord_fond_2 = [-300,-Fond_space_1_i1.height*4+cnv.height];
  let setinterval_global_update_id = setInterval(update, 15);
  let setinterval_global_update_2_id = setInterval(update2, 50);
  setInterval(current,500);
}

function current(){
  let e_t = game.current_level.current_wave.enemie_total;
  let e_m = game.current_level.current_wave.enemie_mort;
  let e_v = game.current_level.current_wave.enemie_en_vie;

  
  if(!game.current_level.current_wave.HasSpawn){
    game.current_level.current_wave.create_wave();
    game.current_level.current_wave.HasSpawn = true;
  }
  else{

  }

  if(e_t == e_m && game.current_level.current_wave.wave_end){
    game.current_level.next_wave();
  }

  if(game.current_level.finished){
    game.next_level();
    Fond_space_1_i1.src = game.current_level.img;
    coord_fond_1 = [-200,-Fond_space_1_i1.height*2+cnv.height];
    coord_fond_2 = [-200,-Fond_space_1_i1.height*4+cnv.height];
  }
}




let wave1_1 = new wave(1,[enemie_5],1);
let wave2_1 = new wave(10,[enemie_1,enemie_2],2);
let wave3_1 = new wave(100,[enemie_2,enemie_3,enemie_4,enemie_5],4);
let wave4_1 = new wave(10,[enemie_2,enemie_4],2);

let level_1 = new levels([wave1_1,wave2_1,wave3_1,wave4_1],'./sprites/space_9.jpg',3);

let wave1_2 = new wave(20,[enemie_1],1);
let wave2_2 = new wave(15,[enemie_1,enemie_2,],2);
let wave3_2 = new wave(30,[enemie_1,enemie_3,enemie_4,enemie_5],4);
let wave4_2 = new wave(40,[enemie_1,enemie_2,enemie_4,enemie_5],4);

let level_2 = new levels([wave1_2,wave2_2,wave3_2,wave4_2],'./sprites/space_10.jpg',3);

let wave1_3 = new wave(20,[enemie_1],1);
let wave2_3 = new wave(30,[enemie_1,enemie_2],2);
let wave3_3 = new wave(30,[enemie_1,enemie_3,enemie_4],3);
let wave4_3 = new wave(30,[enemie_2,enemie_4],2);

let level_3 = new levels([wave1_3,wave2_3,wave3_3,wave4_3],'./sprites/space_11.jpg',2);


level_1.initialisation();
level_2.initialisation();
level_3.initialisation();

let game = new Game([level_1,level_2,level_3]);
game.initialisation();



