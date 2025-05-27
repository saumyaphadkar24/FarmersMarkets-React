const TitleSection = () => (
  <header style={{
    marginBottom: 32,
    textAlign: 'center',
    fontFamily: "'Times New Roman', Times, serif",
    background: 'transparent'
  }}>
    <h1 style={{
      fontSize: '3rem',
      fontWeight: 600,
      color: '#235637', // dark green
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      marginBottom: 12
    }}>
      Farmers Markets
    </h1>
    <p style={{
      fontSize: '1.1rem',
      color: '#37413a',
      marginBottom: 12,
      maxWidth: 700,
      margin: '0 auto'
    }}>
      The dataset contains information about various farmers markets, including their names, locations, associated websites and social media presence, product offerings, and last update timestamps.
    </p>
  </header>
);

export default TitleSection;
