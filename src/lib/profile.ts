export async function fetchProfile() {
  const token = localStorage.getItem('authToken');
  if (!token) throw new Error('No auth token found');
  const res = await fetch('http://localhost:5000/profile', {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error('Failed to fetch profile');
  return await res.json();
}

export async function updateProfile(profileData: any) {
  const token = localStorage.getItem('authToken');
  if (!token) throw new Error('No auth token found');
  const res = await fetch('http://localhost:5000/profile', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(profileData),
  });
  if (!res.ok) throw new Error('Failed to update profile');
  return await res.json();
}

export async function createProfile(profileData: any) {
  const token = localStorage.getItem('authToken');
  if (!token) throw new Error('No auth token found');
  const res = await fetch('http://localhost:5000/profile', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(profileData),
  });
  if (!res.ok) throw new Error('Failed to create profile');
  return await res.json();
} 