// Leaderboard data
const leaderboardData = [
  {
    rank: 1,
    name: "Jessica Jezz",
    volume: "133,800.22",
    avatar_color: "#2C2C2C"
  },
  {
    rank: 2,
    name: "King Smith",
    volume: "133,800.22",
    avatar_color: "#4A3429"
  },
  {
    rank: 3,
    name: "King Smith",
    volume: "133,800.22",
    avatar_color: "#5A5A5A"
  },
  {
    rank: 4,
    name: "King Smith",
    volume: "133,800.22",
    avatar_color: "#6B4E3D"
  },
  {
    rank: 5,
    name: "King Smith",
    volume: "133,800.22",
    avatar_color: "#8B7355"
  },
  {
    rank: 6,
    name: "King Smith",
    volume: "133,800.22",
    avatar_color: "#4A4A4A"
  },
  {
    rank: 7,
    name: "Alex Turner",
    volume: "128,500.15",
    avatar_color: "#6A5ACD"
  },
  {
    rank: 8,
    name: "Sarah Chen",
    volume: "125,300.88",
    avatar_color: "#FF6B6B"
  },
  {
    rank: 9,
    name: "Mike Johnson",
    volume: "120,450.33",
    avatar_color: "#4ECDC4"
  },
  {
    rank: 10,
    name: "Emma Wilson",
    volume: "115,200.67",
    avatar_color: "#95E1D3"
  }
];

const currencySymbol ="";

// Function to create an avatar element
function createAvatar(color) {
  const avatar = document.createElement('div');
  avatar.className = 'item-avatar';
  avatar.style.backgroundColor = color;
  return avatar;
}

// Function to create a leaderboard item
function createLeaderboardItem(entry) {
  const item = document.createElement('div');
  item.className = 'leaderboard-item';
  
  // Left side: rank, avatar, name
  const leftSide = document.createElement('div');
  leftSide.className = 'item-left';
  
  const rank = document.createElement('div');
  rank.className = 'item-rank';
  rank.textContent = entry.rank;
  
  const avatar = createAvatar(entry.avatar_color);
  
  const name = document.createElement('div');
  name.className = 'item-name';
  name.textContent = entry.name;
  
  leftSide.appendChild(rank);
  leftSide.appendChild(avatar);
  leftSide.appendChild(name);
  
  // Right side: volume
  const volume = document.createElement('div');
  volume.className = 'item-volume';
  volume.textContent = `${currencySymbol}${entry.volume}`;
  
  item.appendChild(leftSide);
  item.appendChild(volume);
  
  // Add click event for interaction
  item.addEventListener('click', () => {
    // Remove active class from all items
    document.querySelectorAll('.leaderboard-item').forEach(i => {
      i.style.outline = 'none';
    });
    // Add active state to clicked item
    item.style.outline = '2px solid var(--color-primary)';
    item.style.outlineOffset = '-2px';
  });
  
  return item;
}

// Function to render the leaderboard
function renderLeaderboard() {
  const leaderboardContainer = document.getElementById('leaderboard');
  
  // Clear existing content
  leaderboardContainer.innerHTML = '';
  
  // Create and append leaderboard items
  leaderboardData.forEach(entry => {
    const item = createLeaderboardItem(entry);
    leaderboardContainer.appendChild(item);
  });
}

// Initialize the leaderboard when the page loads
document.addEventListener('DOMContentLoaded', renderLeaderboard);