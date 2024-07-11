const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');
const dotenv = require('dotenv')
const cors = require('cors')
const app = require('express')()
app.listen(8080, () => {
    console.log('Port listening')
})
app.use(cors())
dotenv.config();

let ranks = {}

async function loadRanks () {
    console.log('Start to load ranks')
    let _tempRank = {
        loadedAt: new Date().toISOString()
    }
    const _serviceAccountAuth = new JWT({
        email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        key: process.env.GOOGLE_PRIVATE_KEY,
        scopes: [ 'https://www.googleapis.com/auth/spreadsheets' ]
    })

    const _document = new GoogleSpreadsheet('1f59edvWixPHaC4ZSk3NSr1U9iOyLIFqthM1ZxOgG9z0', _serviceAccountAuth)

    await _document.loadInfo()

    const _sheets = {}
    for(let _team = 1; _team <= 20; _team ++) {
        _sheets[_team] = _document.sheetsByTitle[`${ _team }조`]
        await _sheets[_team].loadCells('A2:Z50')
    }
    console.log('Success to load sheets')
    const _persons = [  ]
    for(let _team = 1; _team <= 20; _team ++) {
        for(let _row = 2; _row <= 45; _row ++) {
            _persons.push({
                totalNumber: _sheets[_team].getCellByA1(`A${ _row }`).value,
                teamNumber: _sheets[_team].getCellByA1(`B${ _row }`).value,
                grade: _sheets[_team].getCellByA1(`C${ _row }`).value,
                team: _team,
                schoolName: _sheets[_team].getCellByA1(`D${ _row }`).value,
                name: _sheets[_team].getCellByA1(`E${ _row }`).value,
                gender: _sheets[_team].getCellByA1(`F${ _row }`).value,
                run: _sheets[_team].getCellByA1(`H${ _row }`).value,
                jump: _sheets[_team].getCellByA1(`K${ _row }`).value,
                longJump: _sheets[_team].getCellByA1(`N${ _row }`).value,
                sitUp: _sheets[_team].getCellByA1(`P${ _row }`).value,
                flex: _sheets[_team].getCellByA1(`S${ _row }`).value,
                belly: _sheets[_team].getCellByA1(`V${ _row }`).value,
                total: _sheets[_team].getCellByA1(`W${ _row }`).value,
            })
        }
    }
    console.log('Success to load person data')
    console.log('Start to sort data')
    _tempRank.male = {
        total: _persons.filter(_person => _person.gender == '남').sort((a, b) => {
            return a.total - b.total
        }).reverse(),
        run: _persons.filter(_person => _person.gender == '남').sort((a, b) => {
            return a.run - b.run
        }).reverse(),
        jump: _persons.filter(_person => _person.gender == '남').sort((a, b) => {
            return a.jump - b.jump
        }).reverse(),
        longJump: _persons.filter(_person => _person.gender == '남').sort((a, b) => {
            return a.longJump - b.longJump
        }).reverse(),
        sitUp: _persons.filter(_person => _person.gender == '남').sort((a, b) => {
            return a.sitUp - b.sitUp
        }).reverse(),
        flex: _persons.filter(_person => _person.gender == '남').sort((a, b) => {
            return a.flex - b.flex
        }).reverse(),
        belly: _persons.filter(_person => _person.gender == '남').sort((a, b) => {
            return a.belly - b.belly
        }).reverse()
    }

    _tempRank.female = {
        total: _persons.filter(_person => _person.gender == '여').sort((a, b) => {
            return a.total - b.total
        }).reverse(),
        run: _persons.filter(_person => _person.gender == '여').sort((a, b) => {
            return a.run - b.run
        }).reverse(),
        jump: _persons.filter(_person => _person.gender == '여').sort((a, b) => {
            return a.jump - b.jump
        }).reverse(),
        longJump: _persons.filter(_person => _person.gender == '여').sort((a, b) => {
            return a.longJump - b.longJump
        }).reverse(),
        sitUp: _persons.filter(_person => _person.gender == '여').sort((a, b) => {
            return a.sitUp - b.sitUp
        }).reverse(),
        flex: _persons.filter(_person => _person.gender == '여').sort((a, b) => {
            return a.flex - b.flex
        }).reverse(),
        belly: _persons.filter(_person => _person.gender == '여').sort((a, b) => {
            return a.belly - b.belly
        }).reverse()
    }
    console.log('Complete all process')
    ranks = _tempRank
    console.log(JSON.stringify(ranks))
}

app.get('/total', (_req, _res) => {
    _res.json({
        data: ranks
    })
})

loadRanks()
setInterval(loadRanks, 60000)
