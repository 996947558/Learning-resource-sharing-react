import React from 'react'
import { Form, Input, Button } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import './login.css'
import axios from 'axios'
import {Link,useNavigate} from 'react-router-dom'

export default function Login() {
  
  const navigate = useNavigate()
  const onFinish = (data) => {
    axios.post('/user/userLogin?password='+data.password+'&username='+data.username).then(
			res => {
				//请求成功后通知App更新状态
				console.log(res);
        if (res.data.code !== 200) {
          alert('账号或密码错误，请重新输入')
        } else {
        localStorage.setItem('token',res.data.data.token);
        localStorage.setItem('username',data.username)
        localStorage.setItem('userId',res.data.data.userID)
        alert('登陆成功');
        navigate('/home')
        window.location.reload()
        }
			},
			error => {
				//请求失败后通知App更新状态
				console.log(error);
			}
		)
  };

  return (
  <div className='bk'>
    <div className='login'>
      <h1>用户登录</h1>
    <Form
    name="normal_login"
    className="login-form"
    initialValues={{ remember: true }}
    onFinish={onFinish}
  >
    <Form.Item
      name="username"
      rules={[{ required: true, message: '请输入用户名' }]}
    >
      <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="用户名" />
    </Form.Item>
    <Form.Item
      name="password"
      rules={[{ required: true, message: '请输入密码' }]}
    >
      <Input
        prefix={<LockOutlined className="site-form-item-icon" />}
        type="password"
        placeholder="密码"
      />
    </Form.Item>

    <Form.Item>
      <Button type="primary" htmlType="submit" className="login-form-button">
        登 录
      </Button>
       <Link to="/register">未注册，点击注册</Link>
    </Form.Item>
  </Form>
  </div>
  </div>
  
  )
}
