import React from 'react'
import { Space, Table, } from 'antd';
import axios from 'axios'




export default function CommentSystem() {
  const [current, setCurrent] = React.useState(1)
  const columns = [
    {
      title: '内容',
      dataIndex: 'content',
      width:700,
      key: 'content',
      ellipsis:true,
    },
    {
      title: '时间',
      dataIndex: 'time',
      key: 'time',
      ellipsis:true,
    },
    {
      title: '操作',
      key: 'operate',
      render: (_,record) => (
        <Space>
          <a onClick={deleteHallComment(record.key)} style={{color:'red'}}>删除</a>
        </Space>
      ),
    },
  ];

  const [HallComment, setHallComment] = React.useState([])
  const [HallCommentCount, setHallCommentCount] = React.useState(1)
  const [loading, setLoading] = React.useState(false)
  const data = HallComment.map((item) =>{
    return {...item,key:item.id}
})

  function  queryAllHallComment() {
    setLoading(true)
    axios.post('/hallComment/queryAllHallComment?pageNo='+current+'&pageSize=8').then(
      res => {
        //console.log(res);
        setHallComment(res.data[0])
        setHallCommentCount(Number(res.data[2].substring(4)*8))
        setLoading(false)
      },
      error => {
        alert('网络繁忙，请稍后再试')
        console.log(error);
        setLoading(false)
      }
      )
  }
  function  deleteHallComment(res) {
    return ()=>{
      axios.post('/admin/deleteHallComment?ID='+res).then(
        data => {
          //console.log(data);
          if(data.status === 200) {
              alert('删除成功')
              queryAllHallComment()
          } else {
            alert('删除失败,请稍后再试')
          }
        },
        error => {
          console.log(error);
          alert('删除失败,请稍后再试')
        }
        )
    }
  }
  // React.useEffect(()=>{
  //   setCurrent()
  // },[])//eslint-disable-line
  React.useEffect(()=>{
    queryAllHallComment()
  },[current])//eslint-disable-line
  return (
    <>
    <Table columns={columns} dataSource={data}  loading={loading}
    pagination={{ 
      position: ["bottomCenter"],
      total:HallCommentCount,
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
