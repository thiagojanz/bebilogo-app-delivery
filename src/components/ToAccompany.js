import React, { useEffect, useState, useCallback } from 'react';
import { Steps } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import axios from 'axios';
import { Api_VariavelGlobal } from '../global';

const ToAccompany = ({ orderId }) => {
  const [status, setStatus] = useState(null); // Status do pedido
  const refreshInterval = 5000; // Tempo de atualização (em milissegundos, aqui definido como 5 segundos)

  // Função para consultar o status do pedido na API
  const fetchOrderStatus = useCallback(async () => {
    try {
      const response = await axios.get(`${Api_VariavelGlobal}/api/pedidos/status/${orderId}`);
      console.log('Resposta da API:', response.data);

      if (response.data && response.data.STATUS) {
        setStatus((prevStatus) => {
          if (prevStatus !== response.data.STATUS) {
            return response.data.STATUS; // Atualiza o status apenas se for diferente do atual
          }
          return prevStatus;
        });
      } else {
        console.error('Status não encontrado na resposta da API');
      }
    } catch (err) {
      console.error('Erro ao carregar status do pedido:', err);
    }
  }, [orderId]);

  useEffect(() => {
    fetchOrderStatus(); // Chama a função ao carregar o componente

    // Configura o intervalo para atualização automática
    const interval = setInterval(() => {
      fetchOrderStatus();
    }, refreshInterval);

    // Limpa o intervalo ao desmontar o componente
    return () => clearInterval(interval);
  }, [fetchOrderStatus]);

  // Função para renderizar o título do passo, com ícone de carregamento se for o status atual
  const renderStepTitle = (stepTitle, stepStatus) => {
    if (status === stepStatus && status !== '6') { // Não exibe ícone para o status '6' (Concluído)
      return (
        <span>
          <LoadingOutlined style={{ marginRight: 8, color: '#1890ff' }} />
          {stepTitle}
        </span>
      );
    }
    return stepTitle;
  };

  // Define os passos com base no status do pedido
  const steps = [
    { title: renderStepTitle('Pedido Recebido', '2') },
    { title: renderStepTitle('Aguardando Confirmação', '3') },
    { title: renderStepTitle('Preparação iniciada', '4') },
    { title: renderStepTitle('Saiu para entrega', '5') },
    { title: renderStepTitle('Concluído', '6') }, // Status '6' não usa o ícone de loading
  ];

  // Calcula o índice do status atual nos passos
  const currentStepIndex = status ? ['2', '3', '4', '5', '6'].indexOf(status) : 0;

  return (
    <div>
      {/* Apenas esta div será atualizada quando o status mudar */}
      <div style={{ marginBottom: 16 }}>
        <strong>Status do Pedido:</strong>{' '}
        <span style={{ color: '#1890ff', fontWeight: 'bold' }}>{status}</span>
      </div>
      
      {/* Renderiza os passos */}
      <Steps
        direction="vertical"
        size="small"
        current={currentStepIndex >= 0 ? currentStepIndex : 0} // Garante índice válido
        items={steps}
      />
    </div>
  );
};

export default ToAccompany;
