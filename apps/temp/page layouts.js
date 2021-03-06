const path = require('path')
const Templates = require(path.join(__dirname,'../../server/helper/templates.js'))

module.exports = Templates.Service({
    name: 'Page Layouts',
    initialData: function(sql,fetch) { // on initial load
        // perform get request here
        let pages = []
        pages.push(new Templates.Page({
            pageName: '/',
            admin_id:'test',
            lastModified: 'test 1',
            pageContent: 'none',
            version_id:'000DSFKJHB3J4G5',
            isUndermaintenance: true,
            subPages:[],
            pageId: '22F5E4T2WER'
        }))
        pages.push(new Templates.Page({
            pageName: '/about',
            admin_id:'test',
            lastModified: 'test about',
            pageContent: 'none',
            version_id:'NFGRIUHIERGHG4',
            isUndermaintenance: true,
            subPages:[],
            pageId: '034F4R1H4R1D'
        }))
        pages.push(new Templates.Page({
            pageName: '/teams',
            admin_id:'test',
            lastModified: 'test teams',
            pageContent: 'none',
            version_id:'JGHEKSU45',
            isUndermaintenance: true,
            subPages:[],
            pageId: '3450DS254GW52S'
        }))
        pages.push(new Templates.Page({
            pageName: '/products',
            admin_id:'test',
            lastModified: 'test products',
            pageContent: 'none',
            version_id:'HDGTKBH483',
            isUndermaintenance: true,
            subPages:[
                {
                    pageName: '/mensware',
                    admin_id:'test',
                    lastModified: 'test products',
                    pageContent: 'none',
                    version_id:'HDGTKBH483',
                    isUndermaintenance: true,
                    subPages:[
                        {
                            pageName: '/pants',
                            admin_id:'test',
                            lastModified: 'test products',
                            pageContent: 'none',
                            version_id:'HDGTKBH483',
                            isUndermaintenance: true,
                            subPages:[
                                {
                                    pageName: '/denims',
                                    admin_id:'test',
                                    lastModified: 'test products',
                                    pageContent: 'none',
                                    version_id:'HDGTKBH483',
                                    isUndermaintenance: true,
                                    subPages:[
                                        {
                                            pageName: '/large',
                                            admin_id:'test',
                                            lastModified: 'test products',
                                            pageContent: 'none',
                                            version_id:'HDGTKBH483',
                                            isUndermaintenance: true,
                                            subPages:[
                                                {
                                                    pageName: '/x-large',
                                                    admin_id:'test',
                                                    lastModified: 'test products',
                                                    pageContent: 'none',
                                                    version_id:'HDGTKBH483',
                                                    isUndermaintenance: true,
                                                    subPages:[],
                                                    pageId: '0025WD4R4W'
                                                }
                                            ],
                                            pageId: '0025WD4R4W'
                                        },
                                        {
                                            pageName: '/medium',
                                            admin_id:'test',
                                            lastModified: 'test products',
                                            pageContent: 'none',
                                            version_id:'HDGTKBH483',
                                            isUndermaintenance: true,
                                            subPages:[],
                                            pageId: '0025WD4R4W'
                                        }
                                    ],
                                    pageId: '0025WD4R4W'
                                },
                                {
                                    pageName: '/skinny',
                                    admin_id:'test',
                                    lastModified: 'test products',
                                    pageContent: 'none',
                                    version_id:'HDGTKBH483',
                                    isUndermaintenance: true,
                                    subPages:[],
                                    pageId: '0025WD4R4W'
                                }
                            ],
                            pageId: '0025WD4R4W'
                        },
                        {
                            pageName: '/shirts',
                            admin_id:'test',
                            lastModified: 'test products',
                            pageContent: 'none',
                            version_id:'HDGTKBH483',
                            isUndermaintenance: true,
                            subPages:[],
                            pageId: '0025WD4R4W'
                        }
                    ],
                    pageId: '0025WD4R4W'
                },
                {
                    pageName: '/kidsware',
                    admin_id:'test',
                    lastModified: 'test products',
                    pageContent: 'none',
                    version_id:'HDGTKBH483',
                    isUndermaintenance: true,
                    subPages:[],
                    pageId: '0025WD4R4W'
                },
                {
                    pageName: '/ladysware',
                    admin_id:'test',
                    lastModified: 'test products',
                    pageContent: 'none',
                    version_id:'HDGTKBH483',
                    isUndermaintenance: true,
                    subPages:[],
                    pageId: '0025WD4R4W'
                }
            ],
            pageId: '0025WD4R4W'
        }))
        pages.push(new Templates.Page({
            pageName: '/blog',
            admin_id:'test',
            lastModified: 'test blog',
            pageContent: 'none',
            version_id:'ASDFJHBVJEGT34WEE52',
            isUndermaintenance: true,
            subPages:[],
            pageId: '0382KJVHEW'
        }))
        pages.push(new Templates.Page({
            pageName: '/achivements',
            admin_id:'test',
            lastModified: 'test achivements',
            pageContent: 'none',
            version_id:'POJLK4H562',
            isUndermaintenance: true,
            subPages:[],
            pageId: '000HGJMWKE'
        }))
        pages.push(new Templates.Page({
            pageName: '/my-service-canada-account',
            admin_id:'test',
            lastModified: 'test msca',
            pageContent: 'none',
            version_id:'KJSBD345',
            isUndermaintenance: true,
            subPages:[],
            pageId: '000IISJEWH'
        }))
        return pages
    },
    views: function(data,client,utils,Templates) {
        /** Page list and sub pages */
        if(typeof data === 'object' && Object.keys(data).length == 2 && Object.keys(data)[0] == 'foo') {
            return {
                paneConfig: {
                    paneName: 'test',
                    paneWidth: '550px',
                    isClosable: true,
                    paneViews: ['slide','slide'],
                    defaultPaneView: 0,
                    paneData: data,
                },
                componentConfig: {
                    test: 'test'
                },
                paneOnLoad: function () {

                },
                onEvent(event,syspane,syspanemodal, dwin) {
                    return {
                        openNewPane() {
                            syspane.updatePaneData('my value', 'foo.value')
                        },
                        onDataChange() {
                            if(syspane.getPaneIndex() == 1) {
                                console.log('dataChange', event.context / 2)
                                syspane.updateParentPaneData(event.context)
                            } else if(syspane.getPaneIndex()  > 1 ) {
                                console.log('test')
                            }
                        }
                    }
                }
            }
        }
        if(Array.isArray(data)) {
            return {
                componentConfig: {
                    uniview: {
                        flexDirection: 'col',
                        itemMargin: '20px'
                    },
                    events: ['view page', 'sub page', 'delete page', 'rename', 'edit page'],
                    displayProp: 'pageName',
                    ableToAddItem: true,
                    infoDisplay: ['pageName','lastUpdated','updatedBy']
                },
                paneConfig: {
                    paneName: 'Pages',
                    paneWidth: '550px',
                    isClosable: true,
                    paneViews: ['listify','slide'],
                    defaultPaneView: 0,
                    paneData: data,
                },
                paneOnLoad: function(syspane,syspanemodal, dwin) {
                    if(data.length == 0) {
                        syspane.prompt({
                            type: 'string',
                            header: 'Page Name',
                            info: 'There are no page(s) to display, Create a new page to get started.',
                            isClosable: false,
                        }, (input) => {
                            console.log('input -> ',input)
                        })
                    }
                },
                onModalData: function(modalData,syspane,syspanemodal, dwin) {
                    // modalData is the set of input data from the user
                    if(modalData == undefined) {
                        syspanemodal.appendErrorMsg('Page Name Cannot be undefined')
                    }
                },
                onEvent(event,syspane,syspanemodal, dwin) {
                    return {
                        addNewPage() {
                            syspane.prompt({
                                type: 'string',
                                header: 'Page Name',
                                isClosable: true,
                            }, (input) => {
                                console.log('input -> ',input)
                            })
                        },
                        'view page'() {
                            syspane.render(event.context)
                        },
                        'sub page'() {
                            syspane.render(event.context.subPages)
                        },
                        'delete page'() { 
                            syspanemodal.logError(`Warning! Are you sure you want to delete ${event.context.pageName}`,() => {
                                syspanemodal.close()
                                syspane.closeUnUsedPane(s)
                            })
                        },
                        'edit page'() {
                            syspane.render(event.context.subPages)
                        },
                        rename() {
                            syspane.prompt({
                                type: 'password',
                                value: null,
                                header: 'Enter Password',
                                defaultValue: null,
                                info: 'Enter password',
                                isClosable: true
                            }, (data) => {
                                console.log(data)
                            })
                        },
                        openNewPane() {
                            console.log('open new pane zero pane',event.context)
                            syspane.render(event.context)
                        },
                        onDataChange() {
                            syspane.updateChildPaneData(event.context)
                        }
                    }

                }
            }
        } 
        /** Page Content when user clicks view page */
        if( !Array.isArray(data) && utils.hasSetOfKeys(['pageName','pageId'], data) ) {
            return {
                componentConfig: {
                    msg: 'hello world'
                },
                paneOnLoad: function () {
                    // console.log('> pageContent loaded ',data)
                },
                paneConfig: {
                    paneName: data.pageName,
                    paneWidth: '700px',
                    isClosable: true,
                    paneViews: ['pageContent'],
                    defaultPaneView: 0,
                    paneData: data.item ? data.item : data
                }
            }
        }  
    }
})