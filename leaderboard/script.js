document.addEventListener('DOMContentLoaded', () => {
	const { getTopUsers, getMe } = window.DefendXStore;
	const tbody = document.querySelector('#lb tbody');
	const users = getTopUsers(10);
	const me = getMe();

	function hashCode(str) {
		let h = 0; for (let i = 0; i < str.length; i++) { h = ((h << 5) - h) + str.charCodeAt(i); h |= 0; }
		return Math.abs(h);
	}
	function colorFromName(name) {
		const h = hashCode(name || '?') % 360;
		const s = 70; // saturation
		const l1 = 30, l2 = 45;
		return `linear-gradient(135deg, hsl(${h} ${s}% ${l1}% / 1), hsl(${(h+30)%360} ${s}% ${l2}% / 1))`;
	}

	function avatarHTML(name) {
		const initial = (name || '?').trim().charAt(0).toUpperCase();
		const useMe = me && me.name && name && me.name.toLowerCase() === name.toLowerCase() && me.profileImage;
		if (useMe) {
			return `<span class="avatar-small"><img src="${me.profileImage}" alt="${name}" /></span>`;
		}
		const bg = colorFromName(name || initial);
		return `<span class="avatar-small" style="background: ${bg}">${initial}</span>`;
	}

	function rankCell(i) {
		const rank = i + 1;
		if (rank === 1) return '<span class="rank medal">🥇</span>';
		if (rank === 2) return '<span class="rank medal">🥈</span>';
		if (rank === 3) return '<span class="rank medal">🥉</span>';
		return `<span class=\"rank num\">${rank}</span>`;
	}

	tbody.innerHTML = users.map((u, i) => `
		<tr>
			<td class="rank-cell">${rankCell(i)}</td>
			<td><span class="name-cell">${avatarHTML(u.name)}<span>${u.name}</span></span></td>
			<td>${u.points.toLocaleString()}</td>
		</tr>
	`).join('');
	document.getElementById('year').textContent = String(new Date().getFullYear());
});
