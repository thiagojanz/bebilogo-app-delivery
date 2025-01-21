import React, { useState, useEffect } from 'react';
import { Steps, message } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { useParams } from 'react-router-dom';
import { Api_VariavelGlobal } from '../global';

const ToAccompany = () => {
  const { id: orderId } = useParams(); // Captura o 'orderId' da URL
  const [statusId, setStatusId] = useState(null); // Estado para armazenar o status do pedido
  const [loading, setLoading] = useState(true); // Estado para gerenciar o carregamento
  const [error, setError] = useState(null); // Estado para erros

  useEffect(() => {
    // Função para buscar o status do pedido pela API
    const fetchOrderStatus = async () => {
      try {
        const response = await fetch(`${Api_VariavelGlobal}/api/pedidos/status/${orderId}`);
        if (!response.ok) {
          throw new Error(`Erro ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        // Verifica se a resposta contém o campo STATUS
        if (data && data.STATUS) {
          setStatusId(data.STATUS); // Atualiza o estado com o status do pedido
        } else {
          throw new Error('O campo STATUS não foi encontrado na resposta da API.');
        }
      } catch (error) {
        message.error('Erro ao buscar o status do pedido:', error.message);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    // Busca inicial do status do pedido
    fetchOrderStatus();

    // Configura o polling para buscar em tempo real a cada 5 segundos
    const interval = setInterval(fetchOrderStatus, 30000);

    // Limpa o intervalo ao desmontar o componente
    return () => clearInterval(interval);
  }, [orderId]);

  if (loading) {
    return <div>Aguarde por favor, carregando...</div>;
  }

  if (error) {
    return <div>Erro: {error}</div>;
  }

  if (!orderId || !statusId) {
    return <div>Pedido não encontrado ou status inválido.</div>;
  }

  // Função para renderizar o título do passo, com ícone de carregamento se for o status atual
  const renderStepTitle = (stepTitle, stepStatus) => {
    if (statusId === stepStatus && statusId !== '6') { // Não exibe ícone para o status '6' (Concluído)
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

  return (
    <div>
      <h3 className='center' style={{marginBottom:'30px'}}>Pedido {orderId}</h3>
      <Steps
        direction="vertical"
        size="small"
        current={['2', '3', '4', '5', '6'].indexOf(statusId)} // Mapeia o status para o índice
        items={steps}
      />
    </div>
  );
};

export default ToAccompany;
