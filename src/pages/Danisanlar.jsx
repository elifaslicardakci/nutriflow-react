import { useState } from 'react';
import AppLayout from '../components/AppLayout';
import Topbar from '../components/Topbar';
import { useToast } from '../hooks/useToast';
import { clients } from '../data/mockData';

const statusLabel = { aktif: 'Active', pasif: 'Inactive', yeni: 'New' };
const statusColor = { aktif: 'var(--success)', pasif: 'var(--muted)', yeni: 'var(--info)' };
const goalLabel   = { 'kilo-ver': 'Weight Loss', 'kilo-al': 'Weight Gain', saglikli: 'Healthy Eating', spor: 'Sports Nutrition' };

export default function Danisanlar() {
  const toast = useToast();
  const [search, setSearch]   = useState('');
  const [filter, setFilter]   = useState('hepsi');
  const [showModal, setShowModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);

  const filters = [
    { key:'hepsi', label:'All' },
    { key:'aktif', label:'Active' },
    { key:'pasif', label:'Inactive' },
    { key:'yeni',  label:'New' },
  ];

  const filtered = clients.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'hepsi' || c.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <AppLayout>
      <Topbar title="Clients" subtitle={`${clients.length} total clients`}
        actions={
          <button onClick={()=>setShowModal(true)} style={{padding:'8px 18px',borderRadius:99,background:'var(--primary)',color:'white',border:'none',fontSize:13,fontWeight:600,cursor:'pointer'}}>
            ➕ New Client
          </button>
        }
      />
      <div style={{padding:28,flex:1}}>
        <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:20,flexWrap:'wrap'}}>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by name or email..."
            style={{flex:1,minWidth:200,padding:'10px 14px',borderRadius:'var(--radius-md)',border:'1px solid var(--border)',fontSize:13,outline:'none',background:'var(--surface)'}} />
          <div style={{display:'flex',gap:6}}>
            {filters.map(f=>(
              <button key={f.key} onClick={()=>setFilter(f.key)} style={{padding:'8px 16px',borderRadius:99,fontSize:13,fontWeight:500,cursor:'pointer',border:'1px solid',borderColor:filter===f.key?'var(--primary)':'var(--border)',background:filter===f.key?'var(--sage-50)':'white',color:filter===f.key?'var(--primary)':'var(--charcoal)'}}>
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{background:'var(--surface)',border:'1px solid var(--border-light)',borderRadius:'var(--radius-lg)',overflow:'hidden'}}>
          <table style={{width:'100%',borderCollapse:'collapse'}}>
            <thead>
              <tr>
                {['Client','Goal','Program','Start Date','Progress','Status',''].map(h=>(
                  <th key={h} style={{fontSize:11,fontWeight:600,textTransform:'uppercase',letterSpacing:'0.8px',color:'var(--muted)',padding:'12px 16px',textAlign:'left',background:'var(--sage-50)',whiteSpace:'nowrap'}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(c=>(
                <tr key={c.id} style={{cursor:'pointer',transition:'background 0.15s'}}
                  onMouseEnter={e=>e.currentTarget.style.background='var(--sage-50)'}
                  onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                  <td style={{padding:'14px 16px',borderBottom:'1px solid var(--border-light)'}}>
                    <div style={{display:'flex',alignItems:'center',gap:12}}>
                      <div style={{width:38,height:38,borderRadius:'50%',background:c.color,color:c.colorText||'white',display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:700,flexShrink:0}}>{c.initials}</div>
                      <div>
                        <div style={{fontWeight:600,fontSize:14}}>{c.name}</div>
                        <div style={{fontSize:12,color:'var(--muted)'}}>{c.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{padding:'14px 16px',borderBottom:'1px solid var(--border-light)',fontSize:13}}>{goalLabel[c.goal] || c.goal}</td>
                  <td style={{padding:'14px 16px',borderBottom:'1px solid var(--border-light)',fontSize:13,color:'var(--muted)'}}>{c.program}</td>
                  <td style={{padding:'14px 16px',borderBottom:'1px solid var(--border-light)',fontSize:13,fontFamily:'var(--font-mono)',color:'var(--muted)'}}>{c.startDate}</td>
                  <td style={{padding:'14px 16px',borderBottom:'1px solid var(--border-light)',minWidth:120}}>
                    <div style={{display:'flex',alignItems:'center',gap:8}}>
                      <div style={{flex:1,height:6,borderRadius:99,background:'var(--border-light)',overflow:'hidden'}}>
                        <div style={{height:'100%',borderRadius:99,background:'var(--primary)',width:`${c.progress}%`,transition:'width 0.3s'}}/>
                      </div>
                      <span style={{fontSize:12,fontWeight:600,color:'var(--charcoal)',minWidth:28}}>{c.progress}%</span>
                    </div>
                  </td>
                  <td style={{padding:'14px 16px',borderBottom:'1px solid var(--border-light)'}}>
                    <span style={{display:'inline-flex',alignItems:'center',gap:5,fontSize:12,fontWeight:500,padding:'3px 10px',borderRadius:99,background:c.status==='aktif'?'#ecfdf5':c.status==='yeni'?'#e2f0f8':'var(--sage-50)',color:statusColor[c.status]}}>
                      <span style={{width:6,height:6,borderRadius:'50%',background:statusColor[c.status]}}/>
                      {statusLabel[c.status]}
                    </span>
                  </td>
                  <td style={{padding:'14px 16px',borderBottom:'1px solid var(--border-light)'}}>
                    <div style={{display:'flex',gap:6}}>
                      <button onClick={()=>{setSelectedClient(c);setShowModal(true);}} style={{padding:'6px 12px',borderRadius:99,border:'1px solid var(--border)',background:'white',fontSize:12,fontWeight:500,cursor:'pointer',color:'var(--charcoal)'}}>Edit</button>
                      <button onClick={()=>toast(`${c.name} profile opened`,'info')} style={{padding:'6px 12px',borderRadius:99,border:'none',background:'var(--sage-50)',fontSize:12,fontWeight:500,cursor:'pointer',color:'var(--primary)'}}>View</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length===0 && <div style={{padding:40,textAlign:'center',color:'var(--muted)',fontSize:14}}>No clients found.</div>}
        </div>
      </div>

      {showModal && (
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.35)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:100,backdropFilter:'blur(2px)'}}>
          <div style={{background:'white',borderRadius:'var(--radius-xl)',padding:32,width:'100%',maxWidth:480,boxShadow:'var(--shadow-xl)',position:'relative'}}>
            <button onClick={()=>{setShowModal(false);setSelectedClient(null);}} style={{position:'absolute',top:16,right:16,background:'none',border:'none',fontSize:20,cursor:'pointer',color:'var(--muted)'}}>✕</button>
            <h2 style={{fontFamily:'var(--font-display)',fontSize:22,fontWeight:600,marginBottom:6}}>{selectedClient?'Edit Client':'New Client'}</h2>
            <p style={{fontSize:13,color:'var(--muted)',marginBottom:24}}>{selectedClient?`Editing: ${selectedClient.name}`:'Fill in the details to add a new client.'}</p>
            <div style={{display:'flex',flexDirection:'column',gap:14}}>
              {[['Full Name','text','e.g. Ayşe Yılmaz'],['Email','email','example@email.com'],['Phone','tel','+90 5XX XXX XX XX']].map(([label,type,ph])=>(
                <div key={label}>
                  <label style={{fontSize:12,fontWeight:600,color:'var(--charcoal)',display:'block',marginBottom:6}}>{label}</label>
                  <input type={type} placeholder={ph} defaultValue={selectedClient&&label==='Full Name'?selectedClient.name:selectedClient&&label==='Email'?selectedClient.email:''}
                    style={{width:'100%',padding:'10px 14px',borderRadius:'var(--radius-md)',border:'1px solid var(--border)',fontSize:13,outline:'none',boxSizing:'border-box'}}/>
                </div>
              ))}
              <div>
                <label style={{fontSize:12,fontWeight:600,color:'var(--charcoal)',display:'block',marginBottom:6}}>Goal</label>
                <select defaultValue={selectedClient?.goal||''} style={{width:'100%',padding:'10px 14px',borderRadius:'var(--radius-md)',border:'1px solid var(--border)',fontSize:13,outline:'none',background:'white'}}>
                  <option value="">Select...</option>
                  <option value="kilo-ver">Weight Loss</option>
                  <option value="kilo-al">Weight Gain</option>
                  <option value="saglikli">Healthy Eating</option>
                  <option value="spor">Sports Nutrition</option>
                </select>
              </div>
              <div style={{display:'flex',gap:10,marginTop:8,paddingTop:20,borderTop:'1px solid var(--border-light)'}}>
                <button onClick={()=>{setShowModal(false);setSelectedClient(null);}} style={{flex:1,padding:'11px',borderRadius:'var(--radius-md)',border:'1px solid var(--border)',background:'white',fontSize:14,fontWeight:500,cursor:'pointer'}}>Cancel</button>
                <button onClick={()=>{toast(selectedClient?'Client updated!':'New client added!','success');setShowModal(false);setSelectedClient(null);}} style={{flex:2,padding:'11px',borderRadius:'var(--radius-md)',border:'none',background:'var(--primary)',color:'white',fontSize:14,fontWeight:600,cursor:'pointer'}}>{selectedClient?'Save Changes':'Add Client'}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}