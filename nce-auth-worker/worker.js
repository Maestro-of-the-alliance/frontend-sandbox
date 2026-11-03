// @ts-nocheck
// NCE-AUTH WORKER — THE ALLIANCE
// Deployed as the "nce-auth" Worker (nce-auth.davidmichaeldore.workers.dev), used by auth.html.
// Copy of the live code as of Nov 3, 2026, kept here so the repo has it.

const SUPABASE_URL = 'https://jtghqthinuobfijgystw.supabase.co'
const SUPABASE_ANON_KEY = 'sb_publishable_wW3phLMlePBxHVxiDysBPw_ydreXtbk'
// The site moved to nextcommonera.org (Nov 2026); allianceftf.org is accepted until it lapses.
const ALLOWED_ORIGINS = ['https://nextcommonera.org', 'https://www.nextcommonera.org', 'https://allianceftf.org']
const PRIMARY_ORIGIN = 'https://nextcommonera.org'
let ALLOWED_ORIGIN = PRIMARY_ORIGIN

const corsHeaders = {
  'Access-Control-Allow-Origin': PRIMARY_ORIGIN,
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Vary': 'Origin',
}

export default {
  async fetch(request) {
    const origin = request.headers.get('Origin')
    ALLOWED_ORIGIN = ALLOWED_ORIGINS.includes(origin) ? origin : PRIMARY_ORIGIN
    corsHeaders['Access-Control-Allow-Origin'] = ALLOWED_ORIGIN
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders })
    }
    const url = new URL(request.url)
    const path = url.pathname
    try {
      if (path === '/api/signup') return await handleSignup(request)
      if (path === '/api/login')  return await handleLogin(request)
      if (path === '/api/reset')  return await handleReset(request)
      return json({ error: 'NOT_FOUND' }, 404)
    } catch (err) {
      return json({ error: 'SERVER_ERROR', message: err.message }, 500)
    }
  }
}

async function handleSignup(request) {
  const { email } = await request.json()
  if (!email) return json({ error: 'EMAIL_REQUIRED' }, 400)

  const res = await fetch(`${SUPABASE_URL}/auth/v1/otp`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
    },
    body: JSON.stringify({
      email,
      create_user: true,
      options: {
        emailRedirectTo: `${ALLOWED_ORIGIN}/auth?verify=1`
      }
    })
  })

  const data = await res.json()
  console.log('SIGNUP RESPONSE:', res.status, JSON.stringify(data))
  if (!res.ok) return json({ error: data.message || 'SIGNUP_FAILED' }, 400)
  return json({ status: 'VERIFICATION_SENT' })
}

async function handleLogin(request) {
  const { email, password } = await request.json()
  if (!email || !password) return json({ error: 'CREDENTIALS_REQUIRED' }, 400)

  const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
    },
    body: JSON.stringify({ email, password })
  })

  const data = await res.json()
  console.log('LOGIN RESPONSE:', res.status, JSON.stringify(data))
  if (!res.ok) return json({ error: 'INVALID_CREDENTIALS' }, 401)
  return json({
    status: 'OK',
    access_token: data.access_token,
    user: { email: data.user?.email, id: data.user?.id }
  })
}

async function handleReset(request) {
  const { email } = await request.json()
  if (!email) return json({ error: 'EMAIL_REQUIRED' }, 400)

  const res = await fetch(`${SUPABASE_URL}/auth/v1/recover`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
    },
    body: JSON.stringify({ email })
  })

  const data = await res.json()
  if (!res.ok) return json({ error: data.message || 'RESET_FAILED' }, 400)
  return json({ status: 'RESET_SENT' })
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}
