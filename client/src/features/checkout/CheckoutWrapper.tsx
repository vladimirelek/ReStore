import { loadStripe } from "@stripe/stripe-js";
import CheckoutPage from "./CheckoutPage";
import { Elements } from "@stripe/react-stripe-js";
import { useAppDispatch } from "../../app/store/store";
import { useEffect, useState } from "react";
import agent from "../../app/api/agent";
import { setBasket } from "../Basket/basketSlice";
import Loading from "../../app/layout/Loading";

export default function CheckoutWrapper() {
  const stripePromise = loadStripe(
    "pk_test_51Nqsf2JMBgf3RSJR1wnvzzPHyod8UIH2jI15YYkBQWFui5ODXbN8S46zz4AkZWmAARHQH89k2KsdSrU1KtpPZkBT00EtYsnIgD"
  );
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    agent.Payments.createPaymentIntent()
      .then((response) => dispatch(setBasket(response)))
      .catch((error) => console.log(error))
      .finally(() => setLoading(false));
  }, [dispatch]);
  if (loading) return <Loading message="Loading Checkout" />;
  return (
    <Elements stripe={stripePromise}>
      <CheckoutPage />
    </Elements>
  );
}
