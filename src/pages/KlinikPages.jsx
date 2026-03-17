import { useState } from 'react';
import AppLayout from '../components/AppLayout';
import Topbar from '../components/Topbar';
import { useToast } from '../hooks/useToast';
import { programs, clients } from '../data/mockData';

// ─── BESLENME PROGRAMLARI ───────────────────────────────
export function Programlar() {
  const toast = useToast();
  const [selected, setSelected] = useState(programs[0]);
  const [showAdd, setShowAdd] = useState(false);
  const [newProg, setNewProg] = useState({ name:'', calories:'', protein:'', carbs:'', fat:'', type:'kilo-verme' });

  const meals = [
    { time:'🌅 Kahvaltı (07:00)', items:['2 yumurta haşlama veya sahanda','1 dilim tam tahıllı ekmek','1 çorba kaşığı zeytinyağı','Söğüş (salatalık, domates, biber)'] },
    { time:'🍎 Ara Öğün (10:30)', items:['1 adet mevsim meyvesi','200 ml yarım yağlı yoğurt'] },
    { time:'☀️ Öğle Yemeği (12:30)', items:['120g ızgara tavuk göğsü','3 yemek kaşığı esmer pirinç','1 kase mevsim yeşil salatası','1 çay kaşığı zeytinyağı'] },
    { time:'🌰 Ara Öğün (15:30)', items:['10 adet badem veya ceviz','1 bardak ayran (200 ml)'] },
    { time:'🌆 Akşam Yemeği (19:00)', items:['150g ızgara balık veya kırmızı et','Buharda brokoli ve havuç','1 kase mercimek veya nohut çorbası'] },
    { time:'🌙 Gece (22:00)', items:['1 su bardağı ılık süt (isteğe bağlı)'] },
  ];

  return (
    <AppLayout>
      <Topbar title="Beslenme Programları" subtitle={`${programs.length} aktif program`}
        actions={<button onClick={()=>setShowAdd(true)} style={{padding:'8px 16px',borderRadius:99,background:'var(--primary)',color:'white',border:'none',fontSize:13,fontWeight:500,cursor:'pointer'}}>➕ Yeni Program</button>}
      />
      <div style={{display:'flex',flex:1,overflow:'hidden'}}>
        {/* Program list */}
        <div style={{width:280,flexShrink:0,background:'var(--surface)',borderRight:'1px solid var(--border-light)',overflowY:'auto'}}>
          <div style={{padding:16}}>
            <div style={{fontSize:11,fontWeight:600,textTransform:'uppercase',letterSpacing:1,color:'var(--muted)',marginBottom:12,padding:'0 4px'}}>Programlar</div>
            {programs.map(p=>(
              <div key={p.id} onClick={()=>setSelected(p)}
                style={{padding:'14px 16px',borderRadius:'var(--radius-md)',cursor:'pointer',marginBottom:6,border:`1px solid ${selected?.id===p.id?'var(--sage-200)':'var(--border-light)'}`,background:selected?.id===p.id?'var(--sage-50)':'white',transition:'all 0.15s'}}
                onMouseEnter={e=>{if(selected?.id!==p.id)e.currentTarget.style.background='var(--sage-50)'}} onMouseLeave={e=>{if(selected?.id!==p.id)e.currentTarget.style.background='white'}}>
                <div style={{display:'flex',alignItems:'center',gap:10}}>
                  <div style={{width:10,height:10,borderRadius:'50%',background:p.color,flexShrink:0}}/>
                  <div style={{flex:1}}>
                    <div style={{fontSize:13,fontWeight:600,marginBottom:2}}>{p.name}</div>
                    <div style={{fontSize:11,color:'var(--muted)'}}>{p.calories} kcal/gün</div>
                  </div>
                  <span style={{fontSize:11,padding:'2px 8px',borderRadius:99,background:'var(--sage-100)',color:'var(--sage-700)'}}>{clients.filter(c=>c.program_id===p.id).length} kişi</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Program detail */}
        <div style={{flex:1,overflowY:'auto',padding:28}}>
          {selected&&(
            <>
              <div style={{marginBottom:24}}>
                <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:8}}>
                  <div style={{width:16,height:16,borderRadius:'50%',background:selected.color}}/>
                  <h2 style={{fontFamily:'var(--font-display)',fontSize:28,fontWeight:500}}>{selected.name}</h2>
                </div>
                {/* Macro cards */}
                <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:14,marginBottom:24}}>
                  {[['🔥',selected.calories+' kcal','Günlük Kalori','var(--sage-100)'],['🥩',selected.protein+'g','Protein','var(--bej-100)'],['🍚',selected.carbs+'g','Karbonhidrat','#ecfdf5'],['🥑',selected.fat+'g','Yağ','#e2f0f8']].map(([ic,v,l,bg])=>(
                    <div key={l} style={{background:'white',border:'1px solid var(--border-light)',borderRadius:'var(--radius-lg)',padding:'18px',textAlign:'center'}}>
                      <div style={{width:42,height:42,background:bg,borderRadius:'var(--radius-md)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:18,margin:'0 auto 10px'}}>{ic}</div>
                      <div style={{fontFamily:'var(--font-display)',fontSize:26,fontWeight:600,marginBottom:2}}>{v}</div>
                      <div style={{fontSize:12,color:'var(--muted)'}}>{l}</div>
                    </div>
                  ))}
                </div>

                {/* Macro bar */}
                <div style={{background:'white',border:'1px solid var(--border-light)',borderRadius:'var(--radius-lg)',padding:20,marginBottom:24}}>
                  <div style={{fontSize:13,fontWeight:600,marginBottom:12}}>Makro Dağılımı</div>
                  <div style={{display:'flex',height:16,borderRadius:99,overflow:'hidden',marginBottom:10}}>
                    {[['#548a48',(selected.protein*4/selected.calories*100).toFixed(0)+'%'],['#b8924a',(selected.carbs*4/selected.calories*100).toFixed(0)+'%'],['#7aaa6d',(selected.fat*9/selected.calories*100).toFixed(0)+'%']].map(([c,w],i)=>(
                      <div key={i} style={{height:'100%',width:w,background:c,transition:'width 0.5s'}}/>
                    ))}
                  </div>
                  <div style={{display:'flex',gap:20,fontSize:12,color:'var(--muted)'}}>
                    {[['#548a48','Protein',(selected.protein*4/selected.calories*100).toFixed(0)+'%'],['#b8924a','Karbonhidrat',(selected.carbs*4/selected.calories*100).toFixed(0)+'%'],['#7aaa6d','Yağ',(selected.fat*9/selected.calories*100).toFixed(0)+'%']].map(([c,l,w])=>(
                      <div key={l} style={{display:'flex',alignItems:'center',gap:5}}><div style={{width:8,height:8,borderRadius:'50%',background:c}}/>{l}: <strong>{w}</strong></div>
                    ))}
                  </div>
                </div>

                {/* Meals */}
                <div style={{background:'white',border:'1px solid var(--border-light)',borderRadius:'var(--radius-lg)',padding:20}}>
                  <div style={{fontSize:14,fontWeight:600,marginBottom:16}}>Günlük Öğün Planı</div>
                  <div style={{display:'flex',flexDirection:'column',gap:10}}>
                    {meals.map((m,i)=>(
                      <div key={i} style={{border:'1px solid var(--border-light)',borderRadius:'var(--radius-md)',padding:'14px 16px',transition:'all 0.15s'}}
                        onMouseEnter={e=>{e.currentTarget.style.background='var(--sage-50)';e.currentTarget.style.borderColor='var(--sage-200)'}} onMouseLeave={e=>{e.currentTarget.style.background='white';e.currentTarget.style.borderColor='var(--border-light)'}}>
                        <div style={{fontSize:13,fontWeight:600,color:'var(--primary)',marginBottom:8}}>{m.time}</div>
                        <ul style={{listStyle:'none',display:'flex',flexDirection:'column',gap:3}}>
                          {m.items.map((it,j)=><li key={j} style={{fontSize:13,color:'var(--charcoal)',display:'flex',gap:8}}><span style={{color:'var(--sage-400)'}}>›</span>{it}</li>)}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Assigned clients */}
                <div style={{background:'white',border:'1px solid var(--border-light)',borderRadius:'var(--radius-lg)',padding:20,marginTop:16}}>
                  <div style={{fontSize:14,fontWeight:600,marginBottom:14}}>Bu Programdaki Danışanlar</div>
                  <div style={{display:'flex',flexDirection:'column',gap:8}}>
                    {clients.filter(c=>c.program_id===selected.id).map(c=>(
                      <div key={c.id} style={{display:'flex',alignItems:'center',gap:12,padding:'10px',background:'var(--sage-50)',borderRadius:'var(--radius-md)'}}>
                        <div style={{width:34,height:34,borderRadius:'50%',background:c.color,color:c.colorText||'white',display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:700,flexShrink:0}}>{c.initials}</div>
                        <div style={{flex:1}}><div style={{fontSize:13,fontWeight:500}}>{c.name}</div><div style={{fontSize:11,color:'var(--muted)'}}>Hedef: {c.goal}</div></div>
                        <div style={{width:80}}>
                          <div style={{height:4,background:'white',borderRadius:99,overflow:'hidden',marginBottom:2}}><div style={{height:'100%',background:'var(--primary)',width:c.progress+'%'}}/></div>
                          <div style={{fontSize:10,color:'var(--muted)',textAlign:'right'}}>{c.progress}%</div>
                        </div>
                      </div>
                    ))}
                    {clients.filter(c=>c.program_id===selected.id).length===0&&<div style={{fontSize:13,color:'var(--muted)',textAlign:'center',padding:20}}>Bu programa atanmış danışan yok.</div>}
                  </div>
                </div>
              </div>
              <div style={{display:'flex',gap:10}}>
                <button onClick={()=>toast('Program düzenleme modu','info')} style={{padding:'10px 20px',borderRadius:99,background:'var(--primary)',color:'white',border:'none',fontSize:13,fontWeight:500,cursor:'pointer'}}>✏️ Programı Düzenle</button>
                <button onClick={()=>toast('Program PDF olarak indiriliyor...','info')} style={{padding:'10px 20px',borderRadius:99,background:'white',border:'1px solid var(--border)',fontSize:13,fontWeight:500,cursor:'pointer'}}>📄 PDF İndir</button>
                <button onClick={()=>toast('Program kopyalandı','success')} style={{padding:'10px 20px',borderRadius:99,background:'white',border:'1px solid var(--border)',fontSize:13,fontWeight:500,cursor:'pointer'}}>📋 Kopyala</button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Add modal */}
      {showAdd&&(
        <div onClick={e=>{if(e.target===e.currentTarget)setShowAdd(false);}} style={{position:'fixed',inset:0,background:'rgba(30,42,26,0.5)',backdropFilter:'blur(4px)',zIndex:200,display:'flex',alignItems:'center',justifyContent:'center'}}>
          <div style={{background:'white',borderRadius:'var(--radius-xl)',padding:32,width:460,maxWidth:'95vw',boxShadow:'var(--shadow-xl)',animation:'scaleIn 0.3s cubic-bezier(0.34,1.56,0.64,1)'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:24}}>
              <span style={{fontFamily:'var(--font-display)',fontSize:22,fontWeight:500}}>Yeni Program</span>
              <button onClick={()=>setShowAdd(false)} style={{width:32,height:32,borderRadius:'50%',background:'var(--sage-50)',border:'none',cursor:'pointer'}}>✕</button>
            </div>
            {[['Program Adı','name','text'],['Kalori (kcal/gün)','calories','number'],['Protein (g)','protein','number'],['Karbonhidrat (g)','carbs','number'],['Yağ (g)','fat','number']].map(([l,k,t])=>(
              <div key={k} style={{marginBottom:14}}>
                <label style={{fontSize:11,fontWeight:600,textTransform:'uppercase',letterSpacing:'0.8px',color:'var(--muted)',display:'block',marginBottom:5}}>{l}</label>
                <input type={t} value={newProg[k]} onChange={e=>setNewProg(p=>({...p,[k]:e.target.value}))} style={{width:'100%',padding:'10px 14px',border:'1px solid var(--border)',borderRadius:'var(--radius-md)',fontSize:14,outline:'none'}}/>
              </div>
            ))}
            <div style={{display:'flex',justifyContent:'flex-end',gap:10,marginTop:20,paddingTop:16,borderTop:'1px solid var(--border-light)'}}>
              <button onClick={()=>setShowAdd(false)} style={{padding:'9px 20px',borderRadius:99,border:'1px solid var(--border)',background:'white',fontSize:13,fontWeight:500,cursor:'pointer'}}>İptal</button>
              <button onClick={()=>{toast('Program eklendi ✅','success');setShowAdd(false);}} style={{padding:'9px 20px',borderRadius:99,background:'var(--primary)',color:'white',border:'none',fontSize:13,fontWeight:500,cursor:'pointer'}}>Kaydet</button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}

// ─── ÖLÇÜM TAKİBİ ───────────────────────────────────────
import { measurements } from '../data/mockData';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler } from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler);

export function Olcumler() {
  const toast = useToast();
  const [selectedClient, setSelectedClient] = useState(clients[0]);
  const [showAdd, setShowAdd] = useState(false);
  const [newMeas, setNewMeas] = useState({ weight:'', bmi:'', body_fat:'', muscle:'', waist:'' });
  const clientMeas = measurements.filter(m=>m.client_id===selectedClient?.id);

  const chartData = {
    labels: clientMeas.map(m=>m.date),
    datasets:[{ label:'Kilo (kg)', data:clientMeas.map(m=>m.weight), borderColor:'var(--primary)', backgroundColor:'rgba(84,138,72,0.1)', fill:true, tension:0.4, pointRadius:5, pointBackgroundColor:'var(--primary)' }],
  };
  const chartOpts = { responsive:true, maintainAspectRatio:false, plugins:{ legend:{display:false}, tooltip:{ backgroundColor:'#1e2a1a', callbacks:{ label:ctx=>` ${ctx.raw} kg` } } }, scales:{ x:{grid:{display:false},ticks:{color:'#6b7a65',font:{size:11}}}, y:{grid:{color:'rgba(0,0,0,0.04)'},ticks:{color:'#6b7a65',font:{size:11},callback:v=>v+' kg'}} } };

  return (
    <AppLayout>
      <Topbar title="Ölçüm Takibi" subtitle="Danışan ölçümlerini takip edin"
        actions={<button onClick={()=>setShowAdd(true)} style={{padding:'8px 16px',borderRadius:99,background:'var(--primary)',color:'white',border:'none',fontSize:13,fontWeight:500,cursor:'pointer'}}>➕ Ölçüm Ekle</button>}
      />
      <div style={{display:'flex',flex:1,overflow:'hidden'}}>
        {/* Client selector */}
        <div style={{width:260,flexShrink:0,background:'var(--surface)',borderRight:'1px solid var(--border-light)',overflowY:'auto',padding:12}}>
          <div style={{fontSize:11,fontWeight:600,textTransform:'uppercase',letterSpacing:1,color:'var(--muted)',marginBottom:10,padding:'4px 8px'}}>Danışanlar</div>
          {clients.map(c=>(
            <div key={c.id} onClick={()=>setSelectedClient(c)}
              style={{display:'flex',alignItems:'center',gap:10,padding:'10px 12px',borderRadius:'var(--radius-md)',cursor:'pointer',marginBottom:4,background:selectedClient?.id===c.id?'var(--sage-50)':'transparent',border:`1px solid ${selectedClient?.id===c.id?'var(--sage-200)':'transparent'}`,transition:'all 0.15s'}}
              onMouseEnter={e=>{if(selectedClient?.id!==c.id)e.currentTarget.style.background='var(--sage-50)'}} onMouseLeave={e=>{if(selectedClient?.id!==c.id)e.currentTarget.style.background='transparent'}}>
              <div style={{width:34,height:34,borderRadius:'50%',background:c.color,color:c.colorText||'white',display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:700,flexShrink:0}}>{c.initials}</div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:13,fontWeight:500,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{c.name}</div>
                <div style={{fontSize:11,color:'var(--muted)'}}>{c.weight} kg · BMI {c.bmi}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Measurement detail */}
        <div style={{flex:1,overflowY:'auto',padding:28}}>
          {selectedClient&&(
            <>
              <div style={{display:'flex',alignItems:'center',gap:14,marginBottom:24}}>
                <div style={{width:52,height:52,borderRadius:'50%',background:selectedClient.color,color:selectedClient.colorText||'white',display:'flex',alignItems:'center',justifyContent:'center',fontSize:18,fontWeight:700}}>{selectedClient.initials}</div>
                <div>
                  <h2 style={{fontFamily:'var(--font-display)',fontSize:24,fontWeight:500,marginBottom:2}}>{selectedClient.name}</h2>
                  <div style={{fontSize:13,color:'var(--muted)'}}>Hedef: {selectedClient.goal} · {selectedClient.since} tarihinden beri</div>
                </div>
              </div>

              {/* Current stats */}
              <div style={{display:'grid',gridTemplateColumns:'repeat(6,1fr)',gap:12,marginBottom:24}}>
                {[[selectedClient.weight+' kg','Kilo','var(--sage-100)','↓'],[selectedClient.bmi,'BMI','var(--bej-100)','↓'],[selectedClient.body_fat,'Yağ %','#ecfdf5','↓'],[selectedClient.muscle,'Kas Kütlesi','#e2f0f8','↑'],[selectedClient.height+' cm','Boy','var(--sage-50)','—'],[Math.round(selectedClient.weight*0.6)+' ml','Su İhtiyacı','var(--bej-100)','—']].map(([v,l,bg,tr])=>(
                  <div key={l} style={{background:'white',border:'1px solid var(--border-light)',borderRadius:'var(--radius-lg)',padding:'16px',textAlign:'center'}}>
                    <div style={{width:36,height:36,background:bg,borderRadius:'var(--radius-md)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 8px',fontSize:14}}>
                      {l==='Kilo'?'⚖️':l==='BMI'?'📊':l==='Yağ %'?'💧':l==='Kas Kütlesi'?'💪':l==='Boy'?'📏':'🫧'}
                    </div>
                    <div style={{fontFamily:'var(--font-display)',fontSize:20,fontWeight:700,marginBottom:2}}>{v}</div>
                    <div style={{fontSize:11,color:'var(--muted)'}}>{l}</div>
                    {tr!=='—'&&<div style={{fontSize:10,color:tr==='↑'?'var(--success)':'var(--danger)',marginTop:2}}>{tr}</div>}
                  </div>
                ))}
              </div>

              {/* Chart */}
              {clientMeas.length>0&&(
                <div style={{background:'white',border:'1px solid var(--border-light)',borderRadius:'var(--radius-lg)',padding:20,marginBottom:20}}>
                  <div style={{fontSize:14,fontWeight:600,marginBottom:16}}>Kilo Değişimi</div>
                  <div style={{height:200}}><Line data={chartData} options={chartOpts}/></div>
                </div>
              )}

              {/* History table */}
              {clientMeas.length>0&&(
                <div style={{background:'white',border:'1px solid var(--border-light)',borderRadius:'var(--radius-lg)',overflow:'hidden'}}>
                  <div style={{padding:'14px 20px',borderBottom:'1px solid var(--border-light)',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                    <span style={{fontSize:14,fontWeight:600}}>Ölçüm Geçmişi</span>
                    <button onClick={()=>toast('Excel olarak indiriliyor...','info')} style={{padding:'6px 14px',borderRadius:99,border:'1px solid var(--border)',background:'white',fontSize:12,cursor:'pointer'}}>📥 Excel İndir</button>
                  </div>
                  <table style={{width:'100%',borderCollapse:'collapse'}}>
                    <thead><tr>{['Tarih','Kilo','BMI','Vücut Yağ %','Kas Kütlesi','Bel Çevresi'].map(h=><th key={h} style={{fontSize:11,fontWeight:600,padding:'10px 16px',textAlign:'left',background:'var(--sage-50)',color:'var(--muted)'}}>{h}</th>)}</tr></thead>
                    <tbody>
                      {clientMeas.map((m,i)=>(
                        <tr key={m.id} style={{cursor:'default'}} onMouseEnter={e=>e.currentTarget.style.background='var(--sage-50)'} onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                          {[m.date, m.weight+' kg', m.bmi, m.body_fat+'%', m.muscle+' kg', m.waist+' cm'].map((v,j)=>(
                            <td key={j} style={{padding:'12px 16px',fontSize:13,borderBottom:i<clientMeas.length-1?'1px solid var(--border-light)':'none'}}>{v}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {clientMeas.length===0&&(
                <div style={{background:'white',border:'2px dashed var(--border)',borderRadius:'var(--radius-lg)',padding:60,textAlign:'center'}}>
                  <div style={{fontSize:40,marginBottom:12}}>📏</div>
                  <div style={{fontSize:16,fontWeight:600,marginBottom:8}}>Henüz ölçüm yok</div>
                  <div style={{fontSize:14,color:'var(--muted)',marginBottom:20}}>Bu danışan için ilk ölçümü ekleyin.</div>
                  <button onClick={()=>setShowAdd(true)} style={{padding:'10px 24px',borderRadius:99,background:'var(--primary)',color:'white',border:'none',fontSize:14,fontWeight:500,cursor:'pointer'}}>➕ İlk Ölçümü Ekle</button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Add measurement modal */}
      {showAdd&&(
        <div onClick={e=>{if(e.target===e.currentTarget)setShowAdd(false);}} style={{position:'fixed',inset:0,background:'rgba(30,42,26,0.5)',backdropFilter:'blur(4px)',zIndex:200,display:'flex',alignItems:'center',justifyContent:'center'}}>
          <div style={{background:'white',borderRadius:'var(--radius-xl)',padding:32,width:420,maxWidth:'95vw',boxShadow:'var(--shadow-xl)',animation:'scaleIn 0.3s cubic-bezier(0.34,1.56,0.64,1)'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:24}}>
              <span style={{fontFamily:'var(--font-display)',fontSize:22,fontWeight:500}}>Yeni Ölçüm</span>
              <button onClick={()=>setShowAdd(false)} style={{width:32,height:32,borderRadius:'50%',background:'var(--sage-50)',border:'none',cursor:'pointer'}}>✕</button>
            </div>
            <div style={{marginBottom:14}}>
              <label style={{fontSize:11,fontWeight:600,textTransform:'uppercase',letterSpacing:'0.8px',color:'var(--muted)',display:'block',marginBottom:5}}>Danışan</label>
              <div style={{padding:'10px 14px',background:'var(--sage-50)',borderRadius:'var(--radius-md)',fontSize:14,fontWeight:500}}>{selectedClient?.name}</div>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
              {[['Kilo (kg)','weight'],['BMI','bmi'],['Vücut Yağ (%)','body_fat'],['Kas Kütlesi (kg)','muscle'],['Bel Çevresi (cm)','waist']].map(([l,k])=>(
                <div key={k} style={{marginBottom:12}}>
                  <label style={{fontSize:11,fontWeight:600,textTransform:'uppercase',letterSpacing:'0.8px',color:'var(--muted)',display:'block',marginBottom:5}}>{l}</label>
                  <input type="number" value={newMeas[k]} onChange={e=>setNewMeas(p=>({...p,[k]:e.target.value}))} step="0.1" style={{width:'100%',padding:'10px 14px',border:'1px solid var(--border)',borderRadius:'var(--radius-md)',fontSize:14,outline:'none'}}/>
                </div>
              ))}
            </div>
            <div style={{display:'flex',justifyContent:'flex-end',gap:10,marginTop:20,paddingTop:16,borderTop:'1px solid var(--border-light)'}}>
              <button onClick={()=>setShowAdd(false)} style={{padding:'9px 20px',borderRadius:99,border:'1px solid var(--border)',background:'white',fontSize:13,fontWeight:500,cursor:'pointer'}}>İptal</button>
              <button onClick={()=>{toast('Ölçüm kaydedildi ✅','success');setShowAdd(false);}} style={{padding:'9px 20px',borderRadius:99,background:'var(--primary)',color:'white',border:'none',fontSize:13,fontWeight:500,cursor:'pointer'}}>Kaydet</button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}

// ─── TARİF KÜTÜPHANESİ ─────────────────────────────────
const recipes = [
  { id:1, name:'Izgara Tavuk Salatası', cat:'Ana Yemek', cal:320, protein:38, carbs:12, fat:14, time:25, tags:['yüksek protein','düşük karbonhidrat'], emoji:'🥗' },
  { id:2, name:'Yulaf Ezmesi (Kahvaltılık)', cat:'Kahvaltı', cal:280, protein:12, carbs:48, fat:7, time:10, tags:['lifli','enerji verici'], emoji:'🥣' },
  { id:3, name:'Mercimek Çorbası', cat:'Çorba', cal:210, protein:14, carbs:32, fat:4, time:40, tags:['bitkisel','demir zengini'], emoji:'🍲' },
  { id:4, name:'Ton Balıklı Sandviç', cat:'Atıştırmalık', cal:380, protein:28, carbs:35, fat:12, time:10, tags:['hızlı','omega-3'], emoji:'🥪' },
  { id:5, name:'Buharda Somon Fileto', cat:'Ana Yemek', cal:290, protein:34, carbs:4, fat:16, time:20, tags:['omega-3','düşük karbonhidrat'], emoji:'🐟' },
  { id:6, name:'Avokado Tostu', cat:'Kahvaltı', cal:260, protein:8, carbs:22, fat:17, time:8, tags:['sağlıklı yağ','hızlı'], emoji:'🥑' },
  { id:7, name:'Protein Smoothie', cat:'İçecek', cal:340, protein:30, carbs:38, carbs2:38, fat:6, time:5, tags:['yüksek protein','spor sonrası'], emoji:'🥤' },
  { id:8, name:'Nohut Salatası', cat:'Salata', cal:240, protein:12, carbs:36, fat:7, time:15, tags:['bitkisel','lifli'], emoji:'🫘' },
  { id:9, name:'Elmalı Tarçınlı Yulaf', cat:'Kahvaltı', cal:310, protein:10, carbs:55, fat:6, time:12, tags:['tatlı','lifli'], emoji:'🍎' },
];
const cats = ['Tümü','Kahvaltı','Ana Yemek','Çorba','Salata','Atıştırmalık','İçecek'];

export function Tarifler() {
  const toast = useToast();
  const [cat, setCat] = useState('Tümü');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const filtered = recipes.filter(r=>(!search||r.name.toLowerCase().includes(search.toLowerCase()))&&(cat==='Tümü'||r.cat===cat));

  return (
    <AppLayout>
      <Topbar title="Tarif Kütüphanesi" subtitle={`${recipes.length} sağlıklı tarif`}
        actions={<button onClick={()=>toast('Tarif ekleme paneli açılıyor...','info')} style={{padding:'8px 16px',borderRadius:99,background:'var(--primary)',color:'white',border:'none',fontSize:13,fontWeight:500,cursor:'pointer'}}>➕ Tarif Ekle</button>}
      />
      <div style={{padding:28,flex:1}}>
        {/* Search & filter */}
        <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:20,flexWrap:'wrap'}}>
          <div style={{display:'flex',alignItems:'center',gap:8,background:'white',border:'1px solid var(--border)',borderRadius:99,padding:'9px 18px',flex:1,minWidth:200,maxWidth:320}}>
            <span>🔍</span>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Tarif ara..." style={{border:'none',outline:'none',fontSize:14,background:'transparent',width:'100%'}}/>
          </div>
          <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
            {cats.map(c=>(
              <button key={c} onClick={()=>setCat(c)} style={{padding:'8px 14px',borderRadius:99,fontSize:13,fontWeight:500,cursor:'pointer',border:'1px solid',borderColor:cat===c?'var(--sage-300)':'var(--border-light)',background:cat===c?'var(--sage-100)':'white',color:cat===c?'var(--sage-700)':'var(--muted)',transition:'all 0.15s'}}>{c}</button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))',gap:16}}>
          {filtered.map(r=>(
            <div key={r.id} onClick={()=>setSelected(selected?.id===r.id?null:r)} style={{background:'white',border:`1px solid ${selected?.id===r.id?'var(--sage-300)':'var(--border-light)'}`,borderRadius:'var(--radius-lg)',padding:20,cursor:'pointer',transition:'all 0.2s',transform:selected?.id===r.id?'translateY(-2px)':'none',boxShadow:selected?.id===r.id?'var(--shadow-md)':'var(--shadow-sm)'}}
              onMouseEnter={e=>{if(selected?.id!==r.id){e.currentTarget.style.transform='translateY(-2px)';e.currentTarget.style.boxShadow='var(--shadow-md)';}}} onMouseLeave={e=>{if(selected?.id!==r.id){e.currentTarget.style.transform='none';e.currentTarget.style.boxShadow='var(--shadow-sm)';}}} >
              <div style={{fontSize:40,marginBottom:12,textAlign:'center'}}>{r.emoji}</div>
              <div style={{fontSize:14,fontWeight:600,marginBottom:4}}>{r.name}</div>
              <div style={{fontSize:11,color:'var(--muted)',marginBottom:12}}>{r.cat} · ⏱ {r.time} dk</div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:6,marginBottom:12}}>
                {[['🔥 '+r.cal,'kcal'],['🥩 '+r.protein+'g','protein'],['🍚 '+r.carbs+'g','karbonhidrat'],['🥑 '+r.fat+'g','yağ']].map(([v,l])=>(
                  <div key={l} style={{background:'var(--sage-50)',borderRadius:'var(--radius-sm)',padding:'5px 8px',fontSize:11,textAlign:'center'}}>
                    <div style={{fontWeight:600}}>{v}</div><div style={{color:'var(--muted)'}}>{l}</div>
                  </div>
                ))}
              </div>
              <div style={{display:'flex',gap:4,flexWrap:'wrap'}}>
                {r.tags.map(t=><span key={t} style={{fontSize:10,padding:'2px 8px',borderRadius:99,background:'var(--bej-100)',color:'var(--bej-700)'}}>{t}</span>)}
              </div>
              {selected?.id===r.id&&(
                <div style={{marginTop:12,paddingTop:12,borderTop:'1px solid var(--border-light)',display:'flex',gap:6}}>
                  <button onClick={e=>{e.stopPropagation();toast('Tarif danışana gönderildi ✅','success');}} style={{flex:1,padding:'7px',borderRadius:99,background:'var(--primary)',color:'white',border:'none',fontSize:12,fontWeight:500,cursor:'pointer'}}>Danışana Gönder</button>
                  <button onClick={e=>{e.stopPropagation();toast('Programa eklendi ✅','success');}} style={{flex:1,padding:'7px',borderRadius:99,background:'white',border:'1px solid var(--border)',fontSize:12,fontWeight:500,cursor:'pointer'}}>Programa Ekle</button>
                </div>
              )}
            </div>
          ))}
          {filtered.length===0&&<div style={{gridColumn:'1/-1',textAlign:'center',padding:60,color:'var(--muted)',fontSize:15}}>Tarif bulunamadı.</div>}
        </div>
      </div>
    </AppLayout>
  );
}
