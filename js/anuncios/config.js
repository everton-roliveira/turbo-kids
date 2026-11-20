// Turbo Kids · Configuração dos anúncios com prêmio.
// plataforma: 'auto' descobre pelo endereço (poki.com / crazygames.com); ou fixe 'poki', 'crazygames', 'teste' ou 'nenhum'.
// No endereço também dá para forçar: ?anuncios=teste (anúncio simulado de 3 segundos, para experimentar).
export const CONFIG_ANUNCIOS={
  plataforma:'auto',
  limiteDiario:6,      // anúncios com prêmio por dia (o administrador não tem limite)
  moedasPorAnuncio:200,
  turbosExtras:2,
  // intervalo entre corridas (anúncio que o portal decide quando mostrar). É o que mais rende nos portais.
  intervaloEntreCorridas:true,
};
// hash SHA-256 do código do administrador (o código não fica no jogo)
export const HASH_ADMIN='b2e9c656e9f5d1407307654d9cb80efffbaf8e04ec61d12d8fc4215487525089';
