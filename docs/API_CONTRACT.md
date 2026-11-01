# CampusConnect API Contract

Base URL: `http://localhost:8000`

All protected endpoints require header:
`Authorization: Bearer <access_token>`

---

### 1. Authentication

#### `POST /auth/register`
- Request:
  ```json
  {
    "email": "student@srmist.edu.in",
    "name": "Alex",
    "password": "securepassword123"
  }
{
  "id": 1,
  "email": "student@srmist.edu.in",
  "name": "Alex"
}
{
  "email": "student@srmist.edu.in",
  "password": "securepassword123"
}
{
  "access_token": "<jwt_token>",
  "token_type": "bearer"
}
{
  "origin": "Campus Gate 1",
  "destination": "Central Railway Station",
  "earliest_departure": "2026-11-02T14:00:00",
  "latest_arrival": "2026-11-02T16:00:00",
  "luggage_count": 1,
  "natural_prompt": "Heading to Central Station around 2pm"
}
{
  "id": 1,
  "user_id": 1,
  "origin": "Campus Gate 1",
  "destination": "Central Railway Station",
  "earliest_departure": "2026-11-02T14:00:00",
  "latest_arrival": "2026-11-02T16:00:00",
  "luggage_count": 1,
  "status": "PENDING"
}
{
  "status": "success",
  "generated_proposals": [
    {
      "group_id": 1,
      "origin": "Campus Gate 1",
      "destination": "Central Railway Station",
      "scheduled_departure": "2026-11-02T14:15:00",
      "estimated_arrival": "2026-11-02T15:00:00",
      "is_safe": true,
      "explanation": "Safe match: Shared route to Central Railway Station. All riders arrive within safety buffers.",
      "members": [1, 2]
    }
  ],
  "rejected_matches": [
    {
      "reason": "Match rejected: Deadline window leaves insufficient buffer (<30 mins) for departure.",
      "explanation": "Safety check: Departure could not be guaranteed without risking missed connection."
    }
  ]
}
{
  "message": "Group proposal accepted",
  "group_id": 1,
  "status": "ACCEPTED"
}
{
  "group_id": 1,
  "total_fare": 600.0,
  "member_count": 3,
  "fare_per_member": 200.0,
  "standard_solo_fare": 600.0,
  "savings_per_member": 400.0
}
{
  "total_rides_matched": 14,
  "total_money_saved_inr": 4200.0,
  "carbon_saved_kg": 18.5,
  "active_proposals": 2
}
files["docs/ARCHITECTURE.md"] = 