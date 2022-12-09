import React, {useEffect, useRef, useState} from 'react';
import {Button, DatePicker, Form, Input, Select, Tabs} from 'antd';
import {MinusCircleOutlined, PlusOutlined} from '@ant-design/icons';
import locale from 'antd/lib/calendar/locale/zh_CN.js'
import {Music} from '../../../models/Music'
import RenderTabItem from './RenderItem'

const ImportHelper = () => {
    const [activeKey, setActiveKey] = useState()
    const [coverList, setCoverList] = useState([])
    const [tabs, setTabs] = useState([])
    const [photoList, setPhotoList] = useState([{"value": "Cover_1.jpg"}])

    const newTabIndex = useRef(0);
    const [form] = Form.useForm()

    const onEdit = (targetKey, action) => {
        if (action === 'add') {
            addTab();
        } else {
            removeTab(targetKey);
            const _musicList = form.getFieldValue('musicList')
            delete _musicList[targetKey]
            form.setFieldValue('musicList', Object.keys(_musicList).length ? _musicList : null)
        }
    };

    const addTab = () => {
        const newActiveKey = `Music${newTabIndex.current++}`;
        renderTab((newTab) => {
            newTab.push({
                label: 'Music' + tabs.length,
                music: new Music(),
                key: newActiveKey,
                children: <RenderTabItem newActiveKey={newActiveKey} coverList={coverList}/>
            })
        })
        setActiveKey(newActiveKey);
    };

    const removeTab = (targetKey) => {
        const targetIndex = tabs.findIndex((pane) => pane.key === targetKey);
        const newPanes = tabs.filter((pane) => pane.key !== targetKey);
        const tempList = []
        newPanes.forEach((value, index) => {
            value.label = "Music" + index
            tempList.push(value)
        })
        if (tempList.length && targetKey === activeKey) {
            const {key} = tempList[targetIndex === tempList.length ? targetIndex - 1 : targetIndex];
            setActiveKey(key);
        }
        setTabs(tempList);
    };

    const renderTab = (addFunc) => {
        const newTab = []
        tabs.forEach((value, index) => {
            newTab.push({
                label: "Music" + index,
                music: value.music,
                key: value.key,
                children: <RenderTabItem newActiveKey={value.key} coverList={coverList}/>
            })
        })
        addFunc && addFunc(newTab)
        setTabs(newTab)
    }

    const onFinish = (value) => {
        if (!form.getFieldValue('musicList')) {
            alert('填歌曲')
        }
        console.log(value)
    }

    useEffect(() => {
        const arr = []
        photoList.map(item => {
            arr.push({
                value: item.value,
                label: item.value
            })
        })
        setCoverList(arr)
    }, [photoList])

    useEffect(() => {
        renderTab()
    }, [coverList])

    return (
        <div style={{width: '500px'}}>
            <Form
                form={form}
                layout="horizontal"
                style={{width: '100%'}}
                onFinish={onFinish}
            >
                <Form.Item label={"专辑id"} name={"id"}
                           getValueFromEvent={(e) => {
                               const {value} = e.target;
                               return value.replace(/\D/g, "")
                           }}
                           rules={[
                               {
                                   required: true,
                                   message: '请输入专辑id',
                               },
                           ]}>
                    <Input maxLength={3}/>
                </Form.Item>
                <Form.Item label={"专辑名"} name={"albumName"} rules={[
                    {
                        required: true,
                        message: '请输入专辑名',
                    },
                ]}>
                    <Input/>
                </Form.Item>
                <Form.Item label={"发售日期"} name={"date"} rules={[
                    {
                        required: true,
                        message: '请选择发售日期',
                    },
                ]}>
                    <DatePicker locale={locale}/>
                </Form.Item>
                <Form.List name={"cover_path"} initialValue={photoList}>
                    {(fields, {add, remove}, {errors}) => (
                        <>
                            {fields.map((field, index) => {
                                return (
                                    <Form.Item
                                        style={{position: "relative"}}
                                        labelCol={{span: 24}}
                                        label={index === 0 ? '专辑图' : ''}
                                        required={true}
                                        key={field.key}
                                    >
                                        {
                                            index === 0 ?
                                                <Form.Item style={{position: "absolute", top: -40, left: 80}}>
                                                    <Button
                                                        type="dashed"
                                                        onClick={() => {
                                                            let length = form.getFieldValue("cover_path").length + 1
                                                            add({value: `Cover_${length}.jpg`})
                                                            setPhotoList(form.getFieldValue("cover_path"))
                                                        }}
                                                        style={{width: '50px'}}
                                                        icon={<PlusOutlined/>}
                                                    />
                                                </Form.Item> : null
                                        }
                                        <Form.Item
                                            {...field}
                                            validateTrigger={['onChange', 'onBlur']}
                                            name={[field.name, "value"]}
                                            rules={[
                                                {
                                                    required: true,
                                                    whitespace: true,
                                                    message: "请输入或删除该条目",
                                                },
                                            ]}
                                            noStyle
                                        >
                                            <Input
                                                placeholder="请输入专辑图文件名"
                                                style={{width: '90%'}}
                                            />
                                        </Form.Item>
                                        {fields.length > 1 ? (
                                            <MinusCircleOutlined
                                                style={{marginLeft: '5%'}}
                                                className="dynamic-delete-button"
                                                onClick={() => {
                                                    remove(field.name)
                                                    const tempList = form.getFieldValue("cover_path")
                                                    setPhotoList(tempList)
                                                }}
                                            />
                                        ) : null}
                                        <Form.ErrorList errors={errors}/>
                                    </Form.Item>
                                )
                            })}
                        </>
                    )}
                </Form.List>
                <Form.Item label="分类" name={"category"} rules={[
                    {
                        required: true,
                        message: '请选择分类',
                    },
                ]}>
                    <Select>
                        <Select.Option value="单曲">单曲</Select.Option>
                        <Select.Option value="动画">动画</Select.Option>
                        <Select.Option value="独唱">独唱</Select.Option>
                        <Select.Option value="精选集">精选集</Select.Option>
                        <Select.Option value="其他">其他</Select.Option>
                        <Select.Option value="小组曲">小组曲</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item label={"歌曲列表"} labelCol={{span: 24}} validateFirst={true} rules={[
                    {
                        required: true,
                        message: '请添加歌曲',
                    },
                ]}>
                    <Tabs
                        onChange={setActiveKey}
                        activeKey={activeKey}
                        type="editable-card"
                        onEdit={onEdit}
                        items={tabs}/>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        生成
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}

export default ImportHelper;