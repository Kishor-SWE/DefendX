document.addEventListener('DOMContentLoaded', () => {
	const { getBounties, acceptBounty, submitReport, getMe, addPoints } = window.DefendXStore;
	document.getElementById('year').textContent = String(new Date().getFullYear());

	const list = document.getElementById('list');
	const modal = document.getElementById('reportModal');
	const closeModal = document.getElementById('closeModal');
	const reportForm = document.getElementById('reportForm');

	function render() {
		const bounties = getBounties();
		list.innerHTML = bounties.map(b => `
			<div class="bounty">
				<div>
					<div style="font-weight:700;">${b.company}</div>
					<div style="color:var(--muted);">${b.url}</div>
					<div style="color:var(--muted); font-size: 12px;">${b.domain || 'General'}</div>
				</div>
				<div style="display:flex; gap:8px; align-items:center;">
					<div style="font-weight:700;">$${b.prize.toLocaleString()}</div>
					${b.acceptedBy ? `<span class="nav-link" style="border:1px solid var(--border); border-radius: 8px;">Accepted</span>` : `<button class="btn" data-accept="${b.id}">Accept</button>`}
					<button class="btn" data-report="${b.id}" ${b.acceptedBy ? '' : 'disabled'}>Submit Report</button>
				</div>
			</div>
		`).join('');
	}

	list.addEventListener('click', (e) => {
		const target = e.target;
		if (target.matches('[data-accept]')) {
			const id = target.getAttribute('data-accept');
			const me = getMe();
			acceptBounty(id, me.id);
			render();
		}
		if (target.matches('[data-report]') && !target.disabled) {
			document.getElementById('r_bounty_id').value = target.getAttribute('data-report');
			modal.style.display = 'flex';
			document.body.style.overflow = 'hidden';
		}
	});

	closeModal.addEventListener('click', () => { modal.style.display = 'none'; document.body.style.overflow = ''; });
	modal.addEventListener('click', (e) => { if (e.target === modal) { modal.style.display = 'none'; document.body.style.overflow = ''; } });

	reportForm.addEventListener('submit', (e) => {
		e.preventDefault();
		const id = document.getElementById('r_bounty_id').value;
		const type = document.getElementById('r_type').value.trim();
		const details = document.getElementById('r_details').value.trim();
		if (!type || !details) return;
		submitReport(id, { type, details, submittedAt: new Date().toISOString() });
		addPoints(getMe().id, 50); // demo points award
		modal.style.display = 'none';
		reportForm.reset();
		alert('Report submitted! You gained 50 points.');
	});

	render();
});
