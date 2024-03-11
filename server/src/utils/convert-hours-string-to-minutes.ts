export function converHoursStringToMinutes(hour: string) {
  const [hours, minutes] = hour.split(':').map(Number)
  const hourInMinutes = (hours * 60) + minutes

  return hourInMinutes
}