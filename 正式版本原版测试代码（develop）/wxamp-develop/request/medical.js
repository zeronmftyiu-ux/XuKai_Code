import {request} from "./request";
import moment from '../utils/moment';
export default {
    reportUpload(data) {
        return request('medical/report-upload', data)
    },
    myReports(data) {
        return request('medical/my-reports', data).then(res => {
            if (res.code * 1 === 200) {
                res.data.list.forEach(item=>{
                    item.type=2
                    item.created_time = moment(item.created_at * 1000).format(
                        'YYYY年MM月DD日 HH:mm'
                    );
                    if(item.files.length>0) {
                        if(item.files[0].file_type.indexOf('pdf') === -1 && item.files[0].file_type.indexOf('PDF') === -1) {
                            item.type=1
                        }
                        item.report_id = item.files[0].report_id
                    }
                })
            }
            return res;
        });
    },
    reportAnalyze(data) {
        return request('medical/report-analyze', data)
    },
    reportOrigin(data) {
        return request('medical/report-origin', data)
    },
}