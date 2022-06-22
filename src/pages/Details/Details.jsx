import React ,{ useState } from 'react'
import './Details.css'
import { Divider,Spin ,Avatar, Button, Comment, Form, Input, List,Pagination,Tooltip} from 'antd';
import axios from 'axios'
import {useParams} from 'react-router-dom'
const { TextArea } = Input;
let moment = require('moment');

const CommentList = ({ comments }) => (
  <List
    dataSource={comments}
    header={`${comments.length} ${comments.length > 1 ? '回复' : 'reply'}`}
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

export default function Details() {
    const IdData = useParams()
    const [title, setTitle] = React.useState('');
    const [content, setContent] = React.useState('');
    const [time, setTime] = React.useState('');
    const [loading, setLoading] = React.useState(false)
    const [img, setImg] = React.useState([]);
    const [address, setAddress] = React.useState([]);
    function getArticleDetails() {
      setLoading(true)
      axios.get('/passage/passageResources?passageID='+IdData.id).then(
        res => {
          console.log(res.data);
          setTitle(res.data[0].title) 
          setContent(res.data[0].content)
          setTime(res.data[0].time)
          if(res.data[2] !== undefined) {
            // console.log(Object.values(res.data[2]));
            // let imgUcl = Object.values(res.data[2])
            setImg(Object.values(res.data[2]))
          }
          if(res.data[1][0] !== undefined) {
            console.log(res.data[1]);
            setAddress(res.data[1]);
            }
          setLoading(false)
        },
        error => {
            alert('获取文章失败')
            setLoading(false)
        }
        )
  
    }
    React.useEffect(()=>{
      getArticleDetails()
    },[])//eslint-disable-line
    function  downResources(data) {
      return ()=> {
        let name=data.substr(49)
        // console.log(this.address);
        //console.log(this.name);
        axios.post('/passage/downResources?filePath='+data,data,{
            responseType: 'blob',
        }).then(
            function(res) {
              //console.log(res);
              let blob = new Blob([res.data]);
              let url = window.URL.createObjectURL(blob); // 创建一个临时的url指向blob对象
              let a = document.createElement("a");
              a.href = url;
              a.download = name;
              a.click();
              // 释放这个临时的对象url
              window.URL.revokeObjectURL(url); 
              //fileDownload(res.data,_this.name)
            }
            )
      }
      }
    const [currentTwo, setCurrentTwo] = React.useState(1)
    const [CommentCount, setCommentCount] = React.useState(1)
    const [comments, setComments] = React.useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [value, setValue] = useState('');
    const handleSubmit = () => {
      if (!value) return;
      setSubmitting(true);
      let userId = localStorage.getItem('userId')
      axios.post('/comment/createComment?content='+value+'&passageID='+IdData.id+'&userID='+userId).then(
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
            author: localStorage.getItem('username'),
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
  
    function  queryCommentByPassageID() {
      axios.get('/passage/queryCommentByPassageID?pageNo='+currentTwo+'&pageSize=10&passageID='+IdData.id).then(
        res => {
          console.log(res.data.slice(0,-1));
          let data = res.data.slice(0,-1).map((item)=> {
            return { 
              author: item.username,
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
          let length = res.data.length;
          setCommentCount(res.data[length-1].substr(3,1)*8)
        }
        )
      }
      React.useEffect(()=>{
        queryCommentByPassageID()
      },[currentTwo])//eslint-disable-line 
  
  return (
    <Spin spinning={loading}>
      <div className='Details'>
        <div>
          <h1 className='DetailsTitle'>{title}</h1>
          <span style={{color:'#7d7d7d'}}>{time}</span>
          <Divider />
          {img.map((item,index) => {
            return  <img key={index} src={'data:image/png;base64,'+item} alt=''style={{width:'200px',height:'200px',float: 'left'}}/>
          })}
          <p className='DetailsContent'>{content}</p>
          <Divider />
          <div>
            {address.map(item => {
            return <a key={item.id} style={{display:'block'}} onClick={downResources(item.address)}>{item.address.replace(/(.*\/)*([^.]+).*/ig,"$2")+'.'+item.address.replace(/.+\./,"")}</a>
          })}
          </div>
        </div>
        <Divider />
        <div className='Comment'>
          <>
            {comments.length > 0 && <CommentList comments={comments} />}
            <Pagination size="small" pageSize='8' showSizeChanger={false} defaultCurrent={1} total={CommentCount} style={{textAlign:'center',marginTop:'10px'}} onChange={setCurrentTwo}/>
            <Comment
              avatar={<Avatar src="https://joeschmoe.io/api/v1/random" alt="Han Solo" />}
              content={
                <Editor
                  onChange={handleChange}
                  onSubmit={handleSubmit}
                  submitting={submitting}
                  value={value}
                />
              }
            />
          </>
        </div>
      </div>
    </Spin>
  )
}
