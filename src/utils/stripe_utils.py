"""
Stripe integration for CineVivid monetization
"""
import os
import stripe
from typing import Dict, Optional
from src.backend.auth import update_user_tier, add_credits

# Initialize Stripe
stripe.api_key = os.getenv("STRIPE_SECRET_KEY")
STRIPE_PUBLISHABLE_KEY = os.getenv("STRIPE_PUBLISHABLE_KEY")

# Pricing plans
PRICING_PLANS = {
    "free": {
        "name": "Free",
        "credits": 300,
        "price": 0,
        "stripe_price_id": None
    },
    "pro": {
        "name": "Pro",
        "credits": 1000,
        "price": 19.99,
        "stripe_price_id": os.getenv("STRIPE_PRICE_PRO")
    },
    "business": {
        "name": "Business",
        "credits": 3000,
        "price": 49.99,
        "stripe_price_id": os.getenv("STRIPE_PRICE_BUSINESS")
    },
    "enterprise": {
        "name": "Enterprise",
        "credits": 10000,
        "price": 149.99,
        "stripe_price_id": os.getenv("STRIPE_PRICE_ENTERPRISE")
    }
}

def create_checkout_session(user_id: str, tier: str) -> Optional[Dict]:
    """Create Stripe checkout session for subscription"""
    if tier not in PRICING_PLANS or tier == "free":
        return None

    plan = PRICING_PLANS[tier]

    try:
        session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[{
                'price': plan['stripe_price_id'],
                'quantity': 1,
            }],
            mode='subscription',
            success_url=f"{os.getenv('FRONTEND_URL', 'http://localhost:3000')}/success?session_id={{CHECKOUT_SESSION_ID}}",
            cancel_url=f"{os.getenv('FRONTEND_URL', 'http://localhost:3000')}/pricing",
            client_reference_id=user_id,
            metadata={
                'tier': tier,
                'user_id': user_id
            }
        )
        return {
            'session_id': session.id,
            'url': session.url
        }
    except Exception as e:
        print(f"Failed to create checkout session: {e}")
        return None

def handle_webhook_event(event: Dict) -> bool:
    """Handle Stripe webhook events"""
    try:
        event_type = event['type']

        if event_type == 'checkout.session.completed':
            session = event['data']['object']
            user_id = session.get('client_reference_id')
            tier = session.get('metadata', {}).get('tier')

            if user_id and tier:
                # Update user tier and add credits
                update_user_tier(user_id, tier)
                return True

        elif event_type == 'invoice.payment_succeeded':
            # Handle recurring payments - add credits
            subscription = event['data']['object']
            customer_id = subscription.get('customer')
            # Find user by customer_id and add credits
            # This would require storing customer_id in user data
            pass

        return True
    except Exception as e:
        print(f"Failed to handle webhook: {e}")
        return False

def create_customer_portal_session(user_id: str) -> Optional[Dict]:
    """Create customer portal session for billing management"""
    # This requires storing customer_id in user data
    # For now, return None
    return None

def get_pricing_plans() -> Dict:
    """Get all pricing plans for frontend"""
    return {
        tier: {
            'name': plan['name'],
            'credits': plan['credits'],
            'price': plan['price'],
            'features': [
                f"{plan['credits']} video credits",
                "720p video quality",
                "Basic editing tools",
                "Email support" if tier == "free" else "Priority support",
                "Commercial usage" if tier in ["business", "enterprise"] else "Personal use only"
            ]
        }
        for tier, plan in PRICING_PLANS.items()
    }