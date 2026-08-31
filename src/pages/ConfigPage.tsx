import { useState, useEffect, useRef } from 'react'

interface ConfigPageProps {
  onGenerate: (config: ConfigSettings) => void;
}

export interface Addition {
  name: string;
  enabled: boolean;
  complexity: number;
}

export interface ConfigSettings {
  minComplexity: number;
  maxComplexity: number;
  replacements: {
    newChallengesChance: number;
    hardChoicesChance: number;
    newReserveCardsChance: number;
  };
  additions: Addition[];
}

const DEFAULT_ADDITIONS: Addition[] = [
  { name: 'lobbyists', enabled: true, complexity: 3 },
  { name: 'coffee', enabled: true, complexity: 3 },
  { name: 'kimchi', enabled: true, complexity: 2 },
  { name: 'sushi', enabled: true, complexity: 2 },
  { name: 'noodles', enabled: true, complexity: 2 },
  { name: 'ketchup', enabled: true, complexity: 1 },
  { name: 'fry chefs', enabled: true, complexity: 1 },
  { name: 'night shift', enabled: true, complexity: 1 },
  { name: 'mass marketeers', enabled: true, complexity: 1 },
  { name: 'rural marketeers', enabled: true, complexity: 2 },
  { name: 'food critics', enabled: true, complexity: 1 },
  { name: 'movie stars', enabled: true, complexity: 1 },
]

const DEFAULT_MIN_COMPLEXITY = 5
const DEFAULT_MAX_COMPLEXITY = 8
const DEFAULT_REPLACEMENTS = {
  newChallengesChance: 50,
  hardChoicesChance: 50,
  newReserveCardsChance: 50,
}

const getDefaultAdditions = (): Addition[] => DEFAULT_ADDITIONS.map((addition) => ({ ...addition }))

const loadFromStorage = <T,>(key: string, defaultValue: T): T => {
  try {
    const saved = localStorage.getItem('foodChainConfig')
    return saved ? JSON.parse(saved)[key] ?? defaultValue : defaultValue
  } catch {
    return defaultValue
  }
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

export function ConfigPage({ onGenerate }: ConfigPageProps) {
  const sliderStartRef = useRef<Record<string, { x: number; y: number }>>({})

  // Initialize state from localStorage immediately to avoid race condition
  const [minComplexity, setMinComplexity] = useState(() => loadFromStorage('minComplexity', DEFAULT_MIN_COMPLEXITY))
  const [maxComplexity, setMaxComplexity] = useState(() => loadFromStorage('maxComplexity', DEFAULT_MAX_COMPLEXITY))
  const [newChallengesChance, setNewChallengesChance] = useState(() => loadFromStorage('newChallengesChance', DEFAULT_REPLACEMENTS.newChallengesChance))
  const [hardChoicesChance, setHardChoicesChance] = useState(() => loadFromStorage('hardChoicesChance', DEFAULT_REPLACEMENTS.hardChoicesChance))
  const [newReserveCardsChance, setNewReserveCardsChance] = useState(() => loadFromStorage('newReserveCardsChance', DEFAULT_REPLACEMENTS.newReserveCardsChance))
  const [additions, setAdditions] = useState(() => loadFromStorage('additions', getDefaultAdditions()))

  // Save to localStorage whenever state changes
  useEffect(() => {
    try {
      const configToSave = {
        minComplexity,
        maxComplexity,
        newChallengesChance,
        hardChoicesChance,
        newReserveCardsChance,
        additions,
      }
      localStorage.setItem('foodChainConfig', JSON.stringify(configToSave))
    } catch (error) {
      console.error('Failed to save config to localStorage:', error)
    }
  }, [minComplexity, maxComplexity, newChallengesChance, hardChoicesChance, newReserveCardsChance, additions])

  const handleMinComplexityChange = (value: number) => {
    if (value <= maxComplexity) {
      setMinComplexity(value)
    }
  }

  const handleMaxComplexityChange = (value: number) => {
    if (value >= minComplexity) {
      setMaxComplexity(value)
    }
  }

  const handleAdditionToggle = (index: number) => {
    const updatedAdditions = [...additions]
    updatedAdditions[index].enabled = !updatedAdditions[index].enabled
    setAdditions(updatedAdditions)

    // Recalculate complexity limits
    const newSum = calculateAdditionsSum(updatedAdditions)
    if (minComplexity > newSum) {
      setMinComplexity(newSum)
    }
    if (maxComplexity > newSum) {
      setMaxComplexity(newSum)
    }
  }

  const handleAdditionComplexityChange = (index: number, complexity: number) => {
    const updatedAdditions = [...additions]
    updatedAdditions[index].complexity = complexity
    setAdditions(updatedAdditions)

    // Recalculate complexity limits
    const newSum = calculateAdditionsSum(updatedAdditions)
    if (minComplexity > newSum) {
      setMinComplexity(newSum)
    }
    if (maxComplexity > newSum) {
      setMaxComplexity(newSum)
    }
  }

  const calculateAdditionsSum = (additionsList: Addition[]): number => {
    return additionsList.reduce((sum, addition) => {
      return addition.enabled ? sum + addition.complexity : sum
    }, 0)
  }

  const resetComplexity = () => {
    setMinComplexity(DEFAULT_MIN_COMPLEXITY)
    setMaxComplexity(DEFAULT_MAX_COMPLEXITY)
  }

  const resetMilestones = () => {
    setNewChallengesChance(DEFAULT_REPLACEMENTS.newChallengesChance)
    setHardChoicesChance(DEFAULT_REPLACEMENTS.hardChoicesChance)
  }

  const resetReserveCards = () => {
    setNewReserveCardsChance(DEFAULT_REPLACEMENTS.newReserveCardsChance)
  }

  const resetAdditions = () => {
    setAdditions(getDefaultAdditions())
  }

  const resetAll = () => {
    resetComplexity()
    resetMilestones()
    resetReserveCards()
    resetAdditions()
  }

  const additionsSum = calculateAdditionsSum(additions)

  const handleSliderPointerDown = (sliderId: string, event: React.PointerEvent<HTMLElement>) => {
    sliderStartRef.current[sliderId] = { x: event.clientX, y: event.clientY }
  }

  const handleSliderPointerMove = (sliderId: string, event: React.PointerEvent<HTMLElement>) => {
    const startPoint = sliderStartRef.current[sliderId]
    if (!startPoint) return

    const deltaX = Math.abs(event.clientX - startPoint.x)
    const deltaY = Math.abs(event.clientY - startPoint.y)

    if (deltaY > 12 && deltaY > deltaX) {
      event.preventDefault()
      return
    }
  }

  const handleSliderPointerEnd = (sliderId: string) => {
    if (sliderStartRef.current[sliderId]) {
      delete sliderStartRef.current[sliderId]
    }
  }

  const handleGenerateClick = () => {
    const config: ConfigSettings = {
      minComplexity,
      maxComplexity,
      replacements: {
        newChallengesChance,
        hardChoicesChance,
        newReserveCardsChance,
      },
      additions,
    }
    onGenerate(config)
  }

  return (
    <div style={styles.container}>
      <div style={styles.scrollContent}>
        <div style={styles.headerRow}>
          <h1>Generator Config</h1>
          <button type="button" onClick={resetAll} style={styles.headerResetButton}>
            Reset all
          </button>
        </div>


              {/* Replacements Section */}
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <h3>Milestones</h3>
            <button type="button" onClick={resetMilestones} style={styles.sectionResetButton}>
              Reset
            </button>
          </div>
          
          <div style={styles.configItem}>
            <label htmlFor="newMilestones">
              New Milestones: <span style={styles.value}>{newChallengesChance}%</span>
            </label>
            <div
              onPointerDown={(event) => handleSliderPointerDown('newMilestones', event)}
              onPointerMove={(event) => handleSliderPointerMove('newMilestones', event)}
              onPointerUp={() => handleSliderPointerEnd('newMilestones')}
              onPointerLeave={() => handleSliderPointerEnd('newMilestones')}
              style={styles.sliderWrapper}
            >
              <input
                id="newMilestones"
                type="range"
                min="0"
                max="100"
                step="5"
                value={newChallengesChance}
                onChange={(e) => setNewChallengesChance(Number(e.target.value))}
                style={styles.slider}
              />
            </div>
          </div>

          <div style={styles.configItem}>
            <label htmlFor="hardChoices">
              Hard Choices if Old Milestones: <span style={styles.value}>{hardChoicesChance}%</span>
            </label>
            <div
              onPointerDown={(event) => handleSliderPointerDown('hardChoices', event)}
              onPointerMove={(event) => handleSliderPointerMove('hardChoices', event)}
              onPointerUp={() => handleSliderPointerEnd('hardChoices')}
              onPointerLeave={() => handleSliderPointerEnd('hardChoices')}
              style={styles.sliderWrapper}
            >
              <input
                id="hardChoices"
                type="range"
                min="0"
                max="100"
                step="5"
                value={hardChoicesChance}
                onChange={(e) => setHardChoicesChance(Number(e.target.value))}
                style={styles.slider}
              />
            </div>
          </div>

          
        </div>

        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <h3>Reserve Cards</h3>
            <button type="button" onClick={resetReserveCards} style={styles.sectionResetButton}>
              Reset
            </button>
          </div>

          <div style={styles.configItem}>
            <label htmlFor="newReserveCards">
              New Reserve Cards: <span style={styles.value}>{newReserveCardsChance}%</span>
            </label>
            <div
              onPointerDown={(event) => handleSliderPointerDown('newReserveCards', event)}
              onPointerMove={(event) => handleSliderPointerMove('newReserveCards', event)}
              onPointerUp={() => handleSliderPointerEnd('newReserveCards')}
              onPointerLeave={() => handleSliderPointerEnd('newReserveCards')}
              style={styles.sliderWrapper}
            >
              <input
                id="newReserveCards"
                type="range"
                min="0"
                max="100"
                step="5"
                value={newReserveCardsChance}
                onChange={(e) => setNewReserveCardsChance(Number(e.target.value))}
                style={styles.slider}
              />
            </div>
          </div>
          </div>

        
        {/* Complexity Section */}
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <h3>Complexity</h3>
            <button type="button" onClick={resetComplexity} style={styles.sectionResetButton}>
              Reset
            </button>
          </div>
          
          <div style={styles.configItem}>
            <label htmlFor="minComplexity">
              Minimum Complexity: <span style={styles.value}>{minComplexity}</span>
            </label>
            <div
              onPointerDown={(event) => handleSliderPointerDown('minComplexity', event)}
              onPointerMove={(event) => handleSliderPointerMove('minComplexity', event)}
              onPointerUp={() => handleSliderPointerEnd('minComplexity')}
              onPointerLeave={() => handleSliderPointerEnd('minComplexity')}
              style={styles.sliderWrapper}
            >
              <input
                id="minComplexity"
                type="range"
                min="0"
                max={additionsSum}
                value={minComplexity}
                onChange={(e) => handleMinComplexityChange(Number(e.target.value))}
                style={styles.slider}
              />
            </div>
            <div style={styles.helperText}>Max: {additionsSum} (sum of all enabled modules)</div>
          </div>

          <div style={styles.configItem}>
            <label htmlFor="maxComplexity">
              Maximum Complexity: <span style={styles.value}>{maxComplexity}</span>
            </label>
            <div
              onPointerDown={(event) => handleSliderPointerDown('maxComplexity', event)}
              onPointerMove={(event) => handleSliderPointerMove('maxComplexity', event)}
              onPointerUp={() => handleSliderPointerEnd('maxComplexity')}
              onPointerLeave={() => handleSliderPointerEnd('maxComplexity')}
              style={styles.sliderWrapper}
            >
              <input
                id="maxComplexity"
                type="range"
                min="0"
                max={additionsSum}
                value={maxComplexity}
                onChange={(e) => handleMaxComplexityChange(Number(e.target.value))}
                style={styles.slider}
              />
            </div>
            <div style={styles.helperText}>Max: {additionsSum} (sum of all enabled modules)</div>
          </div>
        </div>



        {/* Additions Section */}
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <h3>Modules</h3>
            <button type="button" onClick={resetAdditions} style={styles.sectionResetButton}>
              Reset
            </button>
          </div>
          <div style={styles.additionsList}>
            {additions.map((addition, index) => (
              <div
                key={addition.name}
                style={styles.additionItem}
              >
                <div style={styles.additionHeader}>
                  <input
                    type="checkbox"
                    checked={addition.enabled}
                    onChange={() => handleAdditionToggle(index)}
                    style={styles.checkbox}
                  />
                  <label style={{...styles.additionName, opacity: addition.enabled ? 1 : 0.5,}}>{addition.name}</label>
                </div>
                <div
                  style={{
                    ...styles.additionSliderContainer,
                    opacity: addition.enabled ? 1 : 0.5,
                    pointerEvents: addition.enabled ? 'auto' : 'none',
                  }}
                >
                  <label htmlFor={`addition-${index}`}>
                    Complexity: <span style={styles.value}>{addition.complexity}</span>
                  </label>
                  <div
                    onPointerDown={(event) => handleSliderPointerDown(`addition-${index}`, event)}
                    onPointerMove={(event) => handleSliderPointerMove(`addition-${index}`, event)}
                    onPointerUp={() => handleSliderPointerEnd(`addition-${index}`)}
                    onPointerLeave={() => handleSliderPointerEnd(`addition-${index}`)}
                    style={styles.sliderWrapper}
                  >
                    <input
                      id={`addition-${index}`}
                      type="range"
                      min="1"
                      max="5"
                      value={addition.complexity}
                      onChange={(e) => handleAdditionComplexityChange(index, Number(e.target.value))}
                      style={styles.slider}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={styles.buttonBar}>
        <button onClick={handleGenerateClick} style={styles.button}>
          GENERATE
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
  headerRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '12px',
    marginBottom: '18px',
  } as const,
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '12px',
    marginBottom: '12px',
  } as const,
  headerResetButton: {
    padding: '8px 12px',
    fontSize: '14px',
    backgroundColor: 'transparent',
    color: themeColors.textPrimary,
    border: `1px solid ${themeColors.borderColor}`,
    borderRadius: '6px',
    cursor: 'pointer',
  } as const,
  sectionResetButton: {
    padding: '4px 8px',
    fontSize: '11px',
    backgroundColor: 'transparent',
    color: themeColors.textSecondary,
    border: `1px solid ${themeColors.borderColor}`,
    borderRadius: '999px',
    cursor: 'pointer',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.08em',
  } as const,
  configItem: {
    marginBottom: '14px',
  } as const,
  sliderWrapper: {
    width: '100%',
    touchAction: 'pan-y',
    WebkitTapHighlightColor: 'transparent',
  } as const,
  slider: {
    width: '100%',
    height: '8px',
    marginTop: '8px',
    cursor: 'pointer',
    touchAction: 'pan-y',
    WebkitTapHighlightColor: 'transparent',
  } as const,
  value: {
    fontWeight: 'bold',
    color: themeColors.accentPrimary,
  } as const,
  helperText: {
    fontSize: '12px',
    color: themeColors.textSecondary,
    marginTop: '4px',
  } as const,
  additionsList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '10px',
  } as const,
  additionItem: {
    padding: '8px 0',
    borderBottom: `1px solid ${themeColors.borderColor}`,
    backgroundColor: 'transparent',
    transition: 'opacity 0.2s',
  } as const,
  additionHeader: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '8px',
    gap: '10px',
  } as const,
  checkbox: {
    width: '18px',
    height: '18px',
    cursor: 'pointer',
  } as const,
  additionName: {
    fontSize: '16px',
    fontWeight: '500' as const,
    textTransform: 'capitalize' as const,
    margin: 0,
    color: themeColors.textPrimary,
  } as const,
  additionSliderContainer: {
    paddingLeft: '28px',
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
    justifyContent: 'center',
    zIndex: 10,
  } as const,
  button: {
    padding: '12px 32px',
    fontSize: '18px',
    backgroundColor: themeColors.accentPrimary,
    color: '#ffffff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'opacity 0.2s',
  } as const,
};
