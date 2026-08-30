import { useState } from 'react'

interface ConfigPageProps {
  onGenerate: (config: ConfigSettings) => void;
}

export interface ConfigSettings {
  minComplexity: number;
  maxComplexity: number;
  replacements: string;
  additions: string;
}

export function ConfigPage({ onGenerate }: ConfigPageProps) {
  const [minComplexity, setMinComplexity] = useState(5)
  const [maxComplexity, setMaxComplexity] = useState(8)
  const [replacements, setReplacements] = useState('')
  const [additions, setAdditions] = useState('')

  const handleMinComplexityChange = (value: number) => {
    // Prevent min from going above max
    if (value <= maxComplexity) {
      setMinComplexity(value)
    }
  }

  const handleMaxComplexityChange = (value: number) => {
    // Prevent max from going below min
    if (value >= minComplexity) {
      setMaxComplexity(value)
    }
  }

  const handleGenerateClick = () => {
    const config: ConfigSettings = {
      minComplexity,
      maxComplexity,
      replacements,
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
            max="20"
            value={minComplexity}
            onChange={(e) => handleMinComplexityChange(Number(e.target.value))}
            style={styles.slider}
          />
        </div>

        <div style={styles.configItem}>
          <label htmlFor="maxComplexity">
            Maximum Complexity: <span style={styles.value}>{maxComplexity}</span>
          </label>
          <input
            id="maxComplexity"
            type="range"
            min="0"
            max="20"
            value={maxComplexity}
            onChange={(e) => handleMaxComplexityChange(Number(e.target.value))}
            style={styles.slider}
          />
        </div>
      </div>

      {/* Replacements Section */}
      <div style={styles.section}>
        <h2>Replacements</h2>
        <textarea
          placeholder="Enter replacements here..."
          value={replacements}
          onChange={(e) => setReplacements(e.target.value)}
          style={styles.textarea}
        />
      </div>

      {/* Additions Section */}
      <div style={styles.section}>
        <h2>Additions</h2>
        <textarea
          placeholder="Enter additions here..."
          value={additions}
          onChange={(e) => setAdditions(e.target.value)}
          style={styles.textarea}
        />
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
    maxWidth: '600px',
    margin: '0 auto',
  } as const,
  section: {
    marginBottom: '30px',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    backgroundColor: '#fafafa',
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
    color: '#007bff',
  } as const,
  textarea: {
    width: '100%',
    minHeight: '80px',
    padding: '8px',
    fontSize: '14px',
    fontFamily: 'monospace',
    borderRadius: '4px',
    border: '1px solid #ddd',
    boxSizing: 'border-box' as const,
  } as const,
  button: {
    padding: '12px 32px',
    fontSize: '18px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  } as const,
};
