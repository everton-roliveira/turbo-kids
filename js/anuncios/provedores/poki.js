// Turbo Kids · Anúncios do Poki (PokiSDK v2).
import {carregarScript} from './carregarScript.js';

const sdk=()=>window.PokiSDK;
export default {
  nome:'poki',
  async carregar(){await carregarScript('https://game-cdn.poki.com/scripts/v2/poki-sdk.js');await sdk().init();},
  carregou(){try{sdk().gameLoadingFinished();}catch(e){}},
  jogando(){try{sdk().gameplayStart();}catch(e){}},
  parou(){try{sdk().gameplayStop();}catch(e){}},
  async premiado(){try{return !!(await sdk().rewardedBreak());}catch(e){return false;}},
  async intervalo(){try{await sdk().commercialBreak();}catch(e){}},
};
