const ranks = ["A","K","Q","J","T","9","8","7","6","5","4","3","2"];
const groups = {
  rfi: [
    {id:"rfi_utg",label:"RFI - UTG",hero:"UTG",category:"RFI",type:"rfi",subtitle:"Первый рейз из ранней позиции",copy:"Открывающий рейз, когда все игроки до героя сбросили карты."},
    {id:"rfi_hj",label:"RFI - HJ",hero:"HJ",category:"RFI",type:"rfi",subtitle:"Первый рейз из средней позиции",copy:"Открывающий рейз из HJ, когда до героя не было входа в банк."},
    {id:"rfi_co",label:"RFI - CO",hero:"CO",category:"RFI",type:"rfi",subtitle:"Первый рейз из cutoff",copy:"Открывающий рейз с CO после фолдов предыдущих игроков."},
    {id:"rfi_btn",label:"RFI - BTN",hero:"BTN",category:"RFI",type:"rfi",subtitle:"Первый рейз с баттона",copy:"Открывающий рейз с BTN, если все игроки до героя сбросили."},
    {id:"rfi_sb",label:"RFI - SB",hero:"SB",category:"RFI",type:"rfi",subtitle:"Первый рейз с малого блайнда",copy:"Открывающий рейз с SB против BB после фолдов остальных игроков."}
  ],
  vs: [
    ["vs_hj_utg","HJ vs UTG R","HJ","UTG"],["vs_co_utg","CO vs UTG R","CO","UTG"],["vs_btn_utg","BTN vs UTG R","BTN","UTG"],["vs_sb_utg","SB vs UTG R","SB","UTG"],["vs_bb_utg","BB vs UTG R","BB","UTG"],
    ["vs_co_hj","CO vs HJ R","CO","HJ"],["vs_btn_hj","BTN vs HJ R","BTN","HJ"],["vs_sb_hj","SB vs HJ R","SB","HJ"],["vs_bb_hj","BB vs HJ R","BB","HJ"],
    ["vs_btn_co","BTN vs CO R","BTN","CO"],["vs_sb_co","SB vs CO R","SB","CO"],["vs_bb_co","BB vs CO R","BB","CO"]
  ].map(([id,label,hero,villain])=>({id,label,hero,villain,category:"Vs Open",type:"vs",subtitle:`Защита ${hero} против открытия ${villain}`,copy:`Решение ${hero} против рейза из ${villain}: использовать реальные данные диапазона после загрузки.`})),
  blind: [
    {id:"blind_sb_btn",label:"SB vs BTN R",hero:"SB",villain:"BTN",category:"Blind Defense",type:"blind",subtitle:"Малый блайнд против открытия BTN",copy:"Защита SB против открытия с баттона."},
    {id:"blind_bb_btn",label:"BB vs BTN R",hero:"BB",villain:"BTN",category:"Blind Defense",type:"blind",subtitle:"Большой блайнд против открытия BTN",copy:"Защита BB против открытия с баттона."},
    {id:"blind_bb_sb",label:"BB vs SB R",hero:"BB",villain:"SB",category:"Blind Defense",type:"blind",subtitle:"Большой блайнд против открытия SB",copy:"Защита BB против открытия с малого блайнда."}
  ],
  threebet: [
    ["3bet_utg_hj","UTG vs HJ 3bet","UTG","HJ"],["3bet_utg_co","UTG vs CO 3bet","UTG","CO"],["3bet_utg_btn","UTG vs BTN 3bet","UTG","BTN"],["3bet_utg_sb","UTG vs SB 3bet","UTG","SB"],["3bet_utg_bb","UTG vs BB 3bet","UTG","BB"],
    ["3bet_hj_co","HJ vs CO 3bet","HJ","CO"],["3bet_hj_btn","HJ vs BTN 3bet","HJ","BTN"],["3bet_hj_sb","HJ vs SB 3bet","HJ","SB"],["3bet_hj_bb","HJ vs BB 3bet","HJ","BB"],
    ["3bet_co_btn","CO vs BTN 3bet","CO","BTN"],["3bet_co_sb","CO vs SB 3bet","CO","SB"],["3bet_co_bb","CO vs BB 3bet","CO","BB"],
    ["3bet_btn_sb","BTN vs SB 3bet","BTN","SB"],["3bet_btn_bb","BTN vs BB 3bet","BTN","BB"],["3bet_sb_bb","SB vs BB 3bet","SB","BB"]
  ].map(([id,label,hero,villain])=>({id,label,hero,villain,category:"3-Bet",type:"threebet",subtitle:`3-бет ${hero} против открытия ${villain}`,copy:`Диапазон 3-бета ${hero} против рейза ${villain}; реальные действия появятся после загрузки данных.`}))
};
// Матрица намеренно пустая: сюда должны быть добавлены реальные диапазоны, без выдуманных частот.
let charts = {};
let all = [...groups.rfi,...groups.vs,...groups.blind,...groups.threebet];
let selected = all[0];
const $ = id => document.getElementById(id);
function createButton(s){const b=document.createElement("button");b.className=`situation-button ${s.type}`;b.textContent=s.label;b.dataset.id=s.id;b.type="button";b.addEventListener("click",()=>selectSituation(s));return b;}
function renderButtons(){for(const [container,items] of [["rfiButtons",groups.rfi],["vsButtons",groups.vs],["blindButtons",groups.blind],["threeBetButtons",groups.threebet]]){const node=$(container);node.replaceChildren(...items.map(createButton));}}
function makeHands(){const out=[];for(let r=0;r<13;r++){for(let c=0;c<13;c++){let hand;if(r===c)hand=ranks[r]+ranks[c];else if(r<c)hand=ranks[r]+ranks[c]+"s";else hand=ranks[c]+ranks[r]+"o";const action=(charts[selected.id]||{})[hand]||"";const cell=document.createElement("div");cell.className=`hand-cell ${action?String(action).toLowerCase():"empty"}`;cell.textContent=hand;cell.title=action?`${hand}: ${action}`:`${hand}: нет данных`;cell.setAttribute("role","gridcell");cell.setAttribute("aria-label",cell.title);out.push(cell);}}$("handMatrix").replaceChildren(...out);}
function selectSituation(s){selected=s;document.querySelectorAll(".situation-button").forEach(b=>b.classList.toggle("active",b.dataset.id===s.id));document.querySelectorAll(".catalog-item").forEach(b=>b.classList.toggle("active",b.dataset.id===s.id));$("selectedTitle").textContent=s.label;$("selectedSubtitle").textContent=s.subtitle;$("infoTitle").textContent=s.label;$("infoCopy").textContent=s.copy;$("positionBadge").textContent=s.hero;$("infoCategory").textContent=s.category;$("infoHero").textContent=s.hero;$("infoVillain").textContent=s.villain||"Все до героя сбросили";$("situationId").textContent=s.id;const populated=Object.keys(charts[s.id]||{}).length>0;$("chartStatus").textContent=populated?"Диапазон загружен":"Диапазон не загружен";$("chartStatus").classList.toggle("ready",populated);$("infoData").textContent=populated?"Есть данные":"Не загружены";$("emptyNote").hidden=populated;makeHands();}
function renderCatalog(){const q=$("searchInput").value.trim().toLowerCase();const items=all.filter(s=>`${s.label} ${s.id} ${s.hero} ${s.villain||""} ${s.category}`.toLowerCase().includes(q));$("catalogList").replaceChildren(...items.map(s=>{const b=document.createElement("button");b.type="button";b.className="catalog-item";b.dataset.id=s.id;b.innerHTML=`<span>${escapeHtml(s.label)}</span><small>${escapeHtml(s.id)}</small>`;b.addEventListener("click",()=>{selectSituation(s);$("chartArea").scrollIntoView({behavior:"smooth",block:"start"});});return b;}));$("noResults").hidden=items.length>0;}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
async function loadChartData(){try{const response=await fetch("charts.json");if(response.ok){const data=await response.json();for(const s of all){const candidate=data[s.id];if(candidate&&typeof candidate==="object"&&!Array.isArray(candidate)){const clean={};for(const [hand,action] of Object.entries(candidate)){if(/^(?:[AKQJT98765432]{2}[so]?|[AKQJT98765432]{2})$/.test(hand)&&["R","C","F"].includes(action))clean[hand]=action;}charts[s.id]=clean;}}}}catch(error){/* Opening index.html directly may block fetch; GitHub Pages serves charts.json normally. */}selectSituation(selected);}
renderButtons();renderCatalog();selectSituation(selected);loadChartData();
