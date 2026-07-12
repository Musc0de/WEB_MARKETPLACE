export const Button = ({ children }: { children: any }) => {
  return (
    <button
      type='button'
      style={{
        padding: '0.5rem 1rem',
        background: 'blue',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
      }}
    >
      {children}
    </button>
  );
};
