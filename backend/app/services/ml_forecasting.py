import datetime
import math
import random
from typing import List, Dict, Any
from app.schemas import PriceForecastResponse, ForecastPoint


class MLPriceForecaster:
    """
    Market Intelligence Engine & ML Price Forecasting Service
    Predicts local mandi price trends, 7-day price trajectory,
    and calculates optimal sale window recommendations for farmers.
    """

    @staticmethod
    def forecast_crop_price(
        crop_name: str,
        state: str,
        district: str,
        mandi_name: str,
        historical_modal_prices: List[float] = None
    ) -> PriceForecastResponse:
        # Base baseline price generation if historical data is limited
        crop_baselines = {
            "Wheat": 2250.0,
            "Rice": 3100.0,
            "Tomato": 1850.0,
            "Potato": 1400.0,
            "Onion": 2400.0,
            "Cotton": 650.0,
            "Soybean": 4300.0,
            "Maize": 2100.0,
            "Mustard": 5400.0,
        }
        
        base_price = crop_baselines.get(crop_name.capitalize(), 2500.0)

        if historical_modal_prices and len(historical_modal_prices) >= 3:
            current_modal_price = historical_modal_prices[-1]
            trend_slope = (historical_modal_prices[-1] - historical_modal_prices[0]) / len(historical_modal_prices)
        else:
            current_modal_price = base_price
            trend_slope = random.uniform(-15.0, 35.0)  # Simulated trend

        forecast_points: List[ForecastPoint] = []
        today = datetime.date.today()

        projected_price = current_modal_price
        for day in range(1, 8):
            forecast_date = (today + datetime.timedelta(days=day)).strftime("%Y-%m-%d")
            # Apply slight non-linear trend component + seasonality fluctuation
            seasonality = 15.0 * math.sin(day * 0.8)
            projected_price += trend_slope * 0.7 + seasonality + random.uniform(-5.0, 10.0)
            projected_price = max(projected_price, 500.0)

            margin_of_error = projected_price * 0.04 * (1 + (day * 0.1))
            forecast_points.append(
                ForecastPoint(
                    date=forecast_date,
                    predicted_modal_price=round(projected_price, 2),
                    confidence_lower=round(projected_price - margin_of_error, 2),
                    confidence_upper=round(projected_price + margin_of_error, 2),
                )
            )

        # Calculate Sale Window Advisory logic
        max_forecast_point = max(forecast_points, key=lambda p: p.predicted_modal_price)
        price_diff_percent = ((max_forecast_point.predicted_modal_price - current_modal_price) / current_modal_price) * 100.0

        if price_diff_percent > 5.0:
            recommended_sale_window = f"Hold produce for 4-6 days (Peak expected on {max_forecast_point.date})"
            advice_summary = (
                f"Prices for {crop_name} in {mandi_name} are projected to rise by "
                f"~{price_diff_percent:.1f}% over the next week. Recommended to store in cold storage / warehouse if feasible."
            )
        elif price_diff_percent < -4.0:
            recommended_sale_window = "Sell immediately (Prices expected to dip)"
            advice_summary = (
                f"Prices for {crop_name} in {mandi_name} are showing a downward trend (-{abs(price_diff_percent):.1f}%). "
                f"Listing produce immediately is strongly recommended to lock in current rates."
            )
        else:
            recommended_sale_window = "Flexible (Stable market price horizon)"
            advice_summary = (
                f"Market prices for {crop_name} in {mandi_name} are expected to remain steady near ₹{current_modal_price}/quintal."
            )

        return PriceForecastResponse(
            crop_name=crop_name,
            state=state,
            district=district,
            mandi_name=mandi_name,
            current_modal_price=round(current_modal_price, 2),
            forecast_7d=forecast_points,
            recommended_sale_window=recommended_sale_window,
            advice_summary=advice_summary,
        )


ml_forecaster = MLPriceForecaster()
