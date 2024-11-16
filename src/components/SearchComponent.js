import React from 'react';
import { Input, notification } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Search } = Input;

const SearchComponent = () => {
  const navigate = useNavigate();

  const onSearch = (value) => {
    // Verifica se o campo de pesquisa não está vazio antes de realizar a navegação
    if (value.trim() !== '') {
      navigate(`/search?query=${encodeURIComponent(value)}`);
    } else {
      // Exibe uma notificação se o campo estiver vazio
      notification.error({
        message: 'Campo de pesquisa vazio',
        description: 'Por favor, preencha o campo de pesquisa antes de continuar.',
      });
    }
  };

  return (
    <div className='section-search-component'>
      <Search 
        placeholder="O que está procurando?" 
        size='large'
        allowClear 
        onSearch={onSearch}
      />
    </div>
  );
};

export default SearchComponent;
