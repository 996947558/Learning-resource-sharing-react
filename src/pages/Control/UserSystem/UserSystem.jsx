import React from 'react'
import {  Input,Table, } from 'antd';
import axios from 'axios'
const { Search } = Input;


export default function UserSystem() {
  const [current, setCurrent] = React.useState(1)
  const columns = [
    {
      title: 'ID',
      dataIndex: 'userId',
      width:420,
      key: 'userId',
      ellipsis:true,
    },
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
      width:420,
      ellipsis:true,
    },
    {
      title: '密码',
      dataIndex: 'password',
      key: 'password',
      width:420,
      ellipsis:true,
    },
  ];
  const [User, setUser] = React.useState([])
  const [UserCount, setUserCount] = React.useState(1)
  const [loading, setLoading] = React.useState(true)
  const data = User.map((item) =>{
    return {...item,key:item.userId}
})
    function getAllUser() {
      setLoading(true)
      axios.post('/admin/queryAllUser?pageNo='+current+'&pageSize=8').then(
            res => {
              //console.log(res);
              //console.log(res.data[1].substring(3));
              setUser(res.data[0])
              setUserCount(res.data[1].substring(3)*8)
              setLoading(false)
            },
            error => {
              alert('网络繁忙，请稍后再试')
              console.log(error);
              setLoading(false)
            }
            )
    }
    React.useEffect(()=>{
      getAllUser()
    },[current])//eslint-disable-line
    const onSearch = (value) => {
      axios.post('/admin/queryUserInfoByName?name='+value).then(
        data=> {
          if (data.data === '') {
            alert('查无该用户')
          } else {
            alert('该用户存在，\nID：'+data.data.userId+'\n用户名：'+data.data.username+'\n密码：'+data.data.password)
          }
        },
        error=> {
          alert('网络繁忙，请稍后再试')
        }
      )
    };
  return (
    <>
    <Search placeholder="输入用户名以搜索用户" onSearch={onSearch} enterButton style={{marginBottom:'10px'}}/>
    <Table columns={columns} dataSource={data}  loading={loading}
    pagination={{ 
      position: ["bottomCenter"],
      total:UserCount,
      showSizeChanger:false,
      pageSize:8,
      onChange:(page,_)=>{
        //console.log(page);
        setCurrent(page)
      }
    }}
    />
    </>
  )
}
