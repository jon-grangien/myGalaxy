<?php
session_start();
?>

<!DOCTYPE html>
<html>
	<head>
		<title> Ships and satellites</title>
		<meta charset="utf-8">
		<style>
			body { margin: 0; }
			canvas { width: 100%; height: 100% }
		</style>
	</head>
	<body>
		<script src="js/three.js"></script>
		<script src="js/TrackballControls.js"></script>
		<script src="js/MTLLoader.js"></script>
		<script src="js/OBJMTLLoader.js"></script>
		<script src="js/OBJLoader.js"></script>
		<script src="js/OrbitControls.js"></script>
		<script type="text/javascript" src="js/DAT.GUI.min.js"></script>
		
		<script>
			var scene = new THREE.Scene();
			var camera = new THREE.PerspectiveCamera( 60, window.innerWidth/window.innerHeight, 0.1, 4000 );
			camera.position.z = 30;
			scene.add(camera);
			
			var renderer = new THREE.WebGLRenderer();
			renderer.setSize( window.innerWidth, window.innerHeight );
			document.body.appendChild( renderer.domElement );

			//Skapar en grupp som ska innehålla hela scengrafen
			sceneGraph = new THREE.Object3D;		
			
			var A_light = new THREE.AmbientLight( 0x404040 ); // soft white light
			sceneGraph.add( A_light );
			
			var light = new THREE.DirectionalLight( 0xffffff,0.7 );
			light.position.set( 20, 20, 20 ).normalize();
			sceneGraph.add(light);

			// Sun
			sunGroup =new THREE.Object3D;
			var sunGeometry = new THREE.SphereGeometry( 5, 32, 32 );
			var sunMaterial = new THREE.MeshPhongMaterial();
			sunMaterial.map    = THREE.ImageUtils.loadTexture('textures/suntexture.jpg');
			sunMaterial.bumpMap    = THREE.ImageUtils.loadTexture('textures/suntexture.jpg');
			sunMaterial.bumpScale = 0.06;
			sunMaterial.specular  = new THREE.Color('grey');
			var sunSphere = new THREE.Mesh( sunGeometry, sunMaterial );
			sunGroup.add(sunSphere);

			// User planet
			var customSphere;


			/******* GUI *******/
	        var gui = new dat.GUI();

			var parameters = {
				msg: "ta det lugnt",
				showMsg: function() { alert( parameters.a ) },
				visible: true,
				add: function() { addSphere() },
				x: 0
			};

			gui.add( parameters, 'msg' ).name('Meddelande');						
			gui.add( parameters, 'showMsg' ).name("Visa");
			gui.add( parameters, 'add').name("Spawn new planet");

			var normandyVisible = gui.add( parameters, 'visible' ).name('Show normandy').listen();
			
			var folder1 = gui.addFolder('Planet properties');
			sphereX = folder1.add( parameters, 'x' ).min(20).max(350).step(1).listen();
			folder1.open();

			sphereX.onChange(function(value) 
			{   customSphere.position.x = value;   });
			/*******************/

	        /****** NORMANDY *******/
			var normandyOnProgress = function ( xhr ) {
	            if ( xhr.lengthComputable ) {
	                var percentComplete = xhr.loaded / xhr.total * 100;
	                console.log( Math.round(percentComplete, 2) + '% of Normandy downloaded' );
	            }
	        };

	        var onError = function ( xhr ) {
				console.log( 'Error loading Normandy' );
	        };

	        var loader = new THREE.OBJLoader();
	        var normandy;
	        loader.load( "normandy/normandy4.obj", function(normandy){ 
	            normandy.scale.x = 0.02;
	            normandy.scale.y = 0.02;
	            normandy.scale.z = 0.02;

	            normandy.position.x = 10;
	            normandy.rotation.x = -Math.PI / 2;

				normandyVisible.onChange(function(value) 
				{   normandy.visible = value;  	});
	            
	            sunGroup.add(normandy);
	        },normandyOnProgress, onError);
	        /************************/


			galaxyGroup = new THREE.Object3D;
			var galaxyGeometry = new THREE.SphereGeometry( 1500, 32, 32 );
			var galaxyMaterial = new THREE.MeshPhongMaterial();
			galaxyMaterial.map = THREE.ImageUtils.loadTexture('textures/Starfield_by_meliad.jpg');
			galaxyMaterial.side = THREE.DoubleSide;
			var galaxySphere = new THREE.Mesh( galaxyGeometry, galaxyMaterial );
			
			galaxyGroup.add(galaxySphere);			
			sceneGraph.add(galaxyGroup);

			//Lägger till grupper till scengraf
			galaxyGroup.add(sunGroup);
			
			//Lägger till scengraf till scen
			scene.add(sceneGraph);
			sceneGraph.rotation.x += 0.5;
			
			// controls = new THREE.TrackballControls( camera );
			// controls.zoomSpeed = 0.5;
			// controls.panSpeed = 0;
			// controls.rotateSpeed = 3;
			controls = new THREE.OrbitControls( camera, renderer.domElement );

			gui.open();

			window.addEventListener( 'resize', onWindowResize, false );
			function onWindowResize() {
				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();
				renderer.setSize( window.innerWidth, window.innerHeight );
			}

			function addSphere(){
				var sphereGeometry = new THREE.SphereGeometry( 5, 32, 32 );
				var sphereMaterial = new THREE.MeshPhongMaterial();
				customSphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

				customSphere.position.x = 40;

				sunGroup.add(customSphere);

			}

			//Renderingsloop
			var render = function () {
				requestAnimationFrame( render );
				controls.update();

				sunGroup.rotation.z += 0.01;

				renderer.render(scene, camera);
			};

			render();
		</script>
	</body>
</html>
