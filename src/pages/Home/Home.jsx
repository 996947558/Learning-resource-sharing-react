import React,{ useState } from 'react'
import {useNavigate} from 'react-router-dom'
import axios from 'axios'
import './Home.css'
import { Row, Col, Pagination ,Avatar, Button, Comment, Form, Input, List,Tooltip, Spin,Divider} from 'antd';
import {NotificationOutlined} from '@ant-design/icons';
const { TextArea } = Input;
let moment = require('moment');

const CommentList = ({ comments }) => (
  <List
    dataSource={comments}
    header={`大厅留言板`}
    itemLayout="horizontal"
    renderItem={(props) => <Comment {...props} />}
  />
);

const Editor = ({ onChange, onSubmit, submitting, value }) => (
  <>
    <Form.Item>
      <TextArea rows={4} onChange={onChange} value={value} />
    </Form.Item>
    <Form.Item>
      <Button htmlType="submit" loading={submitting} onClick={onSubmit} type="primary">
        发言
      </Button>
    </Form.Item>
  </>
);

export default function Home() {
  const [loading, setLoading] = React.useState(false)

  const navigate = useNavigate()
  function toDetails(id) {
    return ()=> {
      navigate(`/details/${id}`)
    }
  }
  const [comments, setComments] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [value, setValue] = useState('');

  const handleSubmit = () => {
    if (!value) return;
    setSubmitting(true);
    axios.post('/hallComment/createHallComment?content='+value).then(
      res => {
        console.log(res);
      },
      error => {
        alert('发言失败了。。。')
      }
      )
    setTimeout(() => {
      setSubmitting(false);
      setValue('');
      setComments([
        ...comments,
        {
          author: '神秘用户',
          avatar: 'https://joeschmoe.io/api/v1/random',
          content: <p>{value}</p>,
          datetime: moment().format('YYYY-MM-DD:HH:MM:SS'),
        },
      ]);
    }, 1000);
  };

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  const [current, setCurrent] = React.useState(1)
  const [articles, setArticles] = React.useState([
    {
      id:'01',
      title:'标题',
      content:'内容'
    }
  ])
  const [articlesCount, setArticlesCount] = React.useState(1)
  function  getAllPassage() {
    setLoading(true)
    axios.get('/passage/queryAllPassage?pageNo='+current+'&pageSize=10').then(
      res => {
        // console.log(res.data);
        // console.log(res.data.passageItemCount);
        setArticles(res.data.passageItem);
        setArticlesCount(res.data.passageItemCount);
        setLoading(false)
      },
      error => {
        alert('网络繁忙，请稍后再试')
        console.log(error);
        setLoading(false)
      }
      )
  }

  const [HallCommentCount, setHallCommentCount] = React.useState(1)
  const [currentTwo, setCurrentTwo] = React.useState(1)
  function  queryAllHallComment() {
    axios.post('/hallComment/queryAllHallComment?pageNo='+currentTwo+'&pageSize=8').then(
      res => {
        let data = res.data[0].map((item) =>{
          return { 
            author: '神秘用户',
            avatar: 'https://joeschmoe.io/api/v1/random',
            content: <p>{item.content}</p>,
            datetime: (
              <Tooltip title={item.time}>
                <span>{item.time}</span>
              </Tooltip>
            ),
          }
        })
        setComments(data)
        // console.log(HallCommentCount);
        // console.log(comments);
        setHallCommentCount(Number(res.data[2].substring(4)*8))
      },
      error => {
        alert('网络繁忙，请稍后再试')
        console.log(error);
      }
      )
  }
  React.useEffect(()=>{
    if(localStorage.getItem('token')===null) {
      navigate('/login')
      alert('你还没登录捏')
    }
  },[])//eslint-disable-line
  React.useEffect(()=>{
    getAllPassage()
    getNotice()
  },[current])//eslint-disable-line
  React.useEffect(()=>{
    queryAllHallComment()
  },[currentTwo])//eslint-disable-line
  const [Notice, setNotice] = React.useState('')
  function getNotice() {
    axios.get('/notice/queryNotice').then(
        function(res) {
          //console.log(res);
          setNotice(res.data[0]);
        }
        )
    }
  return (
    <>
    <Spin spinning={loading}>
    <div className='home'>
      <Row  gutter={16}>
        <Col span={18}>
          {articles.map(item => {
            return <div key={item.id} className='item' onClick={toDetails(item.id)}>
                  <h2>{item.title}</h2>
                  <p>{item.content}</p>
                  <span>{item.time}</span>
                  </div>
          })}
          <Pagination defaultCurrent={1} showSizeChanger={false} total={articlesCount} style={{textAlign:'center',marginTop:'10px'}} onChange={setCurrent}/>
        </Col>
        <Col span={6} className='HomeRight'>
              <div>
                <h2><NotificationOutlined/>本站公告</h2>
                <h3>{Notice.content}</h3>
                <Divider />
              </div>
              <div className='HomeComment'>
              {comments.length > 0 && <CommentList comments={comments} />}
              <Pagination size="small" pageSize='8' showSizeChanger={false} defaultCurrent={1} total={HallCommentCount} style={{textAlign:'center',marginTop:'10px'}} onChange={setCurrentTwo}/>
              <Comment
                avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
                content={
                  <Editor
                    onChange={handleChange}
                    onSubmit={handleSubmit}
                    submitting={submitting}
                    value={value}

                  />
                }
              />
            </div>
        </Col>
      </Row>
    
    </div>
    </Spin>
    </>
  )
}
