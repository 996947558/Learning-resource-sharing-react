import React from 'react'
import { Button, Form, Input, Upload,Spin} from 'antd';
import { UploadOutlined} from '@ant-design/icons';
import axios from 'axios'
import {useNavigate,useParams} from 'react-router-dom'

  const { TextArea } = Input;


  const layout = {
    labelCol: {
      span: 5,
    },
    wrapperCol: {
      span: 16,
    },
  };
  /* eslint-disable no-template-curly-in-string */

  const validateMessages = {
    required: '该内容为必填项目！'
  };
    /* eslint-enable no-template-curly-in-string */

  const normFile = (e) => {
    console.log('Upload event:', e);
    if (Array.isArray(e)) {
      return e;
    }
  
    return e?.fileList;
  };

export default function Revise() {
  //获取表格
  const formRef = React.useRef()
  //设置加载
  const [loading, setLoading] = React.useState(false);


  const IdData = useParams()
  //console.log(IdData);
  //整个图片的默认显示
  const [fileList, setFileList] = React.useState([]);
  //整个文章默认显示
  const [articles,setArticles] = React.useState([]);
  const [title, setTitle] = React.useState('');
  const [content, setContent] = React.useState('');
  const navigate = useNavigate()
  function toArticleSystem() {
    navigate('/control/articleSystem')
  }
  //提交数据
  const onFinish = (values) => {
    console.log(values);
    axios.post('/admin/updatePassage?content='+values.content+'&passageID='+IdData.id+'&title='+values.title).then(
      res => {
      let id = IdData.id;
      let resources = values.upload;
      if (resources!==undefined) {
        let formDataOne = new FormData();
        // formDataOne.append('file', resources);
        resources.forEach(item => {
          //将fileList中每个元素的file添加到formdata对象中
          //formdata对Key值相同的，会自动封装成一个数组
              formDataOne.append('file', item.originFileObj);
          });
        formDataOne.append('passageID', id)
        axios.post('/admin/uploadResources', formDataOne, {
          headers:{
        'Content-Type':'multipart/form-data',
          }
        }).then(
          res=>{
            //console.log(res);
          },
          error => {
            alert('上传文件失败，可能是文件类型不合适？')
          }
        )
    };

      if (values.img !== undefined) {
      let img = values.img.fileList;
      let formData = new FormData();
      img.forEach(item => {
        //将fileList中每个元素的file添加到formdata对象中
        //formdata对Key值相同的，会自动封装成一个数组
            formData.append('file', item.originFileObj);
        });
          formData.append('passageID', id)
          axios.post('/admin/uploadImg', formData, {
            headers:{
          'Content-Type':'multipart/form-data',
            }
          }).then(
            res=>{
              //console.log(res);
            },
            error => {
              alert('上传图片失败，可能是文件类型不合适？')
            }
          )
      };
      alert('修改文章成功！！')
      navigate('/control/articleSystem')
     },
      error => {
        alert('网络繁忙，请稍后再试')
        //console.log(error);
      }
     )
  };
  //禁止上传图片时默认提交文件
  const beforeupload = ({fileList}) =>{
    return false;
  };
  //上传图片时默认别红了，没有这两个，上传时是没办法显示出来的 设置了状态file.status = 'done'
  function upload(lg) {
    let fileList = lg.fileList;
    fileList.filter(file => file.status = 'done');
    setArticles(fileList)
  }
  function handleChangeUpload(lg) {
    let fileList = lg.fileList;
    fileList.filter(file => file.status = 'done');
    //console.log(lg.fileList);
    setFileList(fileList)
  }
  //获取最开始的数据并显示出来
  function getArticleDetails() {
    setLoading(true)
    axios.get('/passage/passageResources?passageID='+IdData.id).then(
      res => {
        setLoading(false)
        //console.log(res.data);
        setTitle(res.data[0].title) 
        setContent(res.data[0].content)
        //console.log(res.data[1])
        if(res.data[1] !== undefined) {
          let article = [];
          for (let i in res.data[1]) {
            article[i] = {
              uid:res.data[1][i].id,
              name:res.data[1][i].address.replace(/(.*\/)*([^.]+).*/ig,"$2")+'.'+res.data[1][i].address.replace(/.+\./,""),
              status:'done',
            }
          }
          //console.log(article);
          setArticles(article)
        }
        if(res.data[2] !== undefined) {
          //console.log(Object.keys(res.data[2]));
          //console.log(res.data[2])
          let img =[];
          let iii = 0;
          for (let i in res.data[2]) {
            //console.log(i.slice(6));
            let ii = i.slice(6)
            img[iii] = {
              uid:ii,
              name:'图片'+ii,
              thumbUrl:'data:image/png;base64,'+res.data[2][i],
              url:'data:image/png;base64,'+res.data[2][i],
              status:'done'
            }
            iii=iii+1
          }
          //console.log(img);
          setFileList(img)
        }
      },
      error => {
          alert('获取文章失败')
          setLoading(false)
      }
      )

  }

  //把添加表格默认值独立出来，用另一个useEffect去调用，解决了TypeError: Cannot read property ‘setFieldsValue‘ of null
  function setFrom() {
    formRef.current.setFieldsValue({
      title : title,
      content : content
    })
  }
  //删除文章资源
  function deleteResources() {
    return(event)=> {
      //console.log(event.uid);
      axios.post('/admin/deleteResources?resourcesID='+event.uid).then(
        res=> {
          //console.log(res);
        },
        error => {
          alert('w(ﾟДﾟ)w删除失败了诶，重新试试？')
          return false
        }
        )
    }
  }
  //删除文章图片
  function deleteImg() {
    return(event)=> {
      //console.log(event);
      axios.post('/admin/deleteImg?imgID='+event.uid).then(
        res=> {
          //console.log(res);
        },
        error => {
          alert('w(ﾟДﾟ)w删除失败了诶，重新试试？')
          return false
        }
        )
    }
  }
  React.useEffect(()=>{
    getArticleDetails()
  },[])//eslint-disable-line
  React.useEffect(()=>{
    setFrom()
  },[title,content])//eslint-disable-line
  return (
    <Spin spinning={loading}>
    <Form {...layout} name="nest-messages" onFinish={onFinish} validateMessages={validateMessages} ref={formRef} >
      <Form.Item
        name='title'
        label="文章标题"
        initialValue={title}
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input/>
      </Form.Item>
      <Form.Item
      name='content'
      label="文章内容"
      initialValue={content}
      rules={[
        {
          required: true,
        },
      ]}
      >
        <TextArea
          autoSize={{
            minRows: 4,
            maxRows: 6,
          }}
        />
      </Form.Item>
{/* valuePropName必须填入相应的那个名，不然获取不到数据的。。。。 */}
      <Form.Item
        name="upload"
        label="上传文件"
        valuePropName="articles"
        getValueFromEvent={normFile}
      >
        <Upload  beforeUpload={beforeupload} fileList={articles} onChange={upload} onRemove={deleteResources()}>
          <Button icon={<UploadOutlined />}>Upload</Button>
        </Upload>
      </Form.Item>

      <Form.Item
        name="img"
        label="上传图片"
        valuePropName="img"
      >
    <Upload
      listType="picture"
      onChange={handleChangeUpload}
      fileList={fileList}
      beforeUpload={beforeupload}
      onRemove={deleteImg()}
    >
      <Button icon={<UploadOutlined />}>Upload</Button>
    </Upload>

      </Form.Item>

      <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
        <Button type="primary" htmlType="submit">
          提交
        </Button>

        <Button type="primary" style={{marginLeft:'60px'}} onClick={toArticleSystem}>
          返回
        </Button>
      </Form.Item>
    </Form>
    </Spin>
  )
}