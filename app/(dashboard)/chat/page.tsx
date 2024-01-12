import ChatComponent from '../../../components/chat/ChatComponent';
import Logo from '../../../components/Logo'; // Adjust the import path as needed

export default function ChatPage() {
  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <div style={{ width: '128px', height: '128px' }}>
          {' '}
          {/* Adjust the size as needed */}
          <Logo />
        </div>
      </div>
      <ChatComponent initialChatId={null} />
    </div>
  );
}
