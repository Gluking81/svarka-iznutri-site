// Only publicly corroborated model attributes; this is NOT a live seller inventory.
import {VDS_CATEGORIES,VDS_ITEMS} from "./toolkit_vds_offers.mjs";
import {consumableRef} from "./toolkit_consumables.mjs";
export {VDS_CATEGORIES};
export const VDS_VERIFIED_DATE="25.10.2026";
export const VERIFIED_MODELS=Object.freeze({
  overman160:Object.freeze({brand:"AuroraPRO",sku:"7213710",title:"AuroraPRO OVERMAN 160 (MOSFET)",
    url:"https://aurora-online.ru/catalog/welding/invertornie_poluavtomati/4950/",
    modes:["mig","fcaw"],power:"single",
    description:"MIG/MAG, 230 В; производитель указывает поддержку самозащитной проволоки при соблюдении условий. Диапазон проволоки 0,6–1,0 мм.",
    caution:"Подтвердите тип проволоки, полярность и комплектацию; указанный ток не гарантирует сварку любой толщины."}),
  svarogMig:Object.freeze({brand:"Сварог",sku:"00000095727",title:"Сварог REAL MIG 200 (N24002N)",
    url:"https://svarog-rf.ru/products/real-mig-200n",
    modes:["mig","fcaw","mma"],power:"single",
    description:"MIG/MAG, порошковая проволока, MMA; 220 В, одна фаза. Для сравнения возможностей аппарата.",
    caution:"В выгрузке Ozon карточка готова к продаже, но это не подтверждает складскую доступность."}),
  svarogSmartMig:Object.freeze({brand:"Сварог",sku:"00000098556",title:"Сварог REAL SMART MIG 200 (N2A5)",
    url:"https://svarog-rf.ru/products/real-smart-mig-200",
    modes:["mig","fcaw","mma","tig_dc"],power:"single",
    description:"MIG/MAG, MMA и TIG DC; 220 В. TIG-горелка не входит в базовый комплект. В Ozon найден отдельный набор с проволокой.",
    caution:"Артикул производителя относится к базовой модели, а Ozon offer_id с суффиксом — к набору; состав требуется проверить."}),
  svarogArc200:Object.freeze({brand:"Сварог",sku:"00000102344",title:"Сварог REAL ARC 200 (Z2K6)",
    url:"https://svarog-rf.ru/products/real-arc-200-z2k6",
    modes:["mma"],power:"single",
    description:"Однофазный источник 220 В для MMA покрытым электродом. Не является MIG/MAG-полуавтоматом.",
    caution:"Электроды подбираются по марке стали, покрытию, полярности и паспорту аппарата."}),
  svarogArc220:Object.freeze({brand:"Сварог",sku:"00000102299",title:"Сварог REAL ARC 220 (Z2K7)",
    url:"https://svarog-rf.ru/products/real-arc-220-z2k7",
    modes:["mma"],power:"single",
    description:"Однофазный аппарат 220 В для MMA. Сравнивайте возможности и требования к электродам.",
    caution:"Не предназначен для MIG/MAG и не является готовой технологией ответственных соединений."}),
  auroraSystem:Object.freeze({brand:"АВРОРА",sku:"7332249",title:"АВРОРА Система 200 AC/DC ПУЛЬС",
    url:"https://aurora-online.ru/catalog/welding/tig_svarka/40673/",
    modes:["tig_ac","tig_dc","mma"],power:"single",
    description:"TIG AC/DC, 230 В; режим AC — один из необходимых признаков для обычной TIG-сварки алюминия.",
    caution:"Присадку, газ, горелку и аксессуары уточняют по сплаву и комплектации."}),
  auroraInterTig:Object.freeze({brand:"AuroraPRO",sku:"7310052",title:"AuroraPRO INTER TIG 200 AC/DC PULSE",
    url:"https://aurora-online.ru/catalog/welding/tig_svarka/4152/",
    modes:["tig_ac","tig_dc","mma"],power:"single",
    description:"TIG AC/DC 230 В и MMA. В Ozon есть карточка базовой модели.",
    caution:"Перед заказом проверьте фактическую комплектацию и конкретную ревизию."}),
  esabRogue:Object.freeze({brand:"ESAB",sku:"0700500214C",title:"ESAB Rogue ET 230iP AC/DC",
    url:"https://vdsperm.ru/esab/show/0700500214c/",
    modes:["tig_ac","tig_dc","mma"],power:"single",
    description:"Карточка ВДС подтверждает TIG AC/DC; горелка по её описанию приобретается отдельно.",
    caution:"Не путать код товара ВДС 0700500214C с другими ревизиями/артикулами Rogue. Наличие у продавца требует повторной проверки."})
});
const ref=(key,why)=>{const m=VERIFIED_MODELS[key];return {kind:"model",brand:m.brand,sku:m.sku,title:m.title,url:m.url,description:m.description,why,caution:m.caution}};
const cat=(key,why)=>({...VDS_CATEGORIES[key],why});
const wire=(why)=>({...VDS_ITEMS.steel08,why});
export function recommendVdsMaterials(form,process){
  if(!process?.valid||!process.choices?.length)
    return {allowed:false,items:[],reason:"Для неизвестного металла или покрытия, опасной подготовки либо ответственного соединения товарный список не строится: нужна технологическая проверка.",checklist:[]};
  const {metal,place,gas,power}=form;
  const t=Number(form.thickness),items=[],checklist=[];
  const isSingle=power!=="three"; // unknown power: only show examples, request supply check.
  if(metal==="steel"){
    if(gas==="yes"&&place==="indoors"){
      if(isSingle&&t<=6){
        items.push(ref("overman160","MIG/MAG для бытового сценария — проверенная производителем функция; нагрузку и параметры сверить отдельно."));
        items.push(ref("svarogMig","Альтернативная модель другого бренда с подтверждённым MIG/MAG."));
        items.push(ref("svarogSmartMig","Другой вариант сравнения режимов MIG/MAG и MMA; набор на Ozon отличается от базового аппарата."));
      }else{
        items.push(cat("mig","Для трёхфазной сети или большой толщины не назначаем универсальную модель без проверки требуемого тока и ПВ."));
      }
      items.push(wire("Один из примеров сплошной стальной проволоки для работы с газом; диаметр 0,8 мм НЕ назначается по толщине."));
      items.push(consumableRef("svarogTorch15","???????????? ?????????????? MIG/MAG, ???????? ?????????????? ???? ???????????????? ???? ??????????; ?????????????? ???????????? ?? ???????????????????? ????????????????."));
      items.push(consumableRef("svarogTip08","???????????????????? ?????????????????????? ?????? ?????????????????? 0,8 ????; ?????????????????? ?????????????????? ?? ???????????????????? ??????????????."));
      checklist.push("Для проволоки проверить защитный газ, тип катушки, ролики и допуск конкретного полуавтомата.");
    }else{
      if(isSingle&&t<=6){
        items.push(ref("overman160","В паспорте производителя прямо указана возможность FCAW-S при подходящей самозащитной проволоке."));
        items.push(ref("svarogMig","У производителя указана сварка порошковой проволокой; уточнить её самозащитный тип и полярность."));
        if(t>=2)items.push(ref("svarogArc200","MMA без газового баллона — отдельный способ, а не настройка MIG."));
      }else{
        items.push(cat("mma","Для большой толщины или неизвестного питания требуется индивидуальная проверка источника и технологии."));
      }
      items.push(consumableRef("auroraFlux08","???????????? ???????????????????????? ?????????????????? ?????? ???????????????? ?????????????? ??? ???? ?????????????????? ???????????? ???????????????? MIG/MAG ??????????????????."));
      items.push(cat("wire","Нужна именно самозащитная FCAW-S, а не обычная сплошная проволока Св-08Г2С."));
      checklist.push("Для работы без баллона уточните полярность, допустимую FCAW-S и вентиляцию; на улице учитывайте ветер.");
    }
  }else if(metal==="stainless"){
    if(isSingle&&gas==="yes"&&place==="indoors"&&t<=6){
      items.push(ref("svarogSmartMig","У модели заявлен TIG DC, но для нержавейки отдельно проверяют присадку и газ."));
      items.push(ref("esabRogue","TIG DC предусмотрен; необходимы подходящий сплаву присадочный металл и защита."));
    }
    items.push(cat("material","Сначала точная марка нержавейки и требования к шву, затем подбор присадки."));
    checklist.push("Не используйте проволоку для углеродистой стали как автоматическую замену нержавеющей.");
  }else if(metal==="aluminum"){
    if(isSingle&&gas==="yes"&&place==="indoors"&&t<=6){
      items.push(ref("auroraSystem","Модель с подтверждённым TIG AC; не обещает сварку любого сплава и толщины."));
      items.push(ref("auroraInterTig","Альтернатива AuroraPRO с TIG AC/DC."));
      items.push(ref("esabRogue","Для сравнения ESAB с TIG AC/DC; комплектность и ревизия требуют проверки."));
    }
    items.push(cat("material","Для алюминия важна точная марка сплава (например, не универсальная ER5356)."));
    checklist.push("Для TIG алюминия проверить AC, аргон, горелку, вольфрам и подходящую сплаву присадку.");
  }
  if(power==="unknown")checklist.push("Уточните сеть 220–230 В или 380–400 В перед выбором оборудования.");
  if(power==="three")checklist.push("Не показываем однофазную модель как подходящую для трёхфазного подключения без проверки сети.");
  for(const i of items.filter(x=>x.kind==="model"))checklist.push(i.brand+": "+i.caution);
  return {allowed:items.length>0,items:items.slice(0,6),checklist,
    reason:"Модели — проверенные по публичным описаниям производителя примеры для сравнения, НЕ проверенное наличие у ВДС. Точные цены, остатки и SKU набора не подставляются автоматически."};
}
