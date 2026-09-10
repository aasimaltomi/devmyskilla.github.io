(function(){
  const MENU_LABELS={ar:'القائمة',en:'Menu',tr:'Menü'};
  const FOCUSABLE='a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

  function tabs(){return [...document.querySelectorAll('.tab-btn[role="tab"]')];}
  function selectTab(selected){
    tabs().forEach(tab=>{
      const isSelected=tab===selected;
      tab.classList.toggle('active',isSelected);
      tab.setAttribute('aria-selected',String(isSelected));
      tab.tabIndex=isSelected?0:-1;
    });
  }
  function selectAll(){const all=document.querySelector('.tab-btn[data-tab="all"]');if(all)selectTab(all);}
  function closeMobileNav(nav,toggle){
    if(!nav||!toggle)return;
    nav.classList.remove('mobile-nav-open');
    toggle.setAttribute('aria-expanded','false');
  }
  function updateMenuLabel(toggle){
    if(!toggle)return;
    const lang=(document.documentElement.lang||'ar').toLowerCase();
    toggle.setAttribute('aria-label',MENU_LABELS[lang]||MENU_LABELS.en);
  }
  function initMobileNav(){
    const nav=document.querySelector('.main-nav');
    const inner=nav&&nav.closest('.nav-inner');
    if(!nav||!inner||inner.querySelector('.mobile-nav-toggle'))return;
    if(!nav.id)nav.id='mobilePrimaryNav';
    const toggle=document.createElement('button');
    toggle.type='button';
    toggle.className='icon-btn mobile-nav-toggle';
    toggle.setAttribute('aria-controls',nav.id);
    toggle.setAttribute('aria-expanded','false');
    toggle.textContent='☰';
    updateMenuLabel(toggle);
    const actions=inner.querySelector('.nav-actions');
    inner.insertBefore(toggle,actions||null);
    toggle.addEventListener('click',()=>{
      const opening=!nav.classList.contains('mobile-nav-open');
      nav.classList.toggle('mobile-nav-open',opening);
      toggle.setAttribute('aria-expanded',String(opening));
    });
    nav.addEventListener('click',event=>{if(event.target.closest('a,button'))closeMobileNav(nav,toggle);});
    document.addEventListener('click',event=>{if(!inner.contains(event.target))closeMobileNav(nav,toggle);});
    const switcher=document.getElementById('langSwitcher');
    if(switcher)switcher.addEventListener('change',()=>queueMicrotask(()=>updateMenuLabel(toggle)));
  }
  function handleTabKeys(event){
    const current=event.target.closest&&event.target.closest('.tab-btn[role="tab"]');
    if(!current)return false;
    const keys=['ArrowRight','ArrowLeft','Home','End'];
    if(!keys.includes(event.key))return false;
    const list=tabs();
    if(!list.length)return false;
    event.preventDefault();
    const index=Math.max(0,list.indexOf(current));
    const rtl=document.documentElement.dir==='rtl';
    let nextIndex=index;
    if(event.key==='Home')nextIndex=0;
    else if(event.key==='End')nextIndex=list.length-1;
    else if(event.key==='ArrowRight')nextIndex=(index+(rtl?-1:1)+list.length)%list.length;
    else if(event.key==='ArrowLeft')nextIndex=(index+(rtl?1:-1)+list.length)%list.length;
    const next=list[nextIndex];
    next.click();
    next.focus();
    return true;
  }
  function trapModalTab(event){
    if(!(event.key === 'Tab'))return false;
    const modal=document.querySelector('.modal.open');
    if(!modal)return false;
    const focusable=[...modal.querySelectorAll(FOCUSABLE)].filter(node=>node.getAttribute('aria-hidden')!=='true');
    if(!focusable.length){event.preventDefault();return true;}
    const first=focusable[0],last=focusable[focusable.length-1];
    if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();return true;}
    if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();return true;}
    return false;
  }
  function init(){
    const current=document.querySelector('.tab-btn.active[role="tab"]')||document.querySelector('.tab-btn[role="tab"]');
    if(current)selectTab(current);
    initMobileNav();
  }
  document.addEventListener('DOMContentLoaded',init);
  document.addEventListener('click',event=>{
    const tab=event.target.closest('.tab-btn[role="tab"]');
    if(tab){queueMicrotask(()=>selectTab(tab));return;}
    if(event.target.closest('#resetFilters,[data-quick-filter],[data-category]'))queueMicrotask(selectAll);
  });
  document.addEventListener('keydown',event=>{
    if(handleTabKeys(event)||trapModalTab(event))return;
    if(event.key==='Escape'){
      const nav=document.querySelector('.main-nav.mobile-nav-open');
      const toggle=document.querySelector('.mobile-nav-toggle');
      if(nav&&toggle){closeMobileNav(nav,toggle);toggle.focus();}
    }
  });
})();
