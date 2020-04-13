export const state = () => ({
    /** App Admin State */
        'app-admin-name': null,
        'app-name': null,
        'app-admin-resources': null,
        'app-current-view': null,
        'app-current-resource': null,
    /** ----- */
    /** App Side bar state */
        'app-admin-sidebar-items': [
            'Dashboard',
            'Pages',
            'Collections',
            'Files',
            'Office',
            'Marketplace'
        ],
        'active-sidebar-item': null,
    /** ----- */
    systemRoutes: [
        '/dqlogin',
        '/dqadmin',
        '/dqinit',
    ],
})

export const mutations = {
    stateController(state,payload) {
        state[payload.key] = payload.value
    },
}