const path = require('path')
const Templates = require(path.join(__dirname,'../../server/templates.js'))

module.exports = Templates.Service({
    name: 'Pages',
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
        if(Array.isArray(data)) {
            return {
                componentConfig: {
                    dataControllers: [
                        {
                            name: 'view page',
                            handler: function(selected, syspane, syspanemodal, dWinMethods) {
                                syspane.render(selected.item)
                            }
                        },
                        {
                            name: 'sub page',
                            handler: function(selected, syspane, syspanemodal, dWinMethods) {
                                syspane.render(selected.item.subPages)
                            }
                        },
                        {
                            name: 'delete page',
                            handler: function(selected, syspane, syspanemodal, dWinMethods) {
                                // should add modal methods in helper arg
                                syspanemodal.logError(`Warning! Are you sure you want to delete ${selected.item.pageName}`,() => {
                                    syspanemodal.close()
                                    syspane.closeUnUsedPane()
                                })
                            }
                        },
                        {
                            name: 'rename',
                            handler: function({item}, syspane, syspanemodal, dWinMethods) {
                                syspane.prompt({
                                    type: 'password',
                                    value: null,
                                    header: 'Enter Password',
                                    defaultValue: null,
                                    info: 'Enter password'
                                }, (data) => {
                                    console.log(data)
                                })
                            }
                        },
                        {
                            name: 'edit page',
                            handler: function(selected, syspane, syspanemodal, dWinMethods) {
                                syspane.render(selected.item.subPages)
                                dWinMethods.spawn({
                                    section: 'top',
                                    winView: 'raw',
                                    winConfig: {},
                                    viewConfig: {},
                                    data: {
                                        name: 'foo',
                                        age: 30
                                    }
                                })
                            }
                        }
                    ],
                    displayProp: 'pageName',
                    ableToAddItem: true,
                    infoDisplay: ['pageName','lastUpdated','updatedBy']
                },
                paneOnLoad: function(syspane,syspanemodal) {
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
                onModalData: function(modalData,syspane,syspanemodal) {
                    // modalData is the set of input data from the user
                    if(modalData == undefined) {
                        syspanemodal.appendErrorMsg('Page Name Cannot be undefined')
                    }
                },
                paneConfig: {
                    paneName: 'Pages',
                    paneWidth: '550px',
                    isClosable: true,
                    paneViews: ['listify','raw'],
                    defaultPaneView: 0,
                    paneData: data,
                },
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
                    paneViews: ['pageContent','raw'],
                    defaultPaneView: 0,
                    paneData: data.item ? data.item : data
                }
            }
        }  
    }
})