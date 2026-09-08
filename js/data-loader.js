(function(root, factory){
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.DataLoader = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function(){
  const REQUIRED_SECTIONS = ['settings','assets','seo','siteText','categories','languages','quiz','comparison','platforms'];

  function isObject(value){ return value && typeof value === 'object' && !Array.isArray(value); }

  function validate(data){
    if (!isObject(data)) throw new Error('data.json must contain an object');
    for (const key of REQUIRED_SECTIONS) {
      if (!Object.hasOwn(data,key)) throw new Error(`data.json ${key} is required`);
    }
    if (!isObject(data.settings) || !isObject(data.assets) || !isObject(data.seo) || !isObject(data.siteText)) {
      throw new Error('data.json CMS object sections are invalid');
    }
    if (!Array.isArray(data.categories) || !Array.isArray(data.languages) || !Array.isArray(data.platforms)) {
      throw new Error('data.json CMS collection sections are invalid');
    }
    if (!isObject(data.quiz) || !isObject(data.comparison)) throw new Error('data.json quiz/comparison are invalid');
    return data;
  }

  function isOriginalPublicPlatform(row){
    const match=/^plat-(\d+)$/.exec(String(row&&row.id||''));
    if(!match)return true;
    const n=Number(match[1]);
    return n>=1&&n<=40;
  }

  function publicCatalog(data){
    if(!isObject(data)||!Array.isArray(data.platforms))return data;
    return{...data,platforms:data.platforms.filter(isOriginalPublicPlatform)};
  }

  async function loadSiteData(options = {}){
    const fetchFn = options.fetchFn || ((...args) => fetch(...args));
    const url = options.url || './data.json';
    const response = await fetchFn(url, { cache: 'no-store' });
    if (!response || !response.ok) {
      const status = response && response.status ? response.status : 'unknown';
      throw new Error(`data.json load failed: ${status}`);
    }
    return publicCatalog(validate(await response.json()));
  }

  return { validate, publicCatalog, loadSiteData };
});
