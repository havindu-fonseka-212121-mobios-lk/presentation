import { apiPostWithOptions } from '../utils/api-manager';

class PrizeWinnersService {
    static groupByCourse(payload, options = {}) {
        return apiPostWithOptions({
            path: 'prize-winners/group-by-course',
            requestBody: payload,
            ...options // This will include signal and other axios options
        });
    }

}

export default PrizeWinnersService;
