function showHouse(pos) {
	loader.load( "obj/house.obj", "obj/house.mtl", function(object){ 
		activePlanet.children[4].add(object);
		object.position.copy( pos );
		object.scale.x = 0.01;
		object.scale.y = 0.01;
		object.scale.z = 0.01;

		object.traverse( function ( child ) {

		if ( child instanceof THREE.Mesh )
		{

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
		
	}, onProgress, onError);
}

function createHouse(pos) {
	loader.load( "obj/house.obj", "obj/house.mtl", function(object){ 
		activePlanet.children[4].add(object);
		object.position.copy( pos );
		object.scale.x = 0.01;
		object.scale.y = 0.01;
		object.scale.z = 0.01;
		
		object.lookAt({ x: 0, y: 0, z: 0 });
		
	}, onProgress, onError);
}