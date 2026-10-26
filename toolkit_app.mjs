import { recommendProcess,estimateConsumable } from "/toolkit_logic.mjs";
import { recommendVdsMaterials,VDS_VERIFIED_DATE,VDS_CATEGORIES } from "/toolkit_multibrand_offers.mjs";
import { estimatePurchasableOptions } from "/toolkit_wire_purchase.mjs";

const fmt=(n,d=2)=>new Intl.NumberFormat("ru-RU",{maximumFractionDigits:d,minimumFractionDigits:d}).format(n);
const formData=(form)=>Object.fromEntries(new FormData(form).entries());
function node(tag,text){const n=document.createElement(tag);n.textContent=text;return n;}
function section(parent,title,lines){
  parent.append(node("h3",title));
  const list=document.createElement("ul");
  for(const entry of lines){const li=node("li",entry);list.append(li);}
  parent.append(list);
}
function setupProcess(){
  const form=document.getElementById("tool-process");
  if(!form)return;
  const output=document.getElementById("process-result");
  const update=()=>{
    const result=recommendProcess(formData(form));
    output.replaceChildren(node("h2",result.title));
    if(result.thicknessGroup)output.append(node("p",result.thicknessGroup+" — только для справочной группировки."));
    if(result.choices.length)section(output,"Что имеет смысл рассмотреть",result.choices);
    section(output,"Обязательные проверки",result.checks);
    const caution=node("p",result.caution);caution.className="tool-caution";output.append(caution);
    const offerPlan=recommendVdsMaterials(formData(form),result);
    const vendor=document.createElement("section");
    vendor.className="tool-vds";
    vendor.setAttribute("aria-label","Предложения магазина ВДС");
    const disclosure=node("p","Подборка товаров и разделов ООО «ВДС» — коммерческие ссылки. «Сварка изнутри» — независимый авторский проект, а не сайт ВДС.");
    disclosure.textContent="\u042d\u0442\u043e \u043d\u0435\u0437\u0430\u0432\u0438\u0441\u0438\u043c\u043e\u0435 \u044d\u043a\u0441\u043f\u0435\u0440\u0442\u043d\u043e\u0435 \u0441\u0440\u0430\u0432\u043d\u0435\u043d\u0438\u0435. \u0421\u0441\u044b\u043b\u043a\u0438 \u043d\u0430 \u0445\u0430\u0440\u0430\u043a\u0442\u0435\u0440\u0438\u0441\u0442\u0438\u043a\u0438 \u043f\u0440\u043e\u0438\u0437\u0432\u043e\u0434\u0438\u0442\u0435\u043b\u0435\u0439 \u043e\u0442\u0434\u0435\u043b\u0435\u043d\u044b \u043e\u0442 \u043a\u043e\u043c\u043c\u0435\u0440\u0447\u0435\u0441\u043a\u0438\u0445 \u043f\u0440\u0435\u0434\u043b\u043e\u0436\u0435\u043d\u0438\u0439 \u041e\u041e\u041e \u00ab\u0412\u0414\u0421\u00bb. \u0426\u0435\u043d\u044b \u0438 \u043e\u0441\u0442\u0430\u0442\u043a\u0438 \u0437\u0434\u0435\u0441\u044c \u043d\u0435 \u043f\u0440\u043e\u0432\u0435\u0440\u044f\u044e\u0442\u0441\u044f.";
    disclosure.className="tool-vds-disclosure";vendor.append(disclosure);
    if(offerPlan.allowed){
      vendor.append(node("h3","\u041c\u043e\u0434\u0435\u043b\u0438 \u0440\u0430\u0437\u043d\u044b\u0445 \u0431\u0440\u0435\u043d\u0434\u043e\u0432 \u0434\u043b\u044f \u0441\u0440\u0430\u0432\u043d\u0435\u043d\u0438\u044f"));
      const intro=node("p","Не список гарантированно совместимых товаров: категории и примеры подобраны по вашему сценарию, конкретную модель и присадку нужно подтвердить по паспорту. Цены и остатки не выводятся.");
      intro.textContent="\u042d\u0442\u043e \u043c\u043e\u0434\u0435\u043b\u0438 \u0434\u043b\u044f \u0441\u0440\u0430\u0432\u043d\u0435\u043d\u0438\u044f \u043f\u043e \u043f\u043e\u0434\u0442\u0432\u0435\u0440\u0436\u0434\u0451\u043d\u043d\u044b\u043c \u0440\u0435\u0436\u0438\u043c\u0430\u043c, \u0430 \u043d\u0435 \u0433\u0430\u0440\u0430\u043d\u0442\u0438\u0440\u043e\u0432\u0430\u043d\u043d\u043e \u0441\u043e\u0432\u043c\u0435\u0441\u0442\u0438\u043c\u044b\u0435 \u0441 \u0437\u0430\u0434\u0430\u0447\u0435\u0439 \u0442\u043e\u0432\u0430\u0440\u044b \u0432 \u043d\u0430\u043b\u0438\u0447\u0438\u0438. \u041f\u0440\u043e\u0432\u0435\u0440\u044c\u0442\u0435 \u043f\u0430\u0441\u043f\u043e\u0440\u0442 \u0430\u043f\u043f\u0430\u0440\u0430\u0442\u0430, \u043a\u043e\u043c\u043f\u043b\u0435\u043a\u0442\u043d\u043e\u0441\u0442\u044c \u0438 \u0440\u0435\u0430\u043b\u044c\u043d\u044b\u0435 \u043f\u0440\u0435\u0434\u043b\u043e\u0436\u0435\u043d\u0438\u044f \u043f\u0440\u043e\u0434\u0430\u0432\u0446\u0430.";
      vendor.append(intro);
      const list=document.createElement("div");list.className="tool-vds-grid";
      for(const offer of offerPlan.items){
        const card=document.createElement("article");card.className="tool-vds-card";
        const type=node("span",offer.kind==="product"?"Карточка товара · артикул "+offer.sku:"Раздел каталога");
        if(offer.kind==="model")type.textContent="\u041c\u043e\u0434\u0435\u043b\u044c \u0434\u043b\u044f \u0441\u0440\u0430\u0432\u043d\u0435\u043d\u0438\u044f \u00b7 "+offer.brand+" \u00b7 \u0430\u0440\u0442. "+offer.sku;
        if(offer.kind==="material")type.textContent="\u0420\u0430\u0441\u0445\u043e\u0434\u043d\u0438\u043a \u0434\u043b\u044f \u043f\u0440\u043e\u0432\u0435\u0440\u043a\u0438 \u00b7 "+offer.brand+" \u00b7 \u0430\u0440\u0442. "+offer.sku;
        type.className="tool-vds-type";
        const title=node("h4",offer.title);
        const desc=node("p",offer.description);
        const why=node("p",offer.why);why.className="tool-vds-why";
        const a=node("a",offer.kind==="product"?"Посмотреть товар у ВДС ↗":"Открыть каталог ВДС ↗");
        if(offer.kind==="model")a.textContent=offer.url.includes("vdsperm.ru")?"\u041e\u043f\u0438\u0441\u0430\u043d\u0438\u0435 \u043c\u043e\u0434\u0435\u043b\u0438 \u0443 \u0412\u0414\u0421 \u2197":"\u0425\u0430\u0440\u0430\u043a\u0442\u0435\u0440\u0438\u0441\u0442\u0438\u043a\u0438 \u043f\u0440\u043e\u0438\u0437\u0432\u043e\u0434\u0438\u0442\u0435\u043b\u044f \u2197";
        if(offer.kind==="material")a.textContent="\u041e\u043f\u0438\u0441\u0430\u043d\u0438\u0435 \u0440\u0430\u0441\u0445\u043e\u0434\u043d\u0438\u043a\u0430 \u0443 \u043f\u0440\u043e\u0438\u0437\u0432\u043e\u0434\u0438\u0442\u0435\u043b\u044f \u2197";
        a.href=offer.url;a.target="_blank";a.rel=offer.url.includes("vdsperm.ru")?"noopener noreferrer sponsored":"noopener noreferrer";
        card.append(type,title,desc,why,a);list.append(card);
      }
      vendor.append(list);
      const seller=node("p","");
      const sellerAnchor=node("a","\u041f\u043e\u0441\u043c\u043e\u0442\u0440\u0435\u0442\u044c \u0432\u0438\u0442\u0440\u0438\u043d\u0443 \u0412\u0414\u0421 \u043d\u0430 Ozon \u2014 \u0443\u0442\u043e\u0447\u043d\u0438\u0442\u044c \u043f\u0440\u0435\u0434\u043b\u043e\u0436\u0435\u043d\u0438\u044f \u2197");
      sellerAnchor.href="https://www.ozon.ru/seller/vds-vse-dlya-svarki/";
      sellerAnchor.target="_blank";sellerAnchor.rel="noopener noreferrer sponsored";
      seller.append(sellerAnchor);vendor.append(seller);
      section(vendor,"Что проверить перед покупкой",offerPlan.checklist);
      const footer=node("p",offerPlan.reason+" Позиции и характеристики сверены по публичному каталогу "+VDS_VERIFIED_DATE+". Наличие, цены и замены проверяются уже у продавца.");
      footer.textContent=offerPlan.reason+" \u041f\u0440\u043e\u0432\u0435\u0440\u043a\u0430 \u043e\u0442\u043a\u0440\u044b\u0442\u044b\u0445 \u043e\u043f\u0438\u0441\u0430\u043d\u0438\u0439: "+VDS_VERIFIED_DATE+". \u041d\u0430\u043b\u0438\u0447\u0438\u0435 \u0438 \u043a\u043e\u043c\u043f\u043b\u0435\u043a\u0442\u0430\u0446\u0438\u044e \u0443\u0442\u043e\u0447\u043d\u044f\u0439\u0442\u0435 \u0443 \u043f\u0440\u043e\u0434\u0430\u0432\u0446\u0430.";
      footer.className="tool-vds-note";vendor.append(footer);
    }else{
      vendor.append(node("h3","Товарный подбор пока недоступен"),node("p",offerPlan.reason));
    }
    output.append(vendor);
    if(result.related){
      const p=document.createElement("p");const a=node("a","Почитать связанный разбор →");a.href=result.related;p.append(a);output.append(p);
    }
  };
  form.addEventListener("input",update);
  form.addEventListener("change",update);
  form.addEventListener("submit",(e)=>{e.preventDefault();update();output.focus();});
  update();
}
function renderWirePurchaseOptions(values,consumption,output){
  const selection=estimatePurchasableOptions({...values,consumableKg:consumption.consumableKg});
  const block=document.createElement("section");
  block.className="tool-vds wire-buy-section";
  block.setAttribute("aria-label","Примеры сварочных материалов и покупка");
  block.append(node("h3","Материалы и упаковки под ваш расчёт"));
  const intro=node("p","\u042d\u0442\u043e \u043a\u0430\u0442\u0430\u043b\u043e\u0433 \u0432\u0430\u0440\u0438\u0430\u043d\u0442\u043e\u0432 \u0434\u043b\u044f \u043f\u0440\u043e\u0432\u0435\u0440\u043a\u0438, \u0430 \u043d\u0435 \u0430\u0432\u0442\u043e\u043c\u0430\u0442\u0438\u0447\u0435\u0441\u043a\u043e\u0435 \u043d\u0430\u0437\u043d\u0430\u0447\u0435\u043d\u0438\u0435 \u043c\u0430\u0440\u043a\u0438 \u0438\u043b\u0438 \u0434\u0438\u0430\u043c\u0435\u0442\u0440\u0430. \u00ab\u0421\u0432\u0430\u0440\u043a\u0430 \u0438\u0437\u043d\u0443\u0442\u0440\u0438\u00bb \u2014 \u043d\u0435\u0437\u0430\u0432\u0438\u0441\u0438\u043c\u044b\u0439 \u043f\u0440\u043e\u0435\u043a\u0442; \u043a\u043e\u043c\u043c\u0435\u0440\u0447\u0435\u0441\u043a\u0430\u044f \u0432\u0438\u0442\u0440\u0438\u043d\u0430 \u0412\u0414\u0421 \u043e\u0431\u043e\u0437\u043d\u0430\u0447\u0435\u043d\u0430 \u043e\u0442\u0434\u0435\u043b\u044c\u043d\u043e.");
  intro.className="tool-vds-disclosure";block.append(intro);
  const caution=node("p",selection.notice);
  caution.className="tool-caution";block.append(caution);
  if(selection.items.length){
    const grid=document.createElement("div");grid.className="tool-vds-grid";
    for(const offer of selection.items){
      const card=document.createElement("article");card.className="tool-vds-card";
      const tag=node("span",offer.brand+" · арт. "+offer.sku);
      tag.className="tool-vds-type";
      const h=node("h4",offer.name);
      const info=node("p","Катушка "+offer.spool+" · "+String(offer.packKg).replace(".",",")+" кг");
      const n=node("p","По введённой массе: ориентир "+offer.packs+" уп. × "+String(offer.packKg).replace(".",",")+" кг (округление вверх).");
      n.className="wire-buy-packs";
      const important=node("p",offer.warning);
      important.className="tool-vds-why";
      const link=node("a",offer.channel==="vds"?"Карточка товара у ВДС ↗":"Описание производителя (наличие не проверено) ↗");
      link.href=offer.url;link.target="_blank";
      link.rel=offer.channel==="vds"?"noopener noreferrer sponsored":"noopener noreferrer";
      card.append(tag,h,info,n,important,link);grid.append(card);
    }
    block.append(grid);
  }else{
    block.append(node("p","Подтверждённых вариантов для этих исходных условий пока нет. Не заменяйте марку расходника другим металлом или процессом сварки."));
  }
  if(selection.category){
    const p=document.createElement("p");
    const a=node("a","Посмотреть раздел сварочных материалов ВДС ↗");
    a.href=selection.category;a.target="_blank";a.rel="noopener noreferrer sponsored";
    p.append(a);block.append(p);
  }
  if(selection.shop){
    const p=document.createElement("p");
    const a=node("a","Проверить предложения магазина ВДС на Ozon ↗");
    a.href=selection.shop;a.target="_blank";a.rel="noopener noreferrer sponsored";
    p.append(a);block.append(p);
  }
  const note=node("p","Количество упаковок — только арифметика по введённому расходу; оно не учитывает размер катушки аппарата, реальные потери и минимальную поставку. Цена и остатки не проверяются.");
  note.className="tool-vds-note";block.append(note);
  output.append(block);
  const guide=node("p","");
  const guideLink=node("a","D100 или D200: как проверить совместимость катушки ↗");
  guideLink.href="/rashodka/katushka-d100-ili-d200/";
  guide.append(guideLink);output.append(guide);
  if(values.wireProcess!=="tig"){
    const partsNote=node("p","");
    const a=node("a","\u041a\u0430\u043a \u043f\u043e\u0434\u043e\u0431\u0440\u0430\u0442\u044c \u0440\u043e\u043b\u0438\u043a, \u043a\u0430\u043d\u0430\u043b \u0433\u043e\u0440\u0435\u043b\u043a\u0438 \u0438 \u043d\u0430\u043a\u043e\u043d\u0435\u0447\u043d\u0438\u043a \u043f\u043e\u0434 \u044d\u0442\u0443 \u043f\u0440\u043e\u0432\u043e\u043b\u043e\u043a\u0443");
    a.href="/rashodka/rolik-kanal-nakonechnik-pod-provoloku/";
    partsNote.append(a);output.append(partsNote);
  }
  if(values.metal==="aluminum"){
    const fillerGuide=node("p","");
    const a=node("a","ER4043 ?????? ER5356 ?????? ????????????????: ?????????????? ?????????????????? ?????????? ?? ???????????????????? ????????????");
    a.href="/rashodka/er4043-ili-er5356-dlya-alyuminiya/";
    fillerGuide.append(a);output.append(fillerGuide);
  }
  if(values.wireProcess==="fcaw"){
    const polarityNote=node("p","");
    const a=node("a","Полярность NO GAS: что проверить перед сваркой ↗");
    a.href="/praktika/polyarnost-poroshkovoy-provoloki-bez-gaza/";
    polarityNote.append(a);output.append(polarityNote);
  }
}

function setupConsumable(){
  const form=document.getElementById("tool-consumable");if(!form)return;
  const output=document.getElementById("consumable-result");
  const joint=form.elements.namedItem("joint");
  const detailFillet=document.getElementById("tool-fillet-fields");
  const detailV=document.getElementById("tool-v-fields");
  const adjustFields=()=>{
    const v=joint.value==="v";detailFillet.hidden=v;detailV.hidden=!v;
    for(const field of detailFillet.querySelectorAll("input"))field.disabled=v;
    for(const field of detailV.querySelectorAll("input"))field.disabled=!v;
  };
  const update=()=>{
    const result=estimateConsumable(formData(form));
    output.replaceChildren();
    if(!result.valid){output.append(node("h2","Уточните геометрию шва"),node("p",result.error));return;}
    output.append(node("h2","Оценка расхода по геометрии"));
    const stats=document.createElement("div");stats.className="tool-stat-grid";
    for(const [label,value] of [
      ["Площадь сечения",fmt(result.areaMm2)+" мм²"],
      ["Масса металла в шве",fmt(result.depositedKg,3)+" кг"],
      ["Ориентир закупки",fmt(result.consumableKg,3)+" кг"]
    ]){
      const cell=document.createElement("div");cell.className="tool-stat";
      cell.append(node("span",label),node("strong",value));stats.append(cell);
    }
    output.append(stats);
    const description=node("p","Расчёт: площадь шва × длина × плотность / 1000; затем поправка на наплавление и запас. Плотность "+fmt(result.density,2)+" г/см³. Учтена прибавка к сечению "+fmt(result.extra,0)+"%, полезный выход "+fmt(result.efficiency,0)+"% и запас "+fmt(result.reserve,0)+"%.");
    output.append(description);
    const warning=node("p","Оценка не определяет требуемый катет, разделку, число проходов, прочность соединения или параметры аппарата. Эти размеры задаются проектом/технологией. Не учитывает прихватки, переходы, остатки на катушке и фактические потери сверх введённых.");
    warning.className="tool-caution";output.append(warning);
    renderWirePurchaseOptions(formData(form),result,output);
  };
  form.addEventListener("input",update);
  form.addEventListener("change",()=>{adjustFields();update();});
  form.addEventListener("submit",e=>{e.preventDefault();adjustFields();update();output.focus();});
  adjustFields();update();
}
setupProcess();setupConsumable();
