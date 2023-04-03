export const stringify = (data) => {
  if (Array.isArray(data)) {
    return data.map(stringify).join(' ')
  }

  if (typeof data === 'object') {
    if (Object.keys(data).length) {
      return JSON.stringify(data)
    }
    return ''
  }

  return data
}
