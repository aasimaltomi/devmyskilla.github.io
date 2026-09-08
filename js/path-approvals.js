(function(root,factory){
  const core=typeof module==='object'&&module.exports?require('./platform-core.js'):root.PlatformCore;
  const api=factory(core);
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.PathApprovals=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(PlatformCore){
  if(!PlatformCore)throw new Error('PlatformCore is required');

  // Platforms enter this list only after the user has manually reviewed and approved them.
  const APPROVED_PLATFORM_IDS=Object.freeze(['plat-1']);

  function approvedPlatformIds(){return[...APPROVED_PLATFORM_IDS]}
  function isApproved(platformId){return APPROVED_PLATFORM_IDS.includes(String(platformId||''))}

  function approvedPathGroups(platforms,limit=20){
    const cap=Number.isFinite(Number(limit))?Math.max(0,Math.trunc(Number(limit))):20;
    return(Array.isArray(platforms)?platforms:[])
      .filter(platform=>platform&&isApproved(platform.id))
      .map(platform=>{
        const fields=Array.isArray(platform.fields)?[...platform.fields]:[];
        const paths=PlatformCore.visibleOfficialPaths(platform,cap);
        const showAll=PlatformCore.shouldShowAllPathsLink(platform,cap);
        const allPathsUrl=platform.pathResearch&&platform.pathResearch.allPathsUrl||'';
        return{platform,fields,paths,showAll,allPathsUrl};
      })
      .filter(group=>group.fields.length||group.paths.length);
  }

  return{approvedPlatformIds,isApproved,approvedPathGroups};
});
