import React from 'react'
import { useRegisterSW } from 'virtual:pwa-register/react'

/*
  Tells the user when a new version of the site has been deployed.

  The service worker serves the cached app first and fetches the new one in
  the background, so after a deploy the first reload still shows the old
  build, and a dashboard tab left open never checks at all. Staff were
  exporting PDFs from code that had been replaced hours earlier.

  The new build now waits until the user chooses to refresh, rather than
  reloading on its own and losing a half-written note or form. Updates are
  checked hourly and whenever the tab comes back into view.
*/
const CHECK_EVERY_MS = 60 * 60 * 1000

export default function UpdatePrompt() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(_url, registration) {
      if (!registration) return
      setInterval(() => registration.update(), CHECK_EVERY_MS)
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') registration.update()
      })
    },
  })

  if (!needRefresh) return null

  return (
    <div className="pwa-install" role="status">
      <div style={{ flex: 1 }}>
        <div className="pwa-install__text">A new version is available</div>
        <div className="pwa-install__sub">Refresh to load the latest House of Refuge</div>
      </div>
      <button className="btn btn--primary btn--sm" onClick={() => updateServiceWorker(true)} style={{ whiteSpace: 'nowrap' }}>Refresh</button>
      <button className="pwa-install__close" onClick={() => setNeedRefresh(false)} aria-label="Dismiss">&times;</button>
    </div>
  )
}
