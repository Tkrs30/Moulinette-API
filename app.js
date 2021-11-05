const axios = require('axios');
const XLSX = require("xlsx");

var token
var dataf

axios
    .post('http://127.0.0.1:8000/api/login', {
        email: 'hugo.frango@epitech.eu',
        password: '123456789'
    })
    .then((data) => {
        token = data.data.token
        console.log('token = :', token)
        axios
            .get('http://127.0.0.1:8000/api/do/get', {
                headers: {
                    Authorization: 'Bearer ' + token
                }
            })
            .then((data) => {
                dataf = data.data
                var workbook = XLSX.utils.book_new();
                const ws = XLSX.utils.json_to_sheet(dataf)
                XLSX.utils.book_append_sheet(workbook, ws, 'list');
                XLSX.writeFile(workbook, 'toto.xlsx');
                axios
                    .post('http://127.0.0.1:8000/api/logout', null, {
                        headers: {
                            Authorization: 'Bearer ' + token
                        }
                    })
            })
    })

console.log('fini')