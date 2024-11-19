import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Spin, Alert, Modal, Button, Card, Flex } from 'antd';
import { Api_VariavelGlobal } from '../global';
import { FaArrowLeft } from 'react-icons/fa';
import moment from 'moment';
import { Link } from 'react-router-dom';

const Orders: React.FC = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedOrderItems, setSelectedOrderItems] = useState([]);
  const [modalLoading, setModalLoading] = useState(false); // Estado para controlar o carregamento do modal

  // Obter o token de autenticação
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchOrders = async () => {
      if (!token) {
        setError('Usuário não autenticado. Por favor, faça login para ver seus pedidos.');
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get(`${Api_VariavelGlobal}/api/pedidos/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const sortedOrders = response.data.sort(
          (a, b) => new Date(b.DATA).getTime() - new Date(a.DATA).getTime()
        );

        setOrders(sortedOrders);
      } catch (err) {
        setError(`Erro ao carregar pedidos: ${err.response ? err.response.data.message : err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token, userId]);

  // Função para buscar os itens de um pedido específico
  const fetchOrderItems = async (orderId) => {
    setModalLoading(true); // Inicia o carregamento no modal
    try {
      const response = await axios.get(`${Api_VariavelGlobal}/api/pedidos/${userId}/itens/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSelectedOrderItems(response.data || []); // Ajuste aqui para acessar diretamente response.data
    } catch (err) {
      setError(`Erro ao carregar itens do pedido: ${err.response ? err.response.data.message : err.message}`);
    } finally {
      setModalLoading(false); // Finaliza o carregamento
    }
  };

  const handleOrderClick = async (order) => {
    await fetchOrderItems(order.ID_PEDIDO); // Buscar os itens do pedido
    setIsModalVisible(true); // Garantir que o modal seja aberto
  };

  const renderOrderItems = () => {
    if (modalLoading) {
      return <Spin tip="Carregando itens..." />;
    }
  
    if (!selectedOrderItems.length) {
      return <p>Não há itens para este pedido.</p>;
    }
  
    return (
      <div>
        {selectedOrderItems.map((item, index) => (
          <div key={index}>
            <p><strong>Produto:</strong> {item.ID_PRODUTO}</p>
            <p><strong>Quantidade:</strong> {item.QUANTIDADE}</p>
            <p><strong>Preço:</strong> R${item.PRECO_UNITARIO}</p>
            <hr />
          </div>
        ))}
      </div>
    );
  };
  

  if (!token) {
    return (
      <div className='container'>
        <div className="left-arrow">
          <Link className="secondary" to='/'><FaArrowLeft /></Link>
        </div>
        <h1 className="titulo-home"> Meu(s) Pedido(s)</h1>
        <p>Usuário não autenticado! <br/>Por favor, faça login para ver seus pedidos.</p>
      </div>
    );
  }

  if (loading) {
    return <>
    <div className="loading-screen-orders loading-screen">
      <Flex className='loading-icon-screen' align="center">
        <Spin size="large" />
      </Flex>
    </div></>;
  }

  if (error) {
    return <Alert message={error} type="error" />;
  }

  return (
    <div className='container'>
      <div className="left-arrow">
      <Link className="secondary" to='/'><FaArrowLeft /></Link>
      </div>
      <h1 className="titulo-home"> Meu(s) Pedido(s)</h1>
      <p>Pedidos Realizados</p>

      {/* Exibindo os pedidos */}
      <div>
        {orders.map((order) => (
          <div className='orders-card' key={order.ID_PEDIDO}>
          <Card title={order.ID_PEDIDO} bordered={false} style={{ width:'100%' }} className="list-orders" onClick={() => handleOrderClick(order)}>
          <div className="order-content">
              {/* Data */}
              <div className="order-date">{moment(order.DATA).format('DD/MM/YYYY HH:mm')}</div>
              {/* Status */}
              <div className="order-id">Status: {order.STATUS}</div>
              {/* Pagamento */}
              <div className="order-pay">Pagamento: {order.PAGAMENTO}</div>
              {/* Entrega */}
              <div className="order-delivery">Entrega: {order.ENTREGA}</div>
              {/* Total */}
              <div className="order-total">Total: R$ {order.TOTAL}</div>
            </div>
          </Card>
          </div>
        ))}
      </div>

      {/* Modal de Itens do Pedido */}
      <Modal
        title="Itens do Pedido"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[<Button key="close" onClick={() => setIsModalVisible(false)}>Fechar</Button>]}
      >
        {renderOrderItems()}
      </Modal>
    </div>
  );
};

export default Orders;
