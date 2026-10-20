document.addEventListener("DOMContentLoaded", () => {
  const target=document.getElementById("site-search");
  if(!target)return;
  if(typeof PagefindUI!=="function"){
    target.textContent="Поиск временно недоступен. Материалы можно открыть через меню разделов.";
    return;
  }
  const search=new PagefindUI({
    element: "#site-search", showImages:false, showSubResults:false, pageSize:7,
    translations:{
      placeholder:"Например, горелка или проволока",
      zero_results:"Ничего не найдено по запросу [SEARCH_TERM]",
      clear_search:"Очистить поиск"
    }
  });
  document.querySelectorAll("[data-search-term]").forEach(button=>{
    button.addEventListener("click",()=>{
      const input=target.querySelector("input");
      if(!input)return;
      input.value=button.getAttribute("data-search-term")||"";
      input.dispatchEvent(new Event("input",{bubbles:true}));
      input.focus();
    });
  });
});
