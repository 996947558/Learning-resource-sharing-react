import React from 'react'
import { Layout, Menu,} from 'antd';
import { SettingOutlined, UserOutlined,NotificationOutlined,ReadOutlined } from '@ant-design/icons';
import './control.css'
import {Outlet,useNavigate} from 'react-router-dom'

const { Content, Sider } = Layout;



export default function Control() {
    const navigate = useNavigate()
    React.useEffect(() => { 
        toArticleSystem()
        }, []) //eslint-disable-line

    const items = ['文章设置','用户设置','公告设置','大厅留言板设置']

    const keyPath = ['/articleSystem','/userSystem','/bulletinSystem','/commentSystem',]

    function toArticleSystem() {
    navigate('/control/articleSystem')
    }

  return (
    <Layout>
    <Sider
      breakpoint="lg"
      collapsedWidth="0"
    >
      <Menu
        theme="dark"
        onClick={(item)=>{
            //console.log(item);
            navigate('/control'+item.keyPath)
        }}
        mode="inline"
        defaultSelectedKeys={['/articleSystem']}
        items={[ReadOutlined, UserOutlined, NotificationOutlined, SettingOutlined].map(
          (icon, index) => ({
            key: keyPath[index],
            icon: React.createElement(icon),
            label: items[index],
          }),
        )}
      />
    </Sider>
    <Layout>
      <Content style={{ margin: '24px 16px 0' }}>
        <div className="site-layout-background" style={{ padding: 24, minHeight: 633 }}>
            <div>
            <Outlet/>
            </div>
            {/* <div className='lod'>
            <Spin size="large"/>
            </div> */}
        </div>
      </Content>
    </Layout>
  </Layout>
  )
}
