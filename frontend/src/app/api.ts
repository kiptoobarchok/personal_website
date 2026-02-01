export async function fetchBio() {
  const res = await fetch('http://localhost:8000/api/bio/');
  if (!res.ok) throw new Error('Failed to fetch bio');
  return res.json();
}

export async function fetchProjects() {
  const res = await fetch('http://localhost:8000/api/projects/');
  if (!res.ok) throw new Error('Failed to fetch projects');
  return res.json();
}
