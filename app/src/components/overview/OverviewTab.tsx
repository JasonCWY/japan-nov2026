import { members } from '../../data/members'
import { flights, flightsIntro } from '../../data/flights'
import { stats } from '../../data/overviewMisc'
import { Card } from '../common/Card'
import { StatBox } from '../common/StatBox'
import { InfoBox } from '../common/InfoBox'
import { MemberCard } from './MemberCard'
import { FlightCard } from './FlightCard'
import { TransportQuickRef } from './TransportQuickRef'
import { AccommodationSummary } from './AccommodationSummary'

export function OverviewTab() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        {stats.map((s) => (
          <StatBox key={s.label} value={s.value} label={s.label} />
        ))}
      </div>

      <Card title="👥 Group Members">
        <div className="divide-y divide-line">
          {members.map((m) => (
            <MemberCard key={m.name} member={m} />
          ))}
        </div>
      </Card>

      <Card title="✈️ Flights Summary">
        <InfoBox tone="green">{flightsIntro}</InfoBox>
        {flights.map((f) => (
          <FlightCard key={f.label} flight={f} />
        ))}
      </Card>

      <Card title="🚆 Transport Quick Reference">
        <TransportQuickRef />
      </Card>

      <Card title="🏨 Accommodation">
        <AccommodationSummary />
      </Card>
    </div>
  )
}
