import TopResourceBar from '../TopResourceBar';
import { useState } from 'react';

export default function TopResourceBarExample() {
  const [isDark, setIsDark] = useState(true);
  
  return (
    <TopResourceBar 
      cash={125430}
      miningRate={342}
      totalMined={5200000}
      isDarkMode={isDark}
      onToggleDarkMode={() => setIsDark(!isDark)}
      onSettings={() => console.log('Settings clicked')}
    />
  );
}
