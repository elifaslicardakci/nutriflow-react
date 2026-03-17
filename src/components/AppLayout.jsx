import Sidebar from './Sidebar';

export default function AppLayout({ children }) {
  return (
    <div style={{ display:'flex', minHeight:'100vh', background:'var(--sage-50)' }}>
      <Sidebar />
      <main style={{ flex:1, marginLeft:'var(--sidebar-w)', display:'flex', flexDirection:'column', minHeight:'100vh' }}>
        {children}
      </main>
    </div>
  );
}
