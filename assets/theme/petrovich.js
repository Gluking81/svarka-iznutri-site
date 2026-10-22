/* Petrovich v0 — public-site article finder. No private API, no hidden AI calls. */
(() => {
 const launcher=document.getElementById('petrovich-launcher');
 const panel=document.getElementById('petrovich-panel');
 const close=document.getElementById('petrovich-close');
 const thread=document.getElementById('petrovich-thread');
 const form=document.getElementById('petrovich-form');
 const input=document.getElementById('petrovich-question');
 const status=document.getElementById('petrovich-status');
 if(!launcher||!panel||!thread||!form||!input||!status)return;
 let pagefindPromise=null;
 let working=false;
 let returnFocus=null;

 function open(){
   returnFocus=document.activeElement;
   panel.hidden=false;
   launcher.setAttribute('aria-expanded','true');
   input.focus();
 }
 function shut(){
   panel.hidden=true;
   launcher.setAttribute('aria-expanded','false');
   (returnFocus instanceof HTMLElement?returnFocus:launcher).focus();
 }
 launcher.addEventListener('click',()=>panel.hidden?open():shut());
 close.addEventListener('click',shut);
 document.addEventListener('keydown',event=>{
   if(event.key==='Escape'&&!panel.hidden){event.preventDefault();shut();}
 });
 document.querySelectorAll('[data-petrovich-open]').forEach(el=>{
   el.addEventListener('click',event=>{event.preventDefault();open();});
 });
 const bubble=(message,role='bot')=>{
   const block=document.createElement('div');
   block.className='petrovich-bubble petrovich-from-'+(role==='user'?'user':'bot');
   block.textContent=message;
   thread.appendChild(block);
   thread.scrollTop=thread.scrollHeight;
   return block;
 };
 function safeSiteUrl(raw){
   if(typeof raw!=='string')return null;
   try{
     const u=new URL(raw,window.location.origin);
     if(u.origin!==window.location.origin||!u.pathname.startsWith('/'))return null;
     if(/^\/(?:go|media-kit|petrovich|poisk|pagefind)(?:\/|$)/.test(u.pathname))return null;
     return u.pathname+u.search+u.hash;
   }catch{return null;}
 }
 function stripMarkup(text){
   const el=document.createElement('span');
   el.innerHTML=typeof text==='string'?text:'';
   return (el.textContent||'').replace(/\s+/g,' ').trim();
 }
 const editorialDescriptions={"/modeli/avrora-dinamika-2000/": "Досье АВРОРА Динамика 2000: реальные фото аппарата и распаковки, где лежит горелка, механизм подачи, работа без газа и ссылки на руководство.", "/praktika/d2000-provoloka-ryvkami/": "Последовательная проверка подачи проволоки: катушка, ролик, прижим, канал и горелка. Без непроверенных диагнозов для конкретного аппарата.", "/praktika/kabeli-derzhateli-pult-sovmestimost/": "Почему важны сечение и длина сварочного кабеля, разъём и конкретная модель аппарата. Как не ошибиться с пультом.", "/praktika/sinergetika-ili-pulse-mig/": "Разбираем синергетические программы и импульсную MIG/MAG-сварку, ограничения ручной коррекции и пример АВРОРА Динамика 200 АДАПТИВ ПУЛЬС.", "/rashodka/kak-vybrat-svarochnuyu-provoloku/": "С газом и без газа, сплошная и порошковая проволока: как проверить диаметр, катушку, ролик и наконечник до покупки.", "/rashodka/provoloka-08-ili-10/": "Как сравнивать сварочную проволоку 0,8 и 1,0 мм по материалу, работе, оборудованию и доступным расходникам.", "/rashodka/roliki-nakonechniki-provoloka-ryvkami/": "Как выбрать канавку ролика V, U и V с насечкой. Безопасная проверка катушки, прижима, канала и контактного наконечника.", "/razbory/d2000-gorelka-komplekt/": "Как проверить наличие горелки и состав комплекта АВРОРА Динамика 2000 по коробке, документам и фактической поставке.", "/sravneniya/poroshkovaya-ili-co2/": "Практическая рамка сравнения самозащитной порошковой и сплошной проволоки с CO₂ без вымышленных тестов и универсальных победителей.", "/voprosy/chto-vhodit-v-komplekt-svarochnogo-apparata/": "Почему наличие MIG, MMA и TIG в описании не гарантирует все горелки и кабели в коробке. Пошаговая проверка комплектации.", "/voprosy/d2000-bez-gaza/": "Что нужно подтвердить в документации и на конкретном аппарате перед сваркой самозащитной порошковой проволокой без газа.", "/voprosy/esab-savage-a40-komplekt/": "Реальная проверка комплектации сварочной маски ESAB SAVAGE A40: установленная батарейка, защитные стёкла и смысл слова «сменная».", "/voprosy/kak-podobrat-tig-gorelku-lift/": "Семь проверок перед покупкой TIG-горелки: силовой разъём, газ, клапан, кнопка, тип поджига и ограничения TIG DC/AC.", "/voprosy/kak-vybrat-poluavtomat-dlya-garazha/": "Восемь проверок перед покупкой полуавтомата для гаража: материал, газ или NO GAS, питание 220 В, ПВ, MIG/MAG, TIG Lift, комплектация и проволока."};
 async function queryArticles(question){
   if(!pagefindPromise){
     pagefindPromise=import('/pagefind/pagefind.js').then(async module=>{
       await module.init();return module;
     }).catch(e=>{pagefindPromise=null;throw e;});
   }
   const pf=await pagefindPromise;
   const terms=[question];
   // A lengthy natural-language question may fail exact word matching.
   const simple=question.toLowerCase()
     .replace(/[^\p{L}\p{N}\s]/gu,' ')
     .split(/\s+/).filter(x=>x.length>=4)
     .filter(x=>!['можно','почему','какую','какого','сварить','сварка','работает','настроить','какие','когда','делать','подскажите','аппарат','пожалуйста','меня','найти','искать'].includes(x));
   if(simple.length)terms.push(simple.slice(0,3).join(' '));
   let results=[];
   for(const term of [...new Set(terms)]){
     const search=await pf.search(term);
     if(search.results?.length){
       results=search.results.slice(0,6);
       break;
     }
   }
   const prepared=await Promise.all(results.map(r=>r.data()));
   return prepared.filter(r=>safeSiteUrl(r.url)).slice(0,4);
 }
 async function ask(question){
   const q=question.trim();
   if(!q||q.length>220||working)return;
   working=true;
   form.querySelector('button[type=submit]').disabled=true;
   thread.setAttribute('aria-busy','true');
   status.textContent='Ищу подходящие статьи…';
   bubble(q,'user');
   input.value='';
   const wait=bubble('Подбираю материалы по вашему вопросу…');
   try{
     const matches=await queryArticles(q);
     wait.textContent=matches.length?'Нашёл материалы на сайте. Посмотри подходящие статьи:':'Пока нет подходящего материала. Попробуй уточнить модель или выбрать тему в поиске по сайту.';
     status.textContent=matches.length?'Найдено материалов: '+matches.length+'. Открывайте ссылки в результатах.':'Совпадений не найдено. Доступна ссылка на полный поиск.';
     if(!matches.length){
       const link=document.createElement('a');
       link.href='/poisk/';
       link.textContent='Открыть полный поиск по статьям ↗';
       wait.appendChild(document.createElement('br'));
       wait.appendChild(link);
     }
     if(matches.length){
       const list=document.createElement('div');
       list.className='petrovich-results';
       for(const match of matches){
         const href=safeSiteUrl(match.url);
         if(!href)continue;
         const link=document.createElement('a');
         link.className='petrovich-result';
         link.href=href;
         const title=document.createElement('strong');
         title.textContent=stripMarkup(match.meta?.title||match.url).replace(/\s*\|\s*Сварка изнутри.*$/,'');
         const summary=document.createElement('span');
         const rawSummary=editorialDescriptions[href]||stripMarkup(match.meta?.description||match.excerpt||'Открыть материал');
         const shortSummary=rawSummary.length>155
           ?rawSummary.slice(0,155).replace(/\s+\S*$/u,'').trim()+'…'
           :rawSummary;
         summary.textContent=' — '+shortSummary;
         link.append(title,summary);list.appendChild(link);
       }
       wait.appendChild(list);
     }
   }catch{
     status.textContent='Поиск временно недоступен. Доступна ссылка на полный поиск.';
     wait.textContent='Поиск сейчас недоступен. Открой раздел «Поиск по статьям» или попробуй позже.';
     const a=document.createElement('a');
     a.href='/poisk/';a.textContent='Перейти к поиску ↗';
     wait.appendChild(document.createElement('br'));wait.appendChild(a);
   }finally{
     working=false;
     form.querySelector('button[type=submit]').disabled=false;
     thread.setAttribute('aria-busy','false');
     thread.scrollTop=thread.scrollHeight;
     if(!panel.hidden){
       const firstLink=wait.querySelector('a');
       if(firstLink)firstLink.focus();
     }
   }
 }
 form.addEventListener('submit',e=>{e.preventDefault();ask(input.value);});
 document.querySelectorAll('[data-petrovich-question]').forEach(b=>b.addEventListener('click',()=>{
   if(panel.hidden)open();
   ask(b.dataset.petrovichQuestion||'');
 }));
})();
