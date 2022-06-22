import React from 'react'
import { Space, Table, Button } from 'antd';
import axios from 'axios'
import {useNavigate} from 'react-router-dom'




export default function ArticleSystem() {
  const navigate = useNavigate()
  const columns = [
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      ellipsis:true,
    },
    {
      title: '内容',
      dataIndex: 'content',
      key: 'content',
      width:700,
      ellipsis:true,
    },
    {
      title: '时间',
      dataIndex: 'time',
      key: 'time',
    },
    {
      title: '操作',
      key: 'operate',
      render: (_,record) => (
        <Space>
          <a onClick={toRevise(record.key)}>设置</a>
          <a onClick={deletePassage(record.key)} style={{color:'red'}}>删除</a>
          <a onClick={toDetailssCommentSystem(record.key)}>评论管理</a>
        </Space>
      ),
    },
  ];
  const [current, setCurrent] = React.useState(1)
  const [articles, setArticles] = React.useState([])
  const [articlesCount, setArticlesCount] = React.useState(1)
  const [TotalFileCount, setTotalFileCount] = React.useState('')
  const [loading, setLoading] = React.useState(true)
  const data = articles.map((item) =>{
    return {...item,key:item.id}
})

  function  getAllPassage() {
    setLoading(true)
    axios.get('/passage/queryAllPassage?pageNo='+current+'&pageSize=8').then(
      res => {
        //console.log(res);
        //console.log(res.data.passageItemCount);
        setArticles(res.data.passageItem);
        setArticlesCount(res.data.passageItemCount);
        //console.log(articles);
        //console.log(articlesCount);
        setLoading(false)
      },
      error => {
        alert('网络繁忙，请稍后再试')
        console.log(error);
        setLoading(false)
      }
      )

  }
  function  deletePassage(res) {
    return ()=>{
      axios.post('/admin/deletePassage?passageID='+res).then(
        data => {
          //console.log(data);
          if(data.data === 'isOk') {
              alert('删除成功')
              getAllPassage()
              queryTotalFileCount()
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
  function  queryTotalFileCount() {
    axios.post('/admin/queryTotalFileCount').then(
      function(data) {
        setTotalFileCount(data.data)
      }
      )
  }
  function  toCreate() {
    navigate('/control/create')
  }
  function toRevise(id) {
    return ()=> {
      navigate(`/control/revise/${id}`)
    }
  }
  function toDetailssCommentSystem(id) {
    return ()=> {
      navigate(`/control/DetailssCommentSystem/${id}`)
    }
  }
  React.useEffect(()=>{
    // setCurrent()
    queryTotalFileCount()
  },[])//eslint-disable-line
  React.useEffect(()=>{
    getAllPassage()
  },[current])//eslint-disable-line
  return (
    <>
      <Button type="primary" style={{marginBottom:'5px'}} onClick={toCreate}>
        新建文章
      </Button>
    <span style={{float:'right'}}>文件总数为：{TotalFileCount}</span>
    <Table columns={columns} dataSource={data}  loading={loading}
    pagination={{ 
      position: ["bottomCenter"],
      total:articlesCount,
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
