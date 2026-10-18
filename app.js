const categories = [
  {name:"Fontanería", icon:"🔧", desc:"Fugas, grifos y tuberías"},
  {name:"Electricidad", icon:"💡", desc:"Instalaciones y averías"},
  {name:"Limpieza", icon:"🧽", desc:"Limpieza de casas y oficinas"},
  {name:"Jardinería", icon:"🌿", desc:"Jardines y mantenimiento"},
  {name:"Pintura", icon:"🖌️", desc:"Pintura interior y exterior"},
  {name:"Reparaciones generales", icon:"🛠️", desc:"Arreglos del hogar"},
  {name:"Armado de muebles", icon:"🪑", desc:"Montaje y ajustes"},
  {name:"Cerrajería", icon:"🔑", desc:"Cerraduras y puertas"}
];
// Estos perfiles son demostrativos. Sustituirlos por perfiles reales con consentimiento.
const demoProviders = [
 {name:"Servicios del Hogar CR",category:"Reparaciones generales",area:"San José",description:"Ejemplo de perfil para reparaciones y mantenimiento general."},
 {name:"Jardines Verdes",category:"Jardinería",area:"Curridabat",description:"Ejemplo de perfil para poda, limpieza y mantenimiento de jardines."},
 {name:"Limpieza Brillante",category:"Limpieza",area:"Gran Área Metropolitana",description:"Ejemplo de perfil para limpieza residencial."}
];
let selectedCategory = "";
const $ = id => document.getElementById(id);
function escapeHTML(value){return String(value).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function renderCategories(){
  $("categories").innerHTML = categories.map(c=>`<button class="category ${selectedCategory===c.name?"active":""}" data-category="${escapeHTML(c.name)}"><span class="emoji">${c.icon}</span><strong>${c.name}</strong><small>${c.desc}</small></button>`).join("");
  document.querySelectorAll("[data-category]").forEach(btn=>btn.addEventListener("click",()=>{selectedCategory=selectedCategory===btn.dataset.category?"":btn.dataset.category;renderCategories();renderProviders();$("profesionales").scrollIntoView({behavior:"smooth"});}));
}
function renderProviders(){
  const query = $("search").value.trim().toLocaleLowerCase("es");
  let all = [...demoProviders];
  try { all = all.concat(JSON.parse(localStorage.getItem("hogarconecta-providers")||"[]")); } catch(e){}
  const filtered=all.filter(p=>(!selectedCategory||p.category===selectedCategory)&&(!query||[p.name,p.category,p.area,p.description].join(" ").toLocaleLowerCase("es").includes(query)));
  $("providers").innerHTML=filtered.length?filtered.map(p=>`<article class="provider"><div class="provider-top"><div class="avatar">${escapeHTML((p.name||"?").slice(0,1).toUpperCase())}</div><div><h3>${escapeHTML(p.name)}</h3><div class="meta">📍 ${escapeHTML(p.area)}</div></div></div><span class="tag">${escapeHTML(p.category)}</span><p>${escapeHTML(p.description||"Contacta para consultar disponibilidad y precios.")}</p><button data-contact="${escapeHTML(p.phone||"")}">Consultar por WhatsApp</button></article>`).join(""):'<p>No encontramos perfiles para esa búsqueda. Prueba otra categoría o vuelve más tarde.</p>';
  document.querySelectorAll("[data-contact]").forEach(btn=>btn.addEventListener("click",()=>{const phone=btn.dataset.contact.replace(/\D/g,"");if(!phone){alert("Este perfil de demostración no tiene un teléfono real. Registra tus propios datos para probar el flujo.");return;}window.open("https://wa.me/"+phone,"_blank","noopener,noreferrer");}));
}
const dialog=$("providerDialog");
function openDialog(){dialog.showModal();}
$("joinTop").addEventListener("click",openDialog);$("joinMain").addEventListener("click",openDialog);$("closeDialog").addEventListener("click",()=>dialog.close());
$("searchBtn").addEventListener("click",()=>{selectedCategory="";renderCategories();renderProviders();$("profesionales").scrollIntoView({behavior:"smooth"});});
$("search").addEventListener("keydown",e=>{if(e.key==="Enter")$("searchBtn").click();});
$("providerForm").addEventListener("submit",e=>{
 e.preventDefault();const data=Object.fromEntries(new FormData(e.currentTarget).entries());
 data.createdAt=new Date().toISOString();
 let saved=[];try{saved=JSON.parse(localStorage.getItem("hogarconecta-providers")||"[]");}catch(err){}
 saved.push(data);
 try{localStorage.setItem("hogarconecta-providers",JSON.stringify(saved));$("formMessage").textContent="Perfil guardado en este navegador. Aún no es público ni se ha enviado a un servidor.";e.currentTarget.reset();renderProviders();}
 catch(err){$("formMessage").textContent="No se pudo guardar en este navegador. Comprueba el almacenamiento disponible.";}
});
$("year").textContent=new Date().getFullYear();
renderCategories();renderProviders();