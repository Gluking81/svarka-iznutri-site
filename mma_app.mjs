import {evaluateSelection,estimateMmaDeposit,estimateMmaPurchase,diagnoseDefect,SOURCES,VDS_PRODUCTS} from "./mma_logic.mjs";

const byId=id=>document.getElementById(id);
const el=(tag,value,cls)=>{const n=document.createElement(tag); if(value!==undefined)n.textContent=String(value); if(cls)n.className=cls;return n;};
const data=form=>Object.fromEntries(new FormData(form).entries());
const fmt=(n,d=2)=>new Intl.NumberFormat("ru-RU",{maximumFractionDigits:d,minimumFractionDigits:d}).format(n);
function title(box,headline,status){
  const badge=el("span",status==="guide"?"Справочный подбор":status==="hold"?"Требуется уточнение":"Проверьте данные","state "+status);
  box.append(badge,el("h2",headline));
}
function list(box,label,items,warning=false){
  if(!items?.length)return;
  box.append(el("h3",label));
  const l=document.createElement("ol");
  for(const item of items){const li=el("li",item);l.append(li);}
  if(warning)l.className="warn-list";
  box.append(l);
}
function note(box,value,danger=false){box.append(el("p",value,danger?"warning":"note"));}
function sourceLinks(box,sources){
  if(!sources?.length)return;
  const div=el("div",undefined,"sources");div.append(el("h3","Проверенные источники"));
  for(const src of sources){const a=el("a",src.name);a.href=src.url;a.target="_blank";a.rel="noopener noreferrer";div.append(a);}
  box.append(div);
}
function renderSelection(){
  const form=byId("mma-selection"),box=byId("mma-selection-result"),v=data(form);
  const out=evaluateSelection(v);box.replaceChildren();title(box,out.title,out.status);renderCatalog();
  box.append(el("p",out.summary,"summary"));
  for(const option of out.rows){
    const card=el("section",undefined,"fact");
    card.append(el("strong",option.label+" · "+option.min+"–"+option.max+" А"));
    card.append(el("p",option.use),el("p",option.availability,"result-meta"));
    if(option.packKg)card.append(el("p","Артикул "+option.sku+" · пачка "+String(option.packKg).replace(".",",")+" кг · данные из конкретной карточки ВДС.","result-meta"));
    box.append(card);
  }
  if(out.notes?.length){
    for(const n of out.notes)note(box,n,out.status!=="guide"||n.includes("нагрузки")||n.includes("аппарата не указан"));
  }
  list(box,"Что проверить до реальной сварки",out.checks);
  sourceLinks(box,out.sources);
}
function renderCatalog(){
  const wrap=byId("vds-product-grid");
  if(!wrap)return;
  const selected=byId("electrode").value;
  wrap.replaceChildren();
  for(const item of VDS_PRODUCTS){
    const card=el("article",undefined,"catalog-item");
    if(item.id===selected)card.classList.add("catalog-item-selected");
    const head=el("h3",item.name+" · "+String(item.diameter).replace(".",",")+" мм");
    card.append(head,el("p","Арт. "+item.sku+" · "+String(item.packKg).replace(".",",")+" кг · "+item.coating,"result-meta"));
    card.append(el("p",item.detail));
    const note=item.min===null?"Ток: нет проверенного диапазона для артикула":("Ток: "+item.min+"–"+item.max+" А, по карточке артикула");
    card.append(el("p",note,item.min===null?"warning":"note"));
    const sellerStatus=item.ozonSellerSnapshot?.exactOfferMatch
      ?"Ozon Seller ВДС: точная привязка артикула найдена 28.10.2026. Это не подтверждение цены или наличия."
      :"Ozon Seller ВДС: 28.10.2026 точной привязки артикула не найдено. Это не означает снятия электрода с производства.";
    card.append(el("p",sellerStatus,"result-meta"));
    const link=el("a","Описание товара у ВДС ↗");
    link.href=item.url;link.target="_blank";link.rel="nofollow sponsored noopener noreferrer";
    link.dataset.track="product_click";link.dataset.productSource="vds";
    card.append(link);
    if(item.ozonMatch?.sellerVerified && item.ozonMatch?.brandDiameterPackVerified){
      const ozon=el("a","Ozon: карточка у продавца ВДС ↗");ozon.href=item.ozonMatch.url;
      ozon.rel="nofollow sponsored noopener noreferrer";ozon.target="_blank";
      ozon.dataset.track="product_click";ozon.dataset.productSource="ozon";
      card.append(ozon,el("p","В Seller API подтверждён артикул продавца и привязка к SKU этой карточки. Заводской артикул в публичном описании Ozon отдельно не показан; наличие не гарантировано.","result-meta"));
    }
    wrap.append(card);
  }
}
function renderDefect(){
  const form=byId("mma-defect"),box=byId("mma-defect-result");
  const out=diagnoseDefect(form.elements.namedItem("defect").value);
  box.replaceChildren();title(box,out.title,"guide");
  if(out.signs)box.append(el("p",out.signs,"summary"));
  list(box,"Порядок безопасных проверок",out.checks);
  if(out.stop)note(box,out.stop,true);
  sourceLinks(box,[{name:"Руководство Сварог, MMA и диагностика",url:SOURCES.svarog}]);
}
function renderConsumption(){
  const form=byId("mma-consumption"),box=byId("mma-consumption-result"),values=data(form);
  values.verified=byId("verified").checked;
  const result=estimateMmaDeposit(values);box.replaceChildren();
  if(!result.valid){title(box,"Нужно уточнить геометрию","hold");note(box,result.reason,true);return;}
  title(box,"Расчёт массы металла шва","guide");
  const stats=el("div",undefined,"stat-row");
  for(const [key,value] of [
    ["Сечение шва",fmt(result.areaMm2,2)+" мм²"],
    ["Металл в шве",fmt(result.metalKg,3)+" кг"],
    ["Металл с запасом",fmt(result.metalWithReserveKg,3)+" кг"],
    ["Число электродов по своему измерению",result.rods===null?"Не введено":String(result.rods)+" шт."]
  ]){
    const card=el("div",undefined,"stat");card.append(el("span",key),el("strong",value));stats.append(card);
  }
  box.append(stats);
  note(box,result.note);
  note(box,result.rodsReason,result.rods===null);
  box.append(el("p","Формула: (катет × катет / 2) × общая длина швов × 7,85 / 1000 с поправкой на форму и запас. Не определяет нужный размер шва.","result-meta"));
  const selected=values.electrodeId;
  const selection=data(byId("mma-selection"));
  const purchase=estimateMmaPurchase({metalWithReserveKg:result.metalWithReserveKg,electrodeId:selected,selection});
  const container=el("section",undefined,"mma-purchase-box");
  container.append(el("h3","Сколько пачек по конкретному артикулу ВДС?"));
  container.append(el("p","Коммерческие ссылки ведут к предложениям ООО «ВДС», с которым профессионально связан автор. «Сварка изнутри» — независимый медиа-проект. Цены и текущее наличие не подтверждаются; Ozon-ссылки показываем только при проверенном продавце и совпадении марки, диаметра и пачки.","result-meta"));
  if(purchase.status==="unsafe"){
    note(container,purchase.reason,true);
  }else{
    if(!purchase.valid)note(container,purchase.reason,true);
    if(purchase.options?.length){
      for(const option of purchase.options){
        const card=el("article",undefined,"fact");
        card.append(el("strong",option.name+" · Ø"+String(option.diameter).replace(".",",")+" мм · "+String(option.packKg).replace(".",",")+" кг"));
        card.append(el("p","Артикул: "+option.sku,"result-meta"));
        if(option.verified){
          card.append(el("p","Ориентировочно израсходуется "+fmt(option.estimatedElectrodeKg,3)+" кг электродов; купить "+option.packs+" пачк. × "+String(option.packKg).replace(".",",")+" кг (всего "+fmt(option.totalPackKg,2)+" кг)."));
          if(option.sticks!==null)card.append(el("p","Теоретически "+option.sticks+" шт. по нормативу конкретного артикула.","result-meta"));
          card.append(el("p",option.sourceNote,"result-meta"));
        }else{
          note(card,option.reason,true);
        }
        if(option.id===purchase.selectedId)card.classList.add("purchase-selected");
        const a=el("a","Посмотреть артикул в каталоге ВДС ↗");a.href=option.url;a.rel="nofollow sponsored noopener noreferrer";a.target="_blank";a.dataset.track="product_click";a.dataset.productSource="vds";card.append(a);
        const matching=VDS_PRODUCTS.find(x=>x.id===option.id);
        if(matching?.ozonMatch?.sellerVerified && matching.ozonMatch?.brandDiameterPackVerified){
          const ozon=el("a","Посмотреть на Ozon у продавца ВДС ↗");ozon.href=matching.ozonMatch.url;
          ozon.target="_blank";ozon.rel="nofollow sponsored noopener noreferrer";
          ozon.dataset.track="product_click";ozon.dataset.productSource="ozon";
          card.append(ozon,el("p","Seller API ВДС сопоставил артикул продавца "+option.sku+" с SKU этой карточки Ozon; заводской код в публичном описании отдельно не показан. Наличие не гарантировано.","result-meta"));
        }
        container.append(card);
      }
    }
  }
  container.append(el("p","Параметр «Запас» уже включён в массу металла для закупки. Прихватки, огарки сверх нормативных данных и переделки учитывайте отдельно; размер катета задаёт проект, а не этот сервис.","result-meta"));
  box.append(container);
}
function initTabs(){
  const tabs=[...document.querySelectorAll('[role="tab"]')];
  const activate=(tab,focus=true)=>{
    for(const item of tabs){
      const active=item===tab;
      item.setAttribute("aria-selected",String(active));item.tabIndex=active?0:-1;
      byId(item.getAttribute("aria-controls")).hidden=!active;
    }
    if(focus)tab.focus();
  };
  for(const tab of tabs){
    tab.addEventListener("click",()=>activate(tab,false));
    tab.addEventListener("keydown",event=>{
      if(!["ArrowRight","ArrowLeft","Home","End"].includes(event.key))return;
      event.preventDefault();
      let i=tabs.indexOf(tab);
      if(event.key==="Home")i=0;
      else if(event.key==="End")i=tabs.length-1;
      else i=(i+(event.key==="ArrowRight"?1:tabs.length-1))%tabs.length;
      activate(tabs[i]);
    });
  }
}
function init(){
  initTabs();
  byId("mma-selection").addEventListener("input",renderSelection);
  byId("mma-selection").addEventListener("change",renderSelection);
  byId("mma-selection").addEventListener("submit",e=>{e.preventDefault();renderSelection();byId("mma-selection-result").focus();});
  byId("mma-defect").addEventListener("change",renderDefect);
  byId("mma-defect").addEventListener("submit",e=>{e.preventDefault();renderDefect();byId("mma-defect-result").focus();});
  byId("mma-consumption").addEventListener("input",renderConsumption);
  byId("mma-consumption").addEventListener("change",renderConsumption);
  byId("mma-consumption").addEventListener("submit",e=>{e.preventDefault();renderConsumption();byId("mma-consumption-result").focus();});
  byId("example").addEventListener("click",()=>{
    byId("joint").value="fillet";byId("length").value="4";byId("leg").value="3";byId("extra").value="0";byId("reserve").value="15";
    byId("rodNet").value="";byId("verified").checked=false;
    renderConsumption();byId("mma-consumption-result").focus();
  });
  byId("mma-selection").addEventListener("input",renderConsumption);
  byId("mma-selection").addEventListener("change",renderConsumption);
  renderSelection();renderDefect();renderConsumption();
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});
else init();
