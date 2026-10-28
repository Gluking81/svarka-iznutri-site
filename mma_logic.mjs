// E18/E19 local-only prototype; verified catalog data do not imply product stock or offer.
import {VDS_PRODUCTS,getVdsProduct} from "./vds_electrodes.mjs";
export {VDS_PRODUCTS,getVdsProduct};
export const SOURCES = Object.freeze({
  esab: "https://esab.com/ae/mea_en/products-solutions/product/filler-metals/mild-steel/stick-electrodes-smaw/ok-46-00/",
  svarog: "https://svarog-rf.ru/files/documents/re_real_smart_arc_200_z28303_real_smart_arc_220_z28403_int.pdf"
});
const ELECTRODES = Object.freeze([
  Object.freeze({diameter:2.5, min:60, max:100, length:350, label:"2,5 мм", use:"Для аккуратной отработки шва на стали 3–4 мм; режим проверяют на образце.", source:"ESAB OK 46.00"}),
  Object.freeze({diameter:3.2, min:80, max:150, length:350, label:"3,2 мм", use:"Альтернатива для подходящих соединений 3–4 мм, если хватает тока и ПВ аппарата.", source:"ESAB OK 46.00"})
]);
export const JOBS = Object.freeze({
  gate: "Рама ворот или калитки",
  profile: "Каркас из профильной трубы",
  angle: "Уголок или ремонт кронштейна",
  practice: "Учебный шов на обрезке",
  hinge: "Петля ворот или нагруженное крепление"
});
export const DEFECTS = Object.freeze({
  sticking: {
    title:"Электрод прилипает",
    signs:"Дуга плохо зажигается, электрод прихватывает к металлу при попытке вести шов.",
    checks:[
      "Обесточив оборудование, проверьте зажим обратного кабеля: он должен надёжно контактировать с очищенным металлом.",
      "Проверьте маркировку, состояние и условия хранения электродов. Не используйте отсыревшие электроды без инструкции по их восстановлению.",
      "Сверьте выбранный ток с паспортом именно вашего электрода и возможностями аппарата. Не увеличивайте ток бесконтрольно.",
      "Для пробы используйте подходящий чистый обрезок, проверьте технику поджига и удержания короткой устойчивой дуги."
    ],
    stop:"Если электрод продолжает прилипать при корректной подготовке или аппарат выдаёт ошибку — прекратите работу и обратитесь к сервису."
  },
  pores:{
    title:"Поры в шве",
    signs:"На поверхности и/или после зачистки видны отверстия и полости.",
    checks:[
      "Очистите металл от влаги, масла, ржавчины и загрязнений по допустимой технологии.",
      "Уточните сухость, целостность покрытия и условия хранения электрода по паспорту марки.",
      "Проверьте длину дуги, стабильность ведения и режим относительно рекомендаций производителя.",
      "Если дефект повторяется, не закрывайте его вторым валиком без выяснения причины и контроля соединения."
    ],
    stop:"Поры в нагруженном соединении — повод для квалифицированной оценки; по фотографии нельзя подтвердить прочность."
  },
  burnthrough:{
    title:"Прожог металла",
    signs:"Кромка расплавляется чрезмерно, образуется отверстие.",
    checks:[
      "Уточните реальную толщину стенки, зазор и подгонку деталей, особенно у тонкой профтрубы.",
      "Проверьте, не слишком ли большой ток, диаметр электрода и время задержки по сравнению с технологией.",
      "Отработайте короткие соединения на безопасном образце и избегайте перегрева, соблюдая применимую технологию.",
      "На очень тонком листе рассмотрите другой разрешённый процесс (например, MIG/MAG), если MMA слишком трудно контролировать."
    ],
    stop:"Не продолжайте сваривать ответственную деталь после прожога без пересмотра технологии и оценки повреждения."
  },
  slag:{
    title:"Шлаковые включения",
    signs:"После снятия шлака обнаруживаются вытянутые полости или включения в шве.",
    checks:[
      "Перед следующим проходом полностью удалите шлак штатным безопасным способом после остывания по инструкции.",
      "Проверьте форму разделки и доступ электрода к корню шва: узкая канавка может препятствовать удалению шлака.",
      "Сопоставьте ток, скорость движения, угол электрода и число проходов с технологией.",
      "Не перекрывайте выявленные включения следующим швом без устранения причины."
    ],
    stop:"Для нагруженных швов требуется предусмотренный контроль качества; одной зачистки недостаточно."
  },
  undercut:{
    title:"Подрез у кромки",
    signs:"Вдоль кромки шва появляется углубление в основном металле.",
    checks:[
      "Проверьте соответствие диаметра и тока паспорту электрода и фактическому положению шва.",
      "Оцените скорость движения, угол электрода и время задержки возле кромки.",
      "Сделайте безопасную пробу на аналогичном ненужном металле, изменяя только один параметр за раз."
    ],
    stop:"Подрез нельзя считать только косметическим дефектом, особенно в нагруженной детали."
  },
  spatter:{
    title:"Сильные брызги",
    signs:"Вокруг шва образуется много крупных брызг, дуга нестабильна.",
    checks:[
      "Проверьте сухость электрода, чистоту металла и контакт обратного кабеля.",
      "Уточните род тока и полярность по маркировке именно этой пачки электродов.",
      "Оцените длину дуги и ток только в рамках проверенного диапазона конкретного электрода."
    ],
    stop:"Нестабильная дуга и перегрев кабелей — повод прекратить работу и проверить подключение."
  }
});

const n = (x) => x === "" || x === null || x === undefined ? NaN : Number(x);
export function evaluateSelection(v={}){
  const job=String(v.job||"gate"), material=String(v.material||"carbon");
  const coating=String(v.coating||"clean"),position=String(v.position||"flat");
  const duty=String(v.duty||"review"),electrode=String(v.electrode||"vds-ok46r-30");
  const thickness=n(v.thickness),amp=n(v.machineAmps);
  const findings=[];
  if(!Object.hasOwn(JOBS,job)||!["carbon","stainless","aluminum","unknown"].includes(material)
    ||!["clean","paint","zinc","unknown"].includes(coating)
    ||!["flat","vertical","overhead"].includes(position)
    ||!["review","noncritical","loaded"].includes(duty)
    ||!["ok46","unknown","other",...VDS_PRODUCTS.map(x=>x.id)].includes(electrode)
    ||!Number.isFinite(thickness)||thickness<0.5||thickness>30
    ||(v.machineAmps!==""&&v.machineAmps!==undefined&&(!Number.isFinite(amp)||amp<20||amp>1000))){
    return {status:"invalid",title:"Нужно уточнить исходные данные",summary:"Толщина 0,5–30 мм, паспортный ток аппарата 20–1000 А или пустое поле.",rows:[],checks:[],notes:[],sources:[]};
  }
  findings.push("Перед началом очистить заготовку и проверить зажим обратного кабеля, вентиляцию, СИЗ и пожарную безопасность.");
  findings.push("Сверить режим MMA, допустимый диаметр электрода и продолжительность включения (ПВ) именно вашего аппарата.");
  const stop=[];
  if(material!=="carbon")stop.push("Прототип содержит проверенную таблицу только для обычной углеродистой стали; для другой или неизвестной марки не назначаем электрод и ток.");
  if(coating!=="clean")stop.push("Покрытие или его состав не подтверждены. Не сваривать оцинковку, окрашенные и неизвестные покрытия без оценки выделений и безопасной технологии подготовки.");
  if(duty==="loaded"||job==="hinge")stop.push("Нагруженные петли, несущие и ответственные узлы требуют проекта/технологии и контроля. Справочный диапазон не заменяет расчёт прочности.");
  if(position!=="flat")stop.push("Подтверждённые ориентиры для текущего сценария относятся к нижнему положению. Для вертикального или потолочного положения не переносим числовые режимы.");
  if(electrode==="unknown"||electrode==="other")stop.push("Нет паспорта конкретной выбранной марки электрода. Значения ESAB OK 46.00 нельзя переносить на другие электроды.");
  if(thickness<3||thickness>4)stop.push("Этот локальный числовой сценарий проверен только для учебного примера 3–4 мм. Для другой толщины подготовим отдельную подтверждённую модель.");
  if(stop.length){
    return {status:"hold",title:"Сначала уточните технологию",summary:"Диаметр электрода и ток не назначены — указаны ограничения, которые нужно снять до сварки.",rows:[],checks:findings,notes:stop,sources:[{name:"ESAB OK 46.00 — данные электрода",url:SOURCES.esab},{name:"Сварог — справочная таблица для MMA",url:SOURCES.svarog}]};
  }
  const item=getVdsProduct(electrode);
  if(item && (item.diameter<2.5 || item.diameter>3.2)){
    return {status:"hold",title:"Диаметр вне проверенного сценария",summary:"Ø"+String(item.diameter).replace(".",",")+" мм показан в каталоге, но для учебного примера ворот со стенкой 3–4 мм его применимость здесь не подтверждена.",rows:[],checks:findings,notes:["Подтвердите размер и конструкцию шва, инструкцию аппарата и пригодность этого электрода для конкретной работы."],sources:[{name:"Карточка ВДС · арт. "+item.sku,url:item.url}]};
  }
  if(item && (item.min===null || item.max===null)){
    return {status:"hold",title:"Марка есть в каталоге, но ток не подтверждён",summary:item.name+" Ø"+item.diameter+" мм, пачка "+item.packKg+" кг. Для этого артикула числовой режим отсутствует; амперы другой марки не подставляем.",rows:[],checks:findings,notes:[item.evidence,"Проверить заводскую пачку и спецификацию электрода, затем ПВ аппарата; не переносить режим МР-3 или OK 46.00."],sources:[{name:"Публичная карточка ВДС · арт. "+item.sku,url:item.url},{name:"Сварог, общие рекомендации по MMA",url:SOURCES.svarog}]};
  }
  const rows=(item?[{...item,label:"Ø"+String(item.diameter).replace(".",",")+" мм · "+item.name,use:item.detail,source:"Карточка артикула "+item.sku}]:ELECTRODES).map(x=>{
    let availability="Сверьте пределы аппарата и ПВ";
    if(Number.isFinite(amp)){
      if(amp<x.min)availability="Паспортный минимум электрода выше указанного максимума аппарата — не подходит для этого расчёта";
      else if(amp<x.max)availability="Аппарат перекрывает лишь часть паспортного диапазона — режим без проверки не подтверждён";
      else availability="Максимум по паспорту достаточен для диапазона; ПВ и допустимые электроды проверяются отдельно";
    }
    return {...x,availability};
  });
  findings.push(item
    ? "Сверить точный артикул "+item.sku+" и допустимую полярность по пачке этого электрода и паспорту аппарата. Не переносить полярность и режим между марками."
    : "Сверить упаковку именно ESAB OK 46.00: допускаются AC, DC+ и DC−, но реальную полярность выбирать по инструкции электродов и аппарата, а не по универсальной схеме.");
  findings.push("Провести пробу на ненужном обрезке того же металла при безопасных условиях; не применять общую таблицу как WPS для готовых ворот.");
  const notes=[item ? item.evidence+" Источник — публичный каталог ВДС. Это диапазон для ориентира, а не WPS или подтверждение наличия товара." : "Это справочные паспортные интервалы ESAB OK 46.00, а не точка настройки аппарата и не сертификат прочности шва.",
    "Рама ворот и калитки может испытывать нагрузки; особенно внимательно проверяйте узлы навесов, замки и петли. Для них общих рекомендаций недостаточно."];
  if(!Number.isFinite(amp))notes.push("Максимальный MMA-ток аппарата не указан, поэтому совместимость по току и ПВ не проверена.");
  else notes.push("Указан лишь максимум MMA-тока; без паспортной кривой ПВ и данных о допустимом электроде режим всё равно не подтверждён.");
  return {status:"guide",title:item ? "Для проверки: "+item.name+", "+String(item.diameter).replace(".",",")+" мм" : "Для проверки: ESAB OK 46.00, сталь 3–4 мм",
    summary:item ? "Реальный артикул ВДС "+item.sku+" · упаковка "+String(item.packKg).replace(".",",")+" кг. Сначала сверяйте пригодность именно вашей конструкции и аппарата." : "Рассмотрите 2,5 мм для более контролируемой работы или 3,2 мм при подходящем аппарате и соединении.",
    rows,checks:findings,notes,sources:[
      ...(item?[{name:"Каталог ВДС · арт. "+item.sku+" · коммерческая ссылка",url:item.url}]:[{name:"ESAB OK 46.00, официальные диапазоны и полярность",url:SOURCES.esab}]),
      {name:"Сварог REAL SMART ARC, раздел 10.6 (нижнее положение)",url:SOURCES.svarog}
    ]};
}
export function estimateMmaDeposit(v={}){
  const joint=String(v.joint||"fillet"),length=n(v.length),leg=n(v.leg),extra=n(v.extra||0),reserve=n(v.reserve||0);
  const rodNet=n(v.rodNet),verified=Boolean(v.verified);
  if(joint!=="fillet")return {valid:false,reason:"Для стыкового и V-шва в прототипе нет подтверждённой геометрии. Расчёт пока только для углового шва."};
  if(!Number.isFinite(length)||length<=0||length>1000||!Number.isFinite(leg)||leg<0.5||leg>20
     ||!Number.isFinite(extra)||extra<0||extra>30||!Number.isFinite(reserve)||reserve<0||reserve>50){
    return {valid:false,reason:"Укажите суммарную длину швов 0,1–1000 м, проектный катет 0,5–20 мм, надбавку 0–30% и запас 0–50%."};
  }
  // cross-section mm² × length m × density g/cm³ / 1000 = kg
  const area=leg*leg/2*(1+extra/100);
  const metalKg=area*length*7.85/1000;
  const metalWithReserveKg=metalKg*(1+reserve/100);
  let rods=null,rodsReason="Количество и массу пачек электродов не рассчитываем без подтверждённой массы реально наплавленного металла одним электродом с учётом огарка.";
  if(verified && Number.isFinite(rodNet) && rodNet>=1 && rodNet<=300){
    rods=Math.ceil(metalWithReserveKg*1000/rodNet);
    rodsReason="Количество округлено вверх по ВВЕДЁННОЙ пользователем проверенной чистой наплавке одного электрода. Это не заводской норматив расхода.";
  }
  return {valid:true,areaMm2:area,metalKg,metalWithReserveKg,rods,rodsReason,
    note:"Катет — проектный входной параметр, а не рекомендация калькулятора. Масса — геометрия металла шва, НЕ вес электродов в упаковке."};
}
/** Product-specific purchasing model. All examples are geometrical and advisory, not WPS. */
export function estimateMmaPurchase({metalWithReserveKg,electrodeId,selection}={}){
  const required=Number(metalWithReserveKg);
  const item=getVdsProduct(String(electrodeId||""));
  if(!item)return {valid:false,status:"no-product",reason:"Выберите точный артикул электродов из проверенного каталога ВДС.",options:[]};
  if(!Number.isFinite(required)||required<=0||required>2000)return {valid:false,status:"invalid",reason:"Укажите положительную расчётную массу наплавленного металла (не массу упаковки).",options:[]};
  if(selection && (evaluateSelection(selection).status!=="guide" || evaluateSelection({...selection,electrode:item.id}).status!=="guide"))return {valid:false,status:"unsafe",reason:"Для этих исходных условий не подтверждена применимость выбранных электродов; подсказка о покупке заблокирована. Сначала устраните замечания во вкладке подбора.",options:[]};
  const matches=VDS_PRODUCTS.filter(x=>x.name===item.name && x.diameter===item.diameter)
    .sort((a,b)=>a.packKg-b.packKg);
  const options=matches.map(x=>{
    if(!(x.depositedKgPerKg>0&&x.depositedKgPerKg<=1)){
      return {id:x.id,sku:x.sku,name:x.name,diameter:x.diameter,packKg:x.packKg,url:x.url,
        verified:false,reason:"Норматив расхода не подтверждён или противоречив. "+x.depositionEvidence};
    }
    const electrodeKg=required/x.depositedKgPerKg;
    const packs=Math.ceil((electrodeKg-1e-12)/x.packKg);
    const sticks=x.sticksPerKgDeposit>0?Math.ceil(required*x.sticksPerKgDeposit-1e-12):null;
    return {id:x.id,sku:x.sku,name:x.name,diameter:x.diameter,packKg:x.packKg,url:x.url,
      verified:true,depositedKgPerKg:x.depositedKgPerKg,sticksPerKgDeposit:x.sticksPerKgDeposit,
      estimatedElectrodeKg:electrodeKg,packs,totalPackKg:packs*x.packKg,sticks,
      sourceNote:x.depositionEvidence,
      reason:"Расход рассчитан по конкретной карточке ВДС и не учитывает непредусмотренные переделки. Цена и наличие не проверялись."};
  });
  const selected=options.find(x=>x.id===item.id);
  return {valid:Boolean(selected?.verified),status:selected?.verified?"estimated":"no-yield",
    selectedId:item.id,requiredDepositedKg:required,options,
    reason:selected?.verified?"Расчёт закупки по данным для выбранного артикула, а не подтверждённая технология сварки.":"Для выбранного артикула расход не рассчитан: "+item.depositionEvidence};
}
export function diagnoseDefect(key){
  return DEFECTS[key] ?? {title:"Выберите симптом",signs:"",checks:[],stop:"Без симптома нельзя рекомендовать изменение тока."};
}
