import React from 'react';
import { Modal, Input, Form, Button } from 'antd';
import { FaUserCheck } from "react-icons/fa";

const Loginmodal = ({ onClose }) => {
  return (
    <Modal visible={true} onCancel={onClose} footer={null}>
      <div className=''>
       <h1 className="titulo-home"><FaUserCheck /> Autenticar</h1>
        <p>Seja Bem vindo !!!</p>
        <Form.Item>
          <Input type='text' size='large' name='EMAIL' placeholder='Email' />
        </Form.Item>

        <Form.Item>
          <Input type='password' size='large' name='SENHA' placeholder='Senha' />
        </Form.Item>

        <div className='container center'>
          <div className='flex_profile'>
            <Button type="default" size='large'>Efetuar Login</Button>
          </div>
        </div> 
        </div>  
    </Modal>
  );
};

export default Loginmodal;
