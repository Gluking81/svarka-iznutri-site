// Educational guidance and a geometric approximation, not a WPS or machine settings.
export const DENSITIES = Object.freeze({steel:7.85,stainless:7.90,aluminum:2.70});
export const RELATED = Object.freeze({
  steel:"/voprosy/kak-vybrat-poluavtomat-dlya-garazha/",
  stainless:"/rashodka/kak-vybrat-svarochnuyu-provoloku/",
  aluminum:"/voprosy/mig-ili-tig-dlya-alyuminiya/"
});
export function recommendProcess({metal,thickness,place,gas,purpose,coating}){
  const t=Number(thickness);
  if(!["steel","stainless","aluminum","unknown"].includes(metal)||!Number.isFinite(t)||t<0.3||t>100
    ||!["indoors","outside"].includes(place)||!["yes","no"].includes(gas)
    ||!["general","precision","critical"].includes(purpose)
    ||!["clean","paint","zinc","unknown"].includes(coating)) {
    return {valid:false,title:"Проверьте исходные данные",choices:[],checks:["Толщина — от 0,3 до 100 мм; укажите тип металла, место работы и покрытие."],caution:"Параметры сварки не рассчитаны."};
  }
  const checks=["Уточните марку металла и назначение соединения, допустимую технологию, инструкцию конкретного источника и маркировку присадки.",
    "Проверьте защиту зрения и кожи, пожарную безопасность и эффективную вытяжку/вентиляцию."];
  const caution="Это направления для проверки, а не готовая технология: нельзя определять ток, полярность, сварочный газ или допустимую толщину аппарата только по этим полям.";
  if(coating!=="clean"||metal==="unknown"){
    return {valid:true,title:"Нельзя выбирать режим до уточнения материала",choices:[],
      checks:["Сначала определите металл и состав покрытия; не нагревайте неизвестные краски, герметики, оцинковку и другие покрытия без оценки токсичных выделений и допустимой подготовки.",
       ...checks],caution:"Подбор приостановлен: опасное или неизвестное покрытие / неизвестная марка металла. Сначала безопасная оценка и технология."};
  }
  if(purpose==="critical"){
    return {valid:true,title:"Нужна утверждённая технология сварки",choices:[],
      checks:["Для несущих, нагруженных, герметичных и ответственных соединений требуются расчёт конструкции, подходящая WPS/технология, квалификация и контроль.",...checks],
      caution:"Справочный онлайн-подбор не разрешает выполнение ответственного соединения. Не используйте список общих способов вместо проектных требований."};
  }
  const thin=t<=2;
  const veryThick=t>6;
  const choices=[];
  if(metal==="steel"){
    if(gas==="yes"&&place==="indoors"){
      choices.push("MIG/MAG со сплошной стальной проволокой и подходящим защитным газом — распространённое направление для стали.");
      if(thin||purpose==="precision")choices.push("TIG DC с подходящей присадкой и аргоном — рассмотреть для точного, относительно медленного соединения.");
      if(veryThick)choices.push("MMA со стальными электродами подходящего типа — рассмотреть после проверки материала, разделки кромок и техники многопроходной сварки.");
    } else {
      choices.push("Самозащитная порошковая проволока (FCAW-S) — только если конкретные аппарат, расходник и полярность допускают работу без газа.");
      if(!thin)choices.push("MMA — возможная альтернатива при соответствующих электродах и условиях.");
      if(place==="outside"&&gas==="yes")checks.push("Ветер может нарушить газовую защиту MIG/MAG; рабочее место и защиту нужно оценить отдельно.");
      if(thin)checks.push("Для листа до примерно 2 мм сварка самозащитной проволокой требует дополнительной оценки: возможны прожоги, и этот способ не универсально лучший.");
    }
    checks.push("Сверьте тип и диаметр проволоки с роликом, каналом, наконечником; для NO GAS проверьте полярность по маркировке катушки.");
  } else if(metal==="stainless"){
    if(gas==="yes"&&place==="indoors"){
      choices.push("TIG DC с аргоном и подходящей марке нержавеющей стали присадкой — особенно при требовании аккуратного шва.");
      choices.push("MIG/MAG с присадкой для конкретной марки нержавейки и специальной газовой смесью — для подходящего объёма работ.");
      checks.push("Для нержавейки важны марка сплава, присадка, защита обратной стороны при необходимости и защита от загрязнения углеродистой сталью.");
    } else {
      checks.push("Без газовой защиты/на ветру нельзя автоматически назначать TIG или обычный MIG для нержавейки. Возможность специальных электродов MMA определяется маркой и технологией.");
    }
  } else if(metal==="aluminum"){
    if(gas==="yes"&&place==="indoors"){
      choices.push("TIG AC (при подтверждённой поддержке AC) с аргоном и совместимой присадкой — рассмотреть для контролируемой работы.");
      choices.push("MIG с инертной защитой (обычно аргон) и рассчитанными на алюминиевую проволоку подачей и горелкой — альтернатива при подходящей задаче.");
      checks.push("TIG Lift DC сам по себе не подтверждает возможность обычной TIG-сварки алюминия.");
      checks.push("Нужна проверка марки алюминиевого сплава, присадки, оксидной плёнки, роликов, канала, горелки и разрешённых режимов.");
      if(thin)checks.push("Тонкий алюминий особенно чувствителен к тепловложению: никакого универсального обещания «без прожога».");
    }else{
      checks.push("При отсутствии газовой защиты или на открытом ветру универсальную технологию для алюминия предлагать нельзя; нужна подходящая среда и оборудование.");
    }
  }
  if(veryThick)checks.push("Для толщины более 6 мм отдельно оценивайте разделку, число проходов, подогрев при необходимости и ПВ конкретного аппарата; цифровое значение тока здесь не выводится.");
  if(purpose==="precision")checks.push("Точность и внешний вид требуют квалифицированной настройки на образцах, а не только выбора процесса.");
  if(!choices.length)checks.unshift("По выбранным условиям нет универсального решения без дополнительной информации. Измените организацию места или обратитесь к технологу.");
  return {valid:true,title:choices.length?"Какие способы стоит проверить":"Нужна дополнительная проверка условий",choices,checks,caution,thicknessGroup:thin?"Тонкий металл (условно до 2 мм)":veryThick?"Толстый металл (условно более 6 мм)":"Средняя толщина (условно 2–6 мм)",related:RELATED[metal]};
}
export function estimateConsumable({metal,joint,length,leg,thickness,rootGap,rootFace,angle,extra,efficiency,reserve}){
  const density=DENSITIES[metal], L=Number(length), ex=Number(extra), eff=Number(efficiency), res=Number(reserve);
  if(!density||!["fillet","v"].includes(joint)||!Number.isFinite(L)||L<=0||L>10000||
    !Number.isFinite(ex)||ex<0||ex>30||!Number.isFinite(eff)||eff<40||eff>100||
    !Number.isFinite(res)||res<0||res>50) return {valid:false,error:"Проверьте положительную длину, материал, надбавку 0–30%, выход наплавленного металла 40–100% и запас 0–50%."};
  let area=0;
  if(joint==="fillet"){
    const z=Number(leg);
    if(!Number.isFinite(z)||z<0.5||z>60)return {valid:false,error:"Катет углового шва должен быть от 0,5 до 60 мм."};
    area=z*z/2;
  }else{
    const t=Number(thickness),gap=Number(rootGap),face=Number(rootFace),a=Number(angle);
    if(!Number.isFinite(t)||t<1||t>100||!Number.isFinite(gap)||gap<0||gap>20||
      !Number.isFinite(face)||face<0||face>=t||!Number.isFinite(a)||a<20||a>120)
      return {valid:false,error:"Для V-шва: толщина 1–100 мм, зазор 0–20 мм, притупление от 0 до менее толщины, угол 20–120°."};
    area=gap*t+(t-face)**2*Math.tan(a*Math.PI/360);
  }
  const adjustedArea=area*(1+ex/100);
  const depositedKg=adjustedArea*L*density/1000;
  const consumableKg=depositedKg/(eff/100)*(1+res/100);
  if(!Number.isFinite(consumableKg)||consumableKg>100000) return {valid:false,error:"Расчёт вышел за допустимые пределы."};
  return {valid:true,baseAreaMm2:area,areaMm2:adjustedArea,depositedKg,consumableKg,density,efficiency:eff,reserve:res,extra:ex};
}
