import axios from 'axios';
export default (email, password, baseURL) => {
    const request = {
        email,
        password
    };
    if (!baseURL.includes('localhost'))
        request['g-recaptcha-response'] = 'empty'; //TODO: Review the captcha
    return axios
        .post(baseURL + '/login', request, {
        headers: {
            Accept: 'application/json, text/plain, */*',
            Host: baseURL.split('//')[1],
            Origin: baseURL
        }
    })
        .then(res => res.data);
};
//# sourceMappingURL=login.js.map