// Verified public catalogue references; examples only, not a live VDS stock or pricing feed.
// Units are kilograms of consumable wire / filler as specified by producer.
export const WIRE_PURCHASE_CATALOG=Object.freeze([
 {sku:"2322084600",brand:"ESAB",name:"ОК ПРО 51С, 0,8 мм",metal:"steel",process:"mig",diameterMm:0.8,packKg:5,spool:"S200",url:"https://vdsperm.ru/esab/show/2322084600/",channel:"vds",warning:"Сплошная омеднённая проволока. Требует подходящего защитного газа, ролика и наконечника."},
 {sku:"2323104600",brand:"ESAB",name:"Св-08Г2С, 1,0 мм",metal:"steel",process:"mig",diameterMm:1,packKg:5,spool:"S200",url:"https://vdsperm.ru/esab/show/2323104600/",channel:"vds",warning:"Сплошная омеднённая проволока. Сверьте диаметр и газ с паспортом аппарата."},
 {sku:"2323124600",brand:"ESAB",name:"Св-08Г2С, 1,2 мм",metal:"steel",process:"mig",diameterMm:1.2,packKg:5,spool:"S200",url:"https://vdsperm.ru/esab/show/2323124600/",channel:"vds",warning:"Проверьте поддержку диаметра 1,2 мм подающим механизмом; не назначается по толщине автоматически."},
 {sku:"9240987",brand:"Аврора",name:"ER70S-6, 0,8 мм",metal:"steel",process:"mig",diameterMm:0.8,packKg:1,spool:"D100",url:"https://old.aurora-online.ru/catalog/producers/1627/",channel:"manufacturer",warning:"Сплошная омеднённая проволока для MIG/MAG с газом, не для NO GAS."},
 {sku:"9240988",brand:"Аврора",name:"ER70S-6, 0,8 мм",metal:"steel",process:"mig",diameterMm:0.8,packKg:5,spool:"D200",url:"https://old.aurora-online.ru/catalog/producers/1627/",channel:"manufacturer",warning:"Сплошная омеднённая проволока для MIG/MAG с газом. Проверьте катушку D200."},
 {sku:"9240990",brand:"Аврора",name:"ER70S-6, 1,0 мм",metal:"steel",process:"mig",diameterMm:1,packKg:5,spool:"D200",url:"https://old.aurora-online.ru/catalog/producers/1627/",channel:"manufacturer",warning:"Сплошная омеднённая проволока для MIG/MAG с газом, требует подходящего тракта подачи."},
 {sku:"9239776",brand:"Аврора",name:"E71T-GS NO GAS, 0,8 мм",metal:"steel",process:"fcaw",diameterMm:0.8,packKg:0.45,spool:"D100",url:"https://old.aurora-online.ru/catalog/producers/1627/",channel:"manufacturer",warning:"Самозащитная порошковая FCAW-S; полярность по паспорту катушки."},
 {sku:"9239777",brand:"Аврора",name:"E71T-GS NO GAS, 0,8 мм",metal:"steel",process:"fcaw",diameterMm:0.8,packKg:1,spool:"D100",url:"https://aurora-online.ru/catalog/welding/Aksessuarii/40970/",channel:"manufacturer",warning:"Самозащитная порошковая FCAW-S; полярность и поддержку аппарата проверить."},
 {sku:"9239778",brand:"Аврора",name:"E71T-GS NO GAS, 0,8 мм",metal:"steel",process:"fcaw",diameterMm:0.8,packKg:5,spool:"D200",url:"https://old.aurora-online.ru/catalog/producers/1627/",channel:"manufacturer",warning:"Самозащитная порошковая FCAW-S. Проверьте, что аппарат принимает катушку D200."},
 {sku:"9239779",brand:"Аврора",name:"E71T-GS NO GAS, 1,0 мм",metal:"steel",process:"fcaw",diameterMm:1,packKg:1,spool:"D100",url:"https://old.aurora-online.ru/catalog/producers/1627/",channel:"manufacturer",warning:"Самозащитная порошковая FCAW-S; диаметр и полярность по инструкции."},
 {sku:"9240980",brand:"Аврора",name:"ER5356, 1,0 мм",metal:"aluminum",process:"mig",diameterMm:1,packKg:2,spool:"D200",url:"https://old.aurora-online.ru/catalog/producers/1627/",channel:"manufacturer",warning:"Пример для совместимых Al-Mg сплавов. Подтвердите марку сплава и систему подачи алюминия."},
 {sku:"9240981",brand:"Аврора",name:"ER5356, 1,2 мм",metal:"aluminum",process:"mig",diameterMm:1.2,packKg:2,spool:"D200",url:"https://old.aurora-online.ru/catalog/producers/1627/",channel:"manufacturer",warning:"Пример для совместимых Al-Mg сплавов. Не всякий алюминий сваривается ER5356; проверьте сплав."}
]);
const SHOP="https://www.ozon.ru/seller/vds-vse-dlya-svarki/";
const VDS_CATEGORIES=Object.freeze({
 wire:"https://vdsperm.ru/esab/cat/svarochnaya-provoloka/",
 materials:"https://vdsperm.ru/esab/cat/svarochnye-materialy/"
});
const safeNumber=x=>Number.isFinite(Number(x))&&Number(x)>0&&Number(x)<=100000;
export function estimatePurchasableOptions({metal,wireProcess,wireDiameter="any",spoolSize="any",consumableKg}){
 if(!safeNumber(consumableKg))return {valid:false,items:[],notice:"Сначала введите корректную геометрию шва и получите положительный расчёт расхода."};
 if(!["mig","fcaw","tig"].includes(wireProcess))return {valid:false,items:[],notice:"Укажите процесс сварки, чтобы подобрать правильный тип расходника."};
 if(wireProcess==="fcaw"&&metal!=="steel")
  return {valid:true,items:[],notice:"Самозащитная E71T-GS из подборки рассчитана на углеродистую сталь. Для этого металла подтверждённых вариантов NO GAS пока нет; не используйте стальную проволоку по умолчанию.",category:VDS_CATEGORIES.materials,shop:SHOP};
 if(wireProcess==="tig")
  return {valid:true,items:[],notice:"Для TIG нужны присадочные прутки, а не катушки MIG/MAG. Их марка зависит от точного сплава; по одному названию металла безопасно назначить SKU нельзя.",category:VDS_CATEGORIES.materials,shop:SHOP};
 if(metal==="stainless")
  return {valid:true,items:[],notice:"Для нержавейки сначала подтвердите марку (например, 304, 316, 321) и классификацию присадки. Стальную Св-08Г2С или ER5356 предлагать нельзя.",category:VDS_CATEGORIES.wire,shop:SHOP};
 if(!["steel","aluminum"].includes(metal))
  return {valid:true,items:[],notice:"Для этого металла нет подтверждённых моделей присадки.",category:VDS_CATEGORIES.materials,shop:SHOP};
 const filtered=WIRE_PURCHASE_CATALOG.filter(x=>x.metal===metal&&x.process===wireProcess&&(wireDiameter==="any"||String(x.diameterMm)===wireDiameter)&&(spoolSize==="any"||x.spool===spoolSize));
 const items=filtered.map(x=>({...x,packs:Math.ceil(Number(consumableKg)/x.packKg)}))
  .sort((a,b)=>a.packKg-b.packKg||a.brand.localeCompare(b.brand,"ru"));
 const caution=filtered.length===0?"В текущем списке нет проверенной катушки такого диаметра и типа. Проверьте руководство аппарата, посадку и каталог производителя.":metal==="aluminum"?"ER5356 — вариант только для совместимых алюминиевых сплавов: подтвердите марку и систему подачи.":"Сверьте тип проволоки, газ, полярность, диаметр и посадку катушки с инструкциями производителя.";
 return {valid:true,items,notice:caution,category:metal==="aluminum"?VDS_CATEGORIES.materials:VDS_CATEGORIES.wire,shop:SHOP};
}
