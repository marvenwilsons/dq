import sysvoid from '@/apps/compiledTask/sysvoid'
import sysutil from '@/apps/compiledTask/sysutil'
import syspane from '@/apps/compiledTask/syspane'
import templates from './templates'
import procedures from './procedures'
import utils from './utils'

export default {
    data: () => ({
        h: undefined,
        componentConfig: null
    }),
    mounted() {
        this.$p = this.h
    },
    methods: {
        /** sys utils */
        systemError(msg) {
            setTimeout(() => {
                this.runCompiledTask([
                    new templates.TaskItem('sysmodal.logerr', {
                        msg
                    }),
                    new templates.TaskItem('sysmodal.close-modal', {}),
                    new templates.TaskItem('exec', function() {
                        window.location.reload()
                    }),
                    new templates.TaskItem('done', {})
                ])
            }, 300);
        },
        m() {
            return this
        },
        cp: utils.copy,
        pipe: utils.pipe,
        validateString:utils.validateString,
        answerPending(answer,pointer) {
            // console.log('> Answering pending question')
            if(answer && answer != '--void--') {
                this.h.$store.commit('stateController', {
                    key: 'queueCurrentTaskAnswer',
                    value: answer
                })

            }

            this.h.$store.commit('updateQueueAnswers', {
                index: this.h.$store.state.queuePointer,
                answer: '--done--',
                pointer
            })
        },
        runCompiledTask(taskArray) {
            /********************************************************************
             * push procedures to queue together with its function dependecies
             * the first item in taskArray is the item that needs to be completed
             * the sencond item to the last are the functions that executes for the
             * purpose of completing the first item in the taskArray.
             * ****************************************************************** 
             */
            let x = []
            let queueAnswersArray = []
            taskArray.map((e,i) => {
                queueAnswersArray.push({
                    answer: '--not answered--'
                })
                if(e) {
                    /*** type 1 is an object that tells what function to execute */
                    // const taskBeingCalled = e.taskName == 'exec' ? true : this[`private.${e.taskName}`]
                    const taskBeingCalled = e.taskName == 'exec' ? true : procedures(this,e.taskName)
                    if(taskBeingCalled == undefined) {
                        new templates.DonqueDevError(`ERR: "${e.taskName}" function or task does not exist`)
                    } else {
                        if(e.taskParam == undefined || e.taskParam == null) {
                            new templates.DonqueDevError(`ERR: "taskParam" property cannot be undefined of null at index: ${i} task name: ${e.taskName}`)
                        } else {
                            if(e.taskName == 'exec') {
                                x.push(new templates.ExecQueueItem({
                                    fn: taskBeingCalled,
                                    param: e.taskParam,
                                    m: this.m
                                }))
                            } else {
                                x.push(new templates.NormalQueueItem({
                                    fn: taskBeingCalled,
                                    param: e.taskParam
                                }))
                            }                     
                        }
                    }
                }
            })
            this.h.$store.commit('stateController', {
                key: 'queue',
                value: x
            })
            const staticCopy = this.cp(x)
            this.h.$store.commit('stateController', {
                key: 'queueStatic',
                value: Object.freeze(staticCopy)
            })
            this.h.$store.commit('stateController', {
                key: 'queueAnswersArray',
                value: queueAnswersArray
            })
        },
        getCompiledTask(lib,payload){
            
            // console.log('getCompiledTask')
            if(lib.indexOf('.') != -1) {
                const namespace = lib.split('.')[0]
                const method = lib.split('.')[1]
                // sysvoid <-- methods that does not require any initial input for this compiled task to run
                if(namespace == 'sysvoid') {
                    return sysvoid[method]
                }
                // sysutil, log, log-err, log-info
                else if(namespace == 'sysutil') {
                    return sysutil[method]
                }
                // syspane, managing pane sysytem
                else if(namespace == 'syspane') {
                    return syspane[method]
                }else {
                    alert(`Err: invalid namespace ${namespace}`)
                    location.reload()
                }
            } else {
                alert(`Err: Invalid task name ${lib}`)
                location.reload()
            }
        },
        covertToPaneView(n){
            n = n.toLowerCase()
            n = `p-${n}`
            return n
        },
        paneSettings({paneName,paneWidth,isClosable}) {
            if(paneName) {
                this.$store.commit('paneController',{
                    index: this.paneIndex,
                    key: 'paneName',
                    value: paneName
                })
            } 
            
            if(paneWidth) {
                this.$store.commit('paneController',{
                    index: this.paneIndex,
                    key: 'paneWidth',
                    value: paneWidth
                })
            }
            
            if(isClosable) {
                this.$store.commit('paneController',{
                    index: this.paneIndex,
                    key: 'isClosable',
                    value: isClosable
                })
            }
        },
        normyDep(paneIndex,scope) {
            return ((s) => {
                const modalMethods = {
                    closePaneModal: () =>  s.closePaneModal(paneIndex),
                    appendErrorMsg: msg => s.appendErrorMsg(paneIndex,msg),
                    appendInfoMsg:  msg => s.appendInfoMsg(paneIndex,msg),
                    logError:       (msg,fn) => s.paneLogError(paneIndex,msg,fn),
                    logInfo:        (msg,fn) => s.paneLogInfo(paneIndex,msg,fn),
                    logWarn:        (msg,fn) => s.paneLogWarn(paneIndex,msg,fn),
                    updateProps:    ({key,value}) => s.updateProps(paneIndex,{key,value}),
                }
                const paneMethods = {
                    closePane:      () => s.closePane,
                    closeUnUsedPane: () => s.closeUnUsedPane(paneIndex + 1),
                    changePaneView: viewIndex => s.changePaneView({paneIndex,viewIndex}),
                    render:         (data,viewIndex) => s.render(data,paneIndex,viewIndex),
                    spawnModal: modalObject => s.spawnModal(paneIndex,modalObject),
                    prompt: (promptObject,cb) => s.panePrompt(paneIndex,promptObject,cb)
                }
                const dWinMethods = {
                    // TODO
                }
                return { paneMethods, modalMethods, dWinMethods }
            })(scope)
        },
        renderPane(data, paneIndex,viewIndex) {
            // console.log('renderPane', data)
            if(paneIndex == undefined || paneIndex == null) {
                console.error('renderPane error, paneIndex cannot be undefined')
                return
            }

            // console.log('helper',paneIndex, this.$store.state.pane.length - 1)
            if(this.$store.state.pane[paneIndex + 1] == undefined) {
                /** it means add one pane */
                this.runCompiledTask([
                    new templates.TaskItem('insertCompiledTask',{
                        compiledTask: this.getCompiledTask('syspane.add-pane'),
                        payload: {
                            data
                        }
                    }),
                    new templates.TaskItem('done',{})
                ])
            } else {
                /** it means update the paneData? or replace the pane with a new view  */
                if(paneIndex + 1 == this.$store.state.pane.length - 1) {
                    this.runCompiledTask([
                        new templates.TaskItem('syspane.update-pane', {
                            paneIndex: paneIndex + 1,
                            payload: this.getServiceView(data.paneConfig.paneData,viewIndex)
                        }),
                        new templates.TaskItem('done',{})
                    ])
                    const {paneMethods,modalMethods} =  this.normyDep(paneIndex + 1,this)
                    this.$store.state.pane[paneIndex].paneConfig.paneOnLoad(paneMethods,modalMethods)

                } else {
                    this.runCompiledTask([
                        new templates.TaskItem('syspane.delete', {
                            paneIndexOrigin: paneIndex + 1
                        }),
                        new templates.TaskItem('syspane.add', {
                            payload: data
                        }),
                        new templates.TaskItem('done',{})
                    ])
                    const {paneMethods,modalMethods} =  this.normyDep(paneIndex + 1,this)
                    this.$store.state.pane[paneIndex].paneConfig.paneOnLoad(paneMethods,modalMethods)
                }
                
            }
            
        },
        getServiceView(dataSet,viewIndex){
            // console.log('> Getting service view ', dataSet)
            // returns a service objects
            const {views} = this.$store.state.app['app-services'][this.$store.state.app['active-sidebar-item']]
            const deserializeViews = new Function('return ' + views)()
            const helper = {  /** this for global access, if you use this, you have to provide a paneIndex, or if not all panes will be affected */
                runCompiledTask : this.runCompiledTask,
                getCompiledTask : this.getCompiledTask,
                paneSettings: this.paneSettings,
                paneModal : this.paneModal,
                renderPane : this.renderPane,
                getServiceView: this.getServiceView,
                closePane: this.closePane,
                render: this.render,
                systemError: this.systemError,
                closeUnUsedPane: this.closeUnUsedPane,
                panePrompt: this.panePrompt,
            }
            
            // dependency enject the views function
            const serviceObject = deserializeViews(dataSet,helper,utils,templates)

            if(!serviceObject) {
                this.systemError('getServiceView error: Unhandled dataSet in service views, cannot find a service view, check console log for more details')
            } else {
                // Problem start here, the data will be incorrect starting on a non zero index pane
                const { componentConfig, paneConfig, paneOnLoad, onModalData } = serviceObject
                if(!paneConfig.modal) {
                    paneConfig.modal = {}
                    paneConfig.modal.modalBody = undefined
                    paneConfig.modal.componentConfig = undefined
                    paneConfig.modal.modalConfig = undefined
                    paneConfig.modal.modalErr = undefined
                    paneConfig.modal.modalInfo = undefined
                    paneConfig.modal.isClosable = false
                    paneConfig.modal.modalWidth = undefined
                }
                paneConfig.modal.onModalData = onModalData
                paneConfig.paneOnLoad = paneOnLoad

                if(typeof viewIndex == 'number') {
                    if(paneConfig.paneViews[viewIndex] == undefined) {
                        this.systemError(`System Error: Invalid index value in render method, value: ${viewIndex} \n Cannot set pane view of undefined, reverting to 0 index pane view`)
                    } else {
                        paneConfig.defaultPaneView = viewIndex
                    }
                }
                return { componentConfig, paneConfig }
            }
            
        },
        render(dataSet,paneIndex,viewIndex) {
            this.renderPane(this.getServiceView(dataSet,viewIndex),paneIndex,viewIndex)
        },
        /** TODO doc */
        closePane() {            
            if(this.$store.state.pane.length == 1){
                this.runCompiledTask([
                    new templates.TaskItem('insertCompiledTask', {
                        payload: { 
                            selectedMenu: this.$store.state.app['defualt-active']
                        },
                        compiledTask: this.getCompiledTask('syspane.switch-menu')
                    })
                ])
            } else {
                this.runCompiledTask([
                    new templates.TaskItem('insertCompiledTask', {
                        payload: { 
                            origin: this.paneIndex
                        },
                        compiledTask: this.getCompiledTask('syspane.close-pane')
                    })
                ])
            }
        },
        changePaneView({paneIndex,viewIndex}) {
            this.$store.commit('paneUpdateView', {
                paneIndex,
                viewIndex
            })
        },
        /** TODO doc */
        closePaneModal(paneIndex) {
            this.$store.commit('paneModalUpdate', {
                paneIndex,
                payload: 'closeModal'
            })
        },
        /** TODO doc */
        closeUnUsedPane(paneIndex) {
            this.runCompiledTask([
                new templates.TaskItem('insertCompiledTask', {
                    payload: { 
                        origin: paneIndex
                    },
                    compiledTask: this.getCompiledTask('syspane.close-pane')
                })
            ])
        },
        /** TODO doc */
        appendErrorMsg(paneIndex,msg) {
            this.$store.commit('paneModalUpdate', {
                paneIndex,
                payload: {
                    key: 'modalInfo',
                    value: undefined
                }
            })
            this.$store.commit('paneModalUpdate', {
                paneIndex,
                payload: {
                    key: 'modalErr',
                    value: msg
                }
            })
        },
        /** TODO doc */
        appendInfoMsg(paneIndex,msg) {
            this.$store.commit('paneModalUpdate', {
                paneIndex,
                payload: {
                    key: 'modalErr',
                    value: undefined
                }
            })
            this.$store.commit('paneModalUpdate', {
                paneIndex,
                payload: {
                    key: 'modalInfo',
                    value: msg
                }
            })
        },
        /** TODO doc */
        updateProps(paneIndex, payload) {
            this.$store.commit('paneModalUpdate', {
                paneIndex,
                payload
            })
        },
        /** TODO doc */
        spawnModal(paneIndex,modalObject) {
            // call templates here
            try {
                this.closePaneModal(paneIndex)
                this.$store.commit('paneModalOverwrite', {
                    paneIndex,
                    modalObject: new templates.paneModal(modalObject)
                })
            }catch(err) {
                this.systemError(`activaPaneModal ERR \n ${err}`)
            }
        },
        /** Spawns an error pane modal, this is a non queue function */
        paneLogError(paneIndex,msg, fn) {
            this.closePaneModal(paneIndex)
            this.$store.commit('paneModalOverwrite', {
                paneIndex,
                modalObject: new templates.paneModal({
                    modalBody: 'logErr',
                    modalHeader: 'Error!',
                    isClosable: true,
                    modalConfig: {
                        msg,
                        fn: fn ? fn : function() {}
                    }
                })
            })
        },
        /** Spawns an info pane modal, this is a non queue function */
        paneLogInfo(paneIndex,msg, fn) {
            this.closePaneModal(paneIndex)
            this.$store.commit('paneModalOverwrite', {
                paneIndex,
                modalObject: new templates.paneModal({
                    modalBody: 'logInfo',
                    modalHeader: 'Info!',
                    isClosable: true,
                    modalConfig: {
                        msg,
                        fn: fn ? fn : function() {}
                    }
                })
            })
        },
        /** Spawns a warning pane modal, this is a non queue function */
        paneLogWarn(paneIndex,msg, fn) {
            this.closePaneModal(paneIndex)
            this.$store.commit('paneModalOverwrite', {
                paneIndex,
                modalObject: new templates.paneModal({
                    modalBody: 'logWarn',
                    modalHeader: 'Warning!',
                    isClosable: true,
                    modalConfig: {
                        msg,
                        fn: fn ? fn : function() {}
                    }
                })
            })
        },
        panePrompt(paneIndex,promptObject,fn) {
            const types = ['string','number','select','multiselect','range', 'password']
            if(promptObject != undefined) {
                if(types.indexOf(promptObject.type) != -1) {
                    // string
                    if(promptObject.type === 'string') {
                        if(typeof promptObject.value == 'string' || promptObject.value == null || promptObject.value == undefined) {
                            if(promptObject.value == null || promptObject.value == undefined) {
                                if(promptObject.defaultValue == null){
                                    this.systemError(`panePrompt Error: in second argument defualtValue property and value property cannot be undefined at the same time`)
                                } else {
                                    if(typeof promptObject.defaultValue != 'string') {
                                        this.systemError(`panePrompt Error: in second argument, Invalid default value type, it should be a string but got a type of ${typeof promptObject.value}`)
                                    }
                                    this.closePaneModal(paneIndex)
                                    this.$store.commit('paneModalOverwrite', {
                                        paneIndex,
                                        modalObject: new templates.paneModal({
                                            modalBody: 'logPrompt',
                                            modalHeader: promptObject.header,
                                            isClosable: true,
                                            modalConfig: {
                                                value: promptObject.value,
                                                fn: fn ? fn : function() {},
                                                type: 'string',
                                                defaultValue: promptObject.defaultValue
                                            }
                                        })
                                    })
                                }
                            }
                        } else {
                            this.systemError(`panePrompt Error: in second argument, Invalid value type, it should be a string but got a type of ${typeof promptObject.value}`)
                        }
    
                    }
                    // number
                    if(promptObject.type === 'number') {
                        this.$store.commit('paneModalOverwrite', {
                            paneIndex,
                            modalObject: new templates.paneModal({
                                modalBody: 'logPrompt',
                                modalHeader: promptObject.header,
                                isClosable: true,
                                modalConfig: {
                                    value: promptObject.value,
                                    fn: fn ? fn : function() {},
                                    type: 'number',
                                    defaultValue: promptObject.defaultValue
                                }
                            })
                        })
                    }
                    // select
                    if(promptObject.type === 'select') {
                        if(promptObject.value != undefined) {
                            if(Array.isArray(promptObject.value) ){
                                this.$store.commit('paneModalOverwrite', {
                                    paneIndex,
                                    modalObject: new templates.paneModal({
                                        modalBody: 'logPrompt',
                                        modalHeader: promptObject.header,
                                        isClosable: true,
                                        modalConfig: {
                                            value: promptObject.value,
                                            fn: fn ? fn : function() {},
                                            type: 'select',
                                            defaultValue: promptObject.defaultValue
                                        }
                                    })
                                })
                            } else {
                                this.systemError(`panePrompt Error: in second argument, Invalid select value type, it should be an array but got a type of ${typeof promptObject.value}`)
                            }
                        } else {
                            this.systemError(`panePrompt Error: in second argument, value cannot be undefined`)
                        }

                    }
                    // multiselect
                    if(promptObject.type === 'multiselect') {
                        this.$store.commit('paneModalOverwrite', {
                            paneIndex,
                            modalObject: new templates.paneModal({
                                modalBody: 'logPrompt',
                                modalHeader: promptObject.header,
                                isClosable: true,
                                modalConfig: {
                                    value: promptObject.value,
                                    fn: fn ? fn : function() {},
                                    type: 'multiselect',
                                    defaultValue: promptObject.defaultValue
                                }
                            })
                        })
                    }
                    // range
                    if(promptObject.type === 'range') {
                        this.$store.commit('paneModalOverwrite', {
                            paneIndex,
                            modalObject: new templates.paneModal({
                                modalBody: 'logPrompt',
                                modalHeader: promptObject.header,
                                isClosable: true,
                                modalConfig: {
                                    value: promptObject.value,
                                    fn: fn ? fn : function() {},
                                    type: 'range'
                                }
                            })
                        })
                    }
                    // password
                    if(promptObject.type === 'password') {
                        this.$store.commit('paneModalOverwrite', {
                            paneIndex,
                            modalObject: new templates.paneModal({
                                modalBody: 'logPrompt',
                                modalHeader: promptObject.header,
                                isClosable: true,
                                modalConfig: {
                                    value: promptObject.value,
                                    fn: fn ? fn : function() {},
                                    type: 'password'
                                }
                            })
                        })
                    }
                } else {
                    this.systemError(`panePrompt Error: in second argument Invalid type: "${promptObject.type}"`)
                }
            } else {
                this.systemError('panePrompt Error: in second argument Invalid promptObject')
            }
        }
    }
}