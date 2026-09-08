(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.PlatformCategories=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';

  const DATA=Object.freeze({
  "plat-2": {
    "sourceUrl": "https://agora.unicef.org/",
    "fields": [
      {"id":"focus-areas","name":{"ar":"مجالات العمل","en":"Focus areas","tr":"Odak alanları"},"officialUrl":"https://agora.unicef.org/"},
      {"id":"strategies","name":{"ar":"الاستراتيجيات","en":"Strategies","tr":"Stratejiler"},"officialUrl":"https://agora.unicef.org/"},
      {"id":"leading-managing","name":{"ar":"القيادة والإدارة","en":"Leading and managing","tr":"Liderlik ve yönetim"},"officialUrl":"https://agora.unicef.org/"},
      {"id":"operational-support","name":{"ar":"الدعم التشغيلي","en":"Operational support","tr":"Operasyonel destek"},"officialUrl":"https://agora.unicef.org/"},
      {"id":"communication-languages","name":{"ar":"التواصل واللغات","en":"Communication & languages","tr":"İletişim ve diller"},"officialUrl":"https://agora.unicef.org/"},
      {"id":"career-support","name":{"ar":"الدعم المهني","en":"Career support","tr":"Kariyer desteği"},"officialUrl":"https://agora.unicef.org/"}
    ]
  },
  "plat-3": {
    "sourceUrl": "https://skillsbuild.org/college-students/course-catalog",
    "fields": [
      {"id":"artificial-intelligence","name":{"ar":"الذكاء الاصطناعي","en":"Artificial Intelligence","tr":"Yapay Zekâ"},"officialUrl":"https://skillsbuild.org/college-students/course-catalog"},
      {"id":"business-professional-skills","name":{"ar":"مهارات الأعمال والمهارات المهنية","en":"Business & Professional Skills","tr":"İş ve Profesyonel Beceriler"},"officialUrl":"https://skillsbuild.org/college-students/course-catalog"},
      {"id":"cybersecurity","name":{"ar":"الأمن السيبراني","en":"Cybersecurity","tr":"Siber Güvenlik"},"officialUrl":"https://skillsbuild.org/college-students/course-catalog"},
      {"id":"data-analytics","name":{"ar":"البيانات والتحليلات","en":"Data & Analytics","tr":"Veri ve Analitik"},"officialUrl":"https://skillsbuild.org/college-students/course-catalog"},
      {"id":"design","name":{"ar":"التصميم","en":"Design","tr":"Tasarım"},"officialUrl":"https://skillsbuild.org/college-students/course-catalog"},
      {"id":"it-cloud","name":{"ar":"تقنية المعلومات والحوسبة السحابية","en":"IT & Cloud","tr":"BT ve Bulut"},"officialUrl":"https://skillsbuild.org/college-students/course-catalog"},
      {"id":"software-development","name":{"ar":"تطوير البرمجيات","en":"Software Development","tr":"Yazılım Geliştirme"},"officialUrl":"https://skillsbuild.org/college-students/course-catalog"},
      {"id":"education","name":{"ar":"التعليم","en":"Education","tr":"Eğitim"},"officialUrl":"https://skillsbuild.org/college-students/course-catalog"},
      {"id":"healthcare","name":{"ar":"الرعاية الصحية","en":"Healthcare","tr":"Sağlık"},"officialUrl":"https://skillsbuild.org/college-students/course-catalog"},
      {"id":"marketing","name":{"ar":"التسويق","en":"Marketing","tr":"Pazarlama"},"officialUrl":"https://skillsbuild.org/college-students/course-catalog"},
      {"id":"sports-entertainment","name":{"ar":"الرياضة والترفيه","en":"Sports & Entertainment","tr":"Spor ve Eğlence"},"officialUrl":"https://skillsbuild.org/college-students/course-catalog"}
    ]
  },
  "plat-4": {
    "sourceUrl": "https://www.theforage.com/virtual-internships",
    "fields": [
      {"id":"accounting","name":{"ar":"المحاسبة","en":"Accounting","tr":"Muhasebe"},"officialUrl":"https://www.theforage.com/virtual-internships"},
      {"id":"banking-financial-services","name":{"ar":"الخدمات المصرفية والمالية","en":"Banking & Financial Services","tr":"Bankacılık ve Finansal Hizmetler"},"officialUrl":"https://www.theforage.com/virtual-internships"},
      {"id":"artificial-intelligence","name":{"ar":"الذكاء الاصطناعي","en":"Artificial Intelligence","tr":"Yapay Zekâ"},"officialUrl":"https://www.theforage.com/virtual-internships"},
      {"id":"data-analytics","name":{"ar":"البيانات والتحليلات","en":"Data & Analytics","tr":"Veri ve Analitik"},"officialUrl":"https://www.theforage.com/virtual-internships"},
      {"id":"design","name":{"ar":"التصميم","en":"Design","tr":"Tasarım"},"officialUrl":"https://www.theforage.com/virtual-internships"},
      {"id":"software-engineering","name":{"ar":"هندسة البرمجيات","en":"Software Engineering","tr":"Yazılım Mühendisliği"},"officialUrl":"https://www.theforage.com/virtual-internships"},
      {"id":"security","name":{"ar":"الأمن","en":"Security","tr":"Güvenlik"},"officialUrl":"https://www.theforage.com/virtual-internships"},
      {"id":"consulting","name":{"ar":"الاستشارات","en":"Consulting","tr":"Danışmanlık"},"officialUrl":"https://www.theforage.com/virtual-internships"},
      {"id":"engineering","name":{"ar":"الهندسة","en":"Engineering","tr":"Mühendislik"},"officialUrl":"https://www.theforage.com/virtual-internships"},
      {"id":"law","name":{"ar":"القانون","en":"Law","tr":"Hukuk"},"officialUrl":"https://www.theforage.com/virtual-internships"},
      {"id":"client-services","name":{"ar":"خدمات العملاء","en":"Client Services","tr":"Müşteri Hizmetleri"},"officialUrl":"https://www.theforage.com/virtual-internships"},
      {"id":"sales","name":{"ar":"المبيعات","en":"Sales","tr":"Satış"},"officialUrl":"https://www.theforage.com/virtual-internships"},
      {"id":"project-management","name":{"ar":"إدارة المشاريع","en":"Project Management","tr":"Proje Yönetimi"},"officialUrl":"https://www.theforage.com/virtual-internships"},
      {"id":"marketing","name":{"ar":"التسويق","en":"Marketing","tr":"Pazarlama"},"officialUrl":"https://www.theforage.com/virtual-internships"},
      {"id":"human-resources","name":{"ar":"الموارد البشرية","en":"Human Resources","tr":"İnsan Kaynakları"},"officialUrl":"https://www.theforage.com/virtual-internships"}
    ]
  },
  "plat-5": {
    "sourceUrl": "https://learn.microsoft.com/en-us/training/browse/",
    "fields": [
      {"id":"application-development","name":{"ar":"تطوير التطبيقات","en":"Application Development","tr":"Uygulama Geliştirme"},"officialUrl":"https://learn.microsoft.com/en-us/training/browse/"},
      {"id":"artificial-intelligence","name":{"ar":"الذكاء الاصطناعي","en":"Artificial Intelligence","tr":"Yapay Zekâ"},"officialUrl":"https://learn.microsoft.com/en-us/training/browse/"},
      {"id":"business-applications","name":{"ar":"تطبيقات الأعمال","en":"Business Applications","tr":"İş Uygulamaları"},"officialUrl":"https://learn.microsoft.com/en-us/training/browse/"},
      {"id":"data-management","name":{"ar":"إدارة البيانات","en":"Data Management","tr":"Veri Yönetimi"},"officialUrl":"https://learn.microsoft.com/en-us/training/browse/"},
      {"id":"security","name":{"ar":"الأمن","en":"Security","tr":"Güvenlik"},"officialUrl":"https://learn.microsoft.com/en-us/training/browse/"},
      {"id":"technical-infrastructure","name":{"ar":"البنية التحتية التقنية","en":"Technical Infrastructure","tr":"Teknik Altyapı"},"officialUrl":"https://learn.microsoft.com/en-us/training/browse/"}
    ]
  },
  "plat-6": {
    "sourceUrl": "https://academy.itu.int/training-courses/full-catalogue",
    "fields": [
      {"id":"cybersecurity","name":{"ar":"الأمن السيبراني","en":"Cybersecurity","tr":"Siber Güvenlik"},"officialUrl":"https://academy.itu.int/training-courses/full-catalogue"},
      {"id":"digital-transformation","name":{"ar":"التحول الرقمي","en":"Digital Transformation","tr":"Dijital Dönüşüm"},"officialUrl":"https://academy.itu.int/training-courses/full-catalogue"},
      {"id":"digital-inclusion","name":{"ar":"الشمول الرقمي","en":"Digital Inclusion","tr":"Dijital Kapsayıcılık"},"officialUrl":"https://academy.itu.int/training-courses/full-catalogue"},
      {"id":"artificial-intelligence","name":{"ar":"الذكاء الاصطناعي","en":"Artificial Intelligence","tr":"Yapay Zekâ"},"officialUrl":"https://academy.itu.int/training-courses/full-catalogue"},
      {"id":"wireless-fixed-broadband","name":{"ar":"النطاق العريض اللاسلكي والثابت","en":"Wireless and Fixed Broadband","tr":"Kablosuz ve Sabit Geniş Bant"},"officialUrl":"https://academy.itu.int/training-courses/full-catalogue"},
      {"id":"e-government","name":{"ar":"الحكومة الإلكترونية","en":"E-government","tr":"E-Devlet"},"officialUrl":"https://academy.itu.int/training-courses/full-catalogue"},
      {"id":"ict-applications","name":{"ar":"تطبيقات تكنولوجيا المعلومات والاتصالات","en":"ICT Applications","tr":"BİT Uygulamaları"},"officialUrl":"https://academy.itu.int/training-courses/full-catalogue"},
      {"id":"ict-telecom-regulation","name":{"ar":"تنظيم تكنولوجيا المعلومات والاتصالات","en":"ICT/Telecom Regulation","tr":"BİT/Telekom Düzenlemeleri"},"officialUrl":"https://academy.itu.int/training-courses/full-catalogue"},
      {"id":"satellite-communications","name":{"ar":"الاتصالات عبر الأقمار الصناعية","en":"Satellite Communications","tr":"Uydu Haberleşmesi"},"officialUrl":"https://academy.itu.int/training-courses/full-catalogue"},
      {"id":"big-data-statistics","name":{"ar":"البيانات الضخمة والإحصاءات","en":"Big Data and Statistics","tr":"Büyük Veri ve İstatistik"},"officialUrl":"https://academy.itu.int/training-courses/full-catalogue"},
      {"id":"e-waste","name":{"ar":"النفايات الإلكترونية","en":"E-Waste","tr":"E-Atık"},"officialUrl":"https://academy.itu.int/training-courses/full-catalogue"},
      {"id":"digital-economy","name":{"ar":"الاقتصاد الرقمي","en":"Digital Economy","tr":"Dijital Ekonomi"},"officialUrl":"https://academy.itu.int/training-courses/full-catalogue"},
      {"id":"emergency-telecommunication","name":{"ar":"اتصالات الطوارئ","en":"Emergency Telecommunication","tr":"Acil Durum Haberleşmesi"},"officialUrl":"https://academy.itu.int/training-courses/full-catalogue"},
      {"id":"spectrum-management","name":{"ar":"إدارة الطيف الترددي","en":"Spectrum Management","tr":"Spektrum Yönetimi"},"officialUrl":"https://academy.itu.int/training-courses/full-catalogue"},
      {"id":"icts-environment","name":{"ar":"تكنولوجيا المعلومات والاتصالات والبيئة","en":"ICTs and the Environment","tr":"BİT ve Çevre"},"officialUrl":"https://academy.itu.int/training-courses/full-catalogue"},
      {"id":"innovation-entrepreneurship","name":{"ar":"الابتكار وريادة الأعمال","en":"Innovation and Entrepreneurship","tr":"İnovasyon ve Girişimcilik"},"officialUrl":"https://academy.itu.int/training-courses/full-catalogue"},
      {"id":"smart-cities-communities","name":{"ar":"المدن والمجتمعات الذكية","en":"Smart Cities and Communities","tr":"Akıllı Şehirler ve Topluluklar"},"officialUrl":"https://academy.itu.int/training-courses/full-catalogue"},
      {"id":"ict-climate-change","name":{"ar":"تكنولوجيا المعلومات والاتصالات وتغير المناخ","en":"ICT & Climate Change","tr":"BİT ve İklim Değişikliği"},"officialUrl":"https://academy.itu.int/training-courses/full-catalogue"},
      {"id":"digital-financial-services","name":{"ar":"الخدمات المالية الرقمية","en":"Digital Financial Services","tr":"Dijital Finansal Hizmetler"},"officialUrl":"https://academy.itu.int/training-courses/full-catalogue"},
      {"id":"quality-of-service","name":{"ar":"جودة الخدمة","en":"Quality of Service","tr":"Hizmet Kalitesi"},"officialUrl":"https://academy.itu.int/training-courses/full-catalogue"},
      {"id":"ict-accessibility","name":{"ar":"إتاحة تكنولوجيا المعلومات والاتصالات","en":"ICT Accessibility","tr":"BİT Erişilebilirliği"},"officialUrl":"https://academy.itu.int/training-courses/full-catalogue"},
      {"id":"basic-digital-skills","name":{"ar":"المهارات الرقمية الأساسية","en":"Basic Digital Skills","tr":"Temel Dijital Beceriler"},"officialUrl":"https://academy.itu.int/training-courses/full-catalogue"},
      {"id":"conformance-interoperability","name":{"ar":"المطابقة وقابلية التشغيل البيني","en":"Conformance and Interoperability","tr":"Uygunluk ve Birlikte Çalışabilirlik"},"officialUrl":"https://academy.itu.int/training-courses/full-catalogue"},
      {"id":"e-health","name":{"ar":"الصحة الإلكترونية","en":"E-health","tr":"E-Sağlık"},"officialUrl":"https://academy.itu.int/training-courses/full-catalogue"},
      {"id":"internet-of-things","name":{"ar":"إنترنت الأشياء","en":"Internet of Things","tr":"Nesnelerin İnterneti"},"officialUrl":"https://academy.itu.int/training-courses/full-catalogue"}
    ]
  },
  "plat-7": {
    "sourceUrl": "https://www.edx.org/learn",
    "fields": [
      {"id":"architecture","name":{"ar":"العمارة","en":"Architecture","tr":"Mimarlık"},"officialUrl":"https://www.edx.org/learn"},
      {"id":"art","name":{"ar":"الفنون","en":"Art","tr":"Sanat"},"officialUrl":"https://www.edx.org/learn"},
      {"id":"biology","name":{"ar":"الأحياء","en":"Biology","tr":"Biyoloji"},"officialUrl":"https://www.edx.org/learn"},
      {"id":"business-administration","name":{"ar":"إدارة الأعمال","en":"Business Administration","tr":"İşletme"},"officialUrl":"https://www.edx.org/learn"},
      {"id":"business-communications","name":{"ar":"اتصالات الأعمال","en":"Business Communications","tr":"İş İletişimi"},"officialUrl":"https://www.edx.org/learn"},
      {"id":"chemistry","name":{"ar":"الكيمياء","en":"Chemistry","tr":"Kimya"},"officialUrl":"https://www.edx.org/learn"},
      {"id":"computer-programming","name":{"ar":"برمجة الحاسوب","en":"Computer Programming","tr":"Bilgisayar Programlama"},"officialUrl":"https://www.edx.org/learn"},
      {"id":"computer-science","name":{"ar":"علوم الحاسوب","en":"Computer Science","tr":"Bilgisayar Bilimi"},"officialUrl":"https://www.edx.org/learn"},
      {"id":"data-analysis","name":{"ar":"تحليل البيانات","en":"Data Analysis","tr":"Veri Analizi"},"officialUrl":"https://www.edx.org/learn"},
      {"id":"design","name":{"ar":"التصميم","en":"Design","tr":"Tasarım"},"officialUrl":"https://www.edx.org/learn"},
      {"id":"economics","name":{"ar":"الاقتصاد","en":"Economics","tr":"Ekonomi"},"officialUrl":"https://www.edx.org/learn"},
      {"id":"education","name":{"ar":"التعليم","en":"Education","tr":"Eğitim"},"officialUrl":"https://www.edx.org/learn"},
      {"id":"electronics","name":{"ar":"الإلكترونيات","en":"Electronics","tr":"Elektronik"},"officialUrl":"https://www.edx.org/learn"},
      {"id":"engineering","name":{"ar":"الهندسة","en":"Engineering","tr":"Mühendislik"},"officialUrl":"https://www.edx.org/learn"},
      {"id":"environmental-science","name":{"ar":"العلوم البيئية","en":"Environmental Science","tr":"Çevre Bilimi"},"officialUrl":"https://www.edx.org/learn"},
      {"id":"healthcare","name":{"ar":"الرعاية الصحية","en":"Healthcare","tr":"Sağlık"},"officialUrl":"https://www.edx.org/learn"},
      {"id":"history","name":{"ar":"التاريخ","en":"History","tr":"Tarih"},"officialUrl":"https://www.edx.org/learn"},
      {"id":"humanities","name":{"ar":"العلوم الإنسانية","en":"Humanities","tr":"Beşeri Bilimler"},"officialUrl":"https://www.edx.org/learn"},
      {"id":"language","name":{"ar":"اللغات","en":"Language","tr":"Dil"},"officialUrl":"https://www.edx.org/learn"},
      {"id":"law","name":{"ar":"القانون","en":"Law","tr":"Hukuk"},"officialUrl":"https://www.edx.org/learn"},
      {"id":"literature","name":{"ar":"الأدب","en":"Literature","tr":"Edebiyat"},"officialUrl":"https://www.edx.org/learn"},
      {"id":"math","name":{"ar":"الرياضيات","en":"Math","tr":"Matematik"},"officialUrl":"https://www.edx.org/learn"},
      {"id":"medicine","name":{"ar":"الطب","en":"Medicine","tr":"Tıp"},"officialUrl":"https://www.edx.org/learn"},
      {"id":"nutrition","name":{"ar":"التغذية","en":"Nutrition","tr":"Beslenme"},"officialUrl":"https://www.edx.org/learn"},
      {"id":"physics","name":{"ar":"الفيزياء","en":"Physics","tr":"Fizik"},"officialUrl":"https://www.edx.org/learn"},
      {"id":"science","name":{"ar":"العلوم","en":"Science","tr":"Bilim"},"officialUrl":"https://www.edx.org/learn"},
      {"id":"social-science","name":{"ar":"العلوم الاجتماعية","en":"Social Science","tr":"Sosyal Bilimler"},"officialUrl":"https://www.edx.org/learn"}
    ]
  },
  "plat-8": {
    "sourceUrl": "https://www.codecademy.com/catalog",
    "fields": [
      {"id":"ai","name":{"ar":"الذكاء الاصطناعي","en":"AI","tr":"Yapay Zekâ"},"officialUrl":"https://www.codecademy.com/catalog"},
      {"id":"bash-shell","name":{"ar":"باش/سطر الأوامر","en":"Bash/Shell","tr":"Bash/Shell"},"officialUrl":"https://www.codecademy.com/catalog"},
      {"id":"c","name":{"ar":"لغة C","en":"C","tr":"C"},"officialUrl":"https://www.codecademy.com/catalog"},
      {"id":"c-sharp","name":{"ar":"لغة C#","en":"C#","tr":"C#"},"officialUrl":"https://www.codecademy.com/catalog"},
      {"id":"c-plus-plus","name":{"ar":"لغة C++","en":"C++","tr":"C++"},"officialUrl":"https://www.codecademy.com/catalog"},
      {"id":"certification-prep","name":{"ar":"الاستعداد للشهادات","en":"Certification Prep","tr":"Sertifika Hazırlığı"},"officialUrl":"https://www.codecademy.com/catalog"},
      {"id":"cloud-computing","name":{"ar":"الحوسبة السحابية","en":"Cloud Computing","tr":"Bulut Bilişim"},"officialUrl":"https://www.codecademy.com/catalog"},
      {"id":"code-foundations","name":{"ar":"أساسيات البرمجة","en":"Code Foundations","tr":"Kodlama Temelleri"},"officialUrl":"https://www.codecademy.com/catalog"},
      {"id":"computer-science","name":{"ar":"علوم الحاسوب","en":"Computer Science","tr":"Bilgisayar Bilimi"},"officialUrl":"https://www.codecademy.com/catalog"},
      {"id":"cybersecurity","name":{"ar":"الأمن السيبراني","en":"Cybersecurity","tr":"Siber Güvenlik"},"officialUrl":"https://www.codecademy.com/catalog"},
      {"id":"data-analytics","name":{"ar":"تحليلات البيانات","en":"Data Analytics","tr":"Veri Analitiği"},"officialUrl":"https://www.codecademy.com/catalog"},
      {"id":"data-engineering","name":{"ar":"هندسة البيانات","en":"Data Engineering","tr":"Veri Mühendisliği"},"officialUrl":"https://www.codecademy.com/catalog"},
      {"id":"data-science","name":{"ar":"علم البيانات","en":"Data Science","tr":"Veri Bilimi"},"officialUrl":"https://www.codecademy.com/catalog"},
      {"id":"data-visualization","name":{"ar":"تصور البيانات","en":"Data Visualization","tr":"Veri Görselleştirme"},"officialUrl":"https://www.codecademy.com/catalog"},
      {"id":"devops","name":{"ar":"ديف أوبس","en":"DevOps","tr":"DevOps"},"officialUrl":"https://www.codecademy.com/catalog"},
      {"id":"developer-tools","name":{"ar":"أدوات المطورين","en":"Developer Tools","tr":"Geliştirici Araçları"},"officialUrl":"https://www.codecademy.com/catalog"},
      {"id":"game-development","name":{"ar":"تطوير الألعاب","en":"Game Development","tr":"Oyun Geliştirme"},"officialUrl":"https://www.codecademy.com/catalog"},
      {"id":"go","name":{"ar":"لغة Go","en":"Go","tr":"Go"},"officialUrl":"https://www.codecademy.com/catalog"},
      {"id":"html-css","name":{"ar":"HTML وCSS","en":"HTML & CSS","tr":"HTML ve CSS"},"officialUrl":"https://www.codecademy.com/catalog"},
      {"id":"it","name":{"ar":"تقنية المعلومات","en":"IT","tr":"BT"},"officialUrl":"https://www.codecademy.com/catalog"},
      {"id":"interview-prep","name":{"ar":"الاستعداد للمقابلات","en":"Interview Prep","tr":"Mülakat Hazırlığı"},"officialUrl":"https://www.codecademy.com/catalog"},
      {"id":"java","name":{"ar":"لغة Java","en":"Java","tr":"Java"},"officialUrl":"https://www.codecademy.com/catalog"},
      {"id":"javascript","name":{"ar":"جافاسكربت","en":"JavaScript","tr":"JavaScript"},"officialUrl":"https://www.codecademy.com/catalog"},
      {"id":"kotlin","name":{"ar":"كوتلن","en":"Kotlin","tr":"Kotlin"},"officialUrl":"https://www.codecademy.com/catalog"},
      {"id":"machine-learning","name":{"ar":"التعلم الآلي","en":"Machine Learning","tr":"Makine Öğrenmesi"},"officialUrl":"https://www.codecademy.com/catalog"},
      {"id":"math","name":{"ar":"الرياضيات","en":"Math","tr":"Matematik"},"officialUrl":"https://www.codecademy.com/catalog"},
      {"id":"mobile-development","name":{"ar":"تطوير تطبيقات الجوال","en":"Mobile Development","tr":"Mobil Geliştirme"},"officialUrl":"https://www.codecademy.com/catalog"},
      {"id":"open-source","name":{"ar":"المصادر المفتوحة","en":"Open Source","tr":"Açık Kaynak"},"officialUrl":"https://www.codecademy.com/catalog"},
      {"id":"php","name":{"ar":"لغة PHP","en":"PHP","tr":"PHP"},"officialUrl":"https://www.codecademy.com/catalog"},
      {"id":"professional-skills","name":{"ar":"المهارات المهنية","en":"Professional Skills","tr":"Profesyonel Beceriler"},"officialUrl":"https://www.codecademy.com/catalog"},
      {"id":"python","name":{"ar":"بايثون","en":"Python","tr":"Python"},"officialUrl":"https://www.codecademy.com/catalog"},
      {"id":"r","name":{"ar":"لغة R","en":"R","tr":"R"},"officialUrl":"https://www.codecademy.com/catalog"},
      {"id":"ruby","name":{"ar":"روبي","en":"Ruby","tr":"Ruby"},"officialUrl":"https://www.codecademy.com/catalog"},
      {"id":"sql","name":{"ar":"SQL","en":"SQL","tr":"SQL"},"officialUrl":"https://www.codecademy.com/catalog"},
      {"id":"swift","name":{"ar":"سويفت","en":"Swift","tr":"Swift"},"officialUrl":"https://www.codecademy.com/catalog"},
      {"id":"web-design","name":{"ar":"تصميم الويب","en":"Web Design","tr":"Web Tasarımı"},"officialUrl":"https://www.codecademy.com/catalog"},
      {"id":"web-development","name":{"ar":"تطوير الويب","en":"Web Development","tr":"Web Geliştirme"},"officialUrl":"https://www.codecademy.com/catalog"}
    ]
  },
  "plat-9": {
    "sourceUrl": "https://event.unitar.org/full-catalog",
    "fields": [
      {"id":"peace","name":{"ar":"السلام","en":"Peace","tr":"Barış"},"officialUrl":"https://event.unitar.org/full-catalog"},
      {"id":"people","name":{"ar":"الناس","en":"People","tr":"İnsanlar"},"officialUrl":"https://event.unitar.org/full-catalog"},
      {"id":"planet","name":{"ar":"الكوكب","en":"Planet","tr":"Gezegen"},"officialUrl":"https://event.unitar.org/full-catalog"},
      {"id":"prosperity","name":{"ar":"الازدهار","en":"Prosperity","tr":"Refah"},"officialUrl":"https://event.unitar.org/full-catalog"},
      {"id":"multilateral-diplomacy","name":{"ar":"الدبلوماسية متعددة الأطراف","en":"Multilateral Diplomacy","tr":"Çok Taraflı Diplomasi"},"officialUrl":"https://event.unitar.org/full-catalog"},
      {"id":"unosat","name":{"ar":"مركز الأمم المتحدة للأقمار الصناعية (UNOSAT)","en":"United Nations Satellite Centre (UNOSAT)","tr":"Birleşmiş Milletler Uydu Merkezi (UNOSAT)"},"officialUrl":"https://event.unitar.org/full-catalog"}
    ]
  },
  "plat-10": {
    "sourceUrl": "https://e.huawei.com/en/talent/learning/#/home",
    "fields": [
      {"id":"ai","name":{"ar":"الذكاء الاصطناعي","en":"AI","tr":"Yapay Zekâ"},"officialUrl":"https://e.huawei.com/en/talent/learning/#/home"},
      {"id":"openeuler","name":{"ar":"أوبن أويلر","en":"openEuler","tr":"openEuler"},"officialUrl":"https://e.huawei.com/en/talent/learning/#/home"},
      {"id":"opengauss","name":{"ar":"أوبن غاوس","en":"openGauss","tr":"openGauss"},"officialUrl":"https://e.huawei.com/en/talent/learning/#/home"},
      {"id":"gaussdb","name":{"ar":"غاوس دي بي","en":"GaussDB","tr":"GaussDB"},"officialUrl":"https://e.huawei.com/en/talent/learning/#/home"},
      {"id":"big-data","name":{"ar":"البيانات الضخمة","en":"Big Data","tr":"Büyük Veri"},"officialUrl":"https://e.huawei.com/en/talent/learning/#/home"},
      {"id":"iot","name":{"ar":"إنترنت الأشياء","en":"IoT","tr":"IoT"},"officialUrl":"https://e.huawei.com/en/talent/learning/#/home"},
      {"id":"cloud-service","name":{"ar":"الخدمات السحابية","en":"Cloud Service","tr":"Bulut Hizmeti"},"officialUrl":"https://e.huawei.com/en/talent/learning/#/home"},
      {"id":"harmonyos","name":{"ar":"هارموني أو إس","en":"HarmonyOS","tr":"HarmonyOS"},"officialUrl":"https://e.huawei.com/en/talent/learning/#/home"},
      {"id":"mdc","name":{"ar":"MDC","en":"MDC","tr":"MDC"},"officialUrl":"https://e.huawei.com/en/talent/learning/#/home"},
      {"id":"service-software","name":{"ar":"الخدمات والبرمجيات","en":"Service & Software","tr":"Hizmet ve Yazılım"},"officialUrl":"https://e.huawei.com/en/talent/learning/#/home"},
      {"id":"computing","name":{"ar":"الحوسبة","en":"Computing","tr":"Bilgi İşlem"},"officialUrl":"https://e.huawei.com/en/talent/learning/#/home"},
      {"id":"storage","name":{"ar":"التخزين","en":"Storage","tr":"Depolama"},"officialUrl":"https://e.huawei.com/en/talent/learning/#/home"},
      {"id":"cloud-computing","name":{"ar":"الحوسبة السحابية","en":"Cloud Computing","tr":"Bulut Bilişim"},"officialUrl":"https://e.huawei.com/en/talent/learning/#/home"},
      {"id":"intelligent-vision","name":{"ar":"الرؤية الذكية","en":"Intelligent Vision","tr":"Akıllı Görüntü"},"officialUrl":"https://e.huawei.com/en/talent/learning/#/home"},
      {"id":"collaboration","name":{"ar":"التعاون","en":"Collaboration","tr":"İş Birliği"},"officialUrl":"https://e.huawei.com/en/talent/learning/#/home"},
      {"id":"digital-power","name":{"ar":"الطاقة الرقمية","en":"Digital Power","tr":"Dijital Güç"},"officialUrl":"https://e.huawei.com/en/talent/learning/#/home"},
      {"id":"datacom","name":{"ar":"اتصالات البيانات","en":"Datacom","tr":"Datacom"},"officialUrl":"https://e.huawei.com/en/talent/learning/#/home"},
      {"id":"transmission","name":{"ar":"النقل","en":"Transmission","tr":"İletim"},"officialUrl":"https://e.huawei.com/en/talent/learning/#/home"},
      {"id":"wireless","name":{"ar":"الاتصالات اللاسلكية","en":"Wireless","tr":"Kablosuz"},"officialUrl":"https://e.huawei.com/en/talent/learning/#/home"},
      {"id":"security","name":{"ar":"الأمن","en":"Security","tr":"Güvenlik"},"officialUrl":"https://e.huawei.com/en/talent/learning/#/home"},
      {"id":"access","name":{"ar":"الوصول","en":"Access","tr":"Erişim"},"officialUrl":"https://e.huawei.com/en/talent/learning/#/home"},
      {"id":"project-management","name":{"ar":"إدارة المشاريع","en":"Project Management","tr":"Proje Yönetimi"},"officialUrl":"https://e.huawei.com/en/talent/learning/#/home"}
    ]
  }
});

  function cloneField(field){
    return {id:String(field&&field.id||''),name:{...(field&&field.name||{})},officialUrl:String(field&&field.officialUrl||'')};
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

  function applyToData(data){
    if(!data||!Array.isArray(data.platforms))return data;
    return {...data,platforms:data.platforms.map(platform=>{
      if(!platform||!hasPlatform(platform.id))return platform;
      return {...platform,fields:forPlatform(platform.id)};
    })};
  }

  function install(loader){
    if(!loader||typeof loader.loadSiteData!=='function'||loader.__platformCategoriesInstalled)return false;
    const original=loader.loadSiteData.bind(loader);
    loader.loadSiteData=async function(...args){return applyToData(await original(...args))};
    Object.defineProperty(loader,'__platformCategoriesInstalled',{value:true,configurable:false,enumerable:false,writable:false});
    return true;
  }

  if(typeof globalThis!=='undefined'&&globalThis.DataLoader)install(globalThis.DataLoader);

  return {forPlatform,sourceForPlatform,hasPlatform,applyToData,install};
});
