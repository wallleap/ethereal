export function validJSON(json) {
  if (typeof json !== 'string') {
    return false
  }

  const trimmed = json.trim()
  if (trimmed.length === 0) {
    return false
  }

  try {
    JSON.parse(trimmed)
    return true
  } catch (error) {
    return false
  }
}