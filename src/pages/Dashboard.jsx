import TitleSection from '../components/TitleSection';
import USAMap from '../components/USAMap';
import DensityChoropleth from '../components/DensityChoropleth';
import RegionMap from '../components/RegionMap';
import MarketDetailsPopup from '../components/MarketDetailsPopup';
import Legend from '../components/Legend';

const Dashboard = () => (
  <div style={{
    width: '100%',
    maxWidth: 1800,           // Adjust to your preferred max width (e.g., 1200, 1400, 1600)
    margin: '0 auto',         // Centers it in the viewport
    padding: 32,
    boxSizing: 'border-box'   // Ensures padding is included in width
  }}>
    <TitleSection />

    {/* Flex row: USAMap and RegionMap */}
    <section style={{ display: 'flex', gap: 32, marginBottom: 32 }}>
      <div style={{ flex: 1 }}>
        <USAMap />
      </div>
      <div style={{ flex: 1 }}>
        <RegionMap />
      </div>
    </section>

    {/* DensityChoropleth full width */}
    <section style={{ width: '100%', marginBottom: 32 }}>
      <DensityChoropleth />
    </section>

    <section style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 32 }}>
      <Legend />
      {/* Add icons or other illustrative elements here */}
    </section>

    {/* Attribution/source can go at the bottom */}
    <footer style={{ fontSize: '0.85rem', color: '#999', marginTop: 24 }}>
      Data sources: USDA &amp; Census Bureau
    </footer>
  </div>
);

export default Dashboard;
