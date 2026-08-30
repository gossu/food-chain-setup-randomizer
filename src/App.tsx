import { useState } from 'react'
import { ConfigPage } from './pages/ConfigPage'
import type { ConfigSettings } from './pages/ConfigPage'
import { ResultPage } from './pages/ResultPage'

type PageType = 'config' | 'result'

function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('config')
  const [generatedResult, setGeneratedResult] = useState<string>('')

  const handleGenerate = (config: ConfigSettings) => {
    // TODO: Add your generation logic here
    const result = `Generated with config:\nMin Complexity: ${config.minComplexity}\nMax Complexity: ${config.maxComplexity}\nReplacements: ${config.replacements || 'None'}\nAdditions: ${config.additions || 'None'}`
    setGeneratedResult(result)
    setCurrentPage('result')
  }

  const handleBack = () => {
    setCurrentPage('config')
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      {currentPage === 'config' ? (
        <ConfigPage onGenerate={handleGenerate} />
      ) : (
        <ResultPage onBack={handleBack} result={generatedResult} />
      )}
    </div>
  )
}

export default App
