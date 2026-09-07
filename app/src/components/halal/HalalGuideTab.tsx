import {
  halalIntro,
  tokyoHotspots,
  osakaHotspots,
  generallySafe,
  alwaysCheck,
  recommendedApps,
  prayerFacilities,
} from '../../data/halal'
import { Card } from '../common/Card'
import { InfoBox } from '../common/InfoBox'
import { HalalHotspotTable } from './HalalHotspotTable'

function List({ items }: { items: string[] }) {
  return (
    <ul className="list-disc pl-5 space-y-1 text-sm text-ink-muted">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  )
}

export function HalalGuideTab() {
  return (
    <div className="space-y-4">
      <InfoBox tone="green">{halalIntro}</InfoBox>

      <Card title="🗼 Tokyo — Halal Hotspots">
        <HalalHotspotTable rows={tokyoHotspots} />
      </Card>

      <Card title="🏙️ Osaka — Halal Hotspots">
        <HalalHotspotTable rows={osakaHotspots} />
      </Card>

      <Card title="🍜 Halal Food Checklist">
        <div className="space-y-4">
          <div>
            <p className="text-sm font-semibold mb-1.5">Generally Safe (verify each restaurant):</p>
            <List items={generallySafe} />
          </div>
          <div>
            <p className="text-sm font-semibold mb-1.5">Always Check / Avoid:</p>
            <List items={alwaysCheck} />
          </div>
          <div>
            <p className="text-sm font-semibold mb-1.5">Recommended Apps:</p>
            <List items={recommendedApps} />
          </div>
        </div>
      </Card>

      <Card title="🕌 Prayer & Facilities">
        <List items={prayerFacilities} />
      </Card>
    </div>
  )
}
