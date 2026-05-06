import SearchBar from '../components/SearchBar';
import QuickTiles from '../components/QuickTiles';
import RecentHistory from '../components/RecentHistory';
import Bookmarks from '../components/Bookmarks';

export default function Home() {
  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', padding: '48px 20px 80px' }}>
      {/* Hero search */}
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <h1
          className="chrome-text"
          style={{ fontFamily: 'var(--font-mono)', fontSize: 'clamp(28px, 5vw, 44px)', fontWeight: 500, letterSpacing: '0.08em', marginBottom: '24px' }}
        >
          agentiz
        </h1>
        <SearchBar />
      </div>

      {/* Quick tiles */}
      <div style={{ marginBottom: '40px' }}>
        <QuickTiles />
      </div>

      {/* Bookmarks */}
      <div style={{ marginBottom: '32px' }}>
        <Bookmarks />
      </div>

      {/* Recent history */}
      <RecentHistory />
    </div>
  );
}
