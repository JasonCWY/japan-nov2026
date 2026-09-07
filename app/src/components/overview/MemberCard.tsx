import type { Member } from '../../data/members'

const tagClasses: Record<Member['tags'][number], string> = {
  male: 'bg-info/15 text-info',
  female: 'bg-primary/15 text-primary',
  muslim: 'bg-success/15 text-success',
}

const tagLabel: Record<Member['tags'][number], string> = {
  male: 'Male',
  female: 'Female',
  muslim: 'Muslim',
}

export function MemberCard({ member }: { member: Member }) {
  return (
    <div className="flex items-center gap-3 py-2">
      <div
        className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
        style={{ background: member.color }}
      >
        {member.initials}
      </div>
      <div>
        <div className="font-semibold text-ink">{member.name}</div>
        <div className="flex gap-1.5 mt-0.5">
          {member.tags.map((tag) => (
            <span key={tag} className={`text-[11px] font-medium rounded-full px-2 py-0.5 ${tagClasses[tag]}`}>
              {tagLabel[tag]}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
