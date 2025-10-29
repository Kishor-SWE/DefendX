document.addEventListener('DOMContentLoaded', () => {
	document.getElementById('year').textContent = String(new Date().getFullYear());
	const connectBtn = document.getElementById('connect');
	const addressEl = document.getElementById('address');
	const bankForm = document.getElementById('bankForm');
	const bankStatus = document.getElementById('bankStatus');

	const BANK_KEY = 'defendx_bank';
	const saved = JSON.parse(localStorage.getItem(BANK_KEY) || 'null');
	if (saved) bankStatus.textContent = `Saved for ${saved.holder}`;

	connectBtn.addEventListener('click', async () => {
		try {
			if (!window.ethereum) {
				alert('Metamask not found. Please install the extension.');
				return;
			}
			const provider = new ethers.BrowserProvider(window.ethereum);
			await provider.send('eth_requestAccounts', []);
			const signer = await provider.getSigner();
			const addr = await signer.getAddress();
			addressEl.textContent = `${addr.slice(0, 6)}…${addr.slice(-4)}`;
		} catch (err) {
			console.error(err);
			alert('Failed to connect wallet');
		}
	});

	bankForm.addEventListener('submit', (e) => {
		e.preventDefault();
		const holder = document.getElementById('holder').value.trim();
		const iban = document.getElementById('iban').value.trim();
		const swift = document.getElementById('swift').value.trim();
		localStorage.setItem(BANK_KEY, JSON.stringify({ holder, iban, swift }));
		bankStatus.textContent = holder ? `Saved for ${holder}` : 'Saved';
	});
});
