(function () {
	const LOGIN_FLAG = 'defendx_logged_in';

	function isLoggedIn() {
		return localStorage.getItem(LOGIN_FLAG) === 'true';
	}

	function projectRoot() {
		const parts = location.pathname.split('/');
		if (parts.length >= 3) {
			return parts.slice(0, parts.length - 2).join('/') + '/';
		}
		return '/';
	}

	function page(path) { return projectRoot() + path; }
	function onLoginPage() { return /\/login\/index\.html$/i.test(location.pathname); }
	function redirect(to) { location.replace(to); }

	function ensureAuth() {
		if (!isLoggedIn() && !onLoginPage()) {
			redirect(page('login/index.html'));
		}
		if (isLoggedIn() && onLoginPage()) {
			redirect(page('metamask/index.html'));
		}
	}

	function wireLoginForm() {
		if (!onLoginPage()) return;
		const form = document.getElementById('loginForm');
		if (form) {
			form.addEventListener('submit', (e) => {
				try { localStorage.setItem(LOGIN_FLAG, 'true'); } catch {}
				setTimeout(() => redirect(page('metamask/index.html')), 10);
			});
		}
		const goHome = document.getElementById('goHome');
		if (goHome) {
			goHome.addEventListener('click', (e) => {
				e.preventDefault();
				try { localStorage.setItem(LOGIN_FLAG, 'true'); } catch {}
				redirect(page('metamask/index.html'));
			});
		}
	}

	function autoRedirectIfLoggedInOnLogin() {
		if (!onLoginPage()) return;
		let attempts = 0;
		const iv = setInterval(() => {
			attempts += 1;
			if (isLoggedIn()) {
				try { localStorage.setItem(LOGIN_FLAG, 'true'); } catch {}
				redirect(page('metamask/index.html'));
				clearInterval(iv);
			}
			if (attempts > 200) clearInterval(iv);
		}, 50);
	}

	function getCurrentRole() {
		return localStorage.getItem('role') || '';
	}
	function exposeLogout() {
		window.DefendXAuth = {
			logout: () => {
				try {
					localStorage.removeItem(LOGIN_FLAG);
					['defendx_user', 'user', 'account', 'loginData', 'role'].forEach(k => localStorage.removeItem(k));
					sessionStorage.clear();
				} catch {}
				redirect(page('login/index.html'));
			},
			isLoggedIn,
			getRole: getCurrentRole
		};
	}

	function clearLegacyKeysOnLogin() {
		if (!onLoginPage()) return;
		try {
			localStorage.removeItem(LOGIN_FLAG);
			['defendx_user', 'user', 'account', 'loginData', 'role'].forEach(k => localStorage.removeItem(k));
			sessionStorage.clear();
		} catch {}
	}

	function interceptContinueAs() {
		if (!onLoginPage()) return;
		document.addEventListener('click', (e) => {
			const btn = (e.target.closest && e.target.closest('button, a')) || e.target;
			if (!btn) return;
			const text = (btn.textContent || '').toLowerCase();
			if (text.includes('continue as')) {
				e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation();
				// Force full sign-in instead of reusing prior identity
				try {
					localStorage.removeItem(LOGIN_FLAG);
					['defendx_user', 'user', 'account', 'loginData', 'role'].forEach(k => localStorage.removeItem(k));
					sessionStorage.clear();
				} catch {}
				const input = document.querySelector('input[type="email"], input[type="text"], input[name*="user" i]');
				if (input) input.focus();
			}
		}, true);
	}

	function hideNavBasedOnRole() {
		const role = getCurrentRole().toLowerCase();
		const hideForCompany = document.querySelectorAll('[data-hide-company]');
		const hideForSpecialist = document.querySelectorAll('[data-hide-specialist]');
		if (role === 'company') {
			hideForCompany.forEach(el => el.classList.add('hidden'));
		} else if (role === 'cyberspecialist' || role === 'cyber specialist') {
			hideForSpecialist.forEach(el => el.classList.add('hidden'));
		}
	}

	ensureAuth();
	document.addEventListener('DOMContentLoaded', () => {
		clearLegacyKeysOnLogin();
		interceptContinueAs();
		wireLoginForm();
		autoRedirectIfLoggedInOnLogin();
		hideNavBasedOnRole();
		exposeLogout();
	});
})();
