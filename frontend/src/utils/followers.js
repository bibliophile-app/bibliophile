// utils/followers.js

/**
 * Verifica se o usuário logado segue outro usuário
 * @param {number} followerId - id do usuário logado
 * @param {number} followeeId - id do perfil visitado
 * @returns {Promise<boolean>}
 */
export async function checkFollowing(followerId, followeeId) {
  const res = await fetch(`/followers/check?followerId=${followerId}&followeeId=${followeeId}`, { credentials: 'include' });
  if (!res.ok) throw new Error('Erro ao verificar follow');
  const data = await res.json();
  return data.isFollowing;
}

/**
 * Segue um usuário
 * @param {number} followeeId - id do usuário a ser seguido
 * @returns {Promise<void>}
 */
export async function followUser(followeeId) {
  const res = await fetch('/followers', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ followeeId })
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || 'Erro ao seguir usuário');
  }
}

/**
 * Deixa de seguir um usuário
 * @param {number} followeeId - id do usuário a ser deixado de seguir
 * @returns {Promise<void>}
 */
export async function unfollowUser(followeeId) {
  const res = await fetch('/followers', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ followeeId })
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || 'Erro ao deixar de seguir usuário');
  }
}

/**
 * Retorna a quantidade de pessoas que o usuário segue
 * @param {number} userId
 * @returns {Promise<number>}
 */
export async function getFollowingCount(userId) {
  const res = await fetch(`/followers/${userId}/following`, { credentials: 'include' });
  if (!res.ok) throw new Error('Erro ao buscar followings');
  const data = await res.json();
  return Array.isArray(data) ? data.length : 0;
}

/**
 * Retorna a quantidade de seguidores do usuário
 * @param {number} userId
 * @returns {Promise<number>}
 */
export async function getFollowersCount(userId) {
  const res = await fetch(`/followers/${userId}/followers`, { credentials: 'include' });
  if (!res.ok) throw new Error('Erro ao buscar followers');
  const data = await res.json();
  return Array.isArray(data) ? data.length : 0;
}

/**
 * Retorna a lista de seguidores do usuário
 * @param {number} userId
 * @returns {Promise<Array<{username: string}>>}
 */
export async function getFollowers(userId) {
  const res = await fetch(`/followers/${userId}/followers`, { credentials: 'include' });
  if (!res.ok) throw new Error('Erro ao buscar followers');
  return await res.json();
}

/**
 * Retorna a lista de usuários que o usuário segue
 * @param {number} userId
 * @returns {Promise<Array<{followerId: number, followeeId: number}>>}
 */
export async function getFollowing(userId) {
  const res = await fetch(`/followers/${userId}/following`, { credentials: 'include' });
  if (!res.ok) throw new Error('Erro ao buscar followings');
  return await res.json();
}
