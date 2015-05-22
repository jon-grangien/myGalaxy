

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


//************* load volcano ***********************
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

//************* load house ***********************

loader2.load( "obj/windmill.obj", "obj/windmill.mtl", function(object){ 
		
		object.scale.set(0.5, 0.5, 0.5);
		volcano2.add(object);
		
		}, onProgress, onError);

visibility(volcano2,false);

/*
loader.load("obj/test1.js", 

			function(geometry) {

				volcano2 = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({map: THREE.ImageUtils.loadTexture("obj/white.png")}));
				scene.add(volcano2);
				
				volcano2.scale.set(0.5, 0.5, 0.5);

				volcano2.receiveShadow = true;
				volcano2.castShadow = true;
				volcano2.transparent = true;
				visibility(volcano2,false);
		});*/
//***************************************************