document.addEventListener('DOMContentLoaded', () => {
	const yearEl = document.getElementById('year');
	if (yearEl) yearEl.textContent = String(new Date().getFullYear());

	// Remove any stray media or overlays stuck at top-left (e.g., injected image/grid)
	const WHITELIST = new Set(['NAV', 'CANVAS']);
	function looksTopLeft(el) {
		try {
			const rect = el.getBoundingClientRect();
			return rect.left < 60 && rect.top < 160 && rect.width > 20 && rect.height > 20;
		} catch { return false; }
	}
	function hasBackgroundImage(el) {
		const cs = window.getComputedStyle(el);
		return cs && cs.backgroundImage && cs.backgroundImage !== 'none';
	}
	function containsImages(el) {
		return el.querySelector && el.querySelector('img, picture, video');
	}
	function isWhitelisted(el) {
		return WHITELIST.has(el.tagName) || el.id === 'scene' || el.closest && el.closest('nav');
	}
	function nukeTopLeftArtifacts() {
		const all = Array.from(document.querySelectorAll('body *'));
		all.forEach(el => {
			if (isWhitelisted(el)) return;
			if (!looksTopLeft(el)) return;
			if (el.tagName === 'IMG' || el.tagName === 'VIDEO' || hasBackgroundImage(el) || containsImages(el)) {
				// Prefer hiding to reduce layout shifts
				el.style.setProperty('display', 'none', 'important');
			}
		});
	}
	// Initial and repeated attempts for a short time
	nukeTopLeftArtifacts();
	let attempts = 0;
	const interval = setInterval(() => {
		attempts += 1;
		nukeTopLeftArtifacts();
		if (attempts > 30) clearInterval(interval); // ~3s at 100ms
	}, 100);
	const mo = new MutationObserver(() => nukeTopLeftArtifacts());
	mo.observe(document.documentElement, { childList: true, subtree: true, attributes: true });

	const canvas = document.getElementById('scene');
	const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
	const scene = new THREE.Scene();
	const camera = new THREE.PerspectiveCamera(55, 2, 0.1, 100);
	camera.position.set(0, 0, 6.4);

	const resize = () => {
		const width = canvas.clientWidth || canvas.parentElement.clientWidth;
		const height = canvas.clientHeight || canvas.parentElement.clientHeight;
		renderer.setSize(width, height, false);
		camera.aspect = width / height;
		camera.updateProjectionMatrix();
	};
	window.addEventListener('resize', resize);
	resize();

	// Lights
	const light1 = new THREE.DirectionalLight(0xffffff, 1.0);
	light1.position.set(3, 5, 4);
	scene.add(light1);
	const light2 = new THREE.PointLight(0x7c5cff, 1.2, 10);
	light2.position.set(-3, -2, 3);
	scene.add(light2);

	// Geometry: low-poly icosahedron + wireframe
	const geo = new THREE.IcosahedronGeometry(1.6, 1);
	const mat = new THREE.MeshStandardMaterial({
		color: 0x7c5cff,
		metalness: 0.3,
		roughness: 0.35,
		emissive: 0x251e49,
		emissiveIntensity: 0.45
	});
	const mesh = new THREE.Mesh(geo, mat);
	mesh.position.set(5.4, -2.4, 0); // further right and doubled downward offset
	scene.add(mesh);

	const wire = new THREE.WireframeGeometry(geo);
	const line = new THREE.LineSegments(wire, new THREE.LineBasicMaterial({ color: 0x4dd0e1 }));
	mesh.add(line);

	// Particles
	const pGeo = new THREE.BufferGeometry();
	const count = 700;
	const positions = new Float32Array(count * 3);
	for (let i = 0; i < count * 3; i += 3) {
		positions[i] = (Math.random() - 0.5) * 14;
		positions[i + 1] = (Math.random() - 0.5) * 10 + 0.6; // distribute around new globe position
		positions[i + 2] = (Math.random() - 0.5) * 12;
	}
	pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
	const pMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.02, transparent: true, opacity: 0.6 });
	const points = new THREE.Points(pGeo, pMat);
	scene.add(points);

	// Animation
	gsap.to(mesh.rotation, { y: Math.PI * 2, duration: 18, repeat: -1, ease: 'none' });
	gsap.to(mesh.rotation, { x: Math.PI * 2, duration: 22, repeat: -1, ease: 'none' });
	gsap.to(points.rotation, { y: -Math.PI * 2, duration: 60, repeat: -1, ease: 'none' });

	// Float cards animation and positions
	const fc1 = document.getElementById('fc1');
	const fc2 = document.getElementById('fc2');
	const fc3 = document.getElementById('fc3');
	if (fc1 && fc2 && fc3) {
		fc1.style.left = '8%'; fc1.style.top = '-40px';
		fc2.style.left = '40%'; fc2.style.top = '10px';
		fc3.style.right = '10%'; fc3.style.top = '-20px';
		gsap.to(fc1, { y: -10, duration: 2.2, yoyo: true, repeat: -1, ease: 'sine.inOut' });
		gsap.to(fc2, { y: -12, duration: 2.8, yoyo: true, repeat: -1, ease: 'sine.inOut' });
		gsap.to(fc3, { y: -8, duration: 2.4, yoyo: true, repeat: -1, ease: 'sine.inOut' });
	}

	function render(t) {
		renderer.render(scene, camera);
		requestAnimationFrame(render);
	}
	requestAnimationFrame(render);
});
