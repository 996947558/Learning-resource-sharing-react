import React from 'react'
import './header.css'
import { Menu, Dropdown, Space,Row, Col } from 'antd';
import { HomeTwoTone } from '@ant-design/icons';
import {useNavigate} from 'react-router-dom'




export default function Header() {
  function quit() {
    //console.log(username);
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    localStorage.removeItem('userId')
    setUsername()
    window.location.reload()
  }
  function toControl() {
    if(localStorage.getItem('username')==='admin') {
      navigate('/control')
  }else {
      alert('无权访问')
  }

  }
  const menu = (
      <Menu
        items={[
          {
            label: (
              <a onClick={quit}>
                退出登陆
              </a>
            ),
          },
          {
            label: (
              <a onClick={toControl}>
                进入控制界面
              </a>
            ),
          },
        ]}
      />
    );
  const navigate = useNavigate()
  function handle() {
    navigate('/login')
  }
  function toHome() {
    navigate('/home')
  }

  const [username,setUsername] = React.useState(localStorage.getItem("username"))
  const [isShow,setIsShow] = React.useState(true)
  React.useEffect(()=>{
    if (username == null) {
      setIsShow((isShow)=>{
        isShow=false;
      })
    }
  },[username])

  return (
    <div className='header'>
    <Row>
      <Col span={8}>
        <div className='header-icon header-item' onClick={toHome}>
            <HomeTwoTone style={{fontSize:'40px',height:'64px',lineHeight:'64px',paddingLeft:'10px'}}/>
        </div>
      </Col>
      <Col span={8}>
        <div className='header-center'>
            学习资源小站
        </div>
      </Col>
      <Col span={8}>
          <div className={isShow === true?"header-right show":"header-right noshow"}>
            <Dropdown overlay={menu}>
                <a className={'header-item show'}>
                <Space style={{color:'white'}}>
                    hi,{username}
                </Space>
                </a>
            </Dropdown>
          </div>
          <div className={isShow !== true?"header-right show":"header-right noshow"}>
                <a onClick={handle} className={'header-item show'}>
                <Space style={{color:'white'}}>
                   登陆/注册
                </Space>
                </a>
          </div>
      </Col>
    </Row>
    </div>
  )
}
