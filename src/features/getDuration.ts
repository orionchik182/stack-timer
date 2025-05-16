export function getDuration(start: string, end: string): number {
  const clean = (time: string) => time.replace(/\u202f|\u00a0/g, '').trim()

  const [sh, sm] = clean(start).split(':').map(Number)
  const [eh, em] = clean(end).split(':').map(Number)

  return eh * 60 + em - (sh * 60 + sm)
}
