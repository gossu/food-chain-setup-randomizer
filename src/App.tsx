import { useState } from 'react'
import { ConfigPage } from './pages/ConfigPage'
import type { ConfigSettings } from './pages/ConfigPage'
import { ResultPage } from './pages/ResultPage'

type PageType = 'config' | 'result'

function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('config')
  const [config, setConfig] = useState<ConfigSettings | null>(null)

  const handleGenerate = (generatedConfig: ConfigSettings) => {
    setConfig(generatedConfig)
    setCurrentPage('result')
  }

  const handleBack = () => {
    setCurrentPage('config')
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      justifyContent: 'center',
      backgroundColor: 'var(--bg-primary)',
      color: 'var(--text-primary)',
      transition: 'background-color 0.3s ease, color 0.3s ease'
    }}>
      {currentPage === 'config' ? (
        <ConfigPage onGenerate={handleGenerate} />
      ) : (
        config && <ResultPage onBack={handleBack} config={config} />
      )}
    </div>
  )
}

export default App
