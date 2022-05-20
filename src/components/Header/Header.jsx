import React from 'react'
import './header.css'
import { Menu, Dropdown, Space } from 'antd';
import { HomeTwoTone,DownOutlined, SmileOutlined } from '@ant-design/icons';

const menu = (
    <Menu
      items={[
        {
          label: (
            <span>
              1st menu item
            </span>
          ),
        },
        {
          label: (
            <span>
              2nd menu item (disabled)
            </span>
          ),
          icon: <SmileOutlined />,
          disabled: true,
        },
        {
          label: (
            <span>
              3rd menu item (disabled)
            </span>
          ),
          disabled: true,
        },
        {
          danger: true,
          label: 'a danger item',
        },
      ]}
    />
  );

export default function Header() {
  return (
    <div className='header'>
        <div className='header-icon'>
            <HomeTwoTone style={{fontSize:'40px',height:'64px',lineHeight:'64px',paddingLeft:'10px'}}/>
        </div>
        <div className='header-center'>
            学习资源小站    
        </div>
        <Dropdown overlay={menu}>
            <a onClick={e => e.preventDefault()}>
            <Space>
                Hover me
                <DownOutlined />
            </Space>
            </a>
        </Dropdown>
    </div>
  )
}
