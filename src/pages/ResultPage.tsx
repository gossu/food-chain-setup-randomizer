interface ResultPageProps {
  onBack: () => void;
  result?: string;
}

export function ResultPage({ onBack, result }: ResultPageProps) {
  return (
    <div style={styles.container}>
      <h1>Results</h1>
      
      {/* Display generated results here */}
      <div style={styles.resultSection}>
        <p style={styles.resultText}>
          {result || 'Your generated content will appear here...'}
        </p>
      </div>

      <button onClick={onBack} style={styles.button}>
        Back to Configuration
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
  resultSection: {
    marginBottom: '40px',
    padding: '20px',
    backgroundColor: '#f5f5f5',
    border: '1px solid #ddd',
    borderRadius: '8px',
    minHeight: '200px',
  } as const,
  resultText: {
    fontSize: '16px',
    lineHeight: '1.6',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word' as const,
  } as const,
  button: {
    padding: '12px 32px',
    fontSize: '18px',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  } as const,
};
