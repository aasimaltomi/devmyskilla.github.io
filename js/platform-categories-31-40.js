(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.PlatformCategories3140=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const field=(id,ar,en,tr,officialUrl)=>({id,name:{ar,en,tr},officialUrl});
  const edraak=q=>`https://www.edraak.org/explore/?query=${encodeURIComponent(q)}`;
  const btk=q=>`https://www.btkakademi.gov.tr/portal/catalog?search=${encodeURIComponent(q)}`;
  const DATA=Object.freeze({
    'plat-31':{fields:[
      field('business-entrepreneurship','الأعمال والريادة','Business & Entrepreneurship','İşletme ve Girişimcilik',edraak('الأعمال والريادة')),
      field('health-nutrition','الصحة والتغذية','Health & Nutrition','Sağlık ve Beslenme',edraak('الصحة والتغذية')),
      field('science-environment','العلوم والبيئة','Science & Environment','Bilim ve Çevre',edraak('العلوم والبيئة')),
      field('education-teacher-training','التعليم وتدريب المعلمين','Education & Teacher Training','Eğitim ve Öğretmen Eğitimi',edraak('التعليم وتدريب المعلمين')),
      field('personal-development','تطوير الذات','Personal Development','Kişisel Gelişim',edraak('تطوير الذات')),
      field('technology','التكنولوجيا','Technology','Teknoloji',edraak('التكنولوجيا')),
      field('humanities','العلوم الإنسانية','Humanities','Beşeri Bilimler',edraak('العلوم الإنسانية')),
      field('art-design-media','الفن والتصميم والإعلام','Art, Design & Media','Sanat, Tasarım ve Medya',edraak('الفن والتصميم والإعلام')),
      field('career-readiness','الاستعداد الوظيفي','Career Readiness','Kariyer Hazırlığı',edraak('الاستعداد الوظيفي')),
      field('languages','اللغات','Languages','Diller',edraak('اللغات')),
      field('built-environment','البيئة المبنية (العمارة والعمران)','Built Environment (Architecture & Urbanism)','Yapılı Çevre (Mimarlık ve Şehircilik)',edraak('البيئة المبنية'))
    ]},
    'plat-32':{fields:[
      field('programming','برمجة','Programming','Programlama','https://www.m3aarf.com/certified/cat/12/%D8%AF%D9%88%D8%B1%D8%A7%D8%AA-%D8%A8%D8%B1%D9%85%D8%AC%D8%A9'),
      field('english','إنجليزي','English','İngilizce','https://www.m3aarf.com/certified/cat/25/%D8%AF%D9%88%D8%B1%D8%A7%D8%AA-%D8%A7%D9%86%D8%AC%D9%84%D9%8A%D8%B2%D9%8A'),
      field('information-technology','تكنولوجيا المعلومات','Information Technology','Bilgi Teknolojileri','https://www.m3aarf.com/certified/cat/15/%D8%AF%D9%88%D8%B1%D8%A7%D8%AA-it-%D8%AA%D9%83%D9%86%D9%88%D9%84%D9%88%D8%AC%D9%8A%D8%A7-%D8%A7%D9%84%D9%85%D8%B9%D9%84%D9%88%D9%85%D8%A7%D8%AA'),
      field('graphic-design','جرافيك ديزاين','Graphic Design','Grafik Tasarım','https://www.m3aarf.com/certified/cat/13/%D8%AF%D9%88%D8%B1%D8%A7%D8%AA-%D8%AC%D8%B1%D8%A7%D9%81%D9%8A%D9%83-%D8%AF%D9%8A%D8%B2%D8%A7%D9%8A%D9%86'),
      field('engineering','الهندسة','Engineering','Mühendislik','https://www.m3aarf.com/certified/cat/14/%D8%AF%D9%88%D8%B1%D8%A7%D8%AA-%D8%A7%D9%84%D9%87%D9%86%D8%AF%D8%B3%D8%A9'),
      field('management-commerce','الإدارة والتجارة','Management & Commerce','Yönetim ve Ticaret','https://www.m3aarf.com/certified/cat/18/%D8%AF%D9%88%D8%B1%D8%A7%D8%AA-%D9%81%D9%8A-%D8%A7%D9%84%D8%A7%D8%AF%D8%A7%D8%B1%D8%A9-%D9%88-%D8%A7%D9%84%D8%AA%D8%AC%D8%A7%D8%B1%D8%A9'),
      field('medicine','الطب','Medicine','Tıp','https://www.m3aarf.com/certified/cat/40/%D8%AF%D9%88%D8%B1%D8%A7%D8%AA-%D8%A7%D9%84%D8%B7%D8%A8'),
      field('arts','الفنون','Arts','Sanat','https://www.m3aarf.com/certified/cat/22/%D8%AF%D9%88%D8%B1%D8%A7%D8%AA-%D9%81%D9%86%D9%88%D9%86')
    ]},
    'plat-33':{fields:[]},
    'plat-34':{fields:[
      field('artificial-intelligence','الذكاء الاصطناعي','Artificial Intelligence','Yapay Zekâ','https://www.datacamp.com/category/artificial-intelligence'),
      field('data-engineering','هندسة البيانات','Data Engineering','Veri Mühendisliği','https://www.datacamp.com/category/data-engineering'),
      field('programming','البرمجة','Programming','Programlama','https://www.datacamp.com/category/programming'),
      field('data-analysis','تحليل البيانات','Data Analysis','Veri Analizi','https://www.datacamp.com/category/data-analysis'),
      field('machine-learning','تعلم الآلة','Machine Learning','Makine Öğrenmesi','https://www.datacamp.com/category/machine-learning'),
      field('data-visualization','تصور البيانات','Data Visualization','Veri Görselleştirme','https://www.datacamp.com/category/data-visualization'),
      field('cloud','الحوسبة السحابية','Cloud','Bulut','https://www.datacamp.com/category/cloud')
    ]},
    'plat-35':{fields:[
      field('seo','تحسين محركات البحث','SEO','SEO','https://www.semrush.com/academy/courses/?categories=seo'),
      field('semrush-tools','أدوات Semrush','Semrush Tools','Semrush Araçları','https://www.semrush.com/academy/courses/?categories=semrush-tools'),
      field('content-marketing','تسويق المحتوى','Content Marketing','İçerik Pazarlaması','https://www.semrush.com/academy/courses/?categories=content-marketing'),
      field('analytics','التحليلات','Analytics','Analitik','https://www.semrush.com/academy/courses/?categories=analytics'),
      field('ecommerce','التجارة الإلكترونية','E-commerce','E-ticaret','https://www.semrush.com/academy/courses/?categories=e-commerce'),
      field('sales','المبيعات','Sales','Satış','https://www.semrush.com/academy/courses/?categories=sales'),
      field('marketing','التسويق','Marketing','Pazarlama','https://www.semrush.com/academy/courses/?categories=marketing'),
      field('pr','العلاقات العامة','PR','Halkla İlişkiler','https://www.semrush.com/academy/courses/?categories=pr'),
      field('paid-advertising','الإعلانات المدفوعة','Paid Advertising','Ücretli Reklamcılık','https://www.semrush.com/academy/courses/?categories=paid-advertising'),
      field('social-media','وسائل التواصل الاجتماعي','Social Media','Sosyal Medya','https://www.semrush.com/academy/courses/social-media/'),
      field('career','المسار المهني','Career','Kariyer','https://www.semrush.com/academy/courses/?categories=career'),
      field('ai','الذكاء الاصطناعي','AI','Yapay Zekâ','https://www.semrush.com/academy/courses/?categories=ai'),
      field('business','الأعمال','Business','İşletme','https://www.semrush.com/academy/courses/?categories=business'),
      field('local-seo','تحسين محركات البحث المحلي','Local SEO','Yerel SEO','https://www.semrush.com/academy/courses/?categories=local-seo'),
      field('competitive-research','البحث التنافسي','Competitive Research','Rekabet Araştırması','https://www.semrush.com/academy/courses/?categories=competitive-research')
    ]},
    'plat-36':{fields:[
      field('software','البرمجيات','Software','Yazılım',btk('Yazılım')),
      field('systems','الأنظمة','Systems','Sistem',btk('Sistem')),
      field('business','الأعمال','Business','İşletme',btk('İşletme')),
      field('personal-development','التطوير الشخصي','Personal Development','Kişisel Gelişim',btk('Kişisel Gelişim')),
      field('k12','التعليم K12','K12','K12',btk('K12')),
      field('design','التصميم','Design','Tasarım',btk('Tasarım')),
      field('safe-internet','الإنترنت الآمن','Safe Internet','Güvenli İnternet',btk('Güvenli İnternet')),
      field('regulation','التنظيم','Regulation','Regülasyon',btk('Regülasyon')),
      field('artificial-intelligence','الذكاء الاصطناعي','Artificial Intelligence','Yapay Zeka','https://www.btkakademi.gov.tr/portal/catalog?categoryId=2353')
    ]},
    'plat-37':{fields:[]},
    'plat-38':{fields:[
      field('marketing','التسويق','Marketing','Pazarlama','https://academy.hubspot.com/courses/marketing'),
      field('sales','المبيعات','Sales','Satış','https://academy.hubspot.com/courses/sales'),
      field('service','الخدمة','Service','Hizmet','https://academy.hubspot.com/courses/service'),
      field('software','البرمجيات','Software','Yazılım','https://academy.hubspot.com/courses/software')
    ]},
    'plat-39':{fields:[]},
    'plat-40':{fields:[]}
  });
  const hasPlatform=id=>Object.prototype.hasOwnProperty.call(DATA,String(id||''));
  const forPlatform=id=>hasPlatform(id)?DATA[String(id)].fields.map(f=>({...f,name:{...f.name}})):[];
  function applyToData(data){
    if(!data||!Array.isArray(data.platforms))return data;
    return {...data,platforms:data.platforms.map(platform=>{
      if(!platform||!hasPlatform(platform.id))return platform;
      return {...platform,fields:forPlatform(platform.id)};
    })};
  }
  function install(loader){
    if(!loader||typeof loader.loadSiteData!=='function'||loader.__platformCategories3140Installed)return false;
    const original=loader.loadSiteData.bind(loader);
    loader.loadSiteData=async function(...args){return applyToData(await original(...args))};
    Object.defineProperty(loader,'__platformCategories3140Installed',{value:true,configurable:false,enumerable:false,writable:false});
    return true;
  }
  if(typeof globalThis!=='undefined'&&globalThis.DataLoader)install(globalThis.DataLoader);
  return{forPlatform,hasPlatform,applyToData,install};
});
