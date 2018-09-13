const TimeUtil = {
    lastTradeDay() {
        // 获取最近的交易日
        const date = new Date();
        let week = date.getDay();

        week == 0 && (week = 7);

        return new Date(date - 1000 * 3600 * 24 * (Math.max(week - 5, 0)));
    },
    formatDate(date, needTime) {
        // 格式化为 2018-09-12 08:12:35
        const year = date.getFullYear();
        let month = date.getMonth() + 1;
        month < 10 && (month = '0' + month);
        let day = date.getDate();
        day < 10 && (day = '0' + day);

        let hours = date.getHours();
        hours < 10 && (hours = '0' + hours);
        let minutes = date.getMinutes();
        minutes < 10 && (minutes = '0' + minutes);
        let seconds = date.getSeconds();
        seconds < 10 && (seconds = '0' + seconds);

        return `${year}-${month}-${day}` + (needTime ? ` ${hours}:${minutes}:${seconds}` : '');
    },
    getTimeAndString(date) {
        date.setHours(0);
        date.setSeconds(0);
        date.setMinutes(0);
        date.setMilliseconds(0);

        return { dateTime: date.valueOf(), dateString: this.formatDate(date, false) };
    }
};

module.exports = TimeUtil;