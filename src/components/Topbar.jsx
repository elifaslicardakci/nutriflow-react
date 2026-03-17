import { useToast } from '../hooks/useToast';

export default function Topbar({ title, subtitle, actions }) {
  const toast = useToast();
  return (
    <header style={{
      height: 'var(--nav-h)', background: 'var(--surface)',
      borderBottom: '1px solid var(--border-light)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 28px', position: 'sticky', top: 0, zIndex: 40,
      boxShadow: 'var(--shadow-sm)',
    }}>
      <div>
        <div style={{ fontSize:18, fontWeight:600, color:'var(--charcoal)' }}>{title}</div>
        {subtitle && <div style={{ fontSize:13, color:'var(--muted)' }}>{subtitle}</div>}
      </div>
      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
        {actions}
        <div onClick={() => toast('3 yeni bildirim', 'info')} style={{
          width:38, height:38, borderRadius:'var(--radius-md)', background:'var(--sage-50)',
          border:'1px solid var(--border-light)', display:'flex', alignItems:'center',
          justifyContent:'center', fontSize:16, cursor:'pointer', position:'relative',
        }}>
          🔔
          <div style={{ position:'absolute', top:6, right:6, width:7, height:7, borderRadius:'50%', background:'var(--danger)', border:'1.5px solid white' }} />
        </div>
        <div style={{ width:38, height:38, borderRadius:'50%', background:'linear-gradient(135deg,var(--sage-400),var(--sage-600))', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:600, fontSize:12, color:'white', cursor:'pointer' }}>
          DK
        </div>
      </div>
    </header>
  );
}
