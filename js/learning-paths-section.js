(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.LearningPathsSection=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';

  function removeLearningPathsUi(doc){
    if(!doc)return;
    const nav=doc.querySelector&&doc.querySelector('a[href="#learningPaths"]');
    const section=doc.getElementById&&doc.getElementById('learningPaths');
    if(nav&&typeof nav.remove==='function')nav.remove();
    if(section&&typeof section.remove==='function')section.remove();
  }

  if(typeof document!=='undefined'){
    document.addEventListener('DOMContentLoaded',()=>removeLearningPathsUi(document));
  }

  return{removeLearningPathsUi};
});
