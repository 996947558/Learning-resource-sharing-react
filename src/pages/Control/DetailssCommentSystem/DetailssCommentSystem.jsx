import React from 'react'
import {useParams} from 'react-router-dom'
import axios from 'axios'
import { Comment, List, Tooltip, Pagination,Spin } from 'antd';


export default function DetailssCommentSystem() {
  const IdData = useParams()
  const [current, setCurrent] = React.useState(1)
  const [Comments, setComments] = React.useState([])
  const [CommentCount, setCommentCount] = React.useState(1)
  const [loading, setLoading] = React.useState(false)
  let data = Comments.map((item) =>{
    return {     
        actions: [<span key="comment-list-reply-to-0" style={{color:'red'}} onClick={deleteComment(item.commentID)}>删除该评论</span>],
        author: item.username,
        avatar: 'https://joeschmoe.io/api/v1/random',
        content: (
          <p>
            {item.content}
          </p>
        ),
        datetime: (
          <Tooltip title={item.time}>
            <span>{item.time}</span>
          </Tooltip>
        ),
    }
  })
  function  queryCommentByPassageID() {
    setLoading(true)
    axios.get('/passage/queryCommentByPassageID?pageNo='+current+'&pageSize=10&passageID='+IdData.id).then(
      res => {
        console.log(res);
        setComments(res.data.slice(0,-1))
        let length = res.data.length;
        setCommentCount(res.data[length-1].substring(3)*10)
        setLoading(false)

        console.log(data);
      },
      error => {
        alert('网络繁忙，请稍后再试')
        console.log(error);
        setLoading(false)
      }
      )
    }
    React.useEffect(()=>{
      queryCommentByPassageID()
    },[current])//eslint-disable-line
  function  deleteComment(res) {
    return ()=> {
      console.log(res);
      axios.post('/admin/deleteComment?commentID='+res).then(
        data => {
          alert('删除成功')
          queryCommentByPassageID()
        },
        error => {
          alert('删除失败了QAQ')
        }
        )
    }

  }
  return (
    <>
      <Spin spinning={loading}>
        <List
        className="comment-list"
        header={data.length===0?'该文章没有评论':`该页共有 ${data.length} 条回复`}
        itemLayout="horizontal"
        dataSource={data}
        renderItem={(item) => (
          <li>
            <Comment
              actions={item.actions}
              author={item.author}
              avatar={item.avatar}
              content={item.content}
              datetime={item.datetime}
            />
          </li>
        )}
      />
        <Pagination defaultCurrent={1} total={CommentCount} style={{textAlign:'center'}} onChange={setCurrent}/>
      </Spin>
  </>
  )
}
