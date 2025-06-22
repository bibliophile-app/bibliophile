// Função para buscar todos os usuários
export async function fetchAllUsers() {
  const response = await fetch('/users');
  if (!response.ok) throw new Error('Erro ao buscar usuários');
  return await response.json();
}
