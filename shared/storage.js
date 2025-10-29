(function () {
	const STORAGE_KEYS = {
		users: 'defendx_users',
		bounties: 'defendx_bounties',
		me: 'defendx_me'
	};

	function seedIfEmpty() {
		if (!localStorage.getItem(STORAGE_KEYS.users)) {
			const users = [
				{ id: 'u1', name: 'Specter', points: 980 },
				{ id: 'u2', name: 'HexGuard', points: 910 },
				{ id: 'u3', name: 'CipherWolf', points: 880 },
				{ id: 'u4', name: 'ZeroDayZ', points: 860 },
				{ id: 'u5', name: 'BugHawk', points: 820 },
				{ id: 'u6', name: 'NightCrawler', points: 800 },
				{ id: 'u7', name: 'FuzzMaster', points: 760 },
				{ id: 'u8', name: 'PacketFox', points: 740 },
				{ id: 'u9', name: 'RootSeeker', points: 700 },
				{ id: 'u10', name: 'CryptoCrow', points: 690 },
				{ id: 'u11', name: 'BitRaider', points: 660 }
			];
			localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(users));
		}
		if (!localStorage.getItem(STORAGE_KEYS.bounties)) {
			const bounties = [
				{ id: 'b1', company: 'Acme Corp', url: 'https://acme.example.com', domain: 'Web App - XSS, CSRF', prize: 1500, acceptedBy: null, reports: [] },
				{ id: 'b2', company: 'NovaBank', url: 'https://online.novabank.example', domain: 'API - Auth, IDOR', prize: 3500, acceptedBy: null, reports: [] },
				{ id: 'b3', company: 'Orion Cloud', url: 'https://console.orion.example', domain: 'Cloud - IAM, Misconfig', prize: 2500, acceptedBy: null, reports: [] }
			];
			localStorage.setItem(STORAGE_KEYS.bounties, JSON.stringify(bounties));
		}
		if (!localStorage.getItem(STORAGE_KEYS.me)) {
			localStorage.setItem(STORAGE_KEYS.me, JSON.stringify({ id: 'me', name: 'You', points: 0 }));
		}
	}

	function getUsers() { return JSON.parse(localStorage.getItem(STORAGE_KEYS.users) || '[]'); }
	function setUsers(users) { localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(users)); }

	function getBounties() { return JSON.parse(localStorage.getItem(STORAGE_KEYS.bounties) || '[]'); }
	function setBounties(bounties) { localStorage.setItem(STORAGE_KEYS.bounties, JSON.stringify(bounties)); }

	function getMe() { return JSON.parse(localStorage.getItem(STORAGE_KEYS.me) || '{}'); }
	function setMe(me) { localStorage.setItem(STORAGE_KEYS.me, JSON.stringify(me)); }

	function addBounty(bounty) {
		const bounties = getBounties();
		bounties.push({ ...bounty, id: `b_${Date.now()}`, acceptedBy: null, reports: [] });
		setBounties(bounties);
		return bounties[bounties.length - 1];
	}

	function acceptBounty(bountyId, userId) {
		const bounties = getBounties();
		const bounty = bounties.find(b => b.id === bountyId);
		if (!bounty) return null;
		bounty.acceptedBy = userId;
		setBounties(bounties);
		return bounty;
	}

	function submitReport(bountyId, report) {
		const bounties = getBounties();
		const bounty = bounties.find(b => b.id === bountyId);
		if (!bounty) return null;
		bounty.reports.push({ id: `r_${Date.now()}`, ...report });
		setBounties(bounties);
		return bounty;
	}

	function getTopUsers(limit = 10) {
		return getUsers()
			.sort((a, b) => b.points - a.points)
			.slice(0, limit);
	}

	function addPoints(userId, points) {
		const users = getUsers();
		const u = users.find(x => x.id === userId);
		if (u) {
			u.points += points;
			setUsers(users);
		}
	}

	// Expose globally for simple pages
	window.DefendXStore = {
		seedIfEmpty,
		getUsers,
		setUsers,
		getBounties,
		setBounties,
		getMe,
		setMe,
		addBounty,
		acceptBounty,
		submitReport,
		getTopUsers,
		addPoints
	};

	seedIfEmpty();
})();
