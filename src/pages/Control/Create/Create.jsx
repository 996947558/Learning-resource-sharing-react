import React from 'react'
import { Button, Form, Input, Upload} from 'antd';
import { UploadOutlined} from '@ant-design/icons';
import axios from 'axios'
import {useNavigate} from 'react-router-dom'

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

export default function Create() {
  const [fileList, setFileList] = React.useState([]);
  const navigate = useNavigate()
  //提交数据
  const onFinish = (values) => {
    //console.log(values);
    axios.post('/admin/createPassage?content='+values.user.content+'&title='+values.user.title).then(
      res => {
      let id = res.data.substr(44);
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
      alert('创造新文章成功')
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
  //上传图片时默认别红了。
  function handleChangeUpload(lg) {
    let fileList = lg.fileList;
    fileList.filter(file => file.status = 'done');
    //console.log(lg.fileList);
    setFileList(fileList)
  }
  function toArticleSystem() {
    navigate('/control/articleSystem')
  }
  return (
    <Form {...layout} name="nest-messages" onFinish={onFinish} validateMessages={validateMessages}>
      <Form.Item
        name={['user', 'title']}
        label="文章标题"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
      name={['user', 'content']}
      label="文章内容"
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

      <Form.Item
        name="upload"
        label="上传文件"
        valuePropName="fileList"
        getValueFromEvent={normFile}
      >
        <Upload name="logo"  beforeUpload={beforeupload}>
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
  )
}
