

//************ LOADERS ********************/

//JSON
loader = new THREE.JSONLoader();

///OBJ
onProgress = function ( xhr ) {
	if ( xhr.lengthComputable ) {
		var percentComplete = xhr.loaded / xhr.total * 100;
		console.log( Math.round(percentComplete, 2) + '% downloaded' );
	}
};
onError = function ( xhr ) {
	console.log("build house error " + xhr);
};
THREE.Loader.Handlers.add( /\.dds$/i, new THREE.DDSLoader() );

// Loader
loader2 = new THREE.OBJMTLLoader();


//************* JSON ***********************
loader.load("obj/volcano.js", 

			function(geometry) {

				volcano = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({map: THREE.ImageUtils.loadTexture("obj/volcano.png")}));
				scene.add(volcano);
				
				volcano.scale.set(0.5, 0.5, 0.5);

				volcano.receiveShadow = true;
				volcano.castShadow = true;
				volcano.transparent = true;
				visibility(volcano,false);
		});

//************* OBJ ***********************

loader2.load( "obj/windmill.obj", "obj/windmill.mtl", function(object){ 
		
		object.scale.set(0.2, 0.2, 0.2);
		windmill.add(object);
		windmill.traverse( function ( object ) { object.visible = false; } );
		}, onProgress, onError);



loader2.load( "obj/bridge.obj", "obj/bridge.mtl", function(object){ 
		
		object.scale.set(0.7, 0.7, 0.7);
		bridge.add(object);
		bridge.traverse( function ( object ) { object.visible = false; } );
		}, onProgress, onError);

loader2.load( "obj/goose.obj", "obj/goose.mtl", function(object){ 
		
		object.scale.set(0.7, 0.7, 0.7);
		goose.add(object);
		goose.traverse( function ( object ) { object.visible = false; } );
		}, onProgress, onError);


/*
loader.load("obj/test1.js", 

			function(geometry) {

				windmill = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({map: THREE.ImageUtils.loadTexture("obj/white.png")}));
				scene.add(windmill);
				
				windmill.scale.set(0.5, 0.5, 0.5);

				windmill.receiveShadow = true;
				windmill.castShadow = true;
				windmill.transparent = true;
				visibility(windmill,false);
		});*/
//***************************************************