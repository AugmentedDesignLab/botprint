/* Author: AugmentedDesignLab */

// sort of like global variables
var stage,
stats,
camera,
scene,
renderer,
mouseX = 0,
mouseY = 0,
material,
inputImage,
stageCenterX,
stageCenterY,
canvas,
context,
imageWidth,
imageHeight,
stageWidth,
stageHeight,
enableMouseMove = false;

// vars accessible only by GUI
var GUIOptions  = function() {
	this.stageSize 	   = 0.8;
    // TODO add rotate left, right, up, and down...
	this.autoRotate    = false;
};

var chassis_selection = function(){
    this.message = 'chassis.selection';
    //this.explode = function() { ... }
    // this function will have images....
}


var wheels_selection = function(){
    this.message = 'wheels.selection';
    //this.explode = function() { ... }
    // this function will have images....
}



function saveImage() {
	render();
	window.open(renderer.domElement.toDataURL("image/png"));
}

var guiOptions = new GUIOptions();
var ch = new chassis_selection();
var whe = new wheels_selection();


var gui = new dat.GUI({ autoPlace: false });
document.getElementById('controls-container').appendChild(gui.domElement );
var settings = gui.addFolder('General');
settings.add(guiOptions, 'stageSize',.2,1,.1).onChange(doLayout);
settings.add(this, 'saveImage').name('Save Design');
settings.open();

var chassis = gui.addFolder('Chassis');
chassis.add(ch, 'message');

var wheels = gui.addFolder('Wheels');
wheels.add(whe, 'message');


//gui.add(guiOptions, 'stageSize',.2,1,.1).onChange(doLayout);
//gui.add(this, 'saveImage').name('Save Design');

/**
 * Init page
 */
$(document).ready( function() {

	$(window).bind('resize', doLayout);

	//init image drag and drop
	window.addEventListener('dragover', function(event) {
		event.preventDefault();
        // TODO implement me
	}, false);

	window.addEventListener('drop', function(event) {
        event.preventDefault();
        // TODO implement me

		}, false);

	// stop the user getting a text cursor
	document.onselectstart = function() {
		return false;
	};
	
    stage = document.getElementById("stage");

	$("#loadSample").click( function() {
		loadSample();
	});
	
    //init mouse listeners
	$("#stage").mousemove( onMouseMove);
	$(window).mousewheel( onMouseWheel);
	$(window).keydown(onKeyDown);
	$(window).mousedown( function() {
		enableMouseMove = true;
	});
	$(window).mouseup( function() {
	    enableMouseMove = false;
	});
	
    //init stats
	stats = new Stats();
    // Align bottom-left
    stats.getDomElement().style.position = 'absolute';
    stats.getDomElement().style.left = '0px';
    stats.getDomElement().style.bottom = '0px';
    
    statscontainer = document.getElementById("fps-container");
    
    statscontainer.appendChild(stats.getDomElement());

	doLayout();

	if (!Detector.webgl) {
		$("#overlay").empty();
		Detector.addGetWebGLMessage({
			parent: document.getElementById("overlay")
		});

	} else {
		initWebGL();
	}

});

function initWebGL() {

	//init camera
    camera = new THREE.PerspectiveCamera(75, 16/9, 1, 3000);
	camera.position.z = -1000;
	scene = new THREE.Scene();
    scene.add(camera);

	//init renderer
	renderer = new THREE.WebGLRenderer({
		antialias: true,
		clearAlpha: 1,
		sortObjects: false,
		sortElements: false
	});

	doLayout();

	animate();
}

function onImageLoaded() {

	// load image into canvas pixels
    // TODO implement me
}

function onMouseMove(event) {
	if (enableMouseMove) {
		mouseX = event.pageX - stageCenterX;
		mouseY = event.pageY - stageCenterY;
	}
}

function onMouseWheel(e,delta) {
	//guiOptions.scale += delta * 0.1;
	//limit
	//guiOptions.scale = Math.max(guiOptions.scale, .1);
	//guiOptions.scale = Math.min(guiOptions.scale, 10);
}

function onKeyDown(evt) {
	//save on 'S' key
	if (event.keyCode == '83') {
		saveImage();
	}
}

function animate() {
	requestAnimationFrame(animate);
	render();
	stats.update();
}

function render() {

	renderer.render(scene, camera);
}

function doLayout() {

	var winHeight, winWidth, controlsWidth, containerWidth;

	//get dims
	winHeight = window.innerHeight ? window.innerHeight : $(window).height();
	winWidth = window.innerWidth ? window.innerWidth : $(window).width();
	controlsWidth = $('#controls').outerWidth();

	//set container size
	$('#container').height(parseInt(winHeight));
	$('#container').width(parseInt(winWidth) - parseInt(controlsWidth));
	containerWidth = $('#container').outerWidth();

	//set stage size as fraction of window size
	//use letterbox dimensions unless 100%
	stageWidth = containerWidth * guiOptions.stageSize;
	stageHeight = containerWidth * guiOptions.stageSize * 9 / 16;

	if (guiOptions.stageSize === 1) {
		stageHeight = $('#container').outerHeight();
	}
	$('#stage').width(stageWidth);
	$('#stage').height(stageHeight);

	//Center stage div inside window
	$('#stage').css({
		left: Math.max((containerWidth - stageWidth)/2 + controlsWidth,controlsWidth),
		top: (winHeight - stageHeight)/2,
		visibility:"visible"
	});

	//set webgl size
	if (renderer) {
		renderer.setSize(stageWidth, stageHeight);
		camera.aspect = stageWidth / stageHeight;
		camera.updateProjectionMatrix();
	}

	stageCenterX = $('#stage').offset().left + stageWidth / 2;
	stageCenterY = window.innerHeight / 2
}


function loadSample() {
	inputImage = new Image();
	inputImage.src = ("img/vermeer.jpg");

	inputImage.onload = function() {
		onImageLoaded();
	};
}
