/* E13: offline-only MIG/MAG torch checklist. No vendor lookup, no telemetry. */
const form=document.getElementById("torch-check-form");
const result=document.getElementById("torch-check-result");
if(form&&result){
 const boxes=[...form.querySelectorAll('input[name="torch-check"]')];
 const total=boxes.length;
 if(total!==7)throw Error("Unexpected number of required checks");
 form.addEventListener("submit",event=>{
  event.preventDefault();
  const checked=boxes.filter(b=>b.checked).length;
  if(checked<total){
   result.textContent="Подтверждено "+checked+" из "+total+" пунктов. Совместимость горелки НЕ подтверждена: сначала сверьте недостающие сведения по документации и артикулам производителя.";
  }else{
   result.textContent="Проверено "+checked+" из "+total+" пунктов. Это ещё НЕ означает автоматического подтверждения совместимости: окончательное решение требует официальной спецификации и проверки конкретных артикулов.";
  }
  result.focus({preventScroll:true});
 });
}
