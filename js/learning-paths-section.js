(function(root){
  'use strict';

  const state={platforms:[]};
  const esc=(value='')=>String(value).replace(/[&<>'"]/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
  const lang=()=>typeof currentLang==='string'&&currentLang?currentLang:'ar';
  const text=key=>typeof getText==='function'?(getText(key)||''):'';
  const safeUrl=url=>typeof content!=='undefined'&&content&&typeof content.safeUrl==='function'?content.safeUrl(url,{allowRelative:false}):'';
  const platformName=platform=>typeof content!=='undefined'&&content?content.platformName(platform,lang()):'';
  const fieldName=field=>typeof content!=='undefined'&&content?content.platformFieldName(field,lang()):'';
  const pathName=path=>typeof content!=='undefined'&&content?content.platformPathName(path,lang()):'';
  const pathType=path=>typeof content!=='undefined'&&content?content.pathTypeLabel(path.type,lang()):'';
  const detailUrl=platform=>`platform.html?id=${encodeURIComponent(platform.id)}&lang=${encodeURIComponent(lang())}`;

  function fieldMarkup(field){
    const name=fieldName(field),url=safeUrl(field.officialUrl);
    if(!name)return'';
    if(url)return`<a class="approved-field" href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(name)} <span aria-hidden="true">↗</span></a>`;
    return`<span class="approved-field">${esc(name)}</span>`;
  }

  function pathMarkup(platform,path){
    const name=pathName(path),url=safeUrl(path.officialUrl);
    if(!name||!url)return'';
    const type=pathType(path),provider=platformName(platform);
    return`<a class="approved-path-card" href="${esc(url)}" target="_blank" rel="noopener noreferrer">${type?`<span class="approved-path-type">${esc(type)}</span>`:''}<strong>${esc(name)}</strong><small>${esc(provider)}</small><em>${esc(text('viewOfficialPath'))} <span aria-hidden="true">↗</span></em></a>`;
  }

  function groupMarkup(group){
    const platform=group.platform,name=platformName(platform),fields=group.fields.map(fieldMarkup).filter(Boolean).join(''),paths=group.paths.map(path=>pathMarkup(platform,path)).filter(Boolean).join('');
    if(!fields&&!paths)return'';
    const allUrl=safeUrl(group.allPathsUrl);
    const footer=allUrl?`<div class="approved-learning-footer"><a class="btn btn-soft" href="${esc(allUrl)}" target="_blank" rel="noopener noreferrer">${esc(text('viewAllOfficialPaths'))} <span aria-hidden="true">↗</span></a></div>`:'';
    return`<article class="approved-learning-platform" data-platform-id="${esc(platform.id)}"><div class="approved-learning-head"><div><small>${esc(text('fields'))}</small><br><a href="${detailUrl(platform)}">${esc(name)}</a></div><a class="btn btn-soft small" href="${detailUrl(platform)}">${esc(text('details'))}</a></div>${fields?`<div class="approved-fields">${fields}</div>`:''}${paths?`<div class="approved-paths-grid">${paths}</div>`:''}${footer}</article>`;
  }

  function render(){
    const section=document.getElementById('learningPaths'),grid=document.getElementById('officialPathGrid');
    if(!section||!grid||!root.PathApprovals)return;
    const groups=root.PathApprovals.approvedPathGroups(state.platforms,20);
    const markup=groups.map(groupMarkup).filter(Boolean).join('');
    grid.innerHTML=markup;
    section.hidden=!markup;
  }

  async function init(){
    const section=document.getElementById('learningPaths');
    if(!section||!root.DataLoader||!root.PlatformCore||!root.PathApprovals)return;
    try{
      const data=await root.DataLoader.loadSiteData();
      if(typeof root.initContent==='function')root.initContent(data);
      const params=new URLSearchParams(location.search);
      const requested=params.get('lang');
      if(typeof root.setLang==='function'&&requested)root.setLang(requested);
      state.platforms=data.platforms.map(root.PlatformCore.normalizeStaticPlatform);
      render();
      const switcher=document.getElementById('langSwitcher');
      if(switcher)switcher.addEventListener('change',()=>setTimeout(render,0));
    }catch(error){
      console.error(error);
      section.hidden=true;
    }
  }

  if(typeof document!=='undefined')document.addEventListener('DOMContentLoaded',init);
})(typeof globalThis!=='undefined'?globalThis:this);
