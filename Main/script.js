/// Several functions, including the main
/// The scene graph
scene = null;

/// The object for the statistics
stats = null;

/// A boolean to know if the left button of the mouse is down
mouseDown = false;

renderer = null;

camera = null;
controls = null;
moveForward = false;
moveBackward = false;
moveLeft = false;
moveRight = false;
jumping = false;
shooting = false;
enableControls = true; //enables data input by mouse and keyboard


/// It creates the GUI and, optionally, adds statistic information

function createGUI (withStats) {
  var gui = new dat.GUI();

  if (withStats) stats = initStats();
}

/// It adds statistics information to a previously created Div

function initStats() {

  var stats = new Stats();

  stats.setMode(0); // 0: fps, 1: ms

  // Align top-left
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.left = '0px';
  stats.domElement.style.top = '0px';

  $("#Stats-output").append( stats.domElement );

  return stats;
}

/// It shows a feed-back message for the user
function setMessage (str) {
  document.getElementById ("Messages").innerHTML = "<h2>"+str+"</h2>";
}

/// It processes the click-down of the mouse
function onMouseDown (event) {
  if (enableControls) {
    if(event.buttons == 1 && blocker.style.display == 'none') {
      scene.shoot();
      shooting = true;
    }
  }
}

/// It processes keyboard information
function onKeyDown (event) {
  if (enableControls) {
    switch ( event.keyCode ) {

      case 87: // w
        moveForward = true;
        break;

      case 65: // a
        moveLeft = true;
        break;

      case 83: // s
        moveBackward = true;
        break;

      case 68: // d
        moveRight = true;
        break;

      case 32: // space
        jumping = true;
        break;
    }
  }

  if (event.keyCode == 80 && enableControls == false) { // p
    scene.newGame();
  }
}

/// It processes keyboard information
function onKeyUp (event) {
  if (enableControls) {
    switch( event.keyCode ) {
      case 87: // w
        moveForward = false;
        break;

      case 65: // a
        moveLeft = false;
        break;

      case 83: // s
        moveBackward = false;
        break;

      case 68: // d
        moveRight = false;
        break;
    }
  }
}

/// It processes the window size changes
function onWindowResize () {
  scene.setCameraAspect (window.innerWidth / window.innerHeight);
  renderer.setSize (window.innerWidth, window.innerHeight);
}

/// It creates and configures the WebGL renderer

function createRenderer () {
  var renderer = new THREE.WebGLRenderer();
  renderer.setClearColor(new THREE.Color(0xEEEEEE), 1.0);
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild( renderer.domElement );
  renderer.shadowMap.enabled = true;
  return renderer;
}

/// It renders every frame
function render() {
  requestAnimationFrame(render);

  stats.update();

  scene.animate();
  renderer.render(scene, scene.getCamera());
  scene.simulate();
}

/// The main function
$(function () {
  'use strict';
  Physijs.scripts.worker = '../libs/physijs_worker.js';
  Physijs.scripts.ammo = '../libs/ammo.js';


  var instructions = document.getElementById( 'instructions' );
  var title = document.getElementById('title');
  var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;

  if ( havePointerLock ) {

    var element = document.body;

    var pointerlockchange = function ( event ) {

      if ( document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element ) {

        controlsEnabled = true;
        controls.enabled = true;

        enableControls = true;

        blocker.style.display = 'none';

      } else {


        blocker.style.display = 'block';

        instructions.style.display = '';

        //title.innerHTML = "PAUSE";
        instructions.style.fontSize = "50px";
        instructions.innerHTML = "PAUSE";

        enableControls = false;
        controls.enabled = false;

      }

    };

    var pointerlockerror = function ( event ) {

      instructions.style.display = '';

    };

    // Hook pointer lock state change events
    document.addEventListener( 'pointerlockchange', pointerlockchange, false );
    document.addEventListener( 'mozpointerlockchange', pointerlockchange, false );
    document.addEventListener( 'webkitpointerlockchange', pointerlockchange, false );

    document.addEventListener( 'pointerlockerror', pointerlockerror, false );
    document.addEventListener( 'mozpointerlockerror', pointerlockerror, false );
    document.addEventListener( 'webkitpointerlockerror', pointerlockerror, false );

    instructions.addEventListener( 'click', function ( event ) {

      instructions.style.display = 'none';

      // Ask the browser to lock the pointer
      element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;
      element.requestPointerLock();

    }, false );

  } else {

    instructions.innerHTML = 'Your browser doesn\'t seem to support Pointer Lock API';

  }

  var controlsEnabled = false;
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

  // create a render and set the size
  renderer = createRenderer();
  // add the output of the renderer to the html element
  $("#WebGL-output").append(renderer.domElement);
  // listeners
  window.addEventListener ("resize", onWindowResize);
  window.addEventListener ("mousedown", onMouseDown, true);
  window.addEventListener("keydown", onKeyDown, true);
  window.addEventListener("keyup", onKeyUp, true);
  window.addEventListener('click',()=>{
  document.getElementById("song").play();
  });

  // create a scene, that will hold all our elements such as objects, cameras and lights.
  scene = new TheScene (renderer.domElement, camera);
  controls = new THREE.PointerLockControls (camera);
  scene.add( controls.getObject() );

  createGUI(true);

  render();
});
