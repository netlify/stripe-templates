import { useEffect } from 'react'
import { handleAuthCallback } from '@netlify/identity'

// Netlify Identity redirects back to the site with auth tokens in the URL hash
// (email confirmation, password recovery, invites, email change, OAuth). This
// component detects those and completes the flow on page load.
const AUTH_HASH_PATTERN =
  /^#(confirmation_token|recovery_token|invite_token|email_change_token|access_token)=/

export function CallbackHandler({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (AUTH_HASH_PATTERN.test(window.location.hash)) {
      handleAuthCallback().catch(() => {
        /* invalid/expired token — ignore, the user can retry */
      })
    }
  }, [])

  return <>{children}</>
}
