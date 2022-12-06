import React, {useState} from 'react';
import {Button, DatePicker, Form, Input, Select, Tabs,} from 'antd';
import {MinusCircleOutlined, PlusOutlined} from '@ant-design/icons';
import locale from 'antd/lib/calendar/locale/zh_CN.js'
import {Music} from '../../../models/Music'

const ImportHelper = () => {
    const renderTabItem = () => {
        return (
            <>
                <Form.Item label="歌曲id" required={true}>
                    <Input/>
                </Form.Item>
            </>
        )
    }

    const [tabs, setTabs] = useState([
        {
            label: 'Music0',
            music: new Music(),
            key: 'Music0',
            children: renderTabItem()
        }
    ])
    const [activeKey, setActiveKey] = useState(tabs[0].key);

    let formListInitValues = [{
        "key": 0,
        "name": 0,
        "isListField": true,
        "fieldKey": 0,
        "value": "Cover_1.jpg"
    }]

    const onChange = (key) => {
        setActiveKey(key);
    };
    const add = () => {
        const newActiveKey = `Music${tabs.length}`;
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
                children: renderTabItem()
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
            const { key } = tempList[targetIndex === tempList.length ? targetIndex - 1 : targetIndex];
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

    return (
        <div style={{width: '500px'}}>
            <Form
                layout="horizontal"
                style={{width: '100%'}}
            >
                <Form.Item label="专辑id" required={true}>
                    <Input/>
                </Form.Item>
                <Form.Item label="专辑名" required={true}>
                    <Input/>
                </Form.Item>
                <Form.Item label="发售日期" required={true}>
                    <DatePicker locale={locale}/>
                </Form.Item>
                <Form.List name={"专辑图"} initialValue={formListInitValues}>
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
                                                        onClick={() => add()}
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
                                                onClick={() => remove(field.name)}
                                            />
                                        ) : null}
                                        <Form.ErrorList errors={errors}/>
                                    </Form.Item>
                                )
                            })}
                        </>
                    )}
                </Form.List>
                <Form.Item label="分类" required={true}>
                  <Select>
                    <Select.Option value="single">单曲</Select.Option>
                    <Select.Option value="anime">动画</Select.Option>
                    <Select.Option value="solo">独唱</Select.Option>
                    <Select.Option value="box">精选集</Select.Option>
                    <Select.Option value="other">其他</Select.Option>
                    <Select.Option value="team">小组曲</Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item label="歌曲列表" required={true} style={{position: 'relative'}} labelCol={{span: 24}}>
                    <Form.Item style={{position: "absolute", top: -40, left: 80}}>
                        <Button
                            type="dashed"
                            onClick={add}
                            style={{width: '50px'}}
                            icon={<PlusOutlined/>}
                        />
                    </Form.Item>
                    <Tabs
                        hideAdd
                        onChange={onChange}
                        activeKey={activeKey}
                        type="editable-card"
                        onEdit={onEdit}
                        items={tabs}
                    />
                </Form.Item>
            </Form>
        </div>
    )
}

export default ImportHelper;