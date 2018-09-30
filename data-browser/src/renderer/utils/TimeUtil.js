const TimeUtil = {
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
    transDateToString(date) {
        if (!date) {
            return '';
        }

        const tmpDate = new Date(date);
        let month = tmpDate.getMonth() + 1;
        month = (month.toString().length == 1) ? ("0" + month) : month;
        let day = tmpDate.getDate();
        day = (day.toString().length == 1) ? ("0" + day) : day;

        return `${tmpDate.getFullYear()}-${month}-${day}`;
    },
    transStringToDate(str) {
        if (!str) {
            return 0;
        }
        return new Date(str + ' 00:00:00').getTime();
    }
};

export default TimeUtil;