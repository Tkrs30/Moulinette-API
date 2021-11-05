const axios = require('axios');
const XLSX = require("xlsx");
const fs = require('fs');
const baseurl = "http://127.0.0.1:8000";

const main = async () => {
    if (process.argv.length != 3) {
        return;
    }
    const id = process.argv[2];
    const fileUserContent = fs.readFileSync('users.json', 'utf-8')
    const dataUser = JSON.parse(fileUserContent);
    error(dataUser, id);
    console.log('debut');
    var result = "";
    const APItest = async () => {
        try {
            result = await axios
                .post(baseurl + '/api/login', {
                    email: dataUser[id - 1].email,
                    password: dataUser[id - 1].password,
                })
        } catch (error) {
            return;
        }

        const data = await axios
            .get(baseurl + '/api/do/get', {
                headers: {
                    Authorization: 'Bearer ' + result.data.token
                }
            })
        var workbook = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(data.data)
        XLSX.utils.book_append_sheet(workbook, ws, 'list');
        XLSX.writeFile(workbook, dataUser[id - 1].filename);
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

const error = async (data, id) => {
    for (let i = 0; i < data.length; i++) {
        if (data[i].id == id) {
            return;
        }
    }
    console.log('error: Id introuvable');
    process.exit(0);
}

main()
