const fs = require('fs')
const path = require('path')
const database = path.join(__dirname, '../../../../database')
class _json {
    action(dbName, _method, query, data, callback) {
        const method = _method.split('/')[0]
        const methodOpt = _method.split('/')[1]

        switch (method) {
            case 'read':
                const requestDb = `${dbName}.json`

                if (fs.readdirSync(database).indexOf(requestDb) != -1) {
                    const content = fs.readFileSync(`${database}/${requestDb}`, 'utf-8')
                    return callback(null, JSON.parse(content))
                } else {
                    callback(`[JSON handler] there is no such database : ${dbName}`)
                }
                break

            case 'create':
                if (methodOpt == 'entity') {
                    console.log('entity')
                    if (typeof data == 'object') {
                        if (fs.readdirSync(database).indexOf(`${dbName}.json`) != -1) {
                            const _data = JSON.parse(fs.readFileSync(`${database}/${dbName}.json`, 'utf-8'))
                            const keyCurDb = new Set(Object.keys(_data))
                            const keyToBeAdded = Object.keys(data)
                            const keysAlreadyExist = []
                            let nData = _data
                            keyToBeAdded.map(e => {
                                if (keyCurDb.has(e)) {
                                    keysAlreadyExist.push(e)
                                } else {
                                    nData[e] = data[e]
                                }
                            })

                            if (keysAlreadyExist.length != 0) {
                                callback(`[JSON handler] ${keysAlreadyExist} key already exist in ${dbName} database`)
                            } else {
                                fs.writeFile(`${database}/${dbName}.json`, JSON.stringify(nData, null, '\t'), (err, res) => {
                                    if (err) {
                                        callback(true, null)
                                    } else {
                                        callback(false, {
                                            status: true,
                                            message: `successfully added props to ${dbName} database`
                                        })
                                    }
                                })
                            }
                        } else {
                            callback(`[JSON handler] there is no such database : ${dbName}`)
                        }
                    } else {
                        callback('[JSON handler]  data should be an object')
                    }
                }
                else if (methodOpt == 'database') {
                    if (fs.readdirSync(database).indexOf(`${dbName}.json`) != -1) {
                        callback(`${dbName} database already exist`)
                    } else {
                        if (!dbName) {
                            return callback('database name cannot be undefined')
                        } else {
                            let _data = undefined
                            if (data == null || data == undefined || data == "" || data == " ") {
                                _data = {}
                            }

                            fs.writeFile(`${database}/${dbName}.json`, JSON.stringify(_data, null, '\t'), (err, res) => {
                                if (err) {
                                    callback(true, null)
                                } else {
                                    callback(false, {
                                        status: true,
                                        message: `successfully created ${dbName} database`
                                    })
                                }
                            })
                        }
                    }
                }
                break

            case 'update':
                if (methodOpt == 'entity') {
                    const access = JSON.parse(fs.readFileSync(`${database}/${dbName}.json`, 'utf-8'))
                    if (fs.readdirSync(database).indexOf(`${dbName}.json`) != -1) {
                        if (data.location) {
                            const location = data.location.split('/')
                            let propBeingAccess = undefined
                            location.map((e, i) => {
                                if (propBeingAccess == undefined) {
                                    propBeingAccess = access[e]
                                } else {
                                    propBeingAccess = propBeingAccess[e]

                                    if (location.length - 1 == i) {
                                        if (data.action == 'update value') {
                                            const old = access[location[location.length - 2]]
                                            old[e][data.key] = data.value
                                            fs.writeFile(`${database}/${dbName}.json`, JSON.stringify(access, null, '\t'), (err, res) => {
                                                if (err) {
                                                    callback(true, null)
                                                } else {
                                                    callback(false, {
                                                        status: true,
                                                        message: `successfully updated ${data.key} value property in ${dbName} database`
                                                    })
                                                }
                                            })
                                        } else if (data.action == 'update key') {
                                            console.log(propBeingAccess)
                                        }
                                    }
                                }
                            })
                        } else {
                            access[data.key] = data.value
                            fs.writeFile(`${database}/${dbName}.json`, JSON.stringify(access, null, '\t'), (err, res) => {
                                if (err) {
                                    callback(true, null)
                                } else {
                                    callback(false, {
                                        status: true,
                                        message: `successfully updated ${data.key} value property in ${dbName} database`
                                    })
                                }
                            })
                        }
                    }
                }
                break

            case 'delete':
                if (methodOpt == 'entity') {
                    // build a query system
                }
                else if (methodOpt == 'database') {
                    if (fs.existsSync(`${p}/${dbName}.json`)) {
                        fs.unlink(`${p}/${dbName}.json`, (err) => {
                            if (err) {
                                callback(true, null)
                            } else {
                                callback(false, {
                                    status: true,
                                    message: `successfully removed ${dbName} database`
                                })
                            }
                        })
                    } else {
                        callback(`[JSON handler] there is no such database : ${dbName}`)
                    }
                }
                break
        }
    }
}

module.exports = _json