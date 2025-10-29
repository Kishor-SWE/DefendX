document.addEventListener('DOMContentLoaded', () => {
	document.getElementById('year').textContent = String(new Date().getFullYear());
	const { getBounties, acceptBounty, getMe } = window.DefendXStore;

	const list = document.getElementById('list');

	function render() {
		const bounties = getBounties().filter(b => !b.acceptedBy);
		if (bounties.length === 0) {
			list.innerHTML = `<div class="card" style="padding:16px;">No available bounties. Check back later.</div>`;
			return;
		}
		list.innerHTML = bounties.map(b => `
			<div class="bounty">
				<div>
					<div style="font-weight:700;">${b.company}</div>
					<div style="color:var(--muted);">${b.url}</div>
					<div style="color:var(--muted); font-size: 12px;">${b.domain || 'General'}</div>
				</div>
				<div style="display:flex; gap:8px; align-items:center;">
					<div style="font-weight:700;">$${b.prize.toLocaleString()}</div>
					<button class="btn" data-accept="${b.id}">Accept</button>
				</div>
			</div>
		`).join('');
	}

	list.addEventListener('click', (e) => {
		const target = e.target;
		if (target.matches('[data-accept]')) {
			const id = target.getAttribute('data-accept');
			acceptBounty(id, getMe().id);
			render();
			alert('Bounty accepted! You can now submit a report from the Bounties page.');
		}
	});

	render();
});
