import { useState, useEffect } from 'react'

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
  { name: 'lobbyist', enabled: true, complexity: 3 },
  { name: 'cofee', enabled: true, complexity: 3 },
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
  // Initialize state from localStorage immediately to avoid race condition
  const [minComplexity, setMinComplexity] = useState(() => loadFromStorage('minComplexity', 5))
  const [maxComplexity, setMaxComplexity] = useState(() => loadFromStorage('maxComplexity', 8))
  const [newChallengesChance, setNewChallengesChance] = useState(() => loadFromStorage('newChallengesChance', 50))
  const [hardChoicesChance, setHardChoicesChance] = useState(() => loadFromStorage('hardChoicesChance', 50))
  const [newReserveCardsChance, setNewReserveCardsChance] = useState(() => loadFromStorage('newReserveCardsChance', 50))
  const [additions, setAdditions] = useState(() => loadFromStorage('additions', DEFAULT_ADDITIONS))

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

  const additionsSum = calculateAdditionsSum(additions)

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
      <h1>Food Chain Configuration</h1>
      
      {/* Complexity Section */}
      <div style={styles.section}>
        <h2>Complexity</h2>
        
        <div style={styles.configItem}>
          <label htmlFor="minComplexity">
            Minimum Complexity: <span style={styles.value}>{minComplexity}</span>
          </label>
          <input
            id="minComplexity"
            type="range"
            min="0"
            max={additionsSum}
            value={minComplexity}
            onChange={(e) => handleMinComplexityChange(Number(e.target.value))}
            style={styles.slider}
          />
          <div style={styles.helperText}>Max: {additionsSum} (sum of all enabled additions)</div>
        </div>

        <div style={styles.configItem}>
          <label htmlFor="maxComplexity">
            Maximum Complexity: <span style={styles.value}>{maxComplexity}</span>
          </label>
          <input
            id="maxComplexity"
            type="range"
            min="0"
            max={additionsSum}
            value={maxComplexity}
            onChange={(e) => handleMaxComplexityChange(Number(e.target.value))}
            style={styles.slider}
          />
          <div style={styles.helperText}>Max: {additionsSum} (sum of all enabled additions)</div>
        </div>
      </div>

      {/* Replacements Section */}
      <div style={styles.section}>
        <h2>Replacements</h2>
        
        <div style={styles.configItem}>
          <label htmlFor="newMilestones">
            New Milestones Chance: <span style={styles.value}>{newChallengesChance}%</span>
          </label>
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

        <div style={styles.configItem}>
          <label htmlFor="hardChoices">
            Hard Choices for Old Milestones Chance: <span style={styles.value}>{hardChoicesChance}%</span>
          </label>
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

        <div style={styles.configItem}>
          <label htmlFor="newReserveCards">
            New Reserve Cards Chance: <span style={styles.value}>{newReserveCardsChance}%</span>
          </label>
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

      {/* Additions Section */}
      <div style={styles.section}>
        <h2>Additions</h2>
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
                <label style={styles.additionName}>{addition.name}</label>
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
          ))}
        </div>
      </div>

      <button onClick={handleGenerateClick} style={styles.button}>
        GENERATE
      </button>
    </div>
  );
}

const styles = {
  container: {
    padding: '40px',
    maxWidth: '700px',
    margin: '0 auto',
    backgroundColor: themeColors.bgPrimary,
    color: themeColors.textPrimary,
  } as const,
  section: {
    marginBottom: '30px',
    padding: '20px',
    border: `1px solid ${themeColors.borderColor}`,
    borderRadius: '8px',
    backgroundColor: themeColors.bgSecondary,
  } as const,
  configItem: {
    marginBottom: '20px',
  } as const,
  slider: {
    width: '100%',
    height: '8px',
    marginTop: '8px',
    cursor: 'pointer',
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
    gap: '15px',
  } as const,
  additionItem: {
    padding: '15px',
    border: `1px solid ${themeColors.borderColor}`,
    borderRadius: '6px',
    backgroundColor: themeColors.bgCard,
    transition: 'opacity 0.2s',
  } as const,
  additionHeader: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '12px',
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
