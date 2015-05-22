

//************ LOADERS ********************/
loader = new THREE.JSONLoader();

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
loader.load("obj/housetex.js", 

			function(geometry) {

				volcano2 = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({map: THREE.ImageUtils.loadTexture("obj/brickwall.jpg")}));
				scene.add(volcano2);
				
				volcano2.scale.set(0.5, 0.5, 0.5);

				volcano2.receiveShadow = true;
				volcano2.castShadow = true;
				volcano2.transparent = true;
				visibility(volcano2,false);
		});
//***************************************************