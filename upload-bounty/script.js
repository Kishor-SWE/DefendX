document.addEventListener('DOMContentLoaded', () => {
	document.getElementById('year').textContent = String(new Date().getFullYear());
	const { addBounty } = window.DefendXStore;
	const form = document.getElementById('bountyForm');
	form.addEventListener('submit', (e) => {
		e.preventDefault();
		const company = document.getElementById('company').value.trim();
		const url = document.getElementById('url').value.trim();
		const domain = document.getElementById('domain').value.trim();
		const prize = Number(document.getElementById('prize').value);
		if (!company || !url || !prize) return;
		addBounty({ company, url, domain, prize });
		form.reset();
		alert('Bounty created!');
	});
});
