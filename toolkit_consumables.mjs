// Reference-only, independently sourced consumables. Not a stock feed or confirmed VDS listing.
export const VERIFIED_CONSUMABLES=Object.freeze({
  auroraFlux08:Object.freeze({
    kind:"material",brand:"Aurora",sku:"9239777",
    title:"АВРОРА E71T-GS, 0,8 мм, 1 кг — NO GAS",
    url:"https://aurora-online.ru/catalog/welding/Aksessuarii/40970/",
    description:"Самозащитная порошковая проволока для чёрной стали; катушка D100. Производитель указывает код 9239777.",
    caution:"Перед покупкой проверьте FCAW-S у аппарата, полярность по катушке, совместимость ролика и катушки. Это описание производителя, не подтверждённый остаток ВДС."
  }),
  svarogTorch15:Object.freeze({
    kind:"material",brand:"Сварог",sku:"ICT2099",
    title:"Сварог TECH MS 15, 4 м — сварочная горелка",
    url:"https://svarog-rf.ru/products/tech-ms-15",
    description:"Горелка MIG/MAG длиной 4 м с евроразъёмом; производитель указывает код ICT2099.",
    caution:"Проверяйте разъём и допустимую нагрузку по своему аппарату. Не считать автоматически совместимой со всеми MIG/MAG."
  }),
  svarogTip08:Object.freeze({
    kind:"material",brand:"Сварог",sku:"ICU0004-08",
    title:"Сварог наконечник E-Cu M6×28, 0,8 мм",
    url:"https://svarog-rf.ru/products/m6x28-e-cu",
    description:"Каталожный типоразмер наконечника для MIG/MAG, стальная проволока 0,8 мм; модель ICU0004-08.",
    caution:"Точно сверить резьбу M6, длину 28 мм, диаметр проволоки и держатель наконечника. Не путать артикул модели с упаковочным кодом продавца."
  })
});
export function consumableRef(key,why){
  const c=VERIFIED_CONSUMABLES[key];
  if(!c)throw Error("Unknown consumable reference");
  return {...c,why};
}
