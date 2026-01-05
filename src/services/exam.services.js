import { apiPost, apiGet } from '../utils/api-manager';

class ExamService {
  static list() {
    return apiGet({
      path: 'exam-center/list?page=1&count=500',
    });
  }

  static courses() {
    return apiGet({
      path: 'course/list?page=1&count=250',
    });
  }

  static coursesV2() {
    return apiGet({
      path: 'course/listV2?page=1&count=250',
    });
  }

  static examinationMode() {
    return apiGet({
      path: 'examination-mode/list?page=1&count=10',
    });
  }

  static examinationType() {
    return apiGet({
      path: 'examination-type/list?page=1&count=100',
    });
  }

  static levels() {
    return apiGet({
      path: 'grade/list?page=1&count=100',
    });
  }

  static report(payload) {
    return apiPost({
      path: 'student-examination-reg/report',
      requestBody : payload
    });
  }

}

export default ExamService;
