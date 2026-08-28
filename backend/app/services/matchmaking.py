from typing import List, Dict, Any
from app.models import ProduceLot, ProduceGrade, ProduceStatus


class MatchmakingEngine:
    """
    Algorithmic Matchmaking Engine
    Ranks listed produce lots for buyers based on:
    - Crop relevance
    - Quantity fit
    - Price competitiveness vs buyer max budget
    - Quality grade match
    - Geographic proximity (State / District match)
    """

    @staticmethod
    def calculate_match_score(
        lot: ProduceLot,
        desired_crop: str,
        desired_min_qty: float = None,
        desired_max_price: float = None,
        preferred_grade: ProduceGrade = None,
        preferred_state: str = None
    ) -> float:
        score = 0.0

        # 1. Crop Match (Mandatory baseline - 40 points)
        if lot.crop_name.strip().lower() == desired_crop.strip().lower():
            score += 40.0
        else:
            return 0.0  # Irrelevant crop

        # 2. Quantity Match (20 points max)
        if desired_min_qty and desired_min_qty > 0:
            qty_ratio = min(lot.quantity_kg / desired_min_qty, 1.5)
            if qty_ratio >= 1.0:
                score += 20.0
            else:
                score += 20.0 * qty_ratio
        else:
            score += 15.0

        # 3. Price Competitiveness (20 points max)
        if desired_max_price and desired_max_price > 0:
            if lot.price_per_kg_expected <= desired_max_price:
                price_savings_ratio = (desired_max_price - lot.price_per_kg_expected) / desired_max_price
                score += 20.0 + min(price_savings_ratio * 10, 5.0)  # bonus for better price
            else:
                overprice_ratio = (lot.price_per_kg_expected - desired_max_price) / desired_max_price
                score += max(20.0 - (overprice_ratio * 40.0), 0.0)
        else:
            score += 15.0

        # 4. Grade Match (10 points max)
        if preferred_grade:
            if lot.grade == preferred_grade:
                score += 10.0
            elif lot.grade in [ProduceGrade.PREMIUM, ProduceGrade.GRADE_A]:
                score += 8.0
            else:
                score += 5.0
        else:
            score += 8.0

        # 5. Geographic Proximity (10 points max)
        if preferred_state:
            if lot.state.strip().lower() == preferred_state.strip().lower():
                score += 10.0
            else:
                score += 3.0
        else:
            score += 5.0

        return round(min(score, 100.0), 1)

    @classmethod
    def match_produce_for_buyer(
        cls,
        lots: List[ProduceLot],
        desired_crop: str,
        desired_min_qty: float = None,
        desired_max_price: float = None,
        preferred_grade: ProduceGrade = None,
        preferred_state: str = None
    ) -> List[Dict[str, Any]]:
        matched_results = []
        for lot in lots:
            if lot.status != ProduceStatus.AVAILABLE:
                continue
            match_score = cls.calculate_match_score(
                lot=lot,
                desired_crop=desired_crop,
                desired_min_qty=desired_min_qty,
                desired_max_price=desired_max_price,
                preferred_grade=preferred_grade,
                preferred_state=preferred_state
            )
            if match_score > 0:
                matched_results.append({
                    "produce_lot": lot,
                    "match_score_percentage": match_score
                })

        # Sort by match score descending
        matched_results.sort(key=lambda x: x["match_score_percentage"], reverse=True)
        return matched_results


matchmaking_engine = MatchmakingEngine()
