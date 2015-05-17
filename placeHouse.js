function showHouse(pos) {
	if(jumpPlanetOk) {
		console.log("show house planet");



		/*
		loader.load( "obj/house.obj", "obj/house.mtl", function(object){ 
		activePlanet.children[5].add(object);
		object.position.copy( pos );
		object.scale.x = 0.01;
		object.scale.y = 0.01;
		object.scale.z = 0.01;

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
		object.lookAt({ x: 0, y: 0, z: 0 });
		
		}, onProgress, onError);*/
		
	} else if(jumpMoonOk) {
		console.log("show house moon");

		/*loader.load( "obj/house.obj", "obj/house.mtl", function(object){ 
		activeMoon.children[3].add(object);
		object.position.copy( pos );
		object.scale.x = 0.01;
		object.scale.y = 0.01;
		object.scale.z = 0.01;

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
		object.lookAt({ x: 0, y: 0, z: 0 });
		
		}, onProgress, onError);*/
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

				atmosphere.receiveShadow = true;
				atmosphere.castShadow = true;


				meshes.push(object);
				scene.add(object);


		});

	} else if(jumpMoonOk) {
		console.log("create house moon");

		l/*oader.load( "obj/house.obj", "obj/house.mtl", function(object){ 
			activeMoon.children[2].add(object);
			activeMoon.children[3].remove(activeMoon.children[3].children[0]);
			object.position.copy( pos );
			object.scale.x = 0.01;
			object.scale.y = 0.01;
			object.scale.z = 0.01;
			
			object.lookAt({ x: 0, y: 0, z: 0 });

				
		}, onProgress, onError);*/
	}

}