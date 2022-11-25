import React, {useEffect} from 'react';
import './Options.css';
import axios from "axios";
const cheerio = require('cheerio')
import {AppUtils} from '../../../utils/app_utils'

const aqours = 'https://zh.moegirl.org.cn/LoveLive!Sunshine!!/%E9%9F%B3%E4%B9%90%E5%88%97%E8%A1%A8'
const niji = 'https://zh.moegirl.org.cn/LoveLive!%E8%99%B9%E5%92%B2%E5%AD%A6%E5%9B%AD%E5%AD%A6%E5%9B%AD%E5%81%B6%E5%83%8F%E5%90%8C%E5%A5%BD%E4%BC%9A/%E9%9F%B3%E4%B9%90%E5%88%97%E8%A1%A8'
const liella = 'https://zh.moegirl.org.cn/LoveLive!Superstar!!/%E9%9F%B3%E4%B9%90%E5%88%97%E8%A1%A8'

const Options = () => {

    useEffect(() => {
        axios.all([
            fetchData(aqours),
            fetchData(niji),
            fetchData(liella),
        ]).then(axios.spread((arr1, arr2, arr3) => {
            const res1 = handleData(arr1)
            const res2 = handleData(arr2)
            const res3 = handleData(arr3)
            const result = [...res1, ...res2, ...res3]
            console.log(result.length)
            result.forEach(item => {
                console.log(item)
            })
        }))
    }, [])

    const fetchData = (url) => {
        return axios({
            method: 'get',
            url: url
        })
    }

    const handleData = (response) => {
        const resp = response.data.replaceAll(`<span style="speak:none;visibility:hidden;color:transparent">0</span>`, "0")
        let $ = cheerio.load(resp)
        const contentArr = []
        $('.wikitable').each(function (i,v) {
            const titleMap = {}
            let isFirstRow = true
            let needContinue = true
            const data = $(v).get(0).children[1].children
            for (let rowIndex = 0; rowIndex < data.length && needContinue; rowIndex++) {
                if (rowIndex % 2 === 0) {
                    let album = new Album()
                    data[rowIndex].children.forEach((item, index) => {
                        if (index % 2 === 1) {
                            const recordIndex = Math.floor(index / 2)
                            item.children.forEach(item => {
                                if (rowIndex === 0) {
                                    if (AppUtils.hasString(item.data, "封面") || AppUtils.hasString(item.data, "名称") || AppUtils.hasString(item.data, "日期")) {
                                        titleMap[recordIndex] = item.data
                                    } else if (AppUtils.hasString(item.data, "演唱会")) {
                                        needContinue = false
                                    }
                                } else {
                                    if (isFirstRow) {
                                        isFirstRow = false
                                    }
                                    if (AppUtils.hasString(item.constructor.toString(), "Text()")) {
                                        if (AppUtils.hasString(item.data, "年") && AppUtils.isEmptyStr(album.timestamp)) {
                                            album.timestamp = new Date(item.data.replace("年", "-").replace("月", "-").replace("日", "")).getTime()
                                        }
                                    } else {
                                        if (AppUtils.hasString(JSON.stringify(item.attribs), "title")) {
                                            let title
                                            if (AppUtils.hasString(item.children[0].constructor.toString(), "Element(")) {
                                                const children = item.children[0].children
                                                title = children[children.length -1].data
                                            } else {
                                                title = item.children[0].data
                                                if (AppUtils.isEmptyStr(title)) {
                                                    title = item.attribs["title"]
                                                }
                                            }
                                            if (AppUtils.isEmptyStr(album.name) && !AppUtils.isEmptyStr(title)) {
                                                album.name = title
                                            }
                                        } else if (AppUtils.hasString(JSON.stringify(item.attribs), "image")) {
                                            if (AppUtils.isEmptyStr(album.image)) {
                                                album.image = item.children[0].attribs["src"]
                                            }
                                        } else {
                                            loopParse(item.children, album)
                                        }
                                    }
                                }
                            })
                        }
                    })
                    if (!AppUtils.isEmptyStr(album.name) && !AppUtils.isEmptyStr(album.timestamp)) {
                        contentArr.push(album)
                    }
                }
            }
        })
        return contentArr
    }

    const loopParse = (arr, album, type) => {
        arr.forEach(o => {
            if (AppUtils.hasString(o.constructor.toString(), "Element(")) {
                const json = JSON.stringify(o.attribs)
                if (AppUtils.hasString(json, "title")) {
                    loopParse(o.children, album, "title")
                } else if (AppUtils.hasString(json, `image`)) {
                    loopParse(o.children, album, "image")
                }
            } else {
                if (!AppUtils.isEmptyStr(type)) {
                    if (type === "title" && AppUtils.isEmptyStr(album.name)) {
                        album.name = o.data
                    } else if (type === "image" && AppUtils.isEmptyStr(album.image)) {
                        album.image = o.data
                    }
                }
            }
        })
    }

    return (
        <div>

        </div>
    );
};

class Album {
    constructor(name, image, timestamp) {
        this.name = name
        this.image = image
        this.timestamp = timestamp
    }
}

export default Options;
