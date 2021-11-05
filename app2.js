const axios = require('axios');
const XLSX = require("xlsx");
const fs = require('fs')

const main = async () => {
    if (process.argv.length < 3 || process.argv.length > 3) {
        return;
    }
    const filename = process.argv[2];
    let file = fs.readFileSync(filename)
    const datauser = JSON.parse(file);
    console.log(datauser.email)
    error(datauser);
    console.log('debut');
    var result = "";
    const APItest = async () => {
        result = await axios
            .post(datauser.baseurl + '/api/login', {
                email: datauser.email,
                password: datauser.password,
            })
            .catch(() => {
                console.log('error: your password or your email is incorrect');
                return ;
            })
        const data = await axios
            .get('http://127.0.0.1:8000/api/do/get', {
                headers: {
                    Authorization: 'Bearer ' + result.data.token
                }
            })
        var workbook = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(data.data)
        XLSX.utils.book_append_sheet(workbook, ws, 'list');
        XLSX.writeFile(workbook, datauser.filename);
        await axios
            .post('http://127.0.0.1:8000/api/logout', null, {
                headers: {
                    Authorization: 'Bearer ' + result.data.token
                }
            })
        console.log('result :', result.data.token)
    }
    await APItest()
    console.log('fin')
}

const error = async (data) => {
    if (data.lenght > 4 || data.lenght < 4) {
        console.log('error: missing or there is an extra parameter');
        return ;
    }
    if (!data.email || !data.password || !data.baseurl || !data.filename) {
        console.log('error: one of these parameter is missing : email, password, baseurl, filename')
        return ;
    }
}

main()
