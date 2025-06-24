/**
 * Busca um usuário pelo id
 * @param {number} id
 * @returns {Promise<{ id: number, username: string, name?: string }>} user
 */
export async function getUserById(id) {
  const res = await fetch(`/users/${id}`);
  if (!res.ok) throw new Error('Usuário não encontrado');
  return await res.json();
}