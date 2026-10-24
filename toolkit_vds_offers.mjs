// Public, manually verified VDS listings. No live price, stock or product guarantees.
// Verified URLs + listed dimensions: 2026-10-24. Used ONLY after educational-process gate.
export const VDS_VERIFIED_DATE="24.10.2026";
export const VDS_ITEMS=Object.freeze({
  steel08:Object.freeze({kind:"product",sku:"2322084600",title:"ESAB ОК ПРО 51С — проволока 0,8 мм, 5 кг",url:"https://vdsperm.ru/esab/show/2322084600/",description:"Сплошная омеднённая проволока для MIG/MAG по углеродистой стали; катушка S200. Проверить газ, тракт подачи и диапазон аппарата.",type:"wire",metal:"steel"}),
  steel10:Object.freeze({kind:"product",sku:"2323104600",title:"ESAB Св-08Г2С — проволока 1,0 мм, 5 кг",url:"https://vdsperm.ru/esab/show/2323104600/",description:"Сплошная омеднённая проволока MIG/MAG; упаковка 5 кг. Диаметр не назначается по толщине автоматически.",type:"wire",metal:"steel"}),
  steel12:Object.freeze({kind:"product",sku:"2323124600",title:"ESAB Св-08Г2С — проволока 1,2 мм, 5 кг",url:"https://vdsperm.ru/esab/show/2323124600/",description:"Пример другого диаметра стальной проволоки. Проверить совместимость с подающим устройством, положением сварки и задачей.",type:"wire",metal:"steel"}),
  aluminumTig:Object.freeze({kind:"product",sku:"0700500214C",title:"ESAB Rogue ET 230iP AC/DC — TIG AC/DC",url:"https://vdsperm.ru/esab/show/0700500214c/",description:"В карточке подтверждены TIG AC/DC, питание 220 В. Горелка приобретается отдельно; присадку и газ подбирают по сплаву и технологии.",type:"machine",metal:"aluminum"}),
  industrialMig:Object.freeze({kind:"product",sku:"0700020001",title:"ESAB Fabricator EM400i — промышленный MIG/MAG",url:"https://vdsperm.ru/esab/show/0700020001/",description:"Промышленный трёхфазный источник; требует отдельного подающего устройства, кабелей и оснастки. Поставка и состав комплекта уточняются.",type:"machine",metal:"steel"})
});
export const VDS_CATEGORIES=Object.freeze({
 mig:Object.freeze({kind:"category",title:"Полуавтоматы MIG/MAG в каталоге ВДС",url:"https://vdsperm.ru/esab/cat/poluavtomaty/",description:"Выбирать конкретный источник по сети, ПВ, материалу и поддерживаемым режимам; раздел не доказывает совместимость всех моделей."}),
 wire:Object.freeze({kind:"category",title:"Сварочная проволока ВДС",url:"https://vdsperm.ru/esab/cat/svarochnaya-provoloka/",description:"Подобрать класс, диаметр, газ и тип катушки; не вся проволока подходит для безгазовой сварки."}),
 mma:Object.freeze({kind:"category",title:"Электроды MMA в каталоге ВДС",url:"https://vdsperm.ru/esab/cat/ehlektrody/",description:"Сверить марку стали, классификацию электрода, покрытие, допустимую полярность и аппарат."}),
 tig:Object.freeze({kind:"category",title:"Аргонодуговые аппараты TIG в каталоге ВДС",url:"https://vdsperm.ru/esab/cat/argonniki/",description:"Проверить DC/AC: обычный TIG DC не заменяет AC при сварке алюминия."}),
 consumables:Object.freeze({kind:"category",title:"Горелки и расходные части ВДС",url:"https://vdsperm.ru/esab/cat/raskhodniki-i-zapchasti/",description:"Проверить ролик, наконечник, канал, горелку и разъёмы по конкретной модели."}),
 material:Object.freeze({kind:"category",title:"Сварочные материалы ВДС",url:"https://vdsperm.ru/esab/cat/svarochnye-materialy/",description:"Присадку выбирают по точной марке сплава и технологии, а не только по названию металла."})
});
const item=(key,why)=>({...VDS_ITEMS[key],why});
const cat=(key,why)=>({...VDS_CATEGORIES[key],why});
export function recommendVdsMaterials(form,process){
  if(!process?.valid||!process.choices?.length)return {allowed:false,reason:"Коммерческий подбор не показан: сначала подтвердите материал, удалите опасные покрытия или согласуйте технологию ответственного шва.",items:[],checklist:[]};
  const {metal,gas,place,purpose}=form;
  const t=Number(form.thickness);
  const power=form.power||"unknown";
  const items=[],checklist=[];
  if(metal==="steel"){
    if(gas==="yes"&&place==="indoors"){
      items.push(cat("mig","Оборудование для MIG/MAG — сначала проверьте сеть, ПВ и список режимов."));
      const wire=t<=3?"steel08":t<=6?"steel10":"steel12";
      items.push(item(wire,"Пример позиции стальной проволоки в подходящей категории, НЕ установленный расчётом оптимальный диаметр."));
      if(power==="three"&&t>6) items.push(item("industrialMig","Пример промышленного трёхфазного источника, а не готовый комплект."));
      items.push(cat("consumables","Канал, ролик, наконечник и горелка под конкретную катушку/аппарат."));
      checklist.push("Определить газ C1/M21 по документации проволоки и аппарата.","Проверить катушку S200/BS300 и диаметр проволоки: пример товара не гарантирует работу на вашем аппарате.");
    }else{
      items.push(cat("mma","Для стали без газового баллона — рассмотреть MMA при допустимой задаче, электродах и источнике."));
      items.push(cat("wire","Для FCAW-S найти именно самозащитную порошковую проволоку; обычная Св-08Г2С без газа не подходит."));
      checklist.push("В режиме FCAW-S подтвердить самозащитный тип проволоки и полярность по её паспорту; проверить поддержку аппарата.","Для работы с газом на ветру организовать защиту рабочего места.");
    }
  }else if(metal==="stainless"){
    items.push(cat("material","Нужна точная марка нержавейки: например, 304/316/321 потребуют проверки соответствующего присадочного металла."));
    items.push(cat("tig","При TIG с газом в помещении подтвердить режим DC, горелку и газовую защиту."));
    items.push(cat("wire","При MIG/MAG — проволоку под конкретную марку стали и разрешённую газовую смесь."));
    checklist.push("Карточку снятой с производства 308LSi как доступную позицию не рекомендуем.","Уточнить требования к стойкости к коррозии и обратной защите корня.");
  }else if(metal==="aluminum"){
    items.push(item("aluminumTig","Проверенный пример TIG-источника с AC, но не автоматический выбор по толщине."));
    items.push(cat("material","Присадка к алюминиевому сплаву — по точной марке и условиям работы."));
    items.push(cat("consumables","Уточнить TIG-горелку (не входит в комплект Rogue ET 230iP), газ, вольфрам и необходимые принадлежности."));
    checklist.push("Уточнить серию алюминиевого сплава и подходящую присадку.","При MIG алюминия проверить механизм подачи, горелку, канал и аргон.");
  }
  if(power==="unknown")checklist.push("Уточнить сеть питания перед выбором аппарата.");
  if(power==="single"&&items.some(x=>x.sku==="0700020001"))throw Error("Invalid three-phase suggestion for single phase");
  return {allowed:items.length>0,items:items.slice(0,5),checklist,
    reason:"Это редакционные примеры из открытого каталога ООО «ВДС», а не подтверждение соответствия конкретному проекту, наличия или цены."};
}
