import { itinerary } from '../../data/itinerary'
import { InfoBox } from '../common/InfoBox'
import { DayAccordion } from './DayAccordion'

export function ItineraryTab() {
  return (
    <div className="space-y-4">
      <InfoBox tone="blue">
        📌 Group has confirmed <strong>Plan A</strong>. All days follow this itinerary.
      </InfoBox>
      {itinerary.map((entry) => (
        <DayAccordion key={entry.day} entry={entry} />
      ))}
    </div>
  )
}
