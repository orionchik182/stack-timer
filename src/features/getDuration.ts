export function getDuration(start: string, end: string): number {
  
  const [sh, sm] = start.split(':').map(Number)
  const [eh, em] = end.split(':').map(Number)

  return eh * 60 + em - (sh * 60 + sm)
}