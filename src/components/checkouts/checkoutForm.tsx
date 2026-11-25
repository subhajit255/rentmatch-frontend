import React, { useState } from "react";
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { useNavigate } from "react-router-dom";
import { verifySubscriptionPlanApi } from "../../actions/subscriptions";
import { useAuth } from "../../context/AuthContext";

const elementStyle = {
  style: {
    base: {
      fontSize: "16px",
      color: "#1f2937",
      "::placeholder": {
        color: "#9ca3af",
      },
    },
    invalid: {
      color: "#ef4444",
    },
  },
};

const CheckoutForm = ({ clientSecret, price, user_object_id, payment_intent_id } : {clientSecret: string, price: number, user_object_id: string, payment_intent_id: string}) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const { updateUser, refreshUser } = useAuth();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError(null);

    const { error: stripeError } = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardNumberElement)!,
      billing_details: {
        email,
      },
    });

    if (stripeError) {
      setError(stripeError.message || "Payment failed");
      setLoading(false);
      return;
    }

    const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: {
          card: elements.getElement(CardNumberElement)!,
          billing_details: { email },
        },
      }
    );

    if (confirmError) {
      setError(confirmError.message || "Payment confirmation failed");
      setLoading(false);
      return;
    }

    const isVerified = await verifySubscriptionPlanApi({
      member_objectId: user_object_id,
      paymentIntent_id: payment_intent_id,
      payment_respons: paymentIntent ? paymentIntent : []
    });
    console.log("isVerified ::: ", isVerified);

    updateUser({ is_subscribe: true });
    try {
      await refreshUser();
    } catch (err) {
      console.warn("Could not sync profile after subscription verification:", err);
    }

    navigate("/payment-success");
    setLoading(false);
  };



  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 mb-4">
      {/* LEFT */}
      <form
        onSubmit={handleSubmit}
        className="lg:col-span-2 border rounded-xl p-6 space-y-6 bg-white"
      >
        {/* CONTACT */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold text-lg">Contact info</h3>
            <span className="text-sm text-blue-600">Link Authentication Element</span>
          </div>
          <input
            type="email"
            required
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* PAYMENT */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold text-lg">Payment</h3>
            <span className="text-sm text-blue-600">Payment Element</span>
          </div>

          <Card className="p-4 space-y-4">
            <div>
              <label className="text-sm text-gray-600">Card number</label>
              <div className="border rounded-md px-3 py-2">
                <CardNumberElement options={elementStyle} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600">Expiration</label>
                <div className="border rounded-md px-3 py-2">
                  <CardExpiryElement options={elementStyle} />
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-600">CVC</label>
                <div className="border rounded-md px-3 py-2">
                  <CardCvcElement options={elementStyle} />
                </div>
              </div>
            </div>
          </Card>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <Button
          type="submit"
          disabled={!stripe || loading}
          className="w-full h-12 text-lg"
        >
          {loading ? "Processing..." : "Place order"}
        </Button>
      </form>

      {/* RIGHT SUMMARY */}
      <Card className="p-6 h-fit space-y-4 bg-white">
        <div className="flex justify-between text-sm">
          <span>Subtotal (1 item)</span>
          <span>{price}</span>
        </div>

        <div className="flex justify-between text-sm">
          <span>Shipping</span>
          <span className="text-green-600">Free</span>
        </div>

        <div className="border-t pt-4 flex justify-between font-semibold text-lg">
          <span>Total</span>
          <span>{price}</span>
        </div>
      </Card>
    </div>
  );
};

export default CheckoutForm;
