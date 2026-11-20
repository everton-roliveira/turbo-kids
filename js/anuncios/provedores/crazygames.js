// Turbo Kids · Anúncios do CrazyGames (SDK v3).
import {carregarScript} from './carregarScript.js';

const sdk=()=>window.CrazyGames&&window.CrazyGames.SDK;
const pedir=tipo=>new Promise(fim=>{try{sdk().ad.requestAd(tipo,{adStarted(){},adFinished(){fim(true);},adError(){fim(false);}});}catch(e){fim(false);}});
export default {
  nome:'crazygames',
  async carregar(){await carregarScript('https://sdk.crazygames.com/crazygames-sdk-v3.js');await sdk().init();},
  carregou(){try{sdk().game.loadingStop();}catch(e){}},
  jogando(){try{sdk().game.gameplayStart();}catch(e){}},
  parou(){try{sdk().game.gameplayStop();}catch(e){}},
  premiado(){return pedir('rewarded');},
  async intervalo(){await pedir('midgame');},
};
