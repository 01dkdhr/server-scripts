const TimeUtil = {
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