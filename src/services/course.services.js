import { apiPost, apiGet } from '../utils/api-manager';

class CourseService{

    static userId = null;

    static setUserId(id) {
        this.userId = id;
    }

    static examTypeGetByID(id){
        return apiGet({
            path: `examination-type/list-by-examination-mode/${id}`
        });
    }

    static gradeGetByID(id){
        return apiGet({
            path: `grade/list-by-examination-mode/${id}`
        });
    }

    static getGrades(){
        return apiGet({
            path: `grade/list?page=1&count=100`
        })
    }

    static getCourseByCategoryAndSubject(modeId, typeId) {
        console.log("typeId inside service: ", typeId);
        return apiGet({
            path: `grade/list-by-examination-mode?examinationModeId=${modeId}&examinationTypeId=${typeId}`
        })
    }

    static getCourseByMode(modeId, typeId, gradeId){
        return apiGet({
            path: `course/recent?mode=${modeId}&type=${typeId}&grade=${gradeId}`
        });
    }

    static getCourseByCourseId(courseId){
        return apiGet({
            path: `course/get?id=${courseId}`
        });
    }

    static postReceipt(receipt){
        return apiPost({
            path: `receipt/save`,
            requestBody: { ...receipt,createdBy : this.userId }
        });
    }

    static saveCourse(payload) {
        return apiPost({
            path: 'course/save',
            requestBody: { ...payload,createdBy : this.userId },
        });
    }
}

export default CourseService;