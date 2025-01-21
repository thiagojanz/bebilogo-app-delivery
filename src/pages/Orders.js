import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Spin, Alert, Modal, Button, Card, Flex, Pagination } from 'antd';
import { Api_VariavelGlobal } from '../global';
import { FaCreditCard, FaMotorcycle, FaClock, FaCalendar, FaClipboardList, FaBiking } from 'react-icons/fa';
import moment from 'moment';
import { LoadingOutlined, SyncOutlined } from '@ant-design/icons';
import { useNavigate , Link } from 'react-router-dom';
import ToAccompany from '../components/ToAccompany';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [orderId, setOrderId] = useState(null);  // Definindo o estado do orderId
  const [statusId, setStatusId] = useState(null);  // Definindo o estado do statusId
  const [currentPage, setCurrentPage] = useState(1); // Página atual
  const [itemsPerPage] = useState(5); // Número de pedidos por página
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedOrderItems, setSelectedOrderItems] = useState([]);
  const [modalLoading, setModalLoading] = useState(false);

  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');  


  const fetchOrderItems = useCallback(async (orderId, ) => {
    setModalLoading(true);
    try {
      const response = await axios.get(`${Api_VariavelGlobal}/api/pedidos/${userId}/itens/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrderId(orderId);  // Atualize o estado com o orderId  
      setSelectedOrderItems(response.data || []);
    } catch (err) {
      setError(`Erro ao carregar itens do pedido: ${err.response ? err.response.data.message : err.message}`);
    } finally {
      setModalLoading(false);
    }
  }, [userId, token]);  // Dependências de fetchOrderItems 

  const navigate = useNavigate(); // Declare o hook aqui, dentro do componente principal

  const handleOrderClick = async (order) => {
    setOrderId(''); // Limpa o estado anterior do pedido
    setStatusId(''); // Limpa o estado anterior do status
    await fetchOrderItems(order.ID_PEDIDO); // Executa a lógica de fetch necessária
    navigate(`/acompanhar-pedido/${order.ID_PEDIDO}`); // Use o navigate aqui
  };

  const getStatusText = (value) => {
    const numericValue = Number(value);
    switch (numericValue) {
      case 1:
        return "Pedido Confirmado";
      case 2:
        return "Intenção de Compra";
      case 3:
        return (<>Aguardando confirmação <FaClock style={{ marginLeft: 5, fontSize: 22, verticalAlign: 'sub' }} /></>);
      case 4:
        return (<>Em preparação <SyncOutlined spin style={{ marginLeft: 5, fontSize: 24, verticalAlign: 'sub' }} /></>);
      case 5:
        return (<>Saiu para entrega <FaBiking style={{ marginLeft: 5, fontSize: 24, verticalAlign: 'sub' }} /></>);
      case 6:
        return (<>Concluído</>);
      default:
        return "Status Desconhecido";
    }
  };

  const getCardStyles = (value) => {
    const numericValue = Number(value);
    let backgroundColor = '#F44336'; // Cor padrão para status desconhecido (vermelho)
    let color = '#FFFFFF'; // Cor do texto padrão (branco)
  
    switch (numericValue) {
      case 1:
        backgroundColor = '#FFC107'; // Loja aberta ou pedido confirmado (cor verde)
        color = '#FFFFFF'; // Cor do texto (branco)
        break;
      case 2:
        backgroundColor = '#2196F3'; // Intenção de compra (cor amarelo)
        color = '#FFFFFF'; // Cor do texto (preto)
        break;
      case 3:
        backgroundColor = 'rgb(24, 144, 255)'; // Aguardando confirmação (cor azul)
        color = '#FFFFFF'; // Cor do texto (branco)
        break;
      case 4:
        backgroundColor = 'rgb(255, 87, 34)'; // Em preparação (cor laranja)
        color = '#FFFFFF'; // Cor do texto (branco)
        break;
      case 5:
        backgroundColor = 'rgb(76, 175, 80)'; // Em entrega (cor vermelha)
        color = '#FFFFFF'; // Cor do texto (branco)
        break;
      case 6:
        backgroundColor = 'rgb(104 104 104)'; // Concluído (cor preto)
        color = '#FFFFFF'; // Cor do texto (branco)
        break;
      default:
        backgroundColor = '#F44336'; // Cor padrão para status desconhecido (vermelho)
        color = '#FFFFFF'; // Cor do texto (branco)
        break;
    }
  
    return { backgroundColor, color };
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
  
    const updateOrderStatus = async () => {
      if (token && userId) {
        try {
          const response = await axios.get(`${Api_VariavelGlobal}/api/pedidos/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
    
          const updatedOrders = response.data.sort((a, b) => b.ID_PEDIDO - a.ID_PEDIDO);
    
          setOrders((prevOrders) =>
            prevOrders.map((order) => {
              const updatedOrder = updatedOrders.find((newOrder) => newOrder.ID_PEDIDO === order.ID_PEDIDO);
    
              // Atualize o estado do statusId apenas para o pedido atual no modal
              if (order.ID_PEDIDO === orderId) {
                setStatusId(updatedOrder ? updatedOrder.STATUS : order.STATUS);
              }
    
              return updatedOrder ? { ...order, STATUS: updatedOrder.STATUS } : order;
            })
          );
        } catch (err) {
          setError(`Erro ao atualizar pedidos: ${err.response ? err.response.data.message : err.message}`);
        }
      }
      
    };
    
  
    fetchOrders(); // Carregar os pedidos inicialmente
  
    // Definir o intervalo para atualizar o status dos pedidos a cada 8 segundos
    const intervalId = setInterval(() => {
      updateOrderStatus();
    }, 5000);
  
    return () => clearInterval(intervalId); // Limpar o intervalo quando o componente for desmontado
  }, [orderId, token, userId]); // Adicionar apenas as dependências essenciais

  const renderOrderItems = () => {
    if (modalLoading) {
      return <Spin tip="Carregando itens..." />;
    }

    if (!selectedOrderItems.length) {
      return <p>Não há itens para este pedido.</p>;
    }

    return (
      <div>
  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
    <thead>
      <tr>
        <th style={{ textAlign: 'left', padding: '5px', backgroundColor: '#f0f0f0' }}>Produto</th>
        <th style={{ textAlign: 'left', padding: '5px', backgroundColor: '#f0f0f0' }}>Quantidade</th>
        <th style={{ textAlign: 'left', padding: '5px', backgroundColor: '#f0f0f0' }}>Preço Unitário</th>
        <th style={{ textAlign: 'left', padding: '5px', backgroundColor: '#f0f0f0' }}>Subtotal</th>
      </tr>
    </thead>
    <tbody>
      {selectedOrderItems.map((item, index) => {
        const precoUnitario = parseFloat(item.PRECO_UNITARIO) || 0; // Converte para número e trata valores inválidos
        const subtotal = item.QUANTIDADE * precoUnitario; // Calcula o subtotal
        return (
          <tr key={index}>
            <td style={{ padding: '5px' }}>{item.ID_PRODUTO}</td>
            <td style={{ padding: '5px' }}>{item.QUANTIDADE}</td>
            <td style={{ padding: '5px' }}>R${precoUnitario.toFixed(2)}</td>
            <td style={{ padding: '5px' }}>R${subtotal.toFixed(2)}</td>
          </tr>
        );
      })}
    </tbody>
    <tfoot>
      <tr>
        <td colSpan={3} style={{ textAlign: 'right', padding: '5px', fontWeight: 'bold' }}>Total sem frete:</td>
        <td style={{ padding: '5px', fontWeight: 'bold' }}>
          R${selectedOrderItems.reduce((acc, item) => acc + (parseFloat(item.PRECO_UNITARIO) || 0) * item.QUANTIDADE, 0).toFixed(2)}
        </td>
      </tr>
    </tfoot>
  </table>
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
      ) : currentOrders.length === 0 ? (
        <div style={{ textAlign: 'center', marginTop: '100px' }}>
          <h3>Nenhum pedido encontrado.</h3>
          <p>Você ainda não realizou nenhum pedido.</p>
        </div>
      ) : (
        <div style={{ paddingBottom: '30px'}}>
          {currentOrders.map((order) => (
            <div className="orders-card" style={{backgroundColor:'transparent'}} key={order.ID_PEDIDO}>
              <Card
  key={order.ID_PEDIDO}
  title={
    <>
      <span>{`Pedido ${order.ID_PEDIDO}`}</span>
    </>
  }
  bordered={false}
  style={{ width: '100%' }}
  className="list-orders"
  headStyle={{
    backgroundColor: getCardStyles(order.STATUS).backgroundColor,
    color: getCardStyles(order.STATUS).color
  }}
  extra={
    <span
      style={{
        color: getCardStyles(order.STATUS).color,
        fontWeight: 'bold'
      }}
    >
      {getStatusText(order.STATUS)} {/* Aqui você pode customizar o texto do status */}
    </span>
  }
  onClick={() => handleOrderClick(order)}
>
                <div className="order-content">
                  <div className="order-date"><FaCalendar /> {moment(order.DATA).format('DD/MM/YYYY HH:mm')}</div>
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
  title={`Pedido ${orderId}`}
  open={isModalVisible}
  onCancel={() => setIsModalVisible(false)}
  footer={[
    <Button key="close" onClick={() => setIsModalVisible(false)}>Fechar</Button>
  ]}
>
  {renderOrderItems(orderId)} {/* Passando o orderId */}
  <ToAccompany orderId={orderId} statusId={statusId} /> {/* Passando props corretamente */}
</Modal>

    </div>
  );
};

export default Orders;
