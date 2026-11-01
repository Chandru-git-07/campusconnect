from typing import Dict, Any

class MuseSparkService:
    @staticmethod
    def parse_travel_prompt(prompt: str) -> Dict[str, Any]:
        lower = prompt.lower()
        destination = "Central Railway Station"
        if "airport" in lower:
            destination = "International Airport"
        elif "station" in lower or "railway" in lower:
            destination = "Central Railway Station"
        luggage = 2 if any(w in lower for w in ["luggage", "bag", "bags", "suitcase"]) else 1
        return {"destination": destination, "luggage_count": luggage}

    @staticmethod
    def explain_match(is_safe: bool, reason: str, origin: str, destination: str) -> str:
        if is_safe:
            return f"Great match! You and your peers are travelling from {origin} to {destination}. Everyone arrives comfortably within safety buffers."
        return f"Match could not be confirmed: {reason}. CampusConnect prioritized student safety."
