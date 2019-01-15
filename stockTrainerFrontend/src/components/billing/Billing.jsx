import React from "react";
import { Elements, StripeProvider } from "react-stripe-elements";
import CheckoutForm from "./CheckoutForm";
import "./UpgradeUser.css";

const UpgradeUser = () => (
  <div className="upgradePage">
    <div className="upgradeInfo">
      <h3>Upgrade to StockTrainer Premium</h3>
      <p>Keep track of all your favorite stocks</p>
      <p>Look at all 5 of our fancy indicators</p>
      <p>We help you find stocks</p>
    </div>
    <StripeProvider apiKey={process.env.REACT_APP_STRIPE_PUBLISHABLE_TEST_KEY}>
      <div className="checkoutForm">
        <Elements>
          <CheckoutForm />
        </Elements>
      </div>
    </StripeProvider>
  </div>
);
export default UpgradeUser;
