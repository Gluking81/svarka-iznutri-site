import { recommendProcess,estimateConsumable } from "/toolkit_logic.mjs";

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
    if(result.related){
      const p=document.createElement("p");const a=node("a","Почитать связанный разбор →");a.href=result.related;p.append(a);output.append(p);
    }
  };
  form.addEventListener("input",update);
  form.addEventListener("change",update);
  form.addEventListener("submit",(e)=>{e.preventDefault();update();output.focus();});
  update();
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
  };
  form.addEventListener("input",update);
  form.addEventListener("change",()=>{adjustFields();update();});
  form.addEventListener("submit",e=>{e.preventDefault();adjustFields();update();output.focus();});
  adjustFields();update();
}
setupProcess();setupConsumable();
