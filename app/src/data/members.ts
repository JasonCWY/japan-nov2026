export interface Member {
  name: string
  initials: string
  color: string
  tags: ('male' | 'female' | 'muslim')[]
}

export const members: Member[] = [
  { name: 'JasonCWY', initials: 'J', color: '#3498db', tags: ['male'] },
  { name: 'Ray', initials: 'R', color: '#9b59b6', tags: ['male'] },
  { name: 'Sab1', initials: 'S1', color: '#e91e63', tags: ['female', 'muslim'] },
  { name: 'Sab2', initials: 'S2', color: '#e91e63', tags: ['female', 'muslim'] },
  { name: 'Nadia', initials: 'N', color: '#ff7043', tags: ['female', 'muslim'] },
  { name: 'Kai Nin', initials: 'K', color: '#26a69a', tags: ['female'] },
]
