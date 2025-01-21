import React from 'react';
import { Steps } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

const ToAccompany = ({ orderId, statusId }) => {
  if (!orderId || !statusId) {
    return <div>Aguarde por favor, carregando...</div>;
  }

  // Função para renderizar o título do passo, com ícone de carregamento se for o status atual
  const renderStepTitle = (stepTitle, stepStatus) => {
    if (statusId === stepStatus && statusId !== '6') {  // Não exibe ícone para o status '6' (Concluído)
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
    { title: renderStepTitle('Concluído', '6') },  // Status '6' não usa o ícone de loading
  ];

  return (
    <div>
      <Steps
        direction="vertical"
        size="small"
        current={statusId ? ['2', '3', '4', '5', '6'].indexOf(statusId) : 0} // Mapeia o status para o índice
        items={steps}
      />
    </div>
  );
};

export default ToAccompany;
