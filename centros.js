//ojo esta bien feo el codigo

function encontrar(t) {
	let nuevos = [];
	tamano = t.length
	for (y1 = 0; y1 < tamano; y1++) {
		for (y2 = y1 + 1; y2 < tamano; y2++) {
			let origen = [];
			for (x = 0; x < tamano; x++) {
				if (t[y1][y2] > 0) {break};
				if (t[y1][x] > 0 && t[y2][x] > 0) {
					if (!(t[y1][x] == 2 && t[y2][x] == 2)) {
						origen.push(x);
					}
				}
			}
			if (origen.length >= 2) {
				nuevos.push([y1, y2, origen]);
			}
		}
	}
	let copia = JSON.parse(JSON.stringify(t));
	nuevos.forEach(e => {
		copia[e[0]][e[1]] = 1;
		copia[e[1]][e[0]] = 1;
	})
	return [copia, nuevos];
}


let herramienta = 1; //0 editar, 1 centro, 2 centro infinito, 3 borrar, 4 texto, 5 camara
let centros = [];
let nuevoscentros = [];
let lineas = [];

let tempCentroX = -1;
let tempCentroY = -1;
let tempInput;
let tempAngulo = -1;

let tempMoviendo = false;
let tempMoviendoX = 0;
let tempMoviendoY = 0;
let tempMoviendoAngulo = false;

let pasos = 1;
let tablafinal = [];

let colores = [];

let textoPasos2;

let clickTime = 0

let camaraX = 0;
let camaraY = 0;
let mouseXPrevio = 0;
let mouseYPrevio = 0;

let botonCargar;
let img;

function actualizarPasos() {
	lineas = [];
	nuevoscentros = [];
	encontrarNuevosCentros();
}

function encontrarNuevosCentros() {
	let t = centrosATabla();
	let r = encontrar(t);
	let paso = 1;
	while (r[1].length > 0) {
		if (paso > pasos) {
			break
		}
		dibujarNuevosCentros(r[1], paso);
		t = r[0];
		r = encontrar(t);
		paso++;
	}
	tablafinal = t;
}

function dibujarNuevosCentros(n, paso) {
	n.forEach(e => {
		let lineasposibles = e[2].length;
		let c1 = encontrarCentro(e[0] + 1, e[2][0] + 1);
		let c2 = encontrarCentro(e[1] + 1, e[2][0] + 1);
		let angulo1 = -Math.atan2(c1[1] - c2[1], c1[0] - c2[0]) + Math.PI;
		if (c1[4] != -1) {
			angulo1 = c1[4];
			c1 = c2;
		}
		if (c2[4] != -1) {
			angulo1 = c2[4];
		}
		let m1 = -Math.tan(angulo1);
		//xdddd
		if (m1 > 10000) {m1 = 10000};
		if (m1 < -10000) {m1 = -10000};
		lineas.push([m1, c1[1], c1[0], paso]);
		
		let c3 = encontrarCentro(e[0] + 1, e[2][1] + 1);
		let c4 = encontrarCentro(e[1] + 1, e[2][1] + 1);
		let angulo2 = -Math.atan2(c3[1] - c4[1], c3[0] - c4[0]) + Math.PI;
		if (c3[4] != -1) {
			angulo2 = c3[4];
			c3 = c4;
		}
		if (c4[4] != -1) {
			angulo2 = c4[4];
		}
		let m2 = -Math.tan(angulo2);
		//xd
		if (m2 > 10000) {m2 = 10000};
		if (m2 < -10000) {m2 = -10000};
		lineas.push([m2, c3[1], c3[0], paso]);

		//lineas extra
		for (var k = 2; k < lineasposibles; k++) {
			let c5 = encontrarCentro(e[0] + 1, e[2][k] + 1);
			let c6 = encontrarCentro(e[1] + 1, e[2][k] + 1);
			let angulo3 = -Math.atan2(c5[1] - c6[1], c5[0] - c6[0]) + Math.PI;
			if (c5[4] != -1) {
				angulo3 = c5[4];
				c5 = c6;
			}
			if (c4[4] != -1) {
				angulo3 = c6[4];
			}
			let m3 = -Math.tan(angulo3);
			if (m3 > 10000) {m3 = 10000};
			if (m3 < -10000) {m3 = -10000};
			lineas.push([m3, c5[1], c5[0], paso]);
		}

		let x = (-m2 * c3[0] + c3[1] + m1 * c1[0] - c1[1]) / (m1 - m2);
		nuevoscentros.push([x, m1 * (x - c1[0]) + c1[1], e[0] + 1, e[1] + 1, -1, paso])
	})
}

function encontrarCentro(v1, v2) {
	let ref = false;
	centros.forEach(e => {
		if ((v1 == e[2] && v2 == e[3]) || (v1 == e[3] && v2 == e[2])) {
			ref = e;
			return;
		}
	})
	nuevoscentros.forEach(e => {
		if ((v1 == e[2] && v2 == e[3]) || (v1 == e[3] && v2 == e[2])) {
			ref = e;
			return;
		}
	})
	return ref;
}

function centrosATabla() {
	let tabla = [];
	let tamano = 0
	centros.forEach(e => {
		let tipo = 1;
		if (e[4] != - 1) {tipo = 2}
		if (tabla[e[2] - 1] == undefined) {tabla[e[2] - 1] = []};
		tabla[e[2] - 1][e[3] - 1] = tipo;
		if (tabla[e[3] - 1] == undefined) {tabla[e[3] - 1] = []};
		tabla[e[3] - 1][e[2] - 1] = tipo;
		if (e[2] > tamano) {tamano = e[2]};
		if (e[3] > tamano) {tamano = e[3]};	
	});
	//empty a 0
	for (y = 0; y < tamano; y++) {
		if (tabla[y] == undefined) {tabla[y] = []}
		for (x = 0; x < tamano; x++) {
			if (tabla[y][x] == undefined) {tabla[y][x] = 0}
		}
	}
	return tabla;
}

function setup() {
	createCanvas(1024, 769).position(0, 45);
	background(0);
	textAlign(CENTER);
	frameRate(30);

	colores = [
		color(0,0,255),
		color("magenta"),
		color(255,204,0)
	]
	//botones
	botonVista = createButton("Mover vista")
	botonMover = createButton("Mover centro")
	botonCentro = createButton("Nuevo centro");
	botonCentroInfinito = createButton("Nuevo centro en el infinito");
	botonBorrar = createButton("Borrar centro")
	botonPasoMenos = createButton("<<");
	botonPasoMas = createButton(">>");
	botonCargar = createFileInput(imagen);
	//texto
	textoPasos = createDiv("Pasos: ").position(0, botonVista.height);
	textoPasos2 = createDiv("1").position(87, botonVista.height);
	textoCargar = createDiv("Carga una imagen").position(140, botonVista.height)
	//posicion botones
	botonVista.position(0, 0);
	botonMover.position(botonVista.width, 0);
	botonCentro.position(botonMover.x + botonMover.width, 0);
	botonCentroInfinito.position(botonCentro.x + botonCentro.width, 0);
	botonBorrar.position(botonCentroInfinito.x + botonCentroInfinito.width, 0);
	botonPasoMenos.position(50, botonVista.height);
	botonPasoMas.position(100, botonVista.height);
	botonCargar.position(270, botonVista.height)
	//cambiar herramienta con botones
	botonVista.mouseClicked(function() {herramienta = 5; resetTemp(); cursor("grab"); return false})
	botonMover.mouseClicked(function() {herramienta = 0; resetTemp();  return false})
	botonCentro.mouseClicked(function() {herramienta = 1; resetTemp(); return false})
	botonCentroInfinito.mouseClicked(function() {herramienta = 2; resetTemp(); return false})
	botonBorrar.mouseClicked(function() {herramienta = 3; resetTemp(); return false})
	botonPasoMenos.mouseClicked(function() {
		pasos--;
		if (pasos < 0) {
			pasos = 0;
		}
		textoPasos2.elt.innerText = pasos;
		actualizarPasos();
		return false;
	})
	botonPasoMas.mouseClicked(function() {
		pasos++;
		textoPasos2.elt.innerText = pasos;
		actualizarPasos();
		return false;
	})
	//cuadro para escribir numero de centro
	tempInput = createInput();
	tempInput.elt.size = 2;
	tempInput.elt.style = "display: none";

	img = loadImage("ejemplo.png")
}

function imagen(file) {
	print(file);
	if (file.type === 'image') {
		img = loadImage(file.data);
	} else {
		img = null;
	}
}

function draw() {
	clear();
	translate(camaraX, camaraY)
	if (tempMoviendo != false) {
		if (tempMoviendoAngulo) {
			let e = tempMoviendo;
			let angulo = -Math.atan2(e[1] - mouseY + camaraY, e[0] - mouseX + camaraX) + Math.PI;
			e[4] = angulo;
		} else {
			tempMoviendo[0] = mouseX - camaraX - tempMoviendoX;
			tempMoviendo[1] = mouseY - camaraY - tempMoviendoY;
		}
		actualizarPasos();
	}
	if (img) {
		tint(255, 255, 255, 50);
		image(img, 512 - img.width / 2, 384 - img.height / 2);
	}
	centros.forEach(e => {
		if (e[4] == -1) {
			stroke(0, 0, 0);
			noFill();
			circle(e[0], e[1], 10);
			noStroke();
			fill(0, 0, 0)
			text(e[2] + "," + e[3], e[0] - 40, e[1] + 10, 80);
		} else {
			fill(0, 0, 0)
			circle(e[0], e[1], 5)
			noStroke();
			text(e[2] + "," + e[3] + " [" + parseInt(e[4] * 180 / Math.PI) + "]", e[0] - 40, e[1] + 10, 80);
			stroke(0, 0, 0);
			let m = -Math.tan(e[4]);
			let x1 = -camaraX;
			let x2 = 1024 - camaraX;
			line(x1, m * (x1 - e[0]) + e[1], x2, m * (x2 - e[0]) + e[1]);
		}
	});
	lineas.forEach(e => {
		if (e[3] == pasos) {
			if (e[3] <= colores.length) {
				stroke(colores[e[3] - 1]);
			} else {
				stroke(200, 200, 255);
			}
			let x1 = -camaraX;
			let x2 = 1024 - camaraX;
			line(x1, e[0] * (x1 - e[2]) + e[1], x2, e[0] * (x2 - e[2]) + e[1]);
		}
	})
	nuevoscentros.forEach(e => {
		if (e[5] <= colores.length) {
			stroke(colores[e[5] - 1]);
		} else {
			stroke(0, 0, 255);
		}
		noFill();
		circle(e[0], e[1], 10);
		noStroke();
		fill(0, 0, 0);
		text(e[2] + "," + e[3], e[0] - 40, e[1] + 10, 80);
	});
	stroke(0, 0, 0)
	if (herramienta == 1) {
		noFill();
		stroke(0, 0, 0);
		circle(mouseX - camaraX, mouseY - camaraY, 10);
	}
	if (herramienta == 2) {
		fill(0, 0, 0);
		stroke(0, 0, 0);
		circle(mouseX - camaraX, mouseY - camaraY, 5);
	}
	if (herramienta == 4) {
		if (tempAngulo != -1) {
			fill(0, 0, 0);
			stroke(0, 0, 0);
			circle(tempCentroX, tempCentroY, 5);
			let m = -Math.tan(tempAngulo);
			let x1 = -camaraX;
			let x2 = 1024 - camaraX;
			stroke(0, 0, 0);
			line(x1, m * (x1 - tempCentroX) + tempCentroY, x2, m * (x2 - tempCentroX) + tempCentroY)
		} else {
			noFill();
			stroke(0, 0, 0);
			circle(tempCentroX, tempCentroY, 10);
		}
	}
	if (herramienta == 6) {
		fill(0, 0, 0);
		stroke(0, 0, 0);
		circle(tempCentroX, tempCentroY, 5);
		let angulo = -Math.atan2(tempCentroY - mouseY + camaraY, tempCentroX - mouseX + camaraX) + Math.PI;
		noStroke();
		text((angulo * 180 / Math.PI).toFixed(2), mouseX - camaraX - 40, mouseY - camaraY - 15, 80)
		stroke(0, 0, 0);
		let m = -Math.tan(angulo);
		let x1 = -camaraX;
		let x2 = 1024 - camaraX;
		line(x1, m * (x1 - tempCentroX) + tempCentroY, x2, m * (x2 - tempCentroX) + tempCentroY)
	}
	if (herramienta == 5) {
		if (mouseIsPressed) {
			camaraX = camaraX + mouseX - mouseXPrevio
			camaraY = camaraY + mouseY - mouseYPrevio
		}
	}
	mouseXPrevio = mouseX;
	mouseYPrevio = mouseY;
}

function mouseClicked() {
	if (mouseY < 0) {return true};
	if (herramienta == 1) {
		nuevoCentro1();
	}
	if (herramienta == 3) {
		borrarCentro();
	}
	return false;
}

function mousePressed() {
	if (mouseY < 0) {return false};
	if (herramienta == 2) {
		nuevoCentroInfinito1();
	}
	if (herramienta == 0) {
		moverCentro1();
	}
	return false;
}

function mouseReleased() {
	if (herramienta == 6) {
		nuevoCentroInfinito2();
	}
	if (herramienta == 0) {
		tempMoviendo = false;
		tempMoviendoAngulo = false;
	}
	return false;
}

function keyReleased() {
	if (key == "Enter") {
		if (herramienta == 4) {
			crearCentro();
		}
	}
	if (key == "Escape") {
		if (herramienta == 4) {
			herramienta = 1;
			resetTemp();
		}
	}
	return false;
}

function borrarCentro() {
	if (millis() - clickTime > 200) {
		clickTime = millis();
	} else {
		let del = -1;
		for (var i = 0; i < centros.length; i++) {
			let e = centros[i];
			let dist = Math.sqrt(Math.pow(mouseX - camaraX - e[0], 2) + Math.pow(mouseY - camaraY - e[1], 2));
			if (dist < 5) {
				del = i;
				break;
			}
		}
		if (del > -1) {
			centros.splice(i, 1);
			clickTime = 0;
			actualizarPasos();
		}
	}
}

function moverCentro1() {
	centros.forEach(e => {
		let dist = Math.sqrt(Math.pow(mouseX - camaraX - e[0], 2) + Math.pow(mouseY - camaraY - e[1], 2));
		if (dist < 5) {
			tempMoviendo = e;
			tempMoviendoX = mouseX - camaraX - e[0];
			tempMoviendoY = mouseY - camaraY - e[1];
			tempMoviendoAngulo = false;
			return;
		}
		if (e[4] != -1) {
			let m = -Math.tan(e[4]);
			let lineapunto = dpuntolinea({x: -camaraX, y: m * (-camaraX - e[0]) + e[1]}, {x: 1024 - camaraX, y: m * (1024 - camaraX - e[0]) + e[1]}, mouseX - camaraX, mouseY - camaraY)
			if (lineapunto < 5) {
				tempMoviendo = e;
				tempMoviendoX = e[0];
				tempMoviendoY = e[1];
				tempMoviendoAngulo = true;
				return
			}
		}
	})
}

//https://stackoverflow.com/questions/31494662/geometry-calculate-distance-of-point-from-line
function dpuntolinea(point1, point2, x0, y0) {
    return ((Math.abs((point2.y - point1.y) * x0 - 
                     (point2.x - point1.x) * y0 + 
                     point2.x * point1.y - 
                     point2.y * point1.x)) /
            (Math.pow((Math.pow(point2.y - point1.y, 2) + 
                       Math.pow(point2.x - point1.x, 2)), 
                      0.5)));
}

function nuevoCentro1() {
	herramienta = 4;
	tempCentroX = mouseX - camaraX;
	tempCentroY = mouseY - camaraY;
	tempInput.elt.style = "display: block";
	tempInput.position(mouseX, mouseY + 10);
	tempInput.elt.focus();
}

function nuevoCentroInfinito1() {
	herramienta = 6;
	tempCentroX = mouseX - camaraX;
	tempCentroY = mouseY - camaraY;
}

function nuevoCentroInfinito2() {
	herramienta = 4;
	tempAngulo = -Math.atan2(tempCentroY - mouseY + camaraY, tempCentroX - mouseX + camaraX) + Math.PI;
	tempInput.elt.style = "display: block";
	tempInput.position(mouseX, mouseY);
	tempInput.elt.focus();
}

function crearCentro() {
	let t = tempInput.elt.value;
	let v1 = parseInt(t.charAt(0), 10);
	let v2 = parseInt(t.charAt(1), 10);
	if (!isNaN(v1) && !isNaN(v2)) {
		if ((v1 != v2) && (v1 > 0) && (v2 > 0)) {
			if (!yaExiste(v1, v2)) {
				centros.push([tempCentroX, tempCentroY, v1, v2, tempAngulo]);
				if (tempAngulo == -1) {
					herramienta = 1;
				} else {
					herramienta = 2;
				}
				resetTemp();
				actualizarPasos();
			}
		}
	}
}

function yaExiste(v1, v2) {
	if (tablafinal[v1 - 1] && (tablafinal[v1 - 1][v2 - 1] > 0)) {
		return true
	}
	return false
}

function resetTemp() {
	tempCentroX = 0;
	tempCentroY = 0;
	tempInput.elt.style = "display: none";
	tempInput.elt.value = "";
	tempAngulo = -1;
	cursor("default")
}