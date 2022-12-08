import React, {useRef, useState} from 'react';
import {Button, DatePicker, Form, Input, Select, Switch, Tabs, TimePicker} from 'antd';
import {MinusCircleOutlined, PlusOutlined} from '@ant-design/icons';
import locale from 'antd/lib/calendar/locale/zh_CN.js'
import {Music} from '../../../models/Music'

const ImportHelper = () => {
    const [albumId, setAlbumId] = useState('')
    const [albumName, setAlbumName] = useState('')
    const [activeKey, setActiveKey] = useState();

    const [form] = Form.useForm()
    const newTabIndex = useRef(0);

    const renderTabItem = (key) => (
        <Form.Item name={['musicList', key]} key={key.label}>
            <>
                <Form.Item label={'歌曲id'} name={['musicList', key, 'musicId']} rules={[
                    {
                        required: true,
                        message: '请输入歌曲id',
                    },
                ]}>
                    <Input/>
                </Form.Item>

                <Form.Item label={'歌曲名'} name={['musicList', key, 'musicName']} rules={[
                    {
                        required: true,
                        message: '请输入歌曲名',
                    },
                ]}>
                    <Input/>
                </Form.Item>

                {/*<Form.Item label={'专辑id'} name={['musicList', key, 'album']} initialValue={albumId.target?.value} rules={[*/}
                {/*    {*/}
                {/*        required: true,*/}
                {/*        message: '请输入专辑id',*/}
                {/*    },*/}
                {/*]}>*/}
                {/*    <Input disabled={true}/>*/}
                {/*</Form.Item>*/}

                {/*<Form.Item label={'专辑名'} name={['musicList', key, 'albumName']} initialValue={albumName.target?.value} rules={[*/}
                {/*    {*/}
                {/*        required: true,*/}
                {/*        message: '请输入专辑名',*/}
                {/*    },*/}
                {/*]}>*/}
                {/*    <Input disabled={true}/>*/}
                {/*</Form.Item>*/}

                {renderPhotoList(key)}

                <Form.Item label={'歌曲路径'} name={['musicList', key, 'music_path']} rules={[
                    {
                        required: true,
                        message: '请输入歌曲路径',
                    },
                ]}>
                    <Input/>
                </Form.Item>

                <Form.Item label={'歌手'} name={['musicList', key, 'artist']} rules={[
                    {
                        required: true,
                        message: '请选择歌手',
                    },
                ]}>
                    <Input/>
                </Form.Item>

                {/*<Form.Item label={'歌手36进制'} name={['musicList', key, 'artist_bin']}>*/}
                {/*    <Input disabled/>*/}
                {/*</Form.Item>*/}

                <Form.Item label={'时长'} name={['musicList', key, 'time']} rules={[
                    {
                        required: true,
                        message: '请输入歌曲id',
                    },
                ]}>
                    <TimePicker format={'mm:ss'} locale={locale} showNow={false}/>
                </Form.Item>

                <Form.Item label={'可导出'} name={['musicList', key, 'export']} valuePropName="checked" initialValue rules={[
                    {
                        required: true,
                        message: '请输入歌曲id',
                    },
                ]}>
                    <Switch checkedChildren="是" unCheckedChildren="否"/>
                </Form.Item>
            </>
        </Form.Item>
    )

    const [tabs, setTabs] = useState([])
    const [photoList, setPhotoList] = useState([{"value": "Cover_1.jpg"}])

    const onChange = (key) => {
        setActiveKey(key);
    };
    const add = () => {
        const newActiveKey = `Music${newTabIndex.current++}`;
        const tempList = []
        tabs.forEach((value, index) => {
            value.key = "Music" + index
            value.label = "Music" + index
            tempList.push(value)
        })
        setTabs([
            ...tempList,
            {
                label: 'Music' + tempList.length,
                music: new Music(),
                key: newActiveKey,
                children: renderTabItem(newActiveKey)
            },
        ]);
        setActiveKey(newActiveKey);
    };
    const remove = (targetKey) => {
        const targetIndex = tabs.findIndex((pane) => pane.key === targetKey);
        const newPanes = tabs.filter((pane) => pane.key !== targetKey);
        const tempList = []
        newPanes.forEach((value, index) => {
            value.key = "Music" + index
            value.label = "Music" + index
            tempList.push(value)
        })
        if (tempList.length && targetKey === activeKey) {
            const {key} = tempList[targetIndex === tempList.length ? targetIndex - 1 : targetIndex];
            setActiveKey(key);
        }
        setTabs(tempList);
    };
    const onEdit = (targetKey, action) => {
        if (action === 'add') {
            add();
        } else {
            remove(targetKey);
        }
    };

    const onFinish = (value) => {
        console.log(value)
    }

    const renderPhotoList = (key) => {
        const arr = []
        photoList.map(item => {
            arr.push({
                value: item.value,
                label: item.value
            })
        })
        return (
            <Form.Item label={'封面图'} name={['musicList', key, 'cover_path']} initialValue={arr[0].label} required={true}>
                <Select options={arr}/>
            </Form.Item>
        )
    }

    return (
        <div style={{width: '500px'}}>
            <Form
                form={form}
                layout="horizontal"
                style={{width: '100%'}}
                onFinish={onFinish}
            >
                <Form.Item label={"专辑id"} name={"id"} rules={[
                    {
                        required: true,
                        message: '请输入专辑id',
                    },
                ]}>
                    <Input onChange={value => setAlbumId(value)}/>
                </Form.Item>
                <Form.Item label={"专辑名"} name={"albumName"} rules={[
                    {
                        required: true,
                        message: '请输入专辑名',
                    },
                ]}>
                    <Input onChange={value => setAlbumName(value)}/>
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
                                                    const tempList = form.getFieldValue("专辑图")
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
                        onChange={onChange}
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