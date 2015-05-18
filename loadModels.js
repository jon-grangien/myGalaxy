

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
//***************************************************