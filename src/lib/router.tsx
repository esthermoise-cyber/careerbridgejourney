import { useSyncExternalStore, type AnchorHTMLAttributes, type MouseEvent } from 'react'

const subs = new Set<() => void>()
const notify = () => subs.forEach(s => s())
window.addEventListener('popstate', notify)

export function navigate(to: string, replace = false) {
  if (to === location.pathname) return
  if (replace) history.replaceState(null, '', to); else history.pushState(null, '', to)
  window.scrollTo(0, 0)
  notify()
}

export function usePath(): string {
  return useSyncExternalStore(cb => { subs.add(cb); return () => subs.delete(cb) }, () => location.pathname)
}

export function Link({ to, onClick, ...rest }: AnchorHTMLAttributes<HTMLAnchorElement> & { to: string }) {
  const click = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e)
    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
    e.preventDefault(); navigate(to)
  }
  return <a href={to} onClick={click} {...rest} />
}
