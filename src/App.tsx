import { useState } from 'react'
import { ConfigPage } from './pages/ConfigPage'
import type { ConfigSettings } from './pages/ConfigPage'
import { ResultPage } from './pages/ResultPage'

type PageType = 'config' | 'result'

function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('config')
  const [config, setConfig] = useState<ConfigSettings | null>(null)
  const [resultVersion, setResultVersion] = useState(0)

  const handleGenerate = (generatedConfig: ConfigSettings) => {
    setConfig(generatedConfig)
    setResultVersion((current) => current + 1)
    setCurrentPage('result')
  }

  const handleBack = () => {
    setCurrentPage('config')
  }

  const handleRegenerate = () => {
    if (!config) return
    setResultVersion((current) => current + 1)
    setCurrentPage('result')
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      backgroundColor: 'var(--bg-primary)',
      color: 'var(--text-primary)',
      transition: 'background-color 0.3s ease, color 0.3s ease'
    }}>
      {currentPage === 'config' ? (
        <ConfigPage onGenerate={handleGenerate} />
      ) : (
        config && (
          <ResultPage
            onBack={handleBack}
            onRegenerate={handleRegenerate}
            config={config}
            resultVersion={resultVersion}
          />
        )
      )}
    </div>
  )
}

export default App
