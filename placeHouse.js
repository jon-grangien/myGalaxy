function showHouse(pos) {
	if(jumpPlanetOk) {
		//console.log("show house planet");

		if(building == 1){
			visibility(volcano,true);
			//volcano.materials[0].opacity = 0.2;
			
					//console.log(pos.x, pos.y, pos.z);
			volcano.position.copy({ x: pos.x*activePlanetSize, y: pos.y*activePlanetSize, z: pos.z*activePlanetSize });
			volcano.lookAt({ x: 0, y: 0, z: 0 });	
		}

		if(building == 2){
			windmill.traverse( function ( object ) { object.visible = true; } );
			windmill.position.copy({ x: pos.x*activePlanetSize, y: pos.y*activePlanetSize, z: pos.z*activePlanetSize });
			windmill.lookAt({ x: 0, y: 0, z: 0 });	
		}

		
	} else if(jumpMoonOk) {
		//console.log("show house moon");

		loader.load("obj/volcano.js", 

			function(geometry) {


				visibility(volcano,true);
				volcano.position.copy( pos );
				volcano.lookAt({ x: 0, y: 0, z: 0 });

/*
				object.traverse( function ( child ) {
					if ( child instanceof THREE.Mesh ) {
						var  geometry = child.geometry;
						material = child.material;
						mesh = new THREE.Mesh(geometry, material);
						var customMaterial = new THREE.ShaderMaterial( 
						{
							uniforms: {  },
							vertexShader:   document.getElementById( 'vertexShader'   ).textContent,
							fragmentShader: document.getElementById( 'fragmentShader' ).textContent,
							side: THREE.BackSide,
							blending: THREE.AdditiveBlending,
							transparent: true

						}   );
						//child.material = customMaterial;
						child.material.wireframe = true;
					}
				});
		*/		

		});
	}
	
}

function createHouse(pos) {
	console.log("create house planet");
	document.getElementById('multiaudio3').play();

	if(jumpPlanetOk) {

		if(building == 1){
			loader.load("obj/volcano.js", 

				function(geometry) {

					object = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({map: THREE.ImageUtils.loadTexture("obj/volcano.png")}));
					activePlanet.children[4].add(object);
					activePlanet.children[5].remove(activePlanet.children[5].children[0]);
					object.position.copy( pos );
					for (var i = 0; i < planetSizes.length; i++) {
						if (planetSizes[i][0] == activePlanet) {
							buildingSize = 0.5/planetSizes[i][1];
						}
					}
					object.scale.set(buildingSize,buildingSize,buildingSize);
					object.lookAt({ x: 0, y: 0, z: 0 });

					object.receiveShadow = true;
					object.castShadow = true;
					meshes.push(object);

			});	
		}

		if(building == 2){

			loader2.load( "obj/windmill.obj", "obj/windmill.mtl", function(object){ 
					
					activePlanet.children[4].add(object);
					activePlanet.children[5].remove(activePlanet.children[5].children[0]);
					object.position.copy( pos );
					for (var i = 0; i < planetSizes.length; i++) {
						if (planetSizes[i][0] == activePlanet) {
							buildingSize = 0.5/planetSizes[i][1];
						}
					}
					object.scale.set(buildingSize,buildingSize,buildingSize);
					object.lookAt({ x: 0, y: 0, z: 0 });

					meshes.push(object);
					
					}, onProgress, onError);




			/*loader.load("obj/test1.js", 

				function(geometry) {

					object = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({map: THREE.ImageUtils.loadTexture("obj/white.png")}));
					activePlanet.children[4].add(object);
					activePlanet.children[5].remove(activePlanet.children[5].children[0]);
					object.position.copy( pos );
					object.scale.set(0.5, 0.5, 0.5);
					object.lookAt({ x: 0, y: 0, z: 0 });

					object.receiveShadow = true;
					object.castShadow = true;
					meshes.push(object);

			});	*/
		}

		

	} else if(jumpMoonOk) {
		console.log("create house moon");

		loader.load("obj/volcano.js", 

			function(geometry) {

				object = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({map: THREE.ImageUtils.loadTexture("obj/volcano.png")}));
				activeMoon.children[2].add(object);
				activeMoon.children[3].remove(activeMoon.children[3].children[0]);
				object.position.copy( pos );
				object.scale.set(0.5, 0.5, 0.5);
				object.lookAt({ x: 0, y: 0, z: 0 });
				object.receiveShadow = true;
				object.castShadow = true;

				meshes.push(object);

		});
	}



	visibility(volcano,false);
	windmill.traverse( function ( object ) { object.visible = false; } );

}