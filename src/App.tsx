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
    const enabledAdditions = config.additions
      .filter(a => a.enabled)
      .map(a => `${a.name} (complexity: ${a.complexity})`)
      .join('\n')
    
    const result = `Generated with config:
Min Complexity: ${config.minComplexity}
Max Complexity: ${config.maxComplexity}
New Milestones Chance: ${config.replacements.newChallengesChance}%
Hard Choices Chance: ${config.replacements.hardChoicesChance}%
New Reserve Cards Chance: ${config.replacements.newReserveCardsChance}%
Enabled Additions:
${enabledAdditions || 'None'}`
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
