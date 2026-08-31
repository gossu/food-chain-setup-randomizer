import type { ConfigSettings, Addition } from './ConfigPage'

interface ResultPageProps {
  onBack: () => void;
  onRegenerate: () => void;
  config: ConfigSettings;
  resultVersion: number;
}

interface GeneratedResults {
  milestones: string;
  reserveCards: string;
  modules: Addition[] | null;
}

// Fisher-Yates shuffle algorithm
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

const themeColors = {
  bgPrimary: 'var(--bg-primary)',
  bgSecondary: 'var(--bg-secondary)',
  bgCard: 'var(--bg-card)',
  textPrimary: 'var(--text-primary)',
  textSecondary: 'var(--text-secondary)',
  borderColor: 'var(--border-color)',
  accentPrimary: 'var(--accent-primary)',
  accentSecondary: 'var(--accent-secondary)',
}

export function ResultPage({ onBack, onRegenerate, config, resultVersion }: ResultPageProps) {
  const generateResults = (): GeneratedResults => {
    console.log('=== Starting Module Generation ===')
    
    // Milestones: Determine if new or old
    const isNewMilestone = Math.random() * 100 < config.replacements.newChallengesChance
    
    let milestonesResult = isNewMilestone ? 'New' : 'Old'
    
    // If old milestone, determine if with/without hard choices
    if (!isNewMilestone) {
      const withHardChoices = Math.random() * 100 < config.replacements.hardChoicesChance
      milestonesResult += withHardChoices ? ' - with Hard Choices' : ' - without Hard Choices'
    }

    // Reserve Cards: Determine if new or old
    const isNewReserveCards = Math.random() * 100 < config.replacements.newReserveCardsChance
    const reserveCardsResult = isNewReserveCards ? 'New' : 'Old'

    // Modules: Generate list based on complexity
    console.log('Complexity Range:', config.minComplexity, '-', config.maxComplexity)
    
    const enabledAdditions = config.additions.filter(a => a.enabled)
    console.log('Enabled Additions:', enabledAdditions.map(a => `${a.name} (${a.complexity})`))
    
    const shuffledModules = shuffleArray(enabledAdditions)
    console.log('Shuffled Modules:', shuffledModules.map(m => `${m.name} (${m.complexity})`))
    
    const candidateLists: Addition[][] = []
    const selectedModules: Addition[] = []
    let complexitySoFar = 0
    
    console.log('Starting Iteration:')

    const initialIsWithinRange = config.minComplexity === 0
    console.log(`Initial check: Complexity = ${complexitySoFar}. Within range? ${initialIsWithinRange}`)
    if(config.minComplexity === 0){
      candidateLists.push([]) // Add empty candidate if min complexity is 0
      console.log(`  ✓ Adding candidate: [] (empty selection)`)
    }


    for (let i = 0; i < shuffledModules.length; i++) {
      const module = shuffledModules[i]
      
      const newComplexity = complexitySoFar + module.complexity
      if (newComplexity <= config.maxComplexity) {
        selectedModules.push(module)
        complexitySoFar = newComplexity
        console.log(`    Adding module "${module.name}" (complexity: ${module.complexity}). New total: ${complexitySoFar}`)

        const isWithinRange = complexitySoFar >= config.minComplexity
        console.log(`  Step ${i + 1}: Complexity so far = ${complexitySoFar}. Within range? ${isWithinRange}`)

        if(isWithinRange){
          console.log(`    ✓ Adding candidate: [${selectedModules.map(m => m.name).join(', ')}]`)
          candidateLists.push([...selectedModules])
        }

      } else {
        console.log(`    Skipping module "${module.name}" (complexity: ${module.complexity}) - would exceed max (${newComplexity} > ${config.maxComplexity})`)
      }  
    }
    
    console.log(`Total candidates generated: ${candidateLists.length}`)
    console.log('Candidate lists:')
    candidateLists.forEach((list, idx) => {
      const totalComplexity = list.reduce((sum, m) => sum + m.complexity, 0)
      console.log(`  ${idx + 1}. [${list.map(m => `${m.name}(${m.complexity})`).join(', ')}] - Total: ${totalComplexity}`)
    })
    
    // Pick a random candidate list, or empty if no candidates
    let modulesResult: Addition[] | null = null
    if (candidateLists.length > 0) {
      modulesResult = candidateLists[Math.floor(Math.random() * candidateLists.length)]
      const selectedComplexity = modulesResult.reduce((sum, m) => sum + m.complexity, 0)
      console.log(`Selected candidate: [${modulesResult.map(m => `${m.name}(${m.complexity})`).join(', ')}] - Total: ${selectedComplexity}`)
    } else {
      console.log('No valid candidates found!')
    }
    
    console.log('=== Module Generation Complete ===\n')

    return {
      milestones: milestonesResult,
      reserveCards: reserveCardsResult,
      modules: modulesResult,
    }
  }

  const results = generateResults()
  return (
    <div style={styles.container}>
      <div style={styles.scrollContent}>
        <h1>Generated Setup</h1>
        
        <div style={styles.section}>
          <div style={styles.resultBox}><p style={styles.resultText}>Milestones: <b>{results.milestones}</b></p></div>
          <div style={styles.resultBox}><p style={styles.resultText}>Reserve Cards: <b>{results.reserveCards}</b></p></div>
        </div>

        {/* Modules Section */}
        <div style={styles.section}>
          <h2>Modules</h2>
          <div style={styles.resultBox}>
            {results.modules !== null ? (
              <>
                <ul style={styles.modulesList}>
                  {results.modules.map((module) => (
                    <li key={`${module.name}-${resultVersion}`} style={styles.moduleItem}>
                      <span style={styles.moduleName}>{module.name}</span>
                      <span style={styles.moduleComplexity}>{module.complexity}</span>
                    </li>
                  ))}
                </ul>
                <div style={styles.totalComplexity}>
                  Total Complexity: <span style={styles.totalValue}>
                    {results.modules.reduce((sum, m) => sum + m.complexity, 0)}
                  </span>
                </div>
              </>
            ) : (
              <p style={styles.resultText}>Unable to compile a list of modules within the specified complexity range</p>
            )}
          </div>
        </div>
      </div>

      <div style={styles.buttonBar}>
        <button onClick={onBack} style={styles.secondaryButton}>
          Back to Configuration
        </button>
        <button onClick={onRegenerate} style={styles.primaryButton}>
          Regenerate
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    width: '100%',
    maxWidth: '700px',
    minHeight: '100vh',
    margin: '0 auto',
    padding: '40px 40px 120px',
    boxSizing: 'border-box' as const,
    backgroundColor: themeColors.bgPrimary,
    color: themeColors.textPrimary,
    display: 'flex',
    flexDirection: 'column' as const,
    position: 'relative' as const,
  } as const,
  scrollContent: {
    flex: 1,
    paddingBottom: '20px',
  } as const,
  section: {
    marginBottom: '18px',
    padding: '18px 0 0',
    borderTop: `1px solid ${themeColors.borderColor}`,
    backgroundColor: 'transparent',
    borderRadius: 0,
  } as const,
  resultBox: {
    padding: '10px 0 0',
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: 0,
    minHeight: '40px',
  } as const,
  resultText: {
    fontSize: '16px',
    lineHeight: '1.6',
    margin: 0,
    fontWeight: '500' as const,
    color: themeColors.textPrimary,
  } as const,
  modulesList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  } as const,
  moduleItem: {
    padding: '8px 0',
    fontSize: '16px',
    textTransform: 'capitalize' as const,
    borderBottom: `1px solid ${themeColors.borderColor}`,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: themeColors.textPrimary,
  } as const,
  moduleName: {
    flex: 1,
  } as const,
  moduleComplexity: {
    fontWeight: 'bold',
    color: themeColors.accentPrimary,
    minWidth: '30px',
    textAlign: 'center' as const,
  } as const,
  totalComplexity: {
    marginTop: '12px',
    paddingTop: '10px',
    borderTop: `1px solid ${themeColors.borderColor}`,
    fontSize: '16px',
    fontWeight: '600' as const,
    color: themeColors.textPrimary,
  } as const,
  totalValue: {
    color: themeColors.accentPrimary,
    fontWeight: 'bold',
  } as const,
  buttonBar: {
    position: 'fixed' as const,
    left: '50%',
    bottom: '20px',
    transform: 'translateX(-50%)',
    width: 'min(700px, calc(100% - 24px))',
    maxWidth: '700px',
    backgroundColor: themeColors.bgPrimary,
    border: `1px solid ${themeColors.borderColor}`,
    borderRadius: '12px',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.12)',
    padding: '16px 0',
    display: 'flex',
    gap: '12px',
    justifyContent: 'center',
    zIndex: 10,
  } as const,
  primaryButton: {
    padding: '12px 20px',
    fontSize: '18px',
    backgroundColor: themeColors.accentPrimary,
    color: '#ffffff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'opacity 0.2s',
  } as const,
  secondaryButton: {
    padding: '12px 20px',
    fontSize: '18px',
    backgroundColor: themeColors.bgCard,
    color: themeColors.textPrimary,
    border: `1px solid ${themeColors.borderColor}`,
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'opacity 0.2s',
  } as const,
};
