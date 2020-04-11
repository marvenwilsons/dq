export default function (app,method) {
    const i = {}
    
    // system
    i['private.insertCompiledTask'] = function ({compiledTask,payload}) {
        // compiled task returns an array of task items
        const prm = payload ? payload : app.$store.state.queueCurrentTaskAnswer
        const ct = compiledTask(prm)
        const pa = () => {
            app.$store.state.queueAnswersArray.push({
                answer: '--not answered--'
            })
        }
        if(Array.isArray(ct)) {
            // push or insert tasks to queue
            if(app.$store.state.queue.length - 1 === app.$store.state.queuePointer) {
                // get function and push to queue
                ct.map(e => {
                    app.$store.state.queue.push({
                        fn: i[`private.${e.taskName}`],
                        param: e.taskParam
                    })
                    pa()
                })
                app.$store.commit('stateController', {
                    key: 'queuePointer',
                    value: app.$store.state.queuePointer + 1
                })
            } else {
                // insert
                const f = ct.map(e => {
                    pa()
                    return {
                        fn: i[`private.${e.taskName}`],
                        param: e.taskParam
                    }                        
                })
                app.$store.state.queue.splice(app.$store.state.queuePointer ,0,f)
                app.$store.state.queue = app.$store.state.queue.flat()
                app.$store.commit('executeQueue')
            }
        } else {
            alert('Err: Invalid compiled task in insertCompiledTask item')
            location.reload()
        }
    }
    i['private.done'] = function () {
        // console.log('> all task done')
        app.$store.commit('stateController', {
            key: 'queueState',
            value: 'end'
        })
        app.$store.commit('stateController', {
            key: 'queueCurrentTaskAnswer',
            value: null
        })
        app.$store.commit('stateController', {
            key: 'queuePointer',
            value: null
        })
        app.$store.commit('stateController', {
            key: 'queueAnswersArray',
            value: null
        })
        app.$store.commit('stateController', {
            key: 'queue',
            value: []
        })
        app.$store.commit('stateController', {
            key: 'queueStatic',
            value: null
        })
    }
    i['private.resetTask'] = function ({resetBackTo,injectOrModifyProp}) {
        if(resetBackTo > app.$store.state.queuePointer) {
            alert(`Err: in resetTask task item object, illegal reset value in "resetBackTo" property, value:${resetBackTo}`)
            location.reload()
        } else {
            app.$store.commit('stateController',{
                key: 'queuePointer',
                value: resetBackTo
            })
        }
        
        Object.assign(app.$store.state.queue[app.$store.state.queuePointer].param, injectOrModifyProp)
    }
    // modal
    i['private.sysmodal.spwan'] = function ({modalType, modalPayload}) {
        if(app.$store.state.queue.length == 0) {
            alert('ERR: Invalid spawnGlobalModal() function invocation, procedures should not directly called on components')
        } else {
            app.$store.commit('stateController', {
                key: 'globalModalState',
                value: true
            })
            app.$store.commit('stateController', {
                key: 'globalModalContentType',
                value: modalType
            })
            app.$store.commit('stateController', {
                key: 'globalModalContent',
                value: modalPayload
            })
            
        } 
    }
    i['private.sysmodal.ask'] = function ({question, truthy, falsey}) {
        i['private.sysmodal.spawn']({
            modalType: 'boolean',
            modalPayload: {
                truthy,
                falsey,
                question
            }
        })
    }
    i['private.sysmodal.prompt'] = function ({type,defaultValue, placeholder, label, err}) {
        i['private.sysmodal.spawn']({
            modalType: 'prompt',
            modalPayload: {
                type,
                defaultValue,
                placeholder,
                label,
                err
            }
        })
    }
    i['private.sysmodal.select'] = function ({options,defaultValue, label, err}) {
        i['private.sysmodal.spawn']({
            modalType: 'select',
            modalPayload: {
                options,
                defaultValue,
                label,
                err
            }
        })
    }
    i['private.sysmodal.loginfo'] = function ({msg}) {
        i['private.sysmodal.spawn']({
            modalType: 'loginfo',
            modalPayload: {
                msg
            }
        })
    }
    i['private.sysmodal.logerr'] = function ({msg}) {
        i['private.sysmodal.spawn']({
            modalType: 'logerr',
            modalPayload: {
                msg
            }
        })
    }
    i['private.sysmodal.close'] = function () {
        // console.log('> Closing Modal')
        app.$store.commit('stateController', {
            key: 'globalModalState',
            value: false
        })
        app.$store.commit('stateController', {
            key: 'globalModalContentType',
            value: undefined
        })
        app.$store.commit('stateController', {
            key: 'globalModalContent',
            value: undefined
        })
        setTimeout(() => {
            app.answerPending('--void--')
        }, 100);
    }
    // sidebar
    i['private.sidebar.switch-menu'] = function ({selectedMenu}) {
        console.log('switch menu!!')
        app.$store.commit('app/stateController', {
            key: 'active-sidebar-item',
            value: selectedMenu
        })
        app.answerPending('--done--')
    }
    // pane system
    i['private.syspane.add'] = function ({paneIndex, payload}) {
        app.$store.commit('paneAdd', {
            paneIndex: paneIndex,
            payload
        })
        app.answerPending('--done--')
    }
    i['private.syspane.delete'] = function ({paneIndexOrigin}) {
        app.$store.commit('paneDelete', {
            paneIndexOrigin: paneIndexOrigin
        })
        app.answerPending('--done--')
    }
    i['private.syspane.update-data'] = function ({paneIndex,paneData}) {
        app.$store.commit('paneUpdateData', {
            paneIndex: paneIndex,
            paneData: paneData
        })
        app.answerPending('--done--')
    }
    i['private.syspane.update-view'] = function ({paneIndex,paneView}) {
        app.$store.commit('paneUpdateData', {
            paneIndex: paneIndex,
            paneView: paneView
        })
        app.answerPending('--done--')
    }


    return i[`private.${method}`]
}