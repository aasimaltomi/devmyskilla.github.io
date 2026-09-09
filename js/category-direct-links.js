(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.CategoryDirectLinks=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';

  const text=value=>String(value==null?'':value);
  const english=field=>field&&field.name&&typeof field.name==='object'?(field.name.en||field.name.ar||field.name.tr||field.id||''):text(field&&field.id||'');
  const enc=value=>encodeURIComponent(text(value));

  const IBM_TOPICS=Object.freeze({
    'artificial-intelligence':'ai',
    'business-professional-skills':'business',
    'cybersecurity':'security',
    'data-analytics':'data',
    'design':'design',
    'it-cloud':'cloud',
    'software-development':'software'
  });
  const IBM_INDUSTRIES=Object.freeze({
    education:'Education',
    healthcare:'Healthcare',
    marketing:'Marketing',
    'sports-entertainment':'Sports & Entertainment'
  });
  const FORAGE_SLUGS=Object.freeze({
    'banking-financial-services':'banking-and-financial-services',
    'artificial-intelligence':'ai',
    'data-analytics':'data'
  });
  const CODECADEMY_LANGUAGE_IDS=new Set(['bash-shell','c','c-sharp','c-plus-plus','go','html-css','java','javascript','kotlin','php','python','r','ruby','sql','swift']);
  const CODECADEMY_SPECIAL=Object.freeze({
    ai:'https://www.codecademy.com/catalog/subject/artificial-intelligence',
    'certification-prep':'https://www.codecademy.com/catalog/certification-prep',
    it:'https://www.codecademy.com/catalog/subject/information-technology'
  });
  const NVIDIA_TABS=Object.freeze({
    'accelerated-computing':'accelerated-computing',
    'ai-infrastructure':'infrastructure',
    'data-science':'data-science',
    'deep-learning':'deep-learning',
    'generative-ai-llms':'generative-ai-llm',
    'graphics-simulation':'simulation-and-physical-ai'
  });
  const EDRAAK_CATEGORIES=Object.freeze({
    'career-readiness':'career-readiness',
    technology:'technology',
    'personal-development':'personal-development',
    'business-entrepreneurship':'business-and-entrepreneurship',
    languages:'languages'
  });

  function resolve(platformId,field){
    const id=text(field&&field.id||'');
    const label=english(field);
    switch(text(platformId)){
      case 'plat-2':
        return `https://agora.unicef.org/local/catalogue/index.php?query=${enc(label)}`;
      case 'plat-3':
        if(IBM_TOPICS[id])return `https://skillsbuild.org/learning-catalog?topic=${enc(IBM_TOPICS[id])}`;
        if(IBM_INDUSTRIES[id])return `https://skillsbuild.org/learning-catalog?industry=${enc(IBM_INDUSTRIES[id])}`;
        return `https://skillsbuild.org/learning-catalog?search=${enc(label)}`;
      case 'plat-4':
        return `https://www.theforage.com/simulations?careers=${enc(FORAGE_SLUGS[id]||id)}`;
      case 'plat-5':
        return `https://learn.microsoft.com/en-us/training/browse/?terms=${enc(label)}`;
      case 'plat-6':
        return `https://academy.itu.int/training-courses/full-catalogue/by-topic?search_api_fulltext=${enc(label)}`;
      case 'plat-7':
        return `https://www.edx.org/learn/${enc(id)}`;
      case 'plat-8':
        if(CODECADEMY_SPECIAL[id])return CODECADEMY_SPECIAL[id];
        if(CODECADEMY_LANGUAGE_IDS.has(id))return `https://www.codecademy.com/catalog/language/${enc(id==='bash-shell'?'bash':id)}`;
        return `https://www.codecademy.com/catalog/subject/${enc(id)}`;
      case 'plat-9':
        return `https://event.unitar.org/full-catalog?search=${enc(id==='unosat'?'UNOSAT':label)}`;
      case 'plat-10':
        return `https://e.huawei.com/en/talent/search/?q=${enc(label)}`;
      case 'plat-13':
        if(NVIDIA_TABS[id])return `https://www.nvidia.com/en-us/training/self-paced-courses/?tab=${enc(NVIDIA_TABS[id])}&section=self-paced-courses`;
        return text(field&&field.officialUrl||'');
      case 'plat-17':
        return 'https://www.sololearn.com/en/learn/';
      case 'plat-31':
        if(EDRAAK_CATEGORIES[id])return `https://www.edraak.org/explore/?category=${enc(EDRAAK_CATEGORIES[id])}`;
        return text(field&&field.officialUrl||'');
      default:
        return text(field&&field.officialUrl||'');
    }
  }

  function applyToData(data){
    if(!data||!Array.isArray(data.platforms))return data;
    return {...data,platforms:data.platforms.map(platform=>{
      if(!platform||!Array.isArray(platform.fields))return platform;
      return {...platform,fields:platform.fields.map(field=>({...field,officialUrl:resolve(platform.id,field)}))};
    })};
  }

  function install(loader){
    if(!loader||typeof loader.loadSiteData!=='function'||loader.__categoryDirectLinksInstalled)return false;
    const original=loader.loadSiteData.bind(loader);
    loader.loadSiteData=async function(...args){return applyToData(await original(...args))};
    Object.defineProperty(loader,'__categoryDirectLinksInstalled',{value:true,configurable:false,enumerable:false,writable:false});
    return true;
  }

  if(typeof globalThis!=='undefined'&&globalThis.DataLoader)install(globalThis.DataLoader);

  return{resolve,applyToData,install};
});
