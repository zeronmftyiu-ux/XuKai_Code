import moment from "./moment";
import api from "../request/index";
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}

const jumpurl = (jumpurl) => {
  jumpurl = encodeURIComponent(jumpurl);

  wx.navigateTo({
      url: '/pages/webview/index?src=' + jumpurl
  });
};

const uploadparams = () => {
  var userInfo = wx.getStorageSync('userInfo')
  return {
      imgkey: 'file',
      token: userInfo.token,
      urid: userInfo.urid,
  }
}

const formatidcard = (value) => {
  let p = /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/

  if (p.test(value)) {
    return {
      birth: value.substring(6, 10) + '-' + value.substring(10, 12) + '-' + value.substring(12, 14),
      gender: value.substr(16, 1) % 2
    }
  } else {
    return {
      birth: '',
      gender: 0
    }
  }
}

const ALERT = (msg, $confirmfn) => {
  wx.showModal({
      title: '提示',
      content: msg,
      showCancel: false,
      success: function(res) {},
  })
}

const formatData = data => {
  if (!data || data.length === 0) return [];

  const sortedMessages = [...data].reverse();
  const formattedData = [];
  let previousDate = null;
  
  sortedMessages.forEach((item,index) => {
    const currentDate = moment(item.create_time * 1000).format('YYYY-MM-DD');
    item.createtime = moment(item.create_time * 1000).format("YYYY-MM-DD HH:mm:ss");

    if (index === 0 || (previousDate !== null && currentDate !== previousDate)) {
      formattedData.push({
        type: 'date',
        content: currentDate,
      });
    }

    // 添加聊天记录
    formattedData.push({ ...item, type: 'message' });

    // 更新前一条消息的日期
    previousDate = currentDate;
  });

  return formattedData
}

const getDaysInMonth = (year, month) => {
  // 创建一个新的日期对象，月份从 0 开始，所以需要减 1
  const date = new Date(year, month - 1, 1);
  const daysInMonth = [];
  
  // 获取该月的总天数
  const totalDays = new Date(year, month, 0).getDate(); // 下个月的第 0 天就是当前月的最后一天

  // 循环生成当月的天数列表，并将天数格式化为两位数
  for (let day = 1; day <= totalDays; day++) {
      // 使用 padStart 方法确保数字是两位数
      daysInMonth.push(day.toString().padStart(2, '0'));
  }

  return daysInMonth;
}

const getYearsList = (startYear) => {
  const currentYear = new Date().getFullYear(); // 获取当前年份
  const yearsList = [];

  // 循环生成从 startYear 到当前年份的年份列表
  for (let year = startYear; year <= currentYear; year++) {
      yearsList.push(year);
  }

  return yearsList;
}

const calculateBMI = (weight, height) => {
  if (weight <= 0 || height <= 0) {
    // throw new Error("体重和身高必须大于 0！");
    return ''
  }
  // console.log(height * height / 10000);
  // 计算 BMI
  const bmi = weight / (height * height / 10000);

  // 判断健康状态
  let status;
  if (bmi < 18.5) {
    status = "体重过轻";
  } else if (bmi >= 18.5 && bmi < 25) {
    status = "正常体重";
  } else if (bmi >= 25 && bmi < 30) {
    status = "超重";
  } else {
    status = "肥胖";
  }

  return  bmi.toFixed(2);
  // 返回结果
  // return {
  //   bmi: bmi.toFixed(2), // BMI 值保留两位小数
  //   status: status,
  // };
}

const calculateAge = birthDate => {
  // 1. 验证输入
  if (!birthDate || typeof birthDate !== 'string') return '';
  
  // 2. 分割日期字符串
  const parts = birthDate.split("-");
  if (parts.length !== 3) return '';
  
  // 3. 转换为数字
  const year = parseInt(parts[0]);
  const month = parseInt(parts[1]) - 1; // 月份调整为0-11
  const day = parseInt(parts[2]);
  
  // 4. 验证日期有效性
  const birthDateObj = new Date(year, month, day);
  if (
    birthDateObj.getFullYear() !== year ||
    birthDateObj.getMonth() !== month ||
    birthDateObj.getDate() !== day
  ) {
    return ''; // 无效日期
  }
  
  // 5. 计算年龄
  const today = new Date();
  let age = today.getFullYear() - year;
  const monthDiff = today.getMonth() - month;
  const dayDiff = today.getDate() - day;
  
  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age--;
  }
  
  return age;
}

const getGenderText = genderCode => {
  // 转换为数字（处理字符串形式的数字）
  const code = Number(genderCode);
  
  switch(code) {
    case 1:
      return '男';
    case 2:
      return '女';
    default:
      return ''; // 或者可以返回 '未知'，根据你的需求
  }
};

// 生成日期列表（示例生成当月日期）
const getDateList = () => {
  let days = [];
  let rows = [];
  
  const today = new Date();

  const startOfPreviousWeek = new Date(today); // 设置为当前日期
  startOfPreviousWeek.setDate(today.getDate() - 7); // 当前日期减去 7 天

  // const currentYear = today.getFullYear();
  // const currentMonth = today.getMonth(); // 0-based month index

  // 获取未来两个月的起始和结束日期
  // const startOfNextTwoMonths = new Date(currentYear, currentMonth, today.getDate());
  // const endOfNextTwoMonths = new Date(currentYear, currentMonth + 2, 0); // 当前月份+2的最后一天

  // 遍历从今天到未来两个月的每一天
  let currentDate = new Date(startOfPreviousWeek);
  while (currentDate <= today) {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1; // 1-based month index
    const day = currentDate.getDate();
    
    const formattedMonth = month.toString().padStart(2, '0');
    const formattedDay = day.toString().padStart(2, '0');

    const dateStr = `${year}-${formattedMonth}-${formattedDay}`;
    const label = `${year}年${month}月${day}日 ${['(周日)', '(周一)', '(周二)', '(周三)', '(周四)', '(周五)', '(周六)'][currentDate.getDay()]}`;
    const dayLabel = `${month}月${day}日 ${['周日', '周一', '周二', '周三', '周四', '周五', '周六'][currentDate.getDay()]}`;

    rows.push({ label: dateStr, value: dateStr });
    days.push(dateStr);

    // 移动到下一天
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return { days: days, rows: rows };
}

// 生成小时列表
const getHourList = () => {
  let days = [];
  let rows = [];
  rows =  Array.from({length:24}, (_,i) => {
    const formattedHour = i.toString().padStart(2, '0'); // 小于 10 补零
    return { label: `${formattedHour}时`, value: i };
  });
  days = Array.from({length:24}, (_,i) => {
    const formattedHour = i.toString().padStart(2, '0');
    return `${formattedHour}时`;
  });
  return {days:days,rows: rows};
}

// 生成分钟列表（间隔5分钟）
const getMinuteList = () => {
  let days = Array.from({length:60}, (_,i) => {
    const min = i.toString().padStart(2, '0');
    return `${min}分`;
  });
  let rows = Array.from({length:60}, (_,i) => {
    const min = i.toString().padStart(2, '0');
    return {label: `${min}分`, value: i};
  })
  return {days:days,rows: rows};
}

var openDoc = (url) => {
  wx.showLoading({ title: '文档加载中...' })
  wx.downloadFile({
    url,
    success: function (res) {
      const filePath = res.tempFilePath
      wx.openDocument({
        filePath,
        complete: function () {
          wx.hideLoading()
        },
        success: function (res) {
          console.log('打开文档成功')
        },
        fail: function (res) {
          if (!/\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(url)) {
            ALERT('当前文件不支持小程序预览,请在电脑端打开查看')
          } else {
            wx.previewImage({
              urls: [filePath],
              fail: function (res) {},
            })
          }
        },
      })
    },
  })
}

module.exports = {
  formatTime,
  jumpurl,
  uploadparams,
  ALERT,
  formatidcard,
  formatData,
  calculateAge,
  getDaysInMonth,
  getYearsList,
  calculateBMI,
  getDateList,
  getHourList,
  getMinuteList,
  getGenderText,
  openDoc
}
