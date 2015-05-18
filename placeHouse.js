function showHouse(pos) {
	if(jumpPlanetOk) {
		console.log("show house planet");

		visibility(volcano,true);
		//volcano.materials[0].opacity = 0.2;
		volcano.position.copy( pos );
		volcano.lookAt({ x: 0, y: 0, z: 0 });

		
	} else if(jumpMoonOk) {
		console.log("show house moon");

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
				object.lookAt({ x: 0, y: 0, z: 0 });

				object.receiveShadow = true;
				object.castShadow = true;
				object.transparent = true;
				object.opacity = 0.2;





		});
	}
	
}

function createHouse(pos) {
	console.log("create house planet");

	if(jumpPlanetOk) {

		loader.load("obj/volcano.js", 

			function(geometry) {

				object = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({map: THREE.ImageUtils.loadTexture("obj/volcano.png")}));
				activePlanet.children[4].add(object);
				activePlanet.children[5].remove(activePlanet.children[5].children[0]);
				object.position.copy( pos );
				object.scale.set(0.5, 0.5, 0.5);
				object.lookAt({ x: 0, y: 0, z: 0 });

				object.receiveShadow = true;
				object.castShadow = true;


				meshes.push(object);

		});

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

}