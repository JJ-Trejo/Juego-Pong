// Variables de la pelota
let posXPelota, posYPelota;
let velXPelota, velYPelota;
let diametroPelota = 20;
let velocidadFija = 10;
let anguloRotacion = 0; // Ángulo de rotación para el efecto de giro
let imagenPelota;

// Variables de la raqueta del jugador
let posXJugador = 30;
let posYJugador;
let anchoRaqueta = 10;
let altoRaqueta = 100;
let imagenRaquetaJugador;

// Variables de la raqueta de la computadora
let posXComputadora;
let posYComputadora;
let imagenRaquetaComputadora;
var velYComputadora = 4;

// Dimensiones del canvas
let anchoCanvas = 800;
let altoCanvas = 400;
let imagenFondo;

// Variables del marcador
let puntosJugador = 0;
let puntosComputadora = 0;

// Sonidos
let sonidoRebote;
let sonidoAnotacion;
var estadoSonido = false;
const boton_sonido = document.querySelector('.boton_sonido');
boton_sonido.addEventListener('click', () => {
  estadoSonido = !estadoSonido; //Alternar el estado del sonido
  boton_sonido.textContent = estadoSonido ? 'Silenciar': 'Activar Sonido';
})

//dificultad
var estadoDificultad = false; //variable para rastrear el estado de la difucultad
const boton_dificultad = document.querySelector('.boton_dificultad');
boton_dificultad.addEventListener('click', ajustaDificultad);

function ajustaDificultad (){
  //Alternar el estado de la difucultad
  estadoDificultad = !estadoDificultad;

  if (estadoDificultad) { //si ya fue presionado
    console.log("Sube dificultad");
    boton_dificultad.innerHTML = 'Bajar dificultad';
    velocidadFija = 15;
    velYComputadora = 6;
  }
  else{
    console.log("Baja dificultad");
    boton_dificultad.innerHTML = 'Subir dificultad';
    velocidadFija = 10;
    velYComputadora = 4;
  }
}

function preload() {
  // Cargar imágenes
  imagenRaquetaJugador = loadImage('sprites/imagenes/barra1.png');
  imagenRaquetaComputadora = loadImage('sprites/imagenes/barra2.png');
  imagenFondo = loadImage('sprites/imagenes/fondo1.png');
  imagenPelota = loadImage('sprites/imagenes/bola.png');

  // Cargar sonidos
  sonidoRebote = loadSound('sprites/sonidos/bounce.wav');
  sonidoAnotacion = loadSound('sprites/sonidos/anotacion.wav');
}

function setup() {
  createCanvas(anchoCanvas, altoCanvas);
  userStartAudio(); // Habilita el audio tras la interacción del usuario
  inicializarJuego();
}

function draw() {
  // Dibujar fondo
  image(imagenFondo, 0, 0, anchoCanvas, altoCanvas);
  dibujarBordes();
  dibujarElementos();
  dibujarMarcador();
  moverPelota();
  manejarRebotes();
  moverRaquetas();
  verificarReinicioPelota();
  detectarBugBorde(); // Detectar si la pelota está atrapada en el borde
}

// Función para inicializar posiciones iniciales
function inicializarJuego() {
  posXPelota = width / 2;
  posYPelota = height / 2;

  // Velocidad inicial fija con un ángulo aleatorio entre -45 y 45 grados
  let anguloInicial = radians(random(-45, 45));
  if (abs(degrees(anguloInicial)) < 10) {
    anguloInicial = radians(10) * (random() < 0.5 ? 1 : -1); // Asegura un ángulo mínimo de ±10
  }
  velXPelota = velocidadFija * cos(anguloInicial);
  velYPelota = velocidadFija * sin(anguloInicial);

  posYJugador = height / 2 - altoRaqueta / 2;
  posXComputadora = width - posXJugador - anchoRaqueta;
  posYComputadora = height / 2 - altoRaqueta / 2;

  puntosJugador = 0;
  puntosComputadora = 0;
}

function dibujarBordes() {
  fill(87, 35, 100);
  rect(0, 0, width, 10);
  rect(0, height - 10, width, 10);
}

function dibujarElementos() {
  // Dibujar pelota con efecto de rotación
  push();
  translate(posXPelota, posYPelota);
  rotate(anguloRotacion);
  imageMode(CENTER);
  image(imagenPelota, 0, 0, diametroPelota, diametroPelota);
  pop();

  // Dibujar raquetas con imágenes
  image(imagenRaquetaJugador, posXJugador, posYJugador, anchoRaqueta, altoRaqueta);
  image(imagenRaquetaComputadora, posXComputadora, posYComputadora, anchoRaqueta, altoRaqueta);
}

function dibujarMarcador() {
  textSize(32);
  fill(255);
  textAlign(CENTER, TOP);
  text(`Jugador: ${puntosJugador}`, width / 4, 20);
  text(`Computadora: ${puntosComputadora}`, (3 * width) / 4, 20);
}

function moverPelota() {
  posXPelota += velXPelota;
  posYPelota += velYPelota;
  anguloRotacion += 0.1; // Incrementar el ángulo para el efecto de giro
}

function manejarRebotes() {
  // Rebote en los bordes superior e inferior
  if (posYPelota < diametroPelota / 2 + 10 || posYPelota > height - diametroPelota / 2 - 10) {
    velYPelota *= -1;
  }

  // Rebote en la raqueta del jugador
  if (
    posXPelota - diametroPelota / 2 <= posXJugador + anchoRaqueta &&
    posYPelota > posYJugador &&
    posYPelota < posYJugador + altoRaqueta
  ) {
    ajustarAngulo(posYJugador, posYPelota, true);
    if (estadoSonido){
      sonidoRebote.play(); // Reproducir sonido de rebote
    }
  }

  // Rebote en la raqueta de la computadora
  if (
    posXPelota + diametroPelota / 2 >= posXComputadora &&
    posYPelota > posYComputadora &&
    posYPelota < posYComputadora + altoRaqueta
  ) {
    ajustarAngulo(posYComputadora, posYPelota, false);
    if (estadoSonido){
      sonidoRebote.play(); // Reproducir sonido de rebote
    }
  }
}

function ajustarAngulo(posYRaqueta, posYPelota, esJugador) {
  let puntoImpacto = posYPelota - posYRaqueta; // Distancia desde la parte superior de la raqueta
  let factorImpacto = map(puntoImpacto, 0, altoRaqueta, -45, 45); // Variación de ángulo en grados

  // Asegurar un ángulo mínimo de ±10 grados al golpear el centro
  if (abs(factorImpacto) < 10) {
    factorImpacto = 10 * (factorImpacto < 0 ? -1 : 1);
  }

  // Convertir el ángulo a radianes
  let angulo = radians(factorImpacto);
  let direccion = esJugador ? 1 : -1;

  // Calcular nuevas velocidades manteniendo velocidad constante
  velXPelota = direccion * velocidadFija * cos(angulo);
  velYPelota = velocidadFija * sin(angulo);
}

function moverRaquetas() {
  posYJugador = constrain(mouseY - altoRaqueta / 2, 10, height - 10 - altoRaqueta);

  if (posYPelota > posYComputadora + altoRaqueta / 2) {
    posYComputadora += velYComputadora;
  } else if (posYPelota < posYComputadora + altoRaqueta / 2) {
    posYComputadora -= velYComputadora;
  }
  posYComputadora = constrain(posYComputadora, 10, height - 10 - altoRaqueta);
}

function verificarReinicioPelota() {
  if (posXPelota < 0) {
    puntosComputadora++;
    if (estadoSonido){
      sonidoAnotacion.play(); // Reproducir sonido de anotación
    }
    reiniciarPelota();
  } else if (posXPelota > width) {
    puntosJugador++;
    if (estadoSonido){
      sonidoAnotacion.play(); // Reproducir sonido de anotación
    }
    reiniciarPelota();
  }
}

function reiniciarPelota() {
  posXPelota = width / 2;
  posYPelota = height / 2;

  // Nuevo ángulo aleatorio entre -45 y 45 grados, asegurando un mínimo de ±10
  let anguloReinicio = radians(random(-45, 45));
  if (abs(degrees(anguloReinicio)) < 10) {
    anguloReinicio = radians(10) * (random() < 0.5 ? 1 : -1);
  }

  velXPelota = velocidadFija * cos(anguloReinicio);
  velYPelota = velocidadFija * sin(anguloReinicio);
}

function detectarBugBorde() {
  // Detectar si la pelota está atrapada en los bordes superior o inferior
  if ((posYPelota <= 10 || posYPelota >= height - 10)) {
    reiniciarPelota(); // Reiniciar pelota si se detecta el bug
  }
}