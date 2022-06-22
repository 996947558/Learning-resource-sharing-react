import React,{useState} from 'react'
import { Input,Button } from 'antd';
import axios from 'axios'
import './Bulletin.css'

const { TextArea } = Input;


export default function BulletinSystem() {
  const [value, setValue] = useState('');
  function upBulletin() {
    console.log(value);
    axios.post('/admin/updateNotice?content='+value).then(
      res => {
        console.log(res);
        alert("发布成功")
        setValue('')
      },
      error => {
        alert("发布失败")
      }
      )
  }
  return (
    <div className='Bulletin'>
    <h1>发布公告：</h1>
    <TextArea
      value={value}
      onChange={e => setValue(e.target.value)}
      placeholder="请输入公告"
      autoSize={{ minRows: 5, maxRows: 8 }}
    />
    <Button type="primary" onClick={upBulletin} className='BulletinButton'>提交公告</Button>
    </div>
  )
}
