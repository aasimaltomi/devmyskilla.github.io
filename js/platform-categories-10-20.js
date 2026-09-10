(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.PlatformCategories1020=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';

  const field=(id,ar,en,tr,officialUrl)=>({id,name:{ar,en,tr},officialUrl});

  const DATA=Object.freeze({
    'plat-10':{
      sourceUrl:'https://e.huawei.com/en/talent/learning/#/home',
      fields:[
        field('cloud-computing','الحوسبة السحابية','Cloud Computing','Bulut Bilişim','https://e.huawei.com/en/talent/search/?q=Cloud%20Computing'),
        field('cloud-service','الخدمات السحابية','Cloud Service','Bulut Hizmeti','https://e.huawei.com/en/talent/search/?q=Cloud%20Service'),
        field('big-data','البيانات الضخمة','Big Data','Büyük Veri','https://e.huawei.com/en/talent/search/?q=Big%20Data'),
        field('gaussdb','غاوس دي بي','GaussDB','GaussDB','https://e.huawei.com/en/talent/search/?q=GaussDB'),
        field('iot','إنترنت الأشياء','IoT','IoT','https://e.huawei.com/en/talent/search/?q=IoT'),
        field('openeuler','openEuler','openEuler','openEuler','https://e.huawei.com/en/talent/search/?q=openEuler'),
        field('opengauss','openGauss','openGauss','openGauss','https://e.huawei.com/en/talent/search/?q=openGauss'),
        field('harmonyos','HarmonyOS','HarmonyOS','HarmonyOS','https://e.huawei.com/en/talent/search/?q=HarmonyOS'),
        field('ai','الذكاء الاصطناعي','AI','Yapay Zekâ','https://e.huawei.com/en/talent/search/?q=AI'),
        field('kunpeng','Kunpeng','Kunpeng','Kunpeng','https://e.huawei.com/en/talent/search/?q=Kunpeng'),
        field('computing','الحوسبة','Computing','Bilgi İşlem','https://e.huawei.com/en/talent/search/?q=Computing'),
        field('storage','التخزين','Storage','Depolama','https://e.huawei.com/en/talent/search/?q=Storage'),
        field('collaboration','التعاون','Collaboration','İş Birliği','https://e.huawei.com/en/talent/search/?q=Collaboration'),
        field('intelligent-vision','الرؤية الذكية','Intelligent Vision','Akıllı Görüntü','https://e.huawei.com/en/talent/search/?q=Intelligent%20Vision'),
        field('digital-power','الطاقة الرقمية','Digital Power','Dijital Güç','https://e.huawei.com/en/talent/search/?q=Digital%20Power'),
        field('mdc','MDC','MDC','MDC','https://e.huawei.com/en/talent/search/?q=MDC'),
        field('datacom','اتصالات البيانات','Datacom','Datacom','https://e.huawei.com/en/talent/search/?q=Datacom'),
        field('wlan','الشبكات المحلية اللاسلكية','WLAN','WLAN','https://e.huawei.com/en/talent/search/?q=WLAN'),
        field('security','الأمن','Security','Güvenlik','https://e.huawei.com/en/talent/search/?q=Security'),
        field('transmission','النقل','Transmission','İletim','https://e.huawei.com/en/talent/search/?q=Transmission'),
        field('access','الوصول','Access','Erişim','https://e.huawei.com/en/talent/search/?q=Access'),
        field('5g','5G','5G','5G','https://e.huawei.com/en/talent/search/?q=5G'),
        field('lte','LTE','LTE','LTE','https://e.huawei.com/en/talent/search/?q=LTE')
      ]
    },
    'plat-11':{
      sourceUrl:'https://openlearn.aucegypt.edu/',
      fields:[]
    },
    'plat-12':{
      sourceUrl:'https://www.life-global.org/',
      fields:[
        field('communication','التواصل','Communication','İletişim','https://www.life-global.org/categorylist/1-communication'),
        field('digital-business-skills','مهارات الأعمال الرقمية','Digital Business Skills','Dijital İş Becerileri','https://www.life-global.org/categorylist/7-digital-business-skills'),
        field('entrepreneurship','ريادة الأعمال','Entrepreneurship','Girişimcilik','https://www.life-global.org/categorylist/2-entrepreneurship'),
        field('finance','التمويل','Finance','Finans','https://www.life-global.org/categorylist/3-finance'),
        field('marketing','التسويق','Marketing','Pazarlama','https://www.life-global.org/categorylist/4-marketing'),
        field('professional-development','التطوير المهني','Professional Development','Mesleki Gelişim','https://www.life-global.org/categorylist/6-career-development')
      ]
    },
    'plat-13':{
      sourceUrl:'https://www.nvidia.com/en-us/training/find-training/',
      fields:[
        field('accelerated-computing','الحوسبة المسرّعة','Accelerated Computing','Hızlandırılmış Hesaplama','https://www.nvidia.com/en-us/learn/learning-path/accelerated-computing/'),
        field('ai-infrastructure','البنية التحتية للذكاء الاصطناعي','AI Infrastructure','Yapay Zekâ Altyapısı','https://www.nvidia.com/en-us/training/academy/learning-paths/'),
        field('data-science','علم البيانات','Data Science','Veri Bilimi','https://www.nvidia.com/en-us/learn/learning-path/accelerated-data-science/'),
        field('deep-learning','التعلم العميق','Deep Learning','Derin Öğrenme','https://www.nvidia.com/en-us/learn/learning-path/deep-learning/'),
        field('generative-ai-llms','الذكاء الاصطناعي التوليدي والنماذج اللغوية الكبيرة','Generative AI / LLMs','Üretken Yapay Zekâ / LLM’ler','https://www.nvidia.com/en-us/learn/learning-path/generative-ai-llm/'),
        field('graphics-simulation','الرسوم والمحاكاة','Graphics and Simulation','Grafik ve Simülasyon','https://www.nvidia.com/en-us/training/instructor-led-workshops/')
      ]
    },
    'plat-14':{
      sourceUrl:'https://www.netacad.com/',
      fields:[
        field('cybersecurity','الأمن السيبراني','Cybersecurity','Siber Güvenlik','https://www.netacad.com/catalogs/learn/cybersecurity'),
        field('networking','الشبكات','Networking','Ağ','https://www.netacad.com/catalogs/learn/networking'),
        field('ai-data-science','الذكاء الاصطناعي وعلوم البيانات','AI & Data Science','Yapay Zekâ ve Veri Bilimi','https://www.netacad.com/catalogs/learn/data-science'),
        field('programming','البرمجة','Programming','Programlama','https://www.netacad.com/catalogs/learn/programming'),
        field('information-technology','تقنية المعلومات','Information Technology','Bilgi Teknolojileri','https://www.netacad.com/catalogs/learn/information-technology'),
        field('digital-literacy','محو الأمية الرقمية','Digital Literacy','Dijital Okuryazarlık','https://www.netacad.com/catalogs/learn/digital-literacy'),
        field('professional-skills','المهارات المهنية','Professional Skills','Profesyonel Beceriler','https://www.netacad.com/learning-collections/professionalskills?courseLang=en-US'),
        field('sustainability','الاستدامة','Sustainability','Sürdürülebilirlik','https://www.netacad.com/catalogs/learn/sustainability'),
        field('cisco-packet-tracer','سيسكو باكيت تريسر','Cisco Packet Tracer','Cisco Packet Tracer','https://www.netacad.com/learning-collections/cisco-packet-tracer')
      ]
    },
    'plat-15':{
      sourceUrl:'https://www.open.edu/openlearn/subject-information',
      fields:[
        field('money-business','المال والأعمال','Money & Business','Para ve İşletme','https://www.open.edu/openlearn/money-management/free-courses'),
        field('education-development','التعليم والتنمية','Education & Development','Eğitim ve Gelişim','https://www.open.edu/openlearn/education/free-courses'),
        field('health-sports-psychology','الصحة والرياضة وعلم النفس','Health, Sports & Psychology','Sağlık, Spor ve Psikoloji','https://www.open.edu/openlearn/body-mind/free-courses'),
        field('history-arts','التاريخ والفنون','History & The Arts','Tarih ve Sanat','https://www.open.edu/openlearn/history-the-arts/free-courses'),
        field('languages','اللغات','Languages','Diller','https://www.open.edu/openlearn/languages/free-courses'),
        field('nature-environment','الطبيعة والبيئة','Nature & Environment','Doğa ve Çevre','https://www.open.edu/openlearn/nature-environment/free-courses'),
        field('science-maths-technology','العلوم والرياضيات والتقنية','Science, Maths & Technology','Bilim, Matematik ve Teknoloji','https://www.open.edu/openlearn/science-maths-technology/free-courses'),
        field('society-politics-law','المجتمع والسياسة والقانون','Society, Politics & Law','Toplum, Siyaset ve Hukuk','https://www.open.edu/openlearn/society/free-courses'),
        field('digital-computing','الرقميات والحوسبة','Digital & Computing','Dijital ve Bilgi İşlem','https://www.open.edu/openlearn/digital/free-courses')
      ]
    },
    'plat-16':{
      sourceUrl:'https://skillshop.exceedlms.com/student/catalog/browse',
      fields:[
        field('google-ads','إعلانات Google','Google Ads','Google Ads','https://skillshop.exceedlms.com/student/catalog/list?category_ids=419-google-ads'),
        field('google-digital-garage','مرآب Google الرقمي','Google Digital Garage','Google Dijital Atölye','https://skillshop.exceedlms.com/student/catalog/list?category_ids=7836-grow-with-google'),
        field('google-for-education','Google للتعليم','Google for Education','Google for Education','https://skillshop.exceedlms.com/student/catalog/list?category_ids=3351-google-for-education'),
        field('google-marketing-platform','منصة Google للتسويق','Google Marketing Platform','Google Marketing Platform','https://skillshop.exceedlms.com/student/catalog/list?category_ids=638-google-marketing-platform'),
        field('youtube','يوتيوب','YouTube','YouTube','https://skillshop.exceedlms.com/student/catalog/list?category_ids=676-youtube'),
        field('waze-academy','أكاديمية Waze','Waze Academy','Waze Academy','https://skillshop.exceedlms.com/student/catalog/list?category_ids=2885-waze-academy')
      ]
    },
    'plat-17':{
      sourceUrl:'https://www.sololearn.com/en/learn/',
      fields:[
        field('programming-foundations','أساسيات البرمجة','Programming Foundations','Programlama Temelleri','https://www.sololearn.com/en/learn/courses/coding-foundations'),
        field('data-analytics','البيانات والتحليلات','Data & Analytics','Veri ve Analitik','https://ai.sololearn.com/en/learn/courses/data-programming'),
        field('web-app-development','تطوير الويب والتطبيقات','Web & App Development','Web ve Uygulama Geliştirme','https://www.sololearn.com/en/learn/courses/web-development'),
        field('advanced-programming-frameworks','البرمجة المتقدمة وأطر العمل','Advanced Programming & Frameworks','İleri Programlama ve Frameworkler','https://www.sololearn.com/en/learn/courses/angular'),
        field('ai-generative-technologies','الذكاء الاصطناعي والتقنيات التوليدية','AI & Generative Technologies','Yapay Zekâ ve Üretken Teknolojiler','https://www.sololearn.com/en/learn-how-to-use-ai')
      ]
    },
    'plat-18':{
      sourceUrl:'https://researcheracademy.elsevier.com/',
      fields:[
        field('research-preparation','التحضير للبحث','Research Preparation','Araştırma Hazırlığı','https://researcheracademy.elsevier.com/research-preparation'),
        field('writing-research','الكتابة للبحث','Writing for Research','Araştırma Yazımı','https://researcheracademy.elsevier.com/writing-research'),
        field('publication-process','عملية النشر','Publication Process','Yayın Süreci','https://researcheracademy.elsevier.com/publication-process'),
        field('navigating-peer-review','التعامل مع مراجعة الأقران','Navigating Peer Review','Hakem Değerlendirmesi','https://researcheracademy.elsevier.com/navigating-peer-review'),
        field('communicating-research','التواصل حول بحثك','Communicating Your Research','Araştırmanı İletme','https://researcheracademy.elsevier.com/communicating-research')
      ]
    },
    'plat-19':{
      sourceUrl:'https://www.w3schools.com/',
      fields:[
        field('html','HTML','HTML','HTML','https://www.w3schools.com/html/'),
        field('css','CSS','CSS','CSS','https://www.w3schools.com/css/'),
        field('javascript','جافاسكربت','JavaScript','JavaScript','https://www.w3schools.com/js/'),
        field('python','بايثون','Python','Python','https://www.w3schools.com/python/'),
        field('sql','SQL','SQL','SQL','https://www.w3schools.com/sql/'),
        field('java','Java','Java','Java','https://www.w3schools.com/java/'),
        field('c','لغة C','C','C','https://www.w3schools.com/c/'),
        field('cpp','لغة C++','C++','C++','https://www.w3schools.com/cpp/'),
        field('csharp','لغة C#','C#','C#','https://www.w3schools.com/cs/'),
        field('php','PHP','PHP','PHP','https://www.w3schools.com/php/'),
        field('react','React','React','React','https://www.w3schools.com/react/'),
        field('w3css','W3.CSS','W3.CSS','W3.CSS','https://www.w3schools.com/w3css/'),
        field('bootstrap5','Bootstrap 5','Bootstrap 5','Bootstrap 5','https://www.w3schools.com/bootstrap5/'),
        field('mysql','MySQL','MySQL','MySQL','https://www.w3schools.com/mysql/'),
        field('jquery','jQuery','jQuery','jQuery','https://www.w3schools.com/jquery/'),
        field('dsa','هياكل البيانات والخوارزميات','DSA','Veri Yapıları ve Algoritmalar','https://www.w3schools.com/dsa/'),
        field('typescript','TypeScript','TypeScript','TypeScript','https://www.w3schools.com/typescript/'),
        field('swift','Swift','Swift','Swift','https://www.w3schools.com/swift/'),
        field('angularjs','AngularJS','AngularJS','AngularJS','https://www.w3schools.com/angular/'),
        field('r','لغة R','R','R','https://www.w3schools.com/r/'),
        field('rust','Rust','Rust','Rust','https://www.w3schools.com/rust/')
      ]
    },
    'plat-20':{
      sourceUrl:'https://www.khanacademy.org/',
      fields:[
        field('math','الرياضيات','Math','Matematik','https://www.khanacademy.org/math'),
        field('test-prep','الاستعداد للاختبارات','Test Prep','Sınav Hazırlığı','https://www.khanacademy.org/test-prep'),
        field('ela','فنون اللغة الإنجليزية','English Language Arts (ELA)','İngilizce Dil Sanatları (ELA)','https://www.khanacademy.org/ela'),
        field('science','العلوم','Science','Fen Bilimleri','https://www.khanacademy.org/science'),
        field('social-studies','الدراسات الاجتماعية','Social Studies','Sosyal Bilgiler','https://www.khanacademy.org/humanities'),
        field('computing','الحوسبة','Computing','Bilgi İşlem','https://www.khanacademy.org/computing'),
        field('economics','الاقتصاد','Economics','Ekonomi','https://www.khanacademy.org/economics-finance-domain'),
        field('life-skills','مهارات الحياة','Life Skills','Yaşam Becerileri','https://www.khanacademy.org/college-careers-more'),
        field('partner-courses','دورات الشركاء','Partner Courses','İş Ortağı Kursları','https://www.khanacademy.org/partner-content')
      ]
    }
  });

  function cloneField(row){
    return {id:String(row&&row.id||''),name:{...(row&&row.name||{})},officialUrl:String(row&&row.officialUrl||'')};
  }

  function hasPlatform(platformId){
    return Object.prototype.hasOwnProperty.call(DATA,String(platformId||''));
  }

  function forPlatform(platformId){
    const row=DATA[String(platformId||'')];
    return row&&Array.isArray(row.fields)?row.fields.map(cloneField):[];
  }

  function sourceForPlatform(platformId){
    const row=DATA[String(platformId||'')];
    return row&&row.sourceUrl?row.sourceUrl:'';
  }

  function applyToData(data){
    if(!data||!Array.isArray(data.platforms))return data;
    return {...data,platforms:data.platforms.map(platform=>{
      if(!platform||!hasPlatform(platform.id))return platform;
      return {...platform,fields:forPlatform(platform.id)};
    })};
  }

  function install(loader){
    if(!loader||typeof loader.loadSiteData!=='function'||loader.__platformCategories1020Installed)return false;
    const original=loader.loadSiteData.bind(loader);
    loader.loadSiteData=async function(...args){return applyToData(await original(...args))};
    Object.defineProperty(loader,'__platformCategories1020Installed',{value:true,configurable:false,enumerable:false,writable:false});
    return true;
  }

  if(typeof globalThis!=='undefined'&&globalThis.DataLoader)install(globalThis.DataLoader);

  return {forPlatform,sourceForPlatform,hasPlatform,applyToData,install};
});
