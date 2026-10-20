/* Petrovich v0 — public-site article finder. No private API, no hidden AI calls. */
(() => {
 const launcher=document.getElementById('petrovich-launcher');
 const panel=document.getElementById('petrovich-panel');
 const close=document.getElementById('petrovich-close');
 const thread=document.getElementById('petrovich-thread');
 const form=document.getElementById('petrovich-form');
 const input=document.getElementById('petrovich-question');
 if(!launcher||!panel||!thread||!form||!input)return;
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
   bubble(q,'user');
   input.value='';
   const wait=bubble('Подбираю материалы по вашему вопросу…');
   try{
     const matches=await queryArticles(q);
     wait.textContent=matches.length?'Нашёл материалы на сайте. Посмотри подходящие статьи:':'Пока нет подходящего материала. Попробуй уточнить модель или выбрать тему в поиске по сайту.';
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
         summary.textContent=stripMarkup(match.excerpt||match.meta?.description||'Открыть материал').slice(0,155);
         link.append(title,summary);list.appendChild(link);
       }
       wait.appendChild(list);
     }
   }catch{
     wait.textContent='Поиск сейчас недоступен. Открой раздел «Поиск по статьям» или попробуй позже.';
     const a=document.createElement('a');
     a.href='/poisk/';a.textContent='Перейти к поиску ↗';
     wait.appendChild(document.createElement('br'));wait.appendChild(a);
   }finally{
     working=false;
     form.querySelector('button[type=submit]').disabled=false;
     thread.scrollTop=thread.scrollHeight;
   }
 }
 form.addEventListener('submit',e=>{e.preventDefault();ask(input.value);});
 document.querySelectorAll('[data-petrovich-question]').forEach(b=>b.addEventListener('click',()=>{
   if(panel.hidden)open();
   ask(b.dataset.petrovichQuestion||'');
 }));
})();
