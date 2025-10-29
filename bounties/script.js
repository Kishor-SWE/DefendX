document.addEventListener('DOMContentLoaded', () => {
	const { getBounties, submitReport, getMe } = window.DefendXStore;
	document.getElementById('year').textContent = String(new Date().getFullYear());

	const list = document.getElementById('list');
	const modal = document.getElementById('reportModal');
	const closeModal = document.getElementById('closeModal');
	const reportForm = document.getElementById('reportForm');

	function render() {
		const me = getMe();
		const bounties = getBounties().filter(b => b.acceptedBy === me.id);
		if (bounties.length === 0) {
			list.innerHTML = `<div class="card" style="padding:16px;">No accepted bounties yet. Visit <a class="nav-link" href="../hunt/index.html" style="display:inline;">Start Hunting</a> to accept one.</div>`;
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
					<button class="btn" data-report="${b.id}">Submit Report</button>
				</div>
			</div>
		`).join('');
	}

	list.addEventListener('click', (e) => {
		const target = e.target;
		if (target.matches('[data-report]')) {
			document.getElementById('r_bounty_id').value = target.getAttribute('data-report');
			modal.style.display = 'flex';
			document.body.style.overflow = 'hidden';
		}
	});

	closeModal.addEventListener('click', () => { modal.style.display = 'none'; document.body.style.overflow = ''; });
	modal.addEventListener('click', (e) => { if (e.target === modal) { modal.style.display = 'none'; document.body.style.overflow = ''; } });

	const filesInput = document.getElementById('r_files');
	const filesName = document.getElementById('r_files_name');
	const triggerFiles = document.querySelector('label .file-input .trigger');
	if (triggerFiles) {
		triggerFiles.addEventListener('click', () => filesInput && filesInput.click());
	}
	if (filesInput) {
		filesInput.addEventListener('change', () => {
			if (filesInput.files && filesInput.files.length) {
				const names = Array.from(filesInput.files).map(f => f.name).slice(0, 3).join(', ');
				const more = filesInput.files.length > 3 ? ` +${filesInput.files.length - 3} more` : '';
				filesName.textContent = names + more;
			} else {
				filesName.textContent = 'No files selected';
			}
		});
	}

	reportForm.addEventListener('submit', async (e) => {
		e.preventDefault();
		const id = document.getElementById('r_bounty_id').value;
		const type = document.getElementById('r_type').value.trim();
		const details = document.getElementById('r_details').value.trim();
		const filesInput = document.getElementById('r_files');
		if (!type || !details) return;

		async function toDataUrl(file) {
			return new Promise((resolve, reject) => {
				const reader = new FileReader();
				reader.onload = () => resolve(reader.result);
				reader.onerror = reject;
				reader.readAsDataURL(file);
			});
		}

		let attachments = [];
		if (filesInput && filesInput.files && filesInput.files.length) {
			const files = Array.from(filesInput.files);
			attachments = await Promise.all(files.map(async (f) => ({
				name: f.name,
				size: f.size,
				type: f.type,
				dataUrl: await toDataUrl(f)
			})));
		}

		submitReport(id, { type, details, submittedAt: new Date().toISOString(), attachments });
		modal.style.display = 'none';
		reportForm.reset();
		alert('Report submitted with attachments!');
	});

	render();
});
