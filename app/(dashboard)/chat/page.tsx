
import Logo from '@/components/chat/ui/pageLogo';
export default function ChatPage() {
  return (
    <div className='overflow-hidden'>
      <div
        style={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '90vh',
       
        }}
      >
       
        <Logo />
      </div>
  
    </div>
  );
}
