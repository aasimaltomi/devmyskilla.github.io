(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.PlatformCategories2130=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';

  const field=(id,ar,en,tr,officialUrl)=>({id,name:{ar,en,tr},officialUrl});

  const DATA=Object.freeze({
    'plat-21':{
      sourceUrl:'https://www.couponami.com/category',
      platformPatch:{
        name:{
          ar:'CouponAmI (سابقًا DiscUdemy)',
          en:'CouponAmI (formerly DiscUdemy)',
          tr:'CouponAmI (eski adıyla DiscUdemy)'
        },
        officialUrl:'https://www.couponami.com/',
        catalogUrl:'https://www.couponami.com/category',
        logo:{
          src:'https://www.google.com/s2/favicons?domain=couponami.com&sz=128',
          alt:{ar:'CouponAmI',en:'CouponAmI',tr:'CouponAmI'}
        },
        description:{
          ar:'منصة مستقلة لاكتشاف كوبونات Udemy المجانية النشطة والمتحقق منها. كانت تُعرف سابقًا باسم DiscUdemy، وهي ليست تابعة لـUdemy.',
          en:'An independent platform for discovering active, verified free Udemy coupons. Formerly DiscUdemy; it is not affiliated with Udemy.',
          tr:'Aktif ve doğrulanmış ücretsiz Udemy kuponlarını keşfetmek için bağımsız bir platformdur. Eski adı DiscUdemy olup Udemy ile bağlantılı değildir.'
        }
      },
      fields:[
        field('development','التطوير والبرمجة','Development','Geliştirme','https://www.couponami.com/category/development'),
        field('graphic-design','التصميم الجرافيكي','Graphic Design','Grafik Tasarım','https://www.couponami.com/category/graphic-design'),
        field('network-system','الشبكات والأنظمة','Network & System','Ağ ve Sistem','https://www.couponami.com/category/network-system'),
        field('business','الأعمال','Business','İşletme','https://www.couponami.com/category/business'),
        field('marketing','التسويق','Marketing','Pazarlama','https://www.couponami.com/category/marketing'),
        field('personal-development','التطوير الشخصي','Personal Development','Kişisel Gelişim','https://www.couponami.com/category/personal-development')
      ]
    },
    'plat-22':{
      sourceUrl:'https://www.kaggle.com/learn',
      fields:[]
    },
    'plat-23':{
      sourceUrl:'https://learn.github.com/',
      fields:[]
    },
    'plat-24':{
      sourceUrl:'https://www.skills.google/catalog',
      fields:[
        field('infrastructure-modernization','تحديث البنية التحتية','Infrastructure Modernization','Altyapı Modernizasyonu','https://www.skills.google/catalog?keywords=Infrastructure%20Modernization'),
        field('application-modernization','تحديث التطبيقات','Application Modernization','Uygulama Modernizasyonu','https://www.skills.google/catalog?keywords=Application%20Modernization'),
        field('smart-analytics-data-management','التحليلات الذكية وإدارة البيانات','Smart Analytics & Data Management','Akıllı Analitik ve Veri Yönetimi','https://www.skills.google/catalog?keywords=Smart%20Analytics%20Data%20Management'),
        field('machine-learning-ai','تعلم الآلة والذكاء الاصطناعي','Machine Learning & AI','Makine Öğrenmesi ve Yapay Zekâ','https://www.skills.google/catalog?keywords=Machine%20Learning%20AI'),
        field('cloud-security-network-engineering','أمن السحابة وهندسة الشبكات','Cloud Security & Network Engineering','Bulut Güvenliği ve Ağ Mühendisliği','https://www.skills.google/catalog?keywords=Cloud%20Security%20Network%20Engineering'),
        field('hybrid-multicloud','السحابة الهجينة ومتعددة السحابات','Hybrid & Multi-cloud','Hibrit ve Çoklu Bulut','https://www.skills.google/catalog?keywords=Hybrid%20Multicloud'),
        field('api-management-apigee','إدارة واجهات API وApigee','API Management / Apigee','API Yönetimi / Apigee','https://www.skills.google/catalog?keywords=Apigee'),
        field('google-workspace','Google Workspace','Google Workspace','Google Workspace','https://www.skills.google/catalog?keywords=Google%20Workspace'),
        field('cloud-business-leadership','قيادة الأعمال السحابية','Cloud Business Leadership','Bulut İş Liderliği','https://www.skills.google/catalog?keywords=Cloud%20Business%20Leadership')
      ]
    },
    'plat-25':{
      sourceUrl:'https://www.freecodecamp.org/learn/',
      fields:[
        field('certified-full-stack-developer','مطور Full Stack معتمد','Certified Full Stack Developer','Sertifikalı Full Stack Geliştirici','https://www.freecodecamp.org/learn/full-stack-developer/'),
        field('responsive-web-design','تصميم الويب المتجاوب','Responsive Web Design','Duyarlı Web Tasarımı','https://www.freecodecamp.org/learn/2022/responsive-web-design/'),
        field('javascript-algorithms-data-structures','خوارزميات JavaScript وهياكل البيانات','JavaScript Algorithms and Data Structures','JavaScript Algoritmaları ve Veri Yapıları','https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures-v8/'),
        field('front-end-libraries','مكتبات الواجهة الأمامية','Front End Libraries','Ön Uç Kütüphaneleri','https://www.freecodecamp.org/learn/front-end-development-libraries/'),
        field('python-programming','برمجة Python','Python Programming','Python Programlama','https://www.freecodecamp.org/learn/scientific-computing-with-python/'),
        field('relational-databases','قواعد البيانات العلائقية','Relational Databases','İlişkisel Veritabanları','https://www.freecodecamp.org/learn/relational-database/'),
        field('back-end-development-apis','تطوير الواجهة الخلفية وواجهات API','Back End Development and APIs','Arka Uç Geliştirme ve API’ler','https://www.freecodecamp.org/learn/back-end-development-and-apis/')
      ]
    },
    'plat-26':{
      sourceUrl:'https://www.coursera.org/browse',
      fields:[
        field('arts-humanities','الفنون والعلوم الإنسانية','Arts and Humanities','Sanat ve Beşeri Bilimler','https://www.coursera.org/browse/arts-and-humanities'),
        field('business','الأعمال','Business','İşletme','https://www.coursera.org/browse/business'),
        field('computer-science','علوم الحاسوب','Computer Science','Bilgisayar Bilimleri','https://www.coursera.org/browse/computer-science'),
        field('data-science','علم البيانات','Data Science','Veri Bilimi','https://www.coursera.org/browse/data-science'),
        field('health','الصحة','Health','Sağlık','https://www.coursera.org/browse/health'),
        field('information-technology','تقنية المعلومات','Information Technology','Bilgi Teknolojileri','https://www.coursera.org/browse/information-technology'),
        field('language-learning','تعلم اللغات','Language Learning','Dil Öğrenimi','https://www.coursera.org/browse/language-learning'),
        field('math-logic','الرياضيات والمنطق','Math and Logic','Matematik ve Mantık','https://www.coursera.org/browse/math-and-logic'),
        field('personal-development','التطوير الشخصي','Personal Development','Kişisel Gelişim','https://www.coursera.org/browse/personal-development'),
        field('physical-science-engineering','العلوم الفيزيائية والهندسة','Physical Science and Engineering','Fizik Bilimleri ve Mühendislik','https://www.coursera.org/browse/physical-science-and-engineering'),
        field('social-sciences','العلوم الاجتماعية','Social Sciences','Sosyal Bilimler','https://www.coursera.org/browse/social-sciences')
      ]
    },
    'plat-27':{
      sourceUrl:'https://www.simplilearn.com/skillup-free-online-courses',
      fields:[
        field('generative-ai','الذكاء الاصطناعي التوليدي','Generative AI','Üretken Yapay Zekâ','https://www.simplilearn.com/skillup-free-online-courses/generative-ai'),
        field('ai-machine-learning','الذكاء الاصطناعي وتعلم الآلة','AI & Machine Learning','Yapay Zekâ ve Makine Öğrenmesi','https://www.simplilearn.com/skillup-free-online-courses/ai'),
        field('data-science-business-analytics','علم البيانات وتحليلات الأعمال','Data Science & Business Analytics','Veri Bilimi ve İş Analitiği','https://www.simplilearn.com/skillup-free-online-courses/data-science'),
        field('project-management','إدارة المشاريع','Project Management','Proje Yönetimi','https://www.simplilearn.com/skillup-free-online-courses/project-management'),
        field('cyber-security','الأمن السيبراني','Cyber Security','Siber Güvenlik','https://www.simplilearn.com/skillup-free-online-courses/cyber-security'),
        field('agile-scrum','أجايل وسكرم','Agile and Scrum','Agile ve Scrum','https://www.simplilearn.com/skillup-free-online-courses/agile-and-scrum'),
        field('cloud-computing-devops','الحوسبة السحابية وDevOps','Cloud Computing & DevOps','Bulut Bilişim ve DevOps','https://www.simplilearn.com/skillup-free-online-courses/cloud-computing'),
        field('business-leadership','الأعمال والقيادة','Business and Leadership','İşletme ve Liderlik','https://www.simplilearn.com/skillup-free-online-courses/leadership'),
        field('software-development','تطوير البرمجيات','Software Development','Yazılım Geliştirme','https://www.simplilearn.com/skillup-free-online-courses/software-development'),
        field('it-service-architecture','خدمات تقنية المعلومات وهندستها','IT Service and Architecture','BT Hizmetleri ve Mimarisi','https://www.simplilearn.com/skillup-free-online-courses/management'),
        field('quality-management','إدارة الجودة','Quality Management','Kalite Yönetimi','https://www.simplilearn.com/skillup-free-online-courses/quality-assurance'),
        field('digital-marketing','التسويق الرقمي','Digital Marketing','Dijital Pazarlama','https://www.simplilearn.com/skillup-free-online-courses/digital-marketing'),
        field('product-design','المنتجات والتصميم','Product and Design','Ürün ve Tasarım','https://www.simplilearn.com/skillup-free-online-courses/ui-ux'),
        field('personal-development','التطوير الشخصي','Personal Development','Kişisel Gelişim','https://www.simplilearn.com/skillup-free-online-courses/self-development')
      ]
    },
    'plat-28':{
      sourceUrl:'https://alison.com/courses',
      fields:[
        field('it','تقنية المعلومات','Information Technology (IT)','Bilgi Teknolojileri','https://alison.com/courses/it'),
        field('health','الصحة','Health','Sağlık','https://alison.com/courses/health'),
        field('language','اللغات','Language','Dil','https://alison.com/courses/language'),
        field('business','الأعمال','Business','İşletme','https://alison.com/courses/business'),
        field('management','الإدارة','Management','Yönetim','https://alison.com/courses/management'),
        field('personal-development','التطوير الشخصي','Personal Development','Kişisel Gelişim','https://alison.com/courses/personal-development'),
        field('sales-marketing','المبيعات والتسويق','Sales & Marketing','Satış ve Pazarlama','https://alison.com/courses/marketing'),
        field('engineering-construction','الهندسة والإنشاءات','Engineering & Construction','Mühendislik ve İnşaat','https://alison.com/courses/engineering'),
        field('teaching-academics','التدريس والأكاديميا','Teaching & Academics','Öğretim ve Akademi','https://alison.com/courses/education')
      ]
    },
    'plat-29':{
      sourceUrl:'https://learn.saylor.org/course/index.php',
      fields:[
        field('arts-humanities','الفنون والعلوم الإنسانية','Arts & Humanities','Sanat ve Beşeri Bilimler','https://learn.saylor.org/course/index.php?categoryid=82'),
        field('business-administration','إدارة الأعمال','Business Administration','İşletme Yönetimi','https://learn.saylor.org/course/index.php?categoryid=6'),
        field('computer-science','علوم الحاسوب','Computer Science','Bilgisayar Bilimleri','https://learn.saylor.org/course/index.php?categoryid=9'),
        field('english-second-language','الإنجليزية كلغة ثانية','English as a Second Language','İkinci Dil Olarak İngilizce','https://learn.saylor.org/course/index.php?categoryid=29'),
        field('professional-development','التطوير المهني','Professional Development','Mesleki Gelişim','https://learn.saylor.org/course/index.php?categoryid=19'),
        field('science-mathematics','العلوم والرياضيات','Science and Mathematics','Fen ve Matematik','https://learn.saylor.org/course/index.php?categoryid=84'),
        field('social-science','العلوم الاجتماعية','Social Science','Sosyal Bilimler','https://learn.saylor.org/course/index.php?categoryid=85')
      ]
    },
    'plat-30':{
      sourceUrl:'https://satr.tuwaiq.edu.sa/',
      fields:[]
    }
  });

  function cloneField(item){
    return {id:String(item&&item.id||''),name:{...(item&&item.name||{})},officialUrl:String(item&&item.officialUrl||'')};
  }

  function forPlatform(platformId){
    const row=DATA[String(platformId||'')];
    return row&&Array.isArray(row.fields)?row.fields.map(cloneField):[];
  }

  function sourceForPlatform(platformId){
    const row=DATA[String(platformId||'')];
    return row&&row.sourceUrl?row.sourceUrl:'';
  }

  function hasPlatform(platformId){
    return Object.prototype.hasOwnProperty.call(DATA,String(platformId||''));
  }

  function clonePatch(patch){
    if(!patch)return {};
    const result={...patch};
    if(patch.name)result.name={...patch.name};
    if(patch.description)result.description={...patch.description};
    if(patch.logo)result.logo={...patch.logo,alt:{...(patch.logo.alt||{})}};
    return result;
  }

  function applyToData(data){
    if(!data||!Array.isArray(data.platforms))return data;
    return {...data,platforms:data.platforms.map(platform=>{
      if(!platform||!hasPlatform(platform.id))return platform;
      const row=DATA[platform.id];
      return {...platform,...clonePatch(row.platformPatch),fields:forPlatform(platform.id)};
    })};
  }

  function install(loader){
    if(!loader||typeof loader.loadSiteData!=='function'||loader.__platformCategories2130Installed)return false;
    const original=loader.loadSiteData.bind(loader);
    loader.loadSiteData=async function(...args){return applyToData(await original(...args))};
    Object.defineProperty(loader,'__platformCategories2130Installed',{value:true,configurable:false,enumerable:false,writable:false});
    return true;
  }

  if(typeof globalThis!=='undefined'&&globalThis.DataLoader)install(globalThis.DataLoader);

  return {forPlatform,sourceForPlatform,hasPlatform,applyToData,install};
});