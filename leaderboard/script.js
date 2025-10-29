document.addEventListener('DOMContentLoaded', () => {
	const { getTopUsers } = window.DefendXStore;
	const tbody = document.querySelector('#lb tbody');
	const users = getTopUsers(10);
	tbody.innerHTML = users.map((u, i) => `
		<tr>
			<td>#${i + 1}</td>
			<td>${u.name}</td>
			<td>${u.points.toLocaleString()}</td>
		</tr>
	`).join('');
	document.getElementById('year').textContent = String(new Date().getFullYear());
});
