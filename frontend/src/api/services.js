import api from './client.js'

/**
 * Real-backend service layer. Every function below calls an endpoint that
 * exists in backend/app/routes/*. No mock or fallback data is returned here:
 * when the backend has no endpoint for a screen, the screen itself renders an
 * honest empty state with a TODO comment instead of fabricated data.
 */
export const authService = {
  login: async (email, password) => {
    // POST /auth/login -> { access_token, token_type, user: { id, name, email } }
    const { data } = await api.post('/auth/login', { email, password })
    return data
  },
  register: async (payload) => {
    // POST /auth/register { email, name, password } -> 201 { id, email, name }
    const { data } = await api.post('/auth/register', payload)
    return data
  },
  me: async () => {
    // GET /auth/me -> { id, name, email }
    const { data } = await api.get('/auth/me')
    return data
  },
}

export const travelService = {
  create: async (payload) => {
    // POST /requests { origin, destination, earliest_departure,
    //   latest_arrival, luggage_count?, natural_prompt? } -> 201 TravelRequest
    const { data } = await api.post('/requests', payload)
    return data
  },
  mine: async () => {
    // GET /requests/me -> TravelRequest[]
    const { data } = await api.get('/requests/me')
    return data
  },
}

export const matchService = {
  run: async () => {
    // POST /match/run -> { status, generated_proposals, rejected_matches }
    const { data } = await api.post('/match/run')
    return data
  },
}

export const groupService = {
  proposals: async () => {
    // GET /groups/proposals -> the current user's group proposals
    const { data } = await api.get('/groups/proposals')
    return data
  },
  accept: async (id) => {
    // POST /groups/{id}/accept -> { status: "ACCEPTED" }
    const { data } = await api.post(`/groups/${id}/accept`)
    return data
  },
  split: async (id) => {
    // GET /groups/{id}/split -> { group_id, total_fare, member_count,
    //   fare_per_member, savings_per_member }
    const { data } = await api.get(`/groups/${id}/split`)
    return data
  },
}

export const dashboardService = {
  get: async () => {
    // Backend exposes GET /dashboard/ (see backend/app/routes/dashboard.py):
    // { status, user: { id, name, email },
    //   stats: { total_users, total_groups, total_requests } }
    const { data } = await api.get('/dashboard/')
    return data
  },
}
