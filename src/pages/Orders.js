import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Spin, Alert, Modal, Button, Card, Flex, Pagination } from 'antd';
import { Api_VariavelGlobal } from '../global';
import { FaCreditCard, FaMotorcycle, FaClock, FaCalendar, FaClipboardList } from 'react-icons/fa';
import moment from 'moment';
import { LoadingOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const Orders: React.FC = () => {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // Página atual
  const [itemsPerPage] = useState(5); // Número de pedidos por página
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedOrderItems, setSelectedOrderItems] = useState([]);
  const [modalLoading, setModalLoading] = useState(false);

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

        const sortedOrders = response.data.sort((a, b) => b.ID_PEDIDO - a.ID_PEDIDO);
        setOrders(sortedOrders);
      } catch (err) {
        setError(`Erro ao carregar pedidos: ${err.response ? err.response.data.message : err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token, userId]);

  const fetchOrderItems = async (orderId) => {
    setModalLoading(true);
    try {
      const response = await axios.get(`${Api_VariavelGlobal}/api/pedidos/${userId}/itens/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSelectedOrderItems(response.data || []);
    } catch (err) {
      setError(`Erro ao carregar itens do pedido: ${err.response ? err.response.data.message : err.message}`);
    } finally {
      setModalLoading(false);
    }
  };

  const handleOrderClick = async (order) => {
    await fetchOrderItems(order.ID_PEDIDO);
    setIsModalVisible(true);
  };

  const getStatus = (value) => {
    const numericValue = Number(value);
    switch (numericValue) {
      case 1: return '';
      case 2: return 'Intenção de Compra';
      case 3: return 'Aguardando Confirmação';
      case 4: return 'Em Preparação';
      case 5: return 'Em Entrega';
      case 6: return 'Concluído';
      default: return 'Desconhecido';
    }
  };

  const getPaymentMethod = (value) => {
    const numericValuePay = Number(value);
    switch (numericValuePay) {
      case 1: return 'Dinheiro';
      case 2: return 'Cartão';
      case 3: return 'Pix';
      default: return 'Desconhecido';
    }
  };

  const getDeliveryMethod = (value) => {
    const numericValueDelivery = Number(value);
    switch (numericValueDelivery) {
      case 1: return 'Delivery';
      case 2: return 'Buscar na Loja';
      case 3: return 'Agendamento';
      default: return 'Desconhecido';
    }
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
        <h1 className="titulo-home"><FaClipboardList /> Meu(s) Pedido(s)</h1>
        <p>Usuário não autenticado! <br />Por favor, faça <Link to={'/Profile'}>login</Link> para ver seus pedidos.</p>
      </div>
    );
  }

  if (error) {
    return <Alert message={error} type="error" />;
  }

  // Cálculo dos pedidos da página atual
  const indexOfLastOrder = currentPage * itemsPerPage;
  const indexOfFirstOrder = indexOfLastOrder - itemsPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

  return (
    <div className='container'>
      <h1 className="titulo-home"><FaClipboardList /> Meu(s) Pedido(s)</h1>
      {loading ? (
  <div className="loading-screen-orders loading-screen">
    <Flex className="loading-icon-screen" align="center">
      <Spin indicator={<LoadingOutlined spin />} size="large" />
    </Flex>
  </div>
) : currentOrders.length === 0 ? ( // Verifica se a lista está vazia
  <div style={{ textAlign: 'center', marginTop: '100px' }}>
    <h3>Nenhum pedido encontrado.</h3>
    <p>Você ainda não realizou nenhum pedido.</p>
  </div>
) : (
  <div style={{ paddingBottom: '30px' }}>
    {currentOrders.map((order) => (
      <div style={{ background: '#ededed' }} className="orders-card" key={order.ID_PEDIDO}>
        <Card
          title={`Pedido #${order.ID_PEDIDO}`}
          bordered={false}
          style={{ width: '100%' }}
          className="list-orders"
          onClick={() => handleOrderClick(order)}
        >
          <div className="order-content">
            <div className="order-date"><FaCalendar /> {moment(order.DATA).format('DD/MM/YYYY HH:mm')}</div>
            <div className="order-id"><FaClock /> {getStatus(order.STATUS)}</div>
            <div className="order-pay"><FaCreditCard /> {getPaymentMethod(order.PAGAMENTO)}</div>
            <div className="order-delivery"><FaMotorcycle /> {getDeliveryMethod(order.ENTREGA)}</div>
            <div className="order-total">Total: R$ {order.TOTAL}</div>
          </div>
        </Card>
      </div>
    ))}
    {/* Paginação */}
    <Pagination
      current={currentPage}
      total={orders.length}
      pageSize={itemsPerPage}
      onChange={(page) => setCurrentPage(page)}
      style={{ textAlign: 'center', marginTop: '20px' }}
    />
  </div>
)}


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
