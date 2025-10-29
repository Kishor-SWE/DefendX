document.addEventListener('DOMContentLoaded', () => {
	document.getElementById('year').textContent = String(new Date().getFullYear());
	const { getMe, setMe } = window.DefendXStore;

	function getLoginUsername() {
		// Try multiple keys/formats from login page
		const direct = localStorage.getItem('defendx_user') || localStorage.getItem('user') || localStorage.getItem('account');
		if (direct) return safeParseString(direct);
		const loginData = localStorage.getItem('loginData');
		if (loginData) {
			try {
				const obj = JSON.parse(loginData);
				return obj.username || obj.name || obj.account || '';
			} catch {}
		}
		return '';
	}
	function safeParseString(value) {
		try {
			const obj = JSON.parse(value);
			if (typeof obj === 'string') return obj;
			if (obj && (obj.username || obj.name)) return obj.username || obj.name;
			return String(value);
		} catch {
			return String(value);
		}
	}

	const usernameInput = document.getElementById('username');
	const usernameForm = document.getElementById('usernameForm');
	const passwordForm = document.getElementById('passwordForm');
	const currentPassword = document.getElementById('currentPassword');
	const newPassword = document.getElementById('newPassword');
	const confirmPassword = document.getElementById('confirmPassword');
	const toggleCurrentPw = document.getElementById('toggleCurrentPw');
	const logoutBtn = document.getElementById('logout');
	const avatar = document.getElementById('avatar');
	const avatarInput = document.getElementById('avatarInput');
	const saveAvatar = document.getElementById('saveAvatar');
	const avatarName = document.getElementById('avatarName');
	const triggerAvatar = document.querySelector('.file-input .trigger');
	if (triggerAvatar) {
		triggerAvatar.addEventListener('click', () => avatarInput && avatarInput.click());
	}
	if (avatarInput) {
		avatarInput.addEventListener('change', () => {
			if (avatarInput.files && avatarInput.files[0]) {
				avatarName.textContent = avatarInput.files[0].name;
			} else {
				avatarName.textContent = 'Choose image…';
			}
		});
	}

	let me = getMe();
	// Derive username from login storage if available
	const loginName = getLoginUsername();
	if (loginName && (!me.name || me.name === 'You')) {
		me = { ...me, name: loginName };
		setMe(me);
	}
	usernameInput.value = me.name || loginName || 'You';
	if (me.profileImage) avatar.style.backgroundImage = `url(${me.profileImage})`;
	if (me.password) {
		currentPassword.dataset.actualPw = me.password;
		currentPassword.dataset.masked = 'true';
		currentPassword.type = 'password';
		currentPassword.value = '•'.repeat(Math.max(6, me.password.length));
	}

	toggleCurrentPw.addEventListener('click', () => {
		const masked = currentPassword.dataset.masked === 'true';
		if (masked) {
			currentPassword.type = 'text';
			currentPassword.value = currentPassword.dataset.actualPw || '';
			currentPassword.dataset.masked = 'false';
		} else {
			currentPassword.type = 'password';
			const actual = currentPassword.dataset.actualPw || '';
			currentPassword.value = actual ? '•'.repeat(Math.max(6, actual.length)) : '';
			currentPassword.dataset.masked = 'true';
		}
	});

	usernameForm.addEventListener('submit', (e) => {
		e.preventDefault();
		const name = usernameInput.value.trim();
		if (!name) return;
		setMe({ ...getMe(), name });
		try { localStorage.setItem('defendx_user', JSON.stringify(name)); } catch {}
		alert('Username updated');
	});

	passwordForm.addEventListener('submit', (e) => {
		e.preventDefault();
		const record = getMe();
		const hasExisting = !!record.password;
		const enteredCurrent = currentPassword.dataset.masked === 'true' ? (currentPassword.dataset.actualPw || '') : currentPassword.value;
		if (hasExisting && enteredCurrent !== record.password) {
			alert('Current password is incorrect');
			return;
		}
		if (newPassword.value.length < 6) {
			alert('New password must be at least 6 characters');
			return;
		}
		if (newPassword.value !== confirmPassword.value) {
			alert('New password and confirmation do not match');
			return;
		}
		const nextPw = newPassword.value;
		setMe({ ...record, password: nextPw });
		currentPassword.dataset.actualPw = nextPw;
		currentPassword.dataset.masked = 'true';
		currentPassword.type = 'password';
		currentPassword.value = '•'.repeat(Math.max(6, nextPw.length));
		newPassword.value = '';
		confirmPassword.value = '';
		alert('Password updated');
	});

	saveAvatar.addEventListener('click', async () => {
		if (!avatarInput.files || !avatarInput.files.length) { alert('Choose an image first'); return; }
		const file = avatarInput.files[0];
		const dataUrl = await new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onload = () => resolve(reader.result);
			reader.onerror = reject;
			reader.readAsDataURL(file);
		});
		setMe({ ...getMe(), profileImage: dataUrl });
		avatar.style.backgroundImage = `url(${dataUrl})`;
		avatarInput.value = '';
		alert('Avatar saved');
	});

	logoutBtn.addEventListener('click', () => {
		if (window.DefendXAuth && window.DefendXAuth.logout) {
			window.DefendXAuth.logout();
		} else {
			['defendx_logged_in','defendx_user','user','account','loginData','role'].forEach(k => localStorage.removeItem(k));
			location.replace('../login/index.html');
		}
	});
});
