const ranks=["A","K","Q","J","T","9","8","7","6","5","4","3","2"];
const rfi=[
  {id:"rfi_utg",label:"RFI - UTG",type:"rfi"},{id:"rfi_hj",label:"RFI - HJ",type:"rfi"},{id:"rfi_co",label:"RFI - CO",type:"rfi"},{id:"rfi_btn",label:"RFI - BTN",type:"rfi"},{id:"rfi_sb",label:"RFI - SB",type:"rfi"}
];
const vs=[
  ["vs_hj_utg","HJ vs UTG R"],["vs_co_utg","CO vs UTG R"],["vs_btn_utg","BTN vs UTG R"],["vs_sb_utg","SB vs UTG R"],["vs_bb_utg","BB vs UTG R"],
  ["vs_co_hj","CO vs HJ R"],["vs_btn_hj","BTN vs HJ R"],["vs_sb_hj","SB vs HJ R"],["vs_bb_hj","BB vs HJ R"],["vs_btn_co","BTN vs CO R"],
  ["vs_sb_co","SB vs CO R"],["vs_bb_co","BB vs CO R"],["blind_sb_btn","SB vs BTN R"],["blind_bb_btn","BB vs BTN R"],["blind_bb_sb","BB vs SB R"]
].map(([id,label])=>({id,label,type:"vs"}));
const threebet=[
  ["3bet_utg_hj","UTG vs HJ 3bet"],["3bet_utg_co","UTG vs CO 3bet"],["3bet_utg_btn","UTG vs BTN 3bet"],["3bet_utg_sb","UTG vs SB 3bet"],["3bet_utg_bb","UTG vs BB 3bet"],
  ["3bet_hj_co","HJ vs CO 3bet"],["3bet_hj_btn","HJ vs BTN 3bet"],["3bet_hj_sb","HJ vs SB 3bet"],["3bet_hj_bb","HJ vs BB 3bet"],["3bet_co_btn","CO vs BTN 3bet"],
  ["3bet_co_sb","CO vs SB 3bet"],["3bet_co_bb","CO vs BB 3bet"],["3bet_btn_sb","BTN vs SB 3bet"],["3bet_btn_bb","BTN vs BB 3bet"],["3bet_sb_bb","SB vs BB 3bet"]
].map(([id,label])=>({id,label,type:"threebet"}));
const all=[...rfi,...vs,...threebet];
const $=id=>document.getElementById(id);
let charts={};
let selected=all.find(s=>s.id==="3bet_utg_sb")||all[0];
function makeButton(s){const b=document.createElement("button");b.type="button";b.className=`situation-button ${s.type}`;b.textContent=s.label;b.dataset.id=s.id;b.title=s.label;b.setAttribute("aria-pressed","false");b.addEventListener("click",()=>selectSituation(s));return b;}
function renderButtons(){for(const [id,items] of [["rfiButtons",rfi],["vsButtons",vs],["threeBetButtons",threebet]])$(id).replaceChildren(...items.map(makeButton));}
function handAt(row,col){if(row===col)return ranks[row]+ranks[col];if(row<col)return ranks[row]+ranks[col]+"s";return ranks[col]+ranks[row]+"o";}
function makeHands(){const fragment=document.createDocumentFragment();const data=charts[selected.id]||{};for(let r=0;r<13;r++){for(let c=0;c<13;c++){const hand=handAt(r,c);const action=data[hand]||"F";const cls=action==="R"?"raise":action==="C"?"call":"fold";const cell=document.createElement("div");cell.className=`hand-cell ${cls}`;cell.textContent=hand;cell.title=hand;cell.setAttribute("role","gridcell");cell.setAttribute("aria-label",hand);fragment.appendChild(cell);}}$("handMatrix").replaceChildren(fragment);}
function selectSituation(s){selected=s;document.querySelectorAll(".situation-button").forEach(b=>{const active=b.dataset.id===s.id;b.classList.toggle("active",active);b.setAttribute("aria-pressed",String(active));});$("selectedTitle").textContent=s.label;makeHands();}
async function loadChartData(){try{const r=await fetch("charts.json");if(!r.ok)throw new Error("No charts");const d=await r.json();charts=d;}catch(e){charts={};}selectSituation(selected);}
renderButtons();selectSituation(selected);loadChartData();
