import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import axios from 'axios';
import { useState } from 'react';
import { toast } from 'react-toastify';
import './PaymentForm.css';

const PaymentForm = ({ totalPrice, cartItems, userInfo }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);

    try {
      const { data: { clientSecret } } = await axios.post('http://localhost:5000/api/create-payment-intent', { totalPrice });

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: userInfo.name,
          },
        },
      });

      setProcessing(false);

      if (result.error) {
        toast.error(`Erreur de paiement: ${result.error.message}`);
      } else if (result.paymentIntent.status === 'succeeded') {
        toast.success('Paiement réussi!');

        // Envoie les informations de la commande
        const orderResponse = await axios.post('http://localhost:5000/api/checkout', {
          cartItems,
          totalPrice,
          userInfo,
        });

        // Met à jour l'état de paiement dans la base de données
        const orderId = orderResponse.data._id; // Récupère l'ID de la commande
        await axios.patch(`http://localhost:5000/api/orders/${orderId}`, {
          paymentStatus: 'paid',
        });
      }
    } catch (error) {
      setProcessing(false);
      toast.error('Une erreur est survenue lors du paiement.');
    }
  };

  return (
    <form onSubmit={handlePaymentSubmit} className="payment-form">
      <div className="card-element-wrapper">
        <CardElement className="card-element" />
      </div>
      <button type="submit" disabled={!stripe || processing} id="btn">
        {processing ? "Traitement..." : `Payer $${totalPrice.toFixed(2)}`}
      </button>
    </form>
  );
};

export default PaymentForm;
