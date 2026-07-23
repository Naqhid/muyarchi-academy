const allowedTags = new Set(['p', 'br', 'strong', 'b', 'em', 'i', 'u', 'h1', 'h2', 'h3', 'h4', 'ul', 'ol', 'li', 'blockquote', 'pre', 'code', 'hr', 'a', 'img'])

export function isSafeExternalUrl(value: string): boolean {
  try { return ['http:', 'https:'].includes(new URL(value).protocol) } catch { return false }
}

export function sanitizeHtml(html: string): string {
  const document = new DOMParser().parseFromString(html, 'text/html')
  document.body.querySelectorAll('*').forEach((element) => {
    const tag = element.tagName.toLowerCase()
    if (!allowedTags.has(tag)) { element.replaceWith(...Array.from(element.childNodes)); return }
    Array.from(element.attributes).forEach((attribute) => {
      const allowed = (tag === 'a' && ['href', 'title'].includes(attribute.name)) || (tag === 'img' && ['src', 'alt', 'title'].includes(attribute.name))
      if (!allowed || ((attribute.name === 'href' || attribute.name === 'src') && !isSafeExternalUrl(attribute.value))) element.removeAttribute(attribute.name)
    })
    if (tag === 'a') { element.setAttribute('target', '_blank'); element.setAttribute('rel', 'noopener noreferrer') }
  })
  document.body.querySelectorAll('script, style, iframe, object, embed, form').forEach((element) => element.remove())
  return document.body.innerHTML
}
