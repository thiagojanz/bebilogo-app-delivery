import React, { useState } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid"; // Para gerar o UUID

const Checkout = () => {
  const [amount, setAmount] = useState(""); // Valor da transação
  const [accessToken, setAccessToken] = useState(null); // Token de acesso
  const [transactionResponse, setTransactionResponse] = useState(null); // Resposta da transação
  const [checkoutUrl, setCheckoutUrl] = useState(""); // Armazenar a URL do checkout
  const [isPaymentPageVisible, setIsPaymentPageVisible] = useState(false); // Controlar visibilidade da página de pagamento

  // Autenticar com a API da SumUp
  const authenticate = async () => {
    try {
      const clientId = "cc_classic_fBxJVbegYHwzzDQDuSd9DG1FkgVzC"; // Substitua pelo seu Client ID
      const clientSecret = "cc_sk_classic_EeWEQPx6TrV9XAKjxWANcnPjxmenF2fa1Juag75PUfScAObzj2"; // Substitua pelo seu Client Secret

      const params = new URLSearchParams();
      params.append("grant_type", "client_credentials");
      params.append("client_id", clientId);
      params.append("client_secret", clientSecret);
      params.append("application_type", "web");

      const response = await axios.post("https://api.sumup.com/token", params, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      const token = response.data.access_token;
      setAccessToken(token); // Armazenar o token
      alert("Autenticação bem-sucedida! Token gerado.");
    } catch (error) {
      alert("Erro ao autenticar. Verifique suas credenciais.");
    }
  };

  // Criar a transação (exemplo de como criar a transação)
  const createTransaction = async () => {
    if (!accessToken) {
      alert("Você precisa autenticar antes de criar uma transação!");
      return;
    }

    try {
      const amountInCents = Math.round(parseFloat(amount) * 100);
      const checkoutReference = uuidv4(); // Gerando UUID para a referência do checkout

      const payload = {
        amount: amountInCents / 100,
        checkout_reference: checkoutReference,
        currency: "BRL",
        description: "Compra de Produto X",
        merchant_code: "MDEC6EP7",
        pay_to_email: "thiagojanz@hotmail.com",
        hosted_checkout_settings: { enabled: true },
      };

      const response = await axios.post("https://api.sumup.com/v0.1/checkouts", payload, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      setTransactionResponse(response.data);

      // Armazene a URL do checkout
      setCheckoutUrl(response.data.hosted_checkout_url);

      // Exibir a página de pagamento diretamente na tela
      setIsPaymentPageVisible(true);
    } catch (error) {
      console.error("Erro ao criar a transação:", error.response?.data || error.message);
      alert("Erro ao criar a transação.");
    }
  };

  return (
    <div className="checkout-container">
      <h1>SumUp Checkout</h1>
      <button onClick={authenticate}>Autenticar com SumUp</button>

      <div>
        <label htmlFor="amount">Valor (BRL):</label>
        <input
          type="number"
          id="amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Insira o valor"
        />
      </div>

      <button onClick={createTransaction}>Criar Transação</button>

      {transactionResponse && (
       <></>
      )}

      {/* Exibir a página de pagamento na mesma tela */}
      {isPaymentPageVisible && checkoutUrl && (
        <div className="payment-page-container">
          <iframe
            src={checkoutUrl} // URL do checkout gerado
            width="100%" // Ocupa toda a largura do container
            height="600px" // Definindo a altura do iframe
            frameBorder="0" // Removendo a borda do iframe
            title="Página de Pagamento" // Acessibilidade
          />
        </div>
      )}
    </div>
  );
};

export default Checkout;
