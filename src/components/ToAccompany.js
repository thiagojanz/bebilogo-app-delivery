import React, { useEffect, useState, useCallback } from 'react';
import { Spin, Steps, Flex } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import axios from 'axios'; // Caso queira utilizar axios para fazer requisição
import { Api_VariavelGlobal } from '../global';

const ToAccompany = ({ orderId }) => {
  const [status, setStatus] = useState(null); // Status do pedido
  const [loading, setLoading] = useState(true); // Estado de carregamento

  // Função para exibir o ícone de carregamento
  const LoadingScreen = () => (
    <div className="loading-screen-orders loading-screen">
      <Flex className="loading-icon-screen" align="center">
        <Spin indicator={<LoadingOutlined spin />} size="large" />
      </Flex>
    </div>
  );

  // Função para consultar o status do pedido na API
  const fetchOrderStatus = useCallback(async () => {
    setLoading(true); // Inicia o carregamento
    try {
      const response = await axios.get(`${Api_VariavelGlobal}/api/pedidos/status/${orderId}`);
      console.log('Resposta da API:', response.data);
      if (response.data && response.data.STATUS) {
        setStatus(response.data.STATUS); // Atualiza o status do pedido
      } else {
        console.error('Status não encontrado na resposta da API');
      }
    } catch (err) {
      console.error('Erro ao carregar status do pedido:', err);
    } finally {
      setLoading(false); // Finaliza o carregamento
    }
  }, [orderId]);

  useEffect(() => {
    fetchOrderStatus(); // Chama a função ao carregar o componente
  }, [fetchOrderStatus]);

  // Função para renderizar o título do passo, com ícone de carregamento se for o status atual
  const renderStepTitle = (stepTitle, stepStatus) => {
    if (status === stepStatus && status !== '6') {  // Não exibe ícone para o status '6' (Concluído)
      return (
        <span>
          <LoadingOutlined style={{ marginRight: 8, color: '#1890ff' }} />
          {stepTitle}
        </span>
      );
    }
    return stepTitle;
  };

  // Exibe o carregamento enquanto o status é obtido
  if (loading) {
    return <LoadingScreen />;
  }

  // Define os passos com base no status do pedido
  const steps = [
    { title: renderStepTitle('Pedido Recebido', '2') },
    { title: renderStepTitle('Aguardando Confirmação', '3') },
    { title: renderStepTitle('Preparação iniciada', '4') },
    { title: renderStepTitle('Saiu para entrega', '5') },
    { title: renderStepTitle('Concluído', '6') },  // Status '6' não usa o ícone de loading
  ];

  return (
    <div>
      <Steps
        direction="vertical"
        size="small"
        current={status ? ['2', '3', '4', '5', '6'].indexOf(status) : 0} // Mapeia o status para o índice
        items={steps}
      />
    </div>
  );
};

export default ToAccompany;
