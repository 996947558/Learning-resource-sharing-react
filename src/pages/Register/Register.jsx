import React from 'react'
import { Form, Input,Button } from 'antd';
import './register.css'
import axios from 'axios'
import {useNavigate,Link} from 'react-router-dom'

export default function Login() {
  
  const navigate = useNavigate()
  const onFinish = (data) => {
    axios.post('/user/register?password='+data.password+'&username='+data.username).then(
      function(res) {
          console.log(res);
          if(res.data === 'isOk') {
              alert('注册成功')
              navigate('/login')
          } else {
            alert('该用户已注册')
          }
      }
      )
  };
  const [form] = Form.useForm();
  return (
  <div className='register'>
    <div className='register'>
      <h1>用户注册</h1>
      <Form
      name="register"
      form={form}
      onFinish={onFinish}
    >
      <Form.Item
        name="username"
        label="用户名"
        rules={[
          {
            required: true,
            message: '请输入用户名',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="password"
        label="密码"
        rules={[
          {
            required: true,
            message: '请输入密码',
          },
        ]}
        hasFeedback
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        name="confirm"
        label="再次输入密码"
        dependencies={['password']}
        hasFeedback
        rules={[
          {
            required: true,
            message: '请输入密码!',
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('与你刚才输入的密码不相同，请重新试试'));
            },
          }),
        ]}
      >
        <Input.Password />
        
      </Form.Item>
      <Form.Item>
      <Link to="/login">已注册？返回登录</Link><br /><br />
        <Button type="primary" htmlType="submit">
          注册
        </Button>
      </Form.Item>
      </Form>
  </div>
  </div>
  
  )
}